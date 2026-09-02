import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, KeyRound, ShieldAlert, Layers, CheckCircle2, Users, Printer, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IPermissionModel } from '../types';

const DEFAULT_PERMISSIONS: Record<string, IPermissionModel> = {
  'PRM-101': {
    id: 'PRM-101',
    _id: 'PRM-101',
    permissionName: 'Sign GAAP Tax Invoices',
    permissionCode: 'gymflow.finance.invoices.sign',
    moduleDomain: 'Finance & Billing',
    actionType: 'SIGN_OFF',
    description: 'Executive digital signature authority to certify tax invoices and reconcile payment settlements.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'CRITICAL',
    grantedRolesCount: 2,
    isSystemProtected: true,
    status: 'ACTIVE',
    createdAt: '2026-08-25T08:00:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
  },
  'PRM-102': {
    id: 'PRM-102',
    _id: 'PRM-102',
    permissionName: 'Override Turnstile IoT Gates',
    permissionCode: 'gymflow.gym.turnstiles.override',
    moduleDomain: 'Gym Management',
    actionType: 'UPDATE',
    description: 'Emergency optical turnstile unlock and anti-tailgating sensor security override.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'HIGH',
    grantedRolesCount: 3,
    isSystemProtected: true,
    status: 'ACTIVE',
    createdAt: '2026-08-26T08:00:00.000Z',
    updatedAt: '2026-08-26T08:00:00.000Z',
  },
  'PRM-103': {
    id: 'PRM-103',
    _id: 'PRM-103',
    permissionName: 'Freeze Member Contract',
    permissionCode: 'gymflow.members.freeze.execute',
    moduleDomain: 'Member Management',
    actionType: 'UPDATE',
    description: 'Execute medical, travel, or military suspension freezes on active recurring contracts.',
    iconAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    grantedRolesCount: 4,
    isSystemProtected: false,
    status: 'ACTIVE',
    createdAt: '2026-08-27T08:00:00.000Z',
    updatedAt: '2026-08-27T08:00:00.000Z',
  },
};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [perm, setPerm] = useState<IPermissionModel>(DEFAULT_PERMISSIONS['PRM-101']);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_permissions');
    if (stored) {
      const customList: IPermissionModel[] = JSON.parse(stored);
      const found = customList.find((p) => (p.id || p._id) === id);
      if (found) {
        setPerm({ ...DEFAULT_PERMISSIONS['PRM-101'], ...found });
        return;
      }
    }

    if (DEFAULT_PERMISSIONS[id]) {
      setPerm(DEFAULT_PERMISSIONS[id]);
    }
  }, [id]);

  const safeName = perm?.permissionName || 'Permission Grant';
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title={`Permission Dossier • ${safeName}`}
        subtitle={`Capability grants, action verb scope, and NIST security rating for #${perm?.id || id || 'PRM-101'}`}
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
              onClick={() => navigate(`/administration/permissions/${perm?.id || id}/edit`)}
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
          title="RISK CLASSIFICATION"
          value={perm?.riskLevel || 'LOW'}
          change={perm?.riskLevel === 'CRITICAL' ? '🔴 High Impact Mutation' : 'Standard Capability'}
          trend={perm?.riskLevel === 'CRITICAL' ? 'down' : 'up'}
          timeframe="NIST 800-53"
          icon={<ShieldAlert className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="TARGET DOMAIN"
          value={perm?.moduleDomain || 'System'}
          change={`Action: ${perm?.actionType}`}
          trend="up"
          timeframe="Module Scope"
          icon={<Layers className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ROLES HOLDING GRANT"
          value={`${perm?.grantedRolesCount || 0} RBAC Roles`}
          change="Authorized Roles"
          trend="up"
          timeframe="Privilege Distribution"
          icon={<Users className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="PROTECTION STATUS"
          value={perm?.isSystemProtected ? '🔒 PROTECTED' : 'CUSTOM'}
          change="Immutable Core Rule"
          trend="up"
          timeframe="Zero-Trust"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Hero Header Card */}
      <Card className="mb-6 border border-border">
        <CardContent className="p-6">
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
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {perm?.permissionCode}
                  </Badge>
                  <Badge
                    variant={perm?.riskLevel === 'CRITICAL' ? 'destructive' : perm?.riskLevel === 'HIGH' ? 'warning' : 'success'}
                    className="text-[10px] font-bold"
                  >
                    {perm?.riskLevel} RISK
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {perm?.description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machine Code & Technical Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              Machine Grant Specification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground font-sans">Token String:</span>
              <span className="font-bold text-primary">{perm?.permissionCode}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground font-sans">Action Verb:</span>
              <Badge variant="outline" className="text-[9px] font-bold">{perm?.actionType}</Badge>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground font-sans">Enforcement Scope:</span>
              <span className="font-bold text-foreground">Multi-Branch Gateway Guard</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Security Governance & NIST Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Compliance Category:</span>
              <span className="font-bold text-foreground">NIST AC-3 Access Enforcement</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Audit Logging:</span>
              <span className="font-bold text-emerald-600">Mandatory Immutable Ledger</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">System Protection:</span>
              <span className="font-bold text-foreground">{perm?.isSystemProtected ? 'Root Lock Active' : 'Custom Configurable'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
