import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  ArrowLeft,
  Edit2,
  ClipboardList,
  Flame,
  Zap,
  Clock,
  Building2,
  CheckCircle2,
  Users,
  Target,
  Droplets,
  Layers,
  Printer,
  Calendar,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IDietPlan } from '../types';
import { DEFAULT_DIET_PLANS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<IDietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'macros' | 'athletes'>('schedule');

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_diet_plans');
      if (stored) {
        const list: IDietPlan[] = JSON.parse(stored);
        const match = list.find((p) => p.id === id || p._id === id || p.code === id);
        if (match) {
          setPlan(match);
          setLoading(false);
          return;
        }
      }

      const defaultMatch = DEFAULT_DIET_PLANS.find((p) => p.id === id || p.code === id);
      if (defaultMatch) {
        setPlan(defaultMatch);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/diet-plans/${id}`, {
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

      const fallback: IDietPlan = {
        id: id || 'PLN-CUSTOM-01',
        code: id || 'PLN-CUSTOM-01',
        name: id ? id.replace('PLN-', '').replace(/-/g, ' ') : 'Custom Athletic Diet Plan',
        goal: 'LEAN_BULK',
        dailyTargetCalories: 3000,
        proteinGrams: 200,
        carbsGrams: 350,
        fatsGrams: 80,
        fiberGrams: 40,
        waterTargetLiters: 4.0,
        durationWeeks: 12,
        dailyMealsCount: 4,
        mealSchedule: [
          { mealOrder: 1, mealTime: '08:00', slotTitle: 'Breakfast', mealName: 'Overnight Oats with Whey Protein', calories: 600, proteinGrams: 45, carbsGrams: 75, fatsGrams: 12 },
          { mealOrder: 2, mealTime: '12:30', slotTitle: 'Lunch', mealName: 'Sous-Vide Chicken Breast with Rice', calories: 750, proteinGrams: 60, carbsGrams: 90, fatsGrams: 14 },
          { mealOrder: 3, mealTime: '17:00', slotTitle: 'Pre-Workout Fuel', mealName: 'Banana & Whey Isolate Smoothie', calories: 450, proteinGrams: 35, carbsGrams: 55, fatsGrams: 8 },
          { mealOrder: 4, mealTime: '20:30', slotTitle: 'Dinner', mealName: 'Wild Salmon with Sweet Potato & Veggies', calories: 800, proteinGrams: 55, carbsGrams: 80, fatsGrams: 25 },
        ],
        leadNutritionistName: 'Dr. Marcus Vance, PhD, RD',
        enrolledAthletesCount: 15,
        adherenceRatePercent: 95.0,
        branchId: 'ALL',
        branchName: 'All Locations',
        status: 'active',
        description: 'Comprehensive athletic diet plan engineered for muscle protein synthesis and fast recovery.',
      };
      setPlan(fallback);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading || !plan) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-muted-foreground text-sm">
          Loading 360° Diet Plan Hub...
        </div>
      </PageContainer>
    );
  }

  const totalGrams = (plan.proteinGrams || 0) + (plan.carbsGrams || 0) + (plan.fatsGrams || 0) || 1;
  const pPercent = Math.round(((plan.proteinGrams || 0) / totalGrams) * 100);
  const cPercent = Math.round(((plan.carbsGrams || 0) / totalGrams) * 100);
  const fPercent = Math.round(((plan.fatsGrams || 0) / totalGrams) * 100);

  const getGoalBadge = (goal: string) => {
    switch (goal) {
      case 'LEAN_BULK':
        return <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 text-xs font-bold">💪 Lean Bulk Hypertrophy</Badge>;
      case 'FAT_LOSS_CUT':
        return <Badge variant="secondary" className="text-amber-600 dark:text-amber-400 text-xs font-bold">🔥 Thermogenic Shred</Badge>;
      case 'BODY_RECOMP':
        return <Badge variant="success" className="text-xs font-bold">⚡ Metabolic Recomp</Badge>;
      case 'ENDURANCE_FUEL':
        return <Badge variant="outline" className="text-blue-500 border-blue-500/30 text-xs font-bold">🏃 Endurance & HYROX</Badge>;
      case 'KETO_SHRED':
        return <Badge variant="outline" className="text-purple-500 border-purple-500/30 text-xs font-bold">🥑 Ketogenic Fat Adaptation</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-bold">{goal ? String(goal).replace(/_/g, ' ') : 'Standard'}</Badge>;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={plan.name}
        subtitle={`${plan.durationWeeks} Weeks • ${plan.dailyTargetCalories} kcal / day • Lead: ${plan.leadNutritionistName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/nutrition/diet-plans')}
              className="gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Plans</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Client Menu</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/nutrition/diet-plans/${plan.id || plan._id}/edit`)}
              className="gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Plan</span>
            </Button>
          </div>
        }
      />

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                  {plan.code || plan.id}
                </span>
                {getGoalBadge(plan.goal)}
                <Badge variant="outline" className="gap-1 text-xs font-medium">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  {plan.branchName || 'All Locations'}
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">{plan.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {plan.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 lg:pt-0 lg:border-l lg:border-border/80 lg:pl-6 shrink-0">
              <div>
                <span className="text-[11px] text-muted-foreground block">Duration</span>
                <span className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> {plan.durationWeeks} Weeks
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Enrolled Athletes</span>
                <span className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary" /> {plan.enrolledAthletesCount} Active
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Adherence Rate</span>
                <span className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {plan.adherenceRatePercent}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Macro Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/80 shadow-sm bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">DAILY CALORIES</span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {plan.dailyTargetCalories} <span className="text-xs font-normal text-muted-foreground">kcal</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Across {plan.dailyMealsCount || plan.mealSchedule?.length} Scheduled Meals</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">PROTEIN TARGET</span>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-primary">
              {plan.proteinGrams}g <span className="text-xs font-normal text-muted-foreground">({pPercent}%)</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">~2.2g / kg Body Mass</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">CARBS BUDGET</span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {plan.carbsGrams}g <span className="text-xs font-normal text-muted-foreground">({cPercent}%)</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Fiber: {plan.fiberGrams || 35}g</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-cyan-500/5 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">DAILY HYDRATION</span>
              <Droplets className="h-4 w-4 text-cyan-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              {plan.waterTargetLiters} <span className="text-xs font-normal text-muted-foreground">Liters</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Electrolyte Fortified</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-6 overflow-x-auto">
        <Button
          variant={activeTab === 'schedule' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('schedule')}
          className="gap-2 text-xs"
        >
          <Utensils className="h-3.5 w-3.5" />
          <span>Daily Meal Timetable ({plan.mealSchedule?.length || 0} Meals)</span>
        </Button>
        <Button
          variant={activeTab === 'macros' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('macros')}
          className="gap-2 text-xs"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Macro Split Ratios</span>
        </Button>
        <Button
          variant={activeTab === 'athletes' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('athletes')}
          className="gap-2 text-xs"
        >
          <Users className="h-3.5 w-3.5" />
          <span>Enrolled Athletes ({plan.enrolledAthletesCount || 0})</span>
        </Button>
      </div>

      {/* Tab 1: Daily Meal Schedule */}
      {activeTab === 'schedule' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Structured Daily Meal Timetable
            </CardTitle>
            <CardDescription className="text-xs">
              Chronological nutrient timing designed to fuel workouts and optimize nocturnal growth hormone release.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.mealSchedule?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-muted/30 border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="text-[10px] font-bold">MEAL</span>
                      <span className="text-sm font-black">{item.mealOrder || idx + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          <Clock className="w-3 h-3 mr-1" /> {item.mealTime}
                        </Badge>
                        <span className="text-xs font-bold text-primary">{item.slotTitle}</span>
                      </div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">{item.mealName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-right pl-14 md:pl-0">
                    <div className="bg-background px-3 py-1.5 rounded-md border border-border/80">
                      <div className="font-bold text-amber-600 dark:text-amber-400">{item.calories} kcal</div>
                      <div className="text-[10px] text-muted-foreground">P:{item.proteinGrams}g | C:{item.carbsGrams}g | F:{item.fatsGrams}g</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Macro Split Ratios */}
      {activeTab === 'macros' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Macro Split Ratio Percentages
              </CardTitle>
              <CardDescription className="text-xs">
                Relative energy contribution from macronutrient sources.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-primary">Protein ({pPercent}%)</span>
                  <span>{plan.proteinGrams}g / day</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${pPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-500">Carbohydrates ({cPercent}%)</span>
                  <span>{plan.carbsGrams}g / day</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${cPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-500">Essential Fats ({fPercent}%)</span>
                  <span>{plan.fatsGrams}g / day</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${fPercent}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                Nutritional Periodization Guidelines
              </CardTitle>
              <CardDescription className="text-xs">
                Clinical recommendations for athlete adherence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="p-3 rounded-md bg-muted/40 border border-border/60">
                <strong className="text-foreground block mb-1">Training Days:</strong>
                Consume Meal 2 (Pre-Workout) 90 minutes prior to training. Take Post-Workout recovery meal within 45 minutes of session completion.
              </div>
              <div className="p-3 rounded-md bg-muted/40 border border-border/60">
                <strong className="text-foreground block mb-1">Rest & Recovery Days:</strong>
                Maintain protein intake at {plan.proteinGrams}g to support muscle repair. Reduce carbohydrate portion by 15% and increase water intake.
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Enrolled Athletes */}
      {activeTab === 'athletes' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Active Enrolled Athletes ({plan.enrolledAthletesCount})
            </CardTitle>
            <CardDescription className="text-xs">
              Club members currently prescribed this nutritional protocol.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/60">
              {[
                { name: 'Alex Mercer', goal: 'Lean Bulking', adherence: 96, checkIn: 'Today, 08:30 AM' },
                { name: 'Marcus Sterling', goal: 'Power Hypertrophy', adherence: 94, checkIn: 'Yesterday' },
                { name: 'Sophia Chen', goal: 'Recomp', adherence: 98, checkIn: 'Today, 11:15 AM' },
              ].map((ath, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-foreground">{ath.name}</div>
                    <div className="text-[11px] text-muted-foreground">Goal: {ath.goal} • Last Log: {ath.checkIn}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" className="font-mono text-[10px] font-bold">
                      {ath.adherence}% Adherence
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
};

