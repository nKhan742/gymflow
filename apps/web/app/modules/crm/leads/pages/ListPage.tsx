import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, UserPlus, Phone, Mail, ArrowUpRight, Eye, Edit, Trash2, MessageSquare, Sparkles, DollarSign, Target, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ILead } from '../types';
import { toast } from 'sonner';

export const DEFAULT_LEADS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [leads, setLeads] = useState<ILead[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  useEffect(() => {
    loadLeads();
  }, [activeBranchId]);

  const loadLeads = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_leads');
      const customLeads: ILead[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/leads', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedLeads: ILead[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedLeads = json.data.items;
        }
      }

      // Combine custom local storage items with defaults / API items
      const combined = [...customLeads];
      const allSources = fetchedLeads.length > 0 ? fetchedLeads : DEFAULT_LEADS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }

      setLeads(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_leads');
      const customLeads: ILead[] = stored ? JSON.parse(stored) : [];
      const combined = [...customLeads];
      for (const item of DEFAULT_LEADS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setLeads(combined);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const updated = leads.filter((l) => (l.id || l._id) !== id);
    setLeads(updated);

    const stored = localStorage.getItem('gymflow_custom_leads');
    if (stored) {
      const customLeads: ILead[] = JSON.parse(stored);
      const filtered = customLeads.filter((l) => (l.id || l._id) !== id);
      localStorage.setItem('gymflow_custom_leads', JSON.stringify(filtered));
    }

    toast.success(`Prospect Lead "${name}" deleted`);
  };

  const handleConvertToMember = (lead: ILead) => {
    toast.success(`Converting "${lead.name}" to Full Member...`, {
      description: 'Redirecting to Membership Onboarding...',
    });
    navigate('/member-management/members/create', {
      state: {
        prefill: {
          fullName: lead.name,
          email: lead.email,
          phone: lead.phone,
          avatarUrl: lead.avatarUrl,
          leadId: lead.id || lead._id,
        },
      },
    });
  };

  // Filter by stage
  const filteredData = selectedStage === 'ALL'
    ? leads
    : leads.filter((l) => l.stage === selectedStage);

  // Dynamic Telemetry
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.priority === 'HOT').length;
  const wonMembers = leads.filter((l) => l.stage === 'WON_MEMBER').length;
  const totalPipelineLtv = leads.reduce((sum, l) => sum + (l.estimatedLtv || (l.targetBudgetMonthly || 149) * 12), 0);

  const columns: ColumnDef<ILead>[] = [
    {
      accessorKey: 'name',
      header: 'Prospect Profile',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0">
              <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {row.original.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <button
                type="button"
                onClick={() => navigate(`/crm/leads/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.name}
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
      accessorKey: 'phone',
      header: 'Rapid Contact',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="text-xs font-mono text-foreground flex items-center gap-1">
            <Phone className="h-3 w-3 text-primary shrink-0" /> {row.original.phone}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 gap-1"
              onClick={() => {
                const cleanPhone = (row.original.phone || '').replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(row.original.name)}%2C%20welcome%20to%20GymFlow!`, '_blank');
              }}
            >
              <MessageSquare className="h-3 w-3" />
              <span>WhatsApp</span>
            </Button>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-semibold bg-muted/40 text-foreground whitespace-nowrap">
          {row.original.source?.replace(/_/g, ' ') || 'DIRECT'}
        </Badge>
      ),
    },
    {
      accessorKey: 'stage',
      header: 'Pipeline Stage',
      cell: ({ row }) => {
        const s = row.original.stage;
        return (
          <Badge
            variant={
              s === 'WON_MEMBER'
                ? 'success'
                : s === 'VIP_TRIAL_ACTIVE' || s === 'TOUR_SCHEDULED'
                ? 'default'
                : s === 'NEGOTIATION'
                ? 'info'
                : s === 'CONTACTED'
                ? 'warning'
                : 'secondary'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ') || 'NEW'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Intent Level',
      cell: ({ row }) => {
        const p = row.original.priority;
        return (
          <div className="flex items-center gap-1.5">
            {p === 'HOT' && (
              <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-bold gap-1">
                🔥 Hot
              </Badge>
            )}
            {p === 'WARM' && (
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold gap-1">
                ⚡ Warm
              </Badge>
            )}
            {p === 'COLD' && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                ❄️ Cold
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'targetBudgetMonthly',
      header: 'Budget & LTV',
      cell: ({ row }) => (
        <div className="space-y-0.5 font-mono">
          <span className="font-bold text-xs text-foreground block">
            ${row.original.targetBudgetMonthly || 149} <span className="text-[10px] text-muted-foreground font-sans">/mo</span>
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
            ${row.original.estimatedLtv || (row.original.targetBudgetMonthly || 149) * 12} LTV
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'assignedAgent',
      header: 'Assigned Rep',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground truncate block">
          {row.original.assignedAgent || 'Sales Desk'}
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
              size="sm"
              className="h-7 px-2 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
              onClick={() => handleConvertToMember(row.original)}
              title="1-Click Convert to Full Member"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Convert</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/leads/${id}`)}
              title="View 360° Lead Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/leads/${id}/edit`)}
              title="Edit Lead Parameters"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.name)}
              title="Delete Lead"
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
        title="CRM & Prospect Pipeline"
        subtitle="Track incoming sales prospects, fitness goals, multi-channel discovery, and membership conversions."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Name,Email,Phone,Source,Stage,Priority,Budget\n' + leads.map((l) => `"${l.name}","${l.email}","${l.phone}","${l.source}","${l.stage}","${l.priority}",${l.targetBudgetMonthly}`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Leads CSV exported successfully');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/crm/leads/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Prospect Lead</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL PIPELINE"
          value={`${totalLeads}`}
          change="+18% vs last month"
          trend="up"
          timeframe="All Intake Channels"
          icon={<UserPlus className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="HIGH INTENT (HOT)"
          value={`${hotLeads}`}
          change="Ready to enroll"
          trend="up"
          timeframe="Active Proposals"
          icon={<Sparkles className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="WON MEMBERS"
          value={`${wonMembers}`}
          change="Converted from leads"
          trend="up"
          timeframe="Current Cohort"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="PIPELINE LTV VALUE"
          value={`$${(totalPipelineLtv / 1000).toFixed(1)}k`}
          change="Estimated 12-Mo Revenue"
          trend="up"
          timeframe="Annual Contract Value"
          icon={<DollarSign className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Quick Stage Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1.5 rounded-xl border border-border/60">
        {[
          { label: 'All Prospects', value: 'ALL' },
          { label: '🆕 New Inquiry', value: 'NEW_INQUIRY' },
          { label: '📞 Contacted', value: 'CONTACTED' },
          { label: '🏛️ Tour Scheduled', value: 'TOUR_SCHEDULED' },
          { label: '🎟️ VIP Trial Active', value: 'VIP_TRIAL_ACTIVE' },
          { label: '💬 Negotiation', value: 'NEGOTIATION' },
          { label: '🎉 Won Members', value: 'WON_MEMBER' },
        ].map((st) => (
          <button
            key={st.value}
            type="button"
            onClick={() => setSelectedStage(st.value)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedStage === st.value
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Search leads by name, email, phone, sales rep..."
      />
    </PageContainer>
  );
};
