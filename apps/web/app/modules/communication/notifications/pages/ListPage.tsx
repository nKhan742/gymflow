import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Bell, Send, CheckCircle2, AlertTriangle, Eye, Edit, Trash2, Tag, Smartphone, Radio, Users, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { INotification } from '../types';
import { toast } from 'sonner';

export const DEFAULT_NOTIFICATIONS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, [activeBranchId]);

  const loadNotifications = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_notifications');
      const customList: INotification[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/communication/notifications', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: INotification[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_NOTIFICATIONS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setNotifications(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_notifications');
      const customList: INotification[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_NOTIFICATIONS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setNotifications(combined);
    }
  };

  const handleResend = (id: string, title: string) => {
    toast.success(`Broadcasting live push alert: "${title}"!`);
  };

  const handleDelete = (id: string, title: string) => {
    const updated = notifications.filter((n) => (n.id || n._id) !== id);
    setNotifications(updated);

    const stored = localStorage.getItem('gymflow_custom_notifications');
    if (stored) {
      const customList: INotification[] = JSON.parse(stored);
      const filtered = customList.filter((n) => (n.id || n._id) !== id);
      localStorage.setItem('gymflow_custom_notifications', JSON.stringify(filtered));
    }

    toast.success(`Notification alert "${title}" deleted`);
  };

  // Telemetry Metrics
  const totalNotifications = notifications.length;
  const totalRecipients = notifications.reduce((acc, curr) => acc + (curr.totalRecipients || 0), 0);
  const totalReads = notifications.reduce((acc, curr) => acc + (curr.readCount || 0), 0);
  const avgReadRate = totalRecipients > 0 ? ((totalReads / totalRecipients) * 100).toFixed(1) : '84.2';

  const columns: ColumnDef<INotification>[] = [
    {
      accessorKey: 'title',
      header: 'Alert Payload',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-12 rounded-md overflow-hidden bg-muted border border-border shrink-0">
              <img
                src={row.original.bannerPhoto}
                alt={row.original.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5 max-w-[240px]">
              <button
                type="button"
                onClick={() => navigate(`/communication/notifications/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.title}
              </button>
              <p className="text-[10px] text-muted-foreground truncate">{row.original.message}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category & Channel',
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-[9px] font-bold">
            {row.original.category?.replace(/_/g, ' ')}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
            <Smartphone className="w-3 h-3 text-primary" />
            {row.original.channel?.replace(/_/g, ' ')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const p = row.original.priority;
        return (
          <Badge
            variant={
              p === 'CRITICAL'
                ? 'destructive'
                : p === 'HIGH'
                ? 'warning'
                : p === 'MEDIUM'
                ? 'default'
                : 'secondary'
            }
            className="text-[9px] font-bold uppercase"
          >
            {p}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'targetAudience',
      header: 'Audience & Scope',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Users className="w-3 h-3 text-primary" />
            <span>{row.original.targetAudience?.replace(/_/g, ' ')}</span>
          </div>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {row.original.branchName || 'PD Vihar'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'readCount',
      header: 'Read Telemetry',
      cell: ({ row }) => {
        const rate = row.original.totalRecipients > 0
          ? ((row.original.readCount / row.original.totalRecipients) * 100).toFixed(0)
          : '0';
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
              <span>{row.original.readCount}</span>
              <span className="text-muted-foreground font-normal">/ {row.original.totalRecipients}</span>
            </div>
            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, Number(rate))}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">{rate}% Read</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'deliveryStatus',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.deliveryStatus === 'SENT' ? 'success' : 'secondary'} className="text-[9px] font-bold">
          {row.original.deliveryStatus}
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
              size="sm"
              className="h-7 px-1.5 text-[10px] text-primary hover:bg-primary/10 border-primary/30 font-semibold"
              onClick={() => handleResend(id || '', row.original.title)}
              title="Resend / Push Broadcast"
            >
              <Send className="h-3 w-3 mr-0.5" />
              <span>Push</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/communication/notifications/${id}`)}
              title="View Notification Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/communication/notifications/${id}/edit`)}
              title="Edit Notification"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.title)}
              title="Delete Notification"
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
        title="In-App Push Notifications & Live Alerts"
        subtitle="Manage instantaneous mobile push notifications, sound chimes, turnstile warnings, and emergency broadcast dispatches."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Category,Priority,Audience,Channel,Status,ReadCount,TotalRecipients,Author\n' + notifications.map((n) => `"${n.title}","${n.category}","${n.priority}","${n.targetAudience}","${n.channel}","${n.deliveryStatus}","${n.readCount}","${n.totalRecipients}","${n.authorName}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `notifications-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Notifications exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/communication/notifications/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Broadcast Alert</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL ALERTS DISPATCHED"
          value={`${totalRecipients.toLocaleString()} Delivered`}
          change={`${totalNotifications} campaign blasts`}
          trend="up"
          timeframe="Live Push Gateway"
          icon={<Bell className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="AVERAGE READ / OPEN %"
          value={`${avgReadRate}%`}
          change="+4.1% mobile interaction"
          trend="up"
          timeframe="Member Engagement"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="ACTIVE PUSH CHANNELS"
          value="3 Online"
          change="Apple APNs + Google FCM"
          trend="up"
          timeframe="Gateway Infrastructure"
          icon={<Radio className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="CRITICAL ESCALATIONS"
          value="0 Pending"
          change="100% gateway throughput"
          trend="up"
          timeframe="Security Readiness"
          icon={<ShieldAlert className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        searchPlaceholder="Search notifications by title, category, priority, audience, author..."
      />
    </PageContainer>
  );
};
