import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, PhoneCall, MessageSquare, Phone, Mail, Calendar, Flame, CheckCircle2, Eye, Edit, Trash2, Clock, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IFollowUp } from '../types';
import { toast } from 'sonner';

export const DEFAULT_FOLLOW_UPS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [followUps, setFollowUps] = useState<IFollowUp[]>([]);

  useEffect(() => {
    loadFollowUps();
  }, [activeBranchId]);

  const loadFollowUps = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_follow_ups');
      const customList: IFollowUp[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/follow-ups', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IFollowUp[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_FOLLOW_UPS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setFollowUps(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_follow_ups');
      const customList: IFollowUp[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_FOLLOW_UPS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setFollowUps(combined);
    }
  };

  const handleMarkWon = (id: string, name: string) => {
    const updated = followUps.map((f) => {
      if ((f.id || f._id) === id) {
        return {
          ...f,
          outcome: 'WON_CONVERTED' as IFollowUp['outcome'],
        };
      }
      return f;
    });
    setFollowUps(updated);

    const stored = localStorage.getItem('gymflow_custom_follow_ups');
    if (stored) {
      const customList: IFollowUp[] = JSON.parse(stored);
      const updatedCustom = customList.map((f) => {
        if ((f.id || f._id) === id) {
          return {
            ...f,
            outcome: 'WON_CONVERTED' as IFollowUp['outcome'],
          };
        }
        return f;
      });
      localStorage.setItem('gymflow_custom_follow_ups', JSON.stringify(updatedCustom));
    }

    toast.success(`Follow-up outcome marked WON for ${name}!`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = followUps.filter((f) => (f.id || f._id) !== id);
    setFollowUps(updated);

    const stored = localStorage.getItem('gymflow_custom_follow_ups');
    if (stored) {
      const customList: IFollowUp[] = JSON.parse(stored);
      const filtered = customList.filter((f) => (f.id || f._id) !== id);
      localStorage.setItem('gymflow_custom_follow_ups', JSON.stringify(filtered));
    }

    toast.success(`Follow-up task for "${name}" deleted`);
  };

  // Telemetry
  const totalCadences = followUps.length;
  const urgentTasks = followUps.filter((f) => f.priority === 'URGENT' && f.outcome === 'PENDING').length;
  const wonOutcomes = followUps.filter((f) => f.outcome === 'WON_CONVERTED').length;
  const pendingOutcomes = followUps.filter((f) => f.outcome === 'PENDING').length;

  const columns: ColumnDef<IFollowUp>[] = [
    {
      accessorKey: 'contactName',
      header: 'Prospect / Member',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0">
              <AvatarImage src={row.original.avatarUrl} alt={row.original.contactName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {row.original.contactName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <button
                type="button"
                onClick={() => navigate(`/crm/follow-ups/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.contactName}
              </button>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="truncate">{row.original.email}</span>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'channel',
      header: 'Channel & Target',
      cell: ({ row }) => {
        const ch = row.original.channel;
        return (
          <div className="space-y-1">
            <Badge
              className={
                ch === 'WHATSAPP'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold gap-1'
                  : ch === 'PHONE_CALL'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-bold gap-1'
                  : 'bg-muted text-muted-foreground text-[10px]'
              }
            >
              {ch === 'WHATSAPP' && <MessageSquare className="w-3 h-3" />}
              {ch === 'PHONE_CALL' && <Phone className="w-3 h-3" />}
              {ch?.replace(/_/g, ' ') || 'OUTREACH'}
            </Badge>
            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{row.original.scheduledDate} @ {row.original.scheduledTime}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Urgency',
      cell: ({ row }) => {
        const p = row.original.priority;
        return (
          <Badge
            className={
              p === 'URGENT'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-bold gap-1'
                : p === 'NORMAL'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold'
                : 'text-[10px] text-muted-foreground'
            }
          >
            {p === 'URGENT' && <Flame className="w-3 h-3" />}
            {p}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'assignedRep',
      header: 'Assigned Rep',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground truncate block">
          {row.original.assignedRep}
        </span>
      ),
    },
    {
      accessorKey: 'outcome',
      header: 'Touchpoint Outcome',
      cell: ({ row }) => {
        const o = row.original.outcome;
        return (
          <Badge
            variant={
              o === 'WON_CONVERTED'
                ? 'success'
                : o === 'CONNECTED_SCHEDULED'
                ? 'default'
                : o === 'PENDING'
                ? 'warning'
                : 'secondary'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {o?.replace(/_/g, ' ') || 'PENDING'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const isPending = row.original.outcome === 'PENDING';
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 gap-1 font-semibold"
              onClick={() => {
                const cleanPhone = (row.original.phone || '').replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(row.original.contactName)}%2C%20following%20up%20from%20GymFlow!`, '_blank');
              }}
              title="Trigger WhatsApp Outbound"
            >
              <MessageSquare className="h-3 w-3" />
              <span>Reach</span>
            </Button>
            {isPending && (
              <Button
                size="sm"
                className="h-7 px-2 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                onClick={() => handleMarkWon(id || '', row.original.contactName)}
                title="Mark Won & Converted"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Won</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/follow-ups/${id}`)}
              title="View Follow-Up Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/follow-ups/${id}/edit`)}
              title="Edit Follow-Up Task"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.contactName)}
              title="Delete Follow-Up"
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
        title="Automated Sales Follow-Ups & Cadences"
        subtitle="Manage multi-channel prospect communications, task deadlines, call schedules, and won conversions."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Contact,Phone,Email,Channel,Date,Time,Priority,Rep,Outcome\n' + followUps.map((f) => `"${f.contactName}","${f.phone}","${f.email}","${f.channel}","${f.scheduledDate}","${f.scheduledTime}","${f.priority}","${f.assignedRep}","${f.outcome}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `follow-ups-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Follow-ups exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/crm/follow-ups/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Schedule Follow-Up</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL CADENCES"
          value={`${totalCadences}`}
          change="+32 scheduled"
          trend="up"
          timeframe="Outbound Pipeline"
          icon={<PhoneCall className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="URGENT ACTIONS PENDING"
          value={`${urgentTasks}`}
          change="Action required today"
          trend="up"
          timeframe="High Priority Leads"
          icon={<Flame className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="WON CONVERSIONS"
          value={`${wonOutcomes}`}
          change={`${totalCadences > 0 ? Math.round((wonOutcomes / totalCadences) * 100) : 0}% Conversion Rate`}
          trend="up"
          timeframe="Closed Deals"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="PENDING TOUCHPOINTS"
          value={`${pendingOutcomes}`}
          change="Awaiting outreach"
          trend="neutral"
          timeframe="Upcoming Queue"
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={followUps}
        searchPlaceholder="Search follow-ups by contact name, rep, channel, outcome..."
      />
    </PageContainer>
  );
};
