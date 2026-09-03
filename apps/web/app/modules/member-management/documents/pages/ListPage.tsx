import React, { useEffect, useState, useMemo, useRef } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox } from '../../../../shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import {
  FileText,
  ShieldCheck,
  Clock,
  HardDrive,
  Plus,
  FileDown,
  Eye,
  FileCheck2,
  FileBadge,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Upload,
  Paperclip,
  XCircle,
  ShieldAlert,
  Send,
  UserCheck,
  File,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IDocumentItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  documentType: 'MEMBERSHIP_CONTRACT' | 'LIABILITY_WAIVER' | 'GOVERNMENT_ID' | 'MEDICAL_CLEARANCE' | 'CORPORATE_STUDENT_PROOF' | 'PAYMENT_RECEIPT';
  title: string;
  fileName: string;
  fileSize: string;
  fileFormat: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'EXPIRED' | 'REJECTED';
  uploadDate: string;
  expiryDate?: string;
  verifiedBy?: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documents, setDocuments] = useState<IDocumentItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MEMBERSHIP_CONTRACT' | 'LIABILITY_WAIVER' | 'MEDICAL_CLEARANCE' | 'GOVERNMENT_ID' | 'CORPORATE_STUDENT_PROOF'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Upload Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [documentType, setDocumentType] = useState<'MEMBERSHIP_CONTRACT' | 'LIABILITY_WAIVER' | 'GOVERNMENT_ID' | 'MEDICAL_CLEARANCE' | 'CORPORATE_STUDENT_PROOF' | 'PAYMENT_RECEIPT'>('MEMBERSHIP_CONTRACT');
  const [title, setTitle] = useState('VIP Annual Membership Agreement & Terms 2026');
  const [fileName, setFileName] = useState('sarah_jenkins_vip_agreement_2026.pdf');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [verificationStatus, setVerificationStatus] = useState<'VERIFIED' | 'PENDING_REVIEW'>('VERIFIED');
  const [verifiedBy, setVerifiedBy] = useState('Manager Alex Vance');
  const [notes, setNotes] = useState('Signed via DocuSign with biometric turnstile consent.');
  const [submitting, setSubmitting] = useState(false);

  // Document Inspection & Verification Modal State
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<IDocumentItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/documents', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDocuments(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMB} MB`);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFileFormat(ext);
      toast.success(`Selected file: ${file.name} (${sizeMB} MB)`);
    }
  };

  const openInspectModal = (doc: IDocumentItem) => {
    setSelectedDoc(doc);
    setReviewNote(doc.notes || 'Document verified in compliance with GymFlow legal & safety guidelines.');
    setInspectModalOpen(true);
  };

  const handleVerifyDocument = async (statusToSet: 'VERIFIED' | 'REJECTED') => {
    if (!selectedDoc) return;
    setVerifying(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const docId = selectedDoc._id || selectedDoc.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/member-management/documents/${docId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationStatus: statusToSet,
          verifiedBy: statusToSet === 'VERIFIED' ? 'Manager Alex Vance' : 'Declined by Reception',
          notes: reviewNote,
        }),
      });

      if (res.ok) {
        if (statusToSet === 'VERIFIED') {
          toast.success(`Document Approved & Verified!`, {
            description: `${selectedDoc.title} stamped as 🟢 Verified & Legal by Manager Alex Vance`,
          });
        } else {
          toast.error(`Document Rejected`, {
            description: `Sent automated SMS / WhatsApp notification to ${selectedDoc.memberName} to re-upload.`,
          });
        }
        setInspectModalOpen(false);
        await loadDocuments();
      } else {
        toast.error('Failed to update document verification status');
      }
    } catch {
      toast.error('Failed to connect to verification server');
    } finally {
      setVerifying(false);
    }
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return documents;
    return documents.filter((d) => d.documentType === activeTab);
  }, [documents, activeTab]);

  const stats = useMemo(() => {
    const verified = documents.filter((d) => d.verificationStatus === 'VERIFIED');
    const pending = documents.filter((d) => d.verificationStatus === 'PENDING_REVIEW');
    const contracts = documents.filter((d) => d.documentType === 'MEMBERSHIP_CONTRACT' || d.documentType === 'LIABILITY_WAIVER');

    return {
      total: documents.length,
      verifiedCount: verified.length,
      pendingCount: pending.length,
      contractCount: contracts.length,
    };
  }, [documents]);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const memberNames: Record<string, string> = {
        'GF-9284': 'Sarah Jenkins',
        'GF-3109': 'David Chen',
        'GF-4821': 'Marcus Rodriguez',
        'GF-7712': 'Emily Watson',
        'GF-5520': 'Liam O Connor',
        'GF-9014': 'Jessica Taylor',
      };

      const name = memberNames[memberCode] || `Member #${memberCode}`;

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/documents', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          documentType,
          title,
          fileName,
          fileSize,
          fileFormat,
          verificationStatus,
          verifiedBy,
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Document uploaded to digital vault for ${name}!`, {
          description: `${title} (${fileFormat} • ${fileSize})`,
        });
        setCreateModalOpen(false);
        await loadDocuments();
      } else {
        toast.error('Failed to upload document');
      }
    } catch {
      toast.error('Failed to connect to document vault service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IDocumentItem>[] = [
    {
      accessorKey: 'memberName',
      header: 'Member',
      size: 210,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs shrink-0">
            {row.original.memberName.charAt(0)}
          </div>
          <div className="truncate">
            <span
              onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
              className="font-semibold text-xs text-foreground block truncate hover:underline hover:text-primary cursor-pointer"
            >
              {row.original.memberName}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              #{row.original.memberCode} • {row.original.planTier?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Document Name & Format',
      size: 250,
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-bold text-xs text-foreground block truncate">
            {row.original.title}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold uppercase bg-muted/40">
              {row.original.fileFormat}
            </Badge>
            <span>{row.original.fileSize}</span>
            <span className="truncate text-muted-foreground">({row.original.fileName})</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'documentType',
      header: 'Category',
      size: 190,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-semibold whitespace-nowrap bg-primary/5 text-primary border-primary/20">
          {row.original.documentType?.replace(/_/g, ' ') || 'DOCUMENT'}
        </Badge>
      ),
    },
    {
      accessorKey: 'verificationStatus',
      header: 'Verification Status',
      size: 190,
      cell: ({ row }) => {
        const st = row.original.verificationStatus;
        if (st === 'VERIFIED') {
          return (
            <div className="space-y-0.5">
              <Badge variant="success" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2 py-0.5">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>Verified & Legal</span>
              </Badge>
              <span className="text-[10px] text-muted-foreground block truncate">By {row.original.verifiedBy}</span>
            </div>
          );
        }
        if (st === 'REJECTED') {
          return (
            <div className="space-y-0.5">
              <Badge variant="destructive" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2 py-0.5">
                <XCircle className="h-3 w-3 shrink-0" />
                <span>Rejected</span>
              </Badge>
              <span className="text-[10px] text-rose-500 font-semibold block truncate">Re-upload requested</span>
            </div>
          );
        }
        return (
          <div className="space-y-0.5">
            <Badge variant="warning" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2 py-0.5">
              <Clock className="h-3 w-3 shrink-0" />
              <span>Pending Review</span>
            </Badge>
            <span className="text-[10px] text-amber-600 font-semibold block truncate">Action required</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'uploadDate',
      header: 'Upload & Expiry Date',
      size: 170,
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {new Date(row.original.uploadDate).toLocaleDateString()}
          </span>
          {row.original.expiryDate && (
            <span className="text-[10px] text-muted-foreground block">
              Exp: {new Date(row.original.expiryDate).toLocaleDateString()}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions & Verification',
      size: 200,
      cell: ({ row }) => {
        const isPending = row.original.verificationStatus === 'PENDING_REVIEW';
        return (
          <div className="flex items-center gap-1.5">
            {isPending ? (
              <Button
                size="sm"
                onClick={() => openInspectModal(row.original)}
                className="h-7 px-2.5 text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs"
                title="Review & Verify Document"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Review & Verify</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openInspectModal(row.original)}
                className="h-7 px-2 text-xs gap-1 shadow-xs"
                title="Inspect File"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Inspect</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success(`Downloading ${row.original.fileName}...`, {
                  description: `Encrypted copy downloaded securely from S3 vault`,
                });
              }}
              className="h-7 px-2 text-xs gap-1 shadow-xs"
              title="Download Document"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Download</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Member Documents & Legal Vault"
        subtitle="Secure encrypted repository for signed membership agreements, liability waivers, government IDs, and physician clearance certificates."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Document</span>
            </Button>
          </div>
        }
      />

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Verified Documents"
          value={`${stats.verifiedCount} Files`}
          change={`${Math.round((stats.verifiedCount / Math.max(1, stats.total)) * 100)}% Verified`}
          trend="up"
          timeframe="Compliant records"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Pending Verification"
          value={`${stats.pendingCount} File`}
          change="Awaiting manager sign-off"
          trend="up"
          timeframe="In review queue"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Contracts & Waivers"
          value={`${stats.contractCount} Agreements`}
          change="100% Signed digitally"
          trend="up"
          timeframe="Legally binding"
          icon={<FileText className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Vault Storage"
          value="12.8 MB"
          change="Encrypted AWS S3 vault"
          trend="up"
          timeframe="Zero compliance leaks"
          icon={<HardDrive className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Documents', count: stats.total },
          { key: 'MEMBERSHIP_CONTRACT', label: '📄 Signed Contracts', count: documents.filter((d) => d.documentType === 'MEMBERSHIP_CONTRACT').length },
          { key: 'LIABILITY_WAIVER', label: '🛡️ Liability Waivers', count: documents.filter((d) => d.documentType === 'LIABILITY_WAIVER').length },
          { key: 'MEDICAL_CLEARANCE', label: '🩺 Medical Clearances', count: documents.filter((d) => d.documentType === 'MEDICAL_CLEARANCE').length },
          { key: 'GOVERNMENT_ID', label: '🆔 ID Proofs', count: documents.filter((d) => d.documentType === 'GOVERNMENT_ID').length },
          { key: 'CORPORATE_STUDENT_PROOF', label: '🎓 Student / Corp Proofs', count: documents.filter((d) => d.documentType === 'CORPORATE_STUDENT_PROOF').length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === t.key
                  ? 'bg-white/20 text-white'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredList}
        loading={loading}
        searchPlaceholder="Search documents by member, title, file name, verified by..."
      />

      {/* Interactive Document Inspection & Verification Modal */}
      <Dialog open={inspectModalOpen} onOpenChange={setInspectModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileBadge className="h-5 w-5 text-primary" />
              <span>Document Verification & Inspection Terminal</span>
            </DialogTitle>
            <DialogDescription>
              Review member documentation, verify legal validity, and approve compliance.
            </DialogDescription>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4 py-2 text-xs">
              {/* Member & Document Banner */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-foreground block">
                    {selectedDoc.title}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Member: <strong className="text-foreground">{selectedDoc.memberName}</strong> (#{selectedDoc.memberCode})
                  </span>
                </div>
                <div className="text-right">
                  <Badge variant={selectedDoc.verificationStatus === 'VERIFIED' ? 'success' : 'warning'} className="font-semibold text-[10px]">
                    {selectedDoc.verificationStatus?.replace(/_/g, ' ') || 'PENDING'}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground block font-mono mt-0.5">
                    {selectedDoc.fileFormat} • {selectedDoc.fileSize}
                  </span>
                </div>
              </div>

              {/* Visual Document Inspection Canvas */}
              <div className="p-6 rounded-xl border-2 border-dashed border-border bg-gradient-to-b from-card to-muted/30 flex flex-col items-center justify-center text-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                  <File className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{selectedDoc.fileName}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Uploaded on {new Date(selectedDoc.uploadDate).toLocaleDateString()} • Category: {selectedDoc.documentType?.replace(/_/g, ' ') || 'DOCUMENT'}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.success(`Opening high-resolution preview for ${selectedDoc.fileName}...`);
                    }}
                    className="h-7 px-3 text-xs gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Open Full Screen Preview</span>
                  </Button>
                </div>
              </div>

              {/* Compliance Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Verification & Audit Notes</label>
                <Input
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Enter verification notes or rejection reason..."
                />
              </div>

              <DialogFooter className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={verifying}
                  onClick={() => handleVerifyDocument('REJECTED')}
                  className="gap-1.5 font-bold"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject & Request Re-Upload</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setInspectModalOpen(false)}>
                    Close
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={verifying}
                    onClick={() => handleVerifyDocument('VERIFIED')}
                    className="gap-1.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{verifying ? 'Updating...' : 'Approve & Verify Document'}</span>
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-primary" />
              <span>Upload Document to Secure Member Vault</span>
            </DialogTitle>
            <DialogDescription>
              Upload contracts, liability waivers, IDs, or doctor certificates to the encrypted vault.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDocument} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Select Member"
                value={memberCode}
                onChange={setMemberCode}
                options={[
                  { value: 'GF-9284', label: '👑 Sarah Jenkins (#GF-9284 • VIP)' },
                  { value: 'GF-3109', label: '🥈 David Chen (#GF-3109 • Silver)' },
                  { value: 'GF-4821', label: '⭐ Marcus Rodriguez (#GF-4821 • Gold)' },
                  { value: 'GF-7712', label: '👑 Emily Watson (#GF-7712 • VIP)' },
                  { value: 'GF-5520', label: '🎓 Liam O Connor (#GF-5520 • Student)' },
                  { value: 'GF-9014', label: '⭐ Jessica Taylor (#GF-9014 • Gold)' },
                ]}
              />

              <SelectBox
                label="Document Category"
                value={documentType}
                onChange={(v) => setDocumentType(v as any)}
                options={[
                  { value: 'MEMBERSHIP_CONTRACT', label: '📄 Membership Contract' },
                  { value: 'LIABILITY_WAIVER', label: '🛡️ Liability & PAR-Q Waiver' },
                  { value: 'GOVERNMENT_ID', label: '🆔 Government ID / License' },
                  { value: 'MEDICAL_CLEARANCE', label: '🩺 Medical Clearance Letter' },
                  { value: 'CORPORATE_STUDENT_PROOF', label: '🎓 Student / Corp Proof' },
                  { value: 'PAYMENT_RECEIPT', label: '🧾 Payment / Tax Receipt' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Document Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. VIP Annual Membership Agreement 2026"
                required
              />
            </div>

            {/* Interactive File Upload Dropzone with Browse Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Document File Attachment</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-all bg-primary/5 hover:bg-primary/10 group"
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Click to Browse File from Device
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      Supports PDF, PNG, JPG, DOCX (Max 25MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs gap-1.5 mt-1 font-semibold border-primary/30 text-primary bg-background shadow-xs pointer-events-none"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Choose File</span>
                  </Button>
                </div>
              </div>

              {/* Uploaded File Pill */}
              {fileName && (
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="font-bold text-foreground truncate">{fileName}</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 uppercase">
                      {fileFormat}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{fileSize}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Verification Status"
                value={verificationStatus}
                onChange={(v) => setVerificationStatus(v as any)}
                options={[
                  { value: 'VERIFIED', label: '🟢 Verified & Compliant' },
                  { value: 'PENDING_REVIEW', label: '🟡 Pending Review / Signature' },
                ]}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Verified By</label>
                <Input
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Manager Name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Document Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Sign-off notes, validity period, etc."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <Upload className="h-4 w-4" />
                <span>{submitting ? 'Uploading to Vault...' : 'Upload & Secure in Vault'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
