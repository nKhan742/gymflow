import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, Package, DollarSign, CheckCircle2, Eye, Edit, Trash2, Calendar, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IInventoryReport } from '../types';
import { toast } from 'sonner';

export const DEFAULT_INVENTORY_REPORTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [reports, setReports] = useState<IInventoryReport[]>([]);

  useEffect(() => {
    loadReports();
  }, [activeBranchId]);

  const loadReports = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_inventory_reports');
      const customList: IInventoryReport[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/reports/inventory-reports', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IInventoryReport[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_INVENTORY_REPORTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_inventory_reports');
      const customList: IInventoryReport[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_INVENTORY_REPORTS) {
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

    const stored = localStorage.getItem('gymflow_custom_inventory_reports');
    if (stored) {
      const customList: IInventoryReport[] = JSON.parse(stored);
      const filtered = customList.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem('gymflow_custom_inventory_reports', JSON.stringify(filtered));
    }

    toast.success(`Inventory report "${title}" removed`);
  };

  // Telemetry Metrics
  const totalValuation = reports.reduce((acc, curr) => acc + (curr.totalValuationCost || 0), 0);
  const totalCogs = reports.reduce((acc, curr) => acc + (curr.cogsSold || 0), 0);
  const avgTurnover = '4.1x';

  const columns: ColumnDef<IInventoryReport>[] = [
    {
      accessorKey: 'categoryName',
      header: 'Category & Statement Title',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-12 rounded-md overflow-hidden border border-border shrink-0 bg-muted">
              <img
                src={row.original.categoryImage}
                alt={row.original.categoryName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5 max-w-[240px]">
              <button
                type="button"
                onClick={() => navigate(`/reports/inventory-reports/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
              >
                {row.original.categoryName}
              </button>
              <p className="text-[10px] text-muted-foreground truncate">{row.original.reportTitle}</p>
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
      accessorKey: 'totalUnitsInStock',
      header: 'Stock Levels',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.totalUnitsInStock?.toLocaleString()} Units
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            {row.original.totalStockSKUs} Active SKUs
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'totalValuationCost',
      header: 'Cost vs Retail Value',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            ${row.original.totalValuationCost?.toLocaleString()} Cost
          </span>
          <span className="text-[9px] text-emerald-600 font-mono font-bold">
            ${row.original.totalRetailValue?.toLocaleString()} Retail
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'stockTurnoverRatio',
      header: 'Turnover (x)',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-mono font-bold text-blue-600 border-blue-500/30">
          {row.original.stockTurnoverRatio}x Turnover
        </Badge>
      ),
    },
    {
      accessorKey: 'shrinkageRate',
      header: 'Shrinkage %',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className={`font-mono text-xs font-bold block ${row.original.shrinkageRate > 1.0 ? 'text-rose-500' : 'text-foreground'}`}>
            {row.original.shrinkageRate}%
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            Variance loss
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Audit Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'AUDITED' ? 'success' : 'secondary'} className="text-[9px] font-bold">
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
              onClick={() => navigate(`/reports/inventory-reports/${id}`)}
              title="View Inventory Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/reports/inventory-reports/${id}/edit`)}
              title="Edit Report"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.categoryName)}
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
        title="Inventory Valuation, COGS & Stock Turnover Reports"
        subtitle="Audit warehouse SKU counts, cost vs retail valuation, cost of goods sold, turnover velocity, and shrinkage variances."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Category,Period,Start,End,SKUs,Units,CostValuation,RetailValuation,COGS,TurnoverRatio,ShrinkageRate,Auditor,Status\n' + reports.map((r) => `"${r.categoryName}","${r.reportingPeriod}","${r.startDate}","${r.endDate}","${r.totalStockSKUs}","${r.totalUnitsInStock}","${r.totalValuationCost}","${r.totalRetailValue}","${r.cogsSold}","${r.stockTurnoverRatio}","${r.shrinkageRate}","${r.auditedBy}","${r.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `inventory-reports-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Inventory valuation reports exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/reports/inventory-reports/create')}
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
          title="TOTAL INVENTORY VALUATION"
          value={`$${totalValuation.toLocaleString()} USD`}
          change="At weighted average cost"
          trend="up"
          timeframe="Balance Sheet Assets"
          icon={<Package className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="COST OF GOODS SOLD"
          value={`$${totalCogs.toLocaleString()} USD`}
          change="Realized product outflow"
          trend="up"
          timeframe="COGS Ledger"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="AVG STOCK TURNOVER"
          value={avgTurnover}
          change="High retail velocity"
          trend="up"
          timeframe="Annualized turns"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="SHRINKAGE / SPOILAGE"
          value="0.65% avg"
          change="Well below 1.5% target"
          trend="up"
          timeframe="Asset Protection"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={reports}
        searchPlaceholder="Search inventory reports by category name, title, cadence..."
      />
    </PageContainer>
  );
};
