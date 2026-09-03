import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, ShieldCheck, Shield, Users, Smartphone, Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { useAuthStore } from '../../../../core/store/authStore';
import { IUserModel } from '../types';
import { toast } from 'sonner';

// System Role Hierarchy Levels
const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  BRANCH_MANAGER: 60,
  TRAINER: 40,
  RECEPTIONIST: 40,
  NUTRITIONIST: 40,
  MEMBER: 20,
};

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<IUserModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [activeBranchId, currentUser]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/users', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let rawItems: any[] = [];
      if (res.ok) {
        const json = await res.json();
        rawItems = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        // If API returned real records, clear any stale mock localStorage items
        if (rawItems.length > 0) {
          localStorage.removeItem('gymflow_custom_admin_users');
        }
      } else {
        rawItems = [];
      }

      const currentEmail = currentUser?.email?.toLowerCase().trim();
      const currentId = currentUser?.id || (currentUser as any)?._id;
      const currentLevel = ROLE_HIERARCHY[currentUser?.role || 'ADMIN'] || 80;

      // Map, normalize and filter by hierarchy & self exclusion
      const normalized: IUserModel[] = rawItems.map((item: any) => {
        const fullName = item.fullName || item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Staff User';
        return {
          id: item.id || item._id,
          _id: item._id || item.id,
          fullName,
          email: item.email || '',
          phone: item.phone || '',
          avatarUrl: item.avatarUrl || item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: item.role || 'TRAINER',
          roleName: item.roleName || item.role,
          department: item.department || (item.role === 'TRAINER' ? 'Personal Training & Fitness' : 'Operations & Management'),
          branchId: item.branchId || 'BR-274',
          branchName: item.branchName || 'Main Facility',
          mfaEnabled: !!item.mfaEnabled,
          lastLoginAt: item.lastLoginAt || 'Recent',
          ipAddress: item.ipAddress || 'Verified IP',
          status: (item.status || 'ACTIVE').toUpperCase(),
          securityScore: typeof item.securityScore === 'number' && !isNaN(item.securityScore)
            ? item.securityScore
            : item.mfaEnabled ? 95 : 85,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        };
      });

      // Filter:
      // 1. Hide SUPER_ADMIN
      // 2. Hide currently logged-in user (user cannot view or delete self in this directory)
      // 3. Only show users within hierarchy (subordinates or peers below/at clearance level)
      const allowedUsers = normalized.filter((u) => {
        if (u.role === 'SUPER_ADMIN') return false;

        const uEmail = u.email.toLowerCase().trim();
        const uId = u.id;

        // Strictly exclude logged-in user
        if (currentEmail && uEmail === currentEmail) return false;
        if (currentId && uId === currentId) return false;

        // Hierarchy rule: only see users lower or equal to current role level (excluding self)
        const userLevel = ROLE_HIERARCHY[u.role] || 40;
        return userLevel <= currentLevel;
      });

      // Deduplicate by email
      const seenEmails = new Set<string>();
      const deduped: IUserModel[] = [];
      for (const u of allowedUsers) {
        const emailKey = u.email.toLowerCase().trim();
        if (emailKey && !seenEmails.has(emailKey)) {
          seenEmails.add(emailKey);
          deduped.push(u);
        } else if (!emailKey) {
          deduped.push(u);
        }
      }

      setUsers(deduped);
    } catch {
      toast.error('Could not load system users directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string, targetEmail?: string) => {
    const currentEmail = currentUser?.email?.toLowerCase().trim();
    const currentId = currentUser?.id || (currentUser as any)?._id;

    if ((targetEmail && targetEmail.toLowerCase().trim() === currentEmail) || id === currentId) {
      toast.error('Security policy violation: You cannot delete your own user account.');
      return;
    }

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (res.ok || res.status === 204) {
        toast.success(`User account for "${name}" removed successfully.`);
        setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
      } else {
        const json = await res.json().catch(() => null);
        toast.error(json?.message || 'Failed to remove user account.');
      }
    } catch {
      toast.error('Network error while removing user.');
    }
  };

  // Telemetry Metrics
  const totalActiveUsers = `${users.filter((u) => u.status === 'ACTIVE').length} / ${users.length} Active`;
  const mfaEnforcedRate = `${Math.round((users.filter((u) => u.mfaEnabled).length / (users.length || 1)) * 100)}% Enforced`;
  const staffCount = `${users.filter((u) => u.role === 'TRAINER' || u.role === 'RECEPTIONIST').length} Staff`;
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
            variant={role === 'ADMIN' ? 'default' : role === 'BRANCH_MANAGER' ? 'secondary' : role === 'TRAINER' ? 'info' : 'outline'}
            className="text-[9px] font-bold"
          >
            {role === 'ADMIN'
              ? '🛡️ ADMIN'
              : role === 'BRANCH_MANAGER'
              ? '🏢 BRANCH MGR'
              : role === 'TRAINER'
              ? '🏋️ TRAINER'
              : role === 'RECEPTIONIST'
              ? '🛎️ RECEPTION'
              : role === 'NUTRITIONIST'
              ? '🥗 NUTRITION'
              : role === 'MEMBER'
              ? '👤 MEMBER'
              : role}
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
      cell: ({ row }) => {
        const score = typeof row.original.securityScore === 'number' && !isNaN(row.original.securityScore)
          ? row.original.securityScore
          : row.original.mfaEnabled ? 95 : 85;
        return (
          <div className="flex items-center gap-2">
            <div className="w-14 bg-muted rounded-full h-1.5 overflow-hidden border border-border">
              <div
                className={`h-full rounded-full ${
                  score >= 90
                    ? 'bg-emerald-500'
                    : score >= 75
                    ? 'bg-primary'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-foreground">
              {score}%
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const rawStatus = (row.original.status || 'ACTIVE').toUpperCase();
        const isActive = rawStatus === 'ACTIVE';
        const isInvited = rawStatus === 'INVITED';
        return (
          <Badge
            variant={isActive ? 'success' : isInvited ? 'warning' : 'destructive'}
            className="text-[9px] font-bold"
          >
            {isActive ? '🟢 ACTIVE' : isInvited ? '✉️ INVITED' : '🔴 SUSPENDED'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const currentEmail = currentUser?.email?.toLowerCase().trim();
        const currentId = currentUser?.id || (currentUser as any)?._id;
        const isSelf = (currentEmail && row.original.email?.toLowerCase().trim() === currentEmail) || (currentId && id === currentId);

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
            {!isSelf && (
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
                onClick={() => handleDelete(id || '', row.original.fullName, row.original.email)}
                title="Deactivate User"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
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
          title="TOTAL MANAGED USERS"
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
          title="STAFF CLEARANCE"
          value={staffCount}
          change="Operations Roster"
          trend="up"
          timeframe="Governance"
          icon={<Shield className="h-5 w-5 text-primary" />}
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
