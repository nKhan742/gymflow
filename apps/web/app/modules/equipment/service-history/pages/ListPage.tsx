import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, History, Clock, DollarSign, ShieldCheck, Eye, Edit, Trash2, Tag, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IServiceLog } from '../types';
import { toast } from 'sonner';

export const DEFAULT_SERVICE_LOGS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [serviceLogs, setServiceLogs] = useState<IServiceLog[]>([]);

  useEffect(() => {
    loadLogs();
  }, [activeBranchId]);

  const loadLogs = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_service_history');
      const customList: IServiceLog[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/equipment/service-history', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IServiceLog[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_SERVICE_LOGS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setServiceLogs(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_service_history');
      const customList: IServiceLog[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_SERVICE_LOGS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setServiceLogs(combined);
    }
  };

  const handleDelete = (id: string, logNum: string) => {
    const updated = serviceLogs.filter((l) => (l.id || l._id) !== id);
    setServiceLogs(updated);

    const stored = localStorage.getItem('gymflow_custom_service_history');
    if (stored) {
      const customList: IServiceLog[] = JSON.parse(stored);
      const filtered = customList.filter((l) => (l.id || l._id) !== id);
      localStorage.setItem('gymflow_custom_service_history', JSON.stringify(filtered));
    }

    toast.success(`Service audit log #${logNum} deleted`);
  };

  // Telemetry Metrics
  const totalEvents = serviceLogs.length;
  const totalDowntime = serviceLogs.reduce((acc, curr) => acc + (curr.downtimeHours || 0), 0);
  const totalSpend = serviceLogs.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
  const warrantyClaims = serviceLogs.filter((s) => s.warrantyClaimed).length;

  const columns: ColumnDef<IServiceLog>[] = [
    {
      accessorKey: 'logNumber',
      header: 'Log # & Date',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(`/equipment/service-history/${id}`)}
              className="font-mono font-bold text-xs text-primary block hover:underline cursor-pointer"
            >
              {row.original.logNumber}
            </button>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span>{row.original.serviceDate}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'equipmentName',
      header: 'Equipment Machine',
      cell: ({ row }) => (
        <div className="space-y-0.5 max-w-[220px]">
          <span className="font-bold text-xs text-foreground block truncate">
            {row.original.equipmentName}
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-[9px]">
              {row.original.assetTag}
            </Badge>
            <span className="text-[10px] text-muted-foreground truncate">{row.original.zoneName}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'serviceType',
      header: 'Service Protocol',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-[10px] font-semibold">
          {row.original.serviceType?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'technicianName',
      header: 'Technician / Partner',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border shrink-0">
            <AvatarImage src={row.original.technicianAvatar} alt={row.original.technicianName} />
            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
              {row.original.technicianName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <span className="text-xs font-semibold text-foreground block truncate max-w-[140px]">
              {row.original.technicianName}
            </span>
            <span className="text-[10px] text-muted-foreground block truncate max-w-[140px]">
              {row.original.serviceProvider}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'partsReplaced',
      header: 'Parts Installed',
      cell: ({ row }) => {
        const parts = row.original.partsReplaced || [];
        return (
          <div className="space-y-1">
            <Badge variant="outline" className="text-[10px] font-mono gap-1 bg-muted/40">
              <Tag className="w-3 h-3 text-primary" />
              {parts.length} Parts Replaced
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'downtimeHours',
      header: 'Downtime',
      cell: ({ row }) => (
        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
          {row.original.downtimeHours} hrs
        </span>
      ),
    },
    {
      accessorKey: 'totalCost',
      header: 'Cost ($)',
      cell: ({ row }) => {
        if (row.original.warrantyClaimed) {
          return (
            <Badge variant="success" className="text-[9px] font-bold">
              WARRANTY $0
            </Badge>
          );
        }
        return (
          <span className="text-xs font-bold text-foreground">
            ${row.original.totalCost}
          </span>
        );
      },
    },
    {
      accessorKey: 'conditionAfterService',
      header: 'Post Condition',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.conditionAfterService === 'EXCELLENT'
              ? 'success'
              : row.original.conditionAfterService === 'GOOD'
              ? 'default'
              : 'warning'
          }
          className="text-[10px] font-bold uppercase"
        >
          {row.original.conditionAfterService}
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
              onClick={() => navigate(`/equipment/service-history/${id}`)}
              title="View Service Log Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/equipment/service-history/${id}/edit`)}
              title="Edit Service Log"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.logNumber)}
              title="Delete Service Log"
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
        title="Equipment Service History & Telemetry Logs"
        subtitle="Complete historical audit trail of machine maintenance, technician certifications, parts replacement, and downtime analytics."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'LogNumber,Equipment,AssetTag,ServiceDate,Type,Technician,Provider,DowntimeHours,TotalCost,PostCondition,Warranty\n' + serviceLogs.map((s) => `"${s.logNumber}","${s.equipmentName}","${s.assetTag}","${s.serviceDate}","${s.serviceType}","${s.technicianName}","${s.serviceProvider}","${s.downtimeHours}","$${s.totalCost}","${s.conditionAfterService}","${s.warrantyClaimed}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `service-history-audit-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Service history logs exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/equipment/service-history/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Log Service Record</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL SERVICE EVENTS"
          value={`${totalEvents} Audits`}
          change="Comprehensive service log"
          trend="up"
          timeframe="Historical Ledger"
          icon={<History className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="AGGREGATE FLEET DOWNTIME"
          value={`${totalDowntime.toFixed(1)} Hours`}
          change="Average 2.1h per maintenance"
          trend="down"
          timeframe="Machine Availability"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="ANNUAL REPAIR INVESTMENT"
          value={`$${totalSpend.toLocaleString()}`}
          change="Fleet maintenance spend"
          trend="up"
          timeframe="CapEx Accounting"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="OEM WARRANTY CLAIMS"
          value={`${warrantyClaims}`}
          change="100% covered zero-cost repairs"
          trend="up"
          timeframe="Warranty Recoveries"
          icon={<ShieldCheck className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={serviceLogs}
        searchPlaceholder="Search service history by log #, machine name, tag, technician, provider..."
      />
    </PageContainer>
  );
};
