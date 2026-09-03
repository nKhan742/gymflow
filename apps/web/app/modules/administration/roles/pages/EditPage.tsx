import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Shield, Layers } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { IRoleModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { AVAILABLE_MODULE_PERMISSIONS, isModuleGranted } from './ViewPage';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [roleName, setRoleName] = useState('');
  const [roleKey, setRoleKey] = useState('');
  const [description, setDescription] = useState('');
  const [iconAvatarUrl, setIconAvatarUrl] = useState<string | undefined>(undefined);
  const [hierarchyTier, setHierarchyTier] = useState(3);
  const [isSystemRole, setIsSystemRole] = useState(false);
  const [status, setStatus] = useState<IRoleModel['status']>('ACTIVE');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    loadRoleData();
  }, [id]);

  const loadRoleData = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      let roleData: any = null;

      // 1. Try fetching by ID from live backend
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        roleData = json.data;
      }

      // 2. If not found by direct ID, search directory
      if (!roleData) {
        const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (listRes.ok) {
          const listJson = await listRes.json();
          const items = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
          roleData = items.find((r: any) => (r.id || r._id) === id || r.roleKey === id);
        }
      }

      if (roleData) {
        setRoleName(roleData.roleName || roleData.name || '');
        setRoleKey(roleData.roleKey || roleData.code || '');
        setDescription(roleData.description || '');
        setIconAvatarUrl(roleData.iconAvatarUrl);
        setHierarchyTier(roleData.hierarchyTier || 3);
        setIsSystemRole(!!roleData.isSystemRole);
        setStatus((roleData.status || 'ACTIVE').toUpperCase() as any);

        const perms = roleData.permissionsList || roleData.permissions || [];
        // Map to which of the 9 high-level modules are granted
        const granted = Object.keys(AVAILABLE_MODULE_PERMISSIONS).filter((modKey) =>
          isModuleGranted(modKey, perms, roleData.roleKey || roleData.code)
        );
        setSelectedPermissions(granted);
      }
    } catch {
      toast.error('Failed to load role details');
    } finally {
      setFetching(false);
    }
  };

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedRole: Partial<IRoleModel> = {
      roleName,
      roleKey,
      description,
      iconAvatarUrl,
      hierarchyTier,
      isSystemRole,
      status,
      permissionsList: selectedPermissions,
      permissionModulesCount: selectedPermissions.length,
    };

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roleName,
          roleName,
          code: roleKey,
          roleKey,
          description,
          hierarchyTier,
          isSystemRole,
          status: status.toLowerCase(),
          permissionsList: selectedPermissions,
          permissions: selectedPermissions,
          permissionModulesCount: selectedPermissions.length,
        }),
      });

      if (res.ok) {
        toast.success(`Role "${roleName}" updated successfully! (${selectedPermissions.length} / 9 modules active)`);
        navigate(`/administration/roles/${id}`);
      } else {
        toast.error('Could not save role changes');
      }
    } catch {
      toast.error('Network error updating role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Security Role • ${roleName || 'Policy'}`}
        subtitle={`Configure permission grant matrices, operational boundaries, and security clearance for #${id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(`/administration/roles/${id}`)}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button size="sm" className="gap-1.5 shadow-sm" disabled={loading || fetching} onClick={handleSubmit}>
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Policy Changes'}</span>
            </Button>
          </div>
        }
      />

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity & Scope */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Role Identity & Security Hierarchy
              </CardTitle>
              <CardDescription className="text-xs">
                Update identifier token, classification label, and authorization tier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Role Display Name *</label>
                  <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">System Security Token / Key *</label>
                  <Input value={roleKey} onChange={(e) => setRoleKey(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Hierarchy Clearance Tier</label>
                  <Select value={String(hierarchyTier)} onValueChange={(val) => setHierarchyTier(Number(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">👑 Tier 1 - Root / Master Authority</SelectItem>
                      <SelectItem value="2">🏛️ Tier 2 - Facility Leadership</SelectItem>
                      <SelectItem value="3">🏢 Tier 3 - Department Manager</SelectItem>
                      <SelectItem value="4">🚪 Tier 4 - Frontline Operator</SelectItem>
                      <SelectItem value="5">⚖️ Tier 5 - Auditor / Read-Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Policy Type</label>
                  <Select value={isSystemRole ? 'true' : 'false'} onValueChange={(val) => setIsSystemRole(val === 'true')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Policy Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Custom Policy (Editable & Deletable)</SelectItem>
                      <SelectItem value="true">Protected System Role</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Operational Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IRoleModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active Policy</SelectItem>
                      <SelectItem value="ARCHIVED">🔴 Archived / Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Policy Scope Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-3 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
          </Card>

          {/* Module Capabilities Matrix */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-500" />
                    Module Permission Grants ({selectedPermissions.length} of 9 Granted)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Select module domains this role is authorized to operate within
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setSelectedPermissions(Object.keys(AVAILABLE_MODULE_PERMISSIONS))}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-muted-foreground"
                    onClick={() => setSelectedPermissions([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(AVAILABLE_MODULE_PERMISSIONS).map(([key, perm]) => {
                  const isChecked = selectedPermissions.includes(key);
                  return (
                    <div
                      key={key}
                      onClick={() => togglePermission(key)}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-foreground'
                          : 'border-border bg-card/40 opacity-50 hover:opacity-80'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">{perm.label}</span>
                        <p className="text-[10px] text-muted-foreground">{perm.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4 w-4 accent-emerald-500 rounded mt-0.5 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">
                Current authorization coverage: <strong>{selectedPermissions.length} / 9 Domains</strong>
              </span>
              <Button type="submit" disabled={loading || fetching} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving Policy...' : 'Save & Apply Grants'}</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
