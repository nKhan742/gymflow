import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, UserPlus, Phone, Mail, ArrowUpRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

interface ILeadItem {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  source: 'WEBSITE' | 'WALK_IN' | 'INSTAGRAM' | 'REFERRAL' | 'GOOGLE_ADS';
  stage: 'NEW' | 'CONTACTED' | 'TRIAL_BOOKED' | 'VISITED' | 'CONVERTED' | 'LOST';
  assignedAgent: string;
  trialDate?: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<ILeadItem[]>([]);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('http://localhost:5000/api/v1/crm/leads', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          setLeads(json.data.items);
          return;
        }
      }
    } catch {}

    setLeads([
      {
        name: 'Michael Chang',
        email: 'm.chang@example.com',
        phone: '+1 (555) 302-8819',
        source: 'INSTAGRAM',
        stage: 'TRIAL_BOOKED',
        assignedAgent: 'Alex Vance',
        trialDate: 'Tomorrow at 10:00 AM',
        notes: 'Interested in VIP Platinum membership with 1-on-1 personal training.',
      },
      {
        name: 'Amanda Brooks',
        email: 'amanda.b@example.com',
        phone: '+1 (555) 714-2290',
        source: 'WEBSITE',
        stage: 'NEW',
        assignedAgent: 'Marcus Brody',
        notes: 'Inquired regarding corporate group memberships for 15+ employees.',
      },
    ]);
  };

  const columns: ColumnDef<ILeadItem>[] = [
    {
      accessorKey: 'name',
      header: 'Prospect Name',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground text-sm">{row.getValue('name')}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> {row.original.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Phone className="h-3 w-3 text-primary" /> {row.getValue('phone')}
        </span>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Acquisition Source',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px]">
          {row.getValue('source')}
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
              s === 'CONVERTED'
                ? 'success'
                : s === 'TRIAL_BOOKED'
                ? 'default'
                : s === 'VISITED'
                ? 'info'
                : s === 'CONTACTED'
                ? 'warning'
                : 'secondary'
            }
            className="text-xs"
          >
            {s.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'assignedAgent',
      header: 'Sales Rep',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground">{row.getValue('assignedAgent')}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/crm/leads/${row.original._id || '1'}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="CRM & Prospect Pipeline"
        subtitle="Manage new sales leads, trial workouts, automated follow-ups, and membership conversions."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export Pipeline</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/crm/leads/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add New Lead</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Prospects"
          value={`${leads.length}`}
          change="+14 new this week"
          trend="up"
          timeframe="Instagram & Website"
          icon={<UserPlus className="h-5 w-5" />}
        />
        <MetricCard
          title="Trial Conversion Rate"
          value="42.8%"
          change="+5.1%"
          trend="up"
          timeframe="Trial to Member"
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
        <MetricCard
          title="Scheduled Trials Today"
          value="4 Booked"
          change="Coach Alex & Marcus"
          trend="neutral"
          timeframe="Afternoon sessions"
          icon={<Phone className="h-5 w-5" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={leads}
        searchPlaceholder="Search leads by name, email, phone, stage..."
      />
    </PageContainer>
  );
};
