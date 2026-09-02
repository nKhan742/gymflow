import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Shield, Mail, Phone, Building2, User, KeyRound, Smartphone, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IUserModel } from '../types';

const DEFAULT_USERS: Record<string, IUserModel> = {
  'USR-1001': {
    id: 'USR-1001',
    _id: 'USR-1001',
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@gymflow.io',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-8901',
    role: 'SUPER_ADMIN',
    roleName: 'Super Administrator (Global)',
    department: 'Executive Operations',
    branchName: 'PD Vihar',
    mfaEnabled: true,
    lastLoginAt: '2 mins ago (Chrome on MacOS)',
    ipAddress: '192.168.1.142 (Encrypted TLS v1.3)',
    status: 'ACTIVE',
    securityScore: 100,
    createdAt: '2026-08-25T08:00:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
  },
  'USR-1002': {
    id: 'USR-1002',
    _id: 'USR-1002',
    fullName: 'Marcus Vance, CSCS',
    email: 'm.vance@gymflow.io',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    role: 'FACILITY_ADMIN',
    roleName: 'Facility Administrator',
    department: 'Personal Training & Fitness',
    branchName: 'PD Vihar',
    mfaEnabled: true,
    lastLoginAt: '18 mins ago (iPad OS / Safari)',
    ipAddress: '172.56.21.90 (Encrypted TLS v1.3)',
    status: 'ACTIVE',
    securityScore: 98,
    createdAt: '2026-08-26T08:00:00.000Z',
    updatedAt: '2026-08-26T08:00:00.000Z',
  },
  'USR-1003': {
    id: 'USR-1003',
    _id: 'USR-1003',
    fullName: 'Elena Rostova',
    email: 'e.rostova@gymflow.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    role: 'BRANCH_MANAGER',
    roleName: 'Branch General Manager',
    department: 'Member Experience',
    branchName: 'PD Vihar',
    mfaEnabled: true,
    lastLoginAt: '1 hour ago (Windows 11 / Edge)',
    ipAddress: '192.168.1.189 (Encrypted TLS v1.3)',
    status: 'ACTIVE',
    securityScore: 95,
    createdAt: '2026-08-27T08:00:00.000Z',
    updatedAt: '2026-08-27T08:00:00.000Z',
  },
};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUserModel>(DEFAULT_USERS['USR-1001']);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_users');
    if (stored) {
      const customList: IUserModel[] = JSON.parse(stored);
      const found = customList.find((u) => (u.id || u._id) === id);
      if (found) {
        setUser({ ...DEFAULT_USERS['USR-1001'], ...found });
        return;
      }
    }

    if (DEFAULT_USERS[id]) {
      setUser(DEFAULT_USERS[id]);
    }
  }, [id]);

  const safeName = user?.fullName || 'Sarah Jenkins';
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title={`User Dossier • ${safeName}`}
        subtitle={`IAM credentials, RBAC security grants, and session audit history for #${user?.id || id || 'USR-1001'}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/users')}>
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
              onClick={() => navigate(`/administration/users/${user?.id || id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit User</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="SECURITY SCORE"
          value={`${user?.securityScore || 98} / 100`}
          change="Enterprise High-Trust Tier"
          trend="up"
          timeframe="Audit Health"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="2FA MFA STATUS"
          value={user?.mfaEnabled ? '🟢 ENFORCED' : '🔴 DISABLED'}
          change="TOTP Authenticator Token"
          trend="up"
          timeframe="Auth Guard"
          icon={<Smartphone className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="RBAC ROLE"
          value={user?.role || 'SUPER_ADMIN'}
          change={user?.roleName || 'Super Administrator'}
          trend="up"
          timeframe="Access Clearance"
          icon={<Shield className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="ACCOUNT STATUS"
          value={user?.status === 'ACTIVE' ? '🟢 ACTIVE' : (user?.status || 'ACTIVE')}
          change="Compliant Directory Member"
          trend="up"
          timeframe="Lifecycle"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Hero Header Card */}
      <Card className="mb-6 border border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
                <AvatarImage src={user?.avatarUrl} alt={safeName} />
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {safeInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">{safeName}</h2>
                  <Badge variant={user?.status === 'ACTIVE' ? 'success' : 'outline'} className="text-[10px] font-bold">
                    {user?.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {user?.id || id}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  {user?.department} • <strong className="text-foreground">{user?.branchName || 'PD Vihar'}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-border">
            <div className="flex items-center gap-2.5 p-2.5 bg-muted/40 rounded-lg text-xs font-mono">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-muted/40 rounded-lg text-xs font-mono">
              <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{user?.phone || 'No phone set'}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-muted/40 rounded-lg text-xs font-mono">
              <KeyRound className="h-4 w-4 text-purple-500 shrink-0" />
              <span className="truncate">{user?.lastLoginAt}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Access Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Assigned RBAC Privileges
            </CardTitle>
            <CardDescription className="text-xs">
              System capabilities granted under role: {user?.roleName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Gym Management & Branches:</span>
              <Badge variant="success" className="text-[9px]">FULL ACCESS (CRUD)</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Finance, POS & Tax Invoices:</span>
              <Badge variant="success" className="text-[9px]">AUTHORIZED SIGNER</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Member Data & Transformation Vault:</span>
              <Badge variant="success" className="text-[9px]">FULL ACCESS</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-muted-foreground">Security & User Governance:</span>
              <Badge variant="default" className="text-[9px]">TIER 1 ADMIN</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-500" />
              Cryptographic Session Audit
            </CardTitle>
            <CardDescription className="text-xs">
              Latest connection IP, TLS cipher, and device footprint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/60 font-mono">
              <span className="text-muted-foreground">Last Known IP:</span>
              <span className="font-bold text-foreground">{user?.ipAddress}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60 font-mono">
              <span className="text-muted-foreground">TLS Protocol:</span>
              <span className="font-bold text-emerald-600">TLS v1.3 (AES-256-GCM)</span>
            </div>
            <div className="flex justify-between py-1.5 font-mono">
              <span className="text-muted-foreground">Authentication Method:</span>
              <span className="font-bold text-primary">SSO + TOTP 2FA Guard</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
