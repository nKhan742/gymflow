import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import {
  Dumbbell,
  Users,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Activity,
  Award,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IPtSessionItem, IClientRosterItem } from '../types';
import { useAuthStore } from '../../../../core/store/authStore';
import { useBranchStore } from '../../../../core/store/branchStore';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { realtimeService } from '../../../../core/notifications/realtimeService';

const INITIAL_TRAINER_SESSIONS: IPtSessionItem[] = [
  {
    id: 'pt-101',
    clientName: 'Marcus Vance',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    sessionTime: '08:00 AM - 09:00 AM',
    focusArea: 'Posterior Chain Hypertrophy & Barbell RDLs',
    programPhase: 'Mesocycle Week 3 • Heavy Load',
    status: 'COMPLETED',
    notes: 'Hit clean 140kg x 6 reps on RDL with zero lower back strain.',
  },
  {
    id: 'pt-102',
    clientName: 'Elena Rostova',
    clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    sessionTime: '10:30 AM - 11:30 AM',
    focusArea: 'Upper Body Push / Shoulder Stabilization & Core',
    programPhase: 'Structural Balance & Deload',
    status: 'IN_PROGRESS',
    notes: 'Progressed to overhead kettlebell carries.',
  },
  {
    id: 'pt-103',
    clientName: 'Darius Sterling',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    sessionTime: '02:00 PM - 03:00 PM',
    focusArea: 'VO2 Max Conditioning & Functional Kettlebell Intervals',
    programPhase: 'Cardiovascular Conditioning',
    status: 'CONFIRMED',
    notes: 'Target heart rate zone 4 sprints on Assault Runner.',
  },
];

