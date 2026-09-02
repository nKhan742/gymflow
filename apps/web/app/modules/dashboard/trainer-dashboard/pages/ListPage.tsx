import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
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
  Flame,
  Activity,
  ArrowUpRight,
  TrendingDown,
  FileSpreadsheet,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IPtSessionItem, IClientRosterItem } from '../types';

export const DEFAULT_CLIENTS: any[] = [];


export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<IPtSessionItem[]>(() => {
    const saved = localStorage.getItem('gymflow_trainer_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [clients, setClients] = useState<IClientRosterItem[]>(() => {
    const saved = localStorage.getItem('gymflow_trainer_clients');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSessionStatus = (id: string) => {
    setSessions(
      sessions.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'COMPLETED' ? 'CONFIRMED' : 'COMPLETED';
          toast.success(`Session #${id} marked as ${nextStatus}!`);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

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

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="RENDERED PT HOURS"
          value={`${sessions.filter((s) => s.status === 'COMPLETED').length} Hrs`}
          change="Billable Coaching"
          trend="up"
          timeframe="This Month"
          icon={<Dumbbell className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ACTIVE ATHLETES"
          value={`${clients.length} Clients`}
          change="Client Roster"
          trend="neutral"
          timeframe="Enrolled"
          icon={<Users className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="COMMISSION EARNED"
          value="$0.00"
          change="60/40 Split Tier"
          trend="neutral"
          timeframe="Current Cycle"
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="CLIENT CSAT SCORE"
          value="5.0 / 5.0"
          change="Performance Baseline"
          trend="up"
          timeframe="Excellence Rating"
          icon={<Star className="h-5 w-5 text-purple-500" />}
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
              4 SESSIONS TODAY
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
            {DEFAULT_CLIENTS.map((cli) => (
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
                  <span>Sessions Remaining: <strong className="text-foreground font-mono">{cli.packageRemaining}</strong></span>
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
