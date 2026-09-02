import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Dumbbell,
  Edit2,
  Building2,
  ArrowLeft,
  RefreshCw,
  Target,
  Layers,
  Activity,
  Flame,
  Zap,
  CheckCircle2,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IExercise } from '../types';
import { DEFAULT_EXERCISES } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState<IExercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExerciseData();
  }, [id]);

  const loadExerciseData = async () => {
    setLoading(true);
    try {
      // 1. Check local storage
      const stored = localStorage.getItem('gymflow_custom_exercises');
      const customList: IExercise[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (e) => e.id === id || e.code === id || e._id === id || e.id?.toLowerCase() === id?.toLowerCase() || e.code?.toLowerCase() === id?.toLowerCase()
      );

      // 2. Fetch API
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-library/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setExercise(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setExercise(customMatch);
        setLoading(false);
        return;
      }

      // 3. Fallback default
      const fallback = DEFAULT_EXERCISES.find(
        (e) => e.id === id || e.code === id || e.id?.toLowerCase() === id?.toLowerCase() || e.code?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setExercise(fallback);
      } else {
        setExercise({
          id: id || 'EXE-CUSTOM',
          name: id?.replace('EXE-', '').replace(/-/g, ' ') || 'Custom Exercise Movement',
          code: id || 'EXE-CUSTOM',
          category: 'Strength & Hypertrophy',
          primaryMuscle: 'Pectoralis / Core',
          secondaryMuscles: ['Deltoids', 'Triceps'],
          mechanics: 'COMPOUND',
          difficulty: 'INTERMEDIATE',
          equipment: 'BARBELL',
          forceType: 'PUSH',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
          instructions: ['Setup with aligned joint stacks and maintain solid core intra-abdominal pressure.'],
          coachingCues: ['Full range of motion', 'Control eccentric phase'],
          caloriesBurnPerHour: 450,
          branchId: 'ALL',
          branchName: 'All Locations',
          status: 'active',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_exercises');
      const customList: IExercise[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((e) => e.id === id || e.code === id);
      const fallback = customMatch || DEFAULT_EXERCISES.find((e) => e.id === id || e.code === id) || DEFAULT_EXERCISES[0];
      setExercise(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !exercise) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Exercise Telemetry...</div>
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
            onClick={() => navigate('/fitness/exercise-library')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Exercise Library</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {exercise.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({exercise.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">{exercise.category} • {exercise.equipment}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/exercise-library/${exercise.id || exercise._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Exercise</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs overflow-hidden">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <img
                src={exercise.thumbnailUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80'}
                alt={exercise.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-border/80 shrink-0 shadow-sm"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{exercise.name}</h2>
                  <Badge variant={exercise.mechanics === 'COMPOUND' ? 'default' : 'outline'} className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {exercise.mechanics}
                  </Badge>
                  <Badge variant="success" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {exercise.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Target: <strong className="text-foreground">{exercise.primaryMuscle}</strong></span>
                  <span>•</span>
                  <span>Equipment: <strong className="text-foreground font-mono">{exercise.equipment}</strong></span>
                </div>
              </div>
            </div>

            {/* Calories / Caloric Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Energy Output</div>
                <div className="text-xs font-bold text-foreground font-mono">{exercise.caloriesBurnPerHour || 450} kcal/hr</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">1RM Benchmark Eligible</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Primary Muscle</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{exercise.primaryMuscle}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Mechanics Type</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{exercise.mechanics}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Gear Required</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{exercise.equipment}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Difficulty Level</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">{exercise.difficulty}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="instructions" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="instructions" className="text-xs font-semibold gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" /> Execution Guide & Cues
          </TabsTrigger>
          <TabsTrigger value="anatomy" className="text-xs font-semibold gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-500" /> Secondary Synergists
          </TabsTrigger>
          <TabsTrigger value="records" className="text-xs font-semibold gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Club 1RM Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INSTRUCTIONS */}
        <TabsContent value="instructions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Step-by-Step Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exercise.instructions?.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-foreground pt-0.5">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Key Coaching Cues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {exercise.coachingCues?.map((cue, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-foreground">{cue}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: ANATOMY */}
        <TabsContent value="anatomy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" /> Engaged Muscle Anatomy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-xs font-bold text-primary uppercase">Primary Agonist</div>
                  <div className="text-sm font-bold text-foreground mt-0.5">{exercise.primaryMuscle}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Secondary Synergists & Stabilizers</div>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles?.map((muscle, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs py-1 px-3 border-border/80">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: RECORDS */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Club Member Personal Records (PRs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">Marcus Aurelius Vance</div>
                      <div className="text-[10px] text-muted-foreground">PD Vihar Campus</div>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-primary">315 lbs (142.8 kg)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-500/10 text-slate-400 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">Elena Rostova</div>
                      <div className="text-[10px] text-muted-foreground">Westside Performance Club</div>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-foreground">275 lbs (124.7 kg)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
