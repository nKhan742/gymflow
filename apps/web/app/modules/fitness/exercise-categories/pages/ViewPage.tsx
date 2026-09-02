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
  Zap,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IExerciseCategory } from '../types';
import { DEFAULT_EXERCISE_CATEGORIES } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<IExerciseCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [id]);

  const loadCategoryData = async () => {
    setLoading(true);
    try {
      // 1. Try to find in localStorage first (for immediately created user items)
      const stored = localStorage.getItem('gymflow_custom_exercise_categories');
      const customList: IExerciseCategory[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (c) => c.id === id || c.code === id || c._id === id || c.id?.toLowerCase() === id?.toLowerCase() || c.code?.toLowerCase() === id?.toLowerCase()
      );

      // 2. Try fetching from server API
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-categories/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCategory(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setCategory(customMatch);
        setLoading(false);
        return;
      }

      // 3. Try to find in default list
      const fallback = DEFAULT_EXERCISE_CATEGORIES.find(
        (c) => c.id === id || c.code === id || c.id?.toLowerCase() === id?.toLowerCase() || c.code?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setCategory(fallback);
      } else {
        // If it's a new ID that wasn't saved, display it cleanly
        setCategory({
          id: id || 'CAT-CUSTOM',
          name: id?.replace('CAT-', '').replace(/-/g, ' ') || 'Custom Movement Category',
          code: id || 'CAT-CUSTOM',
          primaryMuscleGroup: 'FULL_BODY',
          movementPattern: 'PUSH',
          exerciseCount: 0,
          color: '#3B82F6',
          branchId: 'ALL',
          branchName: 'All Locations',
          status: 'active',
          description: 'Custom exercise classification and movement pattern taxonomy.',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_exercise_categories');
      const customList: IExerciseCategory[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((c) => c.id === id || c.code === id);

      const fallback = customMatch || DEFAULT_EXERCISE_CATEGORIES.find((c) => c.id === id || c.code === id) || DEFAULT_EXERCISE_CATEGORIES[0];
      setCategory(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !category) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Category Anatomy...</div>
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
            onClick={() => navigate('/fitness/exercise-categories')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Categories</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {category.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({category.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/exercise-categories/${category.id || category._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Category</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{category.name}</h2>
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-[11px] font-semibold shrink-0"
                    style={{ borderColor: category.color, color: category.color }}
                  >
                    {category.primaryMuscleGroup}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {category.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Movement Pattern: <strong className="text-foreground">{category.movementPattern}</strong></span>
                  <span>•</span>
                  <span>Exercise Movements: <strong className="text-primary font-mono">{category.exerciseCount || 0} Movements</strong></span>
                </div>
              </div>
            </div>

            {/* Pattern Badge Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Biomechanical Axis</div>
                <div className="text-xs font-bold text-foreground font-mono">{category.movementPattern} Pattern</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Full Biomechanical Indexing</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Movement Count</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{category.exerciseCount || 0} Exercises</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Target Muscle</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{category.primaryMuscleGroup}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Pattern Type</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">{category.movementPattern}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Category Status</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate capitalize">{category.status}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="exercises" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="exercises" className="text-xs font-semibold gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> Primary Catalog Movements
          </TabsTrigger>
          <TabsTrigger value="guidelines" className="text-xs font-semibold gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Biomechanical Cues & Safety
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: MOVEMENTS */}
        <TabsContent value="exercises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" /> Registered Movement Variations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground">Standard Compound / Isolation Movement</div>
                  <div className="text-[11px] text-muted-foreground">Primary Muscle: {category.primaryMuscleGroup} • Pattern: {category.movementPattern}</div>
                </div>
                <Badge variant="default" className="text-xs">Indexed</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: GUIDELINES */}
        <TabsContent value="guidelines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" /> Coaching Directives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
                <div className="font-bold text-foreground">Anatomical & Coaching Summary:</div>
                <p className="text-muted-foreground">
                  {category.description || 'Focus on controlled eccentric phase, full scapular stability, and progressive overload tracking.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
