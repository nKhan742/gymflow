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
  Ticket,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IClassBooking } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_CLASS_BOOKINGS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [bookings, setBookings] = useState<IClassBooking[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_class_bookings');
      const customList: IClassBooking[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_CLASS_BOOKINGS.map((b) => b.id || b.bookingCode));
      const newItems = customList.filter((b) => !defaultIds.has(b.id || b.bookingCode));
      return [...newItems, ...DEFAULT_CLASS_BOOKINGS];
    } catch {
      return DEFAULT_CLASS_BOOKINGS;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [activeBranchId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_class_bookings');
      const customList: IClassBooking[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/class-booking', {
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
          const map = new Map<string, IClassBooking>();
          DEFAULT_CLASS_BOOKINGS.forEach((b) => map.set(b.id || b.bookingCode, b));
          serverList.forEach((b: IClassBooking) => map.set(b.id || b.bookingCode || (b._id as string), b));
          customList.forEach((b) => map.set(b.id || b.bookingCode, b));
          setBookings(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IClassBooking>();
      DEFAULT_CLASS_BOOKINGS.forEach((b) => map.set(b.id || b.bookingCode, b));
      customList.forEach((b) => map.set(b.id || b.bookingCode, b));
      setBookings(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_class_bookings');
      const customList: IClassBooking[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IClassBooking>();
      DEFAULT_CLASS_BOOKINGS.forEach((b) => map.set(b.id || b.bookingCode, b));
      customList.forEach((b) => map.set(b.id || b.bookingCode, b));
      setBookings(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return b.branchId === 'ALL' || b.branchId === activeBranchId;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CHECKED_IN':
        return <Badge variant="success" className="text-[10px] font-semibold">Turnstile Checked-In</Badge>;
      case 'CONFIRMED':
        return <Badge variant="info" className="text-[10px] font-semibold">Confirmed Spot</Badge>;
      case 'WAITLIST':
        return <Badge variant="warning" className="text-[10px] font-semibold">Waitlist #1</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary" className="text-[10px] font-semibold">Cancelled</Badge>;
      case 'NO_SHOW':
        return <Badge variant="destructive" className="text-[10px] font-semibold">No Show</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-semibold">{status}</Badge>;
    }
  };

  const columns: ColumnDef<IClassBooking>[] = [
    {
      accessorKey: 'bookingCode',
      header: 'Booking ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('bookingCode')}
        </span>
      ),
    },
    {
      accessorKey: 'memberName',
      header: 'Member / Attendee',
      cell: ({ row }) => {
        const bkg = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={bkg.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={bkg.memberName}
              className="w-8 h-8 rounded-full object-cover border border-border/80 shrink-0 bg-muted"
            />
            <div>
              <div
                onClick={() => navigate(`/fitness/class-booking/${bkg.id || bkg._id}`)}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
              >
                {bkg.memberName}
              </div>
              <div className="text-[11px] text-muted-foreground">{bkg.memberEmail}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'className',
      header: 'Studio Class & Spot',
      cell: ({ row }) => {
        const bkg = row.original;
        return (
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-foreground">{bkg.className}</div>
            <div className="text-[11px] text-muted-foreground">
              Spot <strong className="text-primary font-mono">#{bkg.spotNumber}</strong> • {bkg.studioRoom}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'timeSlot',
      header: 'Date & Time Slot',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {row.original.timeSlot}
          </div>
          <div className="text-[11px] text-muted-foreground">{row.original.bookingDate}</div>
        </div>
      ),
    },
    {
      accessorKey: 'bookingStatus',
      header: 'Booking Status',
      cell: ({ row }) => getStatusBadge(row.original.bookingStatus),
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
        const bkgId = row.original.id || row.original._id;
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
                  onClick={() => navigate(`/fitness/class-booking/${bkgId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Booking Pass</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/class-booking/${bkgId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Booking</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalBookings = filteredBookings.length;
  const checkedInCount = filteredBookings.filter((b) => b.bookingStatus === 'CHECKED_IN').length;
  const waitlistCount = filteredBookings.filter((b) => b.bookingStatus === 'WAITLIST').length;

  return (
    <PageContainer>
      <PageHeader
        title="Class Bookings Ledger"
        subtitle="Manage member spot reservations, waitlists, real-time turnstile check-ins, and studio capacity allocations."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchBookings}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/class-booking/create')}
            >
              <Plus className="h-4 w-4" />
              <span>New Reservation</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Bookings Today"
          value={`${totalBookings} Reserved`}
          change="Real-time Slots"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Ticket className="h-5 w-5" />}
        />
        <MetricCard
          title="Turnstile Checked-In"
          value={`${checkedInCount} Present`}
          change="Verified at Gates"
          trend="up"
          timeframe="Live Studio Floor"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Waitlist"
          value={`${waitlistCount} In Queue`}
          change="Auto-Seat on Cancel"
          trend="neutral"
          timeframe="Pending Seats"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Turnout Rate"
          value="96.2%"
          change="Low No-Show Rate"
          trend="up"
          timeframe="Historical Average"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredBookings}
        searchKey="memberName"
        searchPlaceholder="Search member names, classes, booking codes..."
      />
    </PageContainer>
  );
};
