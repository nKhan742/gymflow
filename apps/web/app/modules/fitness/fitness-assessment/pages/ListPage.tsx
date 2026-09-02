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
  Activity,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  HeartPulse,
  Flame,
  Zap,
  TrendingDown,
  Trophy,
  Scale,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IFitnessAssessment } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_ASSESSMENTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [assessments, setAssessments] = useState<IFitnessAssessment[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_fitness_assessments');
      const customList: IFitnessAssessment[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_ASSESSMENTS.map((a) => a.id || a.assessmentCode));
      const newItems = customList.filter((a) => !defaultIds.has(a.id || a.assessmentCode));
      return [...newItems, ...DEFAULT_ASSESSMENTS];
    } catch {
      return DEFAULT_ASSESSMENTS;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, [activeBranchId]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_fitness_assessments');
      const customList: IFitnessAssessment[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/fitness-assessment', {
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
          const map = new Map<string, IFitnessAssessment>();
          DEFAULT_ASSESSMENTS.forEach((a) => map.set(a.id || a.assessmentCode, a));
          serverList.forEach((a: IFitnessAssessment) => map.set(a.id || a.assessmentCode || (a._id as string), a));
          customList.forEach((a) => map.set(a.id || a.assessmentCode, a));
          setAssessments(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IFitnessAssessment>();
      DEFAULT_ASSESSMENTS.forEach((a) => map.set(a.id || a.assessmentCode, a));
      customList.forEach((a) => map.set(a.id || a.assessmentCode, a));
      setAssessments(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_fitness_assessments');
      const customList: IFitnessAssessment[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IFitnessAssessment>();
      DEFAULT_ASSESSMENTS.forEach((a) => map.set(a.id || a.assessmentCode, a));
      customList.forEach((a) => map.set(a.id || a.assessmentCode, a));
      setAssessments(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter((a) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return a.branchId === 'ALL' || a.branchId === activeBranchId;
  });

  const columns: ColumnDef<IFitnessAssessment>[] = [
    {
      accessorKey: 'assessmentCode',
      header: 'Report ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('assessmentCode')}
        </span>
      ),
    },
    {
      accessorKey: 'memberName',
      header: 'Member / Athlete',
      cell: ({ row }) => {
        const asm = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={asm.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={asm.memberName}
              className="w-8 h-8 rounded-full object-cover border border-border/80 shrink-0 bg-muted"
            />
            <div>
              <div
                onClick={() => navigate(`/fitness/fitness-assessment/${asm.id || asm._id}`)}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
              >
                {asm.memberName}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Assessed by <strong className="text-foreground">{asm.assessorCoachName}</strong>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'weightKg',
      header: 'Body Weight',
      cell: ({ row }) => (
        <div className="font-mono text-xs font-bold text-foreground">
          {row.original.weightKg} kg <span className="text-[10px] text-muted-foreground">({Math.round(row.original.weightKg * 2.20462)} lbs)</span>
        </div>
      ),
    },
    {
      accessorKey: 'bodyFatPercentage',
      header: 'Body Fat %',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-mono text-xs font-bold text-primary">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          {row.original.bodyFatPercentage}% BF
        </div>
      ),
    },
    {
      accessorKey: 'skeletalMuscleMassKg',
      header: 'Muscle Mass',
      cell: ({ row }) => (
        <div className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {row.original.skeletalMuscleMassKg} kg SMM
        </div>
      ),
    },
    {
      accessorKey: 'benchPress1RMKg',
      header: 'Big 3 Strength Total',
      cell: ({ row }) => {
        const asm = row.original;
        const total = (asm.benchPress1RMKg || 0) + (asm.squat1RMKg || 0) + (asm.deadlift1RMKg || 0);
        return (
          <div className="font-mono text-xs font-bold text-foreground">
            {total} kg Total <span className="text-[10px] text-muted-foreground">({Math.round(total * 2.20462)} lbs)</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'assessmentDate',
      header: 'Date',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.assessmentDate}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={status === 'COMPLETED' ? 'success' : 'warning'} className="capitalize text-[11px]">
            {status?.replace('_', ' ') || 'COMPLETED'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const asmId = row.original.id || row.original._id;
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
                  onClick={() => navigate(`/fitness/fitness-assessment/${asmId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° InBody Report</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/fitness-assessment/${asmId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Assessment</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalAssessments = filteredAssessments.length;
  const avgBodyFat = (
    filteredAssessments.reduce((acc, a) => acc + (a.bodyFatPercentage || 18), 0) / (totalAssessments || 1)
  ).toFixed(1);
  const avgMuscle = (
    filteredAssessments.reduce((acc, a) => acc + (a.skeletalMuscleMassKg || 32), 0) / (totalAssessments || 1)
  ).toFixed(1);

  return (
    <PageContainer>
      <PageHeader
        title="Fitness Assessment & InBody Biometrics"
        subtitle="Track member body composition, InBody bioelectrical impedance analysis, 1RM strength tests, and posture screens."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchAssessments}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/fitness-assessment/create')}
            >
              <Plus className="h-4 w-4" />
              <span>New Assessment</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Assessments Conducted"
          value={`${totalAssessments} Screenings`}
          change="MTD Volume"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<HeartPulse className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Body Fat %"
          value={`${avgBodyFat}%`}
          change="-2.4% vs Baseline"
          trend="up"
          timeframe="Active Members"
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Skeletal Muscle"
          value={`${avgMuscle} kg`}
          change="+1.8 lbs Lean Mass"
          trend="up"
          timeframe="Hypertrophy Gains"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Big 3 Testing"
          value="100% Verified"
          change="Coach Supervised"
          trend="neutral"
          timeframe="Safety Standards"
          icon={<Trophy className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredAssessments}
        searchKey="memberName"
        searchPlaceholder="Search member assessments, coaches..."
      />
    </PageContainer>
  );
};
