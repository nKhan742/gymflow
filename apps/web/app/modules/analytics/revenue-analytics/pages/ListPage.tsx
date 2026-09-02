import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, DollarSign, CheckCircle2, Eye, Edit, Trash2, Calendar, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IRevenueAnalyticsModel } from '../types';
import { toast } from 'sonner';

export const DEFAULT_REVENUE_MODELS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [models, setModels] = useState<IRevenueAnalyticsModel[]>([]);

  useEffect(() => {
    loadModels();
  }, [activeBranchId]);

  const loadModels = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_revenue_analytics');
      const customList: IRevenueAnalyticsModel[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/analytics/revenue-analytics', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IRevenueAnalyticsModel[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_REVENUE_MODELS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setModels(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_revenue_analytics');
      const customList: IRevenueAnalyticsModel[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_REVENUE_MODELS) {
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

    const stored = localStorage.getItem('gymflow_custom_revenue_analytics');
    if (stored) {
      const customList: IRevenueAnalyticsModel[] = JSON.parse(stored);
      const filtered = customList.filter((m) => (m.id || m._id) !== id);
      localStorage.setItem('gymflow_custom_revenue_analytics', JSON.stringify(filtered));
    }

    toast.success(`Revenue model "${title}" removed`);
  };

  // Telemetry Metrics
  const avgMrr = `$${models.reduce((a, m) => a + (m.mrrAmount || 0), 0).toLocaleString()}`;
  const avgArr = `$${models.reduce((a, m) => a + (m.arrAmount || (m.mrrAmount || 0) * 12), 0).toLocaleString()}`;
  const avgArpu = models.length > 0 ? `$${(models.reduce((a, m) => a + (m.arpuAmount || 0), 0) / models.length).toFixed(2)}` : '$0.00';
  const ltvCacRatio = models.length > 0 ? `${(models.reduce((a, m) => a + (m.ltvToCacRatio || 0), 0) / models.length).toFixed(1)}x` : '0.0x';

  const columns: ColumnDef<IRevenueAnalyticsModel>[] = [
    {
      accessorKey: 'modelTitle',
      header: 'Model Title & Cohort Window',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => navigate(`/analytics/revenue-analytics/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
            >
              {row.original.modelTitle}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Calendar className="h-3 w-3 text-primary" />
              <span>{row.original.dateRange}</span>
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
      accessorKey: 'mrrAmount',
      header: 'MRR & ARR Run-Rate',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            ${row.original.mrrAmount?.toLocaleString()} MRR
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            ${row.original.arrAmount?.toLocaleString()} ARR Run-Rate
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'arpuAmount',
      header: 'ARPU & Unit Economics',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            ${row.original.arpuAmount?.toFixed(2)} ARPU
          </span>
          <span className="text-[9px] text-blue-600 font-mono font-bold">
            {row.original.cacPaybackMonths}mo CAC Payback ({row.original.ltvToCacRatio}x LTV)
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'subscriptionYieldPercent',
      header: 'Revenue Streams Mix',
      cell: ({ row }) => (
        <div className="space-y-1 max-w-[140px]">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span>Dues: {row.original.subscriptionYieldPercent}%</span>
            <span>PT: {row.original.ptYieldPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
            <div className="bg-primary h-full" style={{ width: `${row.original.subscriptionYieldPercent}%` }} />
            <div className="bg-emerald-500 h-full" style={{ width: `${row.original.ptYieldPercent}%` }} />
            <div className="bg-amber-500 h-full" style={{ width: `${row.original.posRetailYieldPercent}%` }} />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'analystName',
      header: 'Financial Modeler',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.analystAvatar} alt={row.original.analystName} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.analystName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.analystName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'VALIDATED' ? 'success' : 'secondary'} className="text-[9px] font-bold">
          {row.original.status === 'VALIDATED' ? 'VALIDATED' : row.original.status}
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
              onClick={() => navigate(`/analytics/revenue-analytics/${id}`)}
              title="View Revenue Model Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/analytics/revenue-analytics/${id}/edit`)}
              title="Edit Model"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.modelTitle)}
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
        title="Revenue, MRR & Monetization Analytics"
        subtitle="Analyze monthly recurring revenue velocity, annualized run-rate projections, ARPU per athlete, and LTV:CAC yields."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Cadence,Range,MRR,ARR,ARPU,CACPayback,LTVCAC,DuesYield,PTYield,RetailYield,Analyst,Status\n' + models.map((m) => `"${m.modelTitle}","${m.reportingCadence}","${m.dateRange}","${m.mrrAmount}","${m.arrAmount}","${m.arpuAmount}","${m.cacPaybackMonths}","${m.ltvToCacRatio}","${m.subscriptionYieldPercent}","${m.ptYieldPercent}","${m.posRetailYieldPercent}","${m.analystName}","${m.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `revenue-analytics-models-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Revenue analytics models exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/analytics/revenue-analytics/create')}
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
          title="MONTHLY RECURRING REVENUE"
          value={avgMrr}
          change="+8.4% vs previous cohort"
          trend="up"
          timeframe="MRR Velocity"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="ANNUALIZED RUN-RATE (ARR)"
          value={avgArr}
          change="Contracted & recurring"
          trend="up"
          timeframe="Full-Year Projected"
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="AVG REVENUE PER ATHLETE"
          value={avgArpu}
          change="+$3.20 blended expansion"
          trend="up"
          timeframe="ARPU Yield"
          icon={<PieChart className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="LTV : CAC PAYBACK RATIO"
          value={ltvCacRatio}
          change="2.4 months payback speed"
          trend="up"
          timeframe="Capital Efficiency"
          icon={<ShieldCheck className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={models}
        searchPlaceholder="Search revenue models by title, analyst, cadence..."
      />
    </PageContainer>
  );
};
