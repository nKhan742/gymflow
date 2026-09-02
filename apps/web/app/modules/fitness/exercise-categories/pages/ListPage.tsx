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
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IExerciseCategory } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_EXERCISE_CATEGORIES: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [categories, setCategories] = useState<IExerciseCategory[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_exercise_categories');
      const customList: IExerciseCategory[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_EXERCISE_CATEGORIES.map((c) => c.id || c.code));
      const newItems = customList.filter((c) => !defaultIds.has(c.id || c.code));
      return [...newItems, ...DEFAULT_EXERCISE_CATEGORIES];
    } catch {
      return DEFAULT_EXERCISE_CATEGORIES;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [activeBranchId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // 1. Get stored local items
      const stored = localStorage.getItem('gymflow_custom_exercise_categories');
      const customList: IExerciseCategory[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-categories', {
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
          const map = new Map<string, IExerciseCategory>();
          DEFAULT_EXERCISE_CATEGORIES.forEach((c) => map.set(c.id || c.code, c));
          serverList.forEach((c: IExerciseCategory) => map.set(c.id || c.code || (c._id as string), c));
          customList.forEach((c) => map.set(c.id || c.code, c));
          setCategories(Array.from(map.values()));
          return;
        }
      }

      // Fallback merge
      const map = new Map<string, IExerciseCategory>();
      DEFAULT_EXERCISE_CATEGORIES.forEach((c) => map.set(c.id || c.code, c));
      customList.forEach((c) => map.set(c.id || c.code, c));
      setCategories(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_exercise_categories');
      const customList: IExerciseCategory[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IExerciseCategory>();
      DEFAULT_EXERCISE_CATEGORIES.forEach((c) => map.set(c.id || c.code, c));
      customList.forEach((c) => map.set(c.id || c.code, c));
      setCategories(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return c.branchId === 'ALL' || c.branchId === activeBranchId;
  });

  const getMuscleBadge = (group: string) => {
    switch (group) {
      case 'CHEST':
        return <Badge variant="info" className="text-[10px] font-semibold">Chest / Pecs</Badge>;
      case 'BACK':
        return <Badge variant="success" className="text-[10px] font-semibold">Back / Lats</Badge>;
      case 'LEGS':
        return <Badge variant="default" className="text-[10px] font-semibold">Legs / Quads</Badge>;
      case 'SHOULDERS':
        return <Badge variant="warning" className="text-[10px] font-semibold">Shoulders / Delts</Badge>;
      case 'ARMS':
        return <Badge variant="outline" className="text-[10px] font-semibold text-pink-500 border-pink-500/30">Arms</Badge>;
      case 'CARDIO':
        return <Badge variant="destructive" className="text-[10px] font-semibold">Cardio</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] font-semibold">{group}</Badge>;
    }
  };

  const columns: ColumnDef<IExerciseCategory>[] = [
    {
      accessorKey: 'code',
      header: 'Category ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Exercise Category Name',
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs font-bold text-xs"
              style={{ backgroundColor: cat.color || '#3B82F6' }}
            >
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div
                onClick={() => navigate(`/fitness/exercise-categories/${cat.id || cat._id}`)}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
              >
                {cat.name}
              </div>
              <div className="text-[11px] text-muted-foreground line-clamp-1">{cat.description}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'primaryMuscleGroup',
      header: 'Target Anatomy',
      cell: ({ row }) => getMuscleBadge(row.original.primaryMuscleGroup),
    },
    {
      accessorKey: 'movementPattern',
      header: 'Movement Pattern',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded">
          {row.original.movementPattern}
        </span>
      ),
    },
    {
      accessorKey: 'exerciseCount',
      header: 'Exercises Cataloged',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
          <Activity className="w-3.5 h-3.5 text-primary" />
          {row.original.exerciseCount} Moves
        </div>
      ),
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
        const catId = row.original.id || row.original._id;
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
                  onClick={() => navigate(`/fitness/exercise-categories/${catId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Category Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/exercise-categories/${catId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Category</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalCategories = filteredCategories.length;
  const totalExercises = filteredCategories.reduce((acc, c) => acc + (c.exerciseCount || 0), 0);
  const primaryMuscles = Array.from(new Set(filteredCategories.map((c) => c.primaryMuscleGroup))).length;
  const activePatterns = Array.from(new Set(filteredCategories.map((c) => c.movementPattern))).length;

  return (
    <PageContainer>
      <PageHeader
        title="Exercise Categories"
        subtitle="Manage movement taxonomies, biomechanical patterns, muscle group groupings, and library exercise counts."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchCategories}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/exercise-categories/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Exercise Categories"
          value={`${totalCategories} Taxonomies`}
          change="Master Catalog"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Layers className="h-5 w-5" />}
        />
        <MetricCard
          title="Cataloged Movements"
          value={`${totalExercises} Exercises`}
          change="Video & Cues Included"
          trend="up"
          timeframe="Entire Library"
          icon={<Dumbbell className="h-5 w-5" />}
        />
        <MetricCard
          title="Target Muscle Groups"
          value={`${primaryMuscles} Anatomy Zones`}
          change="Full-Body Coverage"
          trend="neutral"
          timeframe="Biomechanics"
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Movement Patterns"
          value={`${activePatterns} Patterns`}
          change="Push, Pull, Squat, Hinge"
          trend="neutral"
          timeframe="Compound Splits"
          icon={<Zap className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredCategories}
        searchKey="name"
        searchPlaceholder="Search categories, target muscles, or patterns..."
      />
    </PageContainer>
  );
};
