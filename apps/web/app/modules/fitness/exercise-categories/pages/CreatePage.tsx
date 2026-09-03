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
  Palette,
  Building2,
  Target,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IExerciseCategory } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const MUSCLE_GROUP_OPTIONS: ISelectOption[] = [
  { value: 'CHEST', label: '🏋️ Chest & Pectoralis Major' },
  { value: 'BACK', label: '💪 Back, Lats & Rhomboids' },
  { value: 'LEGS', label: '🦵 Quads, Hamstrings & Glutes' },
  { value: 'SHOULDERS', label: '🛡️ Shoulders & Deltoids' },
  { value: 'ARMS', label: '🦾 Arms (Biceps & Triceps)' },
  { value: 'CORE', label: '⚡ Core, Abs & Obliques' },
  { value: 'CARDIO', label: '🏃 Cardio & Conditioning' },
  { value: 'MOBILITY', label: '🧘 Mobility & Flexibility' },
  { value: 'FULL_BODY', label: '💥 Full-Body Functional' },
];

const MOVEMENT_PATTERN_OPTIONS: ISelectOption[] = [
  { value: 'PUSH', label: '➡️ Horizontal / Vertical Push' },
  { value: 'PULL', label: '⬅️ Horizontal / Vertical Pull' },
  { value: 'SQUAT', label: '⬇️ Knee-Dominant Squat' },
  { value: 'HINGE', label: '🔄 Hip-Dominant Hinge' },
  { value: 'LUNGE', label: '🚶 Unilateral Lunge / Step' },
  { value: 'CARRY', label: '🏋️ Loaded Carry & Gait' },
  { value: 'ISOLATION', label: '🎯 Single-Joint Isolation' },
  { value: 'CONDITIONING', label: '⚡ Energy System Conditioning' },
];

const COLOR_OPTIONS: ISelectOption[] = [
  { value: '#3B82F6', label: '🔵 Royal Blue (Chest / Upper)' },
  { value: '#10B981', label: '🟢 Emerald Green (Back / Lats)' },
  { value: '#8B5CF6', label: '🟣 Purple (Legs / Lower)' },
  { value: '#F59E0B', label: '🟡 Amber (Shoulders / Delts)' },
  { value: '#EC4899', label: '🌸 Pink (Arms)' },
  { value: '#06B6D4', label: '🔷 Cyan (Core / Abs)' },
  { value: '#EF4444', label: '🔴 Crimson Red (Cardio / HIIT)' },
  { value: '#14B8A6', label: '🌿 Teal (Mobility / Recovery)' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);

  // Section 1: Identity & Anatomy
  const [name, setName] = useState('');
  const [code, setCode] = useState(`CAT-${Math.floor(100 + Math.random() * 900)}`);
  const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState<any>('CHEST');
  const [movementPattern, setMovementPattern] = useState<any>('PUSH');

  // Section 2: Visual Styling & Description
  const [color, setColor] = useState('#3B82F6');
  const [description, setDescription] = useState('');

  // Section 3: Branch Scope
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error('Please enter category name and code.');
      return;
    }

    setLoading(true);
    const newId = code.trim();
    const payload: IExerciseCategory = {
      id: newId,
      _id: newId,
      name,
      code: newId,
      primaryMuscleGroup,
      movementPattern,
      exerciseCount: 0,
      color,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      status: 'active',
      description: description || 'Movement classification category.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Save to localStorage immediately so user sees it in list and view pages without latency
      const stored = localStorage.getItem('gymflow_custom_exercise_categories');
      const customList: IExerciseCategory[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((c) => c.id !== newId && c.code !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_exercise_categories', JSON.stringify(filtered));

      // 2. Also attempt API POST
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-categories', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Safe ignore network error since local storage persisted
      });

      toast.success(`Exercise category "${name}" created successfully!`);
      navigate(`/fitness/exercise-categories/${newId}`);
    } catch {
      toast.error('Error creating category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Exercise Category"
        subtitle="Create movement classification taxonomies, define primary muscle targets, and assign biomechanical movement patterns."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/exercise-categories')}
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
              <span>{loading ? 'Creating...' : 'Save Category'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: IDENTITY & BIOMECHANICS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                1. Category Identity & Biomechanics
              </CardTitle>
              <CardDescription className="text-xs">Define classification name, code, and movement pattern.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Category Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chest & Horizontal Press"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Unique Category Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CAT-01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Primary Muscle Group</label>
                  <SelectBox
                    options={MUSCLE_GROUP_OPTIONS}
                    value={primaryMuscleGroup}
                    onChange={(val) => setPrimaryMuscleGroup(val as any)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Movement Pattern</label>
                  <SelectBox
                    options={MOVEMENT_PATTERN_OPTIONS}
                    value={movementPattern}
                    onChange={(val) => setMovementPattern(val as any)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: PALETTE & SCOPE */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-emerald-500" />
                2. Visual Palette & Facility Scope
              </CardTitle>
              <CardDescription className="text-xs">Badge color and multi-gym branch context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Badge Accent Color</label>
                  <SelectBox
                    options={COLOR_OPTIONS}
                    value={color}
                    onChange={(val) => setColor(val as string)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Scope</label>
                  <SelectBox
                    options={branchOptions}
                    value={branchId}
                    onChange={setBranchId}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Biomechanics & Anatomical Notes</label>
                <textarea
                  className="w-full h-20 p-2.5 rounded-lg bg-background border border-input text-xs text-foreground resize-none focus:ring-1 focus:ring-primary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Focuses on horizontal and vertical pressing variations targeting pectoralis major and anterior deltoids."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/exercise-categories')}
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
            <span>{loading ? 'Creating...' : 'Save Category'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
