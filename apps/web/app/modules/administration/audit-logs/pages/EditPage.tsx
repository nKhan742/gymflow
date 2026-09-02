import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Database, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { IAuditLogModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

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

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [mutationType, setMutationType] = useState<IAuditLogModel['mutationType']>('UPDATE');
  const [entityType, setEntityType] = useState<IAuditLogModel['entityType']>('INVOICE');
  const [entityId, setEntityId] = useState('INV-2026-8841');
  const [entityLabel, setEntityLabel] = useState('Corporate Annual VIP Membership Invoice');
  const [changedBy, setChangedBy] = useState('Sarah Jenkins');
  const [changedByEmail, setChangedByEmail] = useState('s.jenkins@gymflow.io');
  const [changedByAvatarUrl, setChangedByAvatarUrl] = useState<string | undefined>(undefined);
  const [changedByRole, setChangedByRole] = useState('Super Administrator');
  const [complianceCategory, setComplianceCategory] = useState<IAuditLogModel['complianceCategory']>('SOX_FINANCIAL');
  const [status, setStatus] = useState<IAuditLogModel['status']>('VERIFIED');
  const [beforeStateJson, setBeforeStateJson] = useState('{}');
  const [afterStateJson, setAfterStateJson] = useState('{}');

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('gymflow_custom_admin_audit_logs');
    if (stored) {
      const customList: IAuditLogModel[] = JSON.parse(stored);
      const found = customList.find((a) => (a.id || a._id) === id);
      if (found) {
        setMutationType(found.mutationType);
        setEntityType(found.entityType);
        setEntityId(found.entityId);
        setEntityLabel(found.entityLabel);
        setChangedBy(found.changedBy);
        setChangedByEmail(found.changedByEmail);
        setChangedByAvatarUrl(found.changedByAvatarUrl);
        setChangedByRole(found.changedByRole);
        setComplianceCategory(found.complianceCategory);
        setStatus(found.status);
        setBeforeStateJson(found.beforeStateJson);
        setAfterStateJson(found.afterStateJson);
        return;
      }
    }

    const defaultAudit = DEFAULT_AUDIT_LOGS[id];
    if (defaultAudit) {
      setMutationType(defaultAudit.mutationType);
      setEntityType(defaultAudit.entityType);
      setEntityId(defaultAudit.entityId);
      setEntityLabel(defaultAudit.entityLabel);
      setChangedBy(defaultAudit.changedBy);
      setChangedByEmail(defaultAudit.changedByEmail);
      setChangedByAvatarUrl(defaultAudit.changedByAvatarUrl);
      setChangedByRole(defaultAudit.changedByRole);
      setComplianceCategory(defaultAudit.complianceCategory);
      setStatus(defaultAudit.status);
      setBeforeStateJson(defaultAudit.beforeStateJson);
      setAfterStateJson(defaultAudit.afterStateJson);
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedAudit: IAuditLogModel = {
      id: id || 'AUD-1001',
      _id: id || 'AUD-1001',
      auditRecordNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      mutationType,
      entityType,
      entityId,
      entityLabel,
      changedBy,
      changedByEmail,
      changedByAvatarUrl,
      changedByRole,
      beforeStateJson,
      afterStateJson,
      complianceCategory,
      hashSignature: 'sha256:verified_forensic_hash',
      timestamp: 'Modified just now',
      status,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_audit_logs');
      const existing: IAuditLogModel[] = stored ? JSON.parse(stored) : [];
      const filtered = existing.filter((a) => (a.id || a._id) !== id);
      localStorage.setItem('gymflow_custom_admin_audit_logs', JSON.stringify([updatedAudit, ...filtered]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/audit-logs/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAudit),
      }).catch(() => {});

      toast.success(`Audit record #${id} updated!`);
      navigate('/administration/audit-logs');
    } catch {
      toast.error('Failed to update audit log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Audit Inspection • #${id || 'AUD-1001'}`}
        subtitle={`Review and certify mutation ledger snapshot, cryptographic integrity, and compliance status.`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/audit-logs')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Audit Trail</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Target Entity & Mutation Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Auditor Portrait</label>
                <ImageUpload
                  value={changedByAvatarUrl}
                  onChange={(url) => setChangedByAvatarUrl(url)}
                  variant="avatar"
                  helperText="Upload auditor portrait (1:1)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Mutation Type</label>
                  <Select value={mutationType} onValueChange={(val) => setMutationType(val as IAuditLogModel['mutationType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mutation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPDATE">✏️ UPDATE</SelectItem>
                      <SelectItem value="CREATE">➕ CREATE</SelectItem>
                      <SelectItem value="DELETE">🗑️ DELETE</SelectItem>
                      <SelectItem value="FORCE_OVERRIDE">⚠️ FORCE_OVERRIDE</SelectItem>
                      <SelectItem value="STATUS_CHANGE">🔄 STATUS_CHANGE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Entity Type</label>
                  <Select value={entityType} onValueChange={(val) => setEntityType(val as IAuditLogModel['entityType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INVOICE">💳 Tax Invoice / Payment</SelectItem>
                      <SelectItem value="MEMBER">👥 Member Dossier / Contract</SelectItem>
                      <SelectItem value="PERMISSION">🔑 RBAC Permission Grant</SelectItem>
                      <SelectItem value="SHIFT">⏱️ Staff Shift / Roster</SelectItem>
                      <SelectItem value="TURNSTILE_GATE">🚪 Turnstile Hardware Gate</SelectItem>
                      <SelectItem value="PRODUCT">📦 Retail Product SKU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Compliance Category</label>
                  <Select value={complianceCategory} onValueChange={(val) => setComplianceCategory(val as IAuditLogModel['complianceCategory'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Compliance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOX_FINANCIAL">🏛️ SOX Financial Audit</SelectItem>
                      <SelectItem value="GDPR_PII">🔒 GDPR PII Privacy</SelectItem>
                      <SelectItem value="HIPAA_HEALTH">🩺 HIPAA Health Safeguarding</SelectItem>
                      <SelectItem value="INTERNAL_GOVERNANCE">⚖️ Internal Security Governance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Entity Identifier</label>
                  <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} required className="font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Entity Human Label</label>
                  <Input value={entityLabel} onChange={(e) => setEntityLabel(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Audited By</label>
                  <Input value={changedBy} onChange={(e) => setChangedBy(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Auditor Email</label>
                  <Input type="email" value={changedByEmail} onChange={(e) => setChangedByEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Audit Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IAuditLogModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VERIFIED">🟢 Verified Audit</SelectItem>
                      <SelectItem value="FLAGGED">🔴 Flagged / Discrepancy</SelectItem>
                      <SelectItem value="UNDER_REVIEW">🟡 Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Before State (JSON Snapshot)</label>
                  <textarea
                    rows={4}
                    value={beforeStateJson}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBeforeStateJson(e.target.value)}
                    className="flex min-h-[90px] w-full font-mono rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">After State (JSON Snapshot)</label>
                  <textarea
                    rows={4}
                    value={afterStateJson}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAfterStateJson(e.target.value)}
                    className="flex min-h-[90px] w-full font-mono rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground font-mono">
                Record ID: <strong>{id || 'AUD-1001'}</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Save Audit Review</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
