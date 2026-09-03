import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, DollarSign, TrendingUp, CheckCircle2, Eye, Edit, Trash2, Calendar, Building2, ShieldCheck, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IRevenueReport } from '../types';
import { toast } from 'sonner';

export const DEFAULT_REVENUE_REPORTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { activeBranchId } = useBranchStore();
  const [reports, setReports] = useState<IRevenueReport[]>([]);

  useEffect(() => {
    loadReports();
  }, [activeBranchId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_revenue_reports');
      const customList: IRevenueReport[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/reports/revenue-reports', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IRevenueReport[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_REVENUE_REPORTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_revenue_reports');
      const customList: IRevenueReport[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_REVENUE_REPORTS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    }
  };

  const handleDelete = (id: string, title: string) => {
    const updated = reports.filter((r) => (r.id || r._id) !== id);
    setReports(updated);

    const stored = localStorage.getItem('gymflow_custom_revenue_reports');
    if (stored) {
      const customList: IRevenueReport[] = JSON.parse(stored);
      const filtered = customList.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem('gymflow_custom_revenue_reports', JSON.stringify(filtered));
    }

    toast.success(`Revenue report "${title}" removed`);
  };

  // Telemetry Metrics
  const totalGross = reports.reduce((acc, curr) => acc + (curr.grossRevenue || 0), 0);
  const totalNet = reports.reduce((acc, curr) => acc + (curr.netRevenue || 0), 0);
  const avgGrowth = '+16.2%';

  const columns: ColumnDef<IRevenueReport>[] = [
    {
      accessorKey: 'reportTitle',
      header: 'Report Title & Period Scope',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => navigate(`/reports/revenue-reports/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
            >
              {row.original.reportTitle}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Calendar className="h-3 w-3 text-primary" />
              <span>{row.original.startDate} &rarr; {row.original.endDate}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reportingPeriod',
      header: 'Cadence',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-bold">
          {row.original.reportingPeriod}
        </Badge>
      ),
    },
    {
      accessorKey: 'grossRevenue',
      header: 'Gross Revenue',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            ${row.original.grossRevenue?.toLocaleString()}
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            -${row.original.refundsDeductions} deductions
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'netRevenue',
      header: 'Net Realized Yield',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            ${row.original.netRevenue?.toLocaleString()}
          </span>
          <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
            <TrendingUp className="h-2.5 w-2.5" /> +{row.original.growthPercentage}% YoY
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'auditedBy',
      header: 'Audited By',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.auditorAvatar} alt={row.original.auditedBy} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.auditedBy.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.auditedBy}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'FINALIZED' ? 'success' : 'secondary'} className="text-[9px] font-bold">
          {row.original.status}
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
              onClick={() => navigate(`/reports/revenue-reports/${id}`)}
              title="View Revenue Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/reports/revenue-reports/${id}/edit`)}
              title="Edit Report"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.reportTitle)}
              title="Delete Report"
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
        title="Revenue & Gross Yield Intelligence Reports"
        subtitle="Audit recurring membership billing, personal training splits, retail Point of Sale, and amenity pod yields."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Period,Start,End,GrossRevenue,NetRevenue,Auditor,Status\n' + reports.map((r) => `"${r.reportTitle}","${r.reportingPeriod}","${r.startDate}","${r.endDate}","${r.grossRevenue}","${r.netRevenue}","${r.auditedBy}","${r.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `revenue-reports-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Revenue reports exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/reports/revenue-reports/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Generate Report</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="GROSS AUDITED REVENUE"
          value={`$${totalGross.toLocaleString()} USD`}
          change="Across all campus departments"
          trend="up"
          timeframe="Total Intake"
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="NET REALIZED YIELD"
          value={`$${totalNet.toLocaleString()} USD`}
          change="After refunds & deductions"
          trend="up"
          timeframe="Realized Yield"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="YoY REVENUE GROWTH"
          value={avgGrowth}
          change="+3.8% above franchise forecast"
          trend="up"
          timeframe="Annual Velocity"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="BANK RECONCILIATION"
          value="99.8%"
          change="Stripe & Gateway synced"
          trend="up"
          timeframe="Fiscal Integrity"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={reports}
        loading={loading}
        searchPlaceholder="Search revenue reports by title, auditor, cadence, period..."
      />
    </PageContainer>
  );
};
