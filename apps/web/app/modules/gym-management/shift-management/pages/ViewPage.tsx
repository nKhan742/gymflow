import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../shared/components/ui/dialog';
import { SelectBox, ISelectOption } from '../../../../shared/components/ui/select';
import {
  Clock,
  Edit2,
  Users,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Star,
  Plus,
  Trash2,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Timer,
  Fingerprint,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IShift } from '../types';
import { ALL_GYM_STAFF, IDepartmentStaffItem } from '../../departments/pages/ViewPage';

const INITIAL_SHIFT_ROSTER: Record<string, IDepartmentStaffItem[]> = {
  'SHF-MRN-01': [ALL_GYM_STAFF[0], ALL_GYM_STAFF[1], ALL_GYM_STAFF[2]],
  'SHF-REC-02': [ALL_GYM_STAFF[1], ALL_GYM_STAFF[2]],
  'SHF-MID-03': [ALL_GYM_STAFF[4], ALL_GYM_STAFF[5]],
  'SHF-EVN-04': [ALL_GYM_STAFF[3], ALL_GYM_STAFF[6]],
  'SHF-PWR-05': [ALL_GYM_STAFF[0], ALL_GYM_STAFF[3]],
  'SHF-BOX-06': [ALL_GYM_STAFF[6], ALL_GYM_STAFF[2]],
  'SHF-WKD-07': [ALL_GYM_STAFF[0], ALL_GYM_STAFF[5]],
  'SHF-NTE-08': [ALL_GYM_STAFF[1], ALL_GYM_STAFF[3]],
};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shift, setShift] = useState<IShift | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignedStaff, setAssignedStaff] = useState<IDepartmentStaffItem[]>([]);

  // Assign Staff Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Remove Staff Modal
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<IDepartmentStaffItem | null>(null);

  useEffect(() => {
    loadShiftData();
  }, [id]);

  const loadShiftData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      let shiftData: IShift | null = null;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/shifts/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        shiftData = json.data;
      }

      if (!shiftData) {
        const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/shifts', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (listRes.ok) {
          const listJson = await listRes.json();
          const items = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
          shiftData = items.find((s: any) => (s.id || s._id) === id || s.code === id) || null;
        }
      }

      setShift(shiftData);

      // Load assigned staff from real staff API
      if (shiftData) {
        const staffRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (staffRes.ok) {
          const staffJson = await staffRes.json();
          const staffItems = staffJson.data?.items || (Array.isArray(staffJson.data) ? staffJson.data : []);
          const matched = staffItems.filter((s: any) =>
            s.shiftId === id ||
            s.shift === shiftData?.name ||
            s.shift === shiftData?.code
          );
          setAssignedStaff(matched.map((s: any) => ({
            id: s.id || s._id,
            name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim(),
            role: s.role || 'Staff',
            email: s.email || '',
            phone: s.phone || '',
            shift: shiftData?.name || 'General',
            rate: `$${s.hourlyRate || 45}/hr`,
            rating: 5.0,
            avatar: s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          })));
        }
      }
    } catch {
      setShift(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStaffSubmit = () => {
    if (!selectedStaffId) {
      toast.error('Please select a staff member to assign.');
      return;
    }

    const member = ALL_GYM_STAFF.find((s) => s.id === selectedStaffId);
    if (!member) return;

    if (assignedStaff.some((s) => s.id === member.id)) {
      toast.error(`${member.name} is already assigned to this shift.`);
      return;
    }

    const updated = [...assignedStaff, member];
    setAssignedStaff(updated);
    toast.success(`${member.name} has been assigned to ${shift?.name || 'the shift'}!`);
    setIsAssignModalOpen(false);
    setSelectedStaffId('');
  };

  const handleConfirmRemoveStaff = () => {
    if (!staffToRemove) return;
    setAssignedStaff(assignedStaff.filter((s) => s.id !== staffToRemove.id));
    toast.success(`${staffToRemove.name} was removed from this shift.`);
    setIsRemoveModalOpen(false);
    setStaffToRemove(null);
  };

  if (loading || !shift) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Shift Telemetry...</div>
        </div>
      </PageContainer>
    );
  }

  const availableStaff = ALL_GYM_STAFF.filter(
    (s) => !assignedStaff.some((r) => r.id === s.id)
  );

  const staffSelectOptions: ISelectOption[] = [
    { value: '', label: '— Select a staff member to assign —' },
    ...availableStaff.map((s) => ({
      value: s.id,
      label: `👤 ${s.name} (${s.role} • ${s.rate})`,
    })),
  ];

  const selectedMemberPreview = ALL_GYM_STAFF.find((s) => s.id === selectedStaffId);

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gym-management/shift-management')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Shift Templates</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {shift.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({shift.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">{shift.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/gym-management/shift-management/${shift.id || shift._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Shift Template</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: shift.color || '#3B82F6' }}
              >
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{shift.name}</h2>
                  <Badge variant={shift.status === 'active' ? 'success' : 'secondary'} className="capitalize text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {shift.status}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {shift.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Department: <strong className="text-foreground">{shift.departmentName || 'All Departments'}</strong></span>
                  <span>•</span>
                  <span>Hours: <strong className="text-foreground font-mono">{shift.startTime} – {shift.endTime} ({shift.durationHours}h)</strong></span>
                  <span>•</span>
                  <span>Break: <strong className="text-foreground">{shift.breakDurationMins || 60} mins</strong></span>
                </div>
              </div>
            </div>

            {/* Shift Rules Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 sm:gap-4 shrink-0 self-start md:self-auto">
              <div className="space-y-0.5">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Grace Period</div>
                <div className="text-xs font-bold text-foreground font-mono">{shift.gracePeriodMins || 15} Mins Leniency</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="space-y-0.5">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Overtime Multiplier</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{shift.overtimeMultiplier || 1.5}x Pay</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Assigned Workforce</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{assignedStaff.length} Staff</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Min Headcount Quota</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{shift.minHeadcount} Staff On-Duty</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Operating Days</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{shift.daysOfWeek?.length || 5} Days / Wk</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Staffing Health</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
                {assignedStaff.length >= shift.minHeadcount ? '100% Staffed' : 'Under Quota'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="staff" className="text-xs font-semibold gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" /> Staff Roster ({assignedStaff.length})
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-xs font-semibold gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" /> Weekly Day Schedule
          </TabsTrigger>
          <TabsTrigger value="biometrics" className="text-xs font-semibold gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-600" /> Turnstile Attendance Logs
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: STAFF ROSTER */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Department Staff Roster
                </CardTitle>
                <CardDescription className="text-xs">
                  Employees and coaches assigned to the {shift.name} shift.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="gap-1.5 shadow-sm text-xs"
                onClick={() => setIsAssignModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5" /> Assign Staff
              </Button>
            </CardHeader>
            <CardContent>
              {assignedStaff.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                  <Users className="w-8 h-8 mx-auto opacity-40" />
                  <p>No staff members assigned to this shift yet.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Assign First Staff Member
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assignedStaff.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between hover:border-primary/40 transition-all shadow-2xs group"
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

                      <div className="flex items-center gap-3">
                        <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500" /> {s.rating}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setStaffToRemove(s);
                            setIsRemoveModalOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/60 transition-colors"
                          title="Remove from Shift"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: WEEKLY SCHEDULE */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" /> Weekly Operating Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isActive = shift.daysOfWeek?.includes(day);
                  return (
                    <div
                      key={day}
                      className={`p-4 rounded-xl border text-center space-y-1.5 ${
                        isActive
                          ? 'bg-primary/5 border-primary/30 text-foreground'
                          : 'bg-muted/20 border-border/40 text-muted-foreground opacity-50'
                      }`}
                    >
                      <div className="text-xs font-bold uppercase">{day}</div>
                      <div className="font-mono text-[11px]">
                        {isActive ? `${shift.startTime} – ${shift.endTime}` : 'Off Day'}
                      </div>
                      <Badge variant={isActive ? 'default' : 'outline'} className="text-[9px] px-1.5 py-0">
                        {isActive ? 'Active' : 'No Shift'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: BIOMETRIC LOGS */}
        <TabsContent value="biometrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Turnstile Clock-In Telemetry & Punctuality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">On-Time Clock-in Rate</span>
                  <div className="text-2xl font-bold text-foreground font-mono">99.4%</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Within 15m Grace Period</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Average Clock-In Time</span>
                  <div className="text-2xl font-bold text-primary font-mono">{shift.startTime} (05m early)</div>
                  <span className="text-[10px] text-muted-foreground">Main Entrance Turnstiles</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Biometric Verification</span>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">100% Verified</div>
                  <span className="text-[10px] text-muted-foreground">RFID / Facial Rec Sync</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: ASSIGN STAFF */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Assign Staff to {shift.name}
            </DialogTitle>
            <DialogDescription>
              Select an existing employee or coach from your roster to assign to this shift schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Staff Member *</label>
              <SelectBox
                options={staffSelectOptions}
                value={selectedStaffId}
                onChange={setSelectedStaffId}
              />
            </div>

            {selectedMemberPreview && (
              <div className="p-3 rounded-xl bg-muted/50 border border-border/80 flex items-center gap-3">
                <img
                  src={selectedMemberPreview.avatar}
                  alt={selectedMemberPreview.name}
                  className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-foreground">{selectedMemberPreview.name}</div>
                  <div className="text-muted-foreground">{selectedMemberPreview.role} • {selectedMemberPreview.rate}</div>
                  <div className="text-muted-foreground text-[11px]">{selectedMemberPreview.email}</div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAssignStaffSubmit}
              disabled={!selectedStaffId}
              className="gap-1.5"
            >
              <Users className="w-4 h-4" /> Assign to Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: REMOVE STAFF */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" /> Remove Staff Member
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong className="text-foreground">{staffToRemove?.name}</strong> from the <strong className="text-foreground">{shift.name}</strong> shift?
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
