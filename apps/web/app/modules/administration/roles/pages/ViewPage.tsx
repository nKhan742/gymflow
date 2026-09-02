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

const AVAILABLE_MODULE_PERMISSIONS: Record<string, { label: string; desc: string }> = {
  gym_mgmt: { label: '🏢 Gym Management & Multi-Branch Network', desc: 'Manage campuses, staff biometric rosters, and operating hours' },
  members: { label: '👥 Member Management & Biometric Gate Logs', desc: 'Directory, KYC documents, medical safeguarding, and freeze workflows' },
  finance: { label: '💳 Finance, Tax Invoices & POS Register', desc: 'Tax invoice generation, payment ledger signing, and POS checkout' },
  inventory: { label: '📦 Inventory Valuation & Supplier Purchasing', desc: 'SKU restock orders, COGS audits, and vendor invoices' },
  fitness: { label: '🏋️ Fitness Workouts & Personal Training', desc: 'Exercise library, PT packages, and group class bookings' },
  nutrition: { label: '🥗 Nutrition, Meal Protocols & Diet Plans', desc: 'Caloric calculations, macronutrient assignments, and supplement plans' },
  crm: { label: '💼 CRM, VIP Trials & Sales Pipeline', desc: 'Lead qualification, visitor passes, and campaign automation' },
  analytics: { label: '📊 Business Intelligence & GAAP Reports', desc: 'Executive MRR dashboards, turnstile footfall, and coach yields' },
  admin: { label: '⚙️ Administration & Security Governance', desc: 'IAM user provisioning, RBAC roles, and compliance audit trail' },
};

const DEFAULT_ROLES: Record<string, IRoleModel> = {
  'ROL-101': {
    id: 'ROL-101',
    _id: 'ROL-101',
    roleName: 'Super Administrator (Root)',
    roleKey: 'ROLE_SUPER_ADMIN',
    description: 'Unrestricted global root clearance across all multi-tenant branches, financial ledgers, and security policies.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isSystemRole: true,
    assignedUsersCount: 2,
    permissionModulesCount: 9,
    permissionsList: ['gym_mgmt', 'members', 'finance', 'inventory', 'fitness', 'nutrition', 'crm', 'analytics', 'admin'],
    hierarchyTier: 1,
    status: 'ACTIVE',
    createdBy: 'System Root Provisioning',
    createdAt: '2026-08-25T08:00:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
  },
  'ROL-102': {
    id: 'ROL-102',
    _id: 'ROL-102',
    roleName: 'Facility Administrator',
    roleKey: 'ROLE_FACILITY_ADMIN',
    description: 'Full campus operational administration covering turnstile hardware, staff shifts, finance billing, and member profiles.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isSystemRole: true,
    assignedUsersCount: 4,
    permissionModulesCount: 8,
    permissionsList: ['gym_mgmt', 'members', 'finance', 'inventory', 'fitness', 'nutrition', 'crm', 'analytics'],
    hierarchyTier: 2,
    status: 'ACTIVE',
    createdBy: 'System Root Provisioning',
    createdAt: '2026-08-25T08:00:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
  },
  'ROL-103': {
    id: 'ROL-103',
    _id: 'ROL-103',
    roleName: 'Branch General Manager',
    roleKey: 'ROLE_BRANCH_MANAGER',
    description: 'Branch-scoped executive management covering staff scheduling, lead pipelines, POS cash register, and member attendance.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isSystemRole: true,
    assignedUsersCount: 6,
    permissionModulesCount: 7,
    permissionsList: ['gym_mgmt', 'members', 'finance', 'fitness', 'nutrition', 'crm', 'analytics'],
    hierarchyTier: 3,
    status: 'ACTIVE',
    createdBy: 'System Root Provisioning',
    createdAt: '2026-08-26T08:00:00.000Z',
    updatedAt: '2026-08-26T08:00:00.000Z',
  },
};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<IRoleModel>(DEFAULT_ROLES['ROL-102']);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_roles');
    if (stored) {
      const customList: IRoleModel[] = JSON.parse(stored);
      const found = customList.find((r) => (r.id || r._id) === id);
      if (found) {
        setRole({ ...DEFAULT_ROLES['ROL-102'], ...found });
        return;
      }
    }

    if (DEFAULT_ROLES[id]) {
      setRole(DEFAULT_ROLES[id]);
    }
  }, [id]);

  const safeName = role?.roleName || 'Role Policy';
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title={`RBAC Policy Dossier • ${safeName}`}
        subtitle={`Privilege grant matrix, operational boundaries, and security rules for #${role?.id || id || 'ROL-102'}`}
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
              onClick={() => navigate(`/administration/roles/${role?.id || id}/edit`)}
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
          value={`Tier ${role?.hierarchyTier || 2}`}
          change={role?.hierarchyTier === 1 ? '👑 Super Admin Bypass' : '🏛️ Campus Operational'}
          trend="up"
          timeframe="Authorization Level"
          icon={<Shield className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="PERMISSIONS GRANTED"
          value={`${role?.permissionModulesCount || role?.permissionsList?.length || 0} / 9 Domains`}
          change="Granular Scope Active"
          trend="up"
          timeframe="Module Coverage"
          icon={<Layers className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="ASSIGNED USERS"
          value={`${role?.assignedUsersCount || 0} IAM Users`}
          change="Active Role Holders"
          trend="up"
          timeframe="Staff Population"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ROLE STATUS"
          value={role?.status === 'ACTIVE' ? '🟢 ACTIVE' : '📦 ARCHIVED'}
          change={role?.isSystemRole ? '🔒 Protected System Role' : 'Custom Policy'}
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
                    {role?.roleKey}
                  </Badge>
                  {role?.isSystemRole && (
                    <Badge variant="default" className="text-[10px] font-bold">
                      🔒 SYSTEM ROLE
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {role?.description}
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
            Review live read/write/delete authorization for this role across all 9 GymFlow modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(AVAILABLE_MODULE_PERMISSIONS).map(([key, perm]) => {
              const isGranted = role?.permissionsList?.includes(key);
              return (
                <div
                  key={key}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-2 ${
                    isGranted
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-muted/20 border-border opacity-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">{perm.label}</span>
                    <p className="text-[10px] text-muted-foreground">{perm.desc}</p>
                  </div>
                  <Badge
                    variant={isGranted ? 'success' : 'outline'}
                    className="text-[9px] font-bold shrink-0 mt-0.5"
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
