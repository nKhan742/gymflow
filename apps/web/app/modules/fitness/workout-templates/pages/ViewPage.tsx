import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Layers,
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
  Activity,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWorkoutTemplate } from '../types';
import { DEFAULT_WORKOUT_TEMPLATES } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [template, setTemplate] = useState<IWorkoutTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplateData();
  }, [id]);

  const loadTemplateData = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_workout_templates');
      const customList: IWorkoutTemplate[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (t) => t.id === id || t.code === id || t._id === id || t.id?.toLowerCase() === id?.toLowerCase() || t.code?.toLowerCase() === id?.toLowerCase()
      );

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-templates/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTemplate(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setTemplate(customMatch);
        setLoading(false);
        return;
      }

      const fallback = DEFAULT_WORKOUT_TEMPLATES.find(
        (t) => t.id === id || t.code === id || t.id?.toLowerCase() === id?.toLowerCase() || t.code?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setTemplate(fallback);
      } else {
        setTemplate({
          id: id || 'TMP-CUSTOM',
          name: id?.replace('TMP-', '').replace(/-/g, ' ') || 'Custom Workout Routine',
          code: id || 'TMP-CUSTOM',
          splitType: 'FULL_BODY',
          targetGoal: 'HYPERTROPHY',
          difficulty: 'INTERMEDIATE',
          estimatedDurationMins: 60,
          exercises: [
            { exerciseId: 'EXE-01', exerciseName: 'Main Compound Lift', targetMuscle: 'Primary Muscle', sets: 4, reps: '8-10', restSeconds: 90, rpe: 8 },
          ],
          branchId: 'ALL',
          branchName: 'All Locations',
          status: 'active',
          description: 'Single-session custom routine template.',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_workout_templates');
      const customList: IWorkoutTemplate[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((t) => t.id === id || t.code === id);
      const fallback = customMatch || DEFAULT_WORKOUT_TEMPLATES.find((t) => t.id === id || t.code === id) || DEFAULT_WORKOUT_TEMPLATES[0];
      setTemplate(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !template) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Workout Template...</div>
        </div>
      </PageContainer>
    );
  }

  const totalSets = template.exercises?.reduce((acc, e) => acc + (e.sets || 0), 0) || 0;

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/workout-templates')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Templates</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {template.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({template.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">{template.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/workout-templates/${template.id || template._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Template</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Layers className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{template.name}</h2>
                  <Badge variant="default" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {template.splitType}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {template.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Goal: <strong className="text-foreground">{template.targetGoal}</strong></span>
                  <span>•</span>
                  <span>Volume: <strong className="text-primary font-mono">{totalSets} Work Sets</strong></span>
                </div>
              </div>
            </div>

            {/* Duration Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Session Length</div>
                <div className="text-xs font-bold text-foreground font-mono">{template.estimatedDurationMins} Minutes</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Ready for Member Assignment</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Total Exercises</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{template.exercises?.length || 0} Moves</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Total Working Sets</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{totalSets} Sets</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Target Objective</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{template.targetGoal}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Difficulty</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">{template.difficulty}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="routine" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="routine" className="text-xs font-semibold gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-primary" /> Workout Routine ({template.exercises?.length})
          </TabsTrigger>
          <TabsTrigger value="volume" className="text-xs font-semibold gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> Volume Breakdown
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ROUTINE */}
        <TabsContent value="routine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" /> Movement Sequence & Volume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {template.exercises?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-foreground">{item.exerciseName}</div>
                      <div className="text-[11px] text-muted-foreground">Target: {item.targetMuscle}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <Badge variant="outline" className="border-border/80">{item.sets} Sets</Badge>
                    <Badge variant="outline" className="border-border/80">{item.reps} Reps</Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" /> {item.restSeconds}s Rest
                    </Badge>
                    {item.rpe && <Badge variant="default">RPE {item.rpe}</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: VOLUME */}
        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Program Stimulus & Fatigue Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
                <div className="font-semibold text-foreground">Coaching Recommendations:</div>
                <p className="text-muted-foreground">
                  This routine delivers {totalSets} direct volume sets targeting {template.splitType}. 
                  Maintain 48 to 72 hours of recovery before repeating this movement pattern to optimize protein synthesis and muscle recovery.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
