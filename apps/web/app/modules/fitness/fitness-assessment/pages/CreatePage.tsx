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
  HeartPulse,
  Scale,
  Flame,
  Trophy,
  Activity,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IFitnessAssessment } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const MEMBER_OPTIONS: ISelectOption[] = [
  { value: 'MEM-001', label: '👤 Sophia Sterling (MEM-001)' },
  { value: 'MEM-002', label: '👤 Alexander Wright (MEM-002)' },
  { value: 'MEM-003', label: '👤 Isabella Rodriguez (MEM-003)' },
  { value: 'MEM-004', label: '👤 Liam O’Connor (MEM-004)' },
  { value: 'MEM-005', label: '👤 David Kim (MEM-005)' },
];

const COACH_OPTIONS: ISelectOption[] = [
  { value: 'STF-001', label: '🏋️ Marcus Aurelius Vance (Head PT)' },
  { value: 'STF-002', label: '✨ Elena Rostova (Group Studio Lead)' },
  { value: 'STF-003', label: '💪 Damon Walker (Strength Coach)' },
  { value: 'STF-004', label: '🥊 Gabriel Santos (Boxing Specialist)' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);

  // Section 1: Member & Assessor
  const [memberId, setMemberId] = useState('MEM-001');
  const [assessorCoachId, setAssessorCoachId] = useState('STF-001');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);

  // Section 2: Body Composition
  const [weightKg, setWeightKg] = useState(70.0);
  const [bodyFatPercentage, setBodyFatPercentage] = useState(16.5);
  const [skeletalMuscleMassKg, setSkeletalMuscleMassKg] = useState(33.0);
  const [visceralFatScore, setVisceralFatScore] = useState(3);

  // Section 3: Strength & VO2
  const [benchPress1RMKg, setBenchPress1RMKg] = useState(85);
  const [squat1RMKg, setSquat1RMKg] = useState(120);
  const [deadlift1RMKg, setDeadlift1RMKg] = useState(150);
  const [vo2MaxScore, setVo2MaxScore] = useState(48);

  // Section 4: Posture & Notes
  const [postureScreenNotes, setPostureScreenNotes] = useState('');
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const memberLabel = MEMBER_OPTIONS.find((m) => m.value === memberId)?.label || '';
    const selectedMember = memberLabel.replace('👤 ', '') || 'Member';
    const coachLabel = COACH_OPTIONS.find((c) => c.value === assessorCoachId)?.label || '';
    const selectedCoach = (coachLabel.split(' (')[0] || '').replace('🏋️ ', '').replace('✨ ', '').replace('💪 ', '').replace('🥊 ', '') || 'Coach';

    const newId = `ASM-${Math.floor(100 + Math.random() * 900)}`;
    const payload: IFitnessAssessment = {
      id: newId,
      _id: newId,
      assessmentCode: newId,
      memberId,
      memberName: selectedMember.split(' (')[0],
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      assessorCoachId,
      assessorCoachName: selectedCoach,
      assessmentDate,
      weightKg: Number(weightKg),
      bodyFatPercentage: Number(bodyFatPercentage),
      skeletalMuscleMassKg: Number(skeletalMuscleMassKg),
      visceralFatScore: Number(visceralFatScore),
      benchPress1RMKg: Number(benchPress1RMKg),
      squat1RMKg: Number(squat1RMKg),
      deadlift1RMKg: Number(deadlift1RMKg),
      vo2MaxScore: Number(vo2MaxScore),
      postureScreenNotes,
      status: 'COMPLETED',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_fitness_assessments');
      const customList: IFitnessAssessment[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((a) => a.id !== newId && a.assessmentCode !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_fitness_assessments', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/fitness-assessment', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Assessment for ${selectedMember.split(' (')[0]} saved!`);
      navigate(`/fitness/fitness-assessment/${newId}`);
    } catch {
      toast.error('Error saving assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Record Fitness Assessment"
        subtitle="Log InBody bioelectrical impedance body composition metrics, 1RM strength tests, and posture screens."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/fitness-assessment')}
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
              <span>{loading ? 'Recording...' : 'Save Assessment'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: MEMBER & ASSESSOR */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-primary" />
                1. Member & Screening Date
              </CardTitle>
              <CardDescription className="text-xs">Select member and supervising trainer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select Gym Member</label>
                <SelectBox
                  options={MEMBER_OPTIONS}
                  value={memberId}
                  onChange={setMemberId}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assessor Coach</label>
                  <SelectBox
                    options={COACH_OPTIONS}
                    value={assessorCoachId}
                    onChange={setAssessorCoachId}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assessment Date</label>
                  <Input
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: INBODY BODY COMPOSITION */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4 text-emerald-500" />
                2. InBody Composition & Bioimpedance
              </CardTitle>
              <CardDescription className="text-xs">Weight, body fat, and muscle mass readings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Body Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Body Fat Percentage (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={bodyFatPercentage}
                    onChange={(e) => setBodyFatPercentage(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Skeletal Muscle Mass (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={skeletalMuscleMassKg}
                    onChange={(e) => setSkeletalMuscleMassKg(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Visceral Fat Level (1-20)</label>
                  <Input
                    type="number"
                    value={visceralFatScore}
                    onChange={(e) => setVisceralFatScore(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: 1RM STRENGTH BENCHMARKS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                3. Big 3 1RM Strength & Aerobic Benchmark
              </CardTitle>
              <CardDescription className="text-xs">One-rep max power and cardiovascular stamina.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Bench 1RM (kg)</label>
                  <Input
                    type="number"
                    value={benchPress1RMKg}
                    onChange={(e) => setBenchPress1RMKg(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Squat 1RM (kg)</label>
                  <Input
                    type="number"
                    value={squat1RMKg}
                    onChange={(e) => setSquat1RMKg(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Deadlift 1RM (kg)</label>
                  <Input
                    type="number"
                    value={deadlift1RMKg}
                    onChange={(e) => setDeadlift1RMKg(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Estimated VO2 Max (ml/kg/min)</label>
                  <Input
                    type="number"
                    value={vo2MaxScore}
                    onChange={(e) => setVo2MaxScore(Number(e.target.value))}
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

          {/* CARD 4: POSTURE & MOBILITY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                4. Posture Screen & Movement Notes
              </CardTitle>
              <CardDescription className="text-xs">Musculoskeletal screening observations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Posture & Mobility Observations</label>
                <textarea
                  className="w-full h-28 p-2.5 rounded-lg bg-background border border-input text-xs text-foreground resize-none focus:ring-1 focus:ring-primary"
                  value={postureScreenNotes}
                  onChange={(e) => setPostureScreenNotes(e.target.value)}
                  placeholder="e.g. Mild thoracic kyphosis from computer posture. Recommend band pull-aparts and foam roller extensions before pressing."
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
            onClick={() => navigate('/fitness/fitness-assessment')}
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
            <span>{loading ? 'Recording...' : 'Save Assessment'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
