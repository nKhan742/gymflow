import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import {
  ArrowLeft,
  Save,
  ClipboardList,
  Flame,
  Zap,
  Clock,
  Target,
  Plus,
  Trash2,
  Droplets,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IDietPlan, DietGoal, IPlanMealScheduleItem } from '../types';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<DietGoal>('LEAN_BULK');
  const [dailyTargetCalories, setDailyTargetCalories] = useState('3200');
  const [proteinGrams, setProteinGrams] = useState('220');
  const [carbsGrams, setCarbsGrams] = useState('380');
  const [fatsGrams, setFatsGrams] = useState('85');
  const [fiberGrams, setFiberGrams] = useState('40');
  const [waterTargetLiters, setWaterTargetLiters] = useState('4.5');
  const [durationWeeks, setDurationWeeks] = useState('12');
  const [leadNutritionistName, setLeadNutritionistName] = useState('Dr. Marcus Vance, PhD, RD');
  const [branchId, setBranchId] = useState('ALL');
  const [description, setDescription] = useState('');

  // Daily Meal Schedule
  const [mealSchedule, setMealSchedule] = useState<IPlanMealScheduleItem[]>([
    { mealOrder: 1, mealTime: '07:30', slotTitle: 'Breakfast', mealName: 'Power Overnight Oats with Whey Isolate & Blueberries', calories: 650, proteinGrams: 45, carbsGrams: 85, fatsGrams: 14 },
    { mealOrder: 2, mealTime: '11:30', slotTitle: 'Pre-Workout Fuel', mealName: 'Cream of Rice with Natural Almond Butter & Banana', calories: 450, proteinGrams: 15, carbsGrams: 75, fatsGrams: 10 },
    { mealOrder: 3, mealTime: '15:00', slotTitle: 'Post-Workout Lunch', mealName: 'Sous-Vide Chicken Breast with Jasmine Rice & Avocado', calories: 850, proteinGrams: 65, carbsGrams: 110, fatsGrams: 15 },
    { mealOrder: 4, mealTime: '19:30', slotTitle: 'Dinner', mealName: 'Grass-Fed Sirloin Steak with Sweet Potato Mash & Asparagus', calories: 850, proteinGrams: 60, carbsGrams: 90, fatsGrams: 28 },
  ]);

  const branchOptions = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Master Protocol)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleAddMeal = () => {
    const nextOrder = mealSchedule.length + 1;
    setMealSchedule([
      ...mealSchedule,
      {
        mealOrder: nextOrder,
        mealTime: '21:30',
        slotTitle: `Meal ${nextOrder}`,
        mealName: 'Nutrient Dense Whole Food / Protein Blend',
        calories: 400,
        proteinGrams: 35,
        carbsGrams: 20,
        fatsGrams: 18,
      },
    ]);
  };

  const handleRemoveMeal = (index: number) => {
    setMealSchedule(mealSchedule.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `PLN-${goal.substring(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;
    const payload: IDietPlan = {
      id: newId,
      _id: newId,
      code: newId,
      name,
      goal,
      dailyTargetCalories: Number(dailyTargetCalories) || 2500,
      proteinGrams: Number(proteinGrams) || 180,
      carbsGrams: Number(carbsGrams) || 250,
      fatsGrams: Number(fatsGrams) || 70,
      fiberGrams: Number(fiberGrams) || 35,
      waterTargetLiters: Number(waterTargetLiters) || 3.5,
      durationWeeks: Number(durationWeeks) || 8,
      dailyMealsCount: mealSchedule.length,
      mealSchedule,
      leadNutritionistName,
      enrolledAthletesCount: 1,
      adherenceRatePercent: 98.0,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '')?.replace('🌐 ', '') || 'All Locations',
      status: 'active',
      description: description || `${goal.replace(/_/g, ' ')} curriculum engineered for elite body composition and cellular recovery.`,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_diet_plans');
      const customList: IDietPlan[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((p) => p.id !== newId && p.code !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_diet_plans', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/diet-plans', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Diet Plan "${name}" created successfully!`);
      navigate(`/nutrition/diet-plans/${newId}`);
    } catch {
      toast.error('Error creating diet plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Diet Plan & Protocol"
        subtitle="Engineer a periodized nutritional protocol with target calorie budgets, daily multi-meal schedules, and supervising nutritionist assignments."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/nutrition/diet-plans')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{loading ? 'Publishing...' : 'Save Diet Plan'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Identity & Target Budget */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Protocol Identity & Athletic Goal
            </CardTitle>
            <CardDescription className="text-xs">
              Primary program objective, duration, and supervising dietitian.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Diet Plan Name *</label>
              <Input
                placeholder="e.g. 3,400 Kcal Anabolic Mass Hypertrophy Curriculum"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Primary Athletic Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as DietGoal)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="LEAN_BULK">💪 Lean Bulk Hypertrophy</option>
                  <option value="FAT_LOSS_CUT">🔥 Thermogenic Shred / Fat Cut</option>
                  <option value="BODY_RECOMP">⚡ Body Recomposition</option>
                  <option value="ENDURANCE_FUEL">🏃 Endurance & HYROX Fuel</option>
                  <option value="KETO_SHRED">🥑 Ketogenic Fat Adaptation</option>
                  <option value="CLEAN_MAINTENANCE">⚖️ Clean Health Maintenance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Duration (Weeks)</label>
                <Input
                  type="number"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  min="1"
                  max="52"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Lead Nutritionist / Coach</label>
                <Input
                  value={leadNutritionistName}
                  onChange={(e) => setLeadNutritionistName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Daily Hydration Target (Liters)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={waterTargetLiters}
                  onChange={(e) => setWaterTargetLiters(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Branch Scope</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {branchOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Plan Overview & Periodization Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the macro rationale, calorie adjustments on training vs non-training days..."
                rows={3}
                className="w-full rounded-md border border-input bg-background p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Daily Macros & Multi-Meal Schedule */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              Daily Calorie Budget & Meal Timetable
            </CardTitle>
            <CardDescription className="text-xs">
              Daily macronutrient distribution and scheduled meal slots.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg border border-border/60">
              <div className="space-y-1 text-center">
                <label className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Target Kcal</label>
                <Input
                  type="number"
                  value={dailyTargetCalories}
                  onChange={(e) => setDailyTargetCalories(e.target.value)}
                  className="text-center font-mono font-bold text-sm h-8"
                  required
                />
              </div>

              <div className="space-y-1 text-center">
                <label className="text-[11px] font-bold text-primary">Protein (g)</label>
                <Input
                  type="number"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(e.target.value)}
                  className="text-center font-mono font-bold text-sm h-8"
                  required
                />
              </div>

              <div className="space-y-1 text-center">
                <label className="text-[11px] font-bold text-blue-500">Carbs (g)</label>
                <Input
                  type="number"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(e.target.value)}
                  className="text-center font-mono font-bold text-sm h-8"
                  required
                />
              </div>

              <div className="space-y-1 text-center">
                <label className="text-[11px] font-bold text-rose-500">Fats (g)</label>
                <Input
                  type="number"
                  value={fatsGrams}
                  onChange={(e) => setFatsGrams(e.target.value)}
                  className="text-center font-mono font-bold text-sm h-8"
                  required
                />
              </div>
            </div>

            {/* Daily Meal Schedule Builder */}
            <div className="space-y-2 pt-2 border-t border-border/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Scheduled Daily Meals ({mealSchedule.length})</label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddMeal} className="h-7 text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add Meal Slot
                </Button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {mealSchedule.map((item, idx) => (
                  <div key={idx} className="bg-muted/30 p-2.5 rounded-md border border-border/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={item.mealTime}
                        onChange={(e) => {
                          const copy = [...mealSchedule];
                          copy[idx].mealTime = e.target.value;
                          setMealSchedule(copy);
                        }}
                        className="h-7 text-xs w-20 font-mono"
                        placeholder="08:00"
                      />
                      <Input
                        value={item.slotTitle}
                        onChange={(e) => {
                          const copy = [...mealSchedule];
                          copy[idx].slotTitle = e.target.value;
                          setMealSchedule(copy);
                        }}
                        className="h-7 text-xs w-32 font-semibold"
                        placeholder="Breakfast"
                      />
                      <Input
                        value={item.mealName}
                        onChange={(e) => {
                          const copy = [...mealSchedule];
                          copy[idx].mealName = e.target.value;
                          setMealSchedule(copy);
                        }}
                        className="h-7 text-xs flex-1"
                        placeholder="Recipe Name"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMeal(idx)}
                        disabled={mealSchedule.length <= 1}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <Input
                        type="number"
                        value={item.calories}
                        onChange={(e) => {
                          const copy = [...mealSchedule];
                          copy[idx].calories = Number(e.target.value);
                          setMealSchedule(copy);
                        }}
                        className="h-6 text-xs text-center font-mono"
                        placeholder="Kcal"
                      />
                      <Input
                        type="number"
                        value={item.proteinGrams}
                        onChange={(e) => {
                          const copy = [...mealSchedule];
                          copy[idx].proteinGrams = Number(e.target.value);
                          setMealSchedule(copy);
                        }}
                        className="h-6 text-xs text-center font-mono"
                        placeholder="Protein g"
                      />
                      <Input
                        type="number"
                        value={item.carbsGrams}
                        onChange={(e) => {
                          const copy = [...mealSchedule];
                          copy[idx].carbsGrams = Number(e.target.value);
                          setMealSchedule(copy);
                        }}
                        className="h-6 text-xs text-center font-mono"
                        placeholder="Carbs g"
                      />
                      <Input
                        type="number"
                        value={item.fatsGrams}
                        onChange={(e) => {
                          const copy = [...mealSchedule];
                          copy[idx].fatsGrams = Number(e.target.value);
                          setMealSchedule(copy);
                        }}
                        className="h-6 text-xs text-center font-mono"
                        placeholder="Fats g"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
};

