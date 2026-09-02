import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Wrench, AlertTriangle, DollarSign, CheckCircle2, Eye, Edit, Trash2, Tag, CheckSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IMaintenanceTicket } from '../types';
import { toast } from 'sonner';

export const DEFAULT_MAINTENANCE: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [tickets, setTickets] = useState<IMaintenanceTicket[]>([]);

  useEffect(() => {
    loadTickets();
  }, [activeBranchId]);

  const loadTickets = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_maintenance');
      const customList: IMaintenanceTicket[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/equipment/maintenance', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IMaintenanceTicket[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_MAINTENANCE;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setTickets(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_maintenance');
      const customList: IMaintenanceTicket[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_MAINTENANCE) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setTickets(combined);
    }
  };

  const handleResolveTicket = (id: string, ticketNum: string) => {
    const updated = tickets.map((t) => {
      if ((t.id || t._id) === id) {
        return {
          ...t,
          status: 'RESOLVED_TESTED' as IMaintenanceTicket['status'],
          checklist: t.checklist.map((c) => ({ ...c, done: true })),
        };
      }
      return t;
    });
    setTickets(updated);

    const stored = localStorage.getItem('gymflow_custom_maintenance');
    if (stored) {
      const customList: IMaintenanceTicket[] = JSON.parse(stored);
      const updatedCustom = customList.map((t) => {
        if ((t.id || t._id) === id) {
          return {
            ...t,
            status: 'RESOLVED_TESTED' as IMaintenanceTicket['status'],
            checklist: t.checklist.map((c) => ({ ...c, done: true })),
          };
        }
        return t;
      });
      localStorage.setItem('gymflow_custom_maintenance', JSON.stringify(updatedCustom));
    }

    toast.success(`Work order #${ticketNum} marked as RESOLVED & TESTED!`);
  };

  const handleDelete = (id: string, ticketNum: string) => {
    const updated = tickets.filter((t) => (t.id || t._id) !== id);
    setTickets(updated);

    const stored = localStorage.getItem('gymflow_custom_maintenance');
    if (stored) {
      const customList: IMaintenanceTicket[] = JSON.parse(stored);
      const filtered = customList.filter((t) => (t.id || t._id) !== id);
      localStorage.setItem('gymflow_custom_maintenance', JSON.stringify(filtered));
    }

    toast.success(`Maintenance ticket #${ticketNum} deleted`);
  };

  // Telemetry
  const totalTickets = tickets.length;
  const activeOrders = tickets.filter((t) => t.status === 'OPEN_SCHEDULED' || t.status === 'IN_PROGRESS' || t.status === 'AWAITING_PARTS').length;
  const criticalCount = tickets.filter((t) => t.priority === 'CRITICAL' && t.status !== 'RESOLVED_TESTED').length;
  const totalCost = tickets.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);

  const columns: ColumnDef<IMaintenanceTicket>[] = [
    {
      accessorKey: 'ticketNumber',
      header: 'Ticket #',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(`/equipment/maintenance/${id}`)}
              className="font-mono font-bold text-xs text-primary block hover:underline cursor-pointer"
            >
              {row.original.ticketNumber}
            </button>
            <Badge variant="outline" className="text-[9px] font-mono font-semibold">
              {row.original.assetTag}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'equipmentName',
      header: 'Machine & Diagnostic Issue',
      cell: ({ row }) => (
        <div className="space-y-0.5 max-w-[260px]">
          <span className="font-bold text-xs text-foreground block truncate">
            {row.original.equipmentName}
          </span>
          <span className="text-[11px] text-muted-foreground block truncate">
            {row.original.issueTitle}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority & Type',
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge
            variant={
              row.original.priority === 'CRITICAL'
                ? 'destructive'
                : row.original.priority === 'HIGH'
                ? 'warning'
                : 'secondary'
            }
            className="text-[9px] font-bold uppercase"
          >
            {row.original.priority}
          </Badge>
          <span className="text-[10px] text-muted-foreground block truncate">
            {row.original.maintenanceType?.replace(/_/g, ' ')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'assignedTechnician',
      header: 'Assigned Tech',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border shrink-0">
            <AvatarImage src={row.original.technicianAvatar} alt={row.original.assignedTechnician} />
            <AvatarFallback className="text-[10px] font-bold bg-amber-500/10 text-amber-600">
              {row.original.assignedTechnician.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <span className="text-xs font-semibold text-foreground block truncate max-w-[140px]">
              {row.original.assignedTechnician}
            </span>
            <span className="text-[10px] text-muted-foreground block font-mono">
              {row.original.scheduledDate}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'checklist',
      header: 'Protocol Steps',
      cell: ({ row }) => {
        const list = row.original.checklist || [];
        const completed = list.filter((c) => c.done).length;
        return (
          <Badge variant="outline" className="text-[10px] font-mono gap-1 bg-muted/30">
            <CheckSquare className="w-3 h-3 text-emerald-500" />
            {completed}/{list.length} Tested
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === 'RESOLVED_TESTED'
                ? 'success'
                : s === 'IN_PROGRESS'
                ? 'warning'
                : s === 'AWAITING_PARTS'
                ? 'destructive'
                : 'default'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const isNotResolved = row.original.status !== 'RESOLVED_TESTED';
        return (
          <div className="flex items-center gap-1.5">
            {isNotResolved && (
              <Button
                size="sm"
                className="h-7 px-2 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                onClick={() => handleResolveTicket(id || '', row.original.ticketNumber)}
                title="Mark as Resolved & Tested"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Resolve</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/equipment/maintenance/${id}`)}
              title="View Work Order Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/equipment/maintenance/${id}/edit`)}
              title="Edit Work Order"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.ticketNumber)}
              title="Delete Ticket"
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
        title="Maintenance Tickets & Work Orders"
        subtitle="Manage scheduled inspections, track technician dispatches, and log parts replacement workflows."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Ticket,AssetTag,Equipment,Issue,Priority,Type,Technician,Status,EstCost\n' + tickets.map((t) => `"${t.ticketNumber}","${t.assetTag}","${t.equipmentName}","${t.issueTitle}","${t.priority}","${t.maintenanceType}","${t.assignedTechnician}","${t.status}","$${t.estimatedCost}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `maintenance-orders-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Maintenance work orders exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/equipment/maintenance/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Issue Work Order</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ACTIVE WORK ORDERS"
          value={`${activeOrders}`}
          change="Open technician orders"
          trend="neutral"
          timeframe="Floor Queue"
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="CRITICAL BREAKDOWNS"
          value={`${criticalCount}`}
          change={criticalCount > 0 ? 'Requires immediate tech dispatch' : 'No critical emergencies'}
          trend={criticalCount > 0 ? 'down' : 'up'}
          timeframe="Lockout Priority"
          icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="ESTIMATED REPAIR EXPENSE"
          value={`$${totalCost.toLocaleString()}`}
          change="Parts & technician labor"
          trend="neutral"
          timeframe="CapEx Budget"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="COMPLETION RATE"
          value={`${totalTickets > 0 ? Math.round(((totalTickets - activeOrders) / totalTickets) * 100) : 100}%`}
          change="Resolved & load tested"
          trend="up"
          timeframe="SLA Compliance"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={tickets}
        searchPlaceholder="Search work orders by ticket #, machine name, tag, technician, status..."
      />
    </PageContainer>
  );
};
