import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Calendar,
  Edit2,
  Building2,
  ArrowLeft,
  RefreshCw,
  Clock,
  Dumbbell,
  Target,
  Flame,
  Zap,
  CheckCircle2,
  Users,
  Layers,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWorkoutPlan } from '../types';
import { DEFAULT_WORKOUT_PLANS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<IWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanData();
  }, [id]);

  const loadPlanData = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_workout_plans');
      const customList: IWorkoutPlan[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (p) => p.id === id || p.code === id || p._id === id || p.id?.toLowerCase() === id?.toLowerCase() || p.code?.toLowerCase() === id?.toLowerCase()
      );

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-plans/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setPlan(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setPlan(customMatch);
        setLoading(false);
        return;
      }

      const fallback = DEFAULT_WORKOUT_PLANS.find(
        (p) => p.id === id || p.code === id || p.id?.toLowerCase() === id?.toLowerCase() || p.code?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setPlan(fallback);
      } else {
        setPlan({
          id: id || 'PLN-CUSTOM',
          name: id?.replace('PLN-', '').replace(/-/g, ' ') || 'Custom Workout Plan',
          code: id || 'PLN-CUSTOM',
          category: 'BODYBUILDING',
          durationWeeks: 12,
          frequencyDaysPerWeek: 5,
          difficulty: 'INTERMEDIATE',
          enrolledAthletesCount: 0,
          targetGoal: 'Structured Hypertrophy Periodization',
          authorCoachName: 'Head Coach',
          phases: [
            { weekNumber: 1, phaseName: 'Phase 1: Volume Accumulation', focus: 'Baseline Conditioning', daysPerWeek: 5 },
            { weekNumber: 5, phaseName: 'Phase 2: Overload & Intensity', focus: 'Progressive Overload', daysPerWeek: 5 },
          ],
          branchId: 'ALL',
          branchName: 'All Locations',
          status: 'active',
          description: 'Multi-week periodization training curriculum.',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_workout_plans');
      const customList: IWorkoutPlan[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((p) => p.id === id || p.code === id);
      const fallback = customMatch || DEFAULT_WORKOUT_PLANS.find((p) => p.id === id || p.code === id) || DEFAULT_WORKOUT_PLANS[0];
      setPlan(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !plan) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Workout Plan...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/workout-plans')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Plans</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {plan.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({plan.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">Curated by Coach {plan.authorCoachName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/workout-plans/${plan.id || plan._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Plan</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{plan.name}</h2>
                  <Badge variant="default" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {plan.category}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {plan.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Goal: <strong className="text-foreground">{plan.targetGoal}</strong></span>
                  <span>•</span>
                  <span>Enrolled: <strong className="text-primary font-mono">{plan.enrolledAthletesCount} Athletes</strong></span>
                </div>
              </div>
            </div>

            {/* Duration Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Program Scope</div>
                <div className="text-xs font-bold text-foreground font-mono">{plan.durationWeeks} Weeks • {plan.frequencyDaysPerWeek}d/wk</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">91.4% Adherence Rate</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Total Duration</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{plan.durationWeeks} Weeks</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Weekly Frequency</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{plan.frequencyDaysPerWeek} Days / Wk</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Active Athletes</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">{plan.enrolledAthletesCount} Enrolled</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Difficulty Level</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{plan.difficulty}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="phases" className="text-xs font-semibold gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> Periodization Phases ({plan.phases?.length})
          </TabsTrigger>
          <TabsTrigger value="athletes" className="text-xs font-semibold gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-500" /> Enrolled Athletes ({plan.enrolledAthletesCount})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PHASES */}
        <TabsContent value="phases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Multi-Week Periodization Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.phases?.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 font-mono flex items-center justify-center font-bold text-xs shrink-0">
                      W{phase.weekNumber}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-foreground">{phase.phaseName}</div>
                      <div className="text-[11px] text-muted-foreground">Focus: {phase.focus}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs border-border/80">
                    {phase.daysPerWeek} Training Days / Week
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: ATHLETES */}
        <TabsContent value="athletes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" /> Active Member Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Athlete"
                    className="w-9 h-9 rounded-full object-cover border border-border/80"
                  />
                  <div>
                    <div className="text-xs font-bold text-foreground">Sophia Sterling</div>
                    <div className="text-[10px] text-muted-foreground">Week 7 of 12 • 94% Compliance</div>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">On Track</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
