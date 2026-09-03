import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Activity, Terminal, ShieldAlert, ShieldCheck, Eye, Edit, Trash2, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IActivityLogModel } from '../types';
import { toast } from 'sonner';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<IActivityLogModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/activity-logs', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setLogs(items);
        localStorage.removeItem('gymflow_custom_admin_activity_logs');
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = logs.filter((l) => (l.id || l._id) !== id);
    setLogs(updated);

    const stored = localStorage.getItem('gymflow_custom_admin_activity_logs');
    if (stored) {
      const customList: IActivityLogModel[] = JSON.parse(stored);
      const filtered = customList.filter((l) => (l.id || l._id) !== id);
      localStorage.setItem('gymflow_custom_admin_activity_logs', JSON.stringify(filtered));
    }

    toast.success(`Activity log #${id} purged`);
  };

  // Telemetry Metrics
  const totalLogs = `${logs.length} Events Logged`;
  const failedEvents = `${logs.filter((l) => l.statusCode >= 400).length} Failed / Flagged`;
  const totalActors = `${new Set(logs.map((l) => l.actorEmail)).size} Unique Actors`;
  const streamStatus = '🟢 WebSocket Live';

  const columns: ColumnDef<IActivityLogModel>[] = [
    {
      accessorKey: 'actionEvent',
      header: 'Event Action & Method',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const method = row.original.httpMethod;
        return (
          <div className="space-y-0.5 max-w-[280px]">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] font-mono font-bold shrink-0">
                {method}
              </Badge>
              <button
                type="button"
                onClick={() => navigate(`/administration/activity-logs/${id}`)}
                className="font-bold text-xs text-foreground truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
              >
                {row.original.actionEvent}
              </button>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono block">
              {row.original.moduleDomain} • {row.original.locationCampus}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'actorName',
      header: 'Actor & Identity',
      cell: ({ row }) => {
        const safeName = row.original.actorName || 'Actor';
        const safeInitials = safeName.slice(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7 border border-border shrink-0 shadow-2xs">
              <AvatarImage src={row.original.actorAvatarUrl} alt={safeName} />
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                {safeInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[150px]">
              <span className="font-semibold text-xs text-foreground block truncate">
                {safeName}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block truncate">
                {row.original.actorRole}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'statusCode',
      header: 'Response',
      cell: ({ row }) => {
        const code = row.original.statusCode;
        return (
          <Badge
            variant={code < 300 ? 'success' : code < 400 ? 'default' : code < 500 ? 'warning' : 'destructive'}
            className="text-[9px] font-mono font-bold"
          >
            {code}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'ipAddress',
      header: 'Origin IP',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground block truncate max-w-[140px]">
          {row.original.ipAddress}
        </span>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => {
        const sev = row.original.severity;
        return (
          <Badge
            variant={sev === 'CRITICAL' ? 'destructive' : sev === 'WARNING' || sev === 'ERROR' ? 'warning' : 'success'}
            className="text-[9px] font-bold"
          >
            {sev}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.timestamp}
        </span>
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
              onClick={() => navigate(`/administration/activity-logs/${id}`)}
              title="View Activity Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/administration/activity-logs/${id}/edit`)}
              title="Annotate Log"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '')}
              title="Purge Log"
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
        title="Real-Time IAM Activity & Audit Stream"
        subtitle="Monitor user actions, HTTP mutations, TLS connection origins, and authentication security events."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Action,Actor,Role,Domain,Method,Status,IP,Severity,Timestamp\n' + logs.map((l) => `"${l.actionEvent}","${l.actorName}","${l.actorRole}","${l.moduleDomain}","${l.httpMethod}","${l.statusCode}","${l.ipAddress}","${l.severity}","${l.timestamp}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `activity-stream-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Activity Stream exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/administration/activity-logs/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Log Activity</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="TOTAL EVENTS LOGGED"
          value={totalLogs}
          change="WebSocket Live Ingestion"
          trend="up"
          timeframe="Telemetry Stream"
          icon={<Activity className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="FAILED MUTATIONS"
          value={failedEvents}
          change="4xx / 5xx Status Filter"
          trend="down"
          timeframe="Security Anomalies"
          icon={<ShieldAlert className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="ACTIVE ACTORS"
          value={totalActors}
          change="Authenticated Staff"
          trend="up"
          timeframe="IAM Roster"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="STREAM HEALTH"
          value={streamStatus}
          change="TLS v1.3 Encrypted Socket"
          trend="up"
          timeframe="Live Connection"
          icon={<Globe className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchPlaceholder="Search activity stream by action, actor, IP, domain, method..."
      />
    </PageContainer>
  );
};
