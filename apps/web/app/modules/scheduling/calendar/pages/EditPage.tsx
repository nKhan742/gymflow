import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Calendar, Clock, MapPin, User, Users, Building2, Tag, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ICalendarEvent } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<ICalendarEvent['eventType']>('GROUP_CLASS');
  const [instructorName, setInstructorName] = useState('');
  const [instructorAvatar, setInstructorAvatar] = useState<string | undefined>(undefined);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [zoneName, setZoneName] = useState('');
  const [capacity, setCapacity] = useState(20);
  const [bookedCount, setBookedCount] = useState(0);
  const [status, setStatus] = useState<ICalendarEvent['status']>('SCHEDULED');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_calendar');
      if (stored) {
        const customList: ICalendarEvent[] = JSON.parse(stored);
        const match = customList.find((e) => (e.id || e._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/calendar/${id}`, {
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
      id: id || 'CAL-101',
      _id: id || 'CAL-101',
      eventTitle: 'Morning Functional HIIT BootCamp',
      eventType: 'GROUP_CLASS',
      instructorName: 'Coach Alex Rivera',
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      date: '2026-08-30',
      startTime: '07:00 AM',
      endTime: '08:00 AM',
      durationMinutes: 60,
      zoneName: 'Main Studio A (Wood Flooring)',
      capacity: 24,
      bookedCount: 22,
      color: '#6366F1',
      status: 'SCHEDULED',
      branchName: 'PD Vihar',
      description: 'High-intensity interval training focusing on functional power, kettlebells, and sprint drills.',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (event: ICalendarEvent) => {
    setEventTitle(event.eventTitle || '');
    setEventType(event.eventType || 'GROUP_CLASS');
    setInstructorName(event.instructorName || '');
    setInstructorAvatar(event.instructorAvatar);
    setDate(event.date || '');
    setStartTime(event.startTime || '');
    setEndTime(event.endTime || '');
    setDurationMinutes(event.durationMinutes || 60);
    setZoneName(event.zoneName || 'Main Studio A (Wood Flooring)');
    setCapacity(event.capacity || 20);
    setBookedCount(event.bookedCount || 0);
    setStatus(event.status || 'SCHEDULED');
    if (event.branchId) setBranchId(event.branchId);
    setDescription(event.description || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedEvent: Partial<ICalendarEvent> = {
      eventTitle,
      eventType,
      instructorName,
      instructorAvatar,
      date,
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes) || 60,
      zoneName,
      capacity: Number(capacity) || 20,
      bookedCount: Number(bookedCount) || 0,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      description,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_calendar');
      if (stored) {
        const customList: ICalendarEvent[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedEvent } as ICalendarEvent;
          localStorage.setItem('gymflow_custom_calendar', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'CAL-101', ...updatedEvent } as ICalendarEvent);
          localStorage.setItem('gymflow_custom_calendar', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/calendar/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      }).catch(() => {});

      toast.success(`Calendar event "${eventTitle}" updated!`);
      navigate('/scheduling/calendar');
    } catch {
      toast.error('Failed to update calendar event');
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
        title={`Edit Session: ${eventTitle}`}
        subtitle={`Modify time slot, zone placement, attendee capacity, and coaching briefing`}
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Event / Session Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Session Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as ICalendarEvent['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">📅 Scheduled</SelectItem>
                      <SelectItem value="IN_PROGRESS">🟡 In Progress (Active)</SelectItem>
                      <SelectItem value="COMPLETED">🟢 Completed</SelectItem>
                      <SelectItem value="CANCELED">⚪ Canceled</SelectItem>
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
                        <Tag className="h-3 w-3 text-primary" /> Booked Attendees
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Session ID: <strong className="font-mono text-foreground">{id || 'CAL-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/scheduling/calendar')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Session</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
