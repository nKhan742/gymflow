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
  Target,
  Video,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { IExercise } from '../types';
import { DEFAULT_EXERCISES } from './ListPage';
import { useBranchStore } from '../../../../core/store/branchStore';

const CATEGORY_OPTIONS: ISelectOption[] = [
  { value: 'Chest & Pectorals', label: '🏋️ Chest & Pectorals' },
  { value: 'Back, Lats & Posterior Chain', label: '💪 Back, Lats & Posterior Chain' },
  { value: 'Quads, Hamstrings & Glutes', label: '🦵 Quads, Hamstrings & Glutes' },
  { value: 'Shoulders & Deltoids', label: '🛡️ Shoulders & Deltoids' },
  { value: 'Arms (Biceps, Triceps & Forearms)', label: '🦾 Arms (Biceps & Triceps)' },
  { value: 'Core, Abs & Obliques', label: '⚡ Core, Abs & Obliques' },
  { value: 'Cardio & High-Intensity Conditioning', label: '🏃 Cardio & Conditioning' },
  { value: 'Mobility, Flexibility & Recovery', label: '🧘 Mobility & Recovery' },
];

const EQUIPMENT_OPTIONS: ISelectOption[] = [
  { value: 'BARBELL', label: '🏋️ Olympic Barbell & Plates' },
  { value: 'DUMBBELL', label: '🦾 Dumbbells & Free Weights' },
  { value: 'CABLE', label: '⚙️ Cable Machine & Pulleys' },
  { value: 'MACHINE', label: '🏗️ Selectorized / Plate Loaded Machine' },
  { value: 'BODYWEIGHT', label: '🤸 Calisthenics / Bodyweight' },
  { value: 'KETTLEBELL', label: '🔔 Kettlebells' },
  { value: 'RESISTANCE_BAND', label: '🎗️ Resistance Bands' },
  { value: 'SPECIALTY', label: '💥 Specialty Functional Gear' },
];

const DIFFICULTY_OPTIONS: ISelectOption[] = [
  { value: 'BEGINNER', label: '🟢 Beginner Friendly' },
  { value: 'INTERMEDIATE', label: '🔵 Intermediate Lifter' },
  { value: 'ADVANCED', label: '🟡 Advanced Athlete' },
  { value: 'ELITE', label: '🔴 Elite / Competitive' },
];

