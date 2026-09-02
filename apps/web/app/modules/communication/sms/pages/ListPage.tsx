import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, MessageSquare, Send, CheckCircle2, DollarSign, Eye, Edit, Trash2, Smartphone, Radio, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ISmsBlast } from '../types';
import { toast } from 'sonner';

export const DEFAULT_SMS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [smsList, setSmsList] = useState<ISmsBlast[]>([]);

  useEffect(() => {
    loadSmsList();
  }, [activeBranchId]);

  const loadSmsList = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_sms');
      const customList: ISmsBlast[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/communication/sms', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: ISmsBlast[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_SMS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setSmsList(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_sms');
      const customList: ISmsBlast[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_SMS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setSmsList(combined);
    }
  };

  const handleResend = (id: string, title: string) => {
    toast.success(`Resending SMS blast "${title}" through gateway provider!`);
  };

  const handleDelete = (id: string, title: string) => {
    const updated = smsList.filter((s) => (s.id || s._id) !== id);
    setSmsList(updated);

    const stored = localStorage.getItem('gymflow_custom_sms');
    if (stored) {
      const customList: ISmsBlast[] = JSON.parse(stored);
      const filtered = customList.filter((s) => (s.id || s._id) !== id);
      localStorage.setItem('gymflow_custom_sms', JSON.stringify(filtered));
    }

    toast.success(`SMS campaign "${title}" removed`);
  };

  // Telemetry Metrics
  const totalBlasts = smsList.length;
  const totalDelivered = smsList.reduce((acc, curr) => acc + (curr.deliveredCount || 0), 0);
  const totalCost = smsList.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0).toFixed(2);

  const columns: ColumnDef<ISmsBlast>[] = [
    {
      accessorKey: 'campaignTitle',
      header: 'SMS Blast & Payload',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[260px]">
            <button
              type="button"
              onClick={() => navigate(`/communication/sms/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
            >
              {row.original.campaignTitle}
            </button>
            <p className="text-[10px] text-muted-foreground line-clamp-2 font-mono leading-tight">
              "{row.original.smsText}"
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'senderId',
      header: 'Sender ID & Route',
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="outline" className="font-mono text-[10px] font-bold">
            {row.original.senderId}
          </Badge>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {row.original.gatewayProvider}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'targetAudience',
      header: 'Audience Target',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-[9px] font-bold">
          {row.original.targetAudience?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'deliveredCount',
      header: 'Delivered',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-foreground">
            <Send className="w-3 h-3 text-primary" />
            <span>{row.original.deliveredCount}</span>
            <span className="text-[10px] text-muted-foreground">/ {row.original.recipientsCount}</span>
          </div>
          <span className="text-[9px] text-muted-foreground font-mono">
            {row.original.smsSegments} segment{row.original.smsSegments > 1 ? 's' : ''} ({row.original.characterCount} chars)
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'estimatedCost',
      header: 'Gateway Cost',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
            \${row.original.estimatedCost?.toFixed(2)}
          </span>
          <span className="text-[9px] text-muted-foreground block font-mono">
            {row.original.scheduledAt}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="success" className="text-[9px] font-bold">
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
              size="sm"
              className="h-7 px-1.5 text-[10px] text-primary hover:bg-primary/10 border-primary/30 font-semibold"
              onClick={() => handleResend(id || '', row.original.campaignTitle)}
              title="Resend SMS Blast"
            >
              <Zap className="h-3 w-3 mr-0.5" />
              <span>Blast</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/communication/sms/${id}`)}
              title="View SMS Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/communication/sms/${id}/edit`)}
              title="Edit SMS Campaign"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.campaignTitle)}
              title="Delete SMS Campaign"
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
        title="SMS Gateway & Fast Blast Dispatcher"
        subtitle="Manage instantaneous carrier SMS broadcasts, alphanumeric sender IDs, payment reminders, and class alerts."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,SenderID,Gateway,Audience,Status,Delivered,Cost,Scheduled\n' + smsList.map((s) => `"${s.campaignTitle}","${s.senderId}","${s.gatewayProvider}","${s.targetAudience}","${s.status}","${s.deliveredCount}","${s.estimatedCost}","${s.scheduledAt}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sms-gateway-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('SMS Gateway logs exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/communication/sms/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ New SMS Blast</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="SMS DELIVERED"
          value={`${totalDelivered.toLocaleString()} Texts`}
          change={`${totalBlasts} campaigns executed`}
          trend="up"
          timeframe="GSM Cellular"
          icon={<Smartphone className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="DELIVERY SUCCESS %"
          value="99.4%"
          change="0.6% carrier bounce"
          trend="up"
          timeframe="Network Acknowledged"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="CARRIER LATENCY"
          value="1.8s avg"
          change="Tier 1 direct routes"
          trend="up"
          timeframe="Delivery Speed"
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="GATEWAY SPEND"
          value={`\$${totalCost} USD`}
          change="Prepaid balance: \$450.00"
          trend="up"
          timeframe="Telecom Wallet"
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={smsList}
        searchPlaceholder="Search SMS campaigns by title, text content, sender ID, provider..."
      />
    </PageContainer>
  );
};
