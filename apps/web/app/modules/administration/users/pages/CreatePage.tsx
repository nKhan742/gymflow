import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, UserCheck, Shield, Key, Copy, Check, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IUserModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Staff import state
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<IUserModel['role']>('TRAINER');
  const [department, setDepartment] = useState('Personal Training & Fitness');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [status, setStatus] = useState<IUserModel['status']>('ACTIVE');
  const [initialPassword, setInitialPassword] = useState('password123');

  const roleNameMap: Record<string, string> = {
    ADMIN: '🛡️ Gym Administrator (Full Management)',
    BRANCH_MANAGER: '🏢 Branch General Manager',
    TRAINER: '🏋️ Trainer (Fitness Coach / Instructor)',
    RECEPTIONIST: '🛎️ Front Desk / Receptionist',
    NUTRITIONIST: '🥗 Nutritionist & Wellness Specialist',
    MEMBER: '👤 Gym Member Portal',
  };

  useEffect(() => {
    loadStaffList();
  }, []);

  const loadStaffList = async () => {
    setLoadingStaff(true);
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
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setStaffList(items);

        // Check if staffId or email query parameter was provided in URL
        const paramStaffId = searchParams.get('staffId');
        const paramEmail = searchParams.get('email');
        if (paramStaffId || paramEmail) {
          const match = items.find((s: any) => (s.id || s._id) === paramStaffId || s.email === paramEmail);
          if (match) {
            applyStaffData(match);
          }
        }
      }
    } catch {
      // Ignore network errors on staff lookup
    } finally {
      setLoadingStaff(false);
    }
  };

  const applyStaffData = (staff: any) => {
    setSelectedStaffId(staff.id || staff._id);
    const name = staff.name || `${staff.firstName || ''} ${staff.lastName || ''}`.trim();
    setFullName(name);
    setEmail(staff.email || '');
    setPhone(staff.phone || '');
    if (staff.avatar) setAvatarUrl(staff.avatar);
    if (staff.department) setDepartment(staff.department);
    if (staff.branchId) setBranchId(staff.branchId);

    // Map staff role to system RBAC role
    if (staff.role === 'TRAINER' || staff.role === 'HEAD_COACH' || staff.role === 'GROUP_INSTRUCTOR') {
      setRole('TRAINER');
      setDepartment(staff.department || 'Personal Training & Fitness');
    } else if (staff.role === 'RECEPTIONIST') {
      setRole('RECEPTIONIST');
      setDepartment(staff.department || 'Front Desk & Operations');
    } else if (staff.role === 'MANAGER') {
      setRole('BRANCH_MANAGER');
      setDepartment(staff.department || 'Operations & Management');
    } else if (staff.role === 'NUTRITIONIST') {
      setRole('NUTRITIONIST');
      setDepartment(staff.department || 'Nutrition & Recovery');
    } else {
      setRole('TRAINER');
    }

    toast.info(`Imported profile for ${name}. Credentials and role configured.`);
  };

  const handleSelectStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    if (!staffId) return;
    const staff = staffList.find((s) => (s.id || s._id) === staffId);
    if (staff) {
      applyStaffData(staff);
    }
  };

  const copyCredentials = () => {
    if (!email) {
      toast.error('Please specify an email address first.');
      return;
    }
    const text = `GymFlow ERP Login Credentials:\nPortal: ${window.location.origin}/auth/login\nEmail: ${email}\nPassword: ${initialPassword}\nRole: ${roleNameMap[role] || role}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Credentials copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Please provide full name and a valid corporate email.');
      return;
    }

    setLoading(true);

    const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedBranch = branchOptions.find((b) => b.value === branchId);

    const newUser: IUserModel = {
      id: newId,
      _id: newId,
      fullName,
      email: email.toLowerCase().trim(),
      phone,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role,
      roleName: roleNameMap[role] || role,
      department,
      branchId,
      branchName: selectedBranch?.label?.replace('🏢 ', '') || 'Main Facility',
      mfaEnabled,
      lastLoginAt: 'Invited (Pending First Sign-In)',
      ipAddress: 'Awaiting Authentication',
      status,
      securityScore: mfaEnabled ? 95 : 85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_users');
      const existing: IUserModel[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('gymflow_custom_admin_users', JSON.stringify([newUser, ...existing]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const apiPayload = {
        fullName,
        firstName: fullName.trim().split(' ')[0] || 'Staff',
        lastName: fullName.trim().split(' ').slice(1).join(' ') || 'User',
        email: email.toLowerCase().trim(),
        phone,
        avatar: avatarUrl,
        avatarUrl,
        role,
        roleName: roleNameMap[role] || role,
        department,
        branchId,
        branchName: selectedBranch?.label?.replace('🏢 ', '') || 'Main Facility',
        password: initialPassword || 'password123',
        status: typeof status === 'string' ? status.toLowerCase() : 'active',
        mfaEnabled,
      };

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/users', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      const resJson = await res.json().catch(() => null);

      if (res.ok && resJson?.success) {
        toast.success(`🎉 User credentials for "${fullName}" created successfully! Login: ${email} | Password: ${initialPassword}`);
        navigate('/administration/users');
        return;
      } else {
        const errMsg = resJson?.message || 'Failed to create user on backend';
        toast.error(errMsg);
      }
    } catch {
      toast.error('Network error while provisioning user account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Onboard New System User"
        subtitle="Provision login credentials, RBAC security clearance, facility scope, and staff profile linking."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/users')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Users Directory</span>
          </Button>
        }
      />

      <div className="max-w-6xl w-full space-y-6 pt-6">
        {/* Quick Staff Import Banner */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>Link from Onboarded Staff Member</span>
                <span className="text-[10px] font-medium text-primary bg-primary/15 px-2 py-0.5 rounded-full">Trainers / Front Desk</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Quickly generate login credentials for an existing trainer or employee with a single click.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-80 shrink-0">
            <Select value={selectedStaffId} onValueChange={handleSelectStaff}>
              <SelectTrigger className="bg-background border-border/80 h-10 shadow-xs">
                <SelectValue placeholder={loadingStaff ? "Loading staff roster..." : "— Choose Staff / Trainer —"} />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((s) => (
                  <SelectItem key={s.id || s._id} value={s.id || s._id}>
                    {s.name} ({s.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Side-by-Side Responsive Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* LEFT CARD: Identity & Photo Upload */}
            <Card className="shadow-xs border-border/80 flex flex-col justify-between">
              <div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    User Identity & Portrait
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Upload verified headshot and specify full legal identity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">User Profile Photo</label>
                    <ImageUpload
                      value={avatarUrl}
                      onChange={(url) => setAvatarUrl(url)}
                      variant="avatar"
                      helperText="Upload official square employee portrait (1:1)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Full Legal Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. Marcus Vance"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Corporate Email (Login Username) <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="e.g. marcus.vance@gymflow.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Direct Phone Number</label>
                      <Input
                        placeholder="e.g. +1 (555) 345-6789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Department / Division</label>
                      <Input
                        placeholder="e.g. Personal Training & Fitness"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 border-t border-border/60 bg-muted/10 text-xs text-muted-foreground flex items-center justify-between">
                <span>Identity Verification:</span>
                <span className="font-semibold text-foreground">{fullName ? 'Ready to Provision' : 'Awaiting Input'}</span>
              </div>
            </Card>

            {/* RIGHT CARD: RBAC Role, Password & Campus Scope */}
            <Card className="shadow-xs border-border/80 flex flex-col justify-between">
              <div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    Role-Based Access Control (RBAC) & Scope
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Configure access privileges, assigned branch, and initial credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Security Role Clearance</label>
                      <Select value={role} onValueChange={(val) => setRole(val as IUserModel['role'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRAINER">🏋️ Trainer (Fitness Coach / Instructor)</SelectItem>
                          <SelectItem value="RECEPTIONIST">🛎️ Front Desk / Receptionist</SelectItem>
                          <SelectItem value="BRANCH_MANAGER">🏢 Branch General Manager</SelectItem>
                          <SelectItem value="ADMIN">🛡️ Admin (Gym Administrator / Owner)</SelectItem>
                          <SelectItem value="NUTRITIONIST">🥗 Nutritionist & Wellness Specialist</SelectItem>
                          <SelectItem value="MEMBER">👤 Gym Member Portal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Primary Operational Branch</label>
                      <Select value={branchId} onValueChange={setBranchId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branchOptions.map((b) => (
                            <SelectItem key={b.value} value={b.value}>
                              {b.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Login Password & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-primary" /> Initial Password <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={copyCredentials}
                          className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? 'Copied!' : 'Copy Login'}</span>
                        </button>
                      </div>
                      <Input
                        value={initialPassword}
                        onChange={(e) => setInitialPassword(e.target.value)}
                        placeholder="password123"
                        required
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Default: <code className="text-foreground font-mono">password123</code> (can be changed anytime).
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Account Lifecycle Status</label>
                      <Select value={status} onValueChange={(val) => setStatus(val as IUserModel['status'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">🟢 Active Account (Immediate Access)</SelectItem>
                          <SelectItem value="INVITED">✉️ Invited (Pending First Login)</SelectItem>
                          <SelectItem value="SUSPENDED">🔴 Suspended / Locked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl mt-2">
                    <div>
                      <span className="text-xs font-semibold text-foreground block">Enforce 2FA Multi-Factor Authentication</span>
                      <span className="text-[10px] text-muted-foreground">Requires TOTP or biometric key at initial login</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={mfaEnabled}
                      onChange={(e) => setMfaEnabled(e.target.checked)}
                      className="h-4 w-4 accent-primary cursor-pointer"
                    />
                  </div>
                </CardContent>
              </div>

              <CardFooter className="flex items-center justify-between border-t border-border/60 p-4 bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  Clearance: <strong className="text-emerald-600">{roleNameMap[role] || role}</strong>
                </span>
                <Button type="submit" disabled={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Creating Credentials...' : 'Save & Issue Credentials'}</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
