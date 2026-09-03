import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Dumbbell, CheckCircle2, Eye, Edit, Trash2, Calendar, DollarSign, Award, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrainerAnalyticsModel } from '../types';
import { toast } from 'sonner';

export const DEFAULT_TRAINER_MODELS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { activeBranchId } = useBranchStore();
  const [models, setModels] = useState<ITrainerAnalyticsModel[]>([]);

  useEffect(() => {
    loadModels();
  }, [activeBranchId]);

  const loadModels = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_analytics');
      const customList: ITrainerAnalyticsModel[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/analytics/trainer-analytics', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: ITrainerAnalyticsModel[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_TRAINER_MODELS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setModels(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_trainer_analytics');
      const customList: ITrainerAnalyticsModel[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_TRAINER_MODELS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setModels(combined);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const updated = models.filter((m) => (m.id || m._id) !== id);
    setModels(updated);

    const stored = localStorage.getItem('gymflow_custom_trainer_analytics');
    if (stored) {
      const customList: ITrainerAnalyticsModel[] = JSON.parse(stored);
      const filtered = customList.filter((m) => (m.id || m._id) !== id);
      localStorage.setItem('gymflow_custom_trainer_analytics', JSON.stringify(filtered));
    }

    toast.success(`Trainer scorecard for "${name}" removed`);
  };

  // Telemetry Metrics
  const totalHours = models.reduce((acc, curr) => acc + (curr.ptHoursRendered || 0), 0);
  const avgUtil = models.length > 0 ? `${Math.round(models.reduce((a, m) => a + (m.trainerFloorUtilizationRate || 0), 0) / models.length)}%` : '0%';
  const totalRevenue = models.reduce((acc, curr) => acc + (curr.grossPtRevenueYield || 0), 0);
  const avgNps = models.length > 0 ? `${(models.reduce((a, m) => a + (m.netPromoterScore || 0), 0) / models.length).toFixed(1)} NPS` : '0 NPS';

  const columns: ColumnDef<ITrainerAnalyticsModel>[] = [
    {
      accessorKey: 'trainerName',
      header: 'Coach & Specialty',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border shrink-0">
              <AvatarImage src={row.original.trainerAvatar} alt={row.original.trainerName} />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {row.original.trainerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[200px]">
              <button
                type="button"
                onClick={() => navigate(`/analytics/trainer-analytics/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
              >
                {row.original.trainerName}
              </button>
              <p className="text-[10px] text-muted-foreground truncate">{row.original.coachingSpecialty}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'performanceTier',
      header: 'Tier',
      cell: ({ row }) => {
        const tier = row.original.performanceTier;
        return (
          <Badge
            variant={tier === 'ELITE_MASTER' ? 'default' : 'outline'}
            className="text-[9px] font-bold"
          >
            {tier === 'ELITE_MASTER' ? '🏆 ELITE' : tier === 'SENIOR_PERFORMANCE' ? '⭐ SENIOR' : '🎯 PRO'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'trainerFloorUtilizationRate',
      header: 'Utilization & Hours',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-emerald-600 dark:text-emerald-400">{row.original.trainerFloorUtilizationRate}% Util</span>
            <span className="text-muted-foreground font-normal text-[10px]">{row.original.ptHoursRendered} hrs</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(100, row.original.trainerFloorUtilizationRate)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'grossPtRevenueYield',
      header: 'Gross PT Yield',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            ${row.original.grossPtRevenueYield?.toLocaleString()} USD
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            {row.original.reportingPeriod}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'clientRetentionRate',
      header: 'Client Retention & NPS',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block">
            {row.original.clientRetentionRate}% Retention
          </span>
          <span className="text-[9px] text-purple-600 font-mono font-bold">
            {row.original.netPromoterScore} NPS Score
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Roster Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'ACTIVE_ROSTER' ? 'success' : 'outline'} className="text-[9px] font-bold">
          {row.original.status === 'ACTIVE_ROSTER' ? '🟢 ACTIVE' : row.original.status}
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
              onClick={() => navigate(`/analytics/trainer-analytics/${id}`)}
              title="View Coach Performance Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/analytics/trainer-analytics/${id}/edit`)}
              title="Edit Scorecard"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.trainerName)}
              title="Delete Scorecard"
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
        title="Trainer & Coach Performance Analytics"
        subtitle="Benchmark trainer floor utilization rates, billable PT hours rendered, gross yield, client retention curves, and NPS satisfaction."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Trainer,Specialty,Period,Tier,Hours,Utilization,GrossRevenue,RetentionRate,NPS,Status\n' + models.map((m) => `"${m.trainerName}","${m.coachingSpecialty}","${m.reportingPeriod}","${m.performanceTier}","${m.ptHoursRendered}","${m.trainerFloorUtilizationRate}","${m.grossPtRevenueYield}","${m.clientRetentionRate}","${m.netPromoterScore}","${m.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `trainer-performance-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Trainer analytics models exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/analytics/trainer-analytics/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Publish Scorecard</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL PT HOURS RENDERED"
          value={`${totalHours.toLocaleString()} Hrs`}
          change="+8.4% completed sessions"
          trend="up"
          timeframe="Billable Floor Hours"
          icon={<Dumbbell className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="COACH FLOOR UTILIZATION"
          value={avgUtil}
          change="Available prime slots booked"
          trend="up"
          timeframe="Capacity Efficiency"
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="GROSS PT REVENUE YIELD"
          value={`$${totalRevenue.toLocaleString()} USD`}
          change="+14.1% MoM training dues"
          trend="up"
          timeframe="PT Packages Cashflow"
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        />
        <MetricCard
          title="AVERAGE COACH NPS SCORE"
          value={avgNps}
          change="Exceptional client advocacy"
          trend="up"
          timeframe="Client Satisfaction"
          icon={<Star className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={models}
        loading={loading}
        searchPlaceholder="Search trainer analytics by coach name, specialty, tier..."
      />
    </PageContainer>
  );
};
