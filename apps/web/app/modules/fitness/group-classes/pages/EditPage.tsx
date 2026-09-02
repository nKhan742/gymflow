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
  Users,
  MapPin,
  Clock,
  User,
  RefreshCw,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IGroupClass } from '../types';
import { DEFAULT_GROUP_CLASSES } from './ListPage';
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

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Class Info
  const [name, setName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [category, setCategory] = useState<any>('HIIT_CIRCUIT');
  const [studioRoom, setStudioRoom] = useState('');

  // Section 2: Instructor & Capacity
  const [instructorId, setInstructorId] = useState('STF-002');
  const [durationMins, setDurationMins] = useState(45);
  const [maxCapacity, setMaxCapacity] = useState(24);

  // Section 3: Schedule & Intensity
  const [scheduleTime, setScheduleTime] = useState('');
  const [intensityLevel, setIntensityLevel] = useState<any>('HIGH');
  const [caloriesBurnEstimate, setCaloriesBurnEstimate] = useState(600);
  const [description, setDescription] = useState('');
  const [branchId, setBranchId] = useState('ALL');
  const [status, setStatus] = useState<'active' | 'cancelled' | 'archived'>('active');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadClassData();
  }, [id]);

  const loadClassData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_GROUP_CLASSES.find((c) => c.id === id || c.classCode === id) || DEFAULT_GROUP_CLASSES[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/group-classes/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IGroupClass = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setName(data.name);
      setClassCode(data.classCode);
      setCategory(data.category);
      setStudioRoom(data.studioRoom);
      setInstructorId(data.instructorId || 'STF-002');
      setDurationMins(data.durationMins || 45);
      setMaxCapacity(data.maxCapacity || 24);
      setScheduleTime(data.scheduleTime || '');
      setIntensityLevel(data.intensityLevel || 'HIGH');
      setCaloriesBurnEstimate(data.caloriesBurnEstimate || 600);
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
    setSaving(true);
    const rawLabel = INSTRUCTOR_OPTIONS.find((i) => i.value === instructorId)?.label || '';
    const selectedInstructor = (rawLabel.split(' (')[0] || '').replace('✨ ', '').replace('🏋️ ', '').replace('🥊 ', '').replace('💪 ', '') || 'Instructor';

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IGroupClass> = {
        name,
        classCode,
        category,
        studioRoom,
        instructorId,
        instructorName: selectedInstructor,
        durationMins: Number(durationMins),
        maxCapacity: Number(maxCapacity),
        scheduleTime,
        intensityLevel,
        caloriesBurnEstimate: Number(caloriesBurnEstimate),
        status,
        description,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/group-classes/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Group class "${name}" updated!`);
      navigate(`/fitness/group-classes/${id}`);
    } catch {
      toast.error('Network error updating class');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Class Data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Class • ${name}`}
        subtitle="Modify studio schedule, instructor assignments, and room capacities."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/fitness/group-classes/${id}`)}
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
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Class Code *</label>
                  <Input
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
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
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <SelectBox
                    options={[
                      { value: 'active', label: '🟢 Active' },
                      { value: 'cancelled', label: '🔴 Cancelled' },
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

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/fitness/group-classes/${id}`)}
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
