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
  Briefcase,
  Edit2,
  Users,
  DollarSign,
  Clock,
  ArrowLeft,
  RefreshCw,
  Star,
  Target,
  UserCheck,
  Plus,
  Trash2,
  AlertTriangle,
  User,
  CheckCircle2,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IDepartment } from '../types';
import { DEFAULT_DEPARTMENTS } from './ListPage';

export interface IDepartmentStaffItem {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  shift: string;
  rate: string;
  rating: number;
  avatar: string;
}

export const ALL_GYM_STAFF: IDepartmentStaffItem[] = [];

const INITIAL_ROSTERS: Record<string, IDepartmentStaffItem[]> = {};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [department, setDepartment] = useState<IDepartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [staffRoster, setStaffRoster] = useState<IDepartmentStaffItem[]>([]);

  // Assign Staff Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignedShift, setAssignedShift] = useState('Morning');

  // Remove Staff Modal State
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<IDepartmentStaffItem | null>(null);

  useEffect(() => {
    loadDepartmentData();
  }, [id]);

  const loadDepartmentData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_DEPARTMENTS.find((d) => d.id === id || d.code === id) || DEFAULT_DEPARTMENTS[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/departments/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDepartment(json.data);
          setStaffRoster(INITIAL_ROSTERS[json.data.id || json.data.code] || INITIAL_ROSTERS['DEP-FIT-01'] || []);
          setLoading(false);
          return;
        }
      }
      setDepartment(fallback);
      setStaffRoster(INITIAL_ROSTERS[fallback.id || fallback.code] || INITIAL_ROSTERS['DEP-FIT-01'] || []);
    } catch {
      const fallback = DEFAULT_DEPARTMENTS.find((d) => d.id === id || d.code === id) || DEFAULT_DEPARTMENTS[0];
      setDepartment(fallback);
      setStaffRoster(INITIAL_ROSTERS[fallback.id || fallback.code] || INITIAL_ROSTERS['DEP-FIT-01'] || []);
    } finally {
      setLoading(false);
    }
  };

  // Assign staff handler
  const handleAssignStaffSubmit = () => {
    if (!selectedStaffId) {
      toast.error('Please select a staff member to assign.');
      return;
    }

    const member = ALL_GYM_STAFF.find((s) => s.id === selectedStaffId);
    if (!member) return;

    if (staffRoster.some((s) => s.id === member.id)) {
      toast.error(`${member.name} is already assigned to this department.`);
      return;
    }

    const updated = [...staffRoster, { ...member, shift: assignedShift }];
    setStaffRoster(updated);
    if (department) {
      setDepartment({ ...department, headcount: updated.length });
    }

    toast.success(`${member.name} has been assigned to ${department?.name || 'the department'}!`);
    setIsAssignModalOpen(false);
    setSelectedStaffId('');
  };

  // Remove staff handler
  const handleConfirmRemoveStaff = () => {
    if (!staffToRemove) return;

    const updated = staffRoster.filter((s) => s.id !== staffToRemove.id);
    setStaffRoster(updated);
    if (department) {
      setDepartment({ ...department, headcount: updated.length });
    }

    toast.success(`${staffToRemove.name} was removed from this department.`);
    setIsRemoveModalOpen(false);
    setStaffToRemove(null);
  };

  if (loading || !department) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Department Telemetry...</div>
        </div>
      </PageContainer>
    );
  }

  const budgetUtilization = Math.round(((department.actualSpend || 1) / (department.monthlyBudget || 1)) * 100);

  // Filter staff options to those not yet assigned
  const availableStaffToAssign = ALL_GYM_STAFF.filter(
    (s) => !staffRoster.some((r) => r.id === s.id)
  );

  const staffSelectOptions: ISelectOption[] = [
    { value: '', label: '— Select a staff member to assign —' },
    ...availableStaffToAssign.map((s) => ({
      value: s.id,
      label: `👤 ${s.name} (${s.role} • ${s.rate})`,
    })),
  ];

  const selectedMemberPreview = ALL_GYM_STAFF.find((s) => s.id === selectedStaffId);

  return (
    <PageContainer>
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gym-management/departments')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Departments</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {department.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({department.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">{department.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/gym-management/departments/${department.id || department._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Department</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{department.name}</h2>
                  <Badge variant={department.revenueGenerating ? 'success' : 'secondary'} className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {department.revenueGenerating ? '💰 Revenue Center' : '⚙️ Operations Center'}
                  </Badge>
                  <span className="text-[11px] sm:text-xs font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted shrink-0">
                    {department.glCode || 'GL-6100'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Category: <strong className="text-foreground">{department.category}</strong></span>
                  <span>•</span>
                  <span>Scope: <strong className="text-foreground">{department.branchName || 'All Locations'}</strong></span>
                </div>
              </div>
            </div>

            {/* Department Lead Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              {department.headOfDepartment?.avatar ? (
                <img
                  src={department.headOfDepartment.avatar}
                  alt={department.headOfDepartment.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Department Head</div>
                <div className="text-xs font-bold text-foreground truncate">{department.headOfDepartment?.name || 'Unassigned'}</div>
                <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate">{department.headOfDepartment?.email || 'No leader assigned'}</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Assigned Headcount</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{staffRoster.length} Staff</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Monthly Budget</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">${department.monthlyBudget?.toLocaleString()}/mo</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Actual MTD Spend</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">${department.actualSpend?.toLocaleString()}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Budget Utilization</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono">{budgetUtilization}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="staff" className="text-xs font-semibold gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" /> Staff Roster ({staffRoster.length})
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-xs font-semibold gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Budget & Cost Center
          </TabsTrigger>
          <TabsTrigger value="shifts" className="text-xs font-semibold gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Weekly Shift Coverage
          </TabsTrigger>
          <TabsTrigger value="kpis" className="text-xs font-semibold gap-1.5">
            <Target className="w-3.5 h-3.5 text-pink-500" /> Performance Goals & KPIs
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
                  Active staff members allocated to the {department.name} division.
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
              {staffRoster.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                  <User className="w-8 h-8 mx-auto opacity-40" />
                  <p>No staff members assigned to this department yet.</p>
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
                <div className="space-y-2.5">
                  {staffRoster.filter(Boolean).map((s) => (
                    <div
                      key={s.id || s.name}
                      className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between hover:border-primary/40 transition-all shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={s?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={s?.name || 'Staff'}
                          className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-foreground text-xs">{s.name}</div>
                          <div className="text-[11px] text-muted-foreground">{s.role} • {s.shift} Shift</div>
                          <div className="text-[11px] text-muted-foreground">{s.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{s.rate}</div>
                          <div className="text-[10px] text-amber-500 font-semibold flex items-center justify-end gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500" /> {s.rating}
                          </div>
                        </div>
                        
                        {/* Delete / Remove Button */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setStaffToRemove(s);
                            setIsRemoveModalOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/60 transition-colors"
                          title="Remove from Department"
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

        {/* TAB 2: BUDGET & COST CENTER */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Operating Budget Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-xs text-muted-foreground">Staff Salaries & Commissions</span>
                  <div className="text-xl font-bold text-foreground font-mono">
                    ${Math.round((department.monthlyBudget || 25000) * 0.75).toLocaleString()}/mo
                  </div>
                  <span className="text-[10px] text-muted-foreground">75% of budget</span>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-xs text-muted-foreground">Equipment, Supplies & Software</span>
                  <div className="text-xl font-bold text-foreground font-mono">
                    ${Math.round((department.monthlyBudget || 25000) * 0.25).toLocaleString()}/mo
                  </div>
                  <span className="text-[10px] text-muted-foreground">25% of budget</span>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-xs text-muted-foreground">Cost Center GL Account</span>
                  <div className="text-xl font-bold text-primary font-mono">{department.glCode}</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Verified in Ledger</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: SHIFT COVERAGE */}
        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Required Shift Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {department.shifts?.map((shift, i) => (
                  <div key={i} className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{shift} Shift</span>
                      <Badge variant="outline" className="text-[10px]">Staffed</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {shift === 'Morning' ? '05:30 AM – 01:30 PM' : shift === 'Evening' ? '01:30 PM – 09:30 PM' : '09:00 AM – 05:00 PM'}
                    </p>
                    <div className="text-[11px] text-primary font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Full Shift Coverage
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: KPIS & GOALS */}
        <TabsContent value="kpis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-500" /> Department Operational Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Member CSAT Score</span>
                  <div className="text-2xl font-bold text-foreground font-mono">4.96 / 5.0</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">★ Top 5% Satisfaction</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Shift Punctuality & Clock-in</span>
                  <div className="text-2xl font-bold text-foreground font-mono">99.2%</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Biometric Turnstile Verified</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Monthly Budget SLA</span>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">On Target</div>
                  <span className="text-[10px] text-muted-foreground">{budgetUtilization}% of monthly cap</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ========================================================================= */}
      {/* MODAL 1: ASSIGN EXISTING STAFF TO DEPARTMENT */}
      {/* ========================================================================= */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" /> Assign Staff to {department.name}
            </DialogTitle>
            <DialogDescription>
              Select an existing staff member from your employee roster to assign to this department.
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Shift Assignment</label>
              <SelectBox
                options={[
                  { value: 'Morning', label: '🌅 Morning Shift (05:30 AM – 01:30 PM)' },
                  { value: 'Evening', label: '🌆 Evening Shift (01:30 PM – 09:30 PM)' },
                  { value: 'Night', label: '🌙 Night Shift (09:30 PM – 05:30 AM)' },
                  { value: 'Flexible', label: '🔄 Flexible / On-Call' },
                ]}
                value={assignedShift}
                onChange={setAssignedShift}
              />
            </div>

            {/* Selected staff preview */}
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
              <UserCheck className="w-4 h-4" /> Assign to Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM REMOVE STAFF FROM DEPARTMENT */}
      {/* ========================================================================= */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" /> Remove Staff Member
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong className="text-foreground">{staffToRemove?.name}</strong> ({staffToRemove?.role}) from the <strong className="text-foreground">{department.name}</strong> department?
            </DialogDescription>
          </DialogHeader>

          {staffToRemove && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-xs">
              <img
                src={staffToRemove.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={staffToRemove.name || 'Staff'}
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
