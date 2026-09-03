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
  Calendar,
  Plus,
  RefreshCw,
  Edit2,
  Eye,
  AlertCircle,
  Sparkles,
  Clock,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IHoliday } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [holidays, setHolidays] = useState<IHoliday[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHolidays();
  }, [activeBranchId]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/holidays', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setHolidays(items);
        localStorage.removeItem('gymflow_custom_gym_holidays');
      } else {
        setHolidays([]);
      }
    } catch {
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<IHoliday>[] = [
    {
      accessorKey: 'name',
      header: 'Holiday / Closure Event',
      cell: ({ row }) => {
        const h = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm hover:text-primary cursor-pointer" onClick={() => navigate(`/gym-management/holidays/${h.id}`)}>
                {h.name}
              </p>
              <p className="text-xs text-muted-foreground">{h.category}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Date Window',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground">
          {row.original.startDate} {row.original.endDate && row.original.endDate !== row.original.startDate ? `to ${row.original.endDate}` : ''}
        </span>
      ),
    },
    {
      accessorKey: 'operationalMode',
      header: 'Facility Mode',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {row.original.operationalMode?.replace('_', ' ')}
        </Badge>
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
        const h = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/gym-management/holidays/${h.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/gym-management/holidays/${h.id}/edit`)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredHolidays = holidays;
  const totalHolidays = filteredHolidays.length;
  const closedDays = filteredHolidays.filter((h) => h.operationalMode === 'CLOSED').length;
  const reducedDays = filteredHolidays.filter((h) => h.operationalMode === 'REDUCED_HOURS').length;
  const selfServiceDays = filteredHolidays.filter((h) => h.operationalMode === 'SELF_SERVICE').length;

  return (
    <PageContainer>
      <PageHeader
        title="Holidays & Closures"
        subtitle="Manage official gym holidays, maintenance shutdowns, reduced operating hours, and automated member broadcasts."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchHolidays}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/gym-management/holidays/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add Holiday / Closure</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Scheduled Closures"
          value={`${totalHolidays} Events`}
          change="Calendar Year"
          trend="neutral"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          title="Full Facility Closed"
          value={`${closedDays} Days`}
          change="Turnstiles Locked"
          trend="down"
          timeframe="National Holidays"
          icon={<AlertCircle className="h-5 w-5" />}
        />
        <MetricCard
          title="Reduced Operating Days"
          value={`${reducedDays} Days`}
          change="Open Gym Only"
          trend="neutral"
          timeframe="Holiday Schedules"
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="24/7 Self-Service Days"
          value={`${selfServiceDays} Days`}
          change="Keycard Access"
          trend="up"
          timeframe="Staff-Free Mode"
          icon={<Sparkles className="h-5 w-5" />}
        />
      </div>

      {/* Clean TanStack DataTable */}
      <DataTable
        columns={columns}
        data={filteredHolidays}
        loading={loading}
        searchPlaceholder="Search holiday name, dates, or category..."
      />
    </PageContainer>
  );
};
