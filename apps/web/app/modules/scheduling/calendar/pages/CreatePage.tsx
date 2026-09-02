import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Calendar, Clock, MapPin, User, Users, Building2, Tag, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ICalendarEvent } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [eventTitle, setEventTitle] = useState('Morning Functional HIIT BootCamp');
  const [eventType, setEventType] = useState<ICalendarEvent['eventType']>('GROUP_CLASS');
  const [instructorName, setInstructorName] = useState('Coach Alex Rivera');
  const [instructorAvatar, setInstructorAvatar] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('07:00 AM');
  const [endTime, setEndTime] = useState('08:00 AM');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [zoneName, setZoneName] = useState('Main Studio A (Wood Flooring)');
  const [capacity, setCapacity] = useState(24);
  const [bookedCount, setBookedCount] = useState(12);
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [description, setDescription] = useState('High-intensity interval training focusing on functional power, kettlebells, and battle ropes.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `CAL-${Math.floor(100 + Math.random() * 900)}`;

    const newEvent: ICalendarEvent = {
      id: newId,
      _id: newId,
      eventTitle,
      eventType,
      instructorName,
      instructorAvatar: instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      date,
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes) || 60,
      zoneName,
      capacity: Number(capacity) || 20,
      bookedCount: Number(bookedCount) || 0,
      status: 'SCHEDULED',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_calendar');
      const customList: ICalendarEvent[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newEvent);
      localStorage.setItem('gymflow_custom_calendar', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/calendar', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      }).catch(() => {});

      toast.success(`Calendar event "${eventTitle}" scheduled!`, {
        description: `${date} • ${startTime} - ${endTime} • ${zoneName}`,
      });
      navigate('/scheduling/calendar');
    } catch {
      toast.error('Failed to schedule calendar event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Schedule Master Calendar Session"
        subtitle="Coordinate studio classes, 1-on-1 PT blocks, biometric assessments, and facility zone bookings."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/scheduling/calendar')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Calendar</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Event Identity & Category */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Session Title & Classification
              </CardTitle>
              <CardDescription>
                Primary session name, session type format, and target campus zone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Event / Session Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Olympic Lifting Masterclass"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Event Type</label>
                  <Select value={eventType} onValueChange={(val) => setEventType(val as ICalendarEvent['eventType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GROUP_CLASS">🔥 Group Studio Class</SelectItem>
                      <SelectItem value="PT_SESSION">🏋️ 1-on-1 Personal Training</SelectItem>
                      <SelectItem value="FITNESS_ASSESSMENT">📈 InBody & Biometric Assessment</SelectItem>
                      <SelectItem value="FACILITY_TOUR">🏛️ VIP Guest Campus Tour</SelectItem>
                      <SelectItem value="MAINTENANCE_LOCKOUT">⚙️ Zone Maintenance Lockout</SelectItem>
                      <SelectItem value="WORKSHOP">🥗 Nutrition & Athlete Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-rose-500" /> Floor Zone / Room Placement
                  </label>
                  <Select value={zoneName} onValueChange={setZoneName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Studio A (Wood Flooring)">🧘 Main Studio A (Wood Flooring)</SelectItem>
                      <SelectItem value="Spinning Cycling Theater">🚴 Spinning Cycling Theater</SelectItem>
                      <SelectItem value="Functional Sprint Turf">🎯 Functional Sprint Turf</SelectItem>
                      <SelectItem value="Free Weights Platform Bay">🏋️ Free Weights Platform Bay</SelectItem>
                      <SelectItem value="Boxing Ring & Combat Bay">🥊 Boxing Ring & Combat Bay</SelectItem>
                      <SelectItem value="Recovery Wet Lounge">🧖 Recovery Wet Lounge & Cold Plunge</SelectItem>
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
            </CardContent>
          </Card>

          {/* Card 2: Instructor, Timing & Capacity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Instructor Assignment & Timing Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Instructor Headshot</label>
                  <ImageUpload
                    value={instructorAvatar}
                    onChange={(url) => setInstructorAvatar(url)}
                    variant="avatar"
                    helperText="Upload coach profile photo"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Instructor / Head Coach <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Coach Alex Rivera"
                      value={instructorName}
                      onChange={(e) => setInstructorName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-blue-500" /> Date
                      </label>
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-500" /> Start Time
                      </label>
                      <Input
                        placeholder="07:00 AM"
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
                        placeholder="08:00 AM"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        <Users className="h-3 w-3 text-emerald-500" /> Spot Capacity
                      </label>
                      <Input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        min={1}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3 text-primary" /> Initial Booked Count
                      </label>
                      <Input
                        type="number"
                        value={bookedCount}
                        onChange={(e) => setBookedCount(Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Session Brief / Coaching Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Required footwear, equipment setup checklist, heart rate monitor requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Branch: <strong className="text-foreground">{branchOptions.find((b) => b.value === branchId)?.label || 'PD Vihar'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/scheduling/calendar')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Publish to Calendar</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
