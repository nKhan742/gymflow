import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, ShieldCheck, Database, FileCheck, CheckCircle2, Lock, Printer, Fingerprint } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IAuditLogModel } from '../types';

const DEFAULT_AUDIT_LOGS: Record<string, IAuditLogModel> = {
  'AUD-1001': {
    id: 'AUD-1001',
    _id: 'AUD-1001',
    auditRecordNumber: 'REC-908210',
    mutationType: 'UPDATE',
    entityType: 'INVOICE',
    entityId: 'INV-2026-8841',
    entityLabel: 'Corporate Annual VIP Membership Invoice',
    changedBy: 'Sarah Jenkins',
    changedByEmail: 's.jenkins@gymflow.io',
    changedByAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    changedByRole: 'Super Administrator',
    beforeStateJson: '{\n  "amountDue": 1200.00,\n  "status": "PENDING",\n  "taxRate": 0.08\n}',
    afterStateJson: '{\n  "amountDue": 1200.00,\n  "status": "PAID",\n  "taxRate": 0.08,\n  "paymentMethod": "STRIPE_CARD"\n}',
    complianceCategory: 'SOX_FINANCIAL',
    hashSignature: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    timestamp: '5 mins ago',
    status: 'VERIFIED',
  },
  'AUD-1002': {
    id: 'AUD-1002',
    _id: 'AUD-1002',
    auditRecordNumber: 'REC-908211',
    mutationType: 'FORCE_OVERRIDE',
    entityType: 'TURNSTILE_GATE',
    entityId: 'GATE-NORTH-01',
    entityLabel: 'Optical Turnstile Gate #01 Emergency Fire Override',
    changedBy: 'Marcus Vance, CSCS',
    changedByEmail: 'm.vance@gymflow.io',
    changedByAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    changedByRole: 'Facility Administrator',
    beforeStateJson: '{\n  "gateStatus": "LOCKED",\n  "biometricNfc": true,\n  "emergencyMode": false\n}',
    afterStateJson: '{\n  "gateStatus": "EMERGENCY_OPEN",\n  "biometricNfc": false,\n  "emergencyMode": true\n}',
    complianceCategory: 'INTERNAL_GOVERNANCE',
    hashSignature: 'sha256:cb23833f78d62d2b88c366436ec4e6014e912a23366c8b417c667a4e69b50b7b',
    timestamp: '24 mins ago',
    status: 'VERIFIED',
  },
};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<IAuditLogModel>(DEFAULT_AUDIT_LOGS['AUD-1001']);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_audit_logs');
    if (stored) {
      const customList: IAuditLogModel[] = JSON.parse(stored);
      const found = customList.find((a) => (a.id || a._id) === id);
      if (found) {
        setAudit({ ...DEFAULT_AUDIT_LOGS['AUD-1001'], ...found });
        return;
      }
    }

    if (DEFAULT_AUDIT_LOGS[id]) {
      setAudit(DEFAULT_AUDIT_LOGS[id]);
    }
  }, [id]);

  const safeName = audit?.changedBy || 'Auditor';
  const safeInitials = safeName.slice(0, 2).toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title={`Forensic Audit Dossier #${audit?.auditRecordNumber || id || 'AUD-1001'}`}
        subtitle={`Cryptographically verified mutation snapshot and state diff for ${audit?.entityType} [${audit?.entityId}]`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/audit-logs')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Certificate</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate(`/administration/audit-logs/${audit?.id || id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              <span>Inspect & Annotate</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="MUTATION TYPE"
          value={audit?.mutationType || 'UPDATE'}
          change={`Target: ${audit?.entityType}`}
          trend="up"
          timeframe="Database Operation"
          icon={<Database className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="COMPLIANCE CATEGORY"
          value={audit?.complianceCategory || 'SOX_FINANCIAL'}
          change="Immutable Legal Vault"
          trend="up"
          timeframe="Framework"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="AUDIT STATUS"
          value={audit?.status === 'VERIFIED' ? '🟢 VERIFIED' : (audit?.status || 'VERIFIED')}
          change="Cryptographic Merkle Proof"
          trend="up"
          timeframe="State Integrity"
          icon={<CheckCircle2 className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="CRYPTOGRAPHIC HASH"
          value="SHA-256 Signed"
          change="Tamper-Evident Ledger"
          trend="up"
          timeframe="Security"
          icon={<Fingerprint className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Hero Header Card */}
      <Card className="mb-6 border border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                <AvatarImage src={audit?.changedByAvatarUrl} alt={safeName} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {safeInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground">{audit?.entityLabel}</h2>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                    {audit?.entityId}
                  </Badge>
                  <Badge variant="success" className="text-[10px] font-bold">
                    {audit?.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Committed by <strong className="text-foreground">{safeName}</strong> ({audit?.changedByRole}) • <span className="font-mono">{audit?.timestamp}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border flex items-center gap-2 text-xs font-mono">
            <Fingerprint className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-muted-foreground">Digital Hash Signature:</span>
            <span className="font-bold text-foreground truncate">{audit?.hashSignature}</span>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side State Diffs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-500">
              <FileCheck className="h-4 w-4" />
              Before State Snapshot (Prior Mutation)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3.5 bg-rose-500/5 border border-rose-500/20 rounded-xl text-[11px] font-mono text-foreground overflow-x-auto">
              {audit?.beforeStateJson || '{}'}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-500">
              <FileCheck className="h-4 w-4" />
              After State Snapshot (Committed State)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[11px] font-mono text-foreground overflow-x-auto">
              {audit?.afterStateJson || '{}'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
