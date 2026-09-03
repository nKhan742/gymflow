import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Badge } from '../../../../shared/components/ui/badge';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, User, Shield, Phone, Mail, Building2, Clock, HeartPulse, Award, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { useAuthStore } from '../../../../core/store/authStore';
import { IMyProfileModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const { user: authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [coverBannerUrl, setCoverBannerUrl] = useState<string | undefined>(undefined);
  const [securityRole, setSecurityRole] = useState<IMyProfileModel['securityRole']>('ADMIN');
  const [shiftSchedule, setShiftSchedule] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [bio, setBio] = useState('');
  const [certificationsInput, setCertificationsInput] = useState('');
  const [status, setStatus] = useState<IMyProfileModel['status']>('ACTIVE');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadProfile();
  }, [id]);

  const populateFields = (item: any) => {
    setFullName(item.fullName || item.name || '');
    setEmail(item.email || '');
    setPhone(item.phone || '');
    setJobTitle(item.jobTitle || item.roleName || item.role || 'Staff Specialist');
    setDepartment(item.department || (item.role === 'TRAINER' ? 'Personal Training & Fitness' : 'Operations'));
    setEmployeeId(item.employeeId || item.code || `EMP-${(item.id || item._id || '001').slice(-4).toUpperCase()}`);
    setAvatarUrl(item.avatarUrl || item.avatar || undefined);
    setCoverBannerUrl(item.coverBannerUrl || undefined);
    setSecurityRole(item.securityRole || item.role || 'ADMIN');
    setShiftSchedule(item.shiftSchedule || 'Standard Facility Operations (08:00 - 17:00)');
    setEmergencyContactName(item.emergencyContactName || 'Designated Contact');
    setEmergencyContactPhone(item.emergencyContactPhone || item.phone || '+1 (555) 019-2834');
    setBio(item.bio || 'Dedicated wellness and facility professional at GymFlow ERP.');
    const certs = Array.isArray(item.certifications) ? item.certifications.join(', ') : (item.certifications || 'CPR/AED Certified, GymFlow Certified Specialist');
    setCertificationsInput(certs);
    setStatus(typeof item.status === 'string' ? item.status.toUpperCase() : 'ACTIVE');
    if (item.branchId) setBranchId(item.branchId);
  };

  const loadProfile = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      // 1. First attempt: Query live profile directly from backend
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
              populateFields(item);
              setFetching(false);
              return;
            }
          }
        }
      } catch {}

      // 2. Fallback to active authenticated user session in store / localStorage
      const authUserRaw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      const sessionUser = authUser || (authUserRaw ? JSON.parse(authUserRaw) : null);
      if (sessionUser) {
        populateFields({
          id: sessionUser.id || sessionUser._id || 'PRF-CURRENT-USER',
          _id: sessionUser.id || sessionUser._id || 'PRF-CURRENT-USER',
          fullName: sessionUser.name || `${sessionUser.firstName || ''} ${sessionUser.lastName || ''}`.trim() || 'Staff Member',
          email: sessionUser.email,
          phone: sessionUser.phone || '',
          role: sessionUser.role,
          roleName: sessionUser.roleName,
          jobTitle: sessionUser.roleName || sessionUser.role,
          department: sessionUser.department,
          code: sessionUser.code,
          employeeId: sessionUser.code,
          avatar: sessionUser.avatar || sessionUser.avatarUrl,
          avatarUrl: sessionUser.avatar || sessionUser.avatarUrl,
          branchId: sessionUser.branchId || branchOptions[0]?.value || 'BR-274',
          branchName: sessionUser.campusName || sessionUser.branchName || 'Main Facility Campus',
          status: sessionUser.status || 'ACTIVE',
        });
        setFetching(false);
        return;
      }
    } catch {}

    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const certList = certificationsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const updatedProfilePayload = {
      fullName,
      name: fullName,
      firstName: fullName.trim().split(' ')[0] || 'Staff',
      lastName: fullName.trim().split(' ').slice(1).join(' ') || 'Member',
      email,
      phone,
      jobTitle,
      department,
      employeeId,
      avatarUrl,
      avatar: avatarUrl,
      coverBannerUrl,
      securityRole,
      shiftSchedule,
      emergencyContactName,
      emergencyContactPhone,
      bio,
      certifications: certList.length > 0 ? certList : ['CPR/AED Certified', 'GymFlow Certified Specialist'],
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const targetId = id || 'me';

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/profile/my-profile/${targetId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfilePayload),
      });

      if (res.ok) {
        // Synchronize local auth user storage so headers and menus update immediately
        const authUserRaw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
        if (authUserRaw) {
          try {
            const currentAuth = JSON.parse(authUserRaw);
            const updatedAuth = {
              ...currentAuth,
              name: fullName,
              fullName,
              firstName: fullName.split(' ')[0],
              lastName: fullName.split(' ').slice(1).join(' '),
              phone,
              avatar: avatarUrl,
              avatarUrl,
              department,
              branchId,
            };
            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedAuth));
            useAuthStore.setState({ user: updatedAuth as any });
          } catch {}
        }

        toast.success(`Profile for "${fullName}" updated successfully in database!`);
        navigate('/profile/my-profile');
        return;
      } else {
        toast.error('Failed to update profile record in database');
      }
    } catch {
      toast.error('Network error while updating profile');
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

  const certArray = certificationsInput.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Profile • ${fullName || 'Staff Member'}`}
        subtitle="Manage personal credentials, visual branding, facility assignments, and emergency safeguarding."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" onClick={() => navigate('/profile/my-profile')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Profile</span>
          </Button>
        }
      />

      <div className="w-full pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Side by Side Two-Column Card Grid in One Row Style */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Visual Branding & Security Clearance Scope */}
            <div className="lg:col-span-4 xl:col-span-4 space-y-6">
              {/* Card 1: Profile Imagery & Branding */}
              <Card className="border border-border shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Visual Identity & Photos
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Official portrait and campus banner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">Headshot Portrait</label>
                    <ImageUpload
                      value={avatarUrl}
                      onChange={(url) => setAvatarUrl(url)}
                      variant="avatar"
                      helperText="Official square employee avatar (1:1)"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <label className="text-xs font-semibold text-foreground block">Profile Cover Banner</label>
                    <ImageUpload
                      value={coverBannerUrl}
                      onChange={(url) => setCoverBannerUrl(url)}
                      variant="banner"
                      helperText="Wide profile cover header (16:9)"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Security Clearance & Scope */}
              <Card className="border border-border shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    Security & Facility Scope
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Cryptographic token and campus assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground block">Staff Identifier Token</label>
                    <div className="h-10 px-3 py-2 rounded-lg bg-muted/50 border border-border flex items-center justify-between font-mono text-xs font-bold text-foreground">
                      <span>{employeeId || 'USR-001'}</span>
                      <Badge variant="outline" className="text-[10px] font-mono bg-primary/10 text-primary border-primary/20">
                        VERIFIED
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground block">Security Clearance Role</label>
                    <div className="h-10 px-3 py-2 rounded-lg bg-muted/50 border border-border flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{securityRole}</span>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold bg-purple-500/10 text-purple-400 border-purple-500/20">
                        RBAC ACTIVE
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">Assigned Campus Facility</label>
                    <Select value={branchId} onValueChange={setBranchId}>
                      <SelectTrigger className="h-10 bg-background">
                        <SelectValue placeholder="Select Campus Facility" />
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">Profile Account Status</label>
                    <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                      <SelectTrigger className="h-10 bg-background">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">🟢 Active Personnel</SelectItem>
                        <SelectItem value="ON_LEAVE">🟡 On Approved Leave</SelectItem>
                        <SelectItem value="INACTIVE">🔴 Inactive / Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Identity, Operational Schedule & Professional Accreditations */}
            <div className="lg:col-span-8 xl:col-span-8 space-y-6">
              {/* Card 3: Personal Identity & Direct Contact */}
              <Card className="border border-border shadow-xs">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    Identity & Direct Contact Coordinates
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Legal staff name and corporate communication channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Full Legal Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Corporate Email Address <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        value={email}
                        disabled
                        className="h-10 bg-muted/40 font-mono text-xs cursor-not-allowed text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Direct Phone Number</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Department / Division</label>
                      <Input
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Personal Training & Fitness"
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Job Title / Functional Designation</label>
                    <Input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Fitness Coach & Instructor"
                      className="h-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Operational Schedule & Safeguarding */}
              <Card className="border border-border shadow-xs">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Operational Schedule & Safeguarding Contacts
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Shift roster and designated medical emergency point-of-contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Shift Schedule / Facility Availability</label>
                    <Input
                      value={shiftSchedule}
                      onChange={(e) => setShiftSchedule(e.target.value)}
                      placeholder="e.g. Morning Operations (06:00 - 14:30 EST)"
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Emergency Contact Name</label>
                      <Input
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        placeholder="e.g. Sarah Connor (Spouse)"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Emergency Contact Phone</label>
                      <Input
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        placeholder="+1 (555) 999-8888"
                        className="h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 5: Biography & Professional Accreditations */}
              <Card className="border border-border shadow-xs">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    Professional Biography & Accreditations
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Public credentials and specialized certifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Professional Biography & Summary</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Brief overview of operational duties, athletic experience, and client focus..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">
                      Verified Qualifications & Certifications (comma separated)
                    </label>
                    <Input
                      value={certificationsInput}
                      onChange={(e) => setCertificationsInput(e.target.value)}
                      placeholder="e.g. CPR/AED Certified, NASM Personal Trainer, Precision Nutrition"
                      className="h-10"
                    />
                    {certArray.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {certArray.map((c, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold border border-primary/20"
                          >
                            <Award className="h-3 w-3" />
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-xs">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/profile/my-profile')}
              className="gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Cancel</span>
            </Button>

            <Button type="submit" disabled={loading} className="gap-2 shadow-md cursor-pointer">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Save className="h-4 w-4" />}
              <span>Save Profile Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
