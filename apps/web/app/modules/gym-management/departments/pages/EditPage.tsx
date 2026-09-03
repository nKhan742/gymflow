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
  Briefcase,
  User,
  DollarSign,
  Clock,
  RefreshCw,
  UserCheck,
  Users,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IDepartment } from '../types';
import { DEFAULT_DEPARTMENTS } from './ListPage';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ALL_GYM_STAFF, IDepartmentStaffItem } from './ViewPage';

const CATEGORY_OPTIONS: ISelectOption[] = [
  { value: 'FITNESS', label: '🏋️ Fitness & Personal Training' },
  { value: 'RECEPTION', label: '🤝 Front Desk & Guest Relations' },
  { value: 'CLEANING', label: '🧹 Cleaning & Facility Housekeeping' },
  { value: 'STUDIO', label: '🧘 Group Fitness & Studio Programming' },
  { value: 'WELLNESS', label: '🥗 Nutrition & Recovery Spa' },
  { value: 'OPERATIONS', label: '🔧 Facility Operations & Maintenance' },
  { value: 'SALES', label: '📈 Sales & Corporate Memberships' },
  { value: 'MANAGEMENT', label: '💼 Executive Management' },
  { value: 'CUSTOM', label: '✏️ Type Own Custom Category...' },
];

const ICON_OPTIONS: ISelectOption[] = [
  { value: 'Dumbbell', label: '🏋️ Dumbbell / Fitness' },
  { value: 'HeartHandshake', label: '🤝 Handshake / Reception' },
  { value: 'Sparkles', label: '✨ Sparkles / Studio' },
  { value: 'Utensils', label: '🥗 Utensils / Nutrition' },
  { value: 'Wrench', label: '🔧 Wrench / Maintenance' },
  { value: 'TrendingUp', label: '📈 Trending / Sales' },
];

