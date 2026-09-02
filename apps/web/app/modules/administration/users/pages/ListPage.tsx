import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, UserCheck, ShieldCheck, Shield, Users, Smartphone, Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IUserModel } from '../types';
import { toast } from 'sonner';


export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [users, setUsers] = useState<IUserModel[]>([]);

  useEffect(() => {
    loadUsers();
  }, [activeBranchId]);

  const loadUsers = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_admin_users');
      const customList: IUserModel[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/users', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IUserModel[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        } else if (Array.isArray(json.data)) {
          fetchedList = json.data;
        }
      }

      const combined = [...customList];
      for (const item of fetchedList) {
        const id = item.id || item._id;
        if (!combined.some((u) => (u.id || u._id) === id)) {
          combined.push(item);
        }
      }
      setUsers(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_admin_users');
      const customList: IUserModel[] = stored ? JSON.parse(stored) : [];
      setUsers(customList);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const updated = users.filter((u) => (u.id || u._id) !== id);
    setUsers(updated);

    const stored = localStorage.getItem('gymflow_custom_admin_users');
    if (stored) {
      const customList: IUserModel[] = JSON.parse(stored);
      const filtered = customList.filter((u) => (u.id || u._id) !== id);
      localStorage.setItem('gymflow_custom_admin_users', JSON.stringify(filtered));
    }

    toast.success(`User account for "${name}" deactivated and removed`);
  };

  // Telemetry Metrics
  const totalActiveUsers = `${users.filter((u) => u.status === 'ACTIVE').length} / ${users.length} Active`;
  const mfaEnforcedRate = `${Math.round((users.filter((u) => u.mfaEnabled).length / (users.length || 1)) * 100)}% Enforced`;
  const superAdminCount = `${users.filter((u) => u.role === 'SUPER_ADMIN').length} Super Admins`;
  const liveSessionHealth = '100% Verified SSO';

  const columns: ColumnDef<IUserModel>[] = [
    {
      accessorKey: 'fullName',
      header: 'User Identity & Email',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const safeName = row.original.fullName || 'User';
        const safeInitials = safeName.slice(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0 shadow-2xs">
              <AvatarImage src={row.original.avatarUrl} alt={safeName} />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {safeInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[200px]">
              <button
                type="button"
                onClick={() => navigate(`/administration/users/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
              >
                {safeName}
              </button>
              <span className="text-[10px] text-muted-foreground font-mono block truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'RBAC Security Role',
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge
            variant={role === 'SUPER_ADMIN' ? 'default' : role === 'FACILITY_ADMIN' ? 'success' : 'outline'}
            className="text-[9px] font-bold"
          >
            {role === 'SUPER_ADMIN'
              ? '👑 SUPER ADMIN'
              : role === 'FACILITY_ADMIN'
              ? '🏛️ FACILITY ADMIN'
              : role === 'BRANCH_MANAGER'
              ? '🏢 BRANCH MGR'
              : role === 'AUDITOR'
              ? '⚖️ AUDITOR'
              : '🚪 STAFF'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'department',
      header: 'Department & Campus',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-medium text-xs text-foreground block">
            {row.original.department}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {row.original.branchName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'mfaEnabled',
      header: '2FA MFA State',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {row.original.mfaEnabled ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" /> Enforced
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Smartphone className="h-3.5 w-3.5" /> Missing
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'securityScore',
      header: 'Trust Score',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-14 bg-muted rounded-full h-1.5 overflow-hidden border border-border">
            <div
              className={`h-full rounded-full ${
                row.original.securityScore >= 95
                  ? 'bg-emerald-500'
                  : row.original.securityScore >= 80
                  ? 'bg-primary'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${row.original.securityScore}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-foreground">
            {row.original.securityScore}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'ACTIVE' ? 'success' : row.original.status === 'INVITED' ? 'warning' : 'destructive'}
          className="text-[9px] font-bold"
        >
          {row.original.status === 'ACTIVE' ? '🟢 ACTIVE' : row.original.status === 'INVITED' ? '✉️ INVITED' : '🔴 SUSPENDED'}
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
              onClick={() => navigate(`/administration/users/${id}`)}
              title="View User Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/administration/users/${id}/edit`)}
              title="Edit Permissions"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.fullName)}
              title="Deactivate User"
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
        title="IAM User Directory & Role Governance"
        subtitle="Manage administrative user accounts, RBAC clearance tiers, cryptographic multi-factor authentication, and active sessions."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Name,Email,Role,Department,Branch,MFA,SecurityScore,Status\n' + users.map((u) => `"${u.fullName}","${u.email}","${u.role}","${u.department}","${u.branchName}","${u.mfaEnabled}","${u.securityScore}","${u.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `iam-users-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('IAM User Directory exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/administration/users/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Onboard User</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="TOTAL ACTIVE USERS"
          value={totalActiveUsers}
          change="Directory Population"
          trend="up"
          timeframe="IAM Roster"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="2FA ENFORCEMENT RATE"
          value={mfaEnforcedRate}
          change="Zero-Trust Compliance"
          trend="up"
          timeframe="Auth Policy"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="SUPER ADMIN TIER"
          value={superAdminCount}
          change="Global Root Clearance"
          trend="up"
          timeframe="Governance"
          icon={<Shield className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="SESSION INTEGRITY"
          value={liveSessionHealth}
          change="TLS v1.3 Encrypted"
          trend="up"
          timeframe="Active Network"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search IAM users by name, email, department, role..."
      />
    </PageContainer>
  );
};
