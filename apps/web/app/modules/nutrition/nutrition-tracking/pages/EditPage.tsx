import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import {
  ArrowLeft,
  Save,
  Activity,
  Flame,
  Zap,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { INutritionLog, AdherenceStatus, ILoggedMealItem } from '../types';
import { DEFAULT_NUTRITION_LOGS } from './ListPage';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('MEM-8801');
  const [logDate, setLogDate] = useState('Today, 2026-08-29');
  const [targetCalories, setTargetCalories] = useState('2800');
  const [consumedCalories, setConsumedCalories] = useState('2750');
  const [targetProteinGrams, setTargetProteinGrams] = useState('200');
  const [consumedProteinGrams, setConsumedProteinGrams] = useState('195');
  const [targetCarbsGrams, setTargetCarbsGrams] = useState('320');
  const [consumedCarbsGrams, setConsumedCarbsGrams] = useState('310');
  const [targetFatsGrams, setTargetFatsGrams] = useState('75');
  const [consumedFatsGrams, setConsumedFatsGrams] = useState('72');
  const [waterIntakeLiters, setWaterIntakeLiters] = useState('3.8');
  const [adherenceStatus, setAdherenceStatus] = useState<AdherenceStatus>('OPTIMAL_ON_TRACK');
  const [coachFeedback, setCoachFeedback] = useState('');
  const [reviewedByCoachName, setReviewedByCoachName] = useState('');
  const [branchId, setBranchId] = useState('ALL');
  const [loggedMeals, setLoggedMeals] = useState<ILoggedMealItem[]>([]);

  const branchOptions = [
    { value: 'ALL', label: '🌐 All Gym Locations' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadLog();
  }, [id]);

  const loadLog = () => {
    setFetching(true);
    let matched: INutritionLog | undefined;
    const stored = localStorage.getItem('gymflow_custom_nutrition_logs');
    if (stored) {
      const list: INutritionLog[] = JSON.parse(stored);
      matched = list.find((l) => l.id === id || l._id === id || l.code === id);
    }
    if (!matched) {
      matched = DEFAULT_NUTRITION_LOGS.find((l) => l.id === id || l.code === id);
    }

    if (matched) {
      setMemberName(matched.memberName);
      setMemberId(matched.memberId);
      setLogDate(matched.logDate);
      setTargetCalories(String(matched.targetCalories));
      setConsumedCalories(String(matched.consumedCalories));
      setTargetProteinGrams(String(matched.targetProteinGrams));
      setConsumedProteinGrams(String(matched.consumedProteinGrams));
      setTargetCarbsGrams(String(matched.targetCarbsGrams));
      setConsumedCarbsGrams(String(matched.consumedCarbsGrams));
      setTargetFatsGrams(String(matched.targetFatsGrams));
      setConsumedFatsGrams(String(matched.consumedFatsGrams));
      setWaterIntakeLiters(String(matched.waterIntakeLiters || 3.5));
      setAdherenceStatus(matched.adherenceStatus);
      setCoachFeedback(matched.coachFeedback || '');
      setReviewedByCoachName(matched.reviewedByCoachName || '');
      setBranchId(matched.branchId || 'ALL');
      setLoggedMeals(matched.loggedMeals || []);
    }
    setFetching(false);
  };

  const handleAddMeal = () => {
    setLoggedMeals([
      ...loggedMeals,
      {
        mealSlot: `Meal ${loggedMeals.length + 1}`,
        foodName: 'Whole Food Entry / Shake',
        timeLogged: '04:00 PM',
        calories: 350,
        proteinGrams: 30,
        carbsGrams: 30,
        fatsGrams: 10,
      },
    ]);
  };

  const handleRemoveMeal = (index: number) => {
    setLoggedMeals(loggedMeals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const logId = id || 'LOG-001';
    const payload: INutritionLog = {
      id: logId,
      _id: logId,
      code: logId,
      memberName,
      memberId,
      memberEmail: `${memberName.toLowerCase().replace(/\s+/g, '.')}@gymflow.io`,
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      logDate,
      targetCalories: Number(targetCalories) || 2500,
      consumedCalories: Number(consumedCalories) || 2400,
      targetProteinGrams: Number(targetProteinGrams) || 180,
      consumedProteinGrams: Number(consumedProteinGrams) || 175,
      targetCarbsGrams: Number(targetCarbsGrams) || 260,
      consumedCarbsGrams: Number(consumedCarbsGrams) || 250,
      targetFatsGrams: Number(targetFatsGrams) || 70,
      consumedFatsGrams: Number(consumedFatsGrams) || 68,
      adherenceStatus,
      adherenceScorePercent: 96.5,
      waterIntakeLiters: Number(waterIntakeLiters) || 3.5,
      loggedMeals,
      coachFeedback,
      reviewedByCoachName,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '')?.replace('🌐 ', '') || 'Main Facility',
      status: 'active',
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_nutrition_logs');
      const customList: INutritionLog[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((l) => l.id !== logId && l.code !== logId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_nutrition_logs', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/nutrition-tracking/${logId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Food diary for "${memberName}" updated!`);
      navigate(`/nutrition/nutrition-tracking/${logId}`);
    } catch {
      toast.error('Error updating nutrition log');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-muted-foreground text-sm">
          Loading food log details...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Log: ${memberName || id}`}
        subtitle="Modify daily macro totals, meal items, and clinical feedback."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/nutrition/nutrition-tracking/${id}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={loading || !memberName.trim()}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{loading ? 'Saving...' : 'Update Log'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Athlete & Target Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Member identity and daily calorie budget targets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Athlete / Member Name *</label>
                <Input
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Member ID</label>
                <Input
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Log Date</label>
                <Input
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Adherence Classification</label>
                <select
                  value={adherenceStatus}
                  onChange={(e) => setAdherenceStatus(e.target.value as AdherenceStatus)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="OPTIMAL_ON_TRACK">🟢 Target Hit (Optimal)</option>
                  <option value="PROTEIN_DEFICIT">🔴 Protein Deficit Alert</option>
                  <option value="CALORIE_SURPLUS">🟡 Calorie Surplus</option>
                  <option value="CALORIE_DEFICIT">🔵 Calorie Deficit</option>
                </select>
              </div>
            </div>

            {/* Target vs Consumed */}
            <div className="space-y-2 pt-2 border-t border-border/80">
              <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3 rounded-lg border border-border/60">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-muted-foreground">TARGET GOALS</div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground block">Calories (kcal)</label>
                    <Input
                      type="number"
                      value={targetCalories}
                      onChange={(e) => setTargetCalories(e.target.value)}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground block">Protein (g)</label>
                    <Input
                      type="number"
                      value={targetProteinGrams}
                      onChange={(e) => setTargetProteinGrams(e.target.value)}
                      className="h-7 text-xs font-mono text-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground block">Carbs (g)</label>
                    <Input
                      type="number"
                      value={targetCarbsGrams}
                      onChange={(e) => setTargetCarbsGrams(e.target.value)}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-primary">ACTUAL CONSUMED</div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground block">Calories (kcal)</label>
                    <Input
                      type="number"
                      value={consumedCalories}
                      onChange={(e) => setConsumedCalories(e.target.value)}
                      className="h-7 text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground block">Protein (g)</label>
                    <Input
                      type="number"
                      value={consumedProteinGrams}
                      onChange={(e) => setConsumedProteinGrams(e.target.value)}
                      className="h-7 text-xs font-mono font-bold text-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground block">Carbs (g)</label>
                    <Input
                      type="number"
                      value={consumedCarbsGrams}
                      onChange={(e) => setConsumedCarbsGrams(e.target.value)}
                      className="h-7 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Water (L)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={waterIntakeLiters}
                  onChange={(e) => setWaterIntakeLiters(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Coach Reviewer</label>
                <Input
                  value={reviewedByCoachName}
                  onChange={(e) => setReviewedByCoachName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Coach Guidance</label>
              <textarea
                value={coachFeedback}
                onChange={(e) => setCoachFeedback(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Meal Items */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              Itemized Daily Meals ({loggedMeals.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Chronological food diary entries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Entries</span>
              <Button type="button" variant="outline" size="sm" onClick={handleAddMeal} className="h-7 text-xs gap-1">
                <Plus className="h-3 w-3" /> Add Meal
              </Button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {loggedMeals.map((meal, idx) => (
                <div key={idx} className="bg-muted/30 p-2.5 rounded-md border border-border/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={meal.mealSlot}
                      onChange={(e) => {
                        const copy = [...loggedMeals];
                        copy[idx].mealSlot = e.target.value;
                        setLoggedMeals(copy);
                      }}
                      className="h-7 text-xs w-28 font-semibold"
                      placeholder="Slot"
                    />
                    <Input
                      value={meal.foodName}
                      onChange={(e) => {
                        const copy = [...loggedMeals];
                        copy[idx].foodName = e.target.value;
                        setLoggedMeals(copy);
                      }}
                      className="h-7 text-xs flex-1"
                    />
                    <Input
                      value={meal.timeLogged}
                      onChange={(e) => {
                        const copy = [...loggedMeals];
                        copy[idx].timeLogged = e.target.value;
                        setLoggedMeals(copy);
                      }}
                      className="h-7 text-xs w-24 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMeal(idx)}
                      disabled={loggedMeals.length <= 1}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <Input
                      type="number"
                      value={meal.calories}
                      onChange={(e) => {
                        const copy = [...loggedMeals];
                        copy[idx].calories = Number(e.target.value);
                        setLoggedMeals(copy);
                      }}
                      className="h-6 text-xs text-center font-mono"
                    />
                    <Input
                      type="number"
                      value={meal.proteinGrams}
                      onChange={(e) => {
                        const copy = [...loggedMeals];
                        copy[idx].proteinGrams = Number(e.target.value);
                        setLoggedMeals(copy);
                      }}
                      className="h-6 text-xs text-center font-mono text-primary font-bold"
                    />
                    <Input
                      type="number"
                      value={meal.carbsGrams}
                      onChange={(e) => {
                        const copy = [...loggedMeals];
                        copy[idx].carbsGrams = Number(e.target.value);
                        setLoggedMeals(copy);
                      }}
                      className="h-6 text-xs text-center font-mono"
                    />
                    <Input
                      type="number"
                      value={meal.fatsGrams}
                      onChange={(e) => {
                        const copy = [...loggedMeals];
                        copy[idx].fatsGrams = Number(e.target.value);
                        setLoggedMeals(copy);
                      }}
                      className="h-6 text-xs text-center font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
};

