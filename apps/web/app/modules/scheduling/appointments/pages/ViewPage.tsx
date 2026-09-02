import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Calendar, Clock, DollarSign, MapPin, User, MessageSquare, Activity, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { IAppointment } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<IAppointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_appointments');
      if (stored) {
        const customList: IAppointment[] = JSON.parse(stored);
        const match = customList.find((a) => (a.id || a._id) === id);
        if (match) {
          setAppointment(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/appointments/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAppointment(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setAppointment({
      id: id || 'APT-101',
      _id: id || 'APT-101',
      appointmentNumber: id || 'APT-101',
      clientName: 'Marcus Vance Jr.',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      clientPhone: '+1 (555) 234-8891',
      trainerName: 'Coach Alex Rivera',
      trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      appointmentType: 'PERSONAL_TRAINING',
      appointmentDate: '2026-08-30',
      appointmentTime: '09:00 AM',
      durationMinutes: 60,
      sessionFee: 85,
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      zoneName: 'Free Weights Platform Bay',
      branchName: 'Downtown Flagship',
      clientGoals: 'Overhead squat barbell mobility, posterior chain hypertrophy.',
      coachNotes: 'Warmup sets with PVC pipe before heavy sets.',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleToggleStatus = () => {
    if (!appointment) return;
    const nextStatus: IAppointment['status'] =
      appointment.status === 'CONFIRMED'
        ? 'IN_PROGRESS'
        : appointment.status === 'IN_PROGRESS'
        ? 'COMPLETED'
        : 'CONFIRMED';

    const updated = { ...appointment, status: nextStatus };
    setAppointment(updated);

    const stored = localStorage.getItem('gymflow_custom_appointments');
    if (stored) {
      const customList: IAppointment[] = JSON.parse(stored);
      const listUpdated = customList.map((a) => ((a.id || a._id) === (appointment.id || appointment._id) ? updated : a));
      localStorage.setItem('gymflow_custom_appointments', JSON.stringify(listUpdated));
    }

    toast.success(`Appointment status updated to ${nextStatus}!`);
  };

  if (loading || !appointment) {
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
        title={`Appointment #${appointment.appointmentNumber}`}
        subtitle={`${appointment.appointmentType?.replace(/_/g, ' ')} • ${appointment.appointmentDate} at ${appointment.appointmentTime}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/scheduling/appointments')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Appointments</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/scheduling/appointments/${appointment.id || appointment._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-emerald-600 border-emerald-500/30 font-semibold"
              onClick={() => {
                const cleanPhone = appointment.clientPhone?.replace(/[^0-9]/g, '');
                const msg = encodeURIComponent(
                  `Hi ${appointment.clientName}, your appointment for ${appointment.appointmentType?.replace(/_/g, ' ')} with ${appointment.trainerName} is confirmed for ${appointment.appointmentDate} at ${appointment.appointmentTime} at GymFlow!`
                );
                window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
              }}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp Reminder</span>
            </Button>
            <Button
              size="sm"
              className={`gap-1.5 font-semibold shadow-xs ${
                appointment.status === 'CONFIRMED'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : appointment.status === 'IN_PROGRESS'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-primary'
              }`}
              onClick={handleToggleStatus}
            >
              <Activity className="h-4 w-4" />
              <span>
                {appointment.status === 'CONFIRMED'
                  ? 'Start Session'
                  : appointment.status === 'IN_PROGRESS'
                  ? 'Mark Completed'
                  : 'Re-open Appointment'}
              </span>
            </Button>
          </div>
        }
      />

      {/* Dual Client & Coach Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border border-border/80 shadow-2xs">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">CLIENT PARTICIPANT</span>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20 shrink-0">
              <AvatarImage src={appointment.clientAvatar} alt={appointment.clientName} />
              <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                {appointment.clientName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">{appointment.clientName}</h3>
              <p className="text-xs font-mono text-muted-foreground">{appointment.clientPhone}</p>
              <Badge variant="outline" className="text-[9px] font-bold">
                Registered VIP Member
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-2xs">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">ASSIGNED SPECIALIST</span>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20 shrink-0">
              <AvatarImage src={appointment.trainerAvatar} alt={appointment.trainerName} />
              <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                {appointment.trainerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">{appointment.trainerName}</h3>
              <p className="text-xs text-muted-foreground">{appointment.branchName || 'Downtown Flagship'}</p>
              <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/30">
                Certified Master Coach
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SESSION BILLING</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">${appointment.sessionFee}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 uppercase font-bold">{appointment.paymentStatus?.replace(/_/g, ' ')}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TIME WINDOW</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1 font-mono">{appointment.appointmentTime}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{appointment.appointmentDate} ({appointment.durationMinutes}m)</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CAMPUS ZONE</span>
            <MapPin className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xs font-bold text-foreground mt-1 truncate">{appointment.zoneName}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{appointment.branchName || 'Downtown Flagship'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LIFECYCLE STATE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">{appointment.status}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Booking Status</p>
        </Card>
      </div>

      {/* Goals & Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Client Target Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {appointment.clientGoals || 'No specific goals logged for this session.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Specialist Coaching Protocol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {appointment.coachNotes || 'No coach notes logged for this session.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
