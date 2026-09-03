import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Shield, KeyRound, Layers, CheckCircle2, Users, Printer, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IRoleModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

import {
  AVAILABLE_MODULE_PERMISSIONS,
  isModuleGranted,
  getGrantedModules,
} from '../permissions.config';

export { AVAILABLE_MODULE_PERMISSIONS, isModuleGranted, getGrantedModules };

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<IRoleModel | null>(null);
  const [assignedPersonnel, setAssignedPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadRole();
  }, [id]);

  const loadRole = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const headers = {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      };

      let fetchedRole: IRoleModel | null = null;
      try {
        const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles/${id}`, { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            fetchedRole = json.data;
          }
        }
      } catch {}

      if (!fetchedRole) {
        const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles', { headers }).catch(() => null);
        if (listRes && listRes.ok) {
          const listJson = await listRes.json();
          const items: IRoleModel[] = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
          const found = items.find((r) => (r.id || r._id) === id || r.roleKey === id);
          if (found) fetchedRole = found;
        }
      }

      if (fetchedRole) {
        setRole(fetchedRole);
        const targetRoleKey = (fetchedRole.roleKey || (fetchedRole as any).code || (fetchedRole as any).name || '').toUpperCase().trim();

        // Query users and staff holding this role
        const [usersRes, staffRes] = await Promise.all([
          fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/users', { headers }).catch(() => null),
          fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym-management/staff', { headers }).catch(() => null),
        ]);

        const personnelMap = new Map<string, any>();
        if (usersRes && usersRes.ok) {
          const uJson = await usersRes.json().catch(() => ({}));
          const uList = uJson.data?.items || (Array.isArray(uJson.data) ? uJson.data : []);
          uList.forEach((u: any) => {
            if (u.role?.toUpperCase().trim() === targetRoleKey && u.isDeleted !== true) {
              const key = (u.email || u.id || u._id).toLowerCase().trim();
              personnelMap.set(key, {
                id: u.id || u._id,
                name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User',
                email: u.email,
                phone: u.phone || 'N/A',
                code: u.code || `USR-${(u.id || '').slice(-4).toUpperCase()}`,
                department: u.department || 'Operations',
                type: 'SYSTEM_USER',
                status: u.status || (u.isActive ? 'ACTIVE' : 'INACTIVE'),
                avatar: u.avatar || u.avatarUrl,
              });
            }
          });
        }

        if (staffRes && staffRes.ok) {
          const sJson = await staffRes.json().catch(() => ({}));
          const sList = sJson.data?.items || (Array.isArray(sJson.data) ? sJson.data : []);
          sList.forEach((s: any) => {
            if (s.role?.toUpperCase().trim() === targetRoleKey && s.isDeleted !== true) {
              const key = (s.email || s.id || s._id).toLowerCase().trim();
              if (!personnelMap.has(key)) {
                personnelMap.set(key, {
                  id: s.id || s._id,
                  name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Staff Member',
                  email: s.email,
                  phone: s.phone || 'N/A',
                  code: s.code || `STF-${(s.id || '').slice(-4).toUpperCase()}`,
                  department: s.department || 'Fitness',
                  type: 'ONBOARDED_STAFF',
                  status: s.status || 'ACTIVE',
                  avatar: s.avatar,
                });
              }
            }
          });
        }

        const personnelList = Array.from(personnelMap.values());
        setAssignedPersonnel(personnelList);
        if (personnelList.length > 0) {
          setRole((prev: any) => prev ? { ...prev, assignedUsersCount: personnelList.length } : prev);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const safeName = role?.roleName || (role as any)?.name || 'Role Policy';
  const safeInitials = safeName.slice(0, 2).toUpperCase();
  const permissionsList = role?.permissionsList || (role as any)?.permissions || [];
  const roleKey = role?.roleKey || (role as any)?.code || '';

  const totalModulesCount = Object.keys(AVAILABLE_MODULE_PERMISSIONS).length;
  const grantedModulesCount = Object.keys(AVAILABLE_MODULE_PERMISSIONS).filter((k) =>
    isModuleGranted(k, permissionsList, roleKey)
  ).length;

  return (
    <PageContainer>
      <PageHeader
        title={`RBAC Policy Dossier • ${safeName}`}
        subtitle={`Privilege grant matrix, operational boundaries, and security rules for #${role?.id || role?._id || id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/roles')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Policy</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate(`/administration/roles/${role?.id || role?._id || id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Role</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="HIERARCHY TIER"
          value={`Tier ${role?.hierarchyTier || 3}`}
          change={role?.hierarchyTier === 1 ? '👑 Root Bypass' : role?.hierarchyTier === 2 ? '🏛️ Facility Leadership' : '🚪 Staff Operations'}
          trend="up"
          timeframe="Authorization Level"
          icon={<Shield className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="PERMISSIONS GRANTED"
          value={`${grantedModulesCount} / ${totalModulesCount} Domains`}
          change={`${Math.round((grantedModulesCount / totalModulesCount) * 100)}% Clearance`}
          trend="up"
          timeframe="Module Coverage"
          icon={<Layers className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="ASSIGNED USERS"
          value={`${assignedPersonnel.length || role?.assignedUsersCount || 0} IAM Users`}
          change="Active Role Holders"
          trend="up"
          timeframe="Staff Population"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ROLE STATUS"
          value={role?.status === 'ACTIVE' || !role?.status ? '🟢 ACTIVE' : '🔴 ARCHIVED'}
          change={role?.isSystemRole ? '🔒 Protected System Role' : 'Custom Facility Policy'}
          trend="up"
          timeframe="Governance"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Hero Header Card */}
      <Card className="mb-6 border border-border">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                <AvatarImage src={role?.iconAvatarUrl} alt={safeName} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {safeInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">{safeName}</h2>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {roleKey}
                  </Badge>
                  {role?.isSystemRole ? (
                    <Badge variant="default" className="text-[10px] font-bold">
                      🔒 SYSTEM ROLE
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] font-bold">
                      CUSTOM ROLE
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {role?.description || 'Custom security policy defining staff permissions and operational boundaries.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Role Holders & Assigned Personnel Card */}
      <Card className="mb-6 border border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Active Role Holders & Assigned Personnel
              </CardTitle>
              <CardDescription className="text-xs">
                Staff members and system accounts operating with {roleKey} authorization ({assignedPersonnel.length} Active Personnel)
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary border-primary/20 bg-primary/5">
              {assignedPersonnel.length} {assignedPersonnel.length === 1 ? 'PERSONNEL ASSIGNED' : 'PERSONNEL ASSIGNED'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {assignedPersonnel.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assignedPersonnel.map((p) => {
                const initials = (p.name || 'Staff').slice(0, 2).toUpperCase();
                return (
                  <div
                    key={p.id || p.email}
                    className="p-3.5 rounded-xl border border-border bg-card/60 flex items-center justify-between gap-3 shadow-2xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 border border-border shrink-0 rounded-xl">
                        <AvatarImage src={p.avatar} alt={p.name} />
                        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary rounded-xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground truncate block">{p.name}</span>
                          <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                            {p.code}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono truncate">{p.email}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                          <span>{p.department}</span>
                          <span>•</span>
                          <span>{p.phone}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant="success" className="text-[9px] font-bold">
                        {p.status?.toUpperCase() || 'ACTIVE'}
                      </Badge>
                      <span className="text-[9px] font-mono text-muted-foreground">
                        {p.type === 'SYSTEM_USER' ? '💻 Portal User' : '🏋️ Campus Staff'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-2 bg-muted/20">
              <Users className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p className="text-xs font-medium text-muted-foreground">
                No staff members or user accounts currently hold the <strong className="text-foreground">{roleKey}</strong> role.
              </p>
              <p className="text-[11px] text-muted-foreground/80">
                You can assign this role in <strong className="text-foreground">Gym Management ➔ Staff</strong> or <strong className="text-foreground">Administration ➔ Users</strong>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Granted Permissions Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-500" />
            Granted Domain Capabilities Matrix
          </CardTitle>
          <CardDescription className="text-xs">
            Review live read/write/delete authorization for this role across all {totalModulesCount} GymFlow modules ({grantedModulesCount} of {totalModulesCount} Granted)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(AVAILABLE_MODULE_PERMISSIONS).map(([key, perm]) => {
              const isGranted = isModuleGranted(key, permissionsList, roleKey);
              return (
                <div
                  key={key}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    isGranted
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-foreground'
                      : 'bg-muted/20 border-border/60 opacity-40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">{perm.label}</span>
                      <p className="text-[10px] text-muted-foreground">{perm.desc}</p>
                    </div>
                    <Badge
                      variant={isGranted ? 'success' : 'outline'}
                      className={`text-[9px] font-bold shrink-0 mt-0.5 ${isGranted ? 'bg-emerald-500 text-white' : ''}`}
                    >
                      {isGranted ? 'GRANTED' : 'DENIED'}
                    </Badge>
                  </div>
                  {isGranted && perm.capabilities && perm.capabilities.length > 0 && (
                    <div className="pt-2 border-t border-emerald-500/20 space-y-1">
                      <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">
                        Active Sub-Capabilities:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {perm.capabilities.slice(0, 3).map((cap) => (
                          <span
                            key={cap.code}
                            className="inline-flex items-center text-[9px] bg-background/80 px-1.5 py-0.5 rounded border border-border text-foreground font-mono"
                          >
                            {cap.name}
                          </span>
                        ))}
                        {perm.capabilities.length > 3 && (
                          <span className="text-[9px] text-muted-foreground self-center">
                            +{perm.capabilities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
