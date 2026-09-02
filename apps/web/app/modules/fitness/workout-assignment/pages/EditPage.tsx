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
  UserCheck,
  Calendar,
  Layers,
  Target,
  RefreshCw,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IWorkoutAssignment } from '../types';
import { DEFAULT_WORKOUT_ASSIGNMENTS } from './ListPage';
import { useBranchStore } from '../../../../core/store/branchStore';

const COACH_OPTIONS: ISelectOption[] = [
  { value: 'STF-001', label: '🏋️ Marcus Aurelius Vance (Head PT)' },
  { value: 'STF-002', label: '✨ Elena Rostova (Group Studio Lead)' },
  { value: 'STF-003', label: '💪 Damon Walker (Strength Coach)' },
  { value: 'STF-004', label: '🥊 Gabriel Santos (Boxing Specialist)' },
];

const STATUS_OPTIONS: ISelectOption[] = [
  { value: 'IN_PROGRESS', label: '🔵 Active In-Progress' },
  { value: 'COMPLETED', label: '🟢 Program Completed' },
  { value: 'PAUSED', label: '⚪ Temporarily Paused' },
  { value: 'OVERDUE', label: '🔴 Overdue / Needs Attention' },
];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Member & Coach
  const [memberName, setMemberName] = useState('');
  const [coachId, setCoachId] = useState('STF-001');
  const [programTitle, setProgramTitle] = useState('');

  // Section 2: Progress & Status
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(36);
  const [complianceRate, setComplianceRate] = useState(90);
  const [status, setStatus] = useState<'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'OVERDUE'>('IN_PROGRESS');

  // Section 3: Dates & Notes
  const [startDate, setStartDate] = useState('');
  const [targetEndDate, setTargetEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadAssignmentData();
  }, [id]);

  const loadAssignmentData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_WORKOUT_ASSIGNMENTS.find((a) => a.id === id || a.assignmentCode === id) || DEFAULT_WORKOUT_ASSIGNMENTS[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-assignment/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IWorkoutAssignment = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setMemberName(data.memberName);
      setCoachId(data.coachId || 'STF-001');
      setProgramTitle(data.programTitle);
      setCompletedWorkouts(data.completedWorkouts || 0);
      setTotalWorkouts(data.totalWorkouts || 36);
      setComplianceRate(data.complianceRate || 90);
      setStatus(data.status || 'IN_PROGRESS');
      setStartDate(data.startDate || '');
      setTargetEndDate(data.targetEndDate || '');
      setNotes(data.notes || '');
      setBranchId(data.branchId || 'ALL');
    } catch {
      // Use fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const coachLabel = COACH_OPTIONS.find((c) => c.value === coachId)?.label || '';
    const selectedCoach = (coachLabel.split(' (')[0] || '').replace('🏋️ ', '').replace('✨ ', '').replace('💪 ', '').replace('🥊 ', '') || 'Coach';

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IWorkoutAssignment> = {
        coachId,
        coachName: selectedCoach,
        completedWorkouts: Number(completedWorkouts),
        totalWorkouts: Number(totalWorkouts),
        complianceRate: Number(complianceRate),
        status,
        startDate,
        targetEndDate,
        notes,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-assignment/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Workout assignment for ${memberName} updated!`);
      navigate(`/fitness/workout-assignment/${id}`);
    } catch {
      toast.error('Network error updating assignment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Assignment Data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Assignment • ${memberName}`}
        subtitle="Modify supervising coach, completed session counts, and target completion dates."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/fitness/workout-assignment/${id}`)}
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
          
          {/* CARD 1: MEMBER & PROGRAM */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                1. Member & Assigned Program
              </CardTitle>
              <CardDescription className="text-xs">Trainee and curriculum.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Member</label>
                <Input value={memberName} disabled className="bg-muted" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Assigned Program</label>
                <Input value={programTitle} disabled className="bg-muted" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Supervising Coach</label>
                <SelectBox
                  options={COACH_OPTIONS}
                  value={coachId}
                  onChange={setCoachId}
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: PROGRESS & STATUS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                2. Progress & Adherence
              </CardTitle>
              <CardDescription className="text-xs">Completed workouts and program status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Completed Sessions</label>
                  <Input
                    type="number"
                    value={completedWorkouts}
                    onChange={(e) => setCompletedWorkouts(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Quota Sessions</label>
                  <Input
                    type="number"
                    value={totalWorkouts}
                    onChange={(e) => setTotalWorkouts(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Compliance Rate (%)</label>
                  <Input
                    type="number"
                    value={complianceRate}
                    onChange={(e) => setComplianceRate(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Program Status</label>
                  <SelectBox
                    options={STATUS_OPTIONS}
                    value={status}
                    onChange={(val) => setStatus(val as any)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: SCHEDULE & NOTES */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                3. Timeline & Branch Scope
              </CardTitle>
              <CardDescription className="text-xs">Milestones and facility context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target End Date</label>
                  <Input
                    type="date"
                    value={targetEndDate}
                    onChange={(e) => setTargetEndDate(e.target.value)}
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Coach Directives & Notes</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
            onClick={() => navigate(`/fitness/workout-assignment/${id}`)}
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
