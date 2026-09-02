import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { PlanGateGuard } from '../../../../shared/components/plan/PlanGateGuard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Building2,
  Plus,
  Eye,
  Edit2,
  MapPin,
  Users,
  DollarSign,
  Layers,
  MoreHorizontal,
  RefreshCw,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IBranch } from '../types';
import { useBranchStore, DEFAULT_BRANCHES } from '../../../../core/store/branchStore';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { branches, loadBranches, setActiveBranchId } = useBranchStore();
  const [branchList, setBranchList] = useState<IBranch[]>(() => {
    const localRaw = localStorage.getItem('gymflow_custom_gym_branches');
    return localRaw ? JSON.parse(localRaw) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/branches', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const localRaw = localStorage.getItem('gymflow_custom_gym_branches');
      const localCustom: IBranch[] = localRaw ? JSON.parse(localRaw) : [];

      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setBranchList([...localCustom, ...items]);
      } else {
        setBranchList(localCustom);
      }
    } catch {
      const localRaw = localStorage.getItem('gymflow_custom_gym_branches');
      const localCustom: IBranch[] = localRaw ? JSON.parse(localRaw) : [];
      setBranchList(localCustom);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<IBranch>[] = [
    {
      accessorKey: 'code',
      header: 'Branch ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Gym Facility',
      cell: ({ row }) => {
        const b = row.original;
        const branchId = b.id || b._id;
        return (
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate(`/gym-management/branches/${branchId}`)}
          >
            <img
              src={b.image || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=100&auto=format&fit=crop&q=80'}
              alt={b.name}
              className="w-10 h-10 rounded-xl object-cover border border-border group-hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors block truncate">
                {b.name}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" /> {b.address?.city || 'San Francisco'}, {b.address?.state || 'CA'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'manager',
      header: 'General Manager',
      cell: ({ row }) => {
        const mgr = row.original.manager;
        return (
          <div>
            <div className="text-xs font-semibold text-foreground">{mgr?.name || 'Assigned Lead'}</div>
            <div className="text-[11px] text-muted-foreground">{mgr?.email || row.original.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'capacity',
      header: 'Occupancy & Floor',
      cell: ({ row }) => {
        const b = row.original;
        const occ = b.currentOccupancy || 0;
        const cap = b.capacity || 100;
        const pct = Math.round((occ / cap) * 100);
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-foreground">{occ} / {cap}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{pct}%</span>
            </div>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${pct > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground">{b.sqFt?.toLocaleString()} sq ft</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'memberCount',
      header: 'Members & Staff',
      cell: ({ row }) => (
        <div>
          <div className="text-xs font-semibold text-primary">{row.original.memberCount?.toLocaleString() || 0} Members</div>
          <div className="text-[11px] text-muted-foreground">{row.original.staffCount || 0} Staff & Coaches</div>
        </div>
      ),
    },
    {
      accessorKey: 'monthlyRevenue',
      header: 'Monthly Revenue',
      cell: ({ row }) => (
        <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          ${row.original.monthlyRevenue?.toLocaleString() || '85,000'}/mo
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'} className="gap-1 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const b = row.original;
        const branchId = b.id || b._id;
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate(`/gym-management/branches/${branchId}`)}
              className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
              title="View 360° Branch Profile"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>

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
                  onClick={() => navigate(`/gym-management/branches/${branchId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>360° Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/gym-management/branches/${branchId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Branch</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setActiveBranchId(branchId as string);
                    toast.success(`Active workspace set to ${b.name}`);
                  }}
                  className="gap-2 cursor-pointer text-primary"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Set as Active Context</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalBranches = branchList.length;
  const totalSqFt = branchList.reduce((acc, b) => acc + (b.sqFt || 0), 0);
  const totalMembers = branchList.reduce((acc, b) => acc + (b.memberCount || 0), 0);
  const totalRevenue = branchList.reduce((acc, b) => acc + (b.monthlyRevenue || 0), 0);

  return (
    <PlanGateGuard featureKey="gym-management/branches" featureTitle="Multi-Branch Network" requiredTier="ENTERPRISE">
      <PageContainer>
      <PageHeader
        title="Multi-Gym & Branches Directory"
        subtitle="Centrally monitor, manage, and configure all physical gym facilities, floor spaces, and local branch managers across your brand network."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchBranches}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/gym-management/branches/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Onboard Gym Branch</span>
            </Button>
          </>
        }
      />

      {/* Network KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Network Gym Locations"
          value={`${totalBranches} Facilities`}
          change="All Active"
          trend="up"
          timeframe="100% operational"
          icon={<Building2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Combined Floor Space"
          value={`${totalSqFt.toLocaleString()} sq ft`}
          change="Athletic bays"
          trend="neutral"
          timeframe="Across 4 locations"
          icon={<Layers className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Network Members"
          value={`${totalMembers.toLocaleString()}`}
          change="Active Subscriptions"
          trend="up"
          timeframe="Consolidated Roster"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Monthly Network Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}k/mo`}
          change="Run-rate"
          trend="up"
          timeframe="Consolidated Billing"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* TanStack Table (Direct, no wrapper) */}
      <DataTable
        columns={columns}
        data={branchList}
        searchPlaceholder="Search by gym name, branch code, city, or manager..."
      />
    </PageContainer>
    </PlanGateGuard>
  );
};
