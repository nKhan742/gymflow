import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, MapPin, Calendar, Clock, DollarSign, Building2, Shield, Sparkles, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [resourceName, setResourceName] = useState('Championship Glass Squash Court 1');
  const [resourceType, setResourceType] = useState<IResourceBooking['resourceType']>('COURT');
  const [resourcePhoto, setResourcePhoto] = useState<string | undefined>(undefined);
  const [bookedByMember, setBookedByMember] = useState('Harrison Ford');
  const [bookedByAvatar, setBookedByAvatar] = useState<string | undefined>(undefined);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('09:30 AM');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [paymentStatus, setPaymentStatus] = useState<IResourceBooking['paymentStatus']>('PAID');
  const [zoneLocation, setZoneLocation] = useState('Racket Sports Pavilion - Court Level');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Pro Rackets & Balls',
    'Fresh Linen Towel Service',
    'Chilled Electrolyte Bar',
  ]);
  const [specialRequests, setSpecialRequests] = useState('Ensure court flooring has been freshly swept and temperature set to 20°C.');

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

    const newId = `RES-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking: IResourceBooking = {
      id: newId,
      _id: newId,
      resourceName,
      resourceType,
      resourcePhoto: resourcePhoto || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&auto=format&fit=crop&q=80',
      bookedByMember,
      bookedByAvatar: bookedByAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bookingDate,
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes) || 60,
      hourlyRate: Number(hourlyRate) || 40,
      totalAmount: Number(calculatedTotal) || 0,
      paymentStatus,
      status: 'RESERVED',
      zoneLocation,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      amenitiesIncluded: selectedAmenities,
      specialRequests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_resource_booking');
      const customList: IResourceBooking[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newBooking);
      localStorage.setItem('gymflow_custom_resource_booking', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/resource-booking', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      }).catch(() => {});

      toast.success(`Resource reserved: "${resourceName}"!`, {
        description: `${bookingDate} (${startTime} - ${endTime}) for ${bookedByMember}`,
      });
      navigate('/scheduling/resource-booking');
    } catch {
      toast.error('Failed to reserve facility resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Reserve Facility Bay or Amenity"
        subtitle="Book squash/padel courts, private recovery suites, cold plunge pods, boxing sparring rings, and reformer bays."
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
                      placeholder="e.g. Glass Squash Court 1"
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-blue-500" /> Campus Branch
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
                      placeholder="Member Full Name"
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
                Branch: <strong className="text-foreground">{branchOptions.find((b) => b.value === branchId)?.label || 'PD Vihar'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/scheduling/resource-booking')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Confirm Reservation</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
