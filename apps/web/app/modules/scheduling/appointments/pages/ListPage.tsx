import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, CalendarCheck, Clock, CheckCircle2, DollarSign, Eye, Edit, Trash2, Tag, MapPin, MessageSquare, Activity, User, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAppointment } from '../types';
import { toast } from 'sonner';

export const DEFAULT_APPOINTMENTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { activeBranchId } = useBranchStore();
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  useEffect(() => {
    loadAppointments();
  }, [activeBranchId]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_appointments');
      const customList: IAppointment[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/appointments', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IAppointment[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_APPOINTMENTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setAppointments(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_appointments');
      const customList: IAppointment[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_APPOINTMENTS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setAppointments(combined);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: IAppointment['status']) => {
    const nextStatus: IAppointment['status'] =
      currentStatus === 'CONFIRMED'
        ? 'IN_PROGRESS'
        : currentStatus === 'IN_PROGRESS'
        ? 'COMPLETED'
        : 'CONFIRMED';

    const updated = appointments.map((a) => {
      if ((a.id || a._id) === id) {
        return { ...a, status: nextStatus };
      }
      return a;
    });
    setAppointments(updated);

    const stored = localStorage.getItem('gymflow_custom_appointments');
    if (stored) {
      const customList: IAppointment[] = JSON.parse(stored);
      const updatedCustom = customList.map((a) => {
        if ((a.id || a._id) === id) {
          return { ...a, status: nextStatus };
        }
        return a;
      });
      localStorage.setItem('gymflow_custom_appointments', JSON.stringify(updatedCustom));
    }

    toast.success(`Appointment status updated to ${nextStatus}!`);
  };

  const handleDelete = (id: string, client: string) => {
    const updated = appointments.filter((a) => (a.id || a._id) !== id);
    setAppointments(updated);

    const stored = localStorage.getItem('gymflow_custom_appointments');
    if (stored) {
      const customList: IAppointment[] = JSON.parse(stored);
      const filtered = customList.filter((a) => (a.id || a._id) !== id);
      localStorage.setItem('gymflow_custom_appointments', JSON.stringify(filtered));
    }

    toast.success(`Appointment for "${client}" canceled`);
  };

  // Telemetry Metrics
  const totalAppointments = appointments.length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED' || a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS').length;
  const totalRevenue = appointments.reduce((acc, curr) => acc + (curr.sessionFee || 0), 0);
  const noShowCount = appointments.filter((a) => a.status === 'NO_SHOW').length;
  const noShowRate = totalAppointments > 0 ? ((noShowCount / totalAppointments) * 100).toFixed(1) : '0.0';

  const columns: ColumnDef<IAppointment>[] = [
    {
      accessorKey: 'clientName',
      header: 'Client & Phone',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 border border-border shrink-0">
              <AvatarImage src={row.original.clientAvatar} alt={row.original.clientName} />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {row.original.clientName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[180px]">
              <button
                type="button"
                onClick={() => navigate(`/scheduling/appointments/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.clientName}
              </button>
              <span className="text-[10px] text-muted-foreground block truncate font-mono">{row.original.clientPhone}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'trainerName',
      header: 'Assigned Specialist',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border shrink-0">
            <AvatarImage src={row.original.trainerAvatar} alt={row.original.trainerName} />
            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
              {row.original.trainerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.trainerName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'appointmentType',
      header: 'Session Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-semibold">
          {row.original.appointmentType?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'appointmentDate',
      header: 'Time Window',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs font-bold text-foreground">
            <Clock className="w-3 h-3 text-primary" />
            <span>{row.original.appointmentTime}</span>
          </div>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {row.original.appointmentDate} ({row.original.durationMinutes}m)
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'sessionFee',
      header: 'Fee & Billing',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            ${row.original.sessionFee}
          </span>
          <Badge
            variant={
              row.original.paymentStatus === 'PAID'
                ? 'success'
                : row.original.paymentStatus === 'MEMBERSHIP_INCLUDED'
                ? 'secondary'
                : 'warning'
            }
            className="text-[8px] font-bold uppercase"
          >
            {row.original.paymentStatus?.replace(/_/g, ' ')}
          </Badge>
        </div>
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
              s === 'COMPLETED'
                ? 'success'
                : s === 'IN_PROGRESS'
                ? 'warning'
                : s === 'NO_SHOW'
                ? 'destructive'
                : 'default'
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
                const cleanPhone = row.original.clientPhone?.replace(/[^0-9]/g, '');
                const msg = encodeURIComponent(
                  `Hi ${row.original.clientName}, your appointment for ${row.original.appointmentType?.replace(/_/g, ' ')} with ${row.original.trainerName} is confirmed for ${row.original.appointmentDate} at ${row.original.appointmentTime} at GymFlow!`
                );
                window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
              }}
              title="Send WhatsApp Reminder"
            >
              <MessageSquare className="h-3 w-3 mr-0.5" />
              <span>Reminder</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleToggleStatus(id || '', row.original.status)}
              title="Progress Session Status"
            >
              <Activity className="h-3.5 w-3.5 text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/scheduling/appointments/${id}`)}
              title="View Appointment Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/scheduling/appointments/${id}/edit`)}
              title="Edit Appointment"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.clientName)}
              title="Cancel Appointment"
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
        title="Client 1-on-1 Appointments & PT Bookings"
        subtitle="Manage private personal training sessions, InBody 770 composition scans, nutritionist consults, and physio recovery bookings."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Client,Phone,Trainer,Type,Date,Time,Fee,Payment,Status\n' + appointments.map((a) => `"${a.clientName}","${a.clientPhone}","${a.trainerName}","${a.appointmentType}","${a.appointmentDate}","${a.appointmentTime}","${a.sessionFee}","${a.paymentStatus}","${a.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `appointments-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Appointments exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/scheduling/appointments/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Book Appointment</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL APPOINTMENTS"
          value={`${totalAppointments} Booked`}
          change="+6 confirmed today"
          trend="up"
          timeframe="Campus Schedule"
          icon={<CalendarCheck className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="SESSION REVENUE"
          value={`$${totalRevenue.toLocaleString()}`}
          change="Direct private billing"
          trend="up"
          timeframe="Accounting Ledger"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="CONFIRMED / COMPLETED"
          value={`${completedCount} Sessions`}
          change="98% on-schedule rate"
          trend="up"
          timeframe="Session Execution"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="NO-SHOW RATE"
          value={`${noShowRate}%`}
          change="Below industry standard 4%"
          trend="up"
          timeframe="Client Adherence"
          icon={<ShieldAlert className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={appointments}
        loading={loading}
        searchPlaceholder="Search appointments by client name, phone, trainer, type, date, status..."
      />
    </PageContainer>
  );
};
