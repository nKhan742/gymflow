import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, User, Shield, Phone, Mail, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IMyProfileModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
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
  const [securityRole, setSecurityRole] = useState<IMyProfileModel['securityRole']>('FACILITY_MANAGER');
  const [shiftSchedule, setShiftSchedule] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [bio, setBio] = useState('');
  const [certificationsInput, setCertificationsInput] = useState('');
  const [status, setStatus] = useState<IMyProfileModel['status']>('ACTIVE');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_my_profiles');
      if (stored) {
        const customList: IMyProfileModel[] = JSON.parse(stored);
        const match = customList.find((p) => (p.id || p._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/profile/my-profile/${id}`, {
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
      id: id || 'PRF-101',
      _id: id || 'PRF-101',
      fullName: 'Sarah Jenkins',
      email: 's.jenkins@gymflow.io',
      phone: '+1 (555) 234-8901',
      jobTitle: 'Director of Facility Operations',
      department: 'Operations & Facilities',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      coverBannerUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
      employeeId: 'EMP-8820',
      securityRole: 'FACILITY_MANAGER',
      shiftSchedule: 'Morning Operations (06:00 - 14:30 EST)',
      emergencyContactName: 'David Jenkins (Spouse)',
      emergencyContactPhone: '+1 (555) 890-1234',
      bio: 'Seasoned fitness facility operator specializing in biometric turnstile infrastructure, campus maintenance, and cross-functional team leadership.',
      certifications: ['CPR/AED Certified', 'OSHA Facility Safety', 'NASM Club Admin'],
      profileCompletionScore: 100,
      status: 'ACTIVE',
      branchName: 'Downtown Flagship',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (item: IMyProfileModel) => {
    setFullName(item.fullName || '');
    setEmail(item.email || '');
    setPhone(item.phone || '');
    setJobTitle(item.jobTitle || '');
    setDepartment(item.department || '');
    setEmployeeId(item.employeeId || '');
    setAvatarUrl(item.avatarUrl);
    setCoverBannerUrl(item.coverBannerUrl);
    setSecurityRole(item.securityRole || 'FACILITY_MANAGER');
    setShiftSchedule(item.shiftSchedule || '');
    setEmergencyContactName(item.emergencyContactName || '');
    setEmergencyContactPhone(item.emergencyContactPhone || '');
    setBio(item.bio || '');
    setCertificationsInput((item.certifications || []).join(', '));
    setStatus(item.status || 'ACTIVE');
    if (item.branchId) setBranchId(item.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const certList = certificationsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const updatedProfile: Partial<IMyProfileModel> = {
      fullName,
      email,
      phone,
      jobTitle,
      department,
      employeeId,
      avatarUrl,
      coverBannerUrl,
      securityRole,
      shiftSchedule,
      emergencyContactName,
      emergencyContactPhone,
      bio,
      certifications: certList.length > 0 ? certList : ['CPR/AED Certified'],
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_my_profiles');
      if (stored) {
        const customList: IMyProfileModel[] = JSON.parse(stored);
        const index = customList.findIndex((p) => (p.id || p._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedProfile } as IMyProfileModel;
          localStorage.setItem('gymflow_custom_my_profiles', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'PRF-101', ...updatedProfile } as IMyProfileModel);
          localStorage.setItem('gymflow_custom_my_profiles', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/profile/my-profile/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      }).catch(() => {});

      toast.success(`Profile #${id} updated!`);
      navigate('/profile/my-profile');
    } catch {
      toast.error('Failed to update profile');
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
        title={`Edit Profile: ${fullName || 'Staff Member'}`}
        subtitle={`Modify employee identity credentials, security tiers, and shift assignments for #${id || '101'}`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/profile/my-profile')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Profiles</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Banner and Avatar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Profile Photos & Visual Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Profile Cover Banner (Hero Image)</label>
                <ImageUpload
                  value={coverBannerUrl}
                  onChange={(url) => setCoverBannerUrl(url)}
                  variant="banner"
                  helperText="Upload wide profile cover photo or brand header (16:9)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Headshot Avatar</label>
                <ImageUpload
                  value={avatarUrl}
                  onChange={(url) => setAvatarUrl(url)}
                  variant="avatar"
                  helperText="Upload official square employee portrait (1:1)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Primary Identity & Contact */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500" />
                Identity & Corporate Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phone Number</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Job Title / Designation</label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Department</label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Executive Biography / Summary</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security, Shift & Emergency Safeguarding */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                Security Clearance & Operational Roster
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Employee Staff ID</label>
                  <Input
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Security Role Clearance</label>
                  <Select value={securityRole} onValueChange={(val) => setSecurityRole(val as IMyProfileModel['securityRole'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">👑 Super Admin (Full Access)</SelectItem>
                      <SelectItem value="FACILITY_MANAGER">🏛️ Facility Manager</SelectItem>
                      <SelectItem value="HEAD_COACH">🏋️ Head Coach / Trainer</SelectItem>
                      <SelectItem value="FINANCE_DIRECTOR">💳 Finance Director</SelectItem>
                      <SelectItem value="FRONT_DESK">🚪 Front Desk Concierge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assigned Shift Schedule</label>
                  <Input
                    value={shiftSchedule}
                    onChange={(e) => setShiftSchedule(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Emergency Contact Name</label>
                  <Input
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Emergency Contact Phone</label>
                  <Input
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Certifications (Comma-separated)</label>
                <Input
                  value={certificationsInput}
                  onChange={(e) => setCertificationsInput(e.target.value)}
                  placeholder="e.g. CPR/AED, NASM-CPT, OSHA Safety"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Account Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IMyProfileModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active Employee Account</SelectItem>
                      <SelectItem value="ON_LEAVE">⏳ Sabbatical / Leave</SelectItem>
                      <SelectItem value="RESTRICTED">🔒 Restricted Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Primary Home Branch
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
                Employee ID: <strong className="font-mono text-foreground">{employeeId}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/profile/my-profile')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Profile</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
