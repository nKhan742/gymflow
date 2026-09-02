import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, UserCheck, Shield, KeyRound, Smartphone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IUserModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const DEFAULT_USERS: Record<string, IUserModel> = {
  'USR-1001': {
    id: 'USR-1001',
    _id: 'USR-1001',
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@gymflow.io',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-8901',
    role: 'SUPER_ADMIN',
    roleName: 'Super Administrator (Global)',
    department: 'Executive Operations',
    branchName: 'PD Vihar',
    mfaEnabled: true,
    lastLoginAt: '2 mins ago (Chrome on MacOS)',
    ipAddress: '192.168.1.142 (Encrypted TLS v1.3)',
    status: 'ACTIVE',
    securityScore: 100,
    createdAt: '2026-08-25T08:00:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
  },
  'USR-1002': {
    id: 'USR-1002',
    _id: 'USR-1002',
    fullName: 'Marcus Vance, CSCS',
    email: 'm.vance@gymflow.io',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    role: 'FACILITY_ADMIN',
    roleName: 'Facility Administrator',
    department: 'Personal Training & Fitness',
    branchName: 'PD Vihar',
    mfaEnabled: true,
    lastLoginAt: '18 mins ago (iPad OS / Safari)',
    ipAddress: '172.56.21.90 (Encrypted TLS v1.3)',
    status: 'ACTIVE',
    securityScore: 98,
    createdAt: '2026-08-26T08:00:00.000Z',
    updatedAt: '2026-08-26T08:00:00.000Z',
  },
  'USR-1003': {
    id: 'USR-1003',
    _id: 'USR-1003',
    fullName: 'Elena Rostova',
    email: 'e.rostova@gymflow.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    role: 'BRANCH_MANAGER',
    roleName: 'Branch General Manager',
    department: 'Member Experience',
    branchName: 'PD Vihar',
    mfaEnabled: true,
    lastLoginAt: '1 hour ago (Windows 11 / Edge)',
    ipAddress: '192.168.1.189 (Encrypted TLS v1.3)',
    status: 'ACTIVE',
    securityScore: 95,
    createdAt: '2026-08-27T08:00:00.000Z',
    updatedAt: '2026-08-27T08:00:00.000Z',
  },
};

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [email, setEmail] = useState('s.jenkins@gymflow.io');
  const [phone, setPhone] = useState('+1 (555) 234-8901');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
  const [role, setRole] = useState<IUserModel['role']>('SUPER_ADMIN');
  const [department, setDepartment] = useState('Executive Operations');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [status, setStatus] = useState<IUserModel['status']>('ACTIVE');

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_users');
    if (stored) {
      const customList: IUserModel[] = JSON.parse(stored);
      const found = customList.find((u) => (u.id || u._id) === id);
      if (found) {
        setFullName(found.fullName);
        setEmail(found.email);
        setPhone(found.phone);
        setAvatarUrl(found.avatarUrl);
        setRole(found.role);
        setDepartment(found.department);
        setMfaEnabled(found.mfaEnabled);
        setStatus(found.status);
        if (found.branchId) setBranchId(found.branchId);
        return;
      }
    }

    const defaultUser = DEFAULT_USERS[id];
    if (defaultUser) {
      setFullName(defaultUser.fullName);
      setEmail(defaultUser.email);
      setPhone(defaultUser.phone);
      setAvatarUrl(defaultUser.avatarUrl);
      setRole(defaultUser.role);
      setDepartment(defaultUser.department);
      setMfaEnabled(defaultUser.mfaEnabled);
      setStatus(defaultUser.status);
    }
  }, [id]);

  const roleNameMap: Record<IUserModel['role'], string> = {
    SUPER_ADMIN: 'Super Administrator (Global)',
    FACILITY_ADMIN: 'Facility Administrator',
    BRANCH_MANAGER: 'Branch General Manager',
    STAFF_USER: 'Staff Operator / Concierge',
    AUDITOR: 'Compliance & Financial Auditor',
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedBranch = branchOptions.find((b) => b.value === branchId);

    const updatedUser: IUserModel = {
      id: id || 'USR-1001',
      _id: id || 'USR-1001',
      fullName,
      email,
      phone,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role,
      roleName: roleNameMap[role],
      department,
      branchId,
      branchName: selectedBranch?.label?.replace('🏢 ', '') || 'PD Vihar',
      mfaEnabled,
      lastLoginAt: 'Just now (Settings Modified)',
      ipAddress: '192.168.1.142 (Encrypted TLS v1.3)',
      status,
      securityScore: mfaEnabled ? 98 : 70,
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_users');
      const existing: IUserModel[] = stored ? JSON.parse(stored) : [];
      const filtered = existing.filter((u) => (u.id || u._id) !== id);
      localStorage.setItem('gymflow_custom_admin_users', JSON.stringify([updatedUser, ...filtered]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/users/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      }).catch(() => {});

      toast.success(`User profile for "${fullName}" updated!`);
      navigate('/administration/users');
    } catch {
      toast.error('Failed to update user record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Edit User • ${fullName}`}
        subtitle={`Modify security clearance, RBAC roles, multi-branch assignment, and 2FA credentials for #${id || 'USR-1001'}.`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/users')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Users Directory</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Identity & Photo Upload */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                User Identity & Portrait
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Corporate Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="email"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Department / Division</label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RBAC Role & Scope */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                Role Clearance & Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Security Role Clearance</label>
                  <Select value={role} onValueChange={(val) => setRole(val as IUserModel['role'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">👑 Super Admin (Full Global Network)</SelectItem>
                      <SelectItem value="FACILITY_ADMIN">🏛️ Facility Administrator</SelectItem>
                      <SelectItem value="BRANCH_MANAGER">🏢 Branch General Manager</SelectItem>
                      <SelectItem value="STAFF_USER">🚪 Staff Operator / Concierge</SelectItem>
                      <SelectItem value="AUDITOR">⚖️ Compliance & Financial Auditor</SelectItem>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Account Lifecycle Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IUserModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active Account</SelectItem>
                      <SelectItem value="INVITED">✉️ Invited (Pending Activation)</SelectItem>
                      <SelectItem value="SUSPENDED">🔴 Suspended / Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">2FA Enforced</span>
                    <span className="text-[10px] text-muted-foreground">Requires TOTP on Sign-In</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mfaEnabled}
                    onChange={(e) => setMfaEnabled(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground font-mono">
                Record ID: <strong>{id || 'USR-1001'}</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