const MECHANICS_OPTIONS: ISelectOption[] = [
  { value: 'COMPOUND', label: '⚡ Compound (Multi-Joint)' },
  { value: 'ISOLATION', label: '🎯 Isolation (Single-Joint)' },
];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Identity & Category
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Chest & Pectorals');
  const [equipment, setEquipment] = useState<any>('BARBELL');

  // Section 2: Anatomy & Biomechanics
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [secondaryMuscles, setSecondaryMuscles] = useState('');
  const [mechanics, setMechanics] = useState<any>('COMPOUND');
  const [difficulty, setDifficulty] = useState<any>('INTERMEDIATE');

  // Section 3: Visuals & Metrics
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caloriesBurnPerHour, setCaloriesBurnPerHour] = useState(450);

  // Section 4: Instructions & Cues
  const [instructions, setInstructions] = useState('');
  const [coachingCues, setCoachingCues] = useState('');
  const [branchId, setBranchId] = useState('ALL');
  const [status, setStatus] = useState<'active' | 'archived'>('active');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadExerciseData();
  }, [id]);

  const loadExerciseData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_EXERCISES.find((e) => e.id === id || e.code === id) || DEFAULT_EXERCISES[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-library/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IExercise = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setName(data.name);
      setCode(data.code);
      setCategory(data.category);
      setEquipment(data.equipment);
      setPrimaryMuscle(data.primaryMuscle);
      setSecondaryMuscles(data.secondaryMuscles?.join(', ') || '');
      setMechanics(data.mechanics);
      setDifficulty(data.difficulty);
      setThumbnailUrl(data.thumbnailUrl || '');
      setCaloriesBurnPerHour(data.caloriesBurnPerHour || 450);
      setInstructions(data.instructions?.join('\n') || '');
      setCoachingCues(data.coachingCues?.join('\n') || '');
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
    if (!name.trim() || !primaryMuscle.trim()) {
      toast.error('Please enter exercise name and target primary muscle.');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IExercise> = {
        name,
        code,
        category,
        primaryMuscle,
        secondaryMuscles: secondaryMuscles.split(',').map((m) => m.trim()).filter(Boolean),
        mechanics,
        difficulty,
        equipment,
        thumbnailUrl,
        instructions: instructions.split('\n').filter(Boolean),
        coachingCues: coachingCues.split('\n').filter(Boolean),
        caloriesBurnPerHour: Number(caloriesBurnPerHour) || 450,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        status,
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-library/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Exercise "${name}" updated successfully!`);
      navigate(`/fitness/exercise-library/${id}`);
    } catch {
      toast.error('Network error updating exercise');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Exercise Data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Exercise • ${name}`}
        subtitle="Modify exercise movements, biomechanical targets, and coaching cues."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/fitness/exercise-library/${id}`)}
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
          
          {/* CARD 1: IDENTITY & CATEGORY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                1. Exercise Identity & Equipment
              </CardTitle>
              <CardDescription className="text-xs">Specify exercise name, unique code, category, and gear.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Exercise Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Exercise Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Category Taxonomy</label>
                  <SelectBox
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={setCategory}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Primary Equipment</label>
                  <SelectBox
                    options={EQUIPMENT_OPTIONS}
                    value={equipment}
                    onChange={(val) => setEquipment(val as any)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: ANATOMY & BIOMECHANICS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                2. Target Anatomy & Movement Class
              </CardTitle>
              <CardDescription className="text-xs">Target muscle groups and mechanics type.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Primary Muscle *</label>
                  <Input
                    value={primaryMuscle}
                    onChange={(e) => setPrimaryMuscle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Secondary Synergists</label>
                  <Input
                    value={secondaryMuscles}
                    onChange={(e) => setSecondaryMuscles(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Mechanics</label>
                  <SelectBox
                    options={MECHANICS_OPTIONS}
                    value={mechanics}
                    onChange={(val) => setMechanics(val as any)}
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
            </CardContent>
          </Card>

          {/* CARD 3: VISUALS & STATUS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-4 w-4 text-indigo-500" />
                3. Demonstration Visuals & Status
              </CardTitle>
              <CardDescription className="text-xs">Thumbnail photo and system availability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <ImageUpload
                label="Exercise Demonstration Thumbnail"
                variant="thumbnail"
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
                helperText="Upload exercise movement photo or GIF (PNG, JPG, WEBP, GIF up to 10MB)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Calorie Burn (kcal / hour)</label>
                  <Input
                    type="number"
                    value={caloriesBurnPerHour}
                    onChange={(e) => setCaloriesBurnPerHour(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <SelectBox
                    options={[
                      { value: 'active', label: '🟢 Active in Library' },
                      { value: 'archived', label: '⚪ Archived' },
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val as any)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: COACHING CUES & STEP-BY-STEP */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-500" />
                4. Coaching Cues & Execution Steps
              </CardTitle>
              <CardDescription className="text-xs">Form cues for trainers and app demonstration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Coaching Cues (One per line)</label>
                <textarea
                  className="w-full h-20 p-2.5 rounded-lg bg-background border border-input text-xs text-foreground resize-none focus:ring-1 focus:ring-primary"
                  value={coachingCues}
                  onChange={(e) => setCoachingCues(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Step-by-Step Instructions (One per line)</label>
                <textarea
                  className="w-full h-20 p-2.5 rounded-lg bg-background border border-input text-xs text-foreground resize-none focus:ring-1 focus:ring-primary"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
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
            onClick={() => navigate(`/fitness/exercise-library/${id}`)}
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
