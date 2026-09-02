import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox, ISelectOption } from '../../../../shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../shared/components/ui/dialog';
import {
  ArrowLeft,
  Save,
  Clock,
  Briefcase,
  Users,
  ShieldCheck,
  Calendar,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IShift } from '../types';
import { DEFAULT_SHIFTS } from './ListPage';
import { useBranchStore } from '../../../../core/store/branchStore';
import { useDepartmentStore } from '../../../../core/store/departmentStore';
import { ALL_GYM_STAFF, IDepartmentStaffItem } from '../../departments/pages/ViewPage';

const COLOR_OPTIONS: ISelectOption[] = [
  { value: '#3B82F6', label: '🔵 Royal Blue (Morning)' },
  { value: '#10B981', label: '🟢 Emerald Green (Mid-Day)' },
  { value: '#8B5CF6', label: '🟣 Purple (Evening Peak)' },
  { value: '#F59E0B', label: '🟡 Amber (Weekend)' },
  { value: '#EC4899', label: '🌸 Pink (Studio/Spa)' },
  { value: '#6B7280', label: '⚪ Slate (Night / Operations)' },
];

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const INITIAL_SHIFT_ROSTER: Record<string, IDepartmentStaffItem[]> = {
  'SHF-MRN-01': [ALL_GYM_STAFF[0], ALL_GYM_STAFF[1], ALL_GYM_STAFF[2]],
  'SHF-REC-02': [ALL_GYM_STAFF[1], ALL_GYM_STAFF[2]],
  'SHF-MID-03': [ALL_GYM_STAFF[4], ALL_GYM_STAFF[5]],
  'SHF-EVN-04': [ALL_GYM_STAFF[3], ALL_GYM_STAFF[6]],
  'SHF-WKD-05': [ALL_GYM_STAFF[0], ALL_GYM_STAFF[6]],
};

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const { departmentOptions, loadDepartments, isLoading: loadingDepartments } = useDepartmentStore();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('14:00');
  const [breakDurationMins, setBreakDurationMins] = useState('60');
  const [departmentName, setDepartmentName] = useState('');
  const [minHeadcount, setMinHeadcount] = useState('3');
  const [color, setColor] = useState('#3B82F6');
  const [description, setDescription] = useState('');
  const [gracePeriodMins, setGracePeriodMins] = useState('15');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [branchId, setBranchId] = useState('ALL');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Staff Roster Management in Edit View
  const [assignedRoster, setAssignedRoster] = useState<IDepartmentStaffItem[]>([]);
  const [quickAddStaffId, setQuickAddStaffId] = useState<string>('');

  // Remove staff modal
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<IDepartmentStaffItem | null>(null);

  useEffect(() => {
    loadShift();
  }, [id]);

  const loadShift = async () => {
    setFetching(true);
    try {
      const fallback = DEFAULT_SHIFTS.find((s) => s.id === id || s.code === id) || DEFAULT_SHIFTS[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/shift-management/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IShift = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setName(data.name || '');
      setCode(data.code || '');
      setStartTime(data.startTime || '06:00');
      setEndTime(data.endTime || '14:00');
      setBreakDurationMins(data.breakDurationMins?.toString() || '60');
      setDepartmentName(data.departmentName || 'Fitness & PT');
      setMinHeadcount(data.minHeadcount?.toString() || '3');
      setColor(data.color || '#3B82F6');
      setDescription(data.description || '');
      setGracePeriodMins(data.gracePeriodMins?.toString() || '15');
      setOvertimeMultiplier(data.overtimeMultiplier?.toString() || '1.5');
      setBranchId(data.branchId || 'ALL');
      setSelectedDays(data.daysOfWeek || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
      setStatus(data.status || 'active');
      setAssignedRoster(INITIAL_SHIFT_ROSTER[data.id || data.code] || INITIAL_SHIFT_ROSTER['SHF-MRN-01'] || []);
    } catch {
      // Use fallback
    } finally {
      setFetching(false);
    }
  };

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
    if (diff < 0) diff += 24;
    return Math.round(diff * 10) / 10;
  };

  const handleQuickAddStaff = () => {
    if (!quickAddStaffId) {
      toast.error('Please select a staff member to assign.');
      return;
    }

    const member = ALL_GYM_STAFF.find((s) => s.id === quickAddStaffId);
    if (!member) return;

    if (assignedRoster.some((s) => s.id === member.id)) {
      toast.error(`${member.name} is already assigned.`);
      return;
    }

    setAssignedRoster([...assignedRoster, member]);
    toast.success(`${member.name} assigned to shift.`);
    setQuickAddStaffId('');
  };

  const handleConfirmRemoveStaff = () => {
    if (!staffToRemove) return;
    setAssignedRoster(assignedRoster.filter((s) => s.id !== staffToRemove.id));
    toast.success(`${staffToRemove.name} was removed from this shift.`);
    setIsRemoveModalOpen(false);
    setStaffToRemove(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IShift> = {
        name,
        code,
        departmentName,
        startTime,
        endTime,
        durationHours: calculateHours(),
        breakDurationMins: Number(breakDurationMins) || 60,
        minHeadcount: Number(minHeadcount) || 2,
        daysOfWeek: selectedDays,
        gracePeriodMins: Number(gracePeriodMins) || 15,
        overtimeMultiplier: Number(overtimeMultiplier) || 1.5,
        color,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        status,
        description,
        assignedStaffCount: assignedRoster.length,
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/shift-management/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Shift "${name}" updated successfully!`);
      navigate(`/gym-management/shift-management/${id}`);
    } catch {
      toast.error('Network error during update');
    } finally {
      setLoading(false);
    }
  };

  const availableToAssign = ALL_GYM_STAFF.filter(
    (s) => !assignedRoster.some((r) => r.id === s.id)
  );

  const quickAddSelectOptions: ISelectOption[] = [
    { value: '', label: '— Select a staff member to add to this shift —' },
    ...availableToAssign.map((s) => ({
      value: s.id,
      label: `👤 ${s.name} (${s.role} • ${s.rate})`,
    })),
  ];

  if (fetching) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Shift Configuration...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Shift Template: ${name || 'Shift'}`}
        subtitle="Modify working schedule hours, manage assigned staff, adjust grace periods, and update active days."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/gym-management/shift-management/${id}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              disabled={loading}
              onClick={handleUpdate}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleUpdate} className="space-y-6">
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

        {/* CARD 5: ASSIGNED STAFF ROSTER */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  5. Department Staff Roster ({assignedRoster.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Employees currently assigned to this shift. Add or unassign staff directly.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-64 sm:w-72">
                  <SelectBox
                    options={quickAddSelectOptions}
                    value={quickAddStaffId}
                    onChange={setQuickAddStaffId}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleQuickAddStaff}
                  disabled={!quickAddStaffId}
                  className="gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Assign Staff
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {assignedRoster.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No staff members currently assigned to this shift.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignedRoster.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between shadow-2xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={s.name}
                        className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-foreground text-xs">{s.name}</div>
                        <div className="text-[11px] text-muted-foreground">{s.role}</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">{s.rate}</div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setStaffToRemove(s);
                        setIsRemoveModalOpen(true);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/60 transition-colors"
                      title="Unassign from Shift"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/gym-management/shift-management/${id}`)}
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
            <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
          </Button>
        </div>
      </form>

      {/* CONFIRM REMOVE STAFF MODAL */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" /> Remove Staff Member
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong className="text-foreground">{staffToRemove?.name}</strong> from this shift?
            </DialogDescription>
          </DialogHeader>

          {staffToRemove && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-xs">
              <img
                src={staffToRemove.avatar}
                alt={staffToRemove.name}
                className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
              />
              <div>
                <div className="font-bold text-foreground">{staffToRemove.name}</div>
                <div className="text-muted-foreground">{staffToRemove.role} • {staffToRemove.rate}</div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRemoveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmRemoveStaff}
              className="gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Confirm Removal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