const INITIAL_ROSTERS: Record<string, IDepartmentStaffItem[]> = {};

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Section 1: Department Identity
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('FITNESS');
  const [customCategory, setCustomCategory] = useState('');
  const [icon, setIcon] = useState('Dumbbell');
  const [description, setDescription] = useState('');

  // Section 2: Department Leadership (Optional)
  const [staffList, setStaffList] = useState<IDepartmentStaffItem[]>(ALL_GYM_STAFF);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('');
  const [headName, setHeadName] = useState('');
  const [headEmail, setHeadEmail] = useState('');
  const [headPhone, setHeadPhone] = useState('');
  const [headAvatar, setHeadAvatar] = useState('');

  // Section 3: Financials & Budget
  const [monthlyBudget, setMonthlyBudget] = useState('25000');
  const [glCode, setGlCode] = useState('GL-6100');
  const [revenueGenerating, setRevenueGenerating] = useState('true');

  // Section 4: Facility Branch & Shifts
  const [branchId, setBranchId] = useState('ALL');
  const [shiftsInput, setShiftsInput] = useState('');

  // Section 5: Assigned Staff Roster in Edit Page
  const [assignedRoster, setAssignedRoster] = useState<IDepartmentStaffItem[]>([]);
  const [quickAddStaffId, setQuickAddStaffId] = useState<string>('');

  // Remove staff confirmation modal
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<IDepartmentStaffItem | null>(null);

  useEffect(() => {
    loadDepartmentAndStaff();
  }, [id]);

  const loadDepartmentAndStaff = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      // Load staff list
      try {
        const staffRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (staffRes.ok) {
          const staffJson = await staffRes.json();
          const items = staffJson.data?.items || (Array.isArray(staffJson.data) ? staffJson.data : []);
          if (items.length > 0) {
            setStaffList(items);
          }
        }
      } catch {
        // Continue
      }

      // Load department
      let data: any = null;
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/departments/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        data = json.data;
      }

      if (!data) {
        const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/departments', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (listRes.ok) {
          const listJson = await listRes.json();
          const items = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
          data = items.find((d: any) => (d.id || d._id) === id || d.code === id);
        }
      }

      if (!data) {
        setFetching(false);
        return;
      }

      setName(data.name || '');
      setCode(data.code || '');
      const isKnown = ['FITNESS', 'RECEPTION', 'CLEANING', 'STUDIO', 'WELLNESS', 'OPERATIONS', 'SALES', 'MANAGEMENT'].includes(data.category);
      if (isKnown) {
        setCategory(data.category);
        setCustomCategory('');
      } else {
        setCategory('CUSTOM');
        setCustomCategory(data.category || '');
      }
      setIcon(data.icon || 'Dumbbell');
      setDescription(data.description || '');

      if (data.headOfDepartment) {
        setHeadName(data.headOfDepartment.name || '');
        setHeadEmail(data.headOfDepartment.email || '');
        setHeadPhone(data.headOfDepartment.phone || '');
        setHeadAvatar(data.headOfDepartment.avatar || '');
        
        const matched = staffList.find((s) => s.name === data.headOfDepartment?.name);
        if (matched) setSelectedLeaderId(matched.id);
      }

      setMonthlyBudget(data.monthlyBudget?.toString() || '25000');
      setGlCode(data.glCode || 'GL-6100');
      setRevenueGenerating(data.revenueGenerating ? 'true' : 'false');
      setBranchId(data.branchId || 'ALL');
      setShiftsInput(data.shifts ? data.shifts.join(', ') : 'Morning, Evening');
      setAssignedRoster(INITIAL_ROSTERS[data.id || data.code] || []);
    } catch {
      // Use fallback
    } finally {
      setFetching(false);
    }
  };

  const handleLeaderSelect = (staffId: string) => {
    setSelectedLeaderId(staffId);
    if (!staffId) {
      setHeadName('');
      setHeadEmail('');
      setHeadPhone('');
      setHeadAvatar('');
      return;
    }

    const member = staffList.find((s) => s.id === staffId);
    if (member) {
      setHeadName(member.name);
      setHeadEmail(member.email);
      setHeadPhone(member.phone);
      setHeadAvatar(member.avatar || '');
    }
  };

  // Quick assign staff to roster in edit page
  const handleQuickAddStaff = () => {
    if (!quickAddStaffId) {
      toast.error('Please select a staff member to assign.');
      return;
    }

    const member = staffList.find((s) => s.id === quickAddStaffId);
    if (!member) return;

    if (assignedRoster.some((s) => s?.id === member.id)) {
      toast.error(`${member.name} is already assigned.`);
      return;
    }

    setAssignedRoster([...assignedRoster, member]);
    toast.success(`${member.name} added to ${name || 'the department'} roster.`);
    setQuickAddStaffId('');
  };

  // Remove staff from roster in edit page
  const handleConfirmRemoveStaff = () => {
    if (!staffToRemove) return;
    setAssignedRoster(assignedRoster.filter((s) => s?.id !== staffToRemove.id));
    toast.success(`${staffToRemove.name} was removed from this department.`);
    setIsRemoveModalOpen(false);
    setStaffToRemove(null);
  };

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const leaderSelectOptions: ISelectOption[] = [
    { value: '', label: '— Unassigned (Assign Leadership Later) —' },
    ...staffList.filter(Boolean).map((s) => ({
      value: s.id,
      label: `👤 ${s.name} (${s.role})`,
    })),
  ];

  // Available staff for quick assignment dropdown
  const availableToAssign = staffList.filter(
    (s) => s && !assignedRoster.some((r) => r && r.id === s.id)
  );

  const quickAddSelectOptions: ISelectOption[] = [
    { value: '', label: '— Select a staff member to add to this department —' },
    ...availableToAssign.map((s) => ({
      value: s.id,
      label: `👤 ${s.name} (${s.role} • ${s.rate})`,
    })),
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const finalCategory = category === 'CUSTOM' ? (customCategory.trim() || 'Custom') : category;
      const payload: Partial<IDepartment> = {
        name,
        code,
        category: finalCategory,
        icon,
        description,
        headOfDepartment: {
          name: headName || 'Unassigned',
          email: headEmail || '',
          phone: headPhone || '',
          avatar: headAvatar || '',
        },
        headcount: assignedRoster.length,
        monthlyBudget: Number(monthlyBudget) || 25000,
        actualSpend: Math.round(Number(monthlyBudget) * 0.85),
        revenueGenerating: revenueGenerating === 'true',
        glCode,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        shifts: shiftsInput.split(',').map((s) => s.trim()).filter(Boolean),
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/departments/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Department "${name}" updated successfully!`);
      navigate(`/gym-management/departments/${id}`);
    } catch {
      toast.error('Network error during update');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Department Configuration...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Department: ${name || 'Division'}`}
        subtitle="Modify leadership assignments, manage the assigned staff roster, and adjust monthly operating budgets."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/gym-management/departments/${id}`)}
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
        {/* 2-Cards per Row Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: IDENTITY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                1. Department Identity & Scope
              </CardTitle>
              <CardDescription className="text-xs">Specify department name, unique division code, category, and icon.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Department Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Strength & Conditioning Division"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Department Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="DEP-STR-07"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Division Category</label>
                  <SelectBox
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={(val) => {
                      setCategory(val);
                      if (val !== 'CUSTOM') setCustomCategory('');
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Display Icon</label>
                  <SelectBox
                    options={ICON_OPTIONS}
                    value={icon}
                    onChange={setIcon}
                  />
                </div>
              </div>

              {category === 'CUSTOM' && (
                <div className="space-y-1.5 p-3 rounded-lg border border-primary/30 bg-primary/5">
                  <label className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <span>✏️ Type Custom Category Name *</span>
                  </label>
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Sanitation & Hygiene, Swimming & Aquatics, Nutrition & Cafe..."
                    required={category === 'CUSTOM'}
                    autoFocus
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This custom category will be assigned to this department and saved in your database.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Mission & Functional Scope</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Primary core responsibilities and deliverables of this department..."
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: LEADERSHIP (OPTIONAL) */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  2. Department Leadership
                </CardTitle>
                <span className="text-[11px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-md">
                  Optional
                </span>
              </div>
              <CardDescription className="text-xs">
                Select from existing staff roster or leave unassigned to allocate later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-primary" /> Select from Staff Roster
                </label>
                <SelectBox
                  options={leaderSelectOptions}
                  value={selectedLeaderId}
                  onChange={handleLeaderSelect}
                />
              </div>

              {/* Selected Staff Info Card */}
              {selectedLeaderId ? (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center gap-3.5">
                  <img
                    src={headAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={headName}
                    className="w-11 h-11 rounded-full object-cover border border-border shrink-0 shadow-xs"
                  />
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-foreground truncate">{headName}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{headEmail}</div>
                    <div className="text-[11px] text-foreground font-mono">{headPhone}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-xs text-muted-foreground flex items-center gap-2.5">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>No leader assigned yet. Leadership can be assigned anytime from staff management or here.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CARD 3: BUDGET & COST CENTER */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                3. Operating Budget & Cost Center
              </CardTitle>
              <CardDescription className="text-xs">Monthly financial budget, payroll allocation, and general ledger code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Monthly Budget ($/mo) *</label>
                  <Input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    placeholder="25000"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assigned Headcount</label>
                  <div className="h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-bold text-primary flex items-center">
                    {assignedRoster.length} Staff Members Assigned
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">General Ledger (GL) Code</label>
                  <Input
                    value={glCode}
                    onChange={(e) => setGlCode(e.target.value)}
                    placeholder="GL-6100-FIT"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Revenue Generating Unit?</label>
                  <SelectBox
                    options={[
                      { value: 'true', label: '💰 Yes (Direct Revenue Unit)' },
                      { value: 'false', label: '⚙️ No (Operational Cost Center)' },
                    ]}
                    value={revenueGenerating}
                    onChange={setRevenueGenerating}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: BRANCH & SHIFTS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                4. Facility Branch & Working Shifts
              </CardTitle>
              <CardDescription className="text-xs">Location scope and required weekly staffing coverage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Operating Facility Branch</label>
                <SelectBox
                  options={branchOptions}
                  value={branchId}
                  onChange={setBranchId}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Required Weekly Shift Coverage</label>
                <Input
                  value={shiftsInput}
                  onChange={(e) => setShiftsInput(e.target.value)}
                  placeholder="Morning, Evening, Weekend"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* CARD 5: ASSIGNED STAFF ROSTER & QUICK ALLOCATION (FULL WIDTH) */}
        {/* ========================================================================= */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  5. Department Staff Roster ({assignedRoster.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Staff members currently allocated to this department. Add or unassign staff directly.
                </CardDescription>
              </div>

              {/* Quick Assign Dropdown & Button */}
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
                No staff members currently assigned to this department.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignedRoster.filter(Boolean).map((s) => (
                  <div
                    key={s?.id || s?.name}
                    className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between shadow-2xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={s?.name || 'Staff'}
                        className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-foreground text-xs">{s?.name}</div>
                        <div className="text-[11px] text-muted-foreground">{s?.role} • {s?.shift || 'Standard'} Shift</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">{s?.rate}</div>
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
                      title="Unassign from Department"
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
            onClick={() => navigate(`/gym-management/departments/${id}`)}
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
              Are you sure you want to remove <strong className="text-foreground">{staffToRemove?.name}</strong> ({staffToRemove?.role}) from the <strong className="text-foreground">{name || 'this'}</strong> department?
            </DialogDescription>
          </DialogHeader>

          {staffToRemove && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-xs">
              <img
                src={staffToRemove?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={staffToRemove?.name || 'Staff'}
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
