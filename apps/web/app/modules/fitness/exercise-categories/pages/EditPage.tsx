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
  Palette,
  Building2,
  Target,
  RefreshCw,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IExerciseCategory } from '../types';
import { DEFAULT_EXERCISE_CATEGORIES } from './ListPage';
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

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Identity & Anatomy
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState<any>('CHEST');
  const [movementPattern, setMovementPattern] = useState<any>('PUSH');

  // Section 2: Visual Styling & Description
  const [color, setColor] = useState('#3B82F6');
  const [description, setDescription] = useState('');

  // Section 3: Branch Scope & Status
  const [branchId, setBranchId] = useState('ALL');
  const [status, setStatus] = useState<'active' | 'archived'>('active');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadCategoryData();
  }, [id]);

  const loadCategoryData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_EXERCISE_CATEGORIES.find((c) => c.id === id || c.code === id) || DEFAULT_EXERCISE_CATEGORIES[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-categories/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IExerciseCategory = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setName(data.name);
      setCode(data.code);
      setPrimaryMuscleGroup(data.primaryMuscleGroup);
      setMovementPattern(data.movementPattern);
      setColor(data.color || '#3B82F6');
      setDescription(data.description || '');
      setBranchId(data.branchId || 'ALL');
      setStatus(data.status || 'active');
    } catch {
      // Use fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error('Please enter category name and code.');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IExerciseCategory> = {
        name,
        code,
        primaryMuscleGroup,
        movementPattern,
        color,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        status,
        description,
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-categories/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Category "${name}" updated successfully!`);
      navigate(`/fitness/exercise-categories/${id}`);
    } catch {
      toast.error('Network error updating category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Category Settings...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Category • ${name}`}
        subtitle="Modify category identity, biomechanical classifications, and facility branch scope."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/fitness/exercise-categories/${id}`)}
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
          
          {/* CARD 1: IDENTITY & ANATOMY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                1. Category Identity & Target Anatomy
              </CardTitle>
              <CardDescription className="text-xs">Specify category title, unique code, and primary muscle focus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Category Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Category Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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

          {/* CARD 2: VISUAL PALETTE & DESCRIPTION */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-amber-500" />
                2. Visual Palette & Biomechanical Notes
              </CardTitle>
              <CardDescription className="text-xs">Select color accents and describe primary muscle engagement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Badge Accent Color</label>
                <SelectBox
                  options={COLOR_OPTIONS}
                  value={color}
                  onChange={setColor}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Biomechanical Description & Cues</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: FACILITY BRANCH & STATUS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                3. Facility Branch Catalog Scope & Status
              </CardTitle>
              <CardDescription className="text-xs">Location scope and category availability status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Facility Scope</label>
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
                      { value: 'active', label: '🟢 Active & Enabled' },
                      { value: 'archived', label: '⚪ Archived / Disabled' },
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val as any)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/fitness/exercise-categories/${id}`)}
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
