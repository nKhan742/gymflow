import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Dumbbell,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Layers,
  Activity,
  Flame,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IExercise } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_EXERCISES: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [exercises, setExercises] = useState<IExercise[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_exercises');
      const customList: IExercise[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_EXERCISES.map((e) => e.id || e.code));
      const newItems = customList.filter((e) => !defaultIds.has(e.id || e.code));
      return [...newItems, ...DEFAULT_EXERCISES];
    } catch {
      return DEFAULT_EXERCISES;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchExercises();
  }, [activeBranchId]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_exercises');
      const customList: IExercise[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-library', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const serverList = (json.success && Array.isArray(json.data) && json.data.length > 0)
          ? json.data
          : (json.data?.items?.length > 0 ? json.data.items : []);

        if (serverList.length > 0) {
          const map = new Map<string, IExercise>();
          DEFAULT_EXERCISES.forEach((e) => map.set(e.id || e.code, e));
          serverList.forEach((e: IExercise) => map.set(e.id || e.code || (e._id as string), e));
          customList.forEach((e) => map.set(e.id || e.code, e));
          setExercises(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IExercise>();
      DEFAULT_EXERCISES.forEach((e) => map.set(e.id || e.code, e));
      customList.forEach((e) => map.set(e.id || e.code, e));
      setExercises(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_exercises');
      const customList: IExercise[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IExercise>();
      DEFAULT_EXERCISES.forEach((e) => map.set(e.id || e.code, e));
      customList.forEach((e) => map.set(e.id || e.code, e));
      setExercises(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((e) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return e.branchId === 'ALL' || e.branchId === activeBranchId;
  });

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return <Badge variant="success" className="text-[10px] font-semibold">Beginner</Badge>;
      case 'INTERMEDIATE':
        return <Badge variant="info" className="text-[10px] font-semibold">Intermediate</Badge>;
      case 'ADVANCED':
        return <Badge variant="warning" className="text-[10px] font-semibold">Advanced</Badge>;
      case 'ELITE':
        return <Badge variant="destructive" className="text-[10px] font-semibold">Elite Pro</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] font-semibold">{level}</Badge>;
    }
  };

  const columns: ColumnDef<IExercise>[] = [
    {
      accessorKey: 'code',
      header: 'Exercise ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Exercise Name & Visual',
      cell: ({ row }) => {
        const exe = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={exe.thumbnailUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&auto=format&fit=crop&q=80'}
              alt={exe.name}
              className="w-10 h-10 rounded-xl object-cover border border-border/80 shrink-0 bg-muted"
            />
            <div>
              <div
                onClick={() => navigate(`/fitness/exercise-library/${exe.id || exe._id}`)}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
              >
                {exe.name}
              </div>
              <div className="text-[11px] text-muted-foreground">{exe.category}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'primaryMuscle',
      header: 'Target Muscle',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-foreground">{row.original.primaryMuscle}</div>
          <div className="text-[10px] text-muted-foreground line-clamp-1">
            {row.original.secondaryMuscles?.join(', ') || 'Direct Isolation'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'mechanics',
      header: 'Mechanics',
      cell: ({ row }) => {
        const isCompound = row.original.mechanics === 'COMPOUND';
        return (
          <Badge variant={isCompound ? 'default' : 'outline'} className="text-[10px] font-semibold">
            {isCompound ? '⚡ Compound' : '🎯 Isolation'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'equipment',
      header: 'Equipment',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded">
          {row.original.equipment}
        </span>
      ),
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => getDifficultyBadge(row.original.difficulty),
    },
    {
      accessorKey: 'branchName',
      header: 'Branch Scope',
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1 text-[11px] font-medium border-border/80">
          <Building2 className="w-3 h-3 text-muted-foreground" />
          {row.getValue('branchName') || 'All Locations'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={status === 'active' ? 'success' : 'secondary'} className="capitalize text-[11px]">
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const exeId = row.original.id || row.original._id;
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/exercise-library/${exeId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Exercise Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/exercise-library/${exeId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Exercise</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalExercises = filteredExercises.length;
  const compoundLifts = filteredExercises.filter((e) => e.mechanics === 'COMPOUND').length;
  const isolationMoves = filteredExercises.filter((e) => e.mechanics === 'ISOLATION').length;
  const advancedMoves = filteredExercises.filter((e) => e.difficulty === 'ADVANCED' || e.difficulty === 'ELITE').length;

  return (
    <PageContainer>
      <PageHeader
        title="Exercise Library"
        subtitle="240+ verified strength, conditioning, hypertrophy, and functional exercises with video cues and biomechanical analysis."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchExercises}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/exercise-library/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add Exercise</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cataloged Exercises"
          value={`${totalExercises} Verified`}
          change="Video & Cues Active"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Dumbbell className="h-5 w-5" />}
        />
        <MetricCard
          title="Compound Lifts"
          value={`${compoundLifts} Multi-Joint`}
          change="1RM Metric Ready"
          trend="up"
          timeframe="Squat/Bench/Deadlift"
          icon={<Flame className="h-5 w-5" />}
        />
        <MetricCard
          title="Isolation Moves"
          value={`${isolationMoves} Single-Joint`}
          change="Hypertrophy Focus"
          trend="neutral"
          timeframe="Dumbbell & Cables"
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Advanced Protocols"
          value={`${advancedMoves} Expert Moves`}
          change="Coach Supervised"
          trend="neutral"
          timeframe="Olympic & Power"
          icon={<Zap className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredExercises}
        loading={loading}
        searchKey="name"
        searchPlaceholder="Search exercises, target muscles, mechanics, or equipment..."
      />
    </PageContainer>
  );
};
