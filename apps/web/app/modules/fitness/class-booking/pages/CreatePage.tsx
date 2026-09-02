import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Users,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IClassBooking } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const MEMBER_OPTIONS: ISelectOption[] = [
  { value: 'MEM-001', label: '👤 Sophia Sterling (MEM-001)' },
  { value: 'MEM-002', label: '👤 Alexander Wright (MEM-002)' },
  { value: 'MEM-003', label: '👤 Isabella Rodriguez (MEM-003)' },
  { value: 'MEM-004', label: '👤 Liam O’Connor (MEM-004)' },
  { value: 'MEM-005', label: '👤 David Kim (MEM-005)' },
];

const CLASS_OPTIONS: ISelectOption[] = [
  { value: 'CLS-HIT-01', label: '🔥 Metabolic Blitz: HIIT Intervals (Elena Rostova)' },
  { value: 'CLS-SPN-02', label: '🚴 Apex Rhythm Spin & Sprints (Marcus Vance)' },
  { value: 'CLS-BOX-03', label: '🥊 Muay Thai Combat (Gabriel Santos)' },
  { value: 'CLS-YOG-04', label: '🧘 Infrared Hot Vinyasa Yoga (Elena Rostova)' },
  { value: 'CLS-OLY-05', label: '🏋️ Olympic Clean & Snatch (Damon Walker)' },
];

const STATUS_OPTIONS: ISelectOption[] = [
  { value: 'CONFIRMED', label: '🔵 Confirmed Reservation' },
  { value: 'CHECKED_IN', label: '🟢 Checked-In (Turnstile Verified)' },
  { value: 'WAITLIST', label: '🟡 Waitlist Queue' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Section 1: Member & Class
  const [memberId, setMemberId] = useState('MEM-001');
  const [classId, setClassId] = useState('CLS-HIT-01');

  // Section 2: Date & Slot
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('06:30 AM – 07:15 AM');
  const [spotNumber, setSpotNumber] = useState(4);

  // Section 3: Status & Branch
  const [bookingStatus, setBookingStatus] = useState<any>('CONFIRMED');
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const memberLabel = MEMBER_OPTIONS.find((m) => m.value === memberId)?.label || '';
    const selectedMember = memberLabel.replace('👤 ', '') || 'Member';
    const classLabel = CLASS_OPTIONS.find((c) => c.value === classId)?.label || 'Class';

    const newId = `BKG-${Math.floor(100 + Math.random() * 900)}`;
    const payload: IClassBooking = {
      id: newId,
      _id: newId,
      bookingCode: newId,
      memberId,
      memberName: selectedMember.split(' (')[0],
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      memberEmail: `${memberId.toLowerCase()}@example.com`,
      classId,
      className: (classLabel.split(' (')[0] || '').replace('🔥 ', '').replace('🚴 ', '').replace('🥊 ', '').replace('🧘 ', '').replace('🏋️ ', ''),
      classCategory: 'GROUP_FITNESS',
      instructorName: classLabel.includes('(') ? (classLabel.split('(')[1] || '').replace(')', '') : 'Lead Coach',
      studioRoom: 'Main Fitness Studio',
      bookingDate,
      timeSlot,
      spotNumber: Number(spotNumber),
      bookingStatus,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_class_bookings');
      const customList: IClassBooking[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((b) => b.id !== newId && b.bookingCode !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_class_bookings', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/class-booking', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Spot reserved for ${selectedMember.split(' (')[0]}!`);
      navigate(`/fitness/class-booking/${newId}`);
    } catch {
      toast.error('Error reserving spot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Reserve Group Class Spot"
        subtitle="Book a spot for a member in scheduled studio classes with spot allocation and attendance validation."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/fitness/class-booking')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              className="gap-1.5 shadow-sm"
              disabled={loading}
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Reserving...' : 'Confirm Spot'}</span>
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
                1. Member & Studio Class
              </CardTitle>
              <CardDescription className="text-xs">Trainee and class format pairing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select Gym Member</label>
                <SelectBox
                  options={MEMBER_OPTIONS}
                  value={memberId}
                  onChange={setMemberId}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select Group Fitness Class</label>
                <SelectBox
                  options={CLASS_OPTIONS}
                  value={classId}
                  onChange={setClassId}
                />
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
              <CardDescription className="text-xs">Specific calendar date and numbered mat/bike.</CardDescription>
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
                  placeholder="06:30 AM – 07:15 AM"
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: STATUS & BRANCH */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
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
            onClick={() => navigate('/fitness/class-booking')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="gap-1.5 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Reserving...' : 'Confirm Spot'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
