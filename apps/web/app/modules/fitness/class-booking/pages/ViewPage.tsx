import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Ticket,
  Edit2,
  Building2,
  ArrowLeft,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Calendar,
  QrCode,
  Fingerprint,
  Sparkles,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IClassBooking } from '../types';
import { DEFAULT_CLASS_BOOKINGS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<IClassBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    loadBookingData();
  }, [id]);

  const loadBookingData = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_class_bookings');
      const customList: IClassBooking[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (b) => b.id === id || b.bookingCode === id || b._id === id || b.id?.toLowerCase() === id?.toLowerCase() || b.bookingCode?.toLowerCase() === id?.toLowerCase()
      );

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/class-booking/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setBooking(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setBooking(customMatch);
        setLoading(false);
        return;
      }

      const fallback = DEFAULT_CLASS_BOOKINGS.find(
        (b) => b.id === id || b.bookingCode === id || b.id?.toLowerCase() === id?.toLowerCase() || b.bookingCode?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setBooking(fallback);
      } else {
        setBooking({
          id: id || 'BKG-CUSTOM',
          bookingCode: id || 'BKG-CUSTOM',
          memberId: 'MEM-001',
          memberName: 'Studio Member',
          classId: 'CLS-001',
          className: 'Group Fitness Class',
          classCategory: 'HIIT_CIRCUIT',
          instructorName: 'Lead Coach',
          studioRoom: 'Main Group Studio A',
          bookingDate: new Date().toISOString().split('T')[0],
          timeSlot: '06:00 PM – 06:45 PM',
          spotNumber: 12,
          bookingStatus: 'CONFIRMED',
          branchId: 'ALL',
          branchName: 'All Locations',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_class_bookings');
      const customList: IClassBooking[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((b) => b.id === id || b.bookingCode === id);
      const fallback = customMatch || DEFAULT_CLASS_BOOKINGS.find((b) => b.id === id || b.bookingCode === id) || DEFAULT_CLASS_BOOKINGS[0];
      setBooking(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = () => {
    if (!booking) return;
    setCheckingIn(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setBooking({
        ...booking,
        bookingStatus: 'CHECKED_IN',
        checkInTime: timeStr,
      });
      setCheckingIn(false);
      toast.success(`Turnstile check-in confirmed for ${booking.memberName}!`);
    }, 600);
  };

  if (loading || !booking) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Reservation Pass...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/class-booking')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Bookings</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {booking.memberName} • {booking.className}
              <span className="text-xs font-mono text-muted-foreground font-normal">({booking.bookingCode})</span>
            </h1>
            <p className="text-xs text-muted-foreground">Spot #{booking.spotNumber} • {booking.timeSlot} • {booking.bookingDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {booking.bookingStatus !== 'CHECKED_IN' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualCheckIn}
              disabled={checkingIn}
              className="gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              <Fingerprint className="h-4 w-4" />
              <span>{checkingIn ? 'Verifying...' : 'Turnstile Check-In'}</span>
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/class-booking/${booking.id || booking._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Booking</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <img
                src={booking.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={booking.memberName}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-border/80 shrink-0 shadow-sm"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{booking.memberName}</h2>
                  <Badge variant={booking.bookingStatus === 'CHECKED_IN' ? 'success' : 'default'} className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {booking.bookingStatus}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {booking.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Class: <strong className="text-foreground">{booking.className}</strong></span>
                  <span>•</span>
                  <span>Instructor: <strong className="text-primary font-mono">{booking.instructorName}</strong></span>
                </div>
              </div>
            </div>

            {/* Spot Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Reserved Spot</div>
                <div className="text-xs font-bold text-foreground font-mono">Spot / Mat #{booking.spotNumber}</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Turnstile Verified: {booking.checkInTime || 'Pending Gate Scan'}</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Class Date</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{booking.bookingDate}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Time Window</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{booking.timeSlot}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Spot Allocation</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">Mat #{booking.spotNumber}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Studio Room</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{booking.studioRoom}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Tabs */}
      <Tabs defaultValue="pass" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="pass" className="text-xs font-semibold gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-primary" /> Digital Studio Pass & QR
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs font-semibold gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Attendance Ledger & Security
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PASS */}
        <TabsContent value="pass" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-primary" /> Studio Admission Confirmation
                </CardTitle>
                <CardDescription className="text-xs">Show this digital pass at the studio turnstile scanner.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Class Format:</span>
                    <span className="font-bold text-foreground">{booking.className}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Lead Coach:</span>
                    <span className="font-bold text-primary">{booking.instructorName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Location & Room:</span>
                    <span className="font-bold text-foreground">{booking.studioRoom}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Reserved Position:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Position #{booking.spotNumber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 flex flex-col items-center justify-center space-y-3">
              <div className="w-28 h-28 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 text-primary">
                <QrCode className="w-16 h-16" />
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs font-bold text-foreground">{booking.bookingCode}</div>
                <div className="text-[11px] text-muted-foreground">Fast-Lane RFID / QR Token</div>
              </div>
              <Badge variant={booking.bookingStatus === 'CHECKED_IN' ? 'success' : 'outline'} className="text-xs mt-2">
                {booking.bookingStatus === 'CHECKED_IN' ? '✓ Admitted to Studio' : 'Ready to Scan'}
              </Badge>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: HISTORY */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Turnstile Validation Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-foreground">Turnstile Gate 02 (Studio Entrance)</div>
                  <div className="text-muted-foreground text-[11px]">Member RFID Band scanned • {booking.checkInTime || 'Awaiting entry'}</div>
                </div>
                <Badge variant={booking.bookingStatus === 'CHECKED_IN' ? 'success' : 'secondary'} className="text-[11px]">
                  {booking.bookingStatus === 'CHECKED_IN' ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
