import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, User, Clock, Calendar, DollarSign, MapPin, Dumbbell, Activity, CalendarPlus, Sparkles, ShieldCheck } from 'lucide-react';
import { ITrainerSchedule } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<ITrainerSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, [id]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
      if (stored) {
        const customList: ITrainerSchedule[] = JSON.parse(stored);
        const match = customList.find((s) => (s.id || s._id) === id);
        if (match) {
          setSchedule(match);
          setLoading(false);
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
          setSchedule(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setSchedule({
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
      branchName: 'PD Vihar',
      notes: 'Specializes in Olympic barbell lifts, post-rehab conditioning, and progressive overload periodization.',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleToggleStatus = () => {
    if (!schedule) return;
    const nextStatus: ITrainerSchedule['availabilityStatus'] =
      schedule.availabilityStatus === 'AVAILABLE'
        ? 'ON_DUTY_SESSION'
        : schedule.availabilityStatus === 'ON_DUTY_SESSION'
        ? 'ON_BREAK'
        : schedule.availabilityStatus === 'ON_BREAK'
        ? 'OFF_DUTY'
        : 'AVAILABLE';

    const updated = { ...schedule, availabilityStatus: nextStatus };
    setSchedule(updated);

    const stored = localStorage.getItem('gymflow_custom_trainer_schedule');
    if (stored) {
      const customList: ITrainerSchedule[] = JSON.parse(stored);
      const listUpdated = customList.map((s) => ((s.id || s._id) === (schedule.id || schedule._id) ? updated : s));
      localStorage.setItem('gymflow_custom_trainer_schedule', JSON.stringify(listUpdated));
    }

    toast.success(`Duty status updated to ${nextStatus}!`);
  };

  if (loading || !schedule) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  const ptUtilization = schedule.maxPtClientsPerDay > 0
    ? Math.round((schedule.bookedPtCount / schedule.maxPtClientsPerDay) * 100)
    : 0;

  return (
    <PageContainer>
      <PageHeader
        title={schedule.trainerName}
        subtitle={`${schedule.specialty} • ${schedule.shiftHours} (${schedule.shiftType?.replace(/_/g, ' ')})`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/scheduling/trainer-schedule')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Roster</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/scheduling/trainer-schedule/${schedule.id || schedule._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Schedule</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-primary border-primary/30"
              onClick={handleToggleStatus}
            >
              <Activity className="h-4 w-4" />
              <span>Toggle Duty State</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
              onClick={() => {
                navigate('/scheduling/appointments/create', {
                  state: {
                    trainerName: schedule.trainerName,
                    hourlyRate: schedule.hourlyRate,
                    assignedZone: schedule.assignedZone,
                  },
                });
              }}
            >
              <CalendarPlus className="h-4 w-4" />
              <span>Book 1-on-1 PT</span>
            </Button>
          </div>
        }
      />

      {/* Trainer Banner */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shrink-0">
                <AvatarImage src={schedule.trainerPhoto} alt={schedule.trainerName} />
                <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                  {schedule.trainerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {schedule.shiftType?.replace(/_/g, ' ')}
                  </Badge>
                  <Badge
                    variant={
                      schedule.availabilityStatus === 'AVAILABLE'
                        ? 'success'
                        : schedule.availabilityStatus === 'ON_DUTY_SESSION'
                        ? 'warning'
                        : schedule.availabilityStatus === 'ON_BREAK'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="text-[10px] font-semibold uppercase"
                  >
                    {schedule.availabilityStatus?.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">• {schedule.branchName || 'PD Vihar'}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{schedule.trainerName}</h2>
                <p className="text-xs text-muted-foreground">
                  Specialty: <strong className="text-foreground">{schedule.specialty}</strong> • Floor Zone:{' '}
                  <strong className="text-primary">{schedule.assignedZone}</strong>
                </p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xs text-muted-foreground">Hourly Private Rate:</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                ${schedule.hourlyRate} <span className="text-xs font-normal text-muted-foreground">/ session</span>
              </p>
              <span className="text-[11px] text-muted-foreground block font-mono">{schedule.shiftHours}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DAILY PT CAPACITY</span>
            <Dumbbell className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">
            {schedule.bookedPtCount} / {schedule.maxPtClientsPerDay} <span className="text-xs font-normal text-muted-foreground">({ptUtilization}%)</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Today's PT Bookings</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SHIFT WINDOW</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs font-bold text-foreground mt-1 font-mono">{schedule.shiftHours}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{schedule.shiftType?.replace(/_/g, ' ')}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ROSTER DAYS</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {schedule.availableDays?.map((d) => (
              <span key={d} className="px-1 py-0.5 bg-muted rounded font-mono text-[10px] font-bold text-foreground">
                {d}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{schedule.availableDays?.length} Active Days/Week</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CAMPUS DUTY STATE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">{schedule.availabilityStatus}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Live Floor Presence</p>
        </Card>
      </div>

      {/* Bio & Specialty Brief */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Coaching Bio & Specialty Directives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {schedule.notes || 'No specialized bio directives registered for this coach.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
