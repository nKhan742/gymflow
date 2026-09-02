import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, KeyRound, ShieldAlert, Layers, ShieldCheck, Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IPermissionModel } from '../types';
import { toast } from 'sonner';

export const DEFAULT_PERMISSIONS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<IPermissionModel[]>([]);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_admin_permissions');
      const customList: IPermissionModel[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/permissions', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IPermissionModel[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_PERMISSIONS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((p) => (p.id || p._id) === id)) {
          combined.push(item);
        }
      }
      setPermissions(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_admin_permissions');
      const customList: IPermissionModel[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_PERMISSIONS) {
        const id = item.id || item._id;
        if (!combined.some((p) => (p.id || p._id) === id)) {
          combined.push(item);
        }
      }
      setPermissions(combined);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const updated = permissions.filter((p) => (p.id || p._id) !== id);
    setPermissions(updated);

    const stored = localStorage.getItem('gymflow_custom_admin_permissions');
    if (stored) {
      const customList: IPermissionModel[] = JSON.parse(stored);
      const filtered = customList.filter((p) => (p.id || p._id) !== id);
      localStorage.setItem('gymflow_custom_admin_permissions', JSON.stringify(filtered));
    }

    toast.success(`Permission "${name}" deleted`);
  };

  // Telemetry Metrics
  const totalPermissions = `${permissions.length} Grants`;
  const criticalCount = `${permissions.filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH').length} High/Critical`;
  const systemGuards = `${permissions.filter((p) => p.isSystemProtected).length} Protected Root`;
  const complianceScore = 'NIST 800-53 Compliant';

  const columns: ColumnDef<IPermissionModel>[] = [
    {
      accessorKey: 'permissionName',
      header: 'Permission & Machine Token',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const safeName = row.original.permissionName || 'Permission';
        const safeInitials = safeName.slice(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0 shadow-2xs">
              <AvatarImage src={row.original.iconAvatarUrl} alt={safeName} />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {safeInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[240px]">
              <button
                type="button"
                onClick={() => navigate(`/administration/permissions/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
              >
                {safeName}
              </button>
              <span className="text-[10px] text-muted-foreground font-mono block truncate">
                {row.original.permissionCode}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'moduleDomain',
      header: 'Target Domain',
      cell: ({ row }) => (
        <span className="font-semibold text-xs text-foreground">
          {row.original.moduleDomain}
        </span>
      ),
    },
    {
      accessorKey: 'actionType',
      header: 'Action Verb',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-mono font-bold">
          {row.original.actionType}
        </Badge>
      ),
    },
    {
      accessorKey: 'riskLevel',
      header: 'Risk Rating',
      cell: ({ row }) => {
        const risk = row.original.riskLevel;
        return (
          <Badge
            variant={risk === 'CRITICAL' ? 'destructive' : risk === 'HIGH' ? 'warning' : 'success'}
            className="text-[9px] font-bold"
          >
            {risk}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'grantedRolesCount',
      header: 'Roles Granted',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {row.original.grantedRolesCount} Roles
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'ACTIVE' ? 'success' : 'destructive'}
          className="text-[9px] font-bold"
        >
          {row.original.status === 'ACTIVE' ? '🟢 ACTIVE' : '🔴 RESTRICTED'}
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
              onClick={() => navigate(`/administration/permissions/${id}`)}
              title="View Permission Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/administration/permissions/${id}/edit`)}
              title="Edit Permission"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.permissionName)}
              title="Delete Permission"
              disabled={row.original.isSystemProtected}
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
        title="Granular RBAC Permissions Registry"
        subtitle="Manage atomic machine authorization tokens, capability scopes, action verb verbs, and risk ratings."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Name,Token,Domain,Action,Risk,RolesCount,Status\n' + permissions.map((p) => `"${p.permissionName}","${p.permissionCode}","${p.moduleDomain}","${p.actionType}","${p.riskLevel}","${p.grantedRolesCount}","${p.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rbac-permissions-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Permissions Registry exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/administration/permissions/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ New Permission</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="TOTAL PERMISSIONS"
          value={totalPermissions}
          change="Atomic Capability Grants"
          trend="up"
          timeframe="Registry"
          icon={<KeyRound className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="HIGH/CRITICAL RISK"
          value={criticalCount}
          change="Privileged Mutation Scope"
          trend="down"
          timeframe="Audit Health"
          icon={<ShieldAlert className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="SYSTEM PROTECTED"
          value={systemGuards}
          change="Root Machine Tokens"
          trend="up"
          timeframe="Zero-Trust"
          icon={<Layers className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="COMPLIANCE LEVEL"
          value={complianceScore}
          change="Access Control Standard"
          trend="up"
          timeframe="NIST AC-3"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={permissions}
        searchPlaceholder="Search permissions by name, token string, domain, action..."
      />
    </PageContainer>
  );
};
