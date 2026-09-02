import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, LayoutGrid, Clock, CheckCircle2, DollarSign, Eye, Edit, Trash2, Tag, MapPin, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IResourceBooking } from '../types';
import { toast } from 'sonner';

export const DEFAULT_RESOURCE_BOOKINGS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [bookings, setBookings] = useState<IResourceBooking[]>([]);

  useEffect(() => {
    loadBookings();
  }, [activeBranchId]);

  const loadBookings = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_resource_booking');
      const customList: IResourceBooking[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/resource-booking', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IResourceBooking[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_RESOURCE_BOOKINGS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setBookings(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_resource_booking');
      const customList: IResourceBooking[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_RESOURCE_BOOKINGS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setBookings(combined);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: IResourceBooking['status']) => {
    const nextStatus: IResourceBooking['status'] =
      currentStatus === 'RESERVED'
        ? 'ACTIVE_IN_USE'
        : currentStatus === 'ACTIVE_IN_USE'
        ? 'RELEASED'
        : 'RESERVED';

    const updated = bookings.map((b) => {
      if ((b.id || b._id) === id) {
        return { ...b, status: nextStatus };
      }
      return b;
    });
    setBookings(updated);

    const stored = localStorage.getItem('gymflow_custom_resource_booking');
    if (stored) {
      const customList: IResourceBooking[] = JSON.parse(stored);
      const updatedCustom = customList.map((b) => {
        if ((b.id || b._id) === id) {
          return { ...b, status: nextStatus };
        }
        return b;
      });
      localStorage.setItem('gymflow_custom_resource_booking', JSON.stringify(updatedCustom));
    }

    toast.success(`Resource status updated to ${nextStatus}!`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = bookings.filter((b) => (b.id || b._id) !== id);
    setBookings(updated);

    const stored = localStorage.getItem('gymflow_custom_resource_booking');
    if (stored) {
      const customList: IResourceBooking[] = JSON.parse(stored);
      const filtered = customList.filter((b) => (b.id || b._id) !== id);
      localStorage.setItem('gymflow_custom_resource_booking', JSON.stringify(filtered));
    }

    toast.success(`Reservation for "${name}" canceled`);
  };

  // Telemetry Metrics
  const totalBookings = bookings.length;
  const inUseCount = bookings.filter((b) => b.status === 'ACTIVE_IN_USE' || b.status === 'RESERVED').length;
  const totalRentalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const peakUtilization = '92.6%';

  const columns: ColumnDef<IResourceBooking>[] = [
    {
      accessorKey: 'resourceName',
      header: 'Resource & Bay',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-14 rounded-md overflow-hidden bg-muted border border-border shrink-0">
              <img
                src={row.original.resourcePhoto}
                alt={row.original.resourceName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5 max-w-[200px]">
              <button
                type="button"
                onClick={() => navigate(`/scheduling/resource-booking/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.resourceName}
              </button>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[9px] font-semibold">
                  {row.original.resourceType?.replace(/_/g, ' ')}
                </Badge>
                <span className="text-[10px] text-muted-foreground truncate font-mono">{row.original.zoneLocation}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'bookedByMember',
      header: 'Reserved By',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border shrink-0">
            <AvatarImage src={row.original.bookedByAvatar} alt={row.original.bookedByMember} />
            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
              {row.original.bookedByMember.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.bookedByMember}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'bookingDate',
      header: 'Time Window',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs font-bold text-foreground">
            <Clock className="w-3 h-3 text-primary" />
            <span>{row.original.startTime} - {row.original.endTime}</span>
          </div>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {row.original.bookingDate} ({row.original.durationMinutes}m)
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Rental Fee',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            ${row.original.totalAmount?.toFixed(2)}
          </span>
          <Badge
            variant={
              row.original.paymentStatus === 'PAID'
                ? 'success'
                : row.original.paymentStatus === 'VIP_TIER_COMPLIMENTARY'
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
              s === 'ACTIVE_IN_USE'
                ? 'warning'
                : s === 'RELEASED'
                ? 'success'
                : s === 'MAINTENANCE_LOCKOUT'
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
              className="h-7 px-1.5 text-[10px] text-primary hover:bg-primary/10 border-primary/30 font-semibold"
              onClick={() => handleToggleStatus(id || '', row.original.status)}
              title="Progress Bay Status"
            >
              <Activity className="h-3 w-3 mr-0.5" />
              <span>Status</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/scheduling/resource-booking/${id}`)}
              title="View Resource Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/scheduling/resource-booking/${id}/edit`)}
              title="Edit Reservation"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.resourceName)}
              title="Cancel Reservation"
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
        title="Facility Resource, Court & Studio Bay Bookings"
        subtitle="Manage squash/padel court reservations, cold plunge recovery pods, reformer bays, and boxing rings."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Resource,Type,Member,Date,StartTime,EndTime,TotalFee,Payment,Status\n' + bookings.map((b) => `"${b.resourceName}","${b.resourceType}","${b.bookedByMember}","${b.bookingDate}","${b.startTime}","${b.endTime}","${b.totalAmount}","${b.paymentStatus}","${b.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `resource-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Resource reservations exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/scheduling/resource-booking/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Reserve Resource</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ACTIVE BAY RESERVATIONS"
          value={`${inUseCount} Bays In-Use`}
          change={`${totalBookings} total booked slots`}
          trend="up"
          timeframe="Campus Resources"
          icon={<LayoutGrid className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="PEAK UTILIZATION %"
          value={peakUtilization}
          change="+3.4% this weekend"
          trend="up"
          timeframe="Court & Bay Occupancy"
          icon={<Clock className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="RENTAL REVENUE"
          value={`$${totalRentalRevenue.toLocaleString()}`}
          change="Court & recovery pod rentals"
          trend="up"
          timeframe="Accounting Ledger"
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="MAINTENANCE BLOCKED"
          value="0 Lockouts"
          change="100% facility operational"
          trend="up"
          timeframe="Facility Readiness"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        searchPlaceholder="Search reservations by resource, type, member, zone, time, status..."
      />
    </PageContainer>
  );
};
