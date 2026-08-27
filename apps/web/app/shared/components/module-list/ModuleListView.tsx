import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../layouts/PageContainer';
import { PageHeader } from '../../layouts/PageHeader';
import { MetricCard } from '../cards/MetricCard';
import { DataTable } from '../table/DataTable';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Download, Eye, Edit2, Database, CheckCircle2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { moduleApi, IDbRecord } from '../../../core/api/moduleApi';

interface IModuleListViewProps {
  title: string;
  subtitle: string;
  domain: string;
  submodule: string;
  createPath?: string;
}

export const ModuleListView: React.FC<IModuleListViewProps> = ({
  title,
  subtitle,
  domain,
  submodule,
  createPath,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState<IDbRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [activeRate, setActiveRate] = useState('100%');

  useEffect(() => {
    loadData();
  }, [domain, submodule]);

  const loadData = async () => {
    const result = await moduleApi.fetchSubmoduleData(domain, submodule);
    setData(result.items);
    setTotal(result.total);
    setActiveCount(result.activeCount);
    setActiveRate(result.activeRate);
  };

  const columns: ColumnDef<IDbRecord>[] = [
    {
      accessorKey: 'code',
      header: 'Identifier / Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: `${title} Name`,
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground text-sm">{row.getValue('name')}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const val = String(row.getValue('status') || 'active').toLowerCase();
        return (
          <Badge
            variant={
              val.includes('act') || val.includes('paid')
                ? 'success'
                : val.includes('pend') || val.includes('froz')
                ? 'warning'
                : val.includes('exp') || val.includes('inact')
                ? 'destructive'
                : 'secondary'
            }
            className="text-xs capitalize"
          >
            {val}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Modified',
      cell: ({ row }) => {
        const d = row.original.updatedAt || row.original.createdAt;
        return (
          <span className="text-xs text-muted-foreground">
            {d && d.includes('T') ? new Date(d).toLocaleDateString() : d || 'Recent'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/${domain}/${submodule}/${row.original.id || row.original._id || '1'}`)}
            className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
            title="View 360° Profile"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => navigate(`/${domain}/${submodule}/${row.original.id || row.original._id || '1'}/edit`)}
            className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
            title="Edit Record"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate(createPath || `/${domain}/${submodule}/create`)}
            >
              <Plus className="h-4 w-4" />
              <span>Add {title}</span>
            </Button>
          </>
        }
      />

      {/* 3 Top Real-Time KPI Cards from Database */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title={`Total ${title} Records`}
          value={`${total}`}
          change="+100% Persisted"
          trend="up"
          timeframe="Live MongoDB Collection"
          icon={<Database className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Operational State"
          value={`${activeCount} Active`}
          change={activeRate}
          trend="up"
          timeframe="Health status"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Throughput & Status"
          value="Operational"
          change="Synced"
          trend="neutral"
          timeframe="Real-time Mongoose Link"
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder={`Search ${title.toLowerCase()} by name, code or status...`}
      />
    </PageContainer>
  );
};

