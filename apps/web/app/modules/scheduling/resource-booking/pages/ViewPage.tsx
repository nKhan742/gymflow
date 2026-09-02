import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, MapPin, Calendar, Clock, DollarSign, Building2, Shield, Sparkles, CheckSquare, Activity, ShieldCheck } from 'lucide-react';
import { IResourceBooking } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IResourceBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_resource_booking');
      if (stored) {
        const customList: IResourceBooking[] = JSON.parse(stored);
        const match = customList.find((b) => (b.id || b._id) === id);
        if (match) {
          setBooking(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/resource-booking/${id}`, {
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
    } catch {}

    setBooking({
      id: id || 'RES-101',
      _id: id || 'RES-101',
      resourceName: 'Championship Glass Squash Court 1',
      resourceType: 'COURT',
      resourcePhoto: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&auto=format&fit=crop&q=80',
      bookedByMember: 'Harrison Ford',
      bookedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bookingDate: '2026-08-30',
      startTime: '08:00 AM',
      endTime: '09:30 AM',
      durationMinutes: 90,
      hourlyRate: 45,
      totalAmount: 67.5,
      paymentStatus: 'PAID',
      status: 'RESERVED',
      zoneLocation: 'Racket Sports Pavilion - Court Level',
      branchName: 'PD Vihar',
      amenitiesIncluded: ['Pro Rackets & Balls', 'Fresh Linen Towel Service', 'Chilled Electrolyte Bar'],
      specialRequests: 'Ensure court flooring has been freshly swept and temperature set to 20°C.',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleToggleStatus = () => {
    if (!booking) return;
    const nextStatus: IResourceBooking['status'] =
      booking.status === 'RESERVED'
        ? 'ACTIVE_IN_USE'
        : booking.status === 'ACTIVE_IN_USE'
        ? 'RELEASED'
        : 'RESERVED';

    const updated = { ...booking, status: nextStatus };
    setBooking(updated);

    const stored = localStorage.getItem('gymflow_custom_resource_booking');
    if (stored) {
      const customList: IResourceBooking[] = JSON.parse(stored);
      const listUpdated = customList.map((b) => ((b.id || b._id) === (booking.id || booking._id) ? updated : b));
      localStorage.setItem('gymflow_custom_resource_booking', JSON.stringify(listUpdated));
    }

    toast.success(`Resource status updated to ${nextStatus}!`);
  };

  if (loading || !booking) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={booking.resourceName}
        subtitle={`${booking.resourceType?.replace(/_/g, ' ')} • ${booking.bookingDate} (${booking.startTime} - ${booking.endTime})`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/scheduling/resource-booking')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Reservations</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/scheduling/resource-booking/${booking.id || booking._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Reservation</span>
            </Button>
            <Button
              size="sm"
              className={`gap-1.5 font-semibold shadow-xs ${
                booking.status === 'RESERVED'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : booking.status === 'ACTIVE_IN_USE'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-primary'
              }`}
              onClick={handleToggleStatus}
            >
              <Activity className="h-4 w-4" />
              <span>
                {booking.status === 'RESERVED'
                  ? 'Check-In Member to Bay'
                  : booking.status === 'ACTIVE_IN_USE'
                  ? 'Release & Mark Cleaned'
                  : 'Re-open Reservation'}
              </span>
            </Button>
          </div>
        }
      />

      {/* Resource Banner Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="h-48 md:h-full bg-muted">
            <img
              src={booking.resourcePhoto}
              alt={booking.resourceName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {booking.resourceType?.replace(/_/g, ' ')}
                </Badge>
                <Badge
                  variant={
                    booking.status === 'ACTIVE_IN_USE'
                      ? 'warning'
                      : booking.status === 'RELEASED'
                      ? 'success'
                      : 'default'
                  }
                  className="text-[10px] font-semibold uppercase"
                >
                  {booking.status?.replace(/_/g, ' ')}
                </Badge>
                <span className="text-xs text-muted-foreground">• {booking.branchName || 'PD Vihar'}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{booking.resourceName}</h2>
              <p className="text-xs text-muted-foreground">
                Location: <strong className="text-primary">{booking.zoneLocation}</strong>
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={booking.bookedByAvatar} alt={booking.bookedByMember} />
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {booking.bookedByMember.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Reserved For</span>
                  <span className="text-xs font-bold text-foreground">{booking.bookedByMember}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block">Total Rental Settlement</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ${booking.totalAmount?.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-muted-foreground">({booking.paymentStatus?.replace(/_/g, ' ')})</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HOURLY RATE</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">${booking.hourlyRate}/hr</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Campus Amenity Fee</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TIME SLOT</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs font-bold text-foreground mt-1 font-mono">{booking.startTime} - {booking.endTime}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{booking.bookingDate} ({booking.durationMinutes}m)</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FLOOR LOCATION</span>
            <MapPin className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xs font-bold text-foreground mt-1 truncate">{booking.zoneLocation}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{booking.branchName || 'PD Vihar'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">BAY STATUS</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">{booking.status}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Amenity Occupancy</p>
        </Card>
      </div>

      {/* Amenities & Special Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Included Bay Amenities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {booking.amenitiesIncluded && booking.amenitiesIncluded.length > 0 ? (
                booking.amenitiesIncluded.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs py-1 px-2.5 bg-muted/40 font-medium">
                    ✓ {amenity}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Standard access amenity package.</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Member Directives & Setup Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {booking.specialRequests || 'No special setup instructions logged.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
