import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  RefreshCw,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IWorkoutTemplate, ITemplateExercise } from '../types';
import { DEFAULT_WORKOUT_TEMPLATES } from './ListPage';
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

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Template Info
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [splitType, setSplitType] = useState<any>('PUSH');
  const [targetGoal, setTargetGoal] = useState<any>('HYPERTROPHY');
  const [difficulty, setDifficulty] = useState<any>('INTERMEDIATE');
  const [estimatedDurationMins, setEstimatedDurationMins] = useState(60);
  const [description, setDescription] = useState('');
  const [branchId, setBranchId] = useState('ALL');
  const [status, setStatus] = useState<'active' | 'archived'>('active');

  // Dynamic Exercises List
  const [exercises, setExercises] = useState<ITemplateExercise[]>([]);

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadTemplateData();
  }, [id]);

  const loadTemplateData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_WORKOUT_TEMPLATES.find((t) => t.id === id || t.code === id) || DEFAULT_WORKOUT_TEMPLATES[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-templates/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IWorkoutTemplate = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setName(data.name);
      setCode(data.code);
      setSplitType(data.splitType);
      setTargetGoal(data.targetGoal);
      setDifficulty(data.difficulty);
      setEstimatedDurationMins(data.estimatedDurationMins || 60);
      setDescription(data.description || '');
      setBranchId(data.branchId || 'ALL');
      setStatus(data.status || 'active');
      setExercises(data.exercises || []);
    } catch {
      // Use fallback
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IWorkoutTemplate> = {
        name,
        code,
        splitType,
        targetGoal,
        difficulty,
        estimatedDurationMins: Number(estimatedDurationMins) || 60,
        exercises,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        status,
        description,
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-templates/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Workout template "${name}" updated!`);
      navigate(`/fitness/workout-templates/${id}`);
    } catch {
      toast.error('Network error updating template');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Template Data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Template • ${name}`}
        subtitle="Modify exercise sequences, volume parameters, and target goals."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/fitness/workout-templates/${id}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              disabled={saving}
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Template Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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
                2. Duration, Difficulty & Status
              </CardTitle>
              <CardDescription className="text-xs">Session length and system status.</CardDescription>
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
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <SelectBox
                    options={[
                      { value: 'active', label: '🟢 Active in Catalog' },
                      { value: 'archived', label: '⚪ Archived' },
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val as any)}
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
            onClick={() => navigate(`/fitness/workout-templates/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={saving}
            className="gap-1.5 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
