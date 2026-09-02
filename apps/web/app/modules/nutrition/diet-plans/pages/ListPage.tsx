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
  ClipboardList,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Flame,
  Zap,
  Clock,
  Target,
  Users,
  CheckCircle2,
  TrendingUp,
  Droplets,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IDietPlan } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_DIET_PLANS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [plans, setPlans] = useState<IDietPlan[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_diet_plans');
      const customList: IDietPlan[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_DIET_PLANS.map((p) => p.id || p.code || ''));
      const newItems = customList.filter((p) => !defaultIds.has(p.id || p.code || ''));
      return [...newItems, ...DEFAULT_DIET_PLANS];
    } catch {
      return DEFAULT_DIET_PLANS;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [activeBranchId]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_diet_plans');
      const customList: IDietPlan[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/diet-plans', {
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
          const map = new Map<string, IDietPlan>();
          DEFAULT_DIET_PLANS.forEach((p) => map.set(p.id || p.code || '', p));
          serverList.forEach((p: IDietPlan) => map.set(p.id || p.code || (p._id as string) || '', p));
          customList.forEach((p) => map.set(p.id || p.code || '', p));
          setPlans(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IDietPlan>();
      DEFAULT_DIET_PLANS.forEach((p) => map.set(p.id || p.code || '', p));
      customList.forEach((p) => map.set(p.id || p.code || '', p));
      setPlans(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_diet_plans');
      const customList: IDietPlan[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IDietPlan>();
      DEFAULT_DIET_PLANS.forEach((p) => map.set(p.id || p.code || '', p));
      customList.forEach((p) => map.set(p.id || p.code || '', p));
      setPlans(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return p.branchId === 'ALL' || p.branchId === activeBranchId;
  });

  const totalAthletes = filteredPlans.reduce((sum, p) => sum + (p.enrolledAthletesCount || 0), 0);
  const avgAdherence = filteredPlans.length > 0
    ? (filteredPlans.reduce((sum, p) => sum + (p.adherenceRatePercent || 90), 0) / filteredPlans.length).toFixed(1)
    : '94.5';

  const getGoalBadge = (goal: string) => {
    switch (goal) {
      case 'LEAN_BULK':
        return <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">💪 Lean Bulk Hypertrophy</Badge>;
      case 'FAT_LOSS_CUT':
        return <Badge variant="secondary" className="text-amber-600 dark:text-amber-400 text-[10px] font-bold">🔥 Thermogenic Shred</Badge>;
      case 'BODY_RECOMP':
        return <Badge variant="success" className="text-[10px] font-bold">⚡ Metabolic Recomp</Badge>;
      case 'ENDURANCE_FUEL':
        return <Badge variant="outline" className="text-blue-500 border-blue-500/30 text-[10px] font-bold">🏃 Endurance & HYROX</Badge>;
      case 'KETO_SHRED':
        return <Badge variant="outline" className="text-purple-500 border-purple-500/30 text-[10px] font-bold">🥑 Ketogenic Fat Adaptation</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-bold">{goal ? String(goal).replace(/_/g, ' ') : 'Standard'}</Badge>;
    }
  };

  const columns: ColumnDef<IDietPlan>[] = [
    {
      accessorKey: 'code',
      header: 'Plan Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code') || row.original.id}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nutrition Protocol & Lead',
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <div>
            <div
              onClick={() => navigate(`/nutrition/diet-plans/${plan.id || plan._id}`)}
              className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs line-clamp-1"
            >
              {plan.name}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
              <span>{plan.dailyMealsCount || 4} Daily Meals</span>
              <span>•</span>
              <span>Lead: <strong className="text-foreground">{plan.leadNutritionistName}</strong></span>
              <span>•</span>
              <span>{plan.durationWeeks} Weeks</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'goal',
      header: 'Target Goal',
      cell: ({ row }) => getGoalBadge(row.original.goal),
    },
    {
      accessorKey: 'dailyTargetCalories',
      header: 'Daily Macro Budget',
      cell: ({ row }) => {
        const plan = row.original;
        const totalGrams = (plan.proteinGrams || 0) + (plan.carbsGrams || 0) + (plan.fatsGrams || 0) || 1;
        const pPercent = Math.round(((plan.proteinGrams || 0) / totalGrams) * 100);
        const cPercent = Math.round(((plan.carbsGrams || 0) / totalGrams) * 100);
        const fPercent = Math.round(((plan.fatsGrams || 0) / totalGrams) * 100);

        return (
          <div className="space-y-1.5 w-40">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-foreground flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" /> {plan.dailyTargetCalories} kcal
              </span>
              <span className="text-muted-foreground text-[10px]">P:{plan.proteinGrams}g | C:{plan.carbsGrams}g</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex">
              <div className="bg-primary h-full" style={{ width: `${pPercent}%` }} title={`Protein: ${pPercent}%`} />
              <div className="bg-blue-500 h-full" style={{ width: `${cPercent}%` }} title={`Carbs: ${cPercent}%`} />
              <div className="bg-rose-500 h-full" style={{ width: `${fPercent}%` }} title={`Fats: ${fPercent}%`} />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'enrolledAthletesCount',
      header: 'Enrollment & Adherence',
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <div className="space-y-1 w-28">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-foreground flex items-center gap-1">
                <Users className="w-3 h-3 text-muted-foreground" /> {plan.enrolledAthletesCount || 0}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{plan.adherenceRatePercent || 92}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${plan.adherenceRatePercent || 92}%` }}
              />
            </div>
          </div>
        );
      },
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
                  onClick={() => navigate(`/nutrition/diet-plans/${planId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Diet Plan Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/nutrition/diet-plans/${planId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Diet Protocol</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Diet Plans & Macro Protocols"
        subtitle="Goal-oriented periodized nutrition curriculums, daily meal schedules, macro ratio splits, and client adherence telemetry."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPlans}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/nutrition/diet-plans/create')}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Diet Plan</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="ACTIVE DIET PROTOCOLS"
          value={`${filteredPlans.length} Active`}
          change="Real-Time Sync"
          trend="up"
          icon={<Flame className="h-4 w-4 text-amber-500" />}
        />
        <MetricCard
          title="ENROLLED ATHLETES"
          value={`${totalAthletes} Athletes`}
          change="+14% this cycle"
          trend="up"
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="AVG CLIENT ADHERENCE"
          value={`${avgAdherence}%`}
          change="Target Compliant"
          trend="up"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        />
        <MetricCard
          title="HYDRATION STANDARD"
          value="4.0L / Day"
          change="Macro Fuelled"
          trend="up"
          icon={<Zap className="h-4 w-4 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredPlans}
        searchPlaceholder="Search diet plan title, athletic goal, nutritionist..."
      />
    </PageContainer>
  );
};

