import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, User, Clock, Calendar, DollarSign, MapPin, Building2, Dumbbell, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrainerSchedule } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [trainerName, setTrainerName] = useState('Coach Alex Rivera');
  const [trainerPhoto, setTrainerPhoto] = useState<string | undefined>(undefined);
  const [specialty, setSpecialty] = useState('Hypertrophy & Strength Biomechanics');
  const [shiftType, setShiftType] = useState<ITrainerSchedule['shiftType']>('MORNING_OPEN');
  const [shiftHours, setShiftHours] = useState('06:00 AM - 02:00 PM');
  const [selectedDays, setSelectedDays] = useState<string[]>(['MON', 'TUE', 'WED', 'THU', 'FRI']);
  const [maxPtClientsPerDay, setMaxPtClientsPerDay] = useState(6);
  const [bookedPtCount, setBookedPtCount] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [availabilityStatus, setAvailabilityStatus] = useState<ITrainerSchedule['availabilityStatus']>('AVAILABLE');
  const [assignedZone, setAssignedZone] = useState('Free Weights Floor & Platform Bay');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('Specializes in Olympic barbell lifts, post-rehab conditioning, and progressive overload periodization.');

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

    const newId = `TS-${Math.floor(100 + Math.random() * 900)}`;

    const newSchedule: ITrainerSchedule = {
      id: newId,
      _id: newId,
      trainerName,
      trainerPhoto: trainerPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
      const customList: ITrainerSchedule[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newSchedule);
      localStorage.setItem('gymflow_custom_trainer_schedule', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/trainer-schedule', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      }).catch(() => {});

      toast.success(`Schedule configured for "${trainerName}"!`, {
        description: `Shift: ${shiftHours} • Rate: $${hourlyRate}/hr`,
      });
      navigate('/scheduling/trainer-schedule');
    } catch {
      toast.error('Failed to configure trainer schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Configure Trainer Roster & Shift Windows"
        subtitle="Set coach availability, daily 1-on-1 PT capacity limits, hourly rates, and floor zone assignments."
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
                        placeholder="e.g. Coach Alex Rivera"
                        value={trainerName}
                        onChange={(e) => setTrainerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Coaching Specialty</label>
                      <Input
                        placeholder="e.g. Hypertrophy & Biomechanics"
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
                Branch: <strong className="text-foreground">{branchOptions.find((b) => b.value === branchId)?.label || 'Main Facility'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/scheduling/trainer-schedule')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Save Trainer Schedule</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