const INITIAL_TRAINER_CLIENTS: IClientRosterItem[] = [
  {
    id: 'cli-01',
    clientName: 'Marcus Aurelius Vance',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    goalProgressPercent: 88,
    bodyFatChangePercent: -4.2,
    packageRemaining: 14,
    totalSessions: 20,
    lastWorkoutDate: 'Yesterday (Leg Hypertrophy)',
  },
  {
    id: 'cli-02',
    clientName: 'Elena Rostova',
    clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    goalProgressPercent: 95,
    bodyFatChangePercent: -6.1,
    packageRemaining: 8,
    totalSessions: 10,
    lastWorkoutDate: 'Today (Mobility & Core)',
  },
  {
    id: 'cli-03',
    clientName: 'Darius Sterling',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    goalProgressPercent: 74,
    bodyFatChangePercent: -2.8,
    packageRemaining: 19,
    totalSessions: 24,
    lastWorkoutDate: '2 days ago (Deadlift PR)',
  },
];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [trainerStaff, setTrainerStaff] = useState<any>(null);
  const [loadingStaff, setLoadingStaff] = useState<boolean>(true);

  const [sessions, setSessions] = useState<IPtSessionItem[]>(() => {
    const saved = localStorage.getItem('gymflow_trainer_sessions');
    return saved ? JSON.parse(saved) : INITIAL_TRAINER_SESSIONS;
  });

  const [clients, setClients] = useState<IClientRosterItem[]>(() => {
    const saved = localStorage.getItem('gymflow_trainer_clients');
    return saved ? JSON.parse(saved) : INITIAL_TRAINER_CLIENTS;
  });

  useEffect(() => {
    loadTrainerStaffDossier();
  }, [user?.email, user?.id]);

  const loadTrainerStaffDossier = async () => {
    setLoadingStaff(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const staffList = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        const userEmail = user?.email?.toLowerCase().trim();
        const matched = staffList.find(
          (s: any) =>
            s.email?.toLowerCase().trim() === userEmail ||
            s.userId === user?.id ||
            s._id === user?.id
        );
        if (matched) {
          setTrainerStaff(matched);
        }
      }
    } catch {}
    setLoadingStaff(false);
  };

  const toggleSessionStatus = (id: string) => {
    const updated: IPtSessionItem[] = sessions.map((s) => {
      if (s.id === id) {
        const nextStatus: 'CONFIRMED' | 'COMPLETED' = s.status === 'COMPLETED' ? 'CONFIRMED' : 'COMPLETED';
        toast.success(`Session for ${s.clientName} marked as ${nextStatus}!`);

        // Realtime notification with sound
        realtimeService.dispatchNotification({
          title: `PT Session Updated`,
          message: `Session for athlete ${s.clientName} has been marked as ${nextStatus}.`,
          notificationType: 'success',
          sound: true,
          metadata: { sessionId: id, status: nextStatus },
        });

        return { ...s, status: nextStatus };
      }
      return s;
    });

    setSessions(updated);
    localStorage.setItem('gymflow_trainer_sessions', JSON.stringify(updated));
  };

  // Trainer Profile Attributes
  const trainerName =
    trainerStaff?.name ||
    `${trainerStaff?.firstName || user?.firstName || ''} ${trainerStaff?.lastName || user?.lastName || ''}`.trim() ||
    'Head Coach Roman Ansari';

  const staffCode = trainerStaff?.code || '#TRN-9402';
  const roleTitle = trainerStaff?.role ? String(trainerStaff.role).replace('_', ' ') : 'FITNESS COACH & TRAINER';
  const department = trainerStaff?.department || 'FITNESS / PT OPERATIONS';
  const branchName = trainerStaff?.branchName || activeBranch?.name || 'Main Campus Gym';
  const shift = trainerStaff?.shift || 'MORNING (06:00 AM - 02:00 PM)';
  const hourlyRate = trainerStaff?.hourlyRate || 45;
  const commissionPercentage = trainerStaff?.commissionPercentage || 60;
  const phone = trainerStaff?.phone || user?.phone || '+1 (555) 382-9014';
  const email = trainerStaff?.email || user?.email || 'trainer@gymflow.io';
  const rating = trainerStaff?.rating || 4.9;
  const activeClientsCount = trainerStaff?.activeClientsCount || clients.length;

  const specializations: string[] = trainerStaff?.specializations?.length
    ? trainerStaff.specializations
    : ['Strength & Hypertrophy', 'Olympic Weightlifting', 'Functional Athleticism', 'Mobility Screening'];

  const certifications: string[] = trainerStaff?.certifications?.length
    ? trainerStaff.certifications
    : ['NASM Certified Personal Trainer', 'CSCS Certified Strength Coach', 'CrossFit Level 2', 'CPR/AED Red Cross'];

  const completedSessionsCount = sessions.filter((s) => s.status === 'COMPLETED').length;
  const calculatedCommission = Math.round(completedSessionsCount * hourlyRate * (commissionPercentage / 100));

  return (
    <PageContainer>
      <PageHeader
        title="Trainer & Head Coach Hub"
        subtitle="1-on-1 personal training schedules, athlete roster progression, and 60/40 commission splits."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/workout-assignment')}
            >
              <Dumbbell className="h-3.5 w-3.5" />
              <span>Assign Workout</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/fitness-assessment/create')}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Log Assessment</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/fitness/personal-training/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Book PT Session</span>
            </Button>
          </div>
        }
      />

      {/* Trainer Credentials & Identity Hero Card */}
      <Card className="mb-6 border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary/40 shadow-md">
                  <AvatarImage src={trainerStaff?.avatar || user?.avatar} alt={trainerName} />
                  <AvatarFallback className="text-xl font-bold bg-primary/20 text-primary">
                    {trainerName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card" title="On Duty / Active" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{trainerName}</h2>
                  <Badge variant="default" className="text-[10px] font-bold">
                    <ShieldCheck className="h-3 w-3 mr-1" /> {roleTitle}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-muted-foreground px-2 py-0.5 rounded bg-muted">
                    {staffCode}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" /> {branchName} • {department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Shift: <strong>{shift}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> <strong>${hourlyRate}/hr</strong> ({commissionPercentage}% Commission Tier)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {phone}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {rating} / 5.0 CSAT
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto self-stretch md:self-auto border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Certified Credentials</span>
              <div className="flex flex-wrap gap-1.5 max-w-sm">
                {certifications.map((c, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] font-semibold bg-background">
                    {c}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 max-w-sm pt-1">
                {specializations.map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-[9px] font-mono">
                    #{s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="RENDERED PT HOURS"
          value={`${completedSessionsCount} Hrs`}
          change="Billable Coaching"
          trend="up"
          timeframe="This Month"
          icon={<Dumbbell className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ACTIVE ATHLETES"
          value={`${activeClientsCount} Athletes`}
          change="Client Roster"
          trend="neutral"
          timeframe="Enrolled"
          icon={<Users className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="COMMISSION EARNED"
          value={`$${calculatedCommission.toFixed(2)}`}
          change={`${commissionPercentage}% Split Tier`}
          trend="up"
          timeframe="Current Cycle"
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="CLIENT CSAT SCORE"
          value={`${rating} / 5.0`}
          change="Performance Baseline"
          trend="up"
          timeframe="Excellence Rating"
          icon={<Star className="h-5 w-5 text-purple-500 fill-purple-500" />}
        />
      </div>

      {/* Two Column Layout: Today's Schedule & Athlete Progress Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's 1-on-1 PT Schedule (2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Today's 1-on-1 Personal Training Schedule
              </CardTitle>
              <CardDescription>Scheduled training sessions, periodization focus, and live completion checkoffs.</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
              {sessions.length} SESSIONS SCHEDULED
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {sessions.map((ses) => (
                <div key={ses.id} className="py-3.5 flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-border shadow-2xs">
                      <AvatarImage src={ses.clientAvatar} alt={ses.clientName} />
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {ses.clientName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{ses.clientName}</span>
                        <Badge
                          variant={
                            ses.status === 'COMPLETED'
                              ? 'success'
                              : ses.status === 'IN_PROGRESS'
                              ? 'default'
                              : 'outline'
                          }
                          className="text-[9px] font-bold"
                        >
                          {ses.status === 'IN_PROGRESS' ? '🔥 IN PROGRESS' : ses.status}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium text-foreground/90">{ses.focusArea}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <Clock className="h-3 w-3" />
                        <span>{ses.sessionTime}</span>
                        <span>•</span>
                        <span>{ses.programPhase}</span>
                      </div>
                      {ses.notes && (
                        <p className="text-[10px] text-emerald-600 font-mono font-semibold">
                          ↳ {ses.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant={ses.status === 'COMPLETED' ? 'outline' : 'default'}
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => toggleSessionStatus(ses.id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{ses.status === 'COMPLETED' ? 'Completed' : 'Mark Done'}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Athlete Roster Progress Leaderboard (1 Column) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-500" />
              Athlete Progress Roster
            </CardTitle>
            <CardDescription>Body recomposition and session packages bank.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {clients.map((cli) => (
              <div key={cli.id} className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border border-border shadow-2xs">
                      <AvatarImage src={cli.clientAvatar} alt={cli.clientName} />
                      <AvatarFallback className="text-[10px] font-bold">
                        {cli.clientName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-xs text-foreground">{cli.clientName}</span>
                  </div>
                  <Badge variant="success" className="text-[9px] font-mono font-bold">
                    {cli.bodyFatChangePercent}% BF
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Goal Adherence</span>
                    <span className="font-bold text-foreground">{cli.goalProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-emerald-500"
                      style={{ width: `${cli.goalProgressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>Sessions Remaining: <strong className="text-foreground font-mono">{cli.packageRemaining} / {cli.totalSessions}</strong></span>
                  <span>Last: {cli.lastWorkoutDate}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};