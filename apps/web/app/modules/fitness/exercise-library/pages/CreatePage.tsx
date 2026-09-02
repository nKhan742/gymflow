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
  Target,
  Video,
  Flame,
  Activity,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { IExercise } from '../types';
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

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Section 1: Identity & Category
  const [name, setName] = useState('');
  const [code, setCode] = useState(`EXE-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState('Chest & Pectorals');
  const [equipment, setEquipment] = useState<any>('BARBELL');

  // Section 2: Anatomy & Biomechanics
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [secondaryMuscles, setSecondaryMuscles] = useState('');
  const [mechanics, setMechanics] = useState<any>('COMPOUND');
  const [difficulty, setDifficulty] = useState<any>('INTERMEDIATE');

  // Section 3: Visuals & Metrics
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [caloriesBurnPerHour, setCaloriesBurnPerHour] = useState(450);

  // Section 4: Instructions & Cues
  const [instructions, setInstructions] = useState('');
  const [coachingCues, setCoachingCues] = useState('');
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !primaryMuscle.trim()) {
      toast.error('Please enter exercise name and target primary muscle.');
      return;
    }

    setLoading(true);
    const newId = code.trim();
    const payload: IExercise = {
      id: newId,
      _id: newId,
      name,
      code: newId,
      category,
      primaryMuscle,
      secondaryMuscles: secondaryMuscles.split(',').map((m) => m.trim()).filter(Boolean),
      mechanics,
      difficulty,
      equipment,
      forceType: mechanics === 'COMPOUND' ? 'PUSH' : 'PULL',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
      videoUrl: videoUrl || undefined,
      instructions: instructions ? instructions.split('\n').filter(Boolean) : ['Setup in starting posture with aligned joint stack.'],
      coachingCues: coachingCues ? coachingCues.split('\n').filter(Boolean) : ['Maintain braced core.'],
      caloriesBurnPerHour: Number(caloriesBurnPerHour) || 450,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      status: 'active',
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_exercises');
      const customList: IExercise[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((e) => e.id !== newId && e.code !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_exercises', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/exercise-library', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Exercise "${name}" created in library!`);
      navigate(`/fitness/exercise-library/${newId}`);
    } catch {
      toast.error('Error saving exercise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Library Exercise"
        subtitle="Catalog a new exercise movement with biomechanical classifications, target muscle engagement, and coaching cues."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/exercise-library')}
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
              <span>{loading ? 'Creating...' : 'Save Exercise'}</span>
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
                    placeholder="e.g. Incline Barbell Bench Press"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Exercise Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="EXE-INC-01"
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
                    placeholder="e.g. Clavicular Pectoralis"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Secondary Synergists</label>
                  <Input
                    value={secondaryMuscles}
                    onChange={(e) => setSecondaryMuscles(e.target.value)}
                    placeholder="e.g. Anterior Deltoids, Triceps"
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

          {/* CARD 3: VISUALS & CALORIES */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-4 w-4 text-indigo-500" />
                3. Demonstration Visuals & Metrics
              </CardTitle>
              <CardDescription className="text-xs">Provide image demonstration and calorie estimate.</CardDescription>
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
                  <label className="text-xs font-semibold text-foreground">Branch Scope</label>
                  <SelectBox
                    options={branchOptions}
                    value={branchId}
                    onChange={setBranchId}
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
                  placeholder="e.g.&#10;Knees track over toes&#10;Brace core with Valsalva&#10;Drive chest through lockout"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Step-by-Step Instructions (One per line)</label>
                <textarea
                  className="w-full h-20 p-2.5 rounded-lg bg-background border border-input text-xs text-foreground resize-none focus:ring-1 focus:ring-primary"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g.&#10;Setup bar securely&#10;Descend slowly for 2s&#10;Explode upward"
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
            onClick={() => navigate('/fitness/exercise-library')}
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
            <span>{loading ? 'Creating...' : 'Save Exercise'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
