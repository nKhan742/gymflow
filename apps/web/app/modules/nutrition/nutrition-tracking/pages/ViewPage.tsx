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
  Activity,
  Flame,
  Zap,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Droplets,
  Layers,
  Printer,
  Calendar,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { INutritionLog } from '../types';
import { DEFAULT_NUTRITION_LOGS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<INutritionLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'meals' | 'comparison' | 'feedback'>('meals');

  useEffect(() => {
    fetchLogDetails();
  }, [id]);

  const fetchLogDetails = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_nutrition_logs');
      if (stored) {
        const list: INutritionLog[] = JSON.parse(stored);
        const match = list.find((l) => l.id === id || l._id === id || l.code === id);
        if (match) {
          setLog(match);
          setLoading(false);
          return;
        }
      }

      const defaultMatch = DEFAULT_NUTRITION_LOGS.find((l) => l.id === id || l.code === id);
      if (defaultMatch) {
        setLog(defaultMatch);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/nutrition-tracking/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setLog(json.data);
          setLoading(false);
          return;
        }
      }

      const fallback: INutritionLog = {
        id: id || 'LOG-CUSTOM-01',
        code: id || 'LOG-CUSTOM-01',
        memberName: 'Alex Mercer',
        memberId: 'MEM-8801',
        memberEmail: 'alex.mercer@gymflow.io',
        memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        logDate: 'Today, 2026-08-29',
        targetCalories: 3000,
        consumedCalories: 2950,
        targetProteinGrams: 200,
        consumedProteinGrams: 205,
        targetCarbsGrams: 350,
        consumedCarbsGrams: 340,
        targetFatsGrams: 80,
        consumedFatsGrams: 78,
        adherenceStatus: 'OPTIMAL_ON_TRACK',
        adherenceScorePercent: 98.0,
        waterIntakeLiters: 4.0,
        loggedMeals: [
          { mealSlot: 'Breakfast', foodName: 'Overnight Oats with Vanilla Whey & Berries', timeLogged: '08:00 AM', calories: 650, proteinGrams: 45, carbsGrams: 85, fatsGrams: 14 },
          { mealSlot: 'Lunch', foodName: 'Sous-Vide Chicken Breast with Jasmine Rice & Avocado', timeLogged: '01:30 PM', calories: 850, proteinGrams: 65, carbsGrams: 110, fatsGrams: 15 },
          { mealSlot: 'Dinner', foodName: 'Grilled Grass-Fed Sirloin with Sweet Potato Mash', timeLogged: '07:45 PM', calories: 950, proteinGrams: 65, carbsGrams: 95, fatsGrams: 32 },
        ],
        coachFeedback: 'Exceptional bio-adherence. Caloric intake matched energy expenditure perfectly.',
        reviewedByCoachName: 'Dr. Marcus Vance, PhD, RD',
        branchId: 'ALL',
        branchName: 'PD Vihar',
        status: 'active',
      };
      setLog(fallback);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading || !log) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-muted-foreground text-sm">
          Loading 360° Food Journal...
        </div>
      </PageContainer>
    );
  }

  const calPercent = Math.min(100, Math.round(((log.consumedCalories || 0) / (log.targetCalories || 1)) * 100));
  const proPercent = Math.min(100, Math.round(((log.consumedProteinGrams || 0) / (log.targetProteinGrams || 1)) * 100));
  const carbPercent = Math.min(100, Math.round(((log.consumedCarbsGrams || 0) / (log.targetCarbsGrams || 1)) * 100));
  const fatPercent = Math.min(100, Math.round(((log.consumedFatsGrams || 0) / (log.targetFatsGrams || 1)) * 100));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL_ON_TRACK':
        return <Badge variant="success" className="gap-1 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Target Hit (Optimal)</Badge>;
      case 'PROTEIN_DEFICIT':
        return <Badge variant="destructive" className="gap-1 text-xs font-bold"><AlertCircle className="w-3.5 h-3.5" /> Protein Deficit</Badge>;
      case 'CALORIE_SURPLUS':
        return <Badge variant="secondary" className="gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold"><TrendingUp className="w-3.5 h-3.5" /> Calorie Surplus</Badge>;
      case 'CALORIE_DEFICIT':
        return <Badge variant="outline" className="gap-1 text-blue-500 border-blue-500/30 text-xs font-bold"><Flame className="w-3.5 h-3.5" /> Calorie Deficit</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-bold">{status ? String(status).replace(/_/g, ' ') : 'Logged'}</Badge>;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Food Journal: ${log.memberName}`}
        subtitle={`${log.logDate} • Adherence: ${log.adherenceScorePercent}% • Coach: ${log.reviewedByCoachName || 'Unassigned'}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/nutrition/nutrition-tracking')}
              className="gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Logs</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Audit Sheet</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/nutrition/nutrition-tracking/${log.id || log._id}/edit`)}
              className="gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Diary</span>
            </Button>
          </div>
        }
      />

      {/* Hero Presentation Card */}
      <Card className="mb-6 border-border/80 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={log.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={log.memberName}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                    {log.memberId}
                  </span>
                  {getStatusBadge(log.adherenceStatus)}
                </div>
                <h2 className="text-xl font-bold text-foreground">{log.memberName}</h2>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> {log.logDate}
                  <span>•</span>
                  <Building2 className="w-3.5 h-3.5" /> {log.branchName || 'PD Vihar'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 md:pt-0 md:border-l md:border-border/80 md:pl-6">
              <div>
                <span className="text-[11px] text-muted-foreground block">Adherence Score</span>
                <span className="font-bold text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400 font-mono">
                  {log.adherenceScorePercent}%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Coach Review</span>
                <span className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {log.reviewedByCoachName || 'Pending'}
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
              <span className="text-xs font-semibold text-muted-foreground">CALORIES CONSUMED</span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {log.consumedCalories} <span className="text-xs font-normal text-muted-foreground">/ {log.targetCalories} kcal</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${calPercent}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">PROTEIN INTAKE</span>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-primary">
              {log.consumedProteinGrams}g <span className="text-xs font-normal text-muted-foreground">/ {log.targetProteinGrams}g</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <div className="bg-primary h-full rounded-full" style={{ width: `${proPercent}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">CARBOHYDRATES</span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {log.consumedCarbsGrams}g <span className="text-xs font-normal text-muted-foreground">/ {log.targetCarbsGrams}g</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${carbPercent}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-cyan-500/5 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">WATER HYDRATION</span>
              <Droplets className="h-4 w-4 text-cyan-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              {log.waterIntakeLiters} <span className="text-xs font-normal text-muted-foreground">Liters</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Electrolyte Replenished</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-6 overflow-x-auto">
        <Button
          variant={activeTab === 'meals' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('meals')}
          className="gap-2 text-xs"
        >
          <Utensils className="h-3.5 w-3.5" />
          <span>Daily Meal Diary ({log.loggedMeals?.length || 0} Meals)</span>
        </Button>
        <Button
          variant={activeTab === 'comparison' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('comparison')}
          className="gap-2 text-xs"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Macro Target Auditing</span>
        </Button>
        <Button
          variant={activeTab === 'feedback' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('feedback')}
          className="gap-2 text-xs"
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>Coach Clinical Review</span>
        </Button>
      </div>

      {/* Tab 1: Logged Meals */}
      {activeTab === 'meals' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Chronological Daily Meal Log
            </CardTitle>
            <CardDescription className="text-xs">
              Itemized entries recorded throughout the day with precise timestamps and macro totals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {log.loggedMeals?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-muted/30 border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          <Clock className="w-3 h-3 mr-1" /> {item.timeLogged}
                        </Badge>
                        <span className="text-xs font-bold text-primary">{item.mealSlot}</span>
                      </div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">{item.foodName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-right pl-12 md:pl-0">
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

      {/* Tab 2: Macro Target Comparison */}
      {activeTab === 'comparison' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Target vs. Actual Macro Auditing
            </CardTitle>
            <CardDescription className="text-xs">
              Variance calculation between prescribed nutrition protocols and recorded athlete consumption.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3.5 bg-muted/40 rounded-lg border border-border/60 space-y-1">
                <span className="text-xs text-muted-foreground block">Calories (kcal)</span>
                <div className="text-lg font-bold font-mono text-foreground">{log.consumedCalories} / {log.targetCalories}</div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {Math.abs(log.consumedCalories - log.targetCalories)} kcal diff ({calPercent}%)
                </div>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-lg border border-border/60 space-y-1">
                <span className="text-xs text-muted-foreground block">Protein (g)</span>
                <div className="text-lg font-bold font-mono text-primary">{log.consumedProteinGrams}g / {log.targetProteinGrams}g</div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {log.consumedProteinGrams >= log.targetProteinGrams ? 'Target Achieved' : `${log.targetProteinGrams - log.consumedProteinGrams}g deficit`}
                </div>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-lg border border-border/60 space-y-1">
                <span className="text-xs text-muted-foreground block">Carbohydrates (g)</span>
                <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">{log.consumedCarbsGrams}g / {log.targetCarbsGrams}g</div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {carbPercent}% budget used
                </div>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-lg border border-border/60 space-y-1">
                <span className="text-xs text-muted-foreground block">Essential Fats (g)</span>
                <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">{log.consumedFatsGrams}g / {log.targetFatsGrams}g</div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {fatPercent}% budget used
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Coach Feedback */}
      {activeTab === 'feedback' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              Clinical Nutritionist Review & Action Notes
            </CardTitle>
            <CardDescription className="text-xs">
              Feedback from supervising coach regarding nutrient timing and metabolic response.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Reviewing Specialist: {log.reviewedByCoachName || 'Dr. Marcus Vance, PhD, RD'}</span>
                <Badge variant="success" className="text-[10px] font-bold">Verified Audit</Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                "{log.coachFeedback || 'Outstanding bio-adherence. Maintain current calorie and protein distribution over the next 48-hour training block.'}"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
};

