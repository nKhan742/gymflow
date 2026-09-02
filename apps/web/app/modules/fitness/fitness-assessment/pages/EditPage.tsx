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
  HeartPulse,
  Scale,
  Trophy,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IFitnessAssessment } from '../types';
import { DEFAULT_ASSESSMENTS } from './ListPage';
import { useBranchStore } from '../../../../core/store/branchStore';

const COACH_OPTIONS: ISelectOption[] = [
  { value: 'STF-001', label: '🏋️ Marcus Aurelius Vance (Head PT)' },
  { value: 'STF-002', label: '✨ Elena Rostova (Group Studio Lead)' },
  { value: 'STF-003', label: '💪 Damon Walker (Strength Coach)' },
  { value: 'STF-004', label: '🥊 Gabriel Santos (Boxing Specialist)' },
];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Member & Assessor
  const [memberName, setMemberName] = useState('');
  const [assessorCoachId, setAssessorCoachId] = useState('STF-001');
  const [assessmentDate, setAssessmentDate] = useState('');

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
  const [status, setStatus] = useState<'COMPLETED' | 'PENDING_REVIEW' | 'FLAGGED'>('COMPLETED');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadAssessmentData();
  }, [id]);

  const loadAssessmentData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_ASSESSMENTS.find((a) => a.id === id || a.assessmentCode === id) || DEFAULT_ASSESSMENTS[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/fitness-assessment/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IFitnessAssessment = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setMemberName(data.memberName);
      setAssessorCoachId(data.assessorCoachId || 'STF-001');
      setAssessmentDate(data.assessmentDate || '');
      setWeightKg(data.weightKg || 70.0);
      setBodyFatPercentage(data.bodyFatPercentage || 16.5);
      setSkeletalMuscleMassKg(data.skeletalMuscleMassKg || 33.0);
      setVisceralFatScore(data.visceralFatScore || 3);
      setBenchPress1RMKg(data.benchPress1RMKg || 85);
      setSquat1RMKg(data.squat1RMKg || 120);
      setDeadlift1RMKg(data.deadlift1RMKg || 150);
      setVo2MaxScore(data.vo2MaxScore || 48);
      setPostureScreenNotes(data.postureScreenNotes || '');
      setBranchId(data.branchId || 'ALL');
      setStatus(data.status || 'COMPLETED');
    } catch {
      // Use fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const coachLabel = COACH_OPTIONS.find((c) => c.value === assessorCoachId)?.label || '';
    const selectedCoach = (coachLabel.split(' (')[0] || '').replace('🏋️ ', '').replace('✨ ', '').replace('💪 ', '').replace('🥊 ', '') || 'Coach';

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IFitnessAssessment> = {
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
        status,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/fitness-assessment/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Assessment for ${memberName} updated!`);
      navigate(`/fitness/fitness-assessment/${id}`);
    } catch {
      toast.error('Network error updating assessment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Assessment Data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Assessment • ${memberName}`}
        subtitle="Modify body composition measurements, 1RM tests, and mobility screening notes."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/fitness/fitness-assessment/${id}`)}
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
          
          {/* CARD 1: MEMBER & ASSESSOR */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-primary" />
                1. Member & Screening Date
              </CardTitle>
              <CardDescription className="text-xs">Member name and supervising assessor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Member</label>
                <Input value={memberName} disabled className="bg-muted" />
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
                3. Big 3 1RM Strength & Status
              </CardTitle>
              <CardDescription className="text-xs">Power benchmarks and verification status.</CardDescription>
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
                      { value: 'COMPLETED', label: '🟢 Completed & Verified' },
                      { value: 'PENDING_REVIEW', label: '🟡 Pending Review' },
                      { value: 'FLAGGED', label: '🔴 Flagged for Retest' },
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val as any)}
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
            onClick={() => navigate(`/fitness/fitness-assessment/${id}`)}
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
