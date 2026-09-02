import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, UserCheck, TrendingUp, CheckCircle2, Eye, Edit, Trash2, Calendar, HeartHandshake, ShieldCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IMembershipReport } from '../types';
import { toast } from 'sonner';

export const DEFAULT_MEMBERSHIP_REPORTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [reports, setReports] = useState<IMembershipReport[]>([]);

  useEffect(() => {
    loadReports();
  }, [activeBranchId]);

  const loadReports = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_membership_reports');
      const customList: IMembershipReport[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/reports/membership-reports', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IMembershipReport[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_MEMBERSHIP_REPORTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_membership_reports');
      const customList: IMembershipReport[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_MEMBERSHIP_REPORTS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    }
  };

  const handleDelete = (id: string, title: string) => {
    const updated = reports.filter((r) => (r.id || r._id) !== id);
    setReports(updated);

    const stored = localStorage.getItem('gymflow_custom_membership_reports');
    if (stored) {
      const customList: IMembershipReport[] = JSON.parse(stored);
      const filtered = customList.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem('gymflow_custom_membership_reports', JSON.stringify(filtered));
    }

    toast.success(`Membership report "${title}" removed`);
  };

  // Telemetry Metrics
  const totalActive = 1950;
  const totalSignups = reports.reduce((acc, curr) => acc + (curr.newSignups || 0), 0);
  const avgRetention = '95.6%';

  const columns: ColumnDef<IMembershipReport>[] = [
    {
      accessorKey: 'reportTitle',
      header: 'Report Title & Period Scope',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => navigate(`/reports/membership-reports/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
            >
              {row.original.reportTitle}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Calendar className="h-3 w-3 text-primary" />
              <span>{row.original.startDate} &rarr; {row.original.endDate}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reportingPeriod',
      header: 'Cadence',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-bold">
          {row.original.reportingPeriod}
        </Badge>
      ),
    },
    {
      accessorKey: 'activeMembers',
      header: 'Active & New Signups',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.activeMembers?.toLocaleString()} Active
          </span>
          <span className="text-[9px] text-emerald-600 font-mono font-bold">
            +{row.original.newSignups} New Signups
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'retentionRate',
      header: 'Retention Rate %',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            {row.original.retentionRate}%
          </span>
          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, row.original.retentionRate)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'churnRate',
      header: 'Churn Rate %',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 block">
            {row.original.churnRate}%
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            {row.original.cancellations} cancels / {row.original.frozenMemberships} freezes
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'auditedBy',
      header: 'CX Lead',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.auditorAvatar} alt={row.original.auditedBy} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.auditedBy.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.auditedBy}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'CERTIFIED' ? 'success' : 'secondary'} className="text-[9px] font-bold">
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
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/reports/membership-reports/${id}`)}
              title="View Membership Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/reports/membership-reports/${id}/edit`)}
              title="Edit Report"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.reportTitle)}
              title="Delete Report"
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
        title="Member Retention, Churn & Lifecycle Analytics"
        subtitle="Audit recurring subscription renewals, cohort churn velocity, new sign-up intake, and freeze conversions."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Period,Start,End,ActiveMembers,NewSignups,Renewals,RetentionRate,ChurnRate,Auditor,Status\n' + reports.map((r) => `"${r.reportTitle}","${r.reportingPeriod}","${r.startDate}","${r.endDate}","${r.activeMembers}","${r.newSignups}","${r.renewals}","${r.retentionRate}","${r.churnRate}","${r.auditedBy}","${r.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `membership-reports-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Membership reports exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/reports/membership-reports/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Generate Report</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ACTIVE ROSTER CENSUS"
          value={`${totalActive.toLocaleString()} Athletes`}
          change="Campus active database"
          trend="up"
          timeframe="Total Enrolled"
          icon={<UserCheck className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="AVERAGE RETENTION RATE"
          value={avgRetention}
          change="+4.2% vs industry standard"
          trend="up"
          timeframe="Contract Health"
          icon={<HeartHandshake className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="NEW SIGNUP VELOCITY"
          value={`+${totalSignups} Joins`}
          change="All acquisition channels"
          trend="up"
          timeframe="Intake Rate"
          icon={<UserPlus className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="MONTHLY CHURN"
          value="2.1% avg"
          change="Low attrition benchmark"
          trend="up"
          timeframe="Member Loyalty"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={reports}
        searchPlaceholder="Search membership reports by title, CX lead, cadence..."
      />
    </PageContainer>
  );
};
