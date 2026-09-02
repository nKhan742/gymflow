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
  Dumbbell,
  Layers,
  Clock,
  Plus,
  Trash2,
  Target,
  Trophy,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IWorkoutTemplate, ITemplateExercise } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const SPLIT_OPTIONS: ISelectOption[] = [
  { value: 'PUSH', label: '➡️ Push (Chest / Shoulders / Triceps)' },
  { value: 'PULL', label: '⬅️ Pull (Back / Traps / Biceps)' },
  { value: 'LEGS', label: '🦵 Legs (Quads / Glutes / Hamstrings)' },
  { value: 'UPPER', label: '🛡️ Upper Body Power' },
  { value: 'LOWER', label: '⚡ Lower Body Strength' },
  { value: 'FULL_BODY', label: '💥 Full Body Blitz' },
  { value: 'HIIT', label: '🏃 HIIT Metabolic Conditioning' },
  { value: 'FIGHT_CAMP', label: '🥊 Combat & Boxing Conditioning' },
];

const GOAL_OPTIONS: ISelectOption[] = [
  { value: 'HYPERTROPHY', label: '💪 Hypertrophy (Muscle Growth)' },
  { value: 'MAX_STRENGTH', label: '🏆 Maximum Strength & 1RM Peak' },
  { value: 'FAT_LOSS', label: '🔥 Fat Loss & Metabolic Rate' },
  { value: 'ENDURANCE', label: '🏃 Muscular Endurance & Stamina' },
  { value: 'ATHLETIC_POWER', label: '⚡ Explosive Athletic Power' },
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

  // Section 1: Template Info
  const [name, setName] = useState('');
  const [code, setCode] = useState(`TMP-${Math.floor(100 + Math.random() * 900)}`);
  const [splitType, setSplitType] = useState<any>('PUSH');
  const [targetGoal, setTargetGoal] = useState<any>('HYPERTROPHY');
  const [difficulty, setDifficulty] = useState<any>('INTERMEDIATE');
  const [estimatedDurationMins, setEstimatedDurationMins] = useState(60);
  const [description, setDescription] = useState('');
  const [branchId, setBranchId] = useState('ALL');

  // Dynamic Exercises List
  const [exercises, setExercises] = useState<ITemplateExercise[]>([
    { exerciseId: 'EXE-BCH-02', exerciseName: 'Barbell Flat Bench Press', targetMuscle: 'Chest', sets: 4, reps: '8-10', restSeconds: 90, rpe: 8 },
    { exerciseId: 'EXE-DB-INC-06', exerciseName: 'Incline Dumbbell Press', targetMuscle: 'Upper Chest', sets: 3, reps: '10-12', restSeconds: 75, rpe: 8.5 },
  ]);

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { exerciseId: `EXE-${Date.now()}`, exerciseName: 'New Movement', targetMuscle: 'Target Muscle', sets: 3, reps: '10-12', restSeconds: 60, rpe: 8 },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (index: number, field: keyof ITemplateExercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter template name.');
      return;
    }

    setLoading(true);
    const newId = code.trim();
    const payload: IWorkoutTemplate = {
      id: newId,
      _id: newId,
      name,
      code: newId,
      splitType,
      targetGoal,
      difficulty,
      estimatedDurationMins: Number(estimatedDurationMins) || 60,
      exercises,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      status: 'active',
      description,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_workout_templates');
      const customList: IWorkoutTemplate[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((t) => t.id !== newId && t.code !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_workout_templates', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-templates', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Workout template "${name}" created!`);
      navigate(`/fitness/workout-templates/${newId}`);
    } catch {
      toast.error('Error saving template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Workout Template"
        subtitle="Build a reusable workout blueprint with exercise sequences, target volume sets, reps, and RPE intensity guidance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/workout-templates')}
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
              <span>{loading ? 'Creating...' : 'Save Template'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: TEMPLATE IDENTITY & GOAL */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                1. Template Identity & Objectives
              </CardTitle>
              <CardDescription className="text-xs">Specify template name, split category, and target goal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Template Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Push A: Hypertrophy & Chest"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Template Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="TMP-PSH-01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Split Type</label>
                  <SelectBox
                    options={SPLIT_OPTIONS}
                    value={splitType}
                    onChange={(val) => setSplitType(val as any)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Training Goal</label>
                  <SelectBox
                    options={GOAL_OPTIONS}
                    value={targetGoal}
                    onChange={(val) => setTargetGoal(val as any)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: DURATION & PARAMETERS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                2. Duration, Difficulty & Location
              </CardTitle>
              <CardDescription className="text-xs">Session length and branch scope.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Est. Duration (Mins)</label>
                  <Input
                    type="number"
                    value={estimatedDurationMins}
                    onChange={(e) => setEstimatedDurationMins(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Difficulty Level</label>
                  <SelectBox
                    options={DIFFICULTY_OPTIONS}
                    value={difficulty}
                    onChange={(val) => setDifficulty(val as any)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Scope</label>
                  <SelectBox
                    options={branchOptions}
                    value={branchId}
                    onChange={setBranchId}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Description</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="High volume pressing protocol..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CARD 3: EXERCISE SEQUENCE BUILDER */}
        <Card>
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                3. Workout Movement Sequence ({exercises.length} Exercises)
              </CardTitle>
              <CardDescription className="text-xs">Configure sets, rep ranges, rest periods, and RPE.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddExercise}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exercise</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {exercises.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-muted/40 border border-border/80 grid grid-cols-1 sm:grid-cols-6 gap-3 items-center"
              >
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Movement Name</label>
                  <Input
                    value={item.exerciseName}
                    onChange={(e) => handleUpdateExercise(idx, 'exerciseName', e.target.value)}
                    placeholder="Exercise name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Sets</label>
                  <Input
                    type="number"
                    value={item.sets}
                    onChange={(e) => handleUpdateExercise(idx, 'sets', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Rep Range</label>
                  <Input
                    value={item.reps}
                    onChange={(e) => handleUpdateExercise(idx, 'reps', e.target.value)}
                    placeholder="8-10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Rest (Sec)</label>
                  <Input
                    type="number"
                    value={item.restSeconds}
                    onChange={(e) => handleUpdateExercise(idx, 'restSeconds', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-end pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExercise(idx)}
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
            onClick={() => navigate('/fitness/workout-templates')}
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
            <span>{loading ? 'Creating...' : 'Save Template'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
