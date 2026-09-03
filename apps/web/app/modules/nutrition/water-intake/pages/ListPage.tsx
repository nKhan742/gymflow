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
  Droplets,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWaterIntakeLog } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_WATER_LOGS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [logs, setLogs] = useState<IWaterIntakeLog[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_water_logs');
      const customList: IWaterIntakeLog[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_WATER_LOGS.map((l) => l.id || l.code || ''));
      const newItems = customList.filter((l) => !defaultIds.has(l.id || l.code || ''));
      return [...newItems, ...DEFAULT_WATER_LOGS];
    } catch {
      return DEFAULT_WATER_LOGS;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLogs();
  }, [activeBranchId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_water_logs');
      const customList: IWaterIntakeLog[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/water-intake', {
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
          const map = new Map<string, IWaterIntakeLog>();
          DEFAULT_WATER_LOGS.forEach((l) => map.set(l.id || l.code || '', l));
          serverList.forEach((l: IWaterIntakeLog) => map.set(l.id || l.code || (l._id as string) || '', l));
          customList.forEach((l) => map.set(l.id || l.code || '', l));
          setLogs(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IWaterIntakeLog>();
      DEFAULT_WATER_LOGS.forEach((l) => map.set(l.id || l.code || '', l));
      customList.forEach((l) => map.set(l.id || l.code || '', l));
      setLogs(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_water_logs');
      const customList: IWaterIntakeLog[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IWaterIntakeLog>();
      DEFAULT_WATER_LOGS.forEach((l) => map.set(l.id || l.code || '', l));
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

  const optimalCount = filteredLogs.filter((l) => l.hydrationStatus === 'OPTIMAL_PEAK').length;
  const optimalPercent = filteredLogs.length > 0
    ? Math.round((optimalCount / filteredLogs.length) * 100)
    : 92;

  const totalVolumeLiters = (filteredLogs.reduce((sum, l) => sum + (l.consumedVolumeMl || 0), 0) / 1000).toFixed(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL_PEAK':
        return <Badge variant="success" className="gap-1 text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> Optimal (100% Target)</Badge>;
      case 'ADEQUATE':
        return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px] font-bold">Adequate Fluid</Badge>;
      case 'MILD_DEFICIT':
        return <Badge variant="secondary" className="text-amber-600 dark:text-amber-400 gap-1 text-[10px] font-bold"><AlertTriangle className="w-3 h-3" /> Mild Deficit</Badge>;
      case 'SEVERE_DEHYDRATION':
        return <Badge variant="destructive" className="gap-1 text-[10px] font-bold"><AlertTriangle className="w-3 h-3" /> Severe Dehydration</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-bold">{status ? String(status).replace(/_/g, ' ') : 'Tracked'}</Badge>;
    }
  };

  const columns: ColumnDef<IWaterIntakeLog>[] = [
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
                onClick={() => navigate(`/nutrition/water-intake/${log.id || log._id}`)}
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
      accessorKey: 'hydrationStatus',
      header: 'Hydration Status',
      cell: ({ row }) => getStatusBadge(row.original.hydrationStatus),
    },
    {
      accessorKey: 'consumedVolumeMl',
      header: 'Daily Volume Progress',
      cell: ({ row }) => {
        const log = row.original;
        const percent = Math.min(100, Math.round(((log.consumedVolumeMl || 0) / (log.targetVolumeMl || 1)) * 100));
        const cLiters = ((log.consumedVolumeMl || 0) / 1000).toFixed(1);
        const tLiters = ((log.targetVolumeMl || 1) / 1000).toFixed(1);

        return (
          <div className="space-y-1 w-36">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <Droplets className="w-3 h-3" /> {cLiters}L / {tLiters}L
              </span>
              <span className="text-muted-foreground">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${percent >= 90 ? 'bg-cyan-500' : 'bg-amber-500'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'electrolyteScorePercent',
      header: 'Electrolyte Balance',
      cell: ({ row }) => {
        const score = row.original.electrolyteScorePercent || 90;
        return (
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-foreground">{score}%</span>
              <span className="text-[10px] text-muted-foreground block">Na / K / Mg</span>
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
          {row.getValue('branchName') || 'Main Facility'}
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
                  onClick={() => navigate(`/nutrition/water-intake/${logId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Hydration Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/nutrition/water-intake/${logId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Water Diary</span>
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
        title="Hydration & Water Intake"
        subtitle="Daily fluid replenishment tracking, electrolyte balance scoring, and sweat loss hydration monitoring."
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
              onClick={() => navigate('/nutrition/water-intake/create')}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Water Intake</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="TOTAL FLUID TRACKED"
          value={`${totalVolumeLiters} Liters`}
          change="Across Active Roster"
          trend="up"
          icon={<Droplets className="h-4 w-4 text-cyan-500" />}
        />
        <MetricCard
          title="OPTIMAL HYDRATION"
          value={`${optimalPercent}%`}
          change="Target Met (≥90%)"
          trend="up"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        />
        <MetricCard
          title="ELECTROLYTE FORTIFIED"
          value="98.2%"
          change="Na+ K+ Mg2+ Stable"
          trend="up"
          icon={<ShieldCheck className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="SWEAT REPLENISHMENT"
          value="1.6L / Workout"
          change="Post-Lift Protocol"
          trend="up"
          icon={<Zap className="h-4 w-4 text-amber-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredLogs}
        loading={loading}
        searchPlaceholder="Search athlete name, member ID, fluid status..."
      />
    </PageContainer>
  );
};

