import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Landmark, DollarSign, CheckCircle2, Eye, Edit, Trash2, Calendar, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IFinanceReport } from '../types';
import { toast } from 'sonner';

export const DEFAULT_FINANCE_REPORTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { activeBranchId } = useBranchStore();
  const [reports, setReports] = useState<IFinanceReport[]>([]);

  useEffect(() => {
    loadReports();
  }, [activeBranchId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_finance_reports');
      const customList: IFinanceReport[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/reports/finance-reports', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IFinanceReport[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_FINANCE_REPORTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_finance_reports');
      const customList: IFinanceReport[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_FINANCE_REPORTS) {
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

    const stored = localStorage.getItem('gymflow_custom_finance_reports');
    if (stored) {
      const customList: IFinanceReport[] = JSON.parse(stored);
      const filtered = customList.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem('gymflow_custom_finance_reports', JSON.stringify(filtered));
    }

    toast.success(`Finance report "${title}" removed`);
  };

  // Telemetry Metrics
  const grossRev = reports.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
  const totalEbitda = reports.reduce((acc, curr) => acc + (curr.ebitda || 0), 0);
  const totalNetProfit = reports.reduce((acc, curr) => acc + (curr.netProfit || 0), 0);
  const avgEbitdaMargin = '25.5%';

  const columns: ColumnDef<IFinanceReport>[] = [
    {
      accessorKey: 'reportTitle',
      header: 'Report Title & Period Scope',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => navigate(`/reports/finance-reports/${id}`)}
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
      accessorKey: 'totalRevenue',
      header: 'Gross Revenue & OPEX',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            ${row.original.totalRevenue?.toLocaleString()} Gross
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            ${(row.original.operatingExpenses + row.original.payrollExpenses + row.original.facilitiesRentLease).toLocaleString()} OPEX
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'ebitda',
      header: 'EBITDA Margin',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            ${row.original.ebitda?.toLocaleString()} USD
          </span>
          <span className="text-[9px] text-emerald-600 font-mono font-bold">
            {row.original.ebitdaMarginPercentage}% EBITDA Margin
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'netProfit',
      header: 'Net Operating Profit',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            ${row.original.netProfit?.toLocaleString()} USD
          </span>
          <span className="text-[9px] text-blue-600 font-mono font-bold">
            {row.original.netProfitMarginPercentage}% Net Margin
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'auditedBy',
      header: 'CFO Sign-Off',
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
      header: 'Board Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'BOARD_APPROVED' ? 'success' : 'secondary'} className="text-[9px] font-bold">
          {row.original.status === 'BOARD_APPROVED' ? 'APPROVED' : row.original.status}
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
              onClick={() => navigate(`/reports/finance-reports/${id}`)}
              title="View Financial P&L Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/reports/finance-reports/${id}/edit`)}
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
        title="Executive Finance, EBITDA & P&L Reports"
        subtitle="Audit gross revenue streams, departmental OPEX overhead, EBITDA margins, and net operating profit after tax."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Period,Start,End,GrossRevenue,OPEX,Payroll,Rent,EBITDA,EBITDAMargin,NetProfit,NetMargin,Auditor,Status\n' + reports.map((r) => `"${r.reportTitle}","${r.reportingPeriod}","${r.startDate}","${r.endDate}","${r.totalRevenue}","${r.operatingExpenses}","${r.payrollExpenses}","${r.facilitiesRentLease}","${r.ebitda}","${r.ebitdaMarginPercentage}","${r.netProfit}","${r.netProfitMarginPercentage}","${r.auditedBy}","${r.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `finance-reports-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Finance reports exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/reports/finance-reports/create')}
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
          title="GROSS OPERATING REVENUE"
          value={`$${grossRev.toLocaleString()} USD`}
          change="Campus audited income"
          trend="up"
          timeframe="Total Intake"
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="AVERAGE EBITDA MARGIN"
          value={avgEbitdaMargin}
          change="+3.4% vs FY targets"
          trend="up"
          timeframe="Operating Efficiency"
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="NET OPERATING PROFIT"
          value={`$${totalNetProfit.toLocaleString()} USD`}
          change="Realized bottom line profit"
          trend="up"
          timeframe="After Tax"
          icon={<Landmark className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="TOTAL REALIZED EBITDA"
          value={`$${totalEbitda.toLocaleString()} USD`}
          change="Pre-tax cashflow generation"
          trend="up"
          timeframe="Core Earnings"
          icon={<PieChart className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={reports}
        loading={loading}
        searchPlaceholder="Search finance reports by title, CFO, cadence..."
      />
    </PageContainer>
  );
};
