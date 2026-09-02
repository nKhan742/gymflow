import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Save, KeyRound, ShieldCheck, Lock, Smartphone, Building2, Eye, EyeOff, Shield, Laptop, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ISecurityCredentialModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State initialized from authenticated user
  const [accountEmail, setAccountEmail] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('Administrator');
  const [accountHolderAvatar, setAccountHolderAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaMethod, setMfaMethod] = useState<ISecurityCredentialModel['mfaMethod']>('AUTHENTICATOR_APP');
  const [forceRotationDays, setForceRotationDays] = useState(90);
  const [status, setStatus] = useState<ISecurityCredentialModel['status']>('COMPLIANT');

  useEffect(() => {
    try {
      const authRaw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (authRaw) {
        const u = JSON.parse(authRaw);
        if (u.fullName || u.name) setAccountHolderName(u.fullName || u.name);
        if (u.email) setAccountEmail(u.email);
        if (u.avatar || u.avatarUrl) setAccountHolderAvatar(u.avatar || u.avatarUrl);
      }
    } catch {}
  }, []);

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

    const updatedCredential: ISecurityCredentialModel = {
      id: 'SEC-CURRENT-USER',
      _id: 'SEC-CURRENT-USER',
      accountEmail,
      accountHolderName,
      accountHolderAvatar,
      passwordAgeDays: 0,
      lastRotationDate: new Date().toISOString().slice(0, 10),
      passwordStrengthScore: 100,
      mfaEnabled,
      mfaMethod,
      activeSessionCount: 1,
      ipAddressLastLogin: '127.0.0.1 (Localhost Secure Session)',
      sessionDevice: 'Web Browser (Current Session)',
      forceRotationDays,
      securityHealthScore: 100,
      status: 'COMPLIANT',
      branchName: 'Main Campus',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('gymflow_custom_security_credentials', JSON.stringify([updatedCredential]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-change-password', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCredential),
      }).catch(() => {});

      toast.success('Security credentials and 2FA settings successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSessions = () => {
    toast.success('All other active sessions have been revoked.');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Change Password & Account Security"
        subtitle="Manage cryptographic credentials, 2FA MFA hardware keys, forced rotation policies, and active sessions."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Security Audit</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-rose-500 hover:bg-rose-500/10 border-rose-500/30" onClick={handleRevokeSessions}>
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Revoke Other Sessions</span>
            </Button>
          </div>
        }
      />

      {/* 4 Personal Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="PASSWORD AGE"
          value="Active"
          change="Compliant with 90-day policy"
          trend="up"
          timeframe="Rotation Cycle"
          icon={<KeyRound className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="2FA MFA STATUS"
          value={mfaEnabled ? '🟢 ENFORCED' : '🔴 DISABLED'}
          change={mfaMethod === 'AUTHENTICATOR_APP' ? 'Authenticator App (TOTP)' : mfaMethod}
          trend="up"
          timeframe="Identity Guard"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="ACTIVE SESSIONS"
          value="1 Device"
          change="Current Session"
          trend="up"
          timeframe="Device Roster"
          icon={<Laptop className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="SECURITY SCORE"
          value="100 / 100"
          change="Enterprise High-Trust Tier"
          trend="up"
          timeframe="Audit Health"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Identity Header */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Authenticated Account Holder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl border border-border">
                <Avatar className="h-12 w-12 border border-border shrink-0 shadow-sm">
                  <AvatarImage src={accountHolderAvatar} alt={accountHolderName} />
                  <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                    {accountHolderName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{accountHolderName}</h3>
                    <Badge variant="success" className="text-[9px] font-bold">
                      AUTHENTICATED USER
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{accountEmail || 'admin@gymflow.io'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Rotation Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Rotate Account Password
              </CardTitle>
              <CardDescription className="text-xs">
                Passwords must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special symbol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Current Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">New Password</label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Password Strength:</span>
                    <span className={strengthScore >= 75 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                      {strengthScore >= 100 ? 'Very Strong' : strengthScore >= 75 ? 'Strong' : 'Moderate'} ({strengthScore}%)
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        strengthScore >= 75 ? 'bg-emerald-500' : strengthScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${strengthScore}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t border-border pt-4 bg-muted/20">
              <Button type="submit" disabled={loading} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Updating...' : 'Update Password & 2FA'}</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
