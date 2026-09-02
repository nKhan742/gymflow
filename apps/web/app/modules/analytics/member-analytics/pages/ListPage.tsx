import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Users, CheckCircle2, Eye, Edit, Trash2, Calendar, TrendingUp, HeartHandshake, ShieldAlert, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IMemberAnalyticsModel } from '../types';
import { toast } from 'sonner';

export const DEFAULT_MEMBER_MODELS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [models, setModels] = useState<IMemberAnalyticsModel[]>([]);

  useEffect(() => {
    loadModels();
  }, [activeBranchId]);

  const loadModels = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_member_analytics');
      const customList: IMemberAnalyticsModel[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/analytics/member-analytics', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IMemberAnalyticsModel[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_MEMBER_MODELS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setModels(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_member_analytics');
      const customList: IMemberAnalyticsModel[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_MEMBER_MODELS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setModels(combined);
    }
  };

  const handleDelete = (id: string, title: string) => {
    const updated = models.filter((m) => (m.id || m._id) !== id);
    setModels(updated);

    const stored = localStorage.getItem('gymflow_custom_member_analytics');
    if (stored) {
      const customList: IMemberAnalyticsModel[] = JSON.parse(stored);
      const filtered = customList.filter((m) => (m.id || m._id) !== id);
      localStorage.setItem('gymflow_custom_member_analytics', JSON.stringify(filtered));
    }

    toast.success(`Member analytics model "${title}" removed`);
  };

  // Telemetry Metrics
  const avgRetention = models.length > 0 ? `${(models.reduce((a, m) => a + (m.cohortRetentionRate || 0), 0) / models.length).toFixed(1)}%` : '100%';
  const totalTracked = models.reduce((acc, curr) => acc + (curr.activeEnrolledAthletes || 0), 0);
  const avgVisits = models.length > 0 ? `${(models.reduce((a, m) => a + (m.avgVisitsPerWeek || 0), 0) / models.length).toFixed(1)} / Wk` : '0 / Wk';
  const avgHealthScore = models.length > 0 ? `${(models.reduce((a, m) => a + (m.memberEngagementScore || 0), 0) / models.length).toFixed(1)}` : '0';

  const columns: ColumnDef<IMemberAnalyticsModel>[] = [
    {
      accessorKey: 'cohortTitle',
      header: 'Cohort Model & Window',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => navigate(`/analytics/member-analytics/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
            >
              {row.original.cohortTitle}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Calendar className="h-3 w-3 text-primary" />
              <span>{row.original.cohortDate}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'cohortPeriod',
      header: 'Cadence',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-bold">
          {row.original.cohortPeriod}
        </Badge>
      ),
    },
    {
      accessorKey: 'cohortRetentionRate',
      header: 'Retention & Churn Hazard',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-emerald-600 dark:text-emerald-400">{row.original.cohortRetentionRate}% Kept</span>
            <span className="text-rose-600 font-normal text-[10px]">{row.original.churnHazardRate}% Churn</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(100, row.original.cohortRetentionRate)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'activeEnrolledAthletes',
      header: 'Enrolled & Visit Rate',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.activeEnrolledAthletes?.toLocaleString()} Athletes
          </span>
          <span className="text-[9px] text-blue-600 font-mono font-bold">
            {row.original.avgVisitsPerWeek} visits/week average
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'memberEngagementScore',
      header: 'Health & At-Risk Flags',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.memberEngagementScore} / 100 Score
          </span>
          <span className={`text-[9px] font-mono font-bold ${row.original.atRiskMembersCount > 50 ? 'text-rose-600' : 'text-amber-600'}`}>
            {row.original.atRiskMembersCount} at-risk members
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'cxAnalyst',
      header: 'CX Retention Lead',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.analystAvatar} alt={row.original.cxAnalyst} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.cxAnalyst.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.cxAnalyst}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Engagement Tier',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'CHURN_ALERT' ? 'destructive' : 'success'} className="text-[9px] font-bold">
          {row.original.status === 'CHURN_ALERT' ? '⚠️ RISK' : 'HEALTHY'}
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
              onClick={() => navigate(`/analytics/member-analytics/${id}`)}
              title="View Member Cohort Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/analytics/member-analytics/${id}/edit`)}
              title="Edit Model"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.cohortTitle)}
              title="Delete Model"
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
        title="Member Retention & Cohort Intelligence"
        subtitle="Track monthly member cohort retention curves, churn hazard predictive models, weekly visits frequency, and health scores."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Cadence,Date,Athletes,RetentionRate,ChurnHazard,VisitsPerWeek,AtRisk,EngagementScore,CXLead,Status\n' + models.map((m) => `"${m.cohortTitle}","${m.cohortPeriod}","${m.cohortDate}","${m.activeEnrolledAthletes}","${m.cohortRetentionRate}","${m.churnHazardRate}","${m.avgVisitsPerWeek}","${m.atRiskMembersCount}","${m.memberEngagementScore}","${m.cxAnalyst}","${m.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `member-retention-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Member analytics models exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/analytics/member-analytics/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Publish Model</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="COHORT RETENTION RATE"
          value={avgRetention}
          change="+1.8% vs last quarter"
          trend="up"
          timeframe="90-Day Retention"
          icon={<HeartHandshake className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="TOTAL TRACKED ATHLETES"
          value={`${totalTracked.toLocaleString()} Athletes`}
          change="Cohort sample census"
          trend="up"
          timeframe="Active Cohort"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="VISIT FREQUENCY"
          value={avgVisits}
          change="3.4 sessions per member"
          trend="up"
          timeframe="Weekly Turnstile Rate"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="ENGAGEMENT INDEX"
          value={`${avgHealthScore} / 100`}
          change="High retention health"
          trend="up"
          timeframe="Member Health Score"
          icon={<Sparkles className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={models}
        searchPlaceholder="Search member analytics by title, CX lead, cadence..."
      />
    </PageContainer>
  );
};
