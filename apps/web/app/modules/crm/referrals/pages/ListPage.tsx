import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Gift, Users, Award, CheckCircle2, Eye, Edit, Trash2, Tag, ArrowRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IReferral } from '../types';
import { toast } from 'sonner';

export const DEFAULT_REFERRALS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { activeBranchId } = useBranchStore();
  const [referrals, setReferrals] = useState<IReferral[]>([]);

  useEffect(() => {
    loadReferrals();
  }, [activeBranchId]);

  const loadReferrals = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_referrals');
      const customList: IReferral[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/referrals', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IReferral[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_REFERRALS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReferrals(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_referrals');
      const customList: IReferral[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_REFERRALS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReferrals(combined);
    }
  };

  const handleApproveReward = (id: string, name: string) => {
    const updated = referrals.map((r) => {
      if ((r.id || r._id) === id) {
        return {
          ...r,
          rewardStatus: 'APPROVED_ISSUED' as IReferral['rewardStatus'],
          status: 'CONVERTED_MEMBER' as IReferral['status'],
        };
      }
      return r;
    });
    setReferrals(updated);

    const stored = localStorage.getItem('gymflow_custom_referrals');
    if (stored) {
      const customList: IReferral[] = JSON.parse(stored);
      const updatedCustom = customList.map((r) => {
        if ((r.id || r._id) === id) {
          return {
            ...r,
            rewardStatus: 'APPROVED_ISSUED' as IReferral['rewardStatus'],
            status: 'CONVERTED_MEMBER' as IReferral['status'],
          };
        }
        return r;
      });
      localStorage.setItem('gymflow_custom_referrals', JSON.stringify(updatedCustom));
    }

    toast.success(`Reward approved & credited for advocate ${name}!`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = referrals.filter((r) => (r.id || r._id) !== id);
    setReferrals(updated);

    const stored = localStorage.getItem('gymflow_custom_referrals');
    if (stored) {
      const customList: IReferral[] = JSON.parse(stored);
      const filtered = customList.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem('gymflow_custom_referrals', JSON.stringify(filtered));
    }

    toast.success(`Referral record for "${name}" deleted`);
  };

  // Telemetry
  const totalReferrals = referrals.length;
  const convertedCount = referrals.filter((r) => r.status === 'CONVERTED_MEMBER').length;
  const pendingRewards = referrals.filter((r) => r.rewardStatus === 'PENDING_QUALIFICATION').length;
  const winRate = totalReferrals > 0 ? Math.round((convertedCount / totalReferrals) * 100) : 0;

  const columns: ColumnDef<IReferral>[] = [
    {
      accessorKey: 'referrerName',
      header: 'Advocate Member',
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 border border-border shrink-0">
            <AvatarImage src={row.original.referrerAvatar} alt={row.original.referrerName} />
            <AvatarFallback className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
              {row.original.referrerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <span className="font-bold text-xs text-foreground block truncate">
              {row.original.referrerName}
            </span>
            <span className="text-[10px] text-muted-foreground block truncate">
              {row.original.referrerPhone}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'transition',
      header: '',
      cell: () => <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />,
    },
    {
      accessorKey: 'referredProspectName',
      header: 'Referred Prospect Friend',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 border border-border shrink-0">
              <AvatarImage src={row.original.referredProspectAvatar} alt={row.original.referredProspectName} />
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                {row.original.referredProspectName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <button
                type="button"
                onClick={() => navigate(`/crm/referrals/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.referredProspectName}
              </button>
              <span className="text-[10px] text-muted-foreground block truncate">
                {row.original.referredProspectPhone}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'referralCode',
      header: 'Tracking Code',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-[10px] font-bold bg-muted/40 gap-1">
          <Tag className="w-3 h-3 text-primary" />
          {row.original.referralCode}
        </Badge>
      ),
    },
    {
      accessorKey: 'rewardValue',
      header: 'Advocate Reward',
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-semibold text-foreground block truncate max-w-[180px]">
            {row.original.rewardValue}
          </span>
          <Badge
            variant={row.original.rewardStatus === 'APPROVED_ISSUED' ? 'success' : 'warning'}
            className="text-[9px] font-bold uppercase"
          >
            {row.original.rewardStatus?.replace(/_/g, ' ')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Stage',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === 'CONVERTED_MEMBER'
                ? 'success'
                : s === 'TOUR_BOOKED'
                ? 'default'
                : 'secondary'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ') || 'INVITED'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const isPending = row.original.rewardStatus === 'PENDING_QUALIFICATION';
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 gap-1 font-semibold"
              onClick={() => {
                const cleanPhone = (row.original.referredProspectPhone || '').replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(row.original.referredProspectName)}%2C%20welcome%20to%20GymFlow!%20Your%20friend%20${encodeURIComponent(row.original.referrerName)}%20referred%20you.`, '_blank');
              }}
              title="Message Referred Friend"
            >
              <MessageSquare className="h-3 w-3" />
              <span>Reach</span>
            </Button>
            {isPending && (
              <Button
                size="sm"
                className="h-7 px-2 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                onClick={() => handleApproveReward(id || '', row.original.referrerName)}
                title="Approve & Issue Reward"
              >
                <Gift className="h-3 w-3" />
                <span>Approve</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/referrals/${id}`)}
              title="View Referral Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/referrals/${id}/edit`)}
              title="Edit Referral"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.referredProspectName)}
              title="Delete Record"
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
        title="Member Peer Referrals & Rewards"
        subtitle="Manage peer-to-peer advocate programs, friend onboarding, and automated rewards payout tracking."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Referrer,ReferredFriend,Code,Reward,RewardStatus,Stage\n' + referrals.map((r) => `"${r.referrerName}","${r.referredProspectName}","${r.referralCode}","${r.rewardValue}","${r.rewardStatus}","${r.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `referrals-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Referrals exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/crm/referrals/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Log Referral</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL ADVOCATE REFERRALS"
          value={`${totalReferrals}`}
          change="+18 recorded this month"
          trend="up"
          timeframe="Peer Network"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="CONVERTED MEMBERS"
          value={`${convertedCount}`}
          change={`${winRate}% peer conversion rate`}
          trend="up"
          timeframe="Closed New Dues"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="PENDING REWARDS PAYOUT"
          value={`${pendingRewards}`}
          change="Pending qualification"
          trend="neutral"
          timeframe="Rewards Queue"
          icon={<Gift className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="ADVOCATE WIN RATE"
          value={`${winRate}%`}
          change="Highest ROI funnel"
          trend="up"
          timeframe="Viral Coefficient"
          icon={<Award className="h-5 w-5 text-amber-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={referrals}
        loading={loading}
        searchPlaceholder="Search referrals by member name, friend name, code, status..."
      />
    </PageContainer>
  );
};
