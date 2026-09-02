import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Building2,
  Users,
  ShieldCheck,
  CreditCard,
  Play,
  Pause,
  Square,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Check,
  Zap,
  Shield,
  Activity,
  UserCheck,
  Search,
  LogOut,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { useAuthStore } from '../../../../core/store/authStore';
import { usePlanStore } from '../../../../core/store/planStore';
import { useBranchStore } from '../../../../core/store/branchStore';
import { usePlatformAuthStore } from '../../../../core/store/platformAuthStore';
import { IGymTenant, TenantPlanTier, TenantSubscriptionStatus } from '../types';

const INITIAL_TENANTS: IGymTenant[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setPlan } = usePlanStore();
  const { loadBranches } = useBranchStore();
  const { platformUser, logoutPlatform } = usePlatformAuthStore();

  const [tenants, setTenants] = useState<IGymTenant[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [clusterHost, setClusterHost] = useState<string>('MongoDB Atlas Cluster');

  const fetchLiveTenants = async () => {
    setLoadingLive(true);
    try {
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/platform/tenants');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTenants(json.data);
          localStorage.setItem('gymflow_registered_tenants', JSON.stringify(json.data));
          if (json.meta?.cluster) setClusterHost(json.meta.cluster);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to load tenants from live cluster:', err);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveTenants();
  }, []);

  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);

  // New Tenant Form State
  const [newGymName, setNewGymName] = useState('');
  const [newCampus, setNewCampus] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('password123');
  const [newPlan, setNewPlan] = useState<TenantPlanTier>('ESSENTIAL');
  const [newCycle, setNewCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  const saveTenants = (updated: IGymTenant[]) => {
    setTenants(updated);
    localStorage.setItem('gymflow_registered_tenants', JSON.stringify(updated));
  };

  const togglePassword = (tenantId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [tenantId]: !prev[tenantId],
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Change Subscription Status (Play, Pause, Stop)
  const handleUpdateStatus = (tenantId: string, newStatus: TenantSubscriptionStatus) => {
    const targetTenant = tenants.find((t) => t.id === tenantId);
    const updated = tenants.map((t) => {
      if (t.id === tenantId) {
        return { ...t, subscriptionStatus: newStatus };
      }
      return t;
    });
    saveTenants(updated);

    if (targetTenant?.databaseName) {
      fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/platform/tenants/${targetTenant.databaseName}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => {});
    }

    if (newStatus === 'ACTIVE') {
      toast.success(`🟢 Subscription for ${targetTenant?.gymName} resumed (Active)!`);
    } else if (newStatus === 'PAUSED') {
      toast.warning(`⏸️ Subscription for ${targetTenant?.gymName} paused! Billing frozen.`);
    } else {
      toast.error(`⏹️ Subscription for ${targetTenant?.gymName} stopped! Access suspended.`);
    }
  };

  // Change Plan Tier
  const handleUpdatePlan = (tenantId: string, newTier: TenantPlanTier) => {
    const feeMap: Record<TenantPlanTier, number> = {
      ESSENTIAL: 1500,
      PROFESSIONAL: 2500,
      ENTERPRISE: 4500,
    };
    const updated = tenants.map((t) => {
      if (t.id === tenantId) {
        return {
          ...t,
          planTier: newTier,
          monthlyFee: feeMap[newTier],
        };
      }
      return t;
    });
    saveTenants(updated);
    toast.success(`Plan updated to ${newTier} for ${tenants.find((t) => t.id === tenantId)?.gymName}`);
  };

  // Impersonate / One-Click Login to Tenant Dashboard
  const handleLoginToDashboard = async (tenant: IGymTenant) => {
    toast.loading(`Authenticating into ${tenant.gymName}...`, { id: 'impersonate-login' });
    try {
      const success = await login({ email: tenant.email, pass: tenant.password });
      if (success) {
        // Sync plan store with this tenant's tier
        setPlan(tenant.planTier, tenant.billingCycle);
        localStorage.setItem('gymflow_software_plan_tier', tenant.planTier);
        await loadBranches();

        toast.success(`🚀 Switched to ${tenant.gymName} Dashboard as ${tenant.ownerName}!`, {
          id: 'impersonate-login',
        });
        navigate('/dashboard/admin-dashboard');
      } else {
        toast.error(`Unable to auto-login to ${tenant.email}. Please verify credentials.`, {
          id: 'impersonate-login',
        });
      }
    } catch {
      toast.error(`Login failed for ${tenant.email}`, { id: 'impersonate-login' });
    }
  };

  // Register New Tenant Handler
  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGymName || !newEmail || !newOwner) {
      toast.error('Please fill in all required fields');
      return;
    }

    const feeMap: Record<TenantPlanTier, number> = {
      ESSENTIAL: 1500,
      PROFESSIONAL: 2500,
      ENTERPRISE: 4500,
    };

    const cleanDb = `gymflow_db_${newGymName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const newTenantRecord: IGymTenant = {
      id: `TNT-00${tenants.length + 1}`,
      gymName: newGymName,
      campusName: newCampus || `${newGymName} Main Campus`,
      ownerName: newOwner,
      email: newEmail,
      phone: newPhone || '9999999999',
      password: newPassword || 'password123',
      planTier: newPlan,
      billingCycle: newCycle,
      subscriptionStatus: 'ACTIVE',
      memberCount: 0,
      staffCount: 1,
      branchCount: 1,
      monthlyFee: feeMap[newPlan],
      joinedDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      databaseName: cleanDb,
    };

    const updated = [newTenantRecord, ...tenants];
    saveTenants(updated);
    setIsAddTenantOpen(false);
    toast.success(`Gym Tenant "${newGymName}" registered successfully!`);

    // Reset Form
    setNewGymName('');
    setNewCampus('');
    setNewOwner('');
    setNewEmail('');
    setNewPhone('');
  };

  // Filtered List
  const filteredTenants = tenants.filter((t) => {
    const matchesTier = selectedTierFilter === 'ALL' || t.planTier === selectedTierFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || t.subscriptionStatus === selectedStatusFilter;
    return matchesTier && matchesStatus;
  });

  // KPI Calculations
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.subscriptionStatus === 'ACTIVE').length;
  const totalMembers = tenants.reduce((acc, t) => acc + (t.memberCount || 0), 0);
  const totalMRR = tenants
    .filter((t) => t.subscriptionStatus === 'ACTIVE')
    .reduce((acc, t) => acc + (t.monthlyFee || 0), 0);

  const columns: ColumnDef<IGymTenant>[] = [
    {
      accessorKey: 'gymName',
      header: 'Gym Organization',
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="space-y-1 max-w-[200px]">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary/20 to-purple-500/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="truncate">
                <div className="font-bold text-foreground text-sm truncate">{t.gymName}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  📍 {t.campusName} • {t.branchCount} Branch
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded truncate">
              {t.databaseName}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'ownerName',
      header: 'Owner / Contact',
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="space-y-0.5">
            <div className="font-semibold text-foreground text-xs">{t.ownerName}</div>
            <div className="text-[11px] text-muted-foreground font-mono">{t.email}</div>
            <div className="text-[10px] text-muted-foreground">📞 {t.phone}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'credentials',
      header: 'Login Credentials',
      cell: ({ row }) => {
        const t = row.original;
        const isRevealed = revealedPasswords[t.id];
        return (
          <div className="space-y-1 p-2 rounded-xl bg-muted/40 border border-border/60 max-w-[180px]">
            <div className="flex items-center justify-between gap-1 text-[11px]">
              <span className="text-muted-foreground">User:</span>
              <span className="font-mono font-semibold text-foreground truncate max-w-[100px]">{t.email}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(t.email, 'Email')}
                className="text-muted-foreground hover:text-foreground"
                title="Copy Email"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-1 text-[11px]">
              <span className="text-muted-foreground">Pass:</span>
              <span className="font-mono font-semibold text-foreground">
                {isRevealed ? t.password : '••••••••'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => togglePassword(t.id)}
                  className="text-muted-foreground hover:text-foreground"
                  title={isRevealed ? 'Hide Password' : 'Show Password'}
                >
                  {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(t.password, 'Password')}
                  className="text-muted-foreground hover:text-foreground"
                  title="Copy Password"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'planTier',
      header: 'Plan Tier & Billing',
      cell: ({ row }) => {
        const t = row.original;
        const tierBadgeColor =
          t.planTier === 'ENTERPRISE'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            : t.planTier === 'PROFESSIONAL'
            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

        return (
          <div className="space-y-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${tierBadgeColor}`}>
                  <span>{t.planTier}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 text-xs">
                <DropdownMenuItem onClick={() => handleUpdatePlan(t.id, 'ESSENTIAL')}>
                  <Shield className="h-3.5 w-3.5 text-emerald-500 mr-1.5" /> Essential Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdatePlan(t.id, 'PROFESSIONAL')}>
                  <Zap className="h-3.5 w-3.5 text-indigo-500 mr-1.5" /> Professional Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdatePlan(t.id, 'ENTERPRISE')}>
                  <Building2 className="h-3.5 w-3.5 text-amber-500 mr-1.5" /> Enterprise Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="text-[11px] font-bold text-foreground">
              ₹{t.monthlyFee.toLocaleString('en-IN')}/mo
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-medium">
              {t.billingCycle} • Renew: {t.nextBillingDate}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'subscriptionStatus',
      header: 'Subscription State',
      cell: ({ row }) => {
        const t = row.original;
        const status = t.subscriptionStatus;

        return (
          <div className="space-y-2">
            {status === 'ACTIVE' && (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
              </Badge>
            )}
            {status === 'PAUSED' && (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-bold gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Paused
              </Badge>
            )}
            {status === 'STOPPED' && (
              <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] font-bold gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Stopped
              </Badge>
            )}

            {/* Quick Action Buttons: Play, Pause, Stop */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleUpdateStatus(t.id, 'ACTIVE')}
                disabled={status === 'ACTIVE'}
                className={`p-1.5 rounded-lg border text-xs transition-all ${
                  status === 'ACTIVE'
                    ? 'bg-emerald-500 text-white opacity-50 cursor-not-allowed border-emerald-600'
                    : 'bg-background hover:bg-emerald-50 text-emerald-600 border-border cursor-pointer'
                }`}
                title="Resume Subscription (Play)"
              >
                <Play className="h-3 w-3 fill-current" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus(t.id, 'PAUSED')}
                disabled={status === 'PAUSED'}
                className={`p-1.5 rounded-lg border text-xs transition-all ${
                  status === 'PAUSED'
                    ? 'bg-amber-500 text-white opacity-50 cursor-not-allowed border-amber-600'
                    : 'bg-background hover:bg-amber-50 text-amber-600 border-border cursor-pointer'
                }`}
                title="Pause Subscription (Freeze)"
              >
                <Pause className="h-3 w-3 fill-current" />
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus(t.id, 'STOPPED')}
                disabled={status === 'STOPPED'}
                className={`p-1.5 rounded-lg border text-xs transition-all ${
                  status === 'STOPPED'
                    ? 'bg-rose-500 text-white opacity-50 cursor-not-allowed border-rose-600'
                    : 'bg-background hover:bg-rose-50 text-rose-600 border-border cursor-pointer'
                }`}
                title="Stop / Terminate Subscription"
              >
                <Square className="h-3 w-3 fill-current" />
              </button>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'memberCount',
      header: 'Members & Staff',
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>{t.memberCount.toLocaleString()} Members</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              👤 {t.staffCount} Staff & Trainers
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Dashboard Access',
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleLoginToDashboard(t)}
              className="gap-1.5 text-xs font-bold shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Login to Dashboard</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Platform Tenants & Subscriptions Console"
        subtitle="Master administration portal for the platform owner to monitor registered gyms, adjust subscription states (Play, Pause, Stop), view credentials, and launch directly into tenant dashboards."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 cursor-pointer"
              disabled={loadingLive}
              onClick={() => {
                fetchLiveTenants();
                toast.info('Querying MongoDB Atlas cluster...');
              }}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingLive ? 'animate-spin' : ''}`} />
              <span>{loadingLive ? 'Syncing...' : 'Sync MongoDB Atlas'}</span>
            </Button>

            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => setIsAddTenantOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Register New Gym Tenant</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 shadow-xs cursor-pointer"
              onClick={() => {
                logoutPlatform();
                toast.info('Signed out of Platform Root Console.');
                navigate('/platform-admin/login');
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Lock Console</span>
            </Button>
          </>
        }
      />

      {/* Root Admin Active Session Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Active Root Console Session</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                PRIMARY DB ROOT
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Authenticated as <strong className="text-white">{platformUser?.email || 'platform@gymflow.io'}</strong> • Primary MongoDB Atlas Instance
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logoutPlatform();
            toast.info('Root session terminated.');
            navigate('/platform-admin/login');
          }}
          className="gap-1.5 text-xs border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-200 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Root Session</span>
        </Button>
      </div>

      {/* Platform Owner KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Registered Gyms"
          value={`${totalTenants} Tenants`}
          change={`${activeTenants} Subscribed`}
          trend="up"
          timeframe="Cross-network active"
          icon={<Building2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Subscriptions"
          value={`${activeTenants} / ${totalTenants}`}
          change={`${Math.round((activeTenants / (totalTenants || 1)) * 100)}% active rate`}
          trend="up"
          timeframe="Live billing"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Consolidated Members"
          value={totalMembers.toLocaleString()}
          change="Across all gym tenants"
          trend="up"
          timeframe="Network roster"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`₹${totalMRR.toLocaleString('en-IN')}`}
          change="Run-rate"
          trend="up"
          timeframe="Software billing"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Filter Tier:</span>
          {['ALL', 'ESSENTIAL', 'PROFESSIONAL', 'ENTERPRISE'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTierFilter(tier)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTierFilter === tier
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tier === 'ALL' ? 'All Plans' : tier}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Status:</span>
          {['ALL', 'ACTIVE', 'PAUSED', 'STOPPED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedStatusFilter === status
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {status === 'ALL' ? 'All Statuses' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State when 0 gyms exist on the MongoDB cluster */}
      {tenants.length === 0 && !loadingLive && (
        <div className="p-10 rounded-3xl border-2 border-dashed border-border/80 bg-card/60 text-center space-y-4 my-2">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground">No Gym Tenants in MongoDB Atlas</h3>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Your MongoDB Atlas cluster is completely clean. When a new gym signs up through the public portal at <strong>/auth/register</strong>, their dedicated multi-tenant database (<code>gymflow_db_...</code>) will be dynamically created and displayed here in real-time.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="sm"
              onClick={() => navigate('/auth/register')}
              className="gap-2 font-bold text-xs shadow-md shadow-primary/20 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register First Gym Facility (/auth/register)</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={loadingLive}
              onClick={() => fetchLiveTenants()}
              className="gap-2 text-xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingLive ? 'animate-spin' : ''}`} />
              <span>Check MongoDB Cluster</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main Tenant Table */}
      <DataTable
        columns={columns}
        data={filteredTenants}
        searchPlaceholder="Search by gym name, owner, email, campus, or database..."
      />

      {/* Manual Tenant Onboarding Modal */}
      <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border border-border shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-foreground">
              Register New Gym Organization
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Manually provision a new tenant into the GymFlow SaaS network.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTenant} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Gym Brand Name *</label>
              <Input
                placeholder="e.g. NextGen Athletic Center"
                value={newGymName}
                onChange={(e) => setNewGymName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Primary Facility / Campus</label>
              <Input
                placeholder="e.g. North Campus"
                value={newCampus}
                onChange={(e) => setNewCampus(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Owner Full Name *</label>
                <Input
                  placeholder="e.g. Rohit Mehra"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Owner Email Address *</label>
                <Input
                  type="email"
                  placeholder="rohit@gym.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Phone Number</label>
                <Input
                  placeholder="9876543210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Initial Password</label>
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Plan Tier</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as TenantPlanTier)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground"
                >
                  <option value="ESSENTIAL">Essential (₹1,500/mo)</option>
                  <option value="PROFESSIONAL">Professional (₹2,500/mo)</option>
                  <option value="ENTERPRISE">Enterprise (₹4,500/mo)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Billing Cadence</label>
                <select
                  value={newCycle}
                  onChange={(e) => setNewCycle(e.target.value as 'MONTHLY' | 'ANNUAL')}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="ANNUAL">Annual (Prepaid)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddTenantOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-semibold shadow-md shadow-primary/20">
                Provision Tenant
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
