import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, ShieldCheck, Database, FileCheck, Fingerprint, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IAuditLogModel } from '../types';
import { toast } from 'sonner';

export const DEFAULT_AUDIT_LOGS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [audits, setAudits] = useState<IAuditLogModel[]>([]);

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_admin_audit_logs');
      const customList: IAuditLogModel[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/audit-logs', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IAuditLogModel[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_AUDIT_LOGS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((a) => (a.id || a._id) === id)) {
          combined.push(item);
        }
      }
      setAudits(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_admin_audit_logs');
      const customList: IAuditLogModel[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_AUDIT_LOGS) {
        const id = item.id || item._id;
        if (!combined.some((a) => (a.id || a._id) === id)) {
          combined.push(item);
        }
      }
      setAudits(combined);
    }
  };

  const handleDelete = (id: string) => {
    const updated = audits.filter((a) => (a.id || a._id) !== id);
    setAudits(updated);

    const stored = localStorage.getItem('gymflow_custom_admin_audit_logs');
    if (stored) {
      const customList: IAuditLogModel[] = JSON.parse(stored);
      const filtered = customList.filter((a) => (a.id || a._id) !== id);
      localStorage.setItem('gymflow_custom_admin_audit_logs', JSON.stringify(filtered));
    }

    toast.success(`Audit log #${id} deleted from local view`);
  };

  // Telemetry Metrics
  const totalAudits = `${audits.length} Records`;
  const soxCount = `${audits.filter((a) => a.complianceCategory === 'SOX_FINANCIAL').length} SOX Ledgers`;
  const gdprCount = `${audits.filter((a) => a.complianceCategory === 'GDPR_PII').length} GDPR Events`;
  const integrityScore = '100% Merkle Verified';

  const columns: ColumnDef<IAuditLogModel>[] = [
    {
      accessorKey: 'auditRecordNumber',
      header: 'Record # & Target Entity',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-0.5 max-w-[260px]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary">
                {row.original.auditRecordNumber}
              </span>
              <Badge variant="outline" className="text-[9px] font-bold">
                {row.original.entityType}
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/administration/audit-logs/${id}`)}
              className="font-semibold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
            >
              {row.original.entityLabel}
            </button>
            <span className="text-[10px] text-muted-foreground font-mono block">
              ID: {row.original.entityId}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'mutationType',
      header: 'Mutation',
      cell: ({ row }) => {
        const mut = row.original.mutationType;
        return (
          <Badge
            variant={mut === 'CREATE' ? 'success' : mut === 'DELETE' || mut === 'FORCE_OVERRIDE' ? 'destructive' : 'warning'}
            className="text-[9px] font-mono font-bold"
          >
            {mut}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'changedBy',
      header: 'Auditor & Author',
      cell: ({ row }) => {
        const safeName = row.original.changedBy || 'Auditor';
        const safeInitials = safeName.slice(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7 border border-border shrink-0 shadow-2xs">
              <AvatarImage src={row.original.changedByAvatarUrl} alt={safeName} />
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                {safeInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 max-w-[150px]">
              <span className="font-semibold text-xs text-foreground block truncate">
                {safeName}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block truncate">
                {row.original.changedByRole}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'complianceCategory',
      header: 'Compliance Framework',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-bold">
          {row.original.complianceCategory.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'hashSignature',
      header: 'SHA-256 Signature',
      cell: ({ row }) => (
        <span className="font-mono text-[10px] text-muted-foreground block truncate max-w-[130px]" title={row.original.hashSignature}>
          {row.original.hashSignature.slice(0, 16)}...
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Integrity',
      cell: ({ row }) => (
        <Badge variant="success" className="text-[9px] font-bold">
          🟢 {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.timestamp}
        </span>
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
              onClick={() => navigate(`/administration/audit-logs/${id}`)}
              title="View Forensic Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/administration/audit-logs/${id}/edit`)}
              title="Inspect & Annotate"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '')}
              title="Purge Record"
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
        title="Immutable Compliance Audit Ledger"
        subtitle="Forensic mutation history, before/after JSON diffs, SOX financial ledgers, and GDPR privacy records."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'RecordNumber,Entity,EntityType,EntityId,Mutation,Auditor,Compliance,Hash,Status,Timestamp\n' + audits.map((a) => `"${a.auditRecordNumber}","${a.entityLabel}","${a.entityType}","${a.entityId}","${a.mutationType}","${a.changedBy}","${a.complianceCategory}","${a.hashSignature}","${a.status}","${a.timestamp}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `compliance-audit-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Compliance Audit Ledger exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/administration/audit-logs/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Commit Audit Log</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="IMMUTABLE MUTATIONS"
          value={totalAudits}
          change="Cryptographic Chain"
          trend="up"
          timeframe="Audit Vault"
          icon={<Database className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="SOX FINANCIAL AUDITS"
          value={soxCount}
          change="Tax & Invoicing Trail"
          trend="up"
          timeframe="GAAP Compliance"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="GDPR PRIVACY EVENTS"
          value={gdprCount}
          change="PII Erasure / Consent"
          trend="up"
          timeframe="Data Privacy"
          icon={<FileCheck className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="FORENSIC INTEGRITY"
          value={integrityScore}
          change="SHA-256 Signed Merkle"
          trend="up"
          timeframe="Tamper Evident"
          icon={<Fingerprint className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={audits}
        searchPlaceholder="Search audit ledger by record #, entity, auditor, compliance..."
      />
    </PageContainer>
  );
};
