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
  Briefcase,
  User,
  DollarSign,
  Clock,
  UserCheck,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IDepartment } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const CATEGORY_OPTIONS: ISelectOption[] = [
  { value: 'FITNESS', label: 'Fitness & Personal Training' },
  { value: 'RECEPTION', label: 'Front Desk & Guest Relations' },
  { value: 'STUDIO', label: 'Group Fitness & Studio Programming' },
  { value: 'WELLNESS', label: 'Nutrition & Recovery Spa' },
  { value: 'OPERATIONS', label: 'Facility Operations & Maintenance' },
  { value: 'SALES', label: 'Sales & Corporate Memberships' },
  { value: 'MANAGEMENT', label: 'Executive Management' },
];

const ICON_OPTIONS: ISelectOption[] = [
  { value: 'Dumbbell', label: '🏋️ Dumbbell / Fitness' },
  { value: 'HeartHandshake', label: '🤝 Handshake / Reception' },
  { value: 'Sparkles', label: '✨ Sparkles / Studio' },
  { value: 'Utensils', label: '🥗 Utensils / Nutrition' },
  { value: 'Wrench', label: '🔧 Wrench / Maintenance' },
  { value: 'TrendingUp', label: '📈 Trending / Sales' },
];

interface IStaffOptionItem {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

export const DEFAULT_STAFF_MEMBERS: any[] = [];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Section 1: Department Identity
  const [name, setName] = useState('');
  const [code, setCode] = useState(`DEP-${Math.floor(10 + Math.random() * 90)}`);
  const [category, setCategory] = useState('FITNESS');
  const [icon, setIcon] = useState('Dumbbell');
  const [description, setDescription] = useState('');

  // Section 2: Department Leadership (Optional)
  const [staffList, setStaffList] = useState<IStaffOptionItem[]>(DEFAULT_STAFF_MEMBERS);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [headName, setHeadName] = useState('');
  const [headEmail, setHeadEmail] = useState('');
  const [headPhone, setHeadPhone] = useState('');
  const [headAvatar, setHeadAvatar] = useState('');

  // Section 3: Financials & Budget
  const [monthlyBudget, setMonthlyBudget] = useState('25000');
  const [headcount, setHeadcount] = useState('8');
  const [glCode, setGlCode] = useState('GL-6100');
  const [revenueGenerating, setRevenueGenerating] = useState('true');

  // Section 4: Facility Branch & Shifts
  const [branchId, setBranchId] = useState('ALL');
  const [shiftsInput, setShiftsInput] = useState('Morning, Evening, Weekend');

  useEffect(() => {
    fetchStaffOptions();
  }, []);

  const fetchStaffOptions = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setStaffList(json.data);
        }
      }
    } catch {
      // Use defaults
    }
  };

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
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

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const staffSelectOptions: ISelectOption[] = [
    { value: '', label: '— Unassigned (Assign Leadership Later) —' },
    ...staffList.map((s) => ({
      value: s.id,
      label: `👤 ${s.name} (${s.role})`,
    })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error('Please enter department name and code.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: IDepartment = {
        id: `DEP-${Math.floor(100 + Math.random() * 900)}`,
        name,
        code,
        category,
        icon,
        description: description || 'Department operational division.',
        headOfDepartment: {
          name: headName || 'Unassigned',
          email: headEmail || '',
          phone: headPhone || '',
          avatar: headAvatar || '',
        },
        headcount: Number(headcount) || 0,
        monthlyBudget: Number(monthlyBudget) || 25000,
        actualSpend: Math.round(Number(monthlyBudget) * 0.85) || 21000,
        revenueGenerating: revenueGenerating === 'true',
        glCode: glCode || 'GL-6100',
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        shifts: shiftsInput.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'active',
      };

      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/departments', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Department "${name}" onboarded successfully!`);
      navigate('/gym-management/departments');
    } catch {
      toast.error('Network error during onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Onboard New Department"
        subtitle="Establish a new business division, allocate monthly operating budgets, and optionally assign leadership from existing staff."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/gym-management/departments')}
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
              <span>{loading ? 'Creating...' : 'Save & Onboard Department'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={setCategory}
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
              {/* Select from existing staff */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-primary" /> Select from Staff Roster
                </label>
                <SelectBox
                  options={staffSelectOptions}
                  value={selectedStaffId}
                  onChange={handleStaffSelect}
                />
              </div>

              {/* Selected Staff Info Card */}
              {selectedStaffId ? (
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
                  <span>No leader assigned yet. Leadership can be assigned anytime from staff management or the edit page.</span>
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
                  <label className="text-xs font-semibold text-foreground">Planned Headcount</label>
                  <Input
                    type="number"
                    value={headcount}
                    onChange={(e) => setHeadcount(e.target.value)}
                    placeholder="8"
                  />
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

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/gym-management/departments')}
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
            <span>{loading ? 'Creating...' : 'Save & Onboard Department'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
