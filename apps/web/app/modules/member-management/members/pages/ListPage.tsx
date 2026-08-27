import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tooltip } from '../../../../shared/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Users,
  UserPlus,
  Download,
  Eye,
  Edit2,
  Snowflake,
  Activity,
  CheckCircle2,
  Calendar,
  Clock,
  MoreHorizontal,
  RotateCw,
  CreditCard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { memberApi, IMemberItem } from '../api/memberApi';
import { toast } from 'sonner';

export const ListPage: React.FC = () => {
  const [members, setMembers] = useState<IMemberItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    loadMembers();
  }, [statusFilter]);

  const loadMembers = async () => {
    const data = await memberApi.getMembers({ status: statusFilter });
    setMembers(data);
  };

  const handleFastCheckIn = async (e: React.MouseEvent, member: IMemberItem) => {
    e.stopPropagation();
    await memberApi.checkInMember(member.memberCode);
    toast.success(`Check-in verified for ${member.firstName} ${member.lastName}`, {
      description: `Turnstile access granted • ${member.membership?.tier || 'Member'}`,
    });
    loadMembers();
  };

  const handleFreeze = async (e: React.MouseEvent, member: IMemberItem) => {
    e.stopPropagation();
    await memberApi.freezeMember(member.memberCode, 30);
    toast.info(`Membership frozen for ${member.firstName} ${member.lastName}`, {
      description: 'Frozen for 30 days starting today',
    });
    loadMembers();
  };

  const handleRenew = async (e: React.MouseEvent, member: IMemberItem) => {
    e.stopPropagation();
    await memberApi.renewMember(member.memberCode, 12);
    toast.success(`Membership renewed for ${member.firstName} ${member.lastName}`, {
      description: 'Extended by 12 months with auto-billing active',
    });
    loadMembers();
  };

  const formatLastVisit = (val?: string) => {
    if (!val) return 'Never';
    if (
      val.toLowerCase().includes('today') ||
      val.toLowerCase().includes('ago') ||
      val.toLowerCase().includes('yesterday')
    ) {
      return val;
    }
    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) return val;
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return val;
    }
  };

  const columns: ColumnDef<IMemberItem>[] = [
    {
      accessorKey: 'memberCode',
      header: 'Member ID',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
            {row.getValue('memberCode')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'firstName',
      header: 'Member Name',
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate(`/member-management/members/${m.memberCode}`)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary/30 to-purple-500/20 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform shrink-0">
              {m.firstName?.charAt(0) || 'M'}
              {m.lastName?.charAt(0) || ''}
            </div>
            <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
              {m.firstName} {m.lastName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'membership.tier',
      header: 'Plan Tier',
      cell: ({ row }) => {
        const tier = row.original.membership?.tier || 'STANDARD';
        const planName = row.original.membership?.planName || tier.replace('_', ' ');
        return (
          <Tooltip content={`Plan: ${planName} • $${row.original.membership?.price || 899}/yr`} side="top">
            <Badge
              variant={
                tier === 'VIP_PLATINUM'
                  ? 'default'
                  : tier === 'GOLD_ANNUAL'
                  ? 'warning'
                  : tier === 'SILVER_MONTHLY'
                  ? 'info'
                  : 'secondary'
              }
              className="text-[11px] font-medium cursor-help"
            >
              {tier.replace('_', ' ')}
            </Badge>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'memberStatus',
      header: 'Status',
      cell: ({ row }) => {
        const val = row.original.memberStatus || 'ACTIVE';
        return (
          <Badge
            variant={
              val === 'ACTIVE'
                ? 'success'
                : val === 'FROZEN'
                ? 'warning'
                : val === 'EXPIRED'
                ? 'destructive'
                : 'secondary'
            }
            className="text-xs capitalize"
          >
            {val}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'assignedTrainer',
      header: 'Trainer',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground truncate block">
          {row.original.assignedTrainer?.name || 'Unassigned'}
        </span>
      ),
    },
    {
      accessorKey: 'stats.lastVisit',
      header: 'Last Check-In',
      cell: ({ row }) => {
        const formatted = formatLastVisit(row.original.stats?.lastVisit);
        return (
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{formatted}</span>
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {/* Quick Check-In Button */}
          <button
            onClick={(e) => handleFastCheckIn(e, row.original)}
            className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/25 flex items-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
            title="Instant Biometric Check-in"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Check-In</span>
          </button>

          {/* Quick View Button */}
          <button
            onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
            className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
            title="View 360° Profile"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          {/* Overflow More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
                title="More Options"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
                className="gap-2 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>360° Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/member-management/members/${row.original.memberCode}/edit`)}
                className="gap-2 cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Edit Details</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => handleFreeze(e, row.original)}
                className="gap-2 cursor-pointer text-amber-600 dark:text-amber-400"
              >
                <Snowflake className="h-3.5 w-3.5" />
                <span>Freeze 30 Days</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleRenew(e, row.original)}
                className="gap-2 cursor-pointer text-emerald-600 dark:text-emerald-400"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Renew 1 Year</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Metrics computation from live data
  const totalCount = members.length;
  const activeCount = members.filter((m) => m.memberStatus === 'ACTIVE' || m.status === 'active').length;
  const activeRate = totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}%` : '100%';

  return (
    <PageContainer>
      <PageHeader
        title="Member Directory"
        subtitle="Manage member profiles, biometric turnstile access, freeze protocols, and 360° telemetry."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/member-management/members/create')}
            >
              <UserPlus className="h-4 w-4" />
              <span>Onboard Member</span>
            </Button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Members"
          value={`${totalCount}`}
          change="+12 this month"
          trend="up"
          timeframe="All registered"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Subscriptions"
          value={`${activeCount}`}
          change={activeRate}
          trend="up"
          timeframe="Active rate"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Today's Check-ins"
          value="84"
          change="+6.2%"
          trend="up"
          timeframe="Turnstile entries"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Expiring This Month"
          value="2"
          change="Renewal target"
          trend="neutral"
          timeframe="Next 30 days"
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {['ALL', 'ACTIVE', 'FROZEN', 'EXPIRED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === s
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {s === 'ALL' ? 'All Members' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* TanStack Table */}
      <DataTable
        columns={columns}
        data={members}
        searchPlaceholder="Search by name, email, member code #GF-..."
      />
    </PageContainer>
  );
};
