import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ArrowLeft, Save, Shield, Layers, CheckCircle2, AlertCircle, KeyRound, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { IRoleModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import {
  AVAILABLE_MODULE_PERMISSIONS,
  getGrantedModules,
  resolveEffectivePermissions,
  IModuleDefinition,
} from '../permissions.config';
import { realtimeService } from '../../../../core/notifications/realtimeService';
import { invalidateApiCache } from '../../../../core/api/liveApiCache';
import { useAuthStore } from '../../../../core/store/authStore';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [roleName, setRoleName] = useState('');
  const [roleKey, setRoleKey] = useState('');
  const [description, setDescription] = useState('');
  const [iconAvatarUrl, setIconAvatarUrl] = useState<string | undefined>(undefined);
  const [hierarchyTier, setHierarchyTier] = useState(3);
  const [isSystemRole, setIsSystemRole] = useState(false);
  const [status, setStatus] = useState<IRoleModel['status']>('ACTIVE');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [rawPermissions, setRawPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    loadRoleData();
  }, [id]);

  const loadRoleData = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      let roleData: any = null;

      // 1. Fetch by ID from live backend
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
        setHierarchyTier(roleData.hierarchyTier ?? 3);
        setIsSystemRole(!!roleData.isSystemRole);
        setStatus((roleData.status || 'ACTIVE').toUpperCase() as any);

        const perms: string[] = roleData.permissionsList || roleData.permissions || [];
        setRawPermissions(perms);
        setSelectedPermissions(perms);

        // Derive which module domains are granted
        const granted = getGrantedModules(perms, roleData.roleKey || roleData.code);
        setSelectedModules(granted);
      }
    } catch {
      toast.error('Failed to load role details from database');
    } finally {
      setFetching(false);
    }
  };

  const toggleModule = (moduleKey: string) => {
    const mod = AVAILABLE_MODULE_PERMISSIONS[moduleKey];
    if (!mod) return;
    const modCapCodes = mod.capabilities.map((c) => c.code);
    const hasAll = modCapCodes.every((code) => selectedPermissions.includes(code));

    if (hasAll) {
      setSelectedPermissions((prev) => prev.filter((p) => !modCapCodes.includes(p)));
      setSelectedModules((prev) => prev.filter((m) => m !== moduleKey));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...modCapCodes])));
      setSelectedModules((prev) => Array.from(new Set([...prev, moduleKey])));
    }
  };

  const toggleCapability = (capCode: string, moduleKey: string) => {
    setSelectedPermissions((prev) => {
      const exists = prev.includes(capCode);
      const next = exists ? prev.filter((c) => c !== capCode) : [...prev, capCode];
      const mod = AVAILABLE_MODULE_PERMISSIONS[moduleKey];
      if (mod) {
        const hasAny = mod.capabilities.some((c) => next.includes(c.code));
        setSelectedModules((prevMods) => {
          if (hasAny && !prevMods.includes(moduleKey)) {
            return [...prevMods, moduleKey];
          } else if (!hasAny && prevMods.includes(moduleKey)) {
            return prevMods.filter((m) => m !== moduleKey);
          }
          return prevMods;
        });
      }
      return next;
    });
  };

  const handleSelectAllModules = () => {
    const allCodes: string[] = [];
    Object.values(AVAILABLE_MODULE_PERMISSIONS).forEach((m) => {
      m.capabilities.forEach((c) => allCodes.push(c.code));
    });
    setSelectedPermissions(allCodes);
    setSelectedModules(Object.keys(AVAILABLE_MODULE_PERMISSIONS));
  };

  const handleClearAllModules = () => {
    setSelectedPermissions([]);
    setSelectedModules([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const effectivePermissions = selectedPermissions;

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
          permissionsList: effectivePermissions,
          permissions: effectivePermissions,
          permissionModulesCount: selectedModules.length,
        }),
      });

      if (res.ok) {
        invalidateApiCache('roles');

        // Immediately update session in this active window if current user has this role
        const curUser = useAuthStore.getState().user;
        const curRole = (curUser?.role || '').toUpperCase().trim();
        const targetRole = (roleKey || '').toUpperCase().trim();
        if (curUser && (curRole === targetRole || curRole.includes(targetRole) || targetRole.includes(curRole))) {
          useAuthStore.getState().setExactPermissions(effectivePermissions);
        }

        // Dispatch real-time WebSocket notification with sound to all holders of this role
        realtimeService.dispatchNotification({
          targetRole: roleKey,
          title: `Security Policy Updated: ${roleName}`,
          message: `Your account permissions and clearance tier have been updated in real-time (${selectedModules.length} domains granted).`,
          notificationType: 'success',
          sound: true,
          metadata: { roleKey, resource: 'roles', permissions: effectivePermissions },
        });

        toast.success(`Role "${roleName}" saved successfully! (${selectedModules.length} of ${Object.keys(AVAILABLE_MODULE_PERMISSIONS).length} domains granted)`);
        navigate(`/administration/roles/${id}`);
      } else {
        toast.error('Failed to persist role policy to live database');
      }
    } catch {
      toast.error('Network error while updating role policy');
    } finally {
      setLoading(false);
    }
  };

  const totalModules = Object.keys(AVAILABLE_MODULE_PERMISSIONS).length;
  const coveragePercent = Math.round((selectedModules.length / totalModules) * 100);

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
              <span>{loading ? 'Saving Policy...' : 'Save Policy Changes'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        {/* Side-by-Side Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 Cols): Role Identity, Governance & Clearance */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Role Identity & Security Hierarchy
                </CardTitle>
                <CardDescription className="text-xs">
                  Update identifier token, classification label, and clearance tier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Role Display Name *</label>
                  <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. Fitness Coach & Personal Trainer"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">System Security Token / Key *</label>
                  <Input
                    value={roleKey}
                    onChange={(e) => setRoleKey(e.target.value)}
                    placeholder="e.g. TRAINER"
                    required
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Machine identifier used by backend authentication guards
                  </span>
                </div>

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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Policy Governance</label>
                    <Select value={isSystemRole ? 'true' : 'false'} onValueChange={(val) => setIsSystemRole(val === 'true')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Policy Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Custom Policy</SelectItem>
                        <SelectItem value="true">🔒 System Protected</SelectItem>
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
                        <SelectItem value="ARCHIVED">🔴 Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Policy Scope Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe the operational responsibilities and system boundaries for this role..."
                    className="w-full text-xs p-3 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Clearance Summary Card */}
            <Card className="border border-border shadow-sm bg-muted/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Authorization Telemetry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Granted Domains:</span>
                  <span className="font-mono font-bold text-foreground">
                    {selectedModules.length} / {totalModules} Modules
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${coveragePercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Coverage: {coveragePercent}%</span>
                  <span>{selectedModules.length === totalModules ? 'Full System Clearance' : 'Scoped Role'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (7 Cols): Module Grants & Granular Permissions List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Module Capability Matrix */}
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="h-4 w-4 text-emerald-500" />
                      Module Permission Grants ({selectedModules.length} of {totalModules} Granted)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Toggle high-level operational modules to grant access to whole domains
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2.5"
                      onClick={handleSelectAllModules}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2.5 text-muted-foreground"
                      onClick={handleClearAllModules}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(AVAILABLE_MODULE_PERMISSIONS).map(([key, mod]: [string, IModuleDefinition]) => {
                    const modCapCodes = mod.capabilities.map((c) => c.code);
                    const selectedCount = modCapCodes.filter((code) =>
                      selectedPermissions.includes(code) || selectedPermissions.includes('*') || selectedPermissions.includes('all')
                    ).length;
                    const isAllSelected = selectedCount === modCapCodes.length && modCapCodes.length > 0;
                    const isPartial = selectedCount > 0 && !isAllSelected;

                    return (
                      <div
                        key={key}
                        onClick={() => toggleModule(key)}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 cursor-pointer select-none transition-all ${
                          isAllSelected
                            ? 'border-emerald-500/60 bg-emerald-500/10 shadow-sm'
                            : isPartial
                            ? 'border-primary/50 bg-primary/5 shadow-2xs'
                            : 'border-border bg-card/40 opacity-60 hover:opacity-100 hover:border-border/80'
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <span className="text-xs font-bold text-foreground block leading-tight truncate">
                            {mod.label}
                          </span>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">
                            {mod.desc}
                          </p>
                          <div className="flex items-center gap-1.5 pt-1">
                            <Badge
                              variant="outline"
                              className={`text-[9px] font-mono font-bold ${
                                isAllSelected
                                  ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                                  : isPartial
                                  ? 'bg-primary/20 text-primary border-primary/40'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {selectedCount} / {mod.capabilities.length} Capabilities
                            </Badge>
                          </div>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isAllSelected
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : isPartial
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-input bg-background'
                          }`}
                        >
                          {(isAllSelected || isPartial) && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Granular Permission Breakdown List */}
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  Granular Permission Capabilities Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  Check or uncheck individual operational permissions across modules (e.g. Salary View under Finance)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(AVAILABLE_MODULE_PERMISSIONS).map(([modKey, mod]) => {
                  const modCapCodes = mod.capabilities.map((c) => c.code);
                  const selectedInMod = modCapCodes.filter((code) =>
                    selectedPermissions.includes(code) || selectedPermissions.includes('*') || selectedPermissions.includes('all')
                  ).length;
                  const isAll = selectedInMod === modCapCodes.length && modCapCodes.length > 0;

                  return (
                    <div key={modKey} className="rounded-xl border border-border p-3.5 bg-card/40 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-border pb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {mod.label}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[9px] font-mono font-bold ${
                              isAll
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                : selectedInMod > 0
                                ? 'bg-primary/10 text-primary border-primary/30'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {selectedInMod} / {mod.capabilities.length} GRANTED
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] px-2 text-primary hover:bg-primary/10"
                          onClick={() => toggleModule(modKey)}
                        >
                          {isAll ? 'Revoke All' : 'Grant All'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {mod.capabilities.map((cap) => {
                          const isCapChecked =
                            selectedPermissions.includes(cap.code) ||
                            selectedPermissions.includes('*') ||
                            selectedPermissions.includes('all');

                          return (
                            <div
                              key={cap.code}
                              onClick={() => toggleCapability(cap.code, modKey)}
                              className={`flex items-center justify-between text-xs p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                                isCapChecked
                                  ? 'bg-primary/5 border-primary/40 shadow-2xs'
                                  : 'bg-background/80 border-border/70 opacity-60 hover:opacity-100 hover:border-border'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                    isCapChecked
                                      ? 'bg-primary border-primary text-primary-foreground'
                                      : 'border-input bg-background'
                                  }`}
                                >
                                  {isCapChecked && <Check className="h-3 w-3" />}
                                </div>
                                <div className="space-y-0.5 min-w-0 truncate">
                                  <span className="font-semibold text-foreground block truncate">{cap.name}</span>
                                  <code className="text-[10px] text-muted-foreground font-mono">{cap.code}</code>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <Badge
                                  variant="outline"
                                  className={`text-[9px] font-mono font-bold ${
                                    cap.action === 'SIGN_OFF'
                                      ? 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                                      : cap.action === 'CREATE'
                                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                                      : cap.action === 'UPDATE'
                                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {cap.action}
                                </Badge>
                                <Badge
                                  variant={cap.risk === 'CRITICAL' ? 'destructive' : cap.risk === 'HIGH' ? 'warning' : 'outline'}
                                  className="text-[9px] font-bold"
                                >
                                  {cap.risk}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                  Authorized Domains: <strong>{selectedModules.length} of {totalModules}</strong>
                </span>
                <Button type="submit" disabled={loading || fetching} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving Policy...' : 'Save & Apply Grants'}</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};
