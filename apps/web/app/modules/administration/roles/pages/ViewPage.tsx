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

export const AVAILABLE_MODULE_PERMISSIONS: Record<string, { label: string; desc: string }> = {
  gym_mgmt: { label: '🏢 Gym Management & Multi-Branch Network', desc: 'Manage campuses, staff biometric rosters, departments, and operating hours' },
  members: { label: '👥 Member Management & Biometric Gate Logs', desc: 'Directory, KYC documents, medical safeguarding, and freeze workflows' },
  fitness: { label: '🏋️ Fitness Workouts & Personal Training', desc: 'Exercise library, PT packages, and group class bookings' },
  nutrition: { label: '🥗 Nutrition, Meal Protocols & Diet Plans', desc: 'Caloric calculations, macronutrient assignments, and supplement plans' },
  finance: { label: '💳 Finance, Tax Invoices & POS Register', desc: 'Tax invoice generation, payment ledger signing, and POS checkout' },
  inventory: { label: '📦 Inventory Valuation & Supplier Purchasing', desc: 'SKU restock orders, COGS audits, and vendor invoices' },
  crm: { label: '💼 CRM, VIP Trials & Sales Pipeline', desc: 'Lead qualification, visitor passes, and campaign automation' },
  analytics: { label: '📊 Business Intelligence & GAAP Reports', desc: 'Executive MRR dashboards, turnstile footfall, and coach yields' },
  admin: { label: '⚙️ Administration & Security Governance', desc: 'IAM user provisioning, RBAC roles, and compliance audit trail' },
};

// Map granular permission strings or role keys to the 9 high-level modules
export const isModuleGranted = (moduleKey: string, permissionsList: string[] = [], roleKey?: string): boolean => {
  if (!permissionsList || permissionsList.length === 0) {
    if (roleKey === 'ADMIN' || roleKey === 'SUPER_ADMIN') return true;
    return false;
  }
  if (permissionsList.includes('*') || permissionsList.includes('all') || roleKey === 'ADMIN' || roleKey === 'SUPER_ADMIN') {
    return true;
  }
  if (permissionsList.includes(moduleKey)) return true;

  const prefixMap: Record<string, string[]> = {
    gym_mgmt: ['gym:', 'gym_mgmt', 'branches:', 'departments:', 'staff:', 'shift-management:', 'holidays:'],
    members: ['members:', 'members', 'member-management:'],
    fitness: ['fitness:', 'fitness', 'workout:', 'classes:', 'trainer:'],
    nutrition: ['nutrition:', 'nutrition', 'diet:'],
    finance: ['finance:', 'finance', 'invoices:', 'payments:'],
    inventory: ['inventory:', 'inventory', 'equipment:'],
    crm: ['crm:', 'crm', 'leads:', 'visitors:'],
    analytics: ['analytics:', 'reports:', 'analytics'],
    admin: ['administration:', 'admin', 'users:', 'roles:', 'settings:'],
  };

  const prefixes = prefixMap[moduleKey] || [moduleKey];
  return permissionsList.some((perm) =>
    prefixes.some((prefix) => perm.toLowerCase().includes(prefix) || perm.toLowerCase().startsWith(prefix))
  );
};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<IRoleModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadRole();
  }, [id]);

  const loadRole = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setRole(json.data);
          return;
        }
      }

      // Fallback to local stored custom list or all roles query
      const listRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (listRes.ok) {
        const listJson = await listRes.json();
        const items: IRoleModel[] = listJson.data?.items || (Array.isArray(listJson.data) ? listJson.data : []);
        const found = items.find((r) => (r.id || r._id) === id || r.roleKey === id);
        if (found) {
          setRole(found);
          return;
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
          value={`${grantedModulesCount} / 9 Domains`}
          change={`${Math.round((grantedModulesCount / 9) * 100)}% Clearance`}
          trend="up"
          timeframe="Module Coverage"
          icon={<Layers className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="ASSIGNED USERS"
          value={`${role?.assignedUsersCount || (roleKey === 'ADMIN' ? 1 : 0)} IAM Users`}
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
        <CardContent className="p-6">
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
            Review live read/write/delete authorization for this role across all 9 GymFlow modules ({grantedModulesCount} of 9 Granted)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(AVAILABLE_MODULE_PERMISSIONS).map(([key, perm]) => {
              const isGranted = isModuleGranted(key, permissionsList, roleKey);
              return (
                <div
                  key={key}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-2 transition-all ${
                    isGranted
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-foreground'
                      : 'bg-muted/20 border-border/60 opacity-40'
                  }`}
                >
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
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
