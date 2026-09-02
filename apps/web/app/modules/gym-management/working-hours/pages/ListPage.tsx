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
  Building2,
  Zap,
  Flame,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWorkingHourZone } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_WORKING_HOURS: IWorkingHourZone[] = [];
export const DEFAULT_ZONES: IWorkingHourZone[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [zones, setZones] = useState<IWorkingHourZone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchWorkingHours();
  }, [activeBranchId]);

  const fetchWorkingHours = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/working-hours', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const localCustomRaw = localStorage.getItem('gymflow_custom_gym_working_hours');
      const localCustomItems: IWorkingHourZone[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];

      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setZones([...localCustomItems, ...items]);
      } else {
        setZones(localCustomItems);
      }
    } catch {
      const localCustomRaw = localStorage.getItem('gymflow_custom_gym_working_hours');
      const localCustomItems: IWorkingHourZone[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];
      setZones(localCustomItems);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<IWorkingHourZone>[] = [
    {
      accessorKey: 'name',
      header: 'Facility Zone',
      cell: ({ row }) => {
        const z = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm hover:text-primary cursor-pointer" onClick={() => navigate(`/gym-management/working-hours/${z.id}`)}>
                {z.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{z.code}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'schedule',
      header: 'Operating Hours',
      cell: ({ row }) => {
        const z = row.original;
        const firstDay = z.weeklySchedule && z.weeklySchedule[0];
        return (
          <span className="text-xs font-mono font-medium text-foreground">
            {z.is24x7 ? '24/7 Continuous Access' : firstDay ? `${firstDay.openTime} – ${firstDay.closeTime}` : '05:00 – 23:00'}
          </span>
        );
      },
    },
    {
      accessorKey: 'maxCapacity',
      header: 'Max Capacity',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground">
          {row.original.maxCapacity || 0} Members
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
        const z = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/gym-management/working-hours/${z.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/gym-management/working-hours/${z.id}/edit`)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredZones = zones;
  const totalZones = filteredZones.length;
  const count247 = filteredZones.filter((z) => z.is24x7).length;
  const totalCapacity = filteredZones.reduce((acc, z) => acc + (z.maxCapacity || 0), 0);

  return (
    <PageContainer>
      <PageHeader
        title="Working Hours"
        subtitle="Configure master facility operating timetables, 24/7 biometric access zones, peak capacity hours, and maintenance windows."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchWorkingHours}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/gym-management/working-hours/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add Facility Zone</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Facility Zones"
          value={`${totalZones} Active Zones`}
          change="Operational"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Building2 className="h-5 w-5" />}
        />
        <MetricCard
          title="24/7 Biometric Access"
          value={`${count247} Zones 24/7`}
          change="Turnstiles Active"
          trend="up"
          timeframe="Access Enabled"
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          title="Peak Capacity Limit"
          value={`${totalCapacity} Members`}
          change="Concurrent Max"
          trend="neutral"
          timeframe="All Zones"
          icon={<Flame className="h-5 w-5" />}
        />
        <MetricCard
          title="Peak Rush Window"
          value="-- : --"
          change="Occupancy Flow"
          trend="neutral"
          timeframe="Facility Average"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredZones}
        searchPlaceholder="Search facility zones by name or code..."
      />
    </PageContainer>
  );
};
