import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Calendar, Clock, MapPin, Users, CheckCircle2, User, Building2, Tag, Activity, Sparkles } from 'lucide-react';
import { ICalendarEvent } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<ICalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_calendar');
      if (stored) {
        const customList: ICalendarEvent[] = JSON.parse(stored);
        const match = customList.find((e) => (e.id || e._id) === id);
        if (match) {
          setEvent(match);
          setLoading(false);
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
          setEvent(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setEvent({
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
      branchName: 'Main Facility',
      description: 'High-intensity interval training focusing on functional power, kettlebells, and sprint drills.',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleToggleStatus = () => {
    if (!event) return;
    const nextStatus: ICalendarEvent['status'] =
      event.status === 'SCHEDULED'
        ? 'IN_PROGRESS'
        : event.status === 'IN_PROGRESS'
        ? 'COMPLETED'
        : 'SCHEDULED';

    const updated = { ...event, status: nextStatus };
    setEvent(updated);

    const stored = localStorage.getItem('gymflow_custom_calendar');
    if (stored) {
      const customList: ICalendarEvent[] = JSON.parse(stored);
      const listUpdated = customList.map((e) => ((e.id || e._id) === (event.id || event._id) ? updated : e));
      localStorage.setItem('gymflow_custom_calendar', JSON.stringify(listUpdated));
    }

    toast.success(`Session status updated to ${nextStatus}!`);
  };

  if (loading || !event) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  const occupancyPercent = event.capacity > 0 ? Math.round((event.bookedCount / event.capacity) * 100) : 0;

  return (
    <PageContainer>
      <PageHeader
        title={event.eventTitle}
        subtitle={`${event.eventType?.replace(/_/g, ' ')} • ${event.date} (${event.startTime} - ${event.endTime})`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/scheduling/calendar')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Calendar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/scheduling/calendar/${event.id || event._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Session</span>
            </Button>
            <Button
              size="sm"
              className={`gap-1.5 font-semibold shadow-xs ${
                event.status === 'SCHEDULED'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : event.status === 'IN_PROGRESS'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-primary'
              }`}
              onClick={handleToggleStatus}
            >
              <Activity className="h-4 w-4" />
              <span>
                {event.status === 'SCHEDULED'
                  ? 'Start Session Now'
                  : event.status === 'IN_PROGRESS'
                  ? 'Mark Session Completed'
                  : 'Re-open Session'}
              </span>
            </Button>
          </div>
        }
      />

      {/* Instructor & Location Hero Banner */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shrink-0">
                <AvatarImage src={event.instructorAvatar} alt={event.instructorName} />
                <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                  {event.instructorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {event.eventType?.replace(/_/g, ' ')}
                  </Badge>
                  <Badge
                    variant={
                      event.status === 'COMPLETED'
                        ? 'success'
                        : event.status === 'IN_PROGRESS'
                        ? 'warning'
                        : 'default'
                    }
                    className="text-[10px] font-semibold uppercase"
                  >
                    {event.status?.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">• {event.branchName || 'Main Facility'}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{event.eventTitle}</h2>
                <p className="text-xs text-muted-foreground">
                  Led by <strong className="text-foreground">{event.instructorName}</strong> in{' '}
                  <strong className="text-primary">{event.zoneName}</strong>
                </p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xs text-muted-foreground">Time Slot:</span>
              <p className="text-base font-bold text-foreground font-mono">
                {event.startTime} - {event.endTime}
              </p>
              <span className="text-[11px] text-muted-foreground block">{event.durationMinutes} Minutes Duration</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SPOT OCCUPANCY</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">
            {event.bookedCount} / {event.capacity} <span className="text-xs font-normal text-muted-foreground">({occupancyPercent}%)</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Attendee Registration</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SESSION DURATION</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">{event.durationMinutes} Minutes</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Scheduled Block</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TRAINING ZONE</span>
            <MapPin className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xs font-bold text-foreground mt-1 truncate">{event.zoneName}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{event.branchName || 'Main Facility'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LIFECYCLE STATE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">{event.status}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Campus Room Status</p>
        </Card>
      </div>

      {/* Description & Coaching Protocol */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Session Overview & Coaching Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {event.description || 'No special coaching directives registered for this session.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
