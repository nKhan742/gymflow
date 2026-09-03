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
  Calendar,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Users,
  Dumbbell,
  Flame,
  Zap,
  Target,
  Trophy,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWorkoutPlan } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_WORKOUT_PLANS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [plans, setPlans] = useState<IWorkoutPlan[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_workout_plans');
      const customList: IWorkoutPlan[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_WORKOUT_PLANS.map((p) => p.id || p.code));
      const newItems = customList.filter((p) => !defaultIds.has(p.id || p.code));
      return [...newItems, ...DEFAULT_WORKOUT_PLANS];
    } catch {
      return DEFAULT_WORKOUT_PLANS;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPlans();
  }, [activeBranchId]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_workout_plans');
      const customList: IWorkoutPlan[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-plans', {
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
          const map = new Map<string, IWorkoutPlan>();
          DEFAULT_WORKOUT_PLANS.forEach((p) => map.set(p.id || p.code, p));
          serverList.forEach((p: IWorkoutPlan) => map.set(p.id || p.code || (p._id as string), p));
          customList.forEach((p) => map.set(p.id || p.code, p));
          setPlans(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IWorkoutPlan>();
      DEFAULT_WORKOUT_PLANS.forEach((p) => map.set(p.id || p.code, p));
      customList.forEach((p) => map.set(p.id || p.code, p));
      setPlans(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_workout_plans');
      const customList: IWorkoutPlan[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IWorkoutPlan>();
      DEFAULT_WORKOUT_PLANS.forEach((p) => map.set(p.id || p.code, p));
      customList.forEach((p) => map.set(p.id || p.code, p));
      setPlans(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return p.branchId === 'ALL' || p.branchId === activeBranchId;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'BODYBUILDING':
        return <Badge variant="info" className="text-[10px] font-semibold">Bodybuilding</Badge>;
      case 'POWERLIFTING':
        return <Badge variant="default" className="text-[10px] font-semibold">Powerlifting</Badge>;
      case 'FAT_LOSS':
        return <Badge variant="destructive" className="text-[10px] font-semibold">Fat Shred</Badge>;
      case 'BOXING_CONDITIONING':
        return <Badge variant="warning" className="text-[10px] font-semibold">Combat Conditioning</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] font-semibold">{category}</Badge>;
    }
  };

  const columns: ColumnDef<IWorkoutPlan>[] = [
    {
      accessorKey: 'code',
      header: 'Plan Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Program Plan Title & Coach',
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <div className="space-y-0.5">
            <div
              onClick={() => navigate(`/fitness/workout-plans/${plan.id || plan._id}`)}
              className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
            >
              {plan.name}
            </div>
            <div className="text-[11px] text-muted-foreground">
              By Coach <strong className="text-foreground">{plan.authorCoachName || 'Head Trainer'}</strong>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Program Focus',
      cell: ({ row }) => getCategoryBadge(row.original.category),
    },
    {
      accessorKey: 'durationWeeks',
      header: 'Duration',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-mono text-xs font-bold text-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          {row.original.durationWeeks} Weeks
        </div>
      ),
    },
    {
      accessorKey: 'frequencyDaysPerWeek',
      header: 'Frequency',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.frequencyDaysPerWeek} Days / Wk
        </span>
      ),
    },
    {
      accessorKey: 'enrolledAthletesCount',
      header: 'Active Athletes',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-mono text-xs font-bold text-primary">
          <Users className="w-3.5 h-3.5" />
          {row.original.enrolledAthletesCount} Enrolled
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
        const planId = row.original.id || row.original._id;
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
                  onClick={() => navigate(`/fitness/workout-plans/${planId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Plan Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/workout-plans/${planId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Plan</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalPlans = filteredPlans.length;
  const totalEnrolled = filteredPlans.reduce((acc, p) => acc + (p.enrolledAthletesCount || 0), 0);
  const avgWeeks = Math.round(
    filteredPlans.reduce((acc, p) => acc + (p.durationWeeks || 8), 0) / (totalPlans || 1)
  );

  return (
    <PageContainer>
      <PageHeader
        title="Workout Plans"
        subtitle="Multi-week periodization programs, progressive overload phases, and structured member training paths."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchPlans}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/workout-plans/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add Plan</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Periodized Plans"
          value={`${totalPlans} Programs`}
          change="Master Catalog"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          title="Enrolled Athletes"
          value={`${totalEnrolled} Active`}
          change="Adherence 91.4%"
          trend="up"
          timeframe="Across All Plans"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Program Length"
          value={`${avgWeeks} Weeks`}
          change="Periodized Phases"
          trend="neutral"
          timeframe="Per Protocol"
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          title="Top Program Rating"
          value="4.9 / 5.0 ★"
          change="12-Wk Lean Bulk"
          trend="up"
          timeframe="Member Reviews"
          icon={<Trophy className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredPlans}
        loading={loading}
        searchKey="name"
        searchPlaceholder="Search workout plans, categories, coaches..."
      />
    </PageContainer>
  );
};
