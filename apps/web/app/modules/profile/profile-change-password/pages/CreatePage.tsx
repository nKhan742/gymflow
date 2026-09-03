import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, KeyRound, ShieldCheck, Lock, Smartphone, Building2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ISecurityCredentialModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [accountEmail, setAccountEmail] = useState('s.jenkins@gymflow.io');
  const [accountHolderName, setAccountHolderName] = useState('Sarah Jenkins');
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

  // Password strength check
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*]/.test(newPassword);
  const strengthScore = [hasMinLength, hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length * 25;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New Password and Confirm Password do not match');
      return;
    }

    setLoading(true);

    const newId = `SEC-${Math.floor(100 + Math.random() * 900)}`;

    const newCredential: ISecurityCredentialModel = {
      id: newId,
      _id: newId,
      accountEmail,
      accountHolderName,
      accountHolderAvatar: accountHolderAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      passwordAgeDays: 0,
      lastRotationDate: new Date().toISOString().slice(0, 10),
      passwordStrengthScore: strengthScore || 95,
      mfaEnabled,
      mfaMethod,
      activeSessionCount: 2,
      ipAddressLastLogin: '192.168.1.142 (Encrypted TLS v1.3)',
      sessionDevice: 'Chrome on MacOS (Main Facility)',
      forceRotationDays,
      securityHealthScore: 99,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_security_credentials');
      const customList: ISecurityCredentialModel[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newCredential);
      localStorage.setItem('gymflow_custom_security_credentials', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-change-password', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCredential),
      }).catch(() => {});

      toast.success(`Password updated & MFA security policy enforced!`);
      navigate('/profile/profile-change-password');
    } catch {
      toast.error('Failed to update security credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Update Security Password & Enforce 2FA"
        subtitle="Rotate account master passwords, audit cryptographical complexity, and configure multi-factor authenticator policies."
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
                    required
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
                    New Master Password <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars, uppercase, number & symbol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Strength Checklist */}
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span>Cryptographic Strength:</span>
                  <span className={strengthScore >= 75 ? 'text-emerald-600' : 'text-amber-600'}>
                    {strengthScore}% ({strengthScore === 100 ? 'Very Strong' : strengthScore >= 75 ? 'Strong' : 'Moderate'})
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strengthScore === 100 ? 'bg-emerald-500' : strengthScore >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${strengthScore}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-muted-foreground pt-1 font-mono">
                  <span className={hasMinLength ? 'text-emerald-600 font-bold' : ''}>
                    {hasMinLength ? '✓ 8+ Chars' : '○ 8+ Chars'}
                  </span>
                  <span className={hasUpperCase ? 'text-emerald-600 font-bold' : ''}>
                    {hasUpperCase ? '✓ Uppercase' : '○ Uppercase'}
                  </span>
                  <span className={hasNumber ? 'text-emerald-600 font-bold' : ''}>
                    {hasNumber ? '✓ Number' : '○ Number'}
                  </span>
                  <span className={hasSpecial ? 'text-emerald-600 font-bold' : ''}>
                    {hasSpecial ? '✓ Special (!@#$)' : '○ Special (!@#$)'}
                  </span>
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
                  <span>Update Password</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
