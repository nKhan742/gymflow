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

export const DEFAULT_ROLES: any[] = [
  {
    id: 'ROL-ADMIN',
    roleName: 'Gym Administrator / Owner',
    roleKey: 'ADMIN',
    description: 'Master organizational control, financial records, staff provisioning, and billing oversight across all facility branches.',
    hierarchyTier: 1,
    isSystemRole: true,
    assignedUsersCount: 1,
    permissionModulesCount: 9,
    permissionsList: ['*'],
    status: 'ACTIVE',
  },
  {
    id: 'ROL-MGR',
    roleName: 'Branch General Manager',
    roleKey: 'BRANCH_MANAGER',
    description: 'Branch-level operational oversight, shift management, attendance logs, and staff assignments.',
    hierarchyTier: 2,
    isSystemRole: true,
    assignedUsersCount: 0,
    permissionModulesCount: 6,
    permissionsList: ['gym:branches:view', 'gym:departments:view', 'gym:staff:view', 'members:members:view', 'scheduling:classes:view'],
    status: 'ACTIVE',
  },
  {
    id: 'ROL-TRN',
    roleName: 'Fitness Coach & Personal Trainer',
    roleKey: 'TRAINER',
    description: 'Workout programming, personal training sessions, body assessments, and class instruction.',
    hierarchyTier: 3,
    isSystemRole: false,
    assignedUsersCount: 0,
    permissionModulesCount: 4,
    permissionsList: ['fitness:workout-plans:view', 'fitness:fitness-assessment:view', 'members:members:view'],
    status: 'ACTIVE',
  },
  {
    id: 'ROL-REC',
    roleName: 'Front Desk & Member Concierge',
    roleKey: 'RECEPTIONIST',
    description: 'Turnstile check-in, guest pass processing, member onboardings, and locker assignments.',
    hierarchyTier: 3,
    isSystemRole: false,
    assignedUsersCount: 0,
    permissionModulesCount: 3,
    permissionsList: ['members:members:view', 'members:members:create', 'gym:branches:view'],
    status: 'ACTIVE',
  },
  {
    id: 'ROL-NUT',
    roleName: 'Certified Nutritionist & Dietitian',
    roleKey: 'NUTRITIONIST',
    description: 'Macronutrient meal planning, dietary consultations, hydration tracking, and supplement guidance.',
    hierarchyTier: 3,
    isSystemRole: false,
    assignedUsersCount: 0,
    permissionModulesCount: 3,
    permissionsList: ['nutrition:meal-library:view', 'nutrition:diet-plans:view', 'members:members:view'],
    status: 'ACTIVE',
  },
  {
    id: 'ROL-MBR',
    roleName: 'Gym Member (Self-Service)',
    roleKey: 'MEMBER',
    description: 'Mobile app and portal access for workout logs, class bookings, subscription status, and billing history.',
    hierarchyTier: 4,
    isSystemRole: false,
    assignedUsersCount: 0,
    permissionModulesCount: 2,
    permissionsList: ['profile:view', 'fitness:workout-plans:view', 'nutrition:diet-plans:view'],
    status: 'ACTIVE',
  },
];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<IRoleModel[]>([]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_admin_roles');
      const customList: IRoleModel[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IRoleModel[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_ROLES;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((r) => (r.id || r._id) === id)) {
          combined.push(item);
        }
      }
      setRoles(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_admin_roles');
      const customList: IRoleModel[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_ROLES) {
        const id = item.id || item._id;
        if (!combined.some((r) => (r.id || r._id) === id)) {
          combined.push(item);
        }
      }
      setRoles(combined);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const updated = roles.filter((r) => (r.id || r._id) !== id);
    setRoles(updated);

    const stored = localStorage.getItem('gymflow_custom_admin_roles');
    if (stored) {
      const customList: IRoleModel[] = JSON.parse(stored);
      const filtered = customList.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem('gymflow_custom_admin_roles', JSON.stringify(filtered));
    }

    toast.success(`RBAC Role "${name}" deleted`);
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-mono text-xs">
          <Layers className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-bold text-foreground">
            {row.original.permissionModulesCount || row.original.permissionsList?.length || 0}
          </span>
          <span className="text-muted-foreground">/ 9 Modules</span>
        </div>
      ),
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
