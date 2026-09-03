import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Shield, User, Building2, Layers, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { IUserModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import {
  AVAILABLE_MODULE_PERMISSIONS,
  getGrantedModules,
  resolveEffectivePermissions,
} from '../../roles/permissions.config';
import { realtimeService } from '../../../../core/notifications/realtimeService';
import { invalidateApiCache } from '../../../../core/api/liveApiCache';
import { useAuthStore } from '../../../../core/store/authStore';

const DEPARTMENT_OPTIONS = [
  'Executive Operations',
  'Personal Training & Fitness',
  'Group Studio Instruction',
  'Front Desk & Concierge',
  'Nutrition & Dietetics',
  'Facility Housekeeping',
  'Sales & Advisory',
];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<IUserModel['role']>('STAFF_USER');
  const [department, setDepartment] = useState('Personal Training & Fitness');
  const [branchId, setBranchId] = useState('BR-HQ');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [status, setStatus] = useState<IUserModel['status']>('ACTIVE');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      let userData: any = null;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/users/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        userData = json.data;
      }

      if (!userData) {
        const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/users', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (listRes.ok) {
          const listJson = await listRes.json();
          const items = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
          userData = items.find((u: any) => (u.id || u._id) === id || u.email === id);
        }
      }

      if (userData) {
        setFullName(userData.fullName || userData.name || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setAvatarUrl(userData.avatarUrl || userData.avatar || '');
        const resolvedRole = userData.role || 'STAFF_USER';
        setRole(resolvedRole);
        setDepartment(userData.department || 'Personal Training & Fitness');
        setMfaEnabled(!!userData.mfaEnabled);
        setStatus((userData.status || 'ACTIVE').toUpperCase() as any);
        if (userData.branchId) setBranchId(userData.branchId);

        const perms: string[] = userData.permissionsList || userData.permissions || [];
        const granted = getGrantedModules(perms, resolvedRole);
        setSelectedModules(granted);
      }
    } catch {
      toast.error('Failed to load user details');
    } finally {
      setFetching(false);
    }
  };

  const toggleModule = (modKey: string) => {
    if (selectedModules.includes(modKey)) {
      setSelectedModules(selectedModules.filter((k) => k !== modKey));
    } else {
      setSelectedModules([...selectedModules, modKey]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const effectivePermissions = resolveEffectivePermissions(selectedModules);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/users/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: fullName.split(' ')[0],
          lastName: fullName.split(' ').slice(1).join(' '),
          name: fullName,
          fullName,
          email,
          phone,
          avatarUrl,
          avatar: avatarUrl,
          role,
          department,
          branchId,
          status: status.toLowerCase(),
          permissions: effectivePermissions,
          permissionsList: effectivePermissions,
          permissionModulesCount: selectedModules.length,
        }),
      });

      if (res.ok) {
        invalidateApiCache('users');

        // Dispatch real-time WebSocket notification with sound to the updated user
        realtimeService.dispatchNotification({
          targetUserId: id,
          title: `Account Permissions Updated`,
          message: `Your operational permissions have been updated in real-time (${selectedModules.length} domains granted).`,
          notificationType: 'success',
          sound: true,
          metadata: { userId: id, email, resource: 'users', permissions: effectivePermissions },
        });

        // If updating the active logged in user, update authStore immediately
        const curUser = useAuthStore.getState().user;
        if (curUser && (curUser.id === id || curUser.email?.toLowerCase() === email.toLowerCase())) {
          useAuthStore.getState().updateUserPermissions(effectivePermissions);
        }

        toast.success(`User profile & permissions for "${fullName}" updated in database!`);
        navigate('/administration/users');
      } else {
        toast.error('Failed to update user in database');
      }
    } catch {
      toast.error('Failed to update user record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Edit User • ${fullName || 'Profile'}`}
        subtitle={`Modify security clearance, RBAC roles, and multi-branch assignment for #${id}.`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/users')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Users Directory</span>
          </Button>
        }
      />

      <div className="w-full max-w-4xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Identity & Contact Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Identity & Contact Details
              </CardTitle>
              <CardDescription className="text-xs">
                Essential employee profile information and operational contact lines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Profile Photo</label>
                <ImageUpload value={avatarUrl} onChange={setAvatarUrl} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name *</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Corporate Email Address *</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phone Number</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assigned Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENT_OPTIONS.map((dep) => (
                        <SelectItem key={dep} value={dep}>
                          {dep}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Branch Assignment Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Security Clearance & Facility Scope
              </CardTitle>
              <CardDescription className="text-xs">
                Configure RBAC clearance hierarchy, multi-branch facility scope, and operational status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Security Role Clearance</label>
                  <Select value={role} onValueChange={(val) => setRole(val as IUserModel['role'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Gym Administrator</SelectItem>
                      <SelectItem value="BRANCH_MANAGER">Branch General Manager</SelectItem>
                      <SelectItem value="TRAINER">Fitness Coach / Trainer</SelectItem>
                      <SelectItem value="RECEPTIONIST">Front Desk Concierge</SelectItem>
                      <SelectItem value="NUTRITIONIST">Certified Nutritionist</SelectItem>
                      <SelectItem value="STAFF_USER">Staff Operator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Primary Branch Scope</label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.length > 0 ? (
                        branchOptions.map((b) => (
                          <SelectItem key={b.value} value={b.value}>
                            {b.label}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="BR-HQ">🏢 Main Facility</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Account Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IUserModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active User</SelectItem>
                      <SelectItem value="SUSPENDED">🔴 Suspended Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Clearance & Permission Grant Matrix */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                User Operational Modules ({selectedModules.length} of {Object.keys(AVAILABLE_MODULE_PERMISSIONS).length} Enabled)
              </CardTitle>
              <CardDescription className="text-xs">
                Select which modules and operational sub-systems this specific user has access to.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(AVAILABLE_MODULE_PERMISSIONS).map((mod) => {
                  const isChecked = selectedModules.includes(mod.key);
                  return (
                    <div
                      key={mod.key}
                      onClick={() => toggleModule(mod.key)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'border-primary/50 bg-primary/5 shadow-xs'
                          : 'border-border bg-card hover:bg-muted/30 opacity-70'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/40'
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate">{mod.label}</span>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{mod.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/administration/users')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || fetching} className="gap-1.5 shadow-sm">
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving Profile...' : 'Save User Profile'}</span>
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
