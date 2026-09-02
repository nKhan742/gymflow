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
  Users,
  MapPin,
  Clock,
  Flame,
  Zap,
  User,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IGroupClass } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const CATEGORY_OPTIONS: ISelectOption[] = [
  { value: 'HIIT_CIRCUIT', label: '🔥 HIIT Metabolic Circuit' },
  { value: 'SPIN_CYCLING', label: '🚴 Apex Rhythm Spin & Cycling' },
  { value: 'POWER_YOGA', label: '🧘 Infrared Power Vinyasa Yoga' },
  { value: 'BOXING_BOOTCAMP', label: '🥊 Muay Thai & Boxing Bootcamp' },
  { value: 'PILATES_REFORMER', label: '✨ Allegro Pilates Reformer' },
  { value: 'OLYMPIC_LIFTING', label: '🏋️ Olympic Weightlifting Tech' },
];

const INSTRUCTOR_OPTIONS: ISelectOption[] = [
  { value: 'STF-002', label: '✨ Elena Rostova (Group Studio Lead)' },
  { value: 'STF-001', label: '🏋️ Marcus Aurelius Vance (Head PT)' },
  { value: 'STF-004', label: '🥊 Gabriel Santos (Boxing Specialist)' },
  { value: 'STF-003', label: '💪 Damon Walker (Strength Coach)' },
];

const INTENSITY_OPTIONS: ISelectOption[] = [
  { value: 'LOW', label: '🟢 Low Impact & Mobility' },
  { value: 'MEDIUM', label: '🔵 Moderate Aerobic' },
  { value: 'HIGH', label: '🟡 High-Intensity Conditioning' },
  { value: 'EXTREME', label: '🔴 Extreme Metabolic Burn' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Section 1: Class Info
  const [name, setName] = useState('');
  const [classCode, setClassCode] = useState(`CLS-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<any>('HIIT_CIRCUIT');
  const [studioRoom, setStudioRoom] = useState('Main Athletic Turf & Rogue Rig');

  // Section 2: Instructor & Capacity
  const [instructorId, setInstructorId] = useState('STF-002');
  const [durationMins, setDurationMins] = useState(45);
  const [maxCapacity, setMaxCapacity] = useState(24);

  // Section 3: Schedule & Intensity
  const [scheduleTime, setScheduleTime] = useState('Mon, Wed, Fri • 06:30 AM');
  const [intensityLevel, setIntensityLevel] = useState<any>('HIGH');
  const [caloriesBurnEstimate, setCaloriesBurnEstimate] = useState(600);
  const [description, setDescription] = useState('');
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter class title.');
      return;
    }

    setLoading(true);
    const rawLabel = INSTRUCTOR_OPTIONS.find((i) => i.value === instructorId)?.label || '';
    const selectedInstructor = (rawLabel.split(' (')[0] || '').replace('✨ ', '').replace('🏋️ ', '').replace('🥊 ', '').replace('💪 ', '') || 'Instructor';

    const newId = classCode.trim();
    const payload: IGroupClass = {
      id: newId,
      _id: newId,
      classCode: newId,
      name,
      category,
      instructorId,
      instructorName: selectedInstructor,
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      studioRoom,
      durationMins: Number(durationMins) || 45,
      maxCapacity: Number(maxCapacity) || 24,
      currentBookedCount: 0,
      caloriesBurnEstimate: Number(caloriesBurnEstimate) || 600,
      intensityLevel,
      scheduleTime,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      status: 'active',
      description,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_group_classes');
      const customList: IGroupClass[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((c) => c.id !== newId && c.classCode !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_group_classes', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/group-classes', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Group class "${name}" scheduled!`);
      navigate(`/fitness/group-classes/${newId}`);
    } catch {
      toast.error('Error saving group class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Schedule Group Class"
        subtitle="Create a new studio group fitness class format, assign lead instructors, and establish spot capacity limits."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/group-classes')}
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
              <span>{loading ? 'Scheduling...' : 'Save Class'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: CLASS IDENTITY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                1. Class Title & Studio Room
              </CardTitle>
              <CardDescription className="text-xs">Class name, format, and studio zone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Class Title *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Metabolic Blitz: HIIT Circuit"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Class Code *</label>
                  <Input
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="CLS-HIT-01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Fitness Category</label>
                  <SelectBox
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={(val) => setCategory(val as any)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Studio Room / Zone</label>
                  <Input
                    value={studioRoom}
                    onChange={(e) => setStudioRoom(e.target.value)}
                    placeholder="e.g. Cycle Theater Studio A"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: INSTRUCTOR & CAPACITY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500" />
                2. Instructor & Spot Capacity
              </CardTitle>
              <CardDescription className="text-xs">Lead instructor and room size.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Lead Instructor</label>
                <SelectBox
                  options={INSTRUCTOR_OPTIONS}
                  value={instructorId}
                  onChange={setInstructorId}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Duration (Mins)</label>
                  <Input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Max Spot Capacity</label>
                  <Input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: SCHEDULE & INTENSITY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                3. Timetable & Intensity
              </CardTitle>
              <CardDescription className="text-xs">Days, times, and expected energy burn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Weekly Schedule Slot</label>
                <Input
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  placeholder="e.g. Mon, Wed, Fri • 06:30 AM"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Intensity Level</label>
                  <SelectBox
                    options={INTENSITY_OPTIONS}
                    value={intensityLevel}
                    onChange={(val) => setIntensityLevel(val as any)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Est. Calorie Burn (kcal)</label>
                  <Input
                    type="number"
                    value={caloriesBurnEstimate}
                    onChange={(e) => setCaloriesBurnEstimate(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: BRANCH & DESCRIPTION */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                4. Location Scope & Details
              </CardTitle>
              <CardDescription className="text-xs">Facility and member overview.</CardDescription>
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
                <label className="text-xs font-semibold text-foreground">Class Description</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="High energy full body interval conditioning..."
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
            onClick={() => navigate('/fitness/group-classes')}
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
            <span>{loading ? 'Scheduling...' : 'Save Class'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
