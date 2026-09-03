import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Edit, User, Shield, Phone, Mail, Building2, Award, Clock, HeartPulse, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IMyProfileModel } from '../types';

const DEFAULT_MY_PROFILE: IMyProfileModel = {
  id: 'PRF-CURRENT-USER',
  _id: 'PRF-CURRENT-USER',
  fullName: 'Administrator',
  email: 'admin@gymflow.io',
  phone: '',
  jobTitle: 'Administrator',
  department: 'Executive Leadership',
  avatarUrl: '',
  coverBannerUrl: '',
  employeeId: 'EMP-001',
  securityRole: 'ADMIN',
  shiftSchedule: 'All Access',
  emergencyContactName: '',
  emergencyContactPhone: '',
  bio: 'System Administrator and Facility Director.',
  certifications: ['GymFlow ERP Certified Administrator'],
  profileCompletionScore: 100,
  status: 'ACTIVE',
  branchName: 'Main Campus',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IMyProfileModel>(DEFAULT_MY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyProfile();
  }, []);

  const loadMyProfile = async () => {
    setLoading(true);
    try {
      const authUserRaw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (authUserRaw) {
        const authUser = JSON.parse(authUserRaw);
        setProfile((prev) => ({
          ...prev,
          fullName: authUser.fullName || `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || prev.fullName,
          email: authUser.email || prev.email,
          phone: authUser.phone || prev.phone,
          securityRole: authUser.role || prev.securityRole,
          jobTitle: authUser.roleName || (authUser.role === 'ADMIN' ? 'Administrator' : authUser.role === 'SUPER_ADMIN' ? 'Super Administrator' : prev.jobTitle),
          department: authUser.department || prev.department,
          branchName: authUser.branchName || prev.branchName,
        }));

        try {
          const staffRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/staff', {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json',
            },
          });
          if (staffRes.ok) {
            const sJson = await staffRes.json();
            const sList = sJson.data?.items || (Array.isArray(sJson.data) ? sJson.data : []);
            const matched = sList.find((s: any) => s.email?.toLowerCase() === authUser.email?.toLowerCase());
            if (matched) {
              setProfile((prev) => ({
                ...prev,
                fullName: matched.name || `${matched.firstName} ${matched.lastName}`.trim() || prev.fullName,
                phone: matched.phone || prev.phone,
                employeeId: matched.code || prev.employeeId,
                jobTitle: matched.role ? String(matched.role).replace('_', ' ') : prev.jobTitle,
                department: matched.department || prev.department,
                bio: matched.bio || `Certified fitness specialist and coach. Specializations: ${matched.specializations?.join(', ') || 'Strength, Hypertrophy, Mobility'}.`,
                certifications: matched.certifications?.length ? matched.certifications : prev.certifications,
                shiftSchedule: matched.shift || prev.shiftSchedule,
                branchName: matched.branchName || prev.branchName,
              }));
            }
          }
        } catch {}
      }

      const stored = localStorage.getItem('gymflow_custom_my_profiles');
      if (stored) {
        const customList: IMyProfileModel[] = JSON.parse(stored);
        if (customList.length > 0 && customList[0]) {
          setProfile((prev) => ({ ...prev, ...customList[0] }));
          setLoading(false);
          return;
        }
      }

      // Fetch from live API
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/profile/my-profile', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const item = Array.isArray(json.data.items) ? json.data.items[0] : json.data;
          if (item) {
            setProfile((prev) => ({ ...prev, ...item }));
            setLoading(false);
            return;
          }
        }
      }
    } catch {}

    setLoading(false);
  };

  const handlePrintBadge = () => {
    window.print();
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  const safeFullName = profile?.fullName || 'Sarah Jenkins';
  const safeInitials = safeFullName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title="My Profile & Staff Identity"
        subtitle={`Personal credentials, security clearance tier, and active shift schedule for ${safeFullName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrintBadge}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Staff ID Badge</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate(`/profile/my-profile/${profile?.id || profile?._id || 'PRF-CURRENT-USER'}/edit`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit My Profile</span>
            </Button>
          </div>
        }
      />

      {/* 4 Personal Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="PROFILE COMPLETION"
          value={`${profile?.profileCompletionScore ?? 100}%`}
          change="Verified ID & Certifications"
          trend="up"
          timeframe="HR Compliance"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="STAFF IDENTIFIER"
          value={profile?.employeeId || 'EMP-8820'}
          change={profile?.department || 'Operations'}
          trend="up"
          timeframe="Badge Token"
          icon={<User className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="SECURITY CLEARANCE"
          value={profile?.securityRole?.replace('_', ' ') || 'FACILITY MANAGER'}
          change="Full Campus Access Tier"
          trend="up"
          timeframe="RBAC Token"
          icon={<Shield className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="SYSTEM SESSION"
          value="🟢 ACTIVE NOW"
          change="Authenticated via SSO"
          trend="up"
          timeframe="Live Security Session"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Hero Cover Banner & Avatar Header */}
      <Card className="overflow-hidden border border-border/80 shadow-sm mb-6">
        <div className="h-44 md:h-56 w-full relative bg-muted">
          {profile?.coverBannerUrl ? (
            <img
              src={profile.coverBannerUrl}
              alt="Profile Cover Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-900 via-primary/20 to-slate-900 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        </div>

        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="flex items-end gap-4">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background shadow-xl rounded-2xl bg-card">
                <AvatarImage src={profile?.avatarUrl} alt={safeFullName} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary rounded-2xl">
                  {safeInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-black text-foreground tracking-tight">{safeFullName}</h2>
                  <Badge variant={profile?.status === 'ACTIVE' ? 'success' : 'outline'} className="text-[10px] font-bold">
                    {profile?.status === 'ACTIVE' ? '🟢 ACTIVE PERSONNEL' : (profile?.status || 'ACTIVE')}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {profile?.employeeId || 'EMP-8820'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  {profile?.jobTitle || 'Facility Operator'} • <strong className="text-foreground">{profile?.department || 'Operations'}</strong> • {profile?.branchName || 'Main Facility'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(`/profile/my-profile/${profile.id || profile._id || 'PRF-CURRENT-USER'}/edit`)}
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Details</span>
              </Button>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/80">
            <div className="flex items-center gap-2.5 p-2.5 bg-muted/40 rounded-lg text-xs font-mono">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-muted/40 rounded-lg text-xs font-mono">
              <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-muted/40 rounded-lg text-xs font-mono">
              <Clock className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="truncate">{profile.shiftSchedule}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 360 Personal Dossier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Executive Bio */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Professional Summary & Role Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.bio || 'No executive biography provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Credentials & Certifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                Verified Qualifications & Licensures
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold border border-amber-500/20"
                    >
                      <Award className="h-3.5 w-3.5" />
                      {cert}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No certifications listed.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Safeguarding & Security */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-rose-500" />
                Emergency Safeguarding
              </CardTitle>
              <CardDescription className="text-xs">
                Designated contacts during medical or campus emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted/40 rounded-lg space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Primary Contact</span>
                <p className="text-xs font-bold text-foreground">{profile.emergencyContactName}</p>
                <p className="text-xs font-mono text-primary flex items-center gap-1 mt-0.5">
                  <Phone className="h-3 w-3" />
                  {profile.emergencyContactPhone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                Security Clearance Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Access Level:</span>
                <span className="font-bold text-foreground">{profile.securityRole}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Biometric Turnstile:</span>
                <span className="font-bold text-emerald-600">Full 24/7 Access</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Financial Permissions:</span>
                <span className="font-bold text-purple-600">Approved Ledger Signer</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
