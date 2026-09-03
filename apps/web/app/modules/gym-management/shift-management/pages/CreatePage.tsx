import React, { useState, useEffect } from 'react';
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
  Briefcase,
  Users,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IShift } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';
import { useDepartmentStore } from '../../../../core/store/departmentStore';

const COLOR_OPTIONS: ISelectOption[] = [
  { value: '#3B82F6', label: '🔵 Royal Blue (Morning)' },
  { value: '#10B981', label: '🟢 Emerald Green (Mid-Day)' },
  { value: '#8B5CF6', label: '🟣 Purple (Evening Peak)' },
  { value: '#F59E0B', label: '🟡 Amber (Weekend)' },
  { value: '#EC4899', label: '🌸 Pink (Studio/Spa)' },
  { value: '#6B7280', label: '⚪ Slate (Night / Operations)' },
];

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const { departmentOptions, loadDepartments, isLoading: loadingDepartments } = useDepartmentStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  // Section 1: Shift Identity & Timing
  const [name, setName] = useState('');
  const [code, setCode] = useState(`SHF-${Math.floor(10 + Math.random() * 90)}`);
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('14:00');
  const [breakDurationMins, setBreakDurationMins] = useState('60');

  // Section 2: Department & Headcount
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    if (!departmentName && departmentOptions.length > 0) {
      setDepartmentName(departmentOptions[0].value);
    }
  }, [departmentOptions]);

  const [minHeadcount, setMinHeadcount] = useState('3');
  const [color, setColor] = useState('#3B82F6');
  const [description, setDescription] = useState('');

  // Section 3: Attendance & Overtime Rules
  const [gracePeriodMins, setGracePeriodMins] = useState('15');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');

  // Section 4: Facility Branch & Days
  const [branchId, setBranchId] = useState('ALL');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const calculateHours = () => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    let diff = (endH + endM / 60) - (startH + startM / 60);
    if (diff < 0) diff += 24; // Overnight shift
    return Math.round(diff * 10) / 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error('Please enter shift name and code.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const durationHours = calculateHours();
      const payload: IShift = {
        id: `SHF-${Math.floor(100 + Math.random() * 900)}`,
        name,
        code,
        departmentName,
        startTime,
        endTime,
        durationHours,
        breakDurationMins: Number(breakDurationMins) || 60,
        minHeadcount: Number(minHeadcount) || 2,
        daysOfWeek: selectedDays,
        gracePeriodMins: Number(gracePeriodMins) || 15,
        overtimeMultiplier: Number(overtimeMultiplier) || 1.5,
        color,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        status: 'active',
        description: description || 'Operational gym shift schedule.',
        assignedStaffCount: 0,
      };

      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/shift-management', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Shift template "${name}" created successfully!`);
      navigate('/gym-management/shift-management');
    } catch {
      toast.error('Network error during shift creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Shift Template"
        subtitle="Define recurring staff shift hours, minimum on-duty headcount quotas, grace periods, and weekly day schedules."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/gym-management/shift-management')}
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
              <span>{loading ? 'Creating...' : 'Save Shift Template'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: IDENTITY & TIMING */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                1. Shift Identity & Schedule Timing
              </CardTitle>
              <CardDescription className="text-xs">Specify shift title, unique code, start/end time, and duration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Shift Template Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Morning Prime Rush Shift"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Shift Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="SHF-MRN-01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Start Time (24h) *</label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">End Time (24h) *</label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Calculated Duration</label>
                  <div className="h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-bold text-primary flex items-center">
                    {calculateHours()} Hours
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Paid Daily Break Duration (Minutes)</label>
                <Input
                  type="number"
                  value={breakDurationMins}
                  onChange={(e) => setBreakDurationMins(e.target.value)}
                  placeholder="60"
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: DEPARTMENT & HEADCOUNT */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-500" />
                2. Department & Staffing Quotas
              </CardTitle>
              <CardDescription className="text-xs">Allocate department division, minimum on-duty staff, and color badge.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Assigned Department</label>
                <SelectBox
                  options={departmentOptions}
                  value={departmentName}
                  placeholder={loadingDepartments ? 'Loading database departments...' : departmentOptions.length === 0 ? 'No departments in DB' : 'Select Department'}
                  onChange={setDepartmentName}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Min Required On-Duty Staff *</label>
                  <Input
                    type="number"
                    value={minHeadcount}
                    onChange={(e) => setMinHeadcount(e.target.value)}
                    placeholder="3"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Shift Color Accent</label>
                  <SelectBox
                    options={COLOR_OPTIONS}
                    value={color}
                    onChange={setColor}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Shift Functional Scope & Notes</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Floor supervision, PT client bookings, sanitization sweeps..."
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: ATTENDANCE & OVERTIME */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                3. Attendance & Overtime Rules
              </CardTitle>
              <CardDescription className="text-xs">Biometric check-in grace period and overtime pay rate multipliers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Check-in Grace Period (Mins)</label>
                  <Input
                    type="number"
                    value={gracePeriodMins}
                    onChange={(e) => setGracePeriodMins(e.target.value)}
                    placeholder="15"
                  />
                  <p className="text-[11px] text-muted-foreground">Leniency before turnstile clock-in flags as late.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Overtime Pay Multiplier</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={overtimeMultiplier}
                    onChange={(e) => setOvertimeMultiplier(e.target.value)}
                    placeholder="1.5"
                  />
                  <p className="text-[11px] text-muted-foreground">Standard 1.5x hourly rate for hours beyond shift.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: BRANCH & APPLICABLE DAYS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                4. Facility Branch & Working Days
              </CardTitle>
              <CardDescription className="text-xs">Select operating location and days of the week this shift runs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Facility Branch</label>
                <SelectBox
                  options={branchOptions}
                  value={branchId}
                  onChange={setBranchId}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Active Days of Week ({selectedDays.length} Days)</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-muted/40 text-muted-foreground border-border/80 hover:bg-muted'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
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
            onClick={() => navigate('/gym-management/shift-management')}
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
            <span>{loading ? 'Creating...' : 'Save Shift Template'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
