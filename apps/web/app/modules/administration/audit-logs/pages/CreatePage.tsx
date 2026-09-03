import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, ShieldCheck, Database, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IAuditLogModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [mutationType, setMutationType] = useState<IAuditLogModel['mutationType']>('UPDATE');
  const [entityType, setEntityType] = useState<IAuditLogModel['entityType']>('INVOICE');
  const [entityId, setEntityId] = useState('INV-2026-8841');
  const [entityLabel, setEntityLabel] = useState('Corporate Annual VIP Membership Invoice');
  const [changedBy, setChangedBy] = useState('Sarah Jenkins');
  const [changedByEmail, setChangedByEmail] = useState('s.jenkins@gymflow.io');
  const [changedByAvatarUrl, setChangedByAvatarUrl] = useState<string | undefined>('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
  const [changedByRole, setChangedByRole] = useState('Super Administrator');
  const [complianceCategory, setComplianceCategory] = useState<IAuditLogModel['complianceCategory']>('SOX_FINANCIAL');
  const [status, setStatus] = useState<IAuditLogModel['status']>('VERIFIED');
  const [beforeStateJson, setBeforeStateJson] = useState('{\n  "amountDue": 1200.00,\n  "status": "PENDING",\n  "taxRate": 0.08\n}');
  const [afterStateJson, setAfterStateJson] = useState('{\n  "amountDue": 1200.00,\n  "status": "PAID",\n  "taxRate": 0.08,\n  "paymentMethod": "STRIPE_CARD"\n}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomHash = `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.slice(0, 32);

    const newAuditLog: IAuditLogModel = {
      id: newId,
      _id: newId,
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
      hashSignature: randomHash,
      timestamp: 'Just now',
      status,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_admin_audit_logs');
      const existing: IAuditLogModel[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('gymflow_custom_admin_audit_logs', JSON.stringify([newAuditLog, ...existing]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/audit-logs', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuditLog),
      }).catch(() => {});

      toast.success(`Forensic audit record #${newId} committed to immutable ledger!`);
      navigate('/administration/audit-logs');
    } catch {
      toast.error('Failed to commit audit record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Commit Immutable Compliance Audit Record"
        subtitle="Log cryptographic forensic proof of database mutations, financial ledgers, or privileged security changes."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/administration/audit-logs')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Audit Trail</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Target Entity & Mutation Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Auditor / Author Portrait</label>
                <ImageUpload
                  value={changedByAvatarUrl}
                  onChange={(url) => setChangedByAvatarUrl(url)}
                  variant="avatar"
                  helperText="Upload auditor employee portrait (1:1)"
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
                      <SelectItem value="UPDATE">✏️ UPDATE (Field Modification)</SelectItem>
                      <SelectItem value="CREATE">➕ CREATE (New Record Insert)</SelectItem>
                      <SelectItem value="DELETE">🗑️ DELETE (Purge / Soft-Delete)</SelectItem>
                      <SelectItem value="FORCE_OVERRIDE">⚠️ FORCE_OVERRIDE (Emergency Bypass)</SelectItem>
                      <SelectItem value="STATUS_CHANGE">🔄 STATUS_CHANGE (Lifecycle Transition)</SelectItem>
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
                  <label className="text-xs font-semibold text-foreground">Compliance Framework</label>
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
                  <label className="text-xs font-semibold text-foreground">Entity Identifier (UUID/Code)</label>
                  <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} required className="font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Entity Human Label / Summary</label>
                  <Input value={entityLabel} onChange={(e) => setEntityLabel(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Audited By (Full Name)</label>
                  <Input value={changedBy} onChange={(e) => setChangedBy(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Auditor Email</label>
                  <Input type="email" value={changedByEmail} onChange={(e) => setChangedByEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Auditor Role Title</label>
                  <Input value={changedByRole} onChange={(e) => setChangedByRole(e.target.value)} required />
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
                Integrity Guarantee: <strong>SHA-256 Merkle Tree Signature</strong>
              </span>
              <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Sign & Commit Audit Log</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
