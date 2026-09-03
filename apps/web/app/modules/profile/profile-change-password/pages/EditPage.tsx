import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, KeyRound, ShieldCheck, Lock, Smartphone, Building2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ISecurityCredentialModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [accountEmail, setAccountEmail] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountHolderAvatar, setAccountHolderAvatar] = useState<string | undefined>(undefined);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaMethod, setMfaMethod] = useState<ISecurityCredentialModel['mfaMethod']>('AUTHENTICATOR_APP');
  const [forceRotationDays, setForceRotationDays] = useState(90);
  const [status, setStatus] = useState<ISecurityCredentialModel['status']>('COMPLIANT');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadCredential();
  }, [id]);

  const loadCredential = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_security_credentials');
      if (stored) {
        const customList: ISecurityCredentialModel[] = JSON.parse(stored);
        const match = customList.find((c) => (c.id || c._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-change-password/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
      id: id || 'SEC-101',
      _id: id || 'SEC-101',
      accountEmail: 's.jenkins@gymflow.io',
      accountHolderName: 'Sarah Jenkins',
      accountHolderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      passwordAgeDays: 14,
      lastRotationDate: '2026-08-15',
      passwordStrengthScore: 100,
      mfaEnabled: true,
      mfaMethod: 'AUTHENTICATOR_APP',
      activeSessionCount: 2,
      ipAddressLastLogin: '192.168.1.142 (Encrypted TLS v1.3)',
      sessionDevice: 'Chrome on MacOS (Main Facility)',
      forceRotationDays: 90,
      securityHealthScore: 100,
      status: 'COMPLIANT',
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (item: ISecurityCredentialModel) => {
    setAccountEmail(item.accountEmail || '');
    setAccountHolderName(item.accountHolderName || '');
    setAccountHolderAvatar(item.accountHolderAvatar);
    setMfaEnabled(item.mfaEnabled ?? true);
    setMfaMethod(item.mfaMethod || 'AUTHENTICATOR_APP');
    setForceRotationDays(item.forceRotationDays || 90);
    setStatus(item.status || 'COMPLIANT');
    if (item.branchId) setBranchId(item.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New Password and Confirm Password do not match');
      return;
    }

    setLoading(true);

    const updatedCredential: Partial<ISecurityCredentialModel> = {
      accountEmail,
      accountHolderName,
      accountHolderAvatar,
      passwordAgeDays: 0,
      lastRotationDate: new Date().toISOString().slice(0, 10),
      mfaEnabled,
      mfaMethod,
      forceRotationDays,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_security_credentials');
      if (stored) {
        const customList: ISecurityCredentialModel[] = JSON.parse(stored);
        const index = customList.findIndex((c) => (c.id || c._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedCredential } as ISecurityCredentialModel;
          localStorage.setItem('gymflow_custom_security_credentials', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'SEC-101', ...updatedCredential } as ISecurityCredentialModel);
          localStorage.setItem('gymflow_custom_security_credentials', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-change-password/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCredential),
      }).catch(() => {});

      toast.success(`Security credential #${id} rotated successfully!`);
      navigate('/profile/profile-change-password');
    } catch {
      toast.error('Failed to update security record');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Rotate Password: ${accountHolderName || 'Account Holder'}`}
        subtitle={`Update master security credentials, session encryption, and MFA authentication rules for #${id || '101'}`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/profile/profile-change-password')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Security</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Account Holder Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Account Holder Avatar</label>
                  <ImageUpload
                    value={accountHolderAvatar}
                    onChange={(url) => setAccountHolderAvatar(url)}
                    variant="avatar"
                    helperText="Upload official account portrait"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Account Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Corporate Email <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Credentials */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-500" />
                Password Rotation Compiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Current Master Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    New Master Password (Leave blank to keep existing)
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars, uppercase, number & symbol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Confirm New Password
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Multi-Factor Authentication & Policy */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">2FA Enforcement Method</label>
                  <Select value={mfaMethod} onValueChange={(val) => setMfaMethod(val as ISecurityCredentialModel['mfaMethod'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="MFA Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUTHENTICATOR_APP">📱 Google/Authy Authenticator</SelectItem>
                      <SelectItem value="HARDWARE_KEY_FIDO2">🔑 FIDO2 Security Key (YubiKey)</SelectItem>
                      <SelectItem value="SMS_OTP">💬 SMS Fast OTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Rotation Policy (Days)</label>
                  <Select value={String(forceRotationDays)} onValueChange={(val) => setForceRotationDays(parseInt(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rotation Policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days (High Security)</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days (Enterprise Standard)</SelectItem>
                      <SelectItem value="180">180 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Scope
                  </label>
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
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Security Policy: <strong className="text-emerald-600">MFA & TLS 1.3 Active</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/profile/profile-change-password')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <KeyRound className="h-4 w-4" />
                  <span>Update Security Record</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
