import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Sparkles, Phone, Mail, QrCode, CheckCircle2, UserCheck, Eye, Edit, Trash2, Calendar, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrialMember } from '../types';
import { toast } from 'sonner';

export const DEFAULT_TRIALS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [trials, setTrials] = useState<ITrialMember[]>([]);

  useEffect(() => {
    loadTrials();
  }, [activeBranchId]);

  const loadTrials = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_trial_members');
      const customTrials: ITrialMember[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/trial-members', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedTrials: ITrialMember[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedTrials = json.data.items;
        }
      }

      const combined = [...customTrials];
      const allSources = fetchedTrials.length > 0 ? fetchedTrials : DEFAULT_TRIALS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setTrials(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_trial_members');
      const customTrials: ITrialMember[] = stored ? JSON.parse(stored) : [];
      const combined = [...customTrials];
      for (const item of DEFAULT_TRIALS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setTrials(combined);
    }
  };

  const handleIncrementCheckIn = (id: string, currentCount: number, maxAllowed: number, name: string) => {
    if (currentCount >= maxAllowed) {
      toast.error(`Trial pass limit reached (${maxAllowed}/${maxAllowed} entries used)!`, {
        description: 'Please convert guest to full membership.',
      });
      return;
    }

    const updated = trials.map((t) => {
      if ((t.id || t._id) === id) {
        const newCount = t.checkInCount + 1;
        return {
          ...t,
          checkInCount: newCount,
          status: (newCount >= t.maxAllowedCheckIns ? 'EXPIRED' : t.status) as ITrialMember['status'],
        };
      }
      return t;
    });
    setTrials(updated);

    const stored = localStorage.getItem('gymflow_custom_trial_members');
    if (stored) {
      const customList: ITrialMember[] = JSON.parse(stored);
      const updatedCustom = customList.map((t) => {
        if ((t.id || t._id) === id) {
          const newCount = t.checkInCount + 1;
          return {
            ...t,
            checkInCount: newCount,
            status: (newCount >= t.maxAllowedCheckIns ? 'EXPIRED' : t.status) as ITrialMember['status'],
          };
        }
        return t;
      });
      localStorage.setItem('gymflow_custom_trial_members', JSON.stringify(updatedCustom));
    }

    toast.success(`Turnstile access granted for ${name}!`, {
      description: `Check-in recorded (${currentCount + 1}/${maxAllowed} entries used).`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    const updated = trials.filter((t) => (t.id || t._id) !== id);
    setTrials(updated);

    const stored = localStorage.getItem('gymflow_custom_trial_members');
    if (stored) {
      const customList: ITrialMember[] = JSON.parse(stored);
      const filtered = customList.filter((t) => (t.id || t._id) !== id);
      localStorage.setItem('gymflow_custom_trial_members', JSON.stringify(filtered));
    }

    toast.success(`Trial pass for "${name}" deleted`);
  };

  const handleConvertToMember = (trial: ITrialMember) => {
    toast.success(`Converting trial guest "${trial.guestName}" to Full Member...`);
    navigate('/member-management/members/create', {
      state: {
        prefill: {
          fullName: trial.guestName,
          email: trial.email,
          phone: trial.phone,
          avatarUrl: trial.avatarUrl,
        },
      },
    });
  };

  // Telemetry
  const totalPasses = trials.length;
  const activePasses = trials.filter((t) => t.status === 'ACTIVE').length;
  const convertedPasses = trials.filter((t) => t.status === 'CONVERTED').length;
  const totalCheckIns = trials.reduce((sum, t) => sum + (t.checkInCount || 0), 0);

  const columns: ColumnDef<ITrialMember>[] = [
    {
      accessorKey: 'guestName',
      header: 'Trial Guest',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0">
              <AvatarImage src={row.original.avatarUrl} alt={row.original.guestName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {row.original.guestName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <button
                type="button"
                onClick={() => navigate(`/crm/trial-members/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.guestName}
              </button>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                <QrCode className="h-3 w-3 text-primary shrink-0" />
                <span>{row.original.passCode}</span>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'passType',
      header: 'Pass Package',
      cell: ({ row }) => (
        <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-bold whitespace-nowrap">
          {row.original.passType?.replace(/_/g, ' ') || 'DAY PASS'}
        </Badge>
      ),
    },
    {
      accessorKey: 'checkInCount',
      header: 'Turnstile Usage',
      cell: ({ row }) => {
        const count = row.original.checkInCount || 0;
        const max = row.original.maxAllowedCheckIns || 1;
        const pct = Math.min((count / max) * 100, 100);
        return (
          <div className="space-y-1 w-28">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-foreground">{count} / {max}</span>
              <span className="text-muted-foreground text-[10px]">{Math.round(pct)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pct >= 100 ? 'bg-rose-500' : pct >= 50 ? 'bg-amber-500' : 'bg-primary'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'endDate',
      header: 'Validity Window',
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-mono text-muted-foreground block text-[11px]">
            {row.original.startDate} → {row.original.endDate}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            {row.original.branchName || 'PD Vihar'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'sponsorTrainer',
      header: 'Sponsor Coach',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground truncate block">
          {row.original.sponsorTrainer}
        </span>
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
                : s === 'CONVERTED'
                ? 'default'
                : s === 'EXPIRED'
                ? 'warning'
                : 'destructive'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ') || 'ACTIVE'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const count = row.original.checkInCount || 0;
        const max = row.original.maxAllowedCheckIns || 1;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[10px] gap-1 text-primary hover:bg-primary/10 border-primary/30 font-semibold"
              onClick={() => handleIncrementCheckIn(id || '', count, max, row.original.guestName)}
              title="Record +1 Turnstile Entry"
            >
              <QrCode className="h-3 w-3" />
              <span>+1 Entry</span>
            </Button>
            <Button
              size="sm"
              className="h-7 px-2 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
              onClick={() => handleConvertToMember(row.original)}
              title="1-Click Convert to Member"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Convert</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/trial-members/${id}`)}
              title="View Trial Passport"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/trial-members/${id}/edit`)}
              title="Edit Trial Pass"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.guestName)}
              title="Delete Pass"
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
        title="VIP Trial Members & Passports"
        subtitle="Manage prospective member experience passes, turnstile entry quotas, and conversion funnels."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Guest,PassCode,Package,CheckIns,Max,Status,Sponsor\n' + trials.map((t) => `"${t.guestName}","${t.passCode}","${t.passType}",${t.checkInCount},${t.maxAllowedCheckIns},"${t.status}","${t.sponsorTrainer}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `trial-passports-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Trial Passports exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/crm/trial-members/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Issue VIP Trial Pass</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL PASSES ISSUED"
          value={`${totalPasses}`}
          change="+24% vs last month"
          trend="up"
          timeframe="Guest Passports"
          icon={<Sparkles className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="ACTIVE ON PREMISES"
          value={`${activePasses}`}
          change="Eligible for check-in"
          trend="up"
          timeframe="Valid Passports"
          icon={<QrCode className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="CONVERTED TO MEMBERS"
          value={`${convertedPasses}`}
          change={`${totalPasses > 0 ? Math.round((convertedPasses / totalPasses) * 100) : 0}% Conversion Rate`}
          trend="up"
          timeframe="Won Deals"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="TOTAL TURNSTILE ENTRIES"
          value={`${totalCheckIns}`}
          change="Verified at entrance"
          trend="neutral"
          timeframe="Facility Visits"
          icon={<UserCheck className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={trials}
        searchPlaceholder="Search trial passes by guest name, passcode, sponsor coach..."
      />
    </PageContainer>
  );
};
