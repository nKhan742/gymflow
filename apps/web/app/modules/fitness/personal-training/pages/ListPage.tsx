import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Handshake,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Activity,
  Award,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IPersonalTrainingPackage } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_PT_PACKAGES: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [packages, setPackages] = useState<IPersonalTrainingPackage[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_personal_training');
      const customList: IPersonalTrainingPackage[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_PT_PACKAGES.map((p) => p.id || p.packageCode));
      const newItems = customList.filter((p) => !defaultIds.has(p.id || p.packageCode));
      return [...newItems, ...DEFAULT_PT_PACKAGES];
    } catch {
      return DEFAULT_PT_PACKAGES;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPTPackages();
  }, [activeBranchId]);

  const fetchPTPackages = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_personal_training');
      const customList: IPersonalTrainingPackage[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/personal-training', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const serverList = (json.success && Array.isArray(json.data) && json.data.length > 0)
          ? json.data
          : (json.data?.items?.length > 0 ? json.data.items : []);

        if (serverList.length > 0) {
          const map = new Map<string, IPersonalTrainingPackage>();
          DEFAULT_PT_PACKAGES.forEach((p) => map.set(p.id || p.packageCode, p));
          serverList.forEach((p: IPersonalTrainingPackage) => map.set(p.id || p.packageCode || (p._id as string), p));
          customList.forEach((p) => map.set(p.id || p.packageCode, p));
          setPackages(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IPersonalTrainingPackage>();
      DEFAULT_PT_PACKAGES.forEach((p) => map.set(p.id || p.packageCode, p));
      customList.forEach((p) => map.set(p.id || p.packageCode, p));
      setPackages(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_personal_training');
      const customList: IPersonalTrainingPackage[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IPersonalTrainingPackage>();
      DEFAULT_PT_PACKAGES.forEach((p) => map.set(p.id || p.packageCode, p));
      customList.forEach((p) => map.set(p.id || p.packageCode, p));
      setPackages(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter((p) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return p.branchId === 'ALL' || p.branchId === activeBranchId;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success" className="text-[10px] font-semibold">Active</Badge>;
      case 'EXHAUSTED':
        return <Badge variant="secondary" className="text-[10px] font-semibold">Exhausted</Badge>;
      case 'EXPIRED':
        return <Badge variant="destructive" className="text-[10px] font-semibold">Expired</Badge>;
      case 'FROZEN':
        return <Badge variant="outline" className="text-[10px] font-semibold">Frozen</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-semibold">{status}</Badge>;
    }
  };

  const columns: ColumnDef<IPersonalTrainingPackage>[] = [
    {
      accessorKey: 'packageCode',
      header: 'Package Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('packageCode')}
        </span>
      ),
    },
    {
      accessorKey: 'memberName',
      header: 'Client & Coach Match',
      cell: ({ row }) => {
        const pkg = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={pkg.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={pkg.memberName}
              className="w-8 h-8 rounded-full object-cover border border-border/80 shrink-0 bg-muted"
            />
            <div>
              <div
                onClick={() => navigate(`/fitness/personal-training/${pkg.id || pkg._id}`)}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
              >
                {pkg.memberName}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Trainer: <strong className="text-foreground">{pkg.coachName}</strong>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'packageTier',
      header: 'Package Tier',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
          {row.original.packageTier ? String(row.original.packageTier).replace('TIER_', '').replace(/_/g, ' ') : 'Standard'}
        </span>
      ),
    },
    {
      accessorKey: 'sessionsCompleted',
      header: 'Sessions Rendered',
      cell: ({ row }) => {
        const pkg = row.original;
        const percent = Math.round(((pkg.sessionsCompleted || 0) / (pkg.totalSessionsPurchased || 1)) * 100);
        return (
          <div className="space-y-1 w-32">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-foreground">{pkg.sessionsCompleted}/{pkg.totalSessionsPurchased}</span>
              <span className="text-muted-foreground">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  percent >= 100 ? 'bg-secondary' : 'bg-primary'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'sessionsRemaining',
      header: 'Remaining Credits',
      cell: ({ row }) => (
        <Badge variant={row.original.sessionsRemaining > 0 ? 'info' : 'secondary'} className="font-mono text-xs font-bold">
          {row.original.sessionsRemaining} Left
        </Badge>
      ),
    },
    {
      accessorKey: 'totalPackagePrice',
      header: 'Package Value',
      cell: ({ row }) => (
        <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          ${row.original.totalPackagePrice?.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'branchName',
      header: 'Branch Scope',
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1 text-[11px] font-medium border-border/80">
          <Building2 className="w-3 h-3 text-muted-foreground" />
          {row.getValue('branchName') || 'All Locations'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const pkgId = row.original.id || row.original._id;
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/personal-training/${pkgId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° PT Package Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/personal-training/${pkgId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Package</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalPackages = filteredPackages.length;
  const activeCount = filteredPackages.filter((p) => p.status === 'ACTIVE').length;
  const totalRevenue = filteredPackages.reduce((acc, p) => acc + (p.totalPackagePrice || 0), 0);
  const remainingCredits = filteredPackages.reduce((acc, p) => acc + (p.sessionsRemaining || 0), 0);

  return (
    <PageContainer>
      <PageHeader
        title="Personal Training Packages & Roster"
        subtitle="Manage 1-on-1 private coaching packages, session countdowns, trainer commissions, and client billings."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchPTPackages}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/personal-training/create')}
            >
              <Plus className="h-4 w-4" />
              <span>New PT Package</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active PT Clients"
          value={`${activeCount} Trainees`}
          change="High Retention"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Handshake className="h-5 w-5" />}
        />
        <MetricCard
          title="Total PT Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="Paid In Full"
          trend="up"
          timeframe="Package Pipeline"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Remaining Session Bank"
          value={`${remainingCredits} Credits`}
          change="To Be Rendered"
          trend="neutral"
          timeframe="Client Balances"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Session Rate"
          value="$87 / hr"
          change="Tier 1 Certified"
          trend="neutral"
          timeframe="Coach Tier Average"
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredPackages}
        searchKey="memberName"
        searchPlaceholder="Search client names, coaches, package codes..."
      />
    </PageContainer>
  );
};
