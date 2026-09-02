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
  Clock,
  Plus,
  RefreshCw,
  Edit2,
  Eye,
  Users,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IShift } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_SHIFTS: IShift[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [shifts, setShifts] = useState<IShift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchShifts();
  }, [activeBranchId]);

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/shifts', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const localCustomRaw = localStorage.getItem('gymflow_custom_gym_shifts');
      const localCustomItems: IShift[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];

      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setShifts([...localCustomItems, ...items]);
      } else {
        setShifts(localCustomItems);
      }
    } catch {
      const localCustomRaw = localStorage.getItem('gymflow_custom_gym_shifts');
      const localCustomItems: IShift[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];
      setShifts(localCustomItems);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<IShift>[] = [
    {
      accessorKey: 'name',
      header: 'Shift Template',
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm hover:text-primary cursor-pointer" onClick={() => navigate(`/gym-management/shift-management/${s.id}`)}>
                {s.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{s.code}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'timing',
      header: 'Shift Timing',
      cell: ({ row }) => (
        <span className="text-xs font-mono font-medium text-foreground">
          {row.original.startTime} – {row.original.endTime} ({row.original.durationHours} hrs)
        </span>
      ),
    },
    {
      accessorKey: 'departmentName',
      header: 'Department',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {row.original.departmentName || row.original.departmentId || 'General Operations'}
        </Badge>
      ),
    },
    {
      accessorKey: 'minHeadcount',
      header: 'Min Quota',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground">
          {row.original.minHeadcount || 1} Staff
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/gym-management/shift-management/${s.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/gym-management/shift-management/${s.id}/edit`)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredShifts = shifts;
  const totalShifts = filteredShifts.length;
  const totalAssignedStaff = filteredShifts.reduce((acc, s) => acc + (s.assignedStaffCount || s.minHeadcount || 0), 0);
  const totalWeeklyHours = filteredShifts.reduce((acc, s) => acc + s.durationHours * (s.daysOfWeek?.length || 5), 0);

  return (
    <PageContainer>
      <PageHeader
        title="Shift Management"
        subtitle="Manage staff shift templates, working hours coverage, minimum headcount quotas, and attendance grace periods."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchShifts}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/gym-management/shift-management/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Create Shift Template</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Shift Templates"
          value={`${totalShifts} Shifts`}
          change="Operational"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="Scheduled Workforce"
          value={`${totalAssignedStaff} Staff`}
          change="Coverage Quota"
          trend="up"
          timeframe="All Divisions"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Weekly Scheduled Hours"
          value={`${totalWeeklyHours} Hours`}
          change="Mon – Sun"
          trend="neutral"
          timeframe="Facility Total"
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          title="Shift Punctuality Rate"
          value="100%"
          change="Biometric Verified"
          trend="up"
          timeframe="Grace Period"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredShifts}
        searchPlaceholder="Search shift templates by name, code, or department..."
      />
    </PageContainer>
  );
};
