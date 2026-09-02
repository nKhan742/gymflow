import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, UserCheck, Clock, Calendar, Dumbbell, Eye, Edit, Trash2, Tag, MapPin, DollarSign, Activity, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrainerSchedule } from '../types';
import { toast } from 'sonner';

export const DEFAULT_TRAINER_SCHEDULES: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [schedules, setSchedules] = useState<ITrainerSchedule[]>([]);

  useEffect(() => {
    loadSchedules();
  }, [activeBranchId]);

  const loadSchedules = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
      const customList: ITrainerSchedule[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/trainer-schedule', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: ITrainerSchedule[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_TRAINER_SCHEDULES;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setSchedules(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
      const customList: ITrainerSchedule[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_TRAINER_SCHEDULES) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setSchedules(combined);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: ITrainerSchedule['availabilityStatus']) => {
    const nextStatus: ITrainerSchedule['availabilityStatus'] =
      currentStatus === 'AVAILABLE'
        ? 'ON_DUTY_SESSION'
        : currentStatus === 'ON_DUTY_SESSION'
        ? 'ON_BREAK'
        : currentStatus === 'ON_BREAK'
        ? 'OFF_DUTY'
        : 'AVAILABLE';

    const updated = schedules.map((s) => {
      if ((s.id || s._id) === id) {
        return { ...s, availabilityStatus: nextStatus };
      }
      return s;
    });
    setSchedules(updated);

    const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
    if (stored) {
      const customList: ITrainerSchedule[] = JSON.parse(stored);
      const updatedCustom = customList.map((s) => {
        if ((s.id || s._id) === id) {
          return { ...s, availabilityStatus: nextStatus };
        }
        return s;
      });
      localStorage.setItem('gymflow_custom_trainer_schedule', JSON.stringify(updatedCustom));
    }

    toast.success(`Duty status updated to ${nextStatus}!`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = schedules.filter((s) => (s.id || s._id) !== id);
    setSchedules(updated);

    const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
    if (stored) {
      const customList: ITrainerSchedule[] = JSON.parse(stored);
      const filtered = customList.filter((s) => (s.id || s._id) !== id);
      localStorage.setItem('gymflow_custom_trainer_schedule', JSON.stringify(filtered));
    }

    toast.success(`Trainer schedule for "${name}" removed`);
  };

  // Telemetry Metrics
  const totalCoaches = schedules.length;
  const onDutyCount = schedules.filter((s) => s.availabilityStatus === 'AVAILABLE' || s.availabilityStatus === 'ON_DUTY_SESSION').length;
  const totalBookedPt = schedules.reduce((acc, curr) => acc + (curr.bookedPtCount || 0), 0);
  const totalCapacityPt = schedules.reduce((acc, curr) => acc + (curr.maxPtClientsPerDay || 0), 0);
  const openSlots = Math.max(0, totalCapacityPt - totalBookedPt);

  const columns: ColumnDef<ITrainerSchedule>[] = [
    {
      accessorKey: 'trainerName',
      header: 'Trainer & Specialty',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 border border-border shrink-0">
              <AvatarImage src={row.original.trainerPhoto} alt={row.original.trainerName} />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {row.original.trainerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[200px]">
              <button
                type="button"
                onClick={() => navigate(`/scheduling/trainer-schedule/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.trainerName}
              </button>
              <span className="text-[10px] text-muted-foreground block truncate">{row.original.specialty}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'shiftHours',
      header: 'Shift & Hours',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs font-bold text-foreground">
            <Clock className="w-3 h-3 text-primary" />
            <span>{row.original.shiftHours}</span>
          </div>
          <Badge variant="outline" className="text-[9px] font-semibold">
            {row.original.shiftType?.replace(/_/g, ' ')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'availableDays',
      header: 'Roster Days',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {row.original.availableDays?.map((d) => (
            <span key={d} className="px-1.5 py-0.5 bg-muted rounded font-mono text-[9px] font-bold text-foreground">
              {d}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'bookedPtCount',
      header: 'Daily PT Capacity',
      cell: ({ row }) => {
        const booked = row.original.bookedPtCount || 0;
        const cap = row.original.maxPtClientsPerDay || 1;
        const percent = Math.min(100, Math.round((booked / cap) * 100));
        return (
          <div className="space-y-1 min-w-[100px]">
            <div className="flex justify-between text-[11px] font-mono font-semibold">
              <span>{booked}/{cap} Clients</span>
              <span className={percent >= 80 ? 'text-amber-500 font-bold' : 'text-muted-foreground'}>{percent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${percent >= 80 ? 'bg-amber-500' : 'bg-primary'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'hourlyRate',
      header: 'Hourly Rate',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          ${row.original.hourlyRate}/hr
        </span>
      ),
    },
    {
      accessorKey: 'availabilityStatus',
      header: 'Duty State',
      cell: ({ row }) => {
        const s = row.original.availabilityStatus;
        return (
          <Badge
            variant={
              s === 'AVAILABLE'
                ? 'success'
                : s === 'ON_DUTY_SESSION'
                ? 'warning'
                : s === 'ON_BREAK'
                ? 'secondary'
                : 'outline'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ')}
          </Badge>
        );
      },
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
              size="sm"
              className="h-7 px-1.5 text-[10px] text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30 font-semibold"
              onClick={() => {
                navigate('/scheduling/appointments/create', {
                  state: {
                    trainerName: row.original.trainerName,
                    hourlyRate: row.original.hourlyRate,
                    assignedZone: row.original.assignedZone,
                  },
                });
              }}
              title="Book 1-on-1 PT Session"
            >
              <CalendarPlus className="h-3 w-3 mr-0.5" />
              <span>Book PT</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleToggleStatus(id || '', row.original.availabilityStatus)}
              title="Toggle Duty State"
            >
              <Activity className="h-3.5 w-3.5 text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/scheduling/trainer-schedule/${id}`)}
              title="View Trainer Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/scheduling/trainer-schedule/${id}/edit`)}
              title="Edit Schedule"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.trainerName)}
              title="Delete Schedule"
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
        title="Trainer Roster & Availability Schedules"
        subtitle="Manage personal trainer shift windows, hourly rates, daily 1-on-1 client capacity limits, and on-floor availability."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Trainer,Specialty,ShiftType,ShiftHours,Days,MaxPT,BookedPT,Rate,DutyState\n' + schedules.map((s) => `"${s.trainerName}","${s.specialty}","${s.shiftType}","${s.shiftHours}","${s.availableDays.join('/')}","${s.maxPtClientsPerDay}","${s.bookedPtCount}","${s.hourlyRate}","${s.availabilityStatus}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `trainer-roster-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Trainer roster exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/scheduling/trainer-schedule/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Trainer Schedule</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ON-DUTY COACHES"
          value={`${onDutyCount} Active`}
          change={`${totalCoaches} registered in roster`}
          trend="up"
          timeframe="Campus Floor"
          icon={<UserCheck className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="BOOKED PT SESSIONS"
          value={`${totalBookedPt} Sessions`}
          change={`${totalCapacityPt} daily slots max`}
          trend="up"
          timeframe="Daily PT Quota"
          icon={<Dumbbell className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="OPEN PT SLOTS"
          value={`${openSlots} Openings`}
          change="Available for booking"
          trend="up"
          timeframe="Live Floor Availability"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="ROSTER ADHERENCE"
          value="97.4%"
          change="+1.2% this week"
          trend="up"
          timeframe="Shift Punctuality"
          icon={<Calendar className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={schedules}
        searchPlaceholder="Search coaches by name, specialty, shift hours, zone, duty status..."
      />
    </PageContainer>
  );
};
