import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Dumbbell, DollarSign, CheckCircle2, Eye, Edit, Trash2, Calendar, Star, ShieldCheck, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrainerReport } from '../types';
import { toast } from 'sonner';

export const DEFAULT_TRAINER_REPORTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { activeBranchId } = useBranchStore();
  const [reports, setReports] = useState<ITrainerReport[]>([]);

  useEffect(() => {
    loadReports();
  }, [activeBranchId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_reports');
      const customList: ITrainerReport[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/reports/trainer-reports', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: ITrainerReport[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_TRAINER_REPORTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_trainer_reports');
      const customList: ITrainerReport[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_TRAINER_REPORTS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const updated = reports.filter((r) => (r.id || r._id) !== id);
    setReports(updated);

    const stored = localStorage.getItem('gymflow_custom_trainer_reports');
    if (stored) {
      const customList: ITrainerReport[] = JSON.parse(stored);
      const filtered = customList.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem('gymflow_custom_trainer_reports', JSON.stringify(filtered));
    }

    toast.success(`Trainer performance report for "${name}" removed`);
  };

  // Telemetry Metrics
  const totalPayouts = reports.reduce((acc, curr) => acc + (curr.coachCommissionPayout || 0), 0);
  const totalSessions = reports.reduce((acc, curr) => acc + (curr.totalSessionsConducted || 0), 0);
  const totalIntake = reports.reduce((acc, curr) => acc + (curr.grossBillingGenerated || 0), 0);

  const columns: ColumnDef<ITrainerReport>[] = [
    {
      accessorKey: 'trainerName',
      header: 'Trainer & Specialty',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0">
              <AvatarImage src={row.original.trainerAvatar} alt={row.original.trainerName} />
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                {row.original.trainerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[200px]">
              <button
                type="button"
                onClick={() => navigate(`/reports/trainer-reports/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
              >
                {row.original.trainerName}
              </button>
              <p className="text-[10px] text-muted-foreground truncate">{row.original.trainerSpecialty}</p>
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
      accessorKey: 'totalSessionsConducted',
      header: 'Rendered Hours',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.totalSessionsConducted} Sessions
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            {row.original.totalHoursRendered} Clock Hours
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'coachCommissionPayout',
      header: 'Coach 60% Payout',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            ${row.original.coachCommissionPayout?.toLocaleString()} USD
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            ${row.original.grossBillingGenerated?.toLocaleString()} Gross Intake
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'clientSatisfactionRating',
      header: 'Rating',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-mono font-bold text-amber-500 border-amber-500/30 gap-1">
          <Star className="h-3 w-3 fill-amber-500" />
          <span>{row.original.clientSatisfactionRating}</span>
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Payroll Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'APPROVED_FOR_PAYROLL' ? 'success' : 'secondary'} className="text-[9px] font-bold">
          {row.original.status === 'APPROVED_FOR_PAYROLL' ? 'APPROVED' : row.original.status}
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
              onClick={() => navigate(`/reports/trainer-reports/${id}`)}
              title="View Trainer Audit Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/reports/trainer-reports/${id}/edit`)}
              title="Edit Report"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.trainerName)}
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
        title="Trainer Productivity & Commission Reports"
        subtitle="Audit coach session banks, 60/40 facility splits, client satisfaction scores, and authorized payroll disbursements."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Trainer,Specialty,Period,Start,End,Sessions,GrossIntake,Commission60,Rating,Status\n' + reports.map((r) => `"${r.trainerName}","${r.trainerSpecialty}","${r.reportingPeriod}","${r.startDate}","${r.endDate}","${r.totalSessionsConducted}","${r.grossBillingGenerated}","${r.coachCommissionPayout}","${r.clientSatisfactionRating}","${r.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `trainer-reports-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Trainer commission reports exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/reports/trainer-reports/create')}
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
          title="COACH COMMISSIONS PAID"
          value={`$${totalPayouts.toLocaleString()} USD`}
          change="60% coach contractual split"
          trend="up"
          timeframe="Disbursements"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="COMPLETED PT SESSIONS"
          value={`${totalSessions} Sessions`}
          change="100% attendance verified"
          trend="up"
          timeframe="Coaching Volume"
          icon={<Dumbbell className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="GROSS PT REVENUE"
          value={`$${totalIntake.toLocaleString()} USD`}
          change="40% facility retained share"
          trend="up"
          timeframe="Gross Intake"
          icon={<Award className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="CLIENT SATISFACTION"
          value="4.91 / 5.0"
          change="Post-workout rating score"
          trend="up"
          timeframe="Service Quality"
          icon={<Star className="h-5 w-5 text-amber-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={reports}
        loading={loading}
        searchPlaceholder="Search trainer reports by coach name, specialty, cadence..."
      />
    </PageContainer>
  );
};
