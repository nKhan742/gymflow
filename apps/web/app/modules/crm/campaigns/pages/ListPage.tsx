import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, Megaphone, DollarSign, Calendar, Users, CheckCircle2, Eye, Edit, Trash2, Tag, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ICampaign } from '../types';
import { toast } from 'sonner';

export const DEFAULT_CAMPAIGNS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);

  useEffect(() => {
    loadCampaigns();
  }, [activeBranchId]);

  const loadCampaigns = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_campaigns');
      const customList: ICampaign[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/campaigns', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: ICampaign[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_CAMPAIGNS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setCampaigns(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_campaigns');
      const customList: ICampaign[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_CAMPAIGNS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setCampaigns(combined);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string, name: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const updated = campaigns.map((c) => {
      if ((c.id || c._id) === id) {
        return {
          ...c,
          status: nextStatus as ICampaign['status'],
        };
      }
      return c;
    });
    setCampaigns(updated);

    const stored = localStorage.getItem('gymflow_custom_campaigns');
    if (stored) {
      const customList: ICampaign[] = JSON.parse(stored);
      const updatedCustom = customList.map((c) => {
        if ((c.id || c._id) === id) {
          return {
            ...c,
            status: nextStatus as ICampaign['status'],
          };
        }
        return c;
      });
      localStorage.setItem('gymflow_custom_campaigns', JSON.stringify(updatedCustom));
    }

    toast.success(`Campaign "${name}" is now ${nextStatus}!`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = campaigns.filter((c) => (c.id || c._id) !== id);
    setCampaigns(updated);

    const stored = localStorage.getItem('gymflow_custom_campaigns');
    if (stored) {
      const customList: ICampaign[] = JSON.parse(stored);
      const filtered = customList.filter((c) => (c.id || c._id) !== id);
      localStorage.setItem('gymflow_custom_campaigns', JSON.stringify(filtered));
    }

    toast.success(`Campaign "${name}" deleted`);
  };

  // Telemetry
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const totalLeads = campaigns.reduce((acc, c) => acc + (c.leadsGenerated || 0), 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + (c.spendToDate || 0), 0);

  const columns: ColumnDef<ICampaign>[] = [
    {
      accessorKey: 'name',
      header: 'Campaign & Creative',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            {row.original.bannerUrl && (
              <img
                src={row.original.bannerUrl}
                alt={row.original.name}
                className="h-10 w-16 rounded-md object-cover border border-border shrink-0 shadow-2xs"
              />
            )}
            <div className="truncate">
              <button
                type="button"
                onClick={() => navigate(`/crm/campaigns/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.name}
              </button>
              <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                <Tag className="h-3 w-3 text-primary shrink-0" />
                <span>CODE: <strong>{row.original.code}</strong></span>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'channel',
      header: 'Channel & Offer',
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px] font-semibold bg-muted/40 whitespace-nowrap">
            {row.original.channel?.replace(/_/g, ' ') || 'CHANNEL'}
          </Badge>
          <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">
            {row.original.discountOffer || 'General Promo'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'budgetTotal',
      header: 'Budget & Spend',
      cell: ({ row }) => {
        const percent = row.original.budgetTotal > 0 ? Math.round((row.original.spendToDate / row.original.budgetTotal) * 100) : 0;
        return (
          <div className="space-y-1 text-xs">
            <span className="font-mono font-bold text-foreground block">
              ${row.original.spendToDate.toLocaleString()} / ${row.original.budgetTotal.toLocaleString()}
            </span>
            <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'leadsGenerated',
      header: 'Attributed Leads',
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-bold text-foreground flex items-center gap-1">
            <Users className="h-3 w-3 text-primary" /> {row.original.leadsGenerated} Leads
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
            {row.original.conversionsCount} Enrolled Members
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Timeline Window',
      cell: ({ row }) => (
        <div className="text-[11px] font-mono text-muted-foreground space-y-0.5">
          <span className="block flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" /> {row.original.startDate}
          </span>
          <span className="block text-[10px]">to {row.original.endDate}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === 'ACTIVE'
                ? 'success'
                : s === 'COMPLETED'
                ? 'secondary'
                : 'warning'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const isActive = row.original.status === 'ACTIVE';
        return (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className={`h-7 px-2 text-[10px] font-semibold ${
                isActive ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
              onClick={() => handleToggleStatus(id || '', row.original.status, row.original.name)}
              title={isActive ? 'Pause Campaign' : 'Activate Campaign'}
            >
              {isActive ? 'Pause' : 'Activate'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/campaigns/${id}`)}
              title="View Campaign Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/campaigns/${id}/edit`)}
              title="Edit Campaign Parameters"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.name)}
              title="Delete Campaign"
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
        title="Marketing Campaigns & Lead Acquisition"
        subtitle="Manage omni-channel acquisition campaigns, promo voucher codes, ad spend ROI, and conversion metrics."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Name,Code,Channel,Budget,Spend,Leads,Conversions,StartDate,EndDate,Status\n' + campaigns.map((c) => `"${c.name}","${c.code}","${c.channel}","${c.budgetTotal}","${c.spendToDate}","${c.leadsGenerated}","${c.conversionsCount}","${c.startDate}","${c.endDate}","${c.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `campaigns-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Campaigns exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/crm/campaigns/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Launch Campaign</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL CAMPAIGNS"
          value={`${totalCampaigns}`}
          change="+3 launched this quarter"
          trend="up"
          timeframe="Acquisition Portfolios"
          icon={<Megaphone className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ACTIVE CAMPAIGNS"
          value={`${activeCampaigns}`}
          change="Currently delivering ads"
          trend="up"
          timeframe="Live Funnels"
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="ATTRIBUTED LEADS"
          value={`${totalLeads}`}
          change="Qualified prospects"
          trend="up"
          timeframe="Funnel Inflow"
          icon={<Users className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="TOTAL AD SPEND"
          value={`$${totalSpend.toLocaleString()}`}
          change="Tracked across channels"
          trend="neutral"
          timeframe="Marketing Budget"
          icon={<DollarSign className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={campaigns}
        searchPlaceholder="Search campaigns by name, voucher code, channel, status..."
      />
    </PageContainer>
  );
};
