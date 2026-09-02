import React, { useEffect, useState, useMemo } from 'react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Users,
  UserPlus,
  Eye,
  Edit2,
  Clock,
  Star,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Award,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  MapPin,
  Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { useCurrencyStore } from '../../../../core/store/currencyStore';
import { formatCurrency } from '../../../../core/helpers/formatters';
import { IStaff, StaffRole } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';
import { useLoadingStore } from '../../../../core/store/loadingStore';

const ALL_STAFF_DATA: IStaff[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currency } = useCurrencyStore();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const { startLoading, stopLoading } = useLoadingStore();
  const activeBranch = getActiveBranch();

  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  useEffect(() => {
    loadStaff();
  }, [departmentFilter, activeBranchId]);

  const loadStaff = async () => {
    setLoading(true);
    startLoading();
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const url =
        departmentFilter === 'ALL'
          ? 'https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff'
          : `https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff?department=${departmentFilter}`;

      const res = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const localCustomRaw = localStorage.getItem('gymflow_custom_gym_staff');
      const localCustomItems: IStaff[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];

      let data: IStaff[] = localCustomItems;
      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        if (items.length > 0) {
          data = items;
          localStorage.removeItem('gymflow_custom_gym_staff');
        } else {
          data = localCustomItems;
        }
      }

      // Filter by active branch selected in top nav
      if (activeBranchId && activeBranchId !== 'ALL') {
        const filtered = data.filter((s) => {
          const sBranch = (s.metadata as any)?.branchId;
          return sBranch === activeBranchId || !sBranch;
        });
        setStaffList(filtered);
      } else {
        setStaffList(data);
      }
    } catch {
      const localCustomRaw = localStorage.getItem('gymflow_custom_gym_staff');
      const localCustomItems: IStaff[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];
      setStaffList(localCustomItems);
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case 'HEAD_COACH':
        return <Badge variant="warning" className="gap-1 font-semibold">👑 Head Coach</Badge>;
      case 'TRAINER':
        return <Badge variant="default" className="gap-1 font-semibold">🏋️ Trainer</Badge>;
      case 'NUTRITIONIST':
        return <Badge variant="success" className="gap-1 font-semibold">🥗 Nutritionist</Badge>;
      case 'GROUP_INSTRUCTOR':
        return <Badge variant="info" className="gap-1 font-semibold">🧘 Instructor</Badge>;
      case 'MANAGER':
        return <Badge variant="secondary" className="gap-1 font-semibold">💼 Manager</Badge>;
      case 'RECEPTIONIST':
        return <Badge variant="outline" className="gap-1 font-semibold">🛎️ Reception</Badge>;
      default:
        return <Badge variant="secondary">Staff</Badge>;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
          </Badge>
        );
      case 'on_leave':
        return <Badge variant="warning" className="gap-1">🏖️ On Leave</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const columns: ColumnDef<IStaff>[] = [
    {
      accessorKey: 'code',
      header: 'Staff ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Staff Member',
      cell: ({ row }) => {
        const s = row.original;
        const staffId = s.id || s._id;
        return (
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate(`/gym-management/staff/${staffId}`)}
          >
            <div className="relative">
              <img
                src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={s.name}
                className="w-8 h-8 rounded-full object-cover border border-border group-hover:scale-105 transition-transform shrink-0"
              />
              <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-card ${s.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
            <div>
              <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors block truncate">
                {s.name}
              </span>
              <span className="text-[11px] text-muted-foreground block truncate">{s.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role & Dept',
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="space-y-1">
            {getRoleBadge(s.role)}
            <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">{s.department}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'specializations',
      header: 'Specializations',
      cell: ({ row }) => {
        const specs = row.original.specializations || [];
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {specs.slice(0, 2).map((spec, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] border border-border/60">
                {spec}
              </span>
            ))}
            {specs.length > 2 && (
              <span className="px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground text-[10px]">
                +{specs.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'shift',
      header: 'Shift & Rate',
      cell: ({ row }) => (
        <div>
          <div className="text-xs font-medium text-foreground">{row.original.shift} Shift</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">{formatCurrency(row.original.hourlyRate || 65, currency)}/hr</div>
        </div>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating & Clients',
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500" /> {row.original.rating || 5.0}
            <span className="text-muted-foreground font-normal text-[11px]">({row.original.reviewsCount || 0})</span>
          </div>
          <div className="text-[11px] text-muted-foreground">{row.original.activeClientsCount || 0} active clients</div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const s = row.original;
        const staffId = s.id || s._id;
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate(`/gym-management/staff/${staffId}`)}
              className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
              title="View 360° Profile"
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
                  onClick={() => navigate(`/gym-management/staff/${staffId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>360° Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/gym-management/staff/${staffId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Details</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalCount = staffList.length;
  const certifiedTrainers = staffList.filter((s) => s.role === 'TRAINER' || s.role === 'HEAD_COACH' || s.role === 'GROUP_INSTRUCTOR').length;
  const activeCount = staffList.filter((s) => s.status === 'active').length;
  const avgRating = totalCount > 0
    ? (staffList.reduce((acc, s) => acc + (s.rating || 5.0), 0) / totalCount).toFixed(2)
    : '5.00';

  return (
    <PageContainer>
      <PageHeader
        title={`Trainers & Staff: ${activeBranch ? activeBranch.name : 'All Gym Locations'}`}
        subtitle={
          activeBranch
            ? `Viewing active coaches and staff roster allocated to ${activeBranch.name} (${activeBranch.address?.city}).`
            : 'Viewing consolidated staff and trainers roster across all 4 regional gym facilities.'
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={loadStaff}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/gym-management/staff/create')}
            >
              <UserPlus className="h-4 w-4" />
              <span>Onboard Staff</span>
            </Button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Staff Roster"
          value={`${totalCount}`}
          change={`${activeCount} on duty`}
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'Consolidated Network'}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Certified Coaches"
          value={`${certifiedTrainers}`}
          change="Fitness & Wellness"
          trend="up"
          timeframe="Specialist roster"
          icon={<Dumbbell className="h-5 w-5" />}
        />
        <MetricCard
          title="Staff Availability"
          value={`${Math.round((activeCount / (totalCount || 1)) * 100)}%`}
          change="Shift Capacity"
          trend="neutral"
          timeframe="On duty today"
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="Average Coach Rating"
          value={`★ ${avgRating}`}
          change="Top Rated"
          trend="up"
          timeframe="From verified reviews"
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {[
          { id: 'ALL', label: 'All Staff' },
          { id: 'FITNESS', label: 'Coaches & Trainers' },
          { id: 'RECEPTION', label: 'Front Desk' },
          { id: 'WELLNESS', label: 'Nutrition & Wellness' },
          { id: 'MANAGEMENT', label: 'Management' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDepartmentFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              departmentFilter === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TanStack Table */}
      <DataTable
        columns={columns}
        data={staffList}
        loading={loading}
        searchPlaceholder="Search by name, email, role, or staff ID..."
      />
    </PageContainer>
  );
};
