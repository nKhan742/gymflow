import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox, ISelectOption } from '../../../../shared/components/ui/select';
import {
  ArrowLeft,
  Save,
  Calendar,
  Layers,
  Plus,
  Trash2,
  Target,
  User,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IWorkoutPlan, IPlanWeek } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const CATEGORY_OPTIONS: ISelectOption[] = [
  { value: 'BODYBUILDING', label: '💪 Hypertrophy & Bodybuilding' },
  { value: 'POWERLIFTING', label: '🏆 Powerlifting & Max Strength' },
  { value: 'FAT_LOSS', label: '🔥 Fat Loss & Metabolic Shred' },
  { value: 'BOXING_CONDITIONING', label: '🥊 Combat & Boxing Conditioning' },
  { value: 'FUNCTIONAL_ATHLETE', label: '⚡ Functional Athletic Performance' },
  { value: 'GENERAL_FITNESS', label: '🏃 General Fitness & Longevity' },
];

const DIFFICULTY_OPTIONS: ISelectOption[] = [
  { value: 'BEGINNER', label: '🟢 Beginner Friendly' },
  { value: 'INTERMEDIATE', label: '🔵 Intermediate Lifter' },
  { value: 'ADVANCED', label: '🟡 Advanced Athlete' },
  { value: 'ELITE', label: '🔴 Elite / Competitive' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Section 1: Plan Identity
  const [name, setName] = useState('');
  const [code, setCode] = useState(`PLN-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<any>('BODYBUILDING');
  const [targetGoal, setTargetGoal] = useState('');

  // Section 2: Periodization & Coach
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [frequencyDaysPerWeek, setFrequencyDaysPerWeek] = useState(5);
  const [difficulty, setDifficulty] = useState<any>('INTERMEDIATE');
  const [authorCoachName, setAuthorCoachName] = useState('Marcus Aurelius Vance');
  const [description, setDescription] = useState('');
  const [branchId, setBranchId] = useState('ALL');

  // Dynamic Phases List
  const [phases, setPhases] = useState<IPlanWeek[]>([
    { weekNumber: 1, phaseName: 'Phase 1: Accumulation', focus: '12-15 Reps Volume Baseline', daysPerWeek: 5 },
    { weekNumber: 5, phaseName: 'Phase 2: Overload', focus: '8-10 Reps Progressive Load', daysPerWeek: 5 },
  ]);

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleAddPhase = () => {
    setPhases([
      ...phases,
      { weekNumber: phases.length * 4 + 1, phaseName: `Phase ${phases.length + 1}: Intensification`, focus: 'Heavy Intensity & Peak', daysPerWeek: 5 },
    ]);
  };

  const handleRemovePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handleUpdatePhase = (index: number, field: keyof IPlanWeek, value: any) => {
    const updated = [...phases];
    updated[index] = { ...updated[index], [field]: value };
    setPhases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter plan name.');
      return;
    }

    setLoading(true);
    const newId = code.trim();
    const payload: IWorkoutPlan = {
      id: newId,
      _id: newId,
      name,
      code: newId,
      category,
      durationWeeks: Number(durationWeeks) || 12,
      frequencyDaysPerWeek: Number(frequencyDaysPerWeek) || 5,
      difficulty,
      enrolledAthletesCount: 0,
      targetGoal: targetGoal || 'Athletic hypertrophy & strength development',
      authorCoachName,
      phases,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      status: 'active',
      description,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_workout_plans');
      const customList: IWorkoutPlan[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((p) => p.id !== newId && p.code !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_workout_plans', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-plans', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Workout plan "${name}" created!`);
      navigate(`/fitness/workout-plans/${newId}`);
    } catch {
      toast.error('Error saving workout plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Workout Plan"
        subtitle="Design a structured multi-week training curriculum, periodization phases, and weekly training schedules."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/workout-plans')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              disabled={loading}
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Save Plan'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: IDENTITY & CATEGORY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                1. Plan Identity & Focus
              </CardTitle>
              <CardDescription className="text-xs">Specify plan title, code, and athletic category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Program Plan Title *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 12-Week Pure Hypertrophy Lean Bulk"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Plan Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="PLN-BLK-01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Program Category</label>
                  <SelectBox
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={(val) => setCategory(val as any)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Goal Objective</label>
                  <Input
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    placeholder="e.g. Maximum lean mass growth"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: DURATION & COACH */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                2. Duration, Frequency & Author
              </CardTitle>
              <CardDescription className="text-xs">Program length, frequency, and coach credit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Duration (Weeks)</label>
                  <Input
                    type="number"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Weekly Frequency (Days/Wk)</label>
                  <Input
                    type="number"
                    value={frequencyDaysPerWeek}
                    onChange={(e) => setFrequencyDaysPerWeek(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Difficulty Level</label>
                  <SelectBox
                    options={DIFFICULTY_OPTIONS}
                    value={difficulty}
                    onChange={(val) => setDifficulty(val as any)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Author Coach</label>
                  <Input
                    value={authorCoachName}
                    onChange={(e) => setAuthorCoachName(e.target.value)}
                    placeholder="Coach name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Branch Scope</label>
                <SelectBox
                  options={branchOptions}
                  value={branchId}
                  onChange={setBranchId}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CARD 3: PERIODIZATION PHASES */}
        <Card>
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                3. Periodization Phases ({phases.length} Phases)
              </CardTitle>
              <CardDescription className="text-xs">Define accumulation, overload, and deload phases.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPhase}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phase</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {phases.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-muted/40 border border-border/80 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Start Week</label>
                  <Input
                    type="number"
                    value={item.weekNumber}
                    onChange={(e) => handleUpdatePhase(idx, 'weekNumber', Number(e.target.value))}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Phase Name</label>
                  <Input
                    value={item.phaseName}
                    onChange={(e) => handleUpdatePhase(idx, 'phaseName', e.target.value)}
                    placeholder="Phase name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Training Focus</label>
                  <Input
                    value={item.focus}
                    onChange={(e) => handleUpdatePhase(idx, 'focus', e.target.value)}
                    placeholder="Focus description"
                  />
                </div>
                <div className="flex items-center justify-end pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePhase(idx)}
                    className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/workout-plans')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="gap-1.5 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Creating...' : 'Save Plan'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
