import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, UserCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IUserModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<IUserModel['role']>('FACILITY_ADMIN');
  const [department, setDepartment] = useState('Operations & Management');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [status, setStatus] = useState<IUserModel['status']>('ACTIVE');
  const [initialPassword, setInitialPassword] = useState('GymFlow@2026!');

  const roleNameMap: Record<IUserModel['role'], string> = {
    SUPER_ADMIN: 'Super Administrator (Global)',
    FACILITY_ADMIN: 'Facility Administrator',
    BRANCH_MANAGER: 'Branch General Manager',
    STAFF_USER: 'Staff Operator / Concierge',
    AUDITOR: 'Compliance & Financial Auditor',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedBranch = branchOptions.find((b) => b.value === branchId);

    const newUser: IUserModel = {
      id: newId,
      _id: newId,
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
      lastLoginAt: 'Invited (Pending First Sign-In)',
      ipAddress: 'Awaiting Authentication',
      status,
      securityScore: mfaEnabled ? 95 : 70,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_users');
      const existing: IUserModel[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('gymflow_custom_admin_users', JSON.stringify([newUser, ...existing]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/users', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      }).catch(() => {});

      toast.success(`User account for "${fullName}" created successfully!`);
      navigate('/administration/users');
    } catch {
      toast.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Onboard New System User"
        subtitle="Provision enterprise account credentials, security clearance roles, multi-branch scope, and 2FA policies."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/users')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Users Directory</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity & Photo Upload */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                User Identity & Portrait
              </CardTitle>
              <CardDescription className="text-xs">
                Upload verified headshot and specify full legal identity
              </CardDescription>
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
                    placeholder="e.g. Marcus Vance, CSCS"
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
                    placeholder="e.g. m.vance@gymflow.io"
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
          </Card>

          {/* RBAC Role & Campus Scope */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                Role-Based Access Control (RBAC) & Scope
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
                  <label className="text-xs font-semibold text-foreground">Initial Temporary Password</label>
                  <Input
                    value={initialPassword}
                    onChange={(e) => setInitialPassword(e.target.value)}
                    required
                  />
                </div>

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
              </div>

              <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl mt-2">
                <div>
                  <span className="text-xs font-semibold text-foreground block">Enforce 2FA Multi-Factor Authentication</span>
                  <span className="text-[10px] text-muted-foreground">Requires TOTP or biometric hardware key at initial login</span>
                </div>
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Provisioning Protocol: <strong className="text-emerald-600">Strict Zero-Trust RBAC</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Save & Provision Account</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
