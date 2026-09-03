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
  UserCheck,
  Calendar,
  Layers,
  Dumbbell,
  Target,
  User,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IWorkoutAssignment } from '../types';
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

const PROGRAM_TYPE_OPTIONS: ISelectOption[] = [
  { value: 'WORKOUT_PLAN', label: '📅 Multi-Week Periodized Plan' },
  { value: 'CUSTOM_TEMPLATE', label: '📑 Single-Session Workout Template' },
  { value: 'REHAB_PROTOCOL', label: '🧘 Corrective & Mobility Protocol' },
];

const PROGRAM_OPTIONS: ISelectOption[] = [
  { value: 'PLN-BLK-01', label: '💪 12-Week Pure Hypertrophy Lean Bulk' },
  { value: 'PLN-SHR-02', label: '🔥 8-Week Metabolic Shred & Recomp' },
  { value: 'PLN-PWR-03', label: '🏆 6-Week Westside Powerlifting 1RM Peak' },
  { value: 'PLN-BOX-04', label: '🥊 10-Week Golden Gloves Boxing Camp' },
  { value: 'TMP-PSH-01', label: '➡️ Push A: Hypertrophy & Chest (Template)' },
  { value: 'TMP-PUL-02', label: '⬅️ Pull A: Lat Width & Density (Template)' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);

  // Section 1: Member & Coach
  const [memberId, setMemberId] = useState('MEM-001');
  const [coachId, setCoachId] = useState('STF-001');

  // Section 2: Program
  const [programType, setProgramType] = useState<any>('WORKOUT_PLAN');
  const [programId, setProgramId] = useState('PLN-BLK-01');

  // Section 3: Dates & Target
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetEndDate, setTargetEndDate] = useState(
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [totalWorkouts, setTotalWorkouts] = useState(36);
  const [notes, setNotes] = useState('');
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
    const coachLabel = COACH_OPTIONS.find((c) => c.value === coachId)?.label || '';
    const selectedCoach = (coachLabel.split(' (')[0] || '').replace('🏋️ ', '').replace('✨ ', '').replace('💪 ', '').replace('🥊 ', '') || 'Coach';
    const programLabel = PROGRAM_OPTIONS.find((p) => p.value === programId)?.label || '';
    const selectedProgram = programLabel.replace('💪 ', '').replace('🔥 ', '').replace('🏆 ', '').replace('🥊 ', '').replace('➡️ ', '').replace('⬅️ ', '') || 'Program';

    const newId = `ASG-${Math.floor(100 + Math.random() * 900)}`;
    const payload: IWorkoutAssignment = {
      id: newId,
      _id: newId,
      assignmentCode: newId,
      memberId,
      memberName: selectedMember.split(' (')[0],
      memberEmail: `${memberId.toLowerCase()}@example.com`,
      coachId,
      coachName: selectedCoach,
      programType,
      programId,
      programTitle: selectedProgram,
      startDate,
      targetEndDate,
      completedWorkouts: 0,
      totalWorkouts: Number(totalWorkouts) || 36,
      complianceRate: 100,
      status: 'IN_PROGRESS',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      notes,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_workout_assignments');
      const customList: IWorkoutAssignment[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((a) => a.id !== newId && a.assignmentCode !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_workout_assignments', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-assignment', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Workout assigned to ${selectedMember.split(' (')[0]}!`);
      navigate(`/fitness/workout-assignment/${newId}`);
    } catch {
      toast.error('Error assigning workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Assign Workout Program"
        subtitle="Link personalized multi-week programs or single workout routines to a member with compliance milestones."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/workout-assignment')}
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
              <span>{loading ? 'Assigning...' : 'Assign Program'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: MEMBER & COACH */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                1. Member & Assigned Coach
              </CardTitle>
              <CardDescription className="text-xs">Select the target trainee and their supervising trainer.</CardDescription>
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

          {/* CARD 2: PROGRAM SELECTION */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-500" />
                2. Program & Routine Catalog
              </CardTitle>
              <CardDescription className="text-xs">Select curriculum framework.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Program Delivery Format</label>
                <SelectBox
                  options={PROGRAM_TYPE_OPTIONS}
                  value={programType}
                  onChange={(val) => setProgramType(val as any)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Workout Program</label>
                <SelectBox
                  options={PROGRAM_OPTIONS}
                  value={programId}
                  onChange={setProgramId}
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: SCHEDULE & QUOTA */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                3. Timeline & Target Quota
              </CardTitle>
              <CardDescription className="text-xs">Dates and total required workout sessions.</CardDescription>
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
                <label className="text-xs font-semibold text-foreground">Total Required Workout Sessions</label>
                <Input
                  type="number"
                  value={totalWorkouts}
                  onChange={(e) => setTotalWorkouts(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: BRANCH & COACH NOTES */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                4. Location Scope & Coach Directives
              </CardTitle>
              <CardDescription className="text-xs">Branch location and custom notes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Branch Scope</label>
                <SelectBox
                  options={branchOptions}
                  value={branchId}
                  onChange={setBranchId}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Coach Notes / Trainee Goals</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Focus on progressive overload on bench press; track daily protein intake."
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
            onClick={() => navigate('/fitness/workout-assignment')}
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
            <span>{loading ? 'Assigning...' : 'Assign Program'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
