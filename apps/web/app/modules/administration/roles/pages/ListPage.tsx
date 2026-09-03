import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Shield, Layers, Users, Lock, Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IRoleModel } from '../types';
import { toast } from 'sonner';
import { getGrantedModules, AVAILABLE_MODULE_PERMISSIONS } from '../permissions.config';

const DEFAULT_SYSTEM_ROLES: IRoleModel[] = [
  {
    id: 'ROLE-ADMIN',
    roleName: 'Gym Administrator / Owner',
    roleKey: 'ADMIN',
    description: 'Full campus governance, financial oversight, personnel management, and system administration.',
    hierarchyTier: 1,
    isSystemRole: true,
    assignedUsersCount: 1,
    permissionModulesCount: 9,
    permissionsList: ['*'],
    status: 'ACTIVE',
    createdBy: 'SYSTEM',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'ROLE-BRANCH-MGR',
    roleName: 'Branch General Manager',
    roleKey: 'BRANCH_MANAGER',
    description: 'Autonomous branch operations, facility oversight, staff management, and local analytics.',
    hierarchyTier: 2,
    isSystemRole: true,
    assignedUsersCount: 0,
    permissionModulesCount: 7,
    permissionsList: ['gym:*', 'members:*', 'fitness:*', 'scheduling:*', 'inventory:*', 'reports:*', 'pos:*'],
    status: 'ACTIVE',
    createdBy: 'SYSTEM',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'ROLE-TRAINER',
    roleName: 'Fitness Coach & Personal Trainer',
    roleKey: 'TRAINER',
    description: 'Workout programs, member training routines, nutrition tracking, and coaching sessions.',
    hierarchyTier: 3,
    isSystemRole: true,
    assignedUsersCount: 1,
    permissionModulesCount: 3,
    permissionsList: ['fitness:*', 'nutrition:*', 'scheduling:*'],
    status: 'ACTIVE',
    createdBy: 'SYSTEM',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'ROLE-RECEPTIONIST',
    roleName: 'Front Desk & Member Concierge',
    roleKey: 'RECEPTIONIST',
    description: 'Check-ins, turnstile access, appointments, basic member support, and lead intake.',
    hierarchyTier: 4,
    isSystemRole: true,
    assignedUsersCount: 0,
    permissionModulesCount: 4,
    permissionsList: ['members:members:view', 'members:members:create', 'scheduling:appointments:create', 'pos:sales:create'],
    status: 'ACTIVE',
    createdBy: 'SYSTEM',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'ROLE-NUTRITIONIST',
    roleName: 'Certified Nutritionist & Dietitian',
    roleKey: 'NUTRITIONIST',
    description: 'Custom meal plans, macronutrient consults, food database, and dietary intake audits.',
    hierarchyTier: 3,
    isSystemRole: true,
    assignedUsersCount: 0,
    permissionModulesCount: 3,
    permissionsList: ['nutrition:*', 'scheduling:*', 'members:members:view'],
    status: 'ACTIVE',
    createdBy: 'SYSTEM',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'ROLE-ACCOUNTANT',
    roleName: 'Finance & Billing Officer',
    roleKey: 'ACCOUNTANT',
    description: 'Ledgers, accounts receivable/payable, payroll reconciliation, and tax filings.',
    hierarchyTier: 2,
    isSystemRole: true,
    assignedUsersCount: 0,
    permissionModulesCount: 4,
    permissionsList: ['finance:*', 'reports:*', 'members:membership-plans:view'],
    status: 'ACTIVE',
    createdBy: 'SYSTEM',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'ROLE-MEMBER',
    roleName: 'Gym Member (Self-Service)',
    roleKey: 'MEMBER',
    description: 'Self-service workout logs, class bookings, subscription management, and profile access.',
    hierarchyTier: 5,
    isSystemRole: true,
    assignedUsersCount: 0,
    permissionModulesCount: 3,
    permissionsList: ['profile:*', 'members:attendance:view', 'fitness:workout-plans:view', 'scheduling:classes:view'],
    status: 'ACTIVE',
    createdBy: 'SYSTEM',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<IRoleModel[]>(DEFAULT_SYSTEM_ROLES);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const headers = {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      };

      const [rolesRes, usersRes, staffRes] = await Promise.all([
        fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles', { headers }),
        fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/users', { headers }).catch(() => null),
        fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym-management/staff', { headers }).catch(() => null),
      ]);

      const roleHoldersMap: Record<string, Set<string>> = {};
      const addHolder = (roleKey?: string, identifier?: string) => {
        if (!roleKey || !identifier) return;
        const normKey = roleKey.toUpperCase().trim();
        if (!roleHoldersMap[normKey]) roleHoldersMap[normKey] = new Set();
        roleHoldersMap[normKey].add(identifier.toLowerCase().trim());
      };

      if (usersRes && usersRes.ok) {
        const uJson = await usersRes.json().catch(() => ({}));
        const uList = uJson.data?.items || (Array.isArray(uJson.data) ? uJson.data : []);
        uList.forEach((u: any) => {
          if (u.role && u.isDeleted !== true) addHolder(u.role, u.email || u.id || u._id);
        });
      }

      if (staffRes && staffRes.ok) {
        const sJson = await staffRes.json().catch(() => ({}));
        const sList = sJson.data?.items || (Array.isArray(sJson.data) ? sJson.data : []);
        sList.forEach((s: any) => {
          if (s.role && s.isDeleted !== true) addHolder(s.role, s.email || s.id || s._id);
        });
      }

      if (rolesRes && rolesRes.ok) {
        const json = await rolesRes.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        if (items.length > 0) {
          const enriched = items.map((r: any) => {
            const key = (r.roleKey || r.code || r.name || '').toUpperCase().trim();
            const dynamicCount = roleHoldersMap[key]?.size;
            return {
              ...r,
              assignedUsersCount: dynamicCount !== undefined ? dynamicCount : (r.assignedUsersCount ?? 0),
            };
          });
          setRoles(enriched);
          localStorage.setItem('gymflow_cached_admin_roles', JSON.stringify(enriched));
        } else {
          setRoles(DEFAULT_SYSTEM_ROLES.map((r) => ({
            ...r,
            assignedUsersCount: roleHoldersMap[r.roleKey]?.size ?? r.assignedUsersCount,
          })));
        }
      } else {
        const cached = localStorage.getItem('gymflow_cached_admin_roles');
        if (cached) {
          try {
            setRoles(JSON.parse(cached));
          } catch {
            setRoles(DEFAULT_SYSTEM_ROLES.map((r) => ({
              ...r,
              assignedUsersCount: roleHoldersMap[r.roleKey]?.size ?? r.assignedUsersCount,
            })));
          }
        } else {
          setRoles(DEFAULT_SYSTEM_ROLES.map((r) => ({
            ...r,
            assignedUsersCount: roleHoldersMap[r.roleKey]?.size ?? r.assignedUsersCount,
          })));
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      setRoles((prev) => prev.filter((r) => (r.id || r._id) !== id));
      toast.success(`RBAC Role "${name}" deleted`);
    } catch {
      toast.error('Failed to delete role');
    }
  };

  // Telemetry Metrics
  const totalRoles = `${roles.length} Roles Active`;
  const systemRoles = `${roles.filter((r) => r.isSystemRole).length} Protected System`;
  const customRoles = `${roles.filter((r) => !r.isSystemRole).length} Custom Campus`;
  const totalHolders = `${roles.reduce((acc, r) => acc + (r.assignedUsersCount || 0), 0)} Role Holders`;

  const columns: ColumnDef<IRoleModel>[] = [
    {
      accessorKey: 'roleName',
      header: 'Role Name & Security Token',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const safeName = row.original.roleName || 'Role';
        const safeInitials = safeName.slice(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0 shadow-2xs">
              <AvatarImage src={row.original.iconAvatarUrl} alt={safeName} />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {safeInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[220px]">
              <button
                type="button"
                onClick={() => navigate(`/administration/roles/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
              >
                {safeName}
              </button>
              <span className="text-[10px] text-muted-foreground font-mono block truncate">
                {row.original.roleKey}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'hierarchyTier',
      header: 'Hierarchy Tier',
      cell: ({ row }) => {
        const tier = row.original.hierarchyTier;
        return (
          <Badge
            variant={tier === 1 ? 'default' : tier === 2 ? 'success' : tier === 3 ? 'warning' : 'outline'}
            className="text-[9px] font-bold"
          >
            {tier === 1
              ? '👑 Tier 1 - Root'
              : tier === 2
              ? '🏛️ Tier 2 - Facility Admin'
              : tier === 3
              ? '🏢 Tier 3 - Branch Mgr'
              : tier === 4
              ? '🚪 Tier 4 - Operator'
              : '⚖️ Tier 5 - Auditor'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'permissionModulesCount',
      header: 'Granted Domains',
      cell: ({ row }) => {
        const perms = row.original.permissionsList || (row.original as any).permissions || [];
        const granted = getGrantedModules(perms, row.original.roleKey || (row.original as any).code);
        const total = Object.keys(AVAILABLE_MODULE_PERMISSIONS).length;
        return (
          <div className="flex items-center gap-2 font-mono text-xs">
            <Layers className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-bold text-foreground">
              {granted.length}
            </span>
            <span className="text-muted-foreground">/ {total} Modules</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'assignedUsersCount',
      header: 'Assigned Users',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span className="font-bold text-foreground">{row.original.assignedUsersCount} users</span>
        </div>
      ),
    },
    {
      accessorKey: 'isSystemRole',
      header: 'Policy Type',
      cell: ({ row }) => (
        <Badge
          variant={row.original.isSystemRole ? 'default' : 'outline'}
          className="text-[9px] font-bold"
        >
          {row.original.isSystemRole ? '🔒 SYSTEM' : 'CUSTOM'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'ACTIVE' ? 'success' : 'outline'}
          className="text-[9px] font-bold"
        >
          {row.original.status === 'ACTIVE' ? '🟢 ACTIVE' : '📦 ARCHIVED'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/administration/roles/${id}`)}
              title="View Role Policy"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/administration/roles/${id}/edit`)}
              title="Edit Capabilities"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.roleName)}
              title="Delete Role"
              disabled={row.original.isSystemRole}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Role-Based Access Control (RBAC) Governance"
        subtitle="Configure security privilege policies, hierarchy access tiers, and granular multi-domain permissions."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'RoleName,Key,Tier,GrantedModules,UsersCount,SystemRole,Status\n' + roles.map((r) => `"${r.roleName}","${r.roleKey}","Tier ${r.hierarchyTier}","${r.permissionModulesCount}","${r.assignedUsersCount}","${r.isSystemRole}","${r.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rbac-roles-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('RBAC Roles Directory exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/administration/roles/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Define Role</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="TOTAL ACTIVE ROLES"
          value={totalRoles}
          change="Policy Governance"
          trend="up"
          timeframe="RBAC Engine"
          icon={<Shield className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="SYSTEM PROTECTED"
          value={systemRoles}
          change="Immutable Root Core"
          trend="up"
          timeframe="Zero-Trust"
          icon={<Lock className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="CUSTOM POLICIES"
          value={customRoles}
          change="Branch Specific Roles"
          trend="up"
          timeframe="Campus Scope"
          icon={<Layers className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="ACTIVE ROLE HOLDERS"
          value={totalHolders}
          change="Staff Assigned"
          trend="up"
          timeframe="User Coverage"
          icon={<Users className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={roles}
        searchPlaceholder="Search RBAC roles by title, key, tier level, permissions..."
      />
    </PageContainer>
  );
};
