import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  UserCheck,
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
  Activity,
  Calendar,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWorkoutAssignment } from '../types';
import { DEFAULT_WORKOUT_ASSIGNMENTS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<IWorkoutAssignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignmentData();
  }, [id]);

  const loadAssignmentData = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_workout_assignments');
      const customList: IWorkoutAssignment[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (a) => a.id === id || a.assignmentCode === id || a._id === id || a.id?.toLowerCase() === id?.toLowerCase() || a.assignmentCode?.toLowerCase() === id?.toLowerCase()
      );

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-assignment/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAssignment(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setAssignment(customMatch);
        setLoading(false);
        return;
      }

      const fallback = DEFAULT_WORKOUT_ASSIGNMENTS.find(
        (a) => a.id === id || a.assignmentCode === id || a.id?.toLowerCase() === id?.toLowerCase() || a.assignmentCode?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setAssignment(fallback);
      } else {
        setAssignment({
          id: id || 'ASG-CUSTOM',
          assignmentCode: id || 'ASG-CUSTOM',
          memberId: 'MEM-001',
          memberName: 'Active Member',
          coachId: 'STF-001',
          coachName: 'Assigned Trainer',
          programType: 'WORKOUT_PLAN',
          programId: 'PLN-01',
          programTitle: 'Personalized Workout Routine',
          startDate: '2026-08-01',
          targetEndDate: '2026-10-01',
          completedWorkouts: 12,
          totalWorkouts: 36,
          complianceRate: 95,
          status: 'IN_PROGRESS',
          branchId: 'ALL',
          branchName: 'All Locations',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_workout_assignments');
      const customList: IWorkoutAssignment[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((a) => a.id === id || a.assignmentCode === id);
      const fallback = customMatch || DEFAULT_WORKOUT_ASSIGNMENTS.find((a) => a.id === id || a.assignmentCode === id) || DEFAULT_WORKOUT_ASSIGNMENTS[0];
      setAssignment(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !assignment) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Trainee Assignment...</div>
        </div>
      </PageContainer>
    );
  }

  const completionPercent = Math.round(((assignment.completedWorkouts || 0) / (assignment.totalWorkouts || 1)) * 100);

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/workout-assignment')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Assignments</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {assignment.memberName} • {assignment.programTitle}
              <span className="text-xs font-mono text-muted-foreground font-normal">({assignment.assignmentCode})</span>
            </h1>
            <p className="text-xs text-muted-foreground">Coach: {assignment.coachName} • Start: {assignment.startDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/workout-assignment/${assignment.id || assignment._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Assignment</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <img
                src={assignment.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={assignment.memberName}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-border/80 shrink-0 shadow-sm"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{assignment.memberName}</h2>
                  <Badge variant="default" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {assignment.status}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {assignment.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Program: <strong className="text-foreground">{assignment.programTitle}</strong></span>
                  <span>•</span>
                  <span>Supervising Coach: <strong className="text-primary font-mono">{assignment.coachName}</strong></span>
                </div>
              </div>
            </div>

            {/* Compliance Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Adherence Score</div>
                <div className="text-xs font-bold text-foreground font-mono">{assignment.complianceRate}% Compliance</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Last Workout: {assignment.lastCompletedWorkoutDate || 'Recent'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Completed Sessions</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{assignment.completedWorkouts} / {assignment.totalWorkouts}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Overall Progress</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{completionPercent}% Finished</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Target Finish</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{assignment.targetEndDate}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Assignment State</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">{assignment.status}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="log" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="log" className="text-xs font-semibold gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Completed Sessions Log
          </TabsTrigger>
          <TabsTrigger value="directives" className="text-xs font-semibold gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-500" /> Coach Directives & Notes
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: LOG */}
        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Recent Completed Workouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground">Session #42: Push Hypertrophy Volume</div>
                  <div className="text-[11px] text-muted-foreground">Aug 28, 2026 • 68 Mins • 18 Total Sets</div>
                </div>
                <Badge variant="success" className="text-xs">Logged by Turnstile</Badge>
              </div>
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground">Session #41: Pull Scapular Overload</div>
                  <div className="text-[11px] text-muted-foreground">Aug 26, 2026 • 72 Mins • 20 Total Sets</div>
                </div>
                <Badge variant="success" className="text-xs">Logged by Coach Marcus</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: DIRECTIVES */}
        <TabsContent value="directives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" /> Supervising Coach Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2 text-xs">
                <div className="font-bold text-foreground">Active Focus Points:</div>
                <p className="text-muted-foreground">
                  {assignment.notes || 'Trainee is demonstrating excellent adherence. Increase bench press working weight by 5 lbs on next week cycle.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
