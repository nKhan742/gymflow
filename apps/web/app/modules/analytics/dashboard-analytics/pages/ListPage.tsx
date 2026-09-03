import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Activity, DollarSign, CheckCircle2, Eye, Edit, Trash2, Calendar, TrendingUp, Users, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IDashboardMetricSnapshot } from '../types';
import { toast } from 'sonner';

export const DEFAULT_DASHBOARD_SNAPSHOTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { activeBranchId } = useBranchStore();
  const [snapshots, setSnapshots] = useState<IDashboardMetricSnapshot[]>([]);

  useEffect(() => {
    loadSnapshots();
  }, [activeBranchId]);

  const loadSnapshots = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_dashboard_analytics');
      const customList: IDashboardMetricSnapshot[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/analytics/dashboard-analytics', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IDashboardMetricSnapshot[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_DASHBOARD_SNAPSHOTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setSnapshots(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_dashboard_analytics');
      const customList: IDashboardMetricSnapshot[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_DASHBOARD_SNAPSHOTS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setSnapshots(combined);
    }
  };

  const handleDelete = (id: string, title: string) => {
    const updated = snapshots.filter((s) => (s.id || s._id) !== id);
    setSnapshots(updated);

    const stored = localStorage.getItem('gymflow_custom_dashboard_analytics');
    if (stored) {
      const customList: IDashboardMetricSnapshot[] = JSON.parse(stored);
      const filtered = customList.filter((s) => (s.id || s._id) !== id);
      localStorage.setItem('gymflow_custom_dashboard_analytics', JSON.stringify(filtered));
    }

    toast.success(`Dashboard snapshot "${title}" removed`);
  };

  // Telemetry Metrics
  const avgOccupancy = snapshots.length > 0 ? `${Math.round(snapshots.reduce((a, s) => a + (s.networkOccupancyRate || 0), 0) / snapshots.length)}%` : '0%';
  const totalRoster = snapshots.reduce((a, s) => a + (s.activeMembersCount || 0), 0);
  const mrrTotal = `$${snapshots.reduce((a, s) => a + (s.mrrVelocity || 0), 0).toLocaleString()}`;
  const healthTotal = snapshots.length > 0 ? '100%' : '100%';

  const columns: ColumnDef<IDashboardMetricSnapshot>[] = [
    {
      accessorKey: 'snapshotTitle',
      header: 'Snapshot Title & Date',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => navigate(`/analytics/dashboard-analytics/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
            >
              {row.original.snapshotTitle}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Calendar className="h-3 w-3 text-primary" />
              <span>{row.original.dateRecorded} • {row.original.topPerformingBranch}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reportingCadence',
      header: 'Cadence',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-bold">
          {row.original.reportingCadence}
        </Badge>
      ),
    },
    {
      accessorKey: 'networkOccupancyRate',
      header: 'Occupancy %',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.networkOccupancyRate}% Fill
          </span>
          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${row.original.networkOccupancyRate > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, row.original.networkOccupancyRate)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'activeMembersCount',
      header: 'Active Roster & MRR',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.activeMembersCount?.toLocaleString()} Athletes
          </span>
          <span className="text-[9px] text-emerald-600 font-mono font-bold">
            ${row.original.mrrVelocity?.toLocaleString()} MRR Run-Rate
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'systemHealthScore',
      header: 'System Health',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block">
            {row.original.systemHealthScore}% Score
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            {row.original.avgWorkoutDwellMinutes}m avg dwell
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'recordedBy',
      header: 'Analytics Controller',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.controllerAvatar} alt={row.original.recordedBy} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.recordedBy.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.recordedBy}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'ACTIVE_TELEMETRY' ? 'success' : 'secondary'} className="text-[9px] font-bold">
          {row.original.status === 'ACTIVE_TELEMETRY' ? 'LIVE' : row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/analytics/dashboard-analytics/${id}`)}
              title="View Dashboard Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/analytics/dashboard-analytics/${id}/edit`)}
              title="Edit Snapshot"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.snapshotTitle)}
              title="Delete Snapshot"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Executive Dashboard Analytics & Telemetry"
        subtitle="Real-time multi-campus occupancy meters, network MRR velocity run-rates, turnstile throughput, and system health."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Cadence,Date,Occupancy,ActiveMembers,MRRVelocity,AvgDwell,TopCampus,HealthScore,Controller,Status\n' + snapshots.map((s) => `"${s.snapshotTitle}","${s.reportingCadence}","${s.dateRecorded}","${s.networkOccupancyRate}","${s.activeMembersCount}","${s.mrrVelocity}","${s.avgWorkoutDwellMinutes}","${s.topPerformingBranch}","${s.systemHealthScore}","${s.recordedBy}","${s.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dashboard-analytics-telemetry-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Executive dashboard telemetry exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/analytics/dashboard-analytics/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Record Snapshot</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="NETWORK OCCUPANCY"
          value={avgOccupancy}
          change="Across all 4 active clubs"
          trend="up"
          timeframe="Live Campus Load"
          icon={<Gauge className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="TOTAL ACTIVE ATHLETES"
          value={`${totalRoster.toLocaleString()} Enrolled`}
          change="+142 joins this period"
          trend="up"
          timeframe="Network Roster"
          icon={<Users className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="MONTHLY MRR RUN-RATE"
          value={mrrTotal}
          change="+6.8% YoY acceleration"
          trend="up"
          timeframe="Gross Recurring"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="SYSTEM HEALTH TELEMETRY"
          value={healthTotal}
          change="Turnstiles & Cloud IoT"
          trend="up"
          timeframe="Uptime Score"
          icon={<Activity className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={snapshots}
        loading={loading}
        searchPlaceholder="Search dashboard snapshots by title, controller, cadence..."
      />
    </PageContainer>
  );
};
