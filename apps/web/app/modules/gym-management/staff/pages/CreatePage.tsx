import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox, ISelectOption } from '../../../../shared/components/ui/select';
import { DatePicker } from '../../../../shared/components/ui/datepicker';
import {
  ArrowLeft,
  Save,
  Mail,
  Phone,
  User,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Award,
  Briefcase,
  Sun,
  Sunset,
  Moon,
  Clock,
  DollarSign,
  GraduationCap,
  Building2,
  Calendar,
  Upload,
  Camera,
  Trash2,
  Fingerprint,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '../../../../core/store/currencyStore';
import { useDepartmentStore } from '../../../../core/store/departmentStore';
import { useBranchStore } from '../../../../core/store/branchStore';
import { StaffRole, ShiftType } from '../types';

const ROLE_OPTIONS: ISelectOption[] = [
  { value: 'TRAINER', label: 'Personal Trainer', icon: <Dumbbell className="w-3.5 h-3.5 text-primary" />, badge: 'Fitness' },
  { value: 'HEAD_COACH', label: 'Head Coach / Master Trainer', icon: <Award className="w-3.5 h-3.5 text-amber-500" />, badge: 'Lead' },
  { value: 'NUTRITIONIST', label: 'Certified Nutritionist / Dietitian', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />, badge: 'Wellness' },
  { value: 'GROUP_INSTRUCTOR', label: 'Group Fitness / Yoga Instructor', icon: <Sparkles className="w-3.5 h-3.5 text-blue-500" />, badge: 'Classes' },
  { value: 'RECEPTIONIST', label: 'Front Desk / Receptionist', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />, badge: 'Front Desk' },
  { value: 'MANAGER', label: 'Club General Manager', icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500" />, badge: 'Admin' },
  { value: 'MAINTENANCE', label: 'Facility Maintenance & Tech', icon: <Clock className="w-3.5 h-3.5 text-muted-foreground" />, badge: 'Ops' },
];

const SHIFT_OPTIONS: ISelectOption[] = [
  { value: 'MORNING', label: 'Morning Shift (6:00 AM – 2:00 PM)', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
  { value: 'EVENING', label: 'Evening Shift (2:00 PM – 10:00 PM)', icon: <Sunset className="w-3.5 h-3.5 text-orange-500" /> },
  { value: 'NIGHT', label: 'Night Shift (10:00 PM – 6:00 AM)', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
  { value: 'FLEXIBLE', label: 'Flexible / On-Call Hours', icon: <Clock className="w-3.5 h-3.5 text-blue-500" /> },
];

const PAYOUT_FREQUENCY_OPTIONS: ISelectOption[] = [
  { value: 'SEMI_MONTHLY', label: 'Semi-Monthly Direct Deposit (1st & 15th)' },
  { value: 'BI_WEEKLY', label: 'Bi-Weekly Payroll (Every other Friday)' },
  { value: 'MONTHLY', label: 'Monthly Lump-sum (Last business day)' },
];

const RELATIONSHIP_OPTIONS: ISelectOption[] = [
  { value: 'Spouse', label: 'Spouse / Partner' },
  { value: 'Parent', label: 'Parent / Guardian' },
  { value: 'Sibling', label: 'Brother / Sister' },
  { value: 'Family', label: 'Family Relative' },
  { value: 'Friend', label: 'Personal Friend / Colleague' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currency } = useCurrencyStore();
  const currencySymbol = SUPPORTED_CURRENCIES[currency]?.symbol || '$';
  const [loading, setLoading] = useState(false);

  const { departmentOptions, loadDepartments, isLoading: loadingDepartments } = useDepartmentStore();
  const { branches, loadBranches, branchOptions } = useBranchStore();

  useEffect(() => {
    loadDepartments();
    loadBranches();
  }, []);

  // Section 1: Personal & Identity
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);
  const [bio, setBio] = useState('Dedicated fitness professional passionate about progressive training.');

  // Section 2: Role, Department, Shift & Location
  const [role, setRole] = useState<StaffRole>('TRAINER');
  const [department, setDepartment] = useState<string>('');
  const [shift, setShift] = useState<ShiftType>('MORNING');
  const [assignedBranch, setAssignedBranch] = useState<string>('');
  const [rfidAccessCode, setRfidAccessCode] = useState(`RFID-${Math.floor(10000 + Math.random() * 90000)}`);

  useEffect(() => {
    if (!department && departmentOptions.length > 0) {
      setDepartment(departmentOptions[0].value);
    }
  }, [departmentOptions]);

  useEffect(() => {
    if (!assignedBranch && branchOptions.length > 0) {
      setAssignedBranch(branchOptions[0].value);
    } else if (!assignedBranch && branches.length > 0) {
      setAssignedBranch(branches[0].name);
    }
  }, [branchOptions, branches]);

  // Section 3: Compensation & Payroll
  const [hourlyRate, setHourlyRate] = useState('65');
  const [salary, setSalary] = useState('75000');
  const [commission, setCommission] = useState('20');
  const [payoutFrequency, setPayoutFrequency] = useState('SEMI_MONTHLY');
  const [bankRoutingNotes, setBankRoutingNotes] = useState('Direct Deposit Verified');

  // Section 4: Specializations & Credentials
  const [specializationsInput, setSpecializationsInput] = useState('Strength & Conditioning, Hypertrophy, HIIT');
  const [certificationsInput, setCertificationsInput] = useState('NASM-CPT, First Aid / CPR');
  const [experienceYears, setExperienceYears] = useState('5');
  const [workingDaysInput, setWorkingDaysInput] = useState('Monday, Tuesday, Wednesday, Thursday, Friday');

  // Section 5: Emergency Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('First Aid & AED Certified');

  // Image Upload File Handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success('Photo ready for onboarding!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('Please enter first name, last name, and a valid email.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload = {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone: phone || '+1 (555) 000-0000',
        avatar,
        hireDate,
        role,
        department,
        shift,
        status: 'active',
        hourlyRate: Number(hourlyRate) || 45,
        salary: Number(salary) || 60000,
        commissionPercentage: Number(commission) || 20,
        specializations: specializationsInput.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: certificationsInput.split(',').map((c) => c.trim()).filter(Boolean),
        workingDays: workingDaysInput.split(',').map((s) => s.trim()).filter(Boolean),
        bio,
        branchName: assignedBranch || (branches[0]?.name) || 'Main Facility',
        branchId: branches.find((b) => b.name === assignedBranch)?.id || branches[0]?.id || 'ALL',
        rfidAccessCode,
        emergencyContact: {
          name: emergencyName || 'Primary Contact',
          relationship: emergencyRelation,
          phone: emergencyPhone || phone,
        },
      };

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Staff member ${payload.name} onboarded successfully!`);
        navigate('/gym-management/staff');
      } else {
        toast.error(json.message || 'Failed to create staff record');
      }
    } catch {
      toast.error('Network error creating staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Onboard Staff & Trainer"
        subtitle="Register new coach credentials, profile portrait, facility assignments, and payroll compensation."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/gym-management/staff')}
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
              <span>{loading ? 'Creating...' : 'Save & Onboard'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                1. Personal Identity & Photo
              </CardTitle>
              <CardDescription className="text-xs">Upload staff portrait and configure core contact info.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80">
                <ImageUpload
                  label="Profile Portrait Photo"
                  variant="avatar"
                  value={avatar}
                  onChange={setAvatar}
                  helperText="Upload coach portrait. PNG, JPG or WebP under 10MB."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">First Name *</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Marcus"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Last Name *</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Brody"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="coach@gymflow.io"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <DatePicker
                label="Hire Date / Date of Joining"
                value={hireDate}
                onChange={(val) => setHireDate(val)}
                placeholder="Select start date..."
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Professional Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg bg-background border border-border text-foreground text-xs p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none transition-colors"
                  placeholder="Coaching philosophy, background, and achievements..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-500" />
                2. Role, Shift & Facility
              </CardTitle>
              <CardDescription className="text-xs">Organizational hierarchy, facility branch, and shift times.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectBox
                  label="Staff Role / Position *"
                  options={ROLE_OPTIONS}
                  value={role}
                  onChange={(val) => setRole(val as StaffRole)}
                />
                <SelectBox
                  label="Assigned Department *"
                  options={departmentOptions}
                  value={department}
                  placeholder={loadingDepartments ? 'Loading database departments...' : departmentOptions.length === 0 ? 'No departments in DB' : 'Select Department'}
                  onChange={(val) => setDepartment(val)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectBox
                  label="Scheduled Shift Timings *"
                  options={SHIFT_OPTIONS}
                  value={shift}
                  onChange={(val) => setShift(val as ShiftType)}
                />
                <SelectBox
                  label="Assigned Gym Facility Branch *"
                  options={branchOptions.length > 0 ? branchOptions : branches.map((b) => ({ value: b.name, label: `🏢 ${b.name}` }))}
                  value={assignedBranch}
                  placeholder={branches.length === 0 ? 'Loading branches from DB...' : 'Select Branch'}
                  onChange={(val) => setAssignedBranch(val)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Turnstile Keycard RFID / Access Tag</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                  <Input
                    value={rfidAccessCode}
                    onChange={(e) => setRfidAccessCode(e.target.value)}
                    placeholder="RFID-98412"
                    className="pl-9 font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                3. Compensation & Payroll Structure
              </CardTitle>
              <CardDescription className="text-xs">Contracted rates, annual base payroll, and commission split.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Hourly Rate ({currencySymbol}/hr) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-muted-foreground">{currencySymbol}</span>
                    <Input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="65"
                      className="pl-9 font-mono"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Base Salary ({currencySymbol}/yr) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-muted-foreground">{currencySymbol}</span>
                    <Input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="75000"
                      className="pl-9 font-mono"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Commission (%) *</label>
                  <Input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    placeholder="20"
                    className="font-mono"
                    required
                  />
                </div>
              </div>

              <SelectBox
                label="Payout Frequency"
                options={PAYOUT_FREQUENCY_OPTIONS}
                value={payoutFrequency}
                onChange={(val) => setPayoutFrequency(val)}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Direct Deposit / Bank Routing Notes</label>
                <Input
                  value={bankRoutingNotes}
                  onChange={(e) => setBankRoutingNotes(e.target.value)}
                  placeholder="Direct Deposit Verified"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-amber-500" />
                4. Specializations & Credentials
              </CardTitle>
              <CardDescription className="text-xs">Accredited certifications, focus areas, and weekly availability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Focus Specializations (comma separated)</label>
                <Input
                  value={specializationsInput}
                  onChange={(e) => setSpecializationsInput(e.target.value)}
                  placeholder="Strength & Conditioning, Hypertrophy, CrossFit, HIIT"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Accredited Certifications (comma separated)</label>
                <Input
                  value={certificationsInput}
                  onChange={(e) => setCertificationsInput(e.target.value)}
                  placeholder="CSCS, NASM-CPT, Precision Nutrition L1, CPR / AED"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Years of Experience</label>
                  <Input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Weekly Working Days</label>
                  <Input
                    value={workingDaysInput}
                    onChange={(e) => setWorkingDaysInput(e.target.value)}
                    placeholder="Mon, Tue, Wed, Thu, Fri"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* CARD 5: EMERGENCY CONTACT & MEDICAL DETAILS (FULL WIDTH ROW) */}
        {/* ========================================================================= */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-500" />
              5. Emergency Contact & Health Protocols
            </CardTitle>
            <CardDescription className="text-xs">Primary on-duty emergency contact and medical clearances.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Emergency Contact Name</label>
                <Input
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>
              <SelectBox
                label="Relationship"
                options={RELATIONSHIP_OPTIONS}
                value={emergencyRelation}
                onChange={(val) => setEmergencyRelation(val)}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Emergency Phone</label>
                <Input
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Medical Notes / Blood Group / First Aid Clearance</label>
              <Input
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="No chronic allergies. O+ Blood Type. First Aid / AED Qualified."
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/gym-management/staff')}
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
              <span>{loading ? 'Creating...' : 'Save & Onboard'}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  );
};
