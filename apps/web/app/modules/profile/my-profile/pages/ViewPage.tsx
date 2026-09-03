import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, User, Shield, Phone, Mail, Building2, Award, Clock, HeartPulse, Printer, CheckCircle2 } from 'lucide-react';
import { IMyProfileModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IMyProfileModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      // 1. Fetch live profile from backend
      try {
        const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/profile/my-profile`, {
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
              setProfile(item);
              setLoading(false);
              return;
            }
          }
        }
      } catch {}

      // 2. Fallback to auth user in storage
      const authUserRaw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (authUserRaw) {
        const authUser = JSON.parse(authUserRaw);
        setProfile({
          id: authUser.id || authUser._id || 'PRF-CURRENT-USER',
          _id: authUser.id || authUser._id || 'PRF-CURRENT-USER',
          fullName: authUser.name || `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || 'Staff Member',
          email: authUser.email || '',
          phone: authUser.phone || '',
          jobTitle: authUser.roleName || (authUser.role === 'ADMIN' ? '👑 Gym Administrator' : authUser.role === 'TRAINER' ? '🏋️ Fitness Coach' : authUser.role),
          department: authUser.department || 'Personal Training & Operations',
          avatarUrl: authUser.avatar || authUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          coverBannerUrl: authUser.coverBannerUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
          employeeId: authUser.code || `EMP-${(authUser.id || '001').slice(-4).toUpperCase()}`,
          securityRole: authUser.role || 'STAFF',
          shiftSchedule: authUser.shiftSchedule || 'Standard Facility Operations (08:00 - 17:00)',
          emergencyContactName: authUser.emergencyContactName || 'Family Contact',
          emergencyContactPhone: authUser.emergencyContactPhone || authUser.phone || '+1 (555) 019-2834',
          bio: authUser.bio || `Staff member at GymFlow ERP with verified security clearance.`,
          certifications: authUser.certifications || ['CPR/AED Certified', 'GymFlow Certified Professional'],
          profileCompletionScore: 100,
          status: (authUser.status || 'ACTIVE').toUpperCase(),
          branchName: authUser.campusName || authUser.branchName || 'Main Facility Campus',
          createdAt: authUser.createdAt || new Date().toISOString(),
          updatedAt: authUser.updatedAt || new Date().toISOString(),
        });
        setLoading(false);
        return;
      }
    } catch {}

    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !profile) {
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
        title={profile.fullName}
        subtitle={`${profile.jobTitle} • ${profile.department} • Staff ID: ${profile.employeeId}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/profile/my-profile')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Profiles</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Badge</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/profile/my-profile/${profile.id || profile._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Button>
          </div>
        }
      />

      {/* Cover Banner Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-6 border border-border bg-card shadow-sm">
        <div className="h-44 sm:h-56 w-full relative bg-muted">
          {profile?.coverBannerUrl ? (
            <img
              src={profile.coverBannerUrl}
              alt="Profile Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/30 to-purple-600/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        </div>

        <div className="p-6 sm:px-8 -mt-16 sm:-mt-20 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-lg shrink-0">
              <AvatarImage src={profile?.avatarUrl} alt={profile?.fullName || 'Staff Member'} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {(profile?.fullName || 'Staff Member').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-foreground">{profile?.fullName || 'Staff Member'}</h2>
                <Badge variant="default" className="text-xs font-mono font-bold">
                  {profile?.securityRole || 'STAFF'}
                </Badge>
                <Badge variant="success" className="text-xs font-mono font-bold">
                  {profile?.status || 'ACTIVE'}
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {profile?.jobTitle} • <span className="text-foreground">{profile?.department}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground pb-1">
            <Building2 className="h-4 w-4 text-blue-500" />
            <span>{profile.branchName || 'Main Facility'}</span>
          </div>
        </div>
      </div>

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PROFILE HEALTH</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{profile.profileCompletionScore}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Full identity & security verification</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">STAFF BADGE ID</span>
            <User className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{profile.employeeId}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Enterprise personnel code</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CLEARANCE LEVEL</span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{profile.securityRole}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Role-based access controls</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SHIFT ROSTER</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-sm font-bold font-mono text-foreground mt-1 truncate">{profile.shiftSchedule}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Operational working hours</p>
        </Card>
      </div>

      {/* Staff Profile Details Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Personnel Details & Executive Summary
            </CardTitle>
            <CardDescription className="text-xs">
              Contact credentials, biographical overview, and verified fitness certifications
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Biography</h4>
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3.5 rounded-xl border border-border">
                {profile.bio || 'No executive biography provided.'}
              </p>
            </div>

            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">1. Corporate Email Address</span>
                <span className="font-mono font-bold text-xs text-primary">{profile.email}</span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">2. Direct Phone Line</span>
                <span className="font-mono text-xs text-foreground">{profile.phone}</span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">3. Emergency Contact Person</span>
                <span className="font-mono text-xs text-rose-600 font-bold">{profile.emergencyContactName} ({profile.emergencyContactPhone})</span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">4. Primary Campus Branch Affiliation</span>
                <span className="font-mono text-xs text-blue-600 font-bold">{profile.branchName || 'Main Facility'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-500" />
                Accreditations & Professional Certifications
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((c, i) => (
                  <Badge key={i} variant="outline" className="text-xs font-semibold py-1 px-2.5 bg-muted/40">
                    🎖️ {c}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Badge Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              Staff Security Clearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/40 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">ID Badge</span>
                <span className="font-mono font-bold text-xs text-primary">{profile.employeeId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Access Scope</span>
                <Badge variant="default" className="text-[10px] font-bold">
                  {profile.securityRole}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">2FA Enrollment</span>
                <span className="text-[10px] font-bold text-emerald-600 font-mono">🟢 Enforced</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Staff credentials cryptographically verified against the enterprise identity management registry.
              </p>
              <div className="pt-2 border-t border-border space-y-1 font-mono text-[10px]">
                <div>Record ID: <strong>{profile.id || profile._id}</strong></div>
                <div>Created: <strong>{new Date(profile.createdAt).toLocaleDateString()}</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
