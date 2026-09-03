import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, MapPin, Calendar, Clock, DollarSign, Building2, CheckSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IResourceBooking } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const AMENITY_OPTIONS = [
  'Pro Rackets & Balls',
  'Fresh Linen Towel Service',
  'Private Bluetooth Sound',
  'Chilled Electrolyte Bar',
  'Safety Protective Gear',
  'HD Video Analysis Mount',
];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState<IResourceBooking['resourceType']>('COURT');
  const [resourcePhoto, setResourcePhoto] = useState<string | undefined>(undefined);
  const [bookedByMember, setBookedByMember] = useState('');
  const [bookedByAvatar, setBookedByAvatar] = useState<string | undefined>(undefined);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [paymentStatus, setPaymentStatus] = useState<IResourceBooking['paymentStatus']>('PAID');
  const [status, setStatus] = useState<IResourceBooking['status']>('RESERVED');
  const [zoneLocation, setZoneLocation] = useState('');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_resource_booking');
      if (stored) {
        const customList: IResourceBooking[] = JSON.parse(stored);
        const match = customList.find((b) => (b.id || b._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
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
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
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
      branchName: 'Main Facility',
      amenitiesIncluded: ['Pro Rackets & Balls', 'Fresh Linen Towel Service', 'Chilled Electrolyte Bar'],
      specialRequests: 'Ensure court flooring has been freshly swept and temperature set to 20°C.',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (booking: IResourceBooking) => {
    setResourceName(booking.resourceName || '');
    setResourceType(booking.resourceType || 'COURT');
    setResourcePhoto(booking.resourcePhoto);
    setBookedByMember(booking.bookedByMember || '');
    setBookedByAvatar(booking.bookedByAvatar);
    setBookingDate(booking.bookingDate || '');
    setStartTime(booking.startTime || '');
    setEndTime(booking.endTime || '');
    setDurationMinutes(booking.durationMinutes || 60);
    setHourlyRate(booking.hourlyRate || 40);
    setPaymentStatus(booking.paymentStatus || 'PAID');
    setStatus(booking.status || 'RESERVED');
    setZoneLocation(booking.zoneLocation || '');
    if (booking.branchId) setBranchId(booking.branchId);
    setSelectedAmenities(booking.amenitiesIncluded || []);
    setSpecialRequests(booking.specialRequests || '');
  };

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const calculatedTotal = ((durationMinutes / 60) * hourlyRate).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedBooking: Partial<IResourceBooking> = {
      resourceName,
      resourceType,
      resourcePhoto,
      bookedByMember,
      bookedByAvatar,
      bookingDate,
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes) || 60,
      hourlyRate: Number(hourlyRate) || 40,
      totalAmount: Number(calculatedTotal) || 0,
      paymentStatus,
      status,
      zoneLocation,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      amenitiesIncluded: selectedAmenities,
      specialRequests,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_resource_booking');
      if (stored) {
        const customList: IResourceBooking[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedBooking } as IResourceBooking;
          localStorage.setItem('gymflow_custom_resource_booking', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'RES-101', ...updatedBooking } as IResourceBooking);
          localStorage.setItem('gymflow_custom_resource_booking', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/resource-booking/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBooking),
      }).catch(() => {});

      toast.success(`Reservation #${id} updated!`);
      navigate('/scheduling/resource-booking');
    } catch {
      toast.error('Failed to update reservation');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
        title={`Edit Reservation: ${resourceName}`}
        subtitle="Modify reserved time window, member assignment, amenities, and rental rates."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/scheduling/resource-booking')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Reservations</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Resource Classification & Visuals */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Resource Specification & Member Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Resource Bay Photo</label>
                  <ImageUpload
                    value={resourcePhoto}
                    onChange={(url) => setResourcePhoto(url)}
                    variant="card"
                    helperText="Upload court / suite photo"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Resource Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Resource Category</label>
                      <Select value={resourceType} onValueChange={(val) => setResourceType(val as IResourceBooking['resourceType'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COURT">🏸 Squash / Padel Court</SelectItem>
                          <SelectItem value="RECOVERY_POD">🧖 Cold Plunge & Infrared Sauna</SelectItem>
                          <SelectItem value="STUDIO_ROOM">🧘 Pilates Reformer Bay</SelectItem>
                          <SelectItem value="COMBAT_RING">🥊 Boxing Sparring Ring</SelectItem>
                          <SelectItem value="PRIVATE_POD">⚡ Private VIP PT Pod</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Bay Status</label>
                      <Select value={status} onValueChange={(val) => setStatus(val as IResourceBooking['status'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RESERVED">📅 Reserved</SelectItem>
                          <SelectItem value="ACTIVE_IN_USE">🟡 Active In-Use</SelectItem>
                          <SelectItem value="RELEASED">🟢 Released & Completed</SelectItem>
                          <SelectItem value="CANCELED">⚪ Canceled</SelectItem>
                          <SelectItem value="MAINTENANCE_LOCKOUT">⚙️ Maintenance Lockout</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-blue-500" /> Branch
                      </label>
                      <Select value={branchId} onValueChange={setBranchId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branchOptions.map((b) => (
                            <SelectItem key={b.value} value={b.value}>
                              {b.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Reserved By Member <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={bookedByMember}
                      onChange={(e) => setBookedByMember(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Time Window & Accounting */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Reservation Window & Rental Accounting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" /> Date
                  </label>
                  <Input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" /> Start Time
                  </label>
                  <Input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" /> End Time
                  </label>
                  <Input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Duration (Mins)</label>
                  <Input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={15}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" /> Hourly Rate ($ USD)
                  </label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Fee</label>
                  <div className="h-9 px-3 rounded-md bg-muted/50 border border-input flex items-center font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    ${calculatedTotal}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Billing Status</label>
                  <Select value={paymentStatus} onValueChange={(val) => setPaymentStatus(val as IResourceBooking['paymentStatus'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">🟢 Paid & Settled</SelectItem>
                      <SelectItem value="PENDING">🟡 Pending Settlement</SelectItem>
                      <SelectItem value="VIP_TIER_COMPLIMENTARY">⭐ VIP Tier Complimentary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Campus Zone / Floor Location</label>
                <Input
                  value={zoneLocation}
                  onChange={(e) => setZoneLocation(e.target.value)}
                />
              </div>

              {/* Amenities */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-foreground block">Included Bay Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITY_OPTIONS.map((item) => {
                    const isChecked = selectedAmenities.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleAmenity(item)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
                          isChecked
                            ? 'bg-primary/10 border-primary text-primary font-semibold'
                            : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/60'
                        }`}
                      >
                        <CheckSquare className={`h-4 w-4 shrink-0 ${isChecked ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="truncate">{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Special Member Directives</label>
                <textarea
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Reservation ID: <strong className="font-mono text-foreground">{id || 'RES-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/scheduling/resource-booking')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Reservation</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
