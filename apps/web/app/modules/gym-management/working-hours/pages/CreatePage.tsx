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
  Clock,
  Building2,
  Zap,
  Flame,
  Wrench,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IWorkingHourZone, IDaySchedule } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const ZONE_TYPE_OPTIONS: ISelectOption[] = [
  { value: 'MAIN_GYM', label: '🏋️ Main Athletic Gym & Free Weights' },
  { value: 'SPA_RECOVERY', label: '✨ Hydrotherapy Spa, Sauna & Cold Plunge' },
  { value: 'SWIMMING_POOL', label: '🏊 Indoor 25m Lap Pool' },
  { value: 'STUDIO_ROOM', label: '🧘 Group Fitness & Yoga Studio' },
  { value: 'SMOOTHIE_BAR', label: '🥗 Nutrition & Smoothie Bar' },
  { value: 'CHILDCARE', label: '👶 Childcare & Kids Club' },
];

const INITIAL_SCHEDULE: IDaySchedule[] = [
  { day: 'Mon', isOpen: true, openTime: '05:30', closeTime: '23:00' },
  { day: 'Tue', isOpen: true, openTime: '05:30', closeTime: '23:00' },
  { day: 'Wed', isOpen: true, openTime: '05:30', closeTime: '23:00' },
  { day: 'Thu', isOpen: true, openTime: '05:30', closeTime: '23:00' },
  { day: 'Fri', isOpen: true, openTime: '05:30', closeTime: '23:00' },
  { day: 'Sat', isOpen: true, openTime: '07:00', closeTime: '21:00' },
  { day: 'Sun', isOpen: true, openTime: '07:00', closeTime: '20:00' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Section 1: Identity & Access Mode
  const [name, setName] = useState('');
  const [code, setCode] = useState(`ZON-${Math.floor(10 + Math.random() * 90)}`);
  const [zoneType, setZoneType] = useState<'MAIN_GYM' | 'SPA_RECOVERY' | 'SWIMMING_POOL' | 'STUDIO_ROOM' | 'SMOOTHIE_BAR' | 'CHILDCARE'>('MAIN_GYM');
  const [is24x7, setIs24x7] = useState('false');
  const [description, setDescription] = useState('');

  // Section 2: Weekly Schedule
  const [schedule, setSchedule] = useState<IDaySchedule[]>(INITIAL_SCHEDULE);

  // Section 3: Peak Capacity & Maintenance
  const [peakHoursStart, setPeakHoursStart] = useState('17:30');
  const [peakHoursEnd, setPeakHoursEnd] = useState('20:30');
  const [maxCapacity, setMaxCapacity] = useState('150');
  const [maintenanceWindow, setMaintenanceWindow] = useState('Nightly 23:30 – 04:30');

  // Section 4: Facility Branch
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const updateDaySchedule = (index: number, field: keyof IDaySchedule, value: any) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error('Please enter zone name and code.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: IWorkingHourZone = {
        id: `ZON-${Math.floor(100 + Math.random() * 900)}`,
        name,
        code,
        zoneType,
        is24x7: is24x7 === 'true',
        weeklySchedule: schedule,
        peakHoursStart,
        peakHoursEnd,
        maxCapacity: Number(maxCapacity) || 150,
        maintenanceWindow: maintenanceWindow || 'Nightly sanitization',
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        status: 'active',
        description: description || 'Facility operational zone.',
      };

      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/working-hours', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Zone schedule "${name}" created successfully!`);
      navigate('/gym-management/working-hours');
    } catch {
      toast.error('Network error during zone creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Facility Zone Schedule"
        subtitle="Configure zone operational hours, 24/7 biometric access toggles, peak capacity limits, and maintenance periods."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/gym-management/working-hours')}
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
              <span>{loading ? 'Creating...' : 'Save Zone Schedule'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: IDENTITY & 24/7 ACCESS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                1. Zone Identity & Access Mode
              </CardTitle>
              <CardDescription className="text-xs">Specify zone name, area category, and 24/7 keycard access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Facility Zone Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Free Weights & Power Area"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Zone Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="ZON-PWR-02"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Zone Type</label>
                  <SelectBox
                    options={ZONE_TYPE_OPTIONS}
                    value={zoneType}
                    onChange={(val) => setZoneType(val as any)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">24/7 Biometric Access?</label>
                  <SelectBox
                    options={[
                      { value: 'false', label: '🕒 Standard Timetable Hours' },
                      { value: 'true', label: '⚡ 24/7 Keycard / Turnstile Access' },
                    ]}
                    value={is24x7}
                    onChange={setIs24x7}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Zone Description & Amenities</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Calibrated Olympic bars, deadlift platforms, chalk allowed..."
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: WEEKLY SCHEDULE */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                2. Weekly Operating Timetable
              </CardTitle>
              <CardDescription className="text-xs">Configure opening and closing times for all 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 flex-1 max-h-[290px] overflow-y-auto pr-1">
              {schedule.map((item, idx) => (
                <div key={item.day} className="flex items-center gap-2 text-xs py-1 border-b border-border/40 last:border-0">
                  <span className="w-10 font-bold uppercase text-foreground">{item.day}</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    <Input
                      type="time"
                      value={item.openTime}
                      onChange={(e) => updateDaySchedule(idx, 'openTime', e.target.value)}
                      className="h-7 text-xs font-mono"
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                      type="time"
                      value={item.closeTime}
                      onChange={(e) => updateDaySchedule(idx, 'closeTime', e.target.value)}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CARD 3: PEAK CAPACITY & MAINTENANCE */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-500" />
                3. Peak Capacity & Maintenance
              </CardTitle>
              <CardDescription className="text-xs">Define high-traffic surge hours and daily cleaning windows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Peak Rush Start</label>
                  <Input
                    type="time"
                    value={peakHoursStart}
                    onChange={(e) => setPeakHoursStart(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Peak Rush End</label>
                  <Input
                    type="time"
                    value={peakHoursEnd}
                    onChange={(e) => setPeakHoursEnd(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Max Capacity</label>
                  <Input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Sanitization & Maintenance Window</label>
                <Input
                  value={maintenanceWindow}
                  onChange={(e) => setMaintenanceWindow(e.target.value)}
                  placeholder="e.g. Nightly 23:30 – 04:30"
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: FACILITY BRANCH */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                4. Facility Branch Scope
              </CardTitle>
              <CardDescription className="text-xs">Location assignment for this zone schedule.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Facility Location</label>
                <SelectBox
                  options={branchOptions}
                  value={branchId}
                  onChange={setBranchId}
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
            onClick={() => navigate('/gym-management/working-hours')}
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
            <span>{loading ? 'Creating...' : 'Save Zone Schedule'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
