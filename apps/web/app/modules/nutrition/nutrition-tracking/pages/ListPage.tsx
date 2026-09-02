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
  Flame,
  Zap,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { INutritionLog } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_NUTRITION_LOGS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [logs, setLogs] = useState<INutritionLog[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_nutrition_logs');
      const customList: INutritionLog[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_NUTRITION_LOGS.map((l) => l.id || l.code || ''));
      const newItems = customList.filter((l) => !defaultIds.has(l.id || l.code || ''));
      return [...newItems, ...DEFAULT_NUTRITION_LOGS];
    } catch {
      return DEFAULT_NUTRITION_LOGS;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [activeBranchId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_nutrition_logs');
      const customList: INutritionLog[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/nutrition-tracking', {
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
          const map = new Map<string, INutritionLog>();
          DEFAULT_NUTRITION_LOGS.forEach((l) => map.set(l.id || l.code || '', l));
          serverList.forEach((l: INutritionLog) => map.set(l.id || l.code || (l._id as string) || '', l));
          customList.forEach((l) => map.set(l.id || l.code || '', l));
          setLogs(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, INutritionLog>();
      DEFAULT_NUTRITION_LOGS.forEach((l) => map.set(l.id || l.code || '', l));
      customList.forEach((l) => map.set(l.id || l.code || '', l));
      setLogs(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_nutrition_logs');
      const customList: INutritionLog[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, INutritionLog>();
      DEFAULT_NUTRITION_LOGS.forEach((l) => map.set(l.id || l.code || '', l));
      customList.forEach((l) => map.set(l.id || l.code || '', l));
      setLogs(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return l.branchId === 'ALL' || l.branchId === activeBranchId;
  });

  const optimalCount = filteredLogs.filter((l) => l.adherenceStatus === 'OPTIMAL_ON_TRACK').length;
  const optimalPercent = filteredLogs.length > 0
    ? Math.round((optimalCount / filteredLogs.length) * 100)
    : 95;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL_ON_TRACK':
        return <Badge variant="success" className="gap-1 text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> Target Hit (Optimal)</Badge>;
      case 'PROTEIN_DEFICIT':
        return <Badge variant="destructive" className="gap-1 text-[10px] font-bold"><AlertCircle className="w-3 h-3" /> Protein Deficit</Badge>;
      case 'CALORIE_SURPLUS':
        return <Badge variant="secondary" className="gap-1 text-amber-600 dark:text-amber-400 text-[10px] font-bold"><TrendingUp className="w-3 h-3" /> Calorie Surplus</Badge>;
      case 'CALORIE_DEFICIT':
        return <Badge variant="outline" className="gap-1 text-blue-500 border-blue-500/30 text-[10px] font-bold"><Flame className="w-3 h-3" /> Deficit</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-bold">{status ? String(status).replace(/_/g, ' ') : 'Logged'}</Badge>;
    }
  };

  const columns: ColumnDef<INutritionLog>[] = [
    {
      accessorKey: 'memberName',
      header: 'Athlete & Member',
      cell: ({ row }) => {
        const log = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={log.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={log.memberName}
              className="w-9 h-9 rounded-full object-cover border border-border/80 shrink-0"
            />
            <div>
              <div
                onClick={() => navigate(`/nutrition/nutrition-tracking/${log.id || log._id}`)}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
              >
                {log.memberName}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                {log.memberId} • {log.logDate}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'adherenceStatus',
      header: 'Adherence Status',
      cell: ({ row }) => getStatusBadge(row.original.adherenceStatus),
    },
    {
      accessorKey: 'consumedCalories',
      header: 'Calorie Budget Meter',
      cell: ({ row }) => {
        const log = row.original;
        const percent = Math.min(100, Math.round(((log.consumedCalories || 0) / (log.targetCalories || 1)) * 100));
        return (
          <div className="space-y-1 w-36">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-foreground">{log.consumedCalories} / {log.targetCalories}</span>
              <span className="text-muted-foreground">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${percent >= 90 && percent <= 105 ? 'bg-emerald-500' : percent > 105 ? 'bg-amber-500' : 'bg-primary'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'consumedProteinGrams',
      header: 'Protein Synthesis',
      cell: ({ row }) => {
        const log = row.original;
        const percent = Math.min(100, Math.round(((log.consumedProteinGrams || 0) / (log.targetProteinGrams || 1)) * 100));
        return (
          <div className="space-y-1 w-32">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-primary">{log.consumedProteinGrams}g / {log.targetProteinGrams}g</span>
              <span className="text-muted-foreground">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reviewedByCoachName',
      header: 'Coach Review',
      cell: ({ row }) => {
        const coach = row.original.reviewedByCoachName;
        return coach ? (
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate max-w-[130px]">{coach}</span>
          </div>
        ) : (
          <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
            Review Pending
          </Badge>
        );
      },
    },
    {
      accessorKey: 'branchName',
      header: 'Branch Scope',
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1 text-[11px] font-medium border-border/80">
          <Building2 className="w-3 h-3 text-muted-foreground" />
          {row.getValue('branchName') || 'PD Vihar'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const logId = row.original.id || row.original._id;
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
                  onClick={() => navigate(`/nutrition/nutrition-tracking/${logId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Food Journal</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/nutrition/nutrition-tracking/${logId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Update Daily Log</span>
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
        title="Nutrition & Macro Tracking"
        subtitle="Daily member dietary journals, real-time macro compliance scoring, and clinical coach review audits."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/nutrition/nutrition-tracking/create')}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Daily Food Diary</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="LOGS SUBMITTED TODAY"
          value={`${filteredLogs.length} Diaries`}
          change="Real-Time Sync"
          trend="up"
          icon={<Activity className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="OPTIMAL COMPLIANCE"
          value={`${optimalPercent}%`}
          change="Target Kcal & Protein"
          trend="up"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        />
        <MetricCard
          title="COACH REVIEWS"
          value="100% Audited"
          change="Feedback Issued"
          trend="up"
          icon={<UserCheck className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="AVG HYDRATION"
          value="3.8L / Day"
          change="Optimal Balance"
          trend="up"
          icon={<Zap className="h-4 w-4 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredLogs}
        searchPlaceholder="Search athlete name, member ID, dietary status..."
      />
    </PageContainer>
  );
};

