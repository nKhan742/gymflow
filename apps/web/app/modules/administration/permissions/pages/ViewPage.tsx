import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import {
  ArrowLeft,
  Edit,
  KeyRound,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Users,
  Printer,
  Lock,
  Code2,
  Terminal,
  FileCheck,
  Calendar,
  Database,
  Building,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IPermissionModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [perm, setPerm] = useState<IPermissionModel | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const headers = {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      };

      // 1. Fetch permission by ID
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions/${id}`, {
        headers,
      });

      let foundPerm: any = null;
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          foundPerm = json.data;
        }
      }

      // 2. Fallback search directory
      if (!foundPerm) {
        const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions', {
          headers,
        });
        if (listRes.ok) {
          const listJson = await listRes.json();
          const items: IPermissionModel[] = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
          foundPerm = items.find((p) => (p.id || p._id) === id || p.permissionCode === id || (p as any).code === id);
        }
      }

      if (foundPerm) {
        setPerm(foundPerm);
      }

      // 3. Fetch all system roles to show bound roles
      const rolesRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles', {
        headers,
      });
      if (rolesRes.ok) {
        const rolesJson = await rolesRes.json();
        const roleItems = rolesJson.data?.items || (Array.isArray(rolesJson.data) ? rolesJson.data : []);
        setRoles(roleItems);
      }
    } catch {
      // Network error handled gracefully
    } finally {
      setLoading(false);
    }
  };

  const safeName = perm?.permissionName || (perm as any)?.name || 'Permission Grant';
  const safeCode = perm?.permissionCode || (perm as any)?.code || id || 'gymflow.permission.token';
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  // Filter roles that possess this permission token (or have root '*')
  const boundRoles = roles.filter((r) => {
    const list: string[] = r.permissionsList || r.permissions || [];
    if (r.roleKey === 'ADMIN' || r.roleKey === 'SUPER_ADMIN') return true;
    if (list.includes('*') || list.includes('all')) return true;
    return list.some((p) => p.toLowerCase() === safeCode.toLowerCase() || safeCode.toLowerCase().includes(p.toLowerCase()));
  });

  if (loading) {
    return (
      <PageContainer>
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">Loading permission capability dossier from live database...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Permission Dossier • ${safeName}`}
        subtitle={`Capability grants, action verb scope, and NIST security rating for #${perm?.id || perm?._id || id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/permissions')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dossier</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate(`/administration/permissions/${perm?.id || perm?._id || id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Permission</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="RISK RATING"
          value={perm?.riskLevel || 'LOW'}
          change={perm?.riskLevel === 'CRITICAL' ? '⚠️ High Impact Action' : perm?.riskLevel === 'HIGH' ? '⚡ Elevated Impact' : 'Standard Privilege'}
          trend={perm?.riskLevel === 'CRITICAL' || perm?.riskLevel === 'HIGH' ? 'down' : 'up'}
          timeframe="NIST Classification"
          icon={<ShieldAlert className={`h-5 w-5 ${perm?.riskLevel === 'CRITICAL' ? 'text-destructive' : perm?.riskLevel === 'HIGH' ? 'text-amber-500' : 'text-emerald-500'}`} />}
        />
        <MetricCard
          title="BOUND RBAC ROLES"
          value={`${boundRoles.length > 0 ? boundRoles.length : perm?.grantedRolesCount || 1} Roles`}
          change="Access Spread"
          trend="up"
          timeframe="Role Policies Bound"
          icon={<Layers className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ACTION VERB"
          value={perm?.actionType || 'READ'}
          change="Operation Category"
          trend="up"
          timeframe="Action Scope"
          icon={<KeyRound className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="GRANT STATUS"
          value={perm?.status === 'ACTIVE' || !perm?.status ? '🟢 ACTIVE' : '🔴 RESTRICTED'}
          change={perm?.isSystemProtected ? '🔒 System Protected' : 'Tenant Manageable'}
          trend="up"
          timeframe="Policy State"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Hero Header Card */}
      <Card className="mb-6 border border-border shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                <AvatarImage src={perm?.iconAvatarUrl} alt={safeName} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {safeInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">{safeName}</h2>
                  <Badge variant="outline" className="text-[11px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {safeCode}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {perm?.moduleDomain || 'Operations'}
                  </Badge>
                  {perm?.isSystemProtected && (
                    <Badge variant="default" className="text-[10px] font-bold">
                      🔒 SYSTEM PROTECTED
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium max-w-3xl">
                  {perm?.description || 'Granular authorization token governing access to operational features across GymFlow.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant={
                  perm?.riskLevel === 'CRITICAL'
                    ? 'destructive'
                    : perm?.riskLevel === 'HIGH'
                    ? 'warning'
                    : 'outline'
                }
                className="text-xs px-2.5 py-1 font-bold font-mono"
              >
                NIST: {perm?.riskLevel || 'LOW'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Side-by-Side Detailed Dossier Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-6">
        {/* Left Column (6 Cols): Technical Specification & Security Metadata */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" />
                Technical Specification & Token Attributes
              </CardTitle>
              <CardDescription className="text-xs">
                Cryptographic token parameters enforced across all microservices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Machine Token Key
                  </span>
                  <code className="text-xs font-mono font-bold text-foreground block truncate">
                    {safeCode}
                  </code>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Operational Module
                  </span>
                  <span className="text-xs font-bold text-foreground block">
                    {perm?.moduleDomain || 'Operations'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Action Verb Type
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                    {perm?.actionType || 'READ'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    NIST Risk Rating
                  </span>
                  <span className="text-xs font-bold text-foreground block">
                    {perm?.riskLevel || 'LOW'} Security Tier
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Policy Immutability
                  </span>
                  <span className="text-xs font-bold text-foreground block">
                    {perm?.isSystemProtected ? '🔒 Protected Core' : 'Editable Policy'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Enforcement Status
                  </span>
                  <span className="text-xs font-bold text-foreground block">
                    {perm?.status === 'ACTIVE' || !perm?.status ? '🟢 Active & Bound' : '🔴 Suspended'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  Tenant ID: {(perm as any)?.tenantId || 'Active Tenant'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created: {perm?.createdAt ? new Date(perm.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (6 Cols): Bound RBAC Security Policies */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-500" />
                    Bound RBAC Roles ({boundRoles.length})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Security roles configured with operational clearance for this capability
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {boundRoles.length} Roles Assigned
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {boundRoles.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-border rounded-xl">
                  <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Only Master Root Administrator accounts currently carry wildcard authority for this token.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {boundRoles.map((r: any) => (
                    <div
                      key={r.id || r._id}
                      onClick={() => navigate(`/administration/roles/${r.id || r._id}`)}
                      className="p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground truncate">
                            {r.roleName || r.name}
                          </span>
                          <Badge variant="outline" className="text-[9px] font-mono">
                            {r.roleKey || r.code}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">
                          {r.description || 'Facility security role'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={r.hierarchyTier === 1 ? 'default' : r.hierarchyTier === 2 ? 'success' : 'secondary'}
                          className="text-[9px] font-bold"
                        >
                          Tier {r.hierarchyTier || 3}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Technical Integration & API Guard Card */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            Security Guard Implementation & Policy Enforcement
          </CardTitle>
          <CardDescription className="text-xs">
            How this granular capability token is evaluated and enforced across GymFlow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backend Route Guard */}
            <div className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3 w-3 text-emerald-400" />
                  API Route Middleware Guard
                </span>
                <span className="text-[9px]">rbac.middleware.ts</span>
              </div>
              <div className="text-[11px] leading-relaxed text-slate-300">
                <span className="text-purple-400">router</span>.
                <span className="text-blue-400">post</span>(
                <span className="text-emerald-300">'/api/v1/...'</span>,
                <br />
                &nbsp;&nbsp;<span className="text-amber-300">requirePermission</span>(
                <span className="text-emerald-300">'{safeCode}'</span>
                ),
                <br />
                &nbsp;&nbsp;controller.execute
                <br />
                );
              </div>
            </div>

            {/* Frontend Component Guard */}
            <div className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-3 w-3 text-cyan-400" />
                  React UI Authorization Guard
                </span>
                <span className="text-[9px]">ProtectedAction.tsx</span>
              </div>
              <div className="text-[11px] leading-relaxed text-slate-300">
                &lt;<span className="text-cyan-400">HasPermission</span>{' '}
                <span className="text-amber-300">permission</span>=
                <span className="text-emerald-300">"{safeCode}"</span>&gt;
                <br />
                &nbsp;&nbsp;&lt;<span className="text-blue-400">Button</span>&gt;
                {safeName}&lt;/<span className="text-blue-400">Button</span>&gt;
                <br />
                &lt;/<span className="text-cyan-400">HasPermission</span>&gt;
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
