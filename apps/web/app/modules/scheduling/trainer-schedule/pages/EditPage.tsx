import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, User, Clock, Calendar, DollarSign, MapPin, Building2, Dumbbell } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrainerSchedule } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [trainerName, setTrainerName] = useState('');
  const [trainerPhoto, setTrainerPhoto] = useState<string | undefined>(undefined);
  const [specialty, setSpecialty] = useState('');
  const [shiftType, setShiftType] = useState<ITrainerSchedule['shiftType']>('MORNING_OPEN');
  const [shiftHours, setShiftHours] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['MON', 'TUE', 'WED', 'THU', 'FRI']);
  const [maxPtClientsPerDay, setMaxPtClientsPerDay] = useState(6);
  const [bookedPtCount, setBookedPtCount] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [availabilityStatus, setAvailabilityStatus] = useState<ITrainerSchedule['availabilityStatus']>('AVAILABLE');
  const [assignedZone, setAssignedZone] = useState('');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSchedule();
  }, [id]);

  const loadSchedule = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
      if (stored) {
        const customList: ITrainerSchedule[] = JSON.parse(stored);
        const match = customList.find((s) => (s.id || s._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/trainer-schedule/${id}`, {
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
      id: id || 'TS-101',
      _id: id || 'TS-101',
      trainerName: 'Coach Alex Rivera',
      trainerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      specialty: 'Hypertrophy & Strength Biomechanics',
      shiftType: 'MORNING_OPEN',
      shiftHours: '06:00 AM - 02:00 PM',
      availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      maxPtClientsPerDay: 6,
      bookedPtCount: 5,
      hourlyRate: 85,
      availabilityStatus: 'AVAILABLE',
      assignedZone: 'Free Weights Floor & Platform Bay',
      branchName: 'Main Facility',
      notes: 'Specializes in Olympic barbell lifts and hypertrophy periodization.',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (schedule: ITrainerSchedule) => {
    setTrainerName(schedule.trainerName || '');
    setTrainerPhoto(schedule.trainerPhoto);
    setSpecialty(schedule.specialty || '');
    setShiftType(schedule.shiftType || 'MORNING_OPEN');
    setShiftHours(schedule.shiftHours || '06:00 AM - 02:00 PM');
    setSelectedDays(schedule.availableDays || ['MON', 'TUE', 'WED', 'THU', 'FRI']);
    setMaxPtClientsPerDay(schedule.maxPtClientsPerDay || 6);
    setBookedPtCount(schedule.bookedPtCount || 0);
    setHourlyRate(schedule.hourlyRate || 85);
    setAvailabilityStatus(schedule.availabilityStatus || 'AVAILABLE');
    setAssignedZone(schedule.assignedZone || 'Free Weights Floor');
    if (schedule.branchId) setBranchId(schedule.branchId);
    setNotes(schedule.notes || '');
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedSchedule: Partial<ITrainerSchedule> = {
      trainerName,
      trainerPhoto,
      specialty,
      shiftType,
      shiftHours,
      availableDays: selectedDays,
      maxPtClientsPerDay: Number(maxPtClientsPerDay) || 5,
      bookedPtCount: Number(bookedPtCount) || 0,
      hourlyRate: Number(hourlyRate) || 75,
      availabilityStatus,
      assignedZone,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      notes,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
      if (stored) {
        const customList: ITrainerSchedule[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedSchedule } as ITrainerSchedule;
          localStorage.setItem('gymflow_custom_trainer_schedule', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'TS-101', ...updatedSchedule } as ITrainerSchedule);
          localStorage.setItem('gymflow_custom_trainer_schedule', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/trainer-schedule/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSchedule),
      }).catch(() => {});

      toast.success(`Trainer schedule for "${trainerName}" updated!`);
      navigate('/scheduling/trainer-schedule');
    } catch {
      toast.error('Failed to update trainer schedule');
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
        title={`Edit Schedule: ${trainerName}`}
        subtitle="Modify trainer shift hours, weekly active days, hourly rate, and daily PT capacity limits."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/scheduling/trainer-schedule')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Roster</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Trainer Profile & Specialty */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Coach Identity & Coaching Specialty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Coach Headshot</label>
                  <ImageUpload
                    value={trainerPhoto}
                    onChange={(url) => setTrainerPhoto(url)}
                    variant="avatar"
                    helperText="Upload coach profile photo"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Trainer Full Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={trainerName}
                        onChange={(e) => setTrainerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Coaching Specialty</label>
                      <Input
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Shift Template</label>
                      <Select value={shiftType} onValueChange={(val) => setShiftType(val as ITrainerSchedule['shiftType'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MORNING_OPEN">🌅 Morning Open (06:00 - 14:00)</SelectItem>
                          <SelectItem value="MID_DAY">☀️ Mid-Day Shift (10:00 - 18:00)</SelectItem>
                          <SelectItem value="EVENING_PEAK">🌙 Evening Peak (14:00 - 22:00)</SelectItem>
                          <SelectItem value="FULL_DAY_WEEKEND">⚡ Weekend Shift (08:00 - 18:00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-500" /> Shift Hours Window
                      </label>
                      <Input
                        value={shiftHours}
                        onChange={(e) => setShiftHours(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Floor Duty State</label>
                      <Select value={availabilityStatus} onValueChange={(val) => setAvailabilityStatus(val as ITrainerSchedule['availabilityStatus'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AVAILABLE">🟢 Available for PT</SelectItem>
                          <SelectItem value="ON_DUTY_SESSION">🟡 In Active Session</SelectItem>
                          <SelectItem value="ON_BREAK">☕ On Meal / Break</SelectItem>
                          <SelectItem value="OFF_DUTY">⚪ Off Duty / Roster Rest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Weekly Days & PT Capacity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Weekly Roster Days & PT Quotas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">Active Days of the Week</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`h-9 px-4 rounded-lg font-mono text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'bg-muted/40 text-muted-foreground hover:bg-muted border border-border/80'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Dumbbell className="h-3 w-3 text-primary" /> Max PT Slots / Day
                  </label>
                  <Input
                    type="number"
                    value={maxPtClientsPerDay}
                    onChange={(e) => setMaxPtClientsPerDay(Number(e.target.value))}
                    min={1}
                    max={12}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" /> Hourly PT Rate ($ USD)
                  </label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min={20}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-rose-500" /> Assigned Floor Zone
                  </label>
                  <Input
                    value={assignedZone}
                    onChange={(e) => setAssignedZone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Coaching Bio & Client Directives</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Roster ID: <strong className="font-mono text-foreground">{id || 'TS-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/scheduling/trainer-schedule')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Trainer Schedule</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
