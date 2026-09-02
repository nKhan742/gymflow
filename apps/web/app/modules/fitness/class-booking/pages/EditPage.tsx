import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox, ISelectOption } from '../../../../shared/components/ui/select';
import {
  ArrowLeft,
  Save,
  Ticket,
  Clock,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IClassBooking } from '../types';
import { DEFAULT_CLASS_BOOKINGS } from './ListPage';
import { useBranchStore } from '../../../../core/store/branchStore';

const STATUS_OPTIONS: ISelectOption[] = [
  { value: 'CONFIRMED', label: '🔵 Confirmed Reservation' },
  { value: 'CHECKED_IN', label: '🟢 Checked-In (Turnstile Verified)' },
  { value: 'WAITLIST', label: '🟡 Waitlist Queue' },
  { value: 'CANCELLED', label: '⚪ Cancelled' },
  { value: 'NO_SHOW', label: '🔴 No Show' },
];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Member & Class
  const [memberName, setMemberName] = useState('');
  const [className, setClassName] = useState('');

  // Section 2: Date & Slot
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [spotNumber, setSpotNumber] = useState(4);

  // Section 3: Status & Branch
  const [bookingStatus, setBookingStatus] = useState<'CONFIRMED' | 'CHECKED_IN' | 'WAITLIST' | 'CANCELLED' | 'NO_SHOW'>('CONFIRMED');
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadBookingData();
  }, [id]);

  const loadBookingData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_CLASS_BOOKINGS.find((b) => b.id === id || b.bookingCode === id) || DEFAULT_CLASS_BOOKINGS[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/class-booking/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IClassBooking = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setMemberName(data.memberName);
      setClassName(data.className);
      setBookingDate(data.bookingDate || '');
      setTimeSlot(data.timeSlot || '');
      setSpotNumber(data.spotNumber || 4);
      setBookingStatus(data.bookingStatus || 'CONFIRMED');
      setBranchId(data.branchId || 'ALL');
    } catch {
      // Use fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IClassBooking> = {
        bookingDate,
        timeSlot,
        spotNumber: Number(spotNumber),
        bookingStatus,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/class-booking/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Booking for ${memberName} updated!`);
      navigate(`/fitness/class-booking/${id}`);
    } catch {
      toast.error('Network error updating booking');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Booking Data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Booking • ${memberName}`}
        subtitle="Modify spot reservation numbers, calendar dates, and attendance statuses."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/fitness/class-booking/${id}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              disabled={saving}
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: MEMBER & CLASS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" />
                1. Member & Class Information
              </CardTitle>
              <CardDescription className="text-xs">Trainee and class format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Member</label>
                <Input value={memberName} disabled className="bg-muted" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Class Title</label>
                <Input value={className} disabled className="bg-muted" />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: DATE & SPOT */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                2. Schedule Date & Spot Allocation
              </CardTitle>
              <CardDescription className="text-xs">Specific calendar date and spot number.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Booking Date</label>
                  <Input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Spot / Bike / Mat #</label>
                  <Input
                    type="number"
                    value={spotNumber}
                    onChange={(e) => setSpotNumber(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Time Slot</label>
                <Input
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: STATUS & BRANCH */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                3. Reservation Status & Facility Scope
              </CardTitle>
              <CardDescription className="text-xs">Attendance status and location context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reservation Status</label>
                  <SelectBox
                    options={STATUS_OPTIONS}
                    value={bookingStatus}
                    onChange={(val) => setBookingStatus(val as any)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Scope</label>
                  <SelectBox
                    options={branchOptions}
                    value={branchId}
                    onChange={setBranchId}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/fitness/class-booking/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={saving}
            className="gap-1.5 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
