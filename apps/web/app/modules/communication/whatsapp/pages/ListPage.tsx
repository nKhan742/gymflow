import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, MessageCircle, Send, CheckCircle2, Eye, Edit, Trash2, Smartphone, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IWhatsappTemplate } from '../types';
import { toast } from 'sonner';

export const DEFAULT_TEMPLATES: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [templates, setTemplates] = useState<IWhatsappTemplate[]>([]);

  useEffect(() => {
    loadTemplates();
  }, [activeBranchId]);

  const loadTemplates = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_whatsapp');
      const customList: IWhatsappTemplate[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/communication/whatsapp', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IWhatsappTemplate[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_TEMPLATES;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setTemplates(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_whatsapp');
      const customList: IWhatsappTemplate[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_TEMPLATES) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setTemplates(combined);
    }
  };

  const handleOpenWhatsAppDirect = (template: IWhatsappTemplate) => {
    const text = encodeURIComponent(template.bodyText.replace('{{1}}', 'Athlete').replace('{{2}}', 'A-102'));
    window.open(`https://wa.me/?text=${text}`, '_blank');
    toast.success('Opening WhatsApp Direct with preview payload...');
  };

  const handleDelete = (id: string, name: string) => {
    const updated = templates.filter((t) => (t.id || t._id) !== id);
    setTemplates(updated);

    const stored = localStorage.getItem('gymflow_custom_whatsapp');
    if (stored) {
      const customList: IWhatsappTemplate[] = JSON.parse(stored);
      const filtered = customList.filter((t) => (t.id || t._id) !== id);
      localStorage.setItem('gymflow_custom_whatsapp', JSON.stringify(filtered));
    }

    toast.success(`WhatsApp template "${name}" removed`);
  };

  // Telemetry Metrics
  const totalTemplates = templates.length;
  const approvedCount = templates.filter((t) => t.metaApprovalStatus === 'APPROVED').length;
  const totalSent = templates.reduce((acc, curr) => acc + (curr.messagesSent || 0), 0);
  const avgReadRate = '96.7%';

  const columns: ColumnDef<IWhatsappTemplate>[] = [
    {
      accessorKey: 'templateName',
      header: 'Meta Template & Payload',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-12 rounded-md overflow-hidden bg-muted border border-border shrink-0">
              <img
                src={row.original.headerMediaUrl}
                alt={row.original.templateName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5 max-w-[240px]">
              <button
                type="button"
                onClick={() => navigate(`/communication/whatsapp/${id}`)}
                className="font-mono font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
              >
                {row.original.templateName}
              </button>
              <p className="text-[10px] text-muted-foreground truncate">{row.original.bodyText}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category & Lang',
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-[9px] font-bold">
            {row.original.category}
          </Badge>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {row.original.language}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'metaApprovalStatus',
      header: 'Meta Status',
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="success" className="text-[9px] font-bold gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>{row.original.metaApprovalStatus}</span>
          </Badge>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block font-mono font-bold">
            ⭐ {row.original.qualityRating} QUALITY
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'messagesSent',
      header: 'Dispatched',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {row.original.messagesSent?.toLocaleString()}
          </span>
          <span className="text-[9px] text-muted-foreground block">Meta Delivered</span>
        </div>
      ),
    },
    {
      accessorKey: 'readRate',
      header: 'Read Rate %',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            {row.original.readRate}%
          </span>
          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, row.original.readRate)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'responseRate',
      header: 'Reply Rate %',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block">
            {row.original.responseRate}%
          </span>
          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(100, row.original.responseRate * 2)}%` }}
            />
          </div>
        </div>
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
              className="h-7 px-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 font-semibold"
              onClick={() => handleOpenWhatsAppDirect(row.original)}
              title="Test WhatsApp Direct Message"
            >
              <MessageCircle className="h-3 w-3 mr-0.5" />
              <span>wa.me</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/communication/whatsapp/${id}`)}
              title="View WhatsApp Template Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/communication/whatsapp/${id}/edit`)}
              title="Edit Template"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.templateName)}
              title="Delete Template"
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
        title="WhatsApp Business Automation & Smart Concierge Bots"
        subtitle="Manage Meta Cloud API message templates, interactive quick-reply chatbots, turnstile access passes, and PT alerts."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Template,Category,Language,MetaStatus,Quality,Sent,ReadRate,ReplyRate\n' + templates.map((t) => `"${t.templateName}","${t.category}","${t.language}","${t.metaApprovalStatus}","${t.qualityRating}","${t.messagesSent}","${t.readRate}","${t.responseRate}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `whatsapp-templates-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('WhatsApp templates exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate('/communication/whatsapp/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Create Template</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="WHATSAPP TEMPLATES"
          value={`${approvedCount} / ${totalTemplates} Live`}
          change="100% Meta HSM Compliant"
          trend="up"
          timeframe="Meta Graph Cloud API"
          icon={<MessageCircle className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="AVERAGE READ RATE %"
          value={avgReadRate}
          change="+48.1% vs email benchmark"
          trend="up"
          timeframe="Message Delivery"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="INTERACTION RATE %"
          value="46.8%"
          change="Quick reply button taps"
          trend="up"
          timeframe="User Engagement"
          icon={<Sparkles className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="META GRAPH LATENCY"
          value="0.9s avg"
          change="Tier 1 Webhook verified"
          trend="up"
          timeframe="API Dispatch"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={templates}
        searchPlaceholder="Search WhatsApp templates by identifier, body text, category..."
      />
    </PageContainer>
  );
};
