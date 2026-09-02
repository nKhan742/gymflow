import React, { useEffect, useState, useMemo } from 'react';
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
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Plus,
  FileDown,
  Stethoscope,
  Activity,
  CheckCircle2,
  AlertCircle,
  Pill,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IMedicalHistoryItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  clearanceLevel: 'CLEARANCE_GRANTED' | 'MODIFIED_PROGRAM' | 'PHYSICIAN_CLEARANCE_REQUIRED';
  bloodGroup: string;
  chronicConditions: string[];
  allergies: string[];
  injuriesAndRestrictions: string;
  currentMedications?: string;
  physicianName?: string;
  physicianPhone?: string;
  waiverSigned: boolean;
  lastReviewDate: string;
  reviewedBy: string;
  emergencyNotes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [medicalRecords, setMedicalRecords] = useState<IMedicalHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLEARANCE_GRANTED' | 'MODIFIED_PROGRAM' | 'PHYSICIAN_CLEARANCE_REQUIRED'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Medical Profile Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [clearanceLevel, setClearanceLevel] = useState<'CLEARANCE_GRANTED' | 'MODIFIED_PROGRAM' | 'PHYSICIAN_CLEARANCE_REQUIRED'>('CLEARANCE_GRANTED');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [chronicConditions, setChronicConditions] = useState('None');
  const [allergies, setAllergies] = useState('Penicillin');
  const [injuries, setInjuries] = useState('No active orthopedic restrictions. Full range of motion.');
  const [medications, setMedications] = useState('None');
  const [physicianName, setPhysicianName] = useState('Dr. Michael Hayes, MD');
  const [physicianPhone, setPhysicianPhone] = useState('+1 (555) 234-5678');
  const [waiverSigned, setWaiverSigned] = useState(true);
  const [emergencyNotes, setEmergencyNotes] = useState('Emergency contact on file.');
  const [reviewedBy, setReviewedBy] = useState('Coach Alex Vance');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  const loadMedicalRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/medical-history', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setMedicalRecords(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return medicalRecords;
    return medicalRecords.filter((m) => m.clearanceLevel === activeTab);
  }, [medicalRecords, activeTab]);

  const stats = useMemo(() => {
    const cleared = medicalRecords.filter((m) => m.clearanceLevel === 'CLEARANCE_GRANTED');
    const modified = medicalRecords.filter((m) => m.clearanceLevel === 'MODIFIED_PROGRAM');
    const required = medicalRecords.filter((m) => m.clearanceLevel === 'PHYSICIAN_CLEARANCE_REQUIRED');

    return {
      total: medicalRecords.length,
      clearedCount: cleared.length,
      modifiedCount: modified.length,
      requiredCount: required.length,
    };
  }, [medicalRecords]);

  const handleCreateMedicalRecord = async (e: React.FormEvent) => {
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

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/medical-history', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          clearanceLevel,
          bloodGroup,
          chronicConditions: chronicConditions.split(',').map((s) => s.trim()).filter(Boolean),
          allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
          injuriesAndRestrictions: injuries,
          currentMedications: medications,
          physicianName,
          physicianPhone,
          waiverSigned,
          emergencyNotes,
          reviewedBy,
        }),
      });

      if (res.ok) {
        toast.success(`Medical safeguarding record saved for ${name}!`, {
          description: `Clearance: ${clearanceLevel?.replace(/_/g, ' ') || 'STANDARD'} • Blood: ${bloodGroup}`,
        });
        setCreateModalOpen(false);
        await loadMedicalRecords();
      } else {
        toast.error('Failed to save medical history record');
      }
    } catch {
      toast.error('Failed to connect to medical history service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IMedicalHistoryItem>[] = [
    {
      accessorKey: 'memberName',
      header: 'Member',
      size: 210,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-rose-500/15 text-rose-600 font-bold flex items-center justify-center text-xs shrink-0">
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
              #{row.original.memberCode} • Blood: <strong className="text-foreground">{row.original.bloodGroup}</strong>
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'clearanceLevel',
      header: 'Clearance Status',
      size: 200,
      cell: ({ row }) => {
        const clr = row.original.clearanceLevel;
        if (clr === 'CLEARANCE_GRANTED') {
          return (
            <div className="space-y-1">
              <Badge variant="success" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2.5 py-0.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Fully Cleared</span>
              </Badge>
              <span className="text-[10px] text-muted-foreground block whitespace-nowrap">Waiver on file</span>
            </div>
          );
        }
        if (clr === 'MODIFIED_PROGRAM') {
          return (
            <div className="space-y-1">
              <Badge variant="warning" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Modified Load</span>
              </Badge>
              <span className="text-[10px] text-amber-600 font-semibold block whitespace-nowrap">Injury restrictions</span>
            </div>
          );
        }
        return (
          <div className="space-y-1">
            <Badge variant="destructive" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Doctor Waiver Required</span>
            </Badge>
            <span className="text-[10px] text-rose-600 font-semibold block whitespace-nowrap">High risk safeguard</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'injuriesAndRestrictions',
      header: 'Injury & Orthopedic Safeguards',
      size: 260,
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-xs text-foreground leading-relaxed">
            {row.original.injuriesAndRestrictions}
          </p>
          {row.original.currentMedications && row.original.currentMedications !== 'None' && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Pill className="h-3 w-3 text-primary shrink-0" />
              <span>Medication: {row.original.currentMedications}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'allergies',
      header: 'Allergies & Alerts',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1">
            {row.original.allergies?.map((a, idx) => (
              <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 font-semibold border-rose-500/30 text-rose-600 bg-rose-500/5 whitespace-nowrap">
                {a}
              </Badge>
            ))}
          </div>
          {row.original.emergencyNotes && (
            <span className="text-[10px] text-muted-foreground block truncate">
              {row.original.emergencyNotes}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'physicianName',
      header: 'Physician & Review',
      size: 180,
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.physicianName || 'Clinic on file'}
          </span>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {row.original.physicianPhone}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            Rev: {row.original.reviewedBy}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 130,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success(`Exporting Emergency Safeguarding Summary for ${row.original.memberName}!`, {
                description: `Clearance: ${row.original.clearanceLevel?.replace(/_/g, ' ') || 'STANDARD'} • Blood: ${row.original.bloodGroup}`,
              });
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Download Safeguard Summary"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Card</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
            className="h-7 px-2 text-xs"
          >
            Profile
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Medical History & Health Safeguards"
        subtitle="Track PAR-Q health readiness questionnaires, orthopedic injury restrictions, allergies, and physician waivers."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Record Medical Profile</span>
            </Button>
          </div>
        }
      />

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Fully Cleared Members"
          value={`${stats.clearedCount} Active`}
          change={`${Math.round((stats.clearedCount / Math.max(1, stats.total)) * 100)}% Club Total`}
          trend="up"
          timeframe="Zero activity restrictions"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Modified Load / Rehab"
          value={`${stats.modifiedCount} Member`}
          change="Active injury safeguard"
          trend="up"
          timeframe="Coach restrictions active"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Physician Waiver Required"
          value={`${stats.requiredCount} Member`}
          change="Doctor clearance pending"
          trend="up"
          timeframe="High risk profile"
          icon={<HeartPulse className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="Total Medical Profiles"
          value={`${stats.total} Records`}
          change="100% PAR-Q compliance"
          trend="up"
          timeframe="Active club members"
          icon={<Stethoscope className="h-5 w-5 text-primary" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Medical Profiles', count: stats.total },
          { key: 'CLEARANCE_GRANTED', label: '🟢 Fully Cleared', count: stats.clearedCount },
          { key: 'MODIFIED_PROGRAM', label: '🟡 Modified Load / Injury', count: stats.modifiedCount },
          { key: 'PHYSICIAN_CLEARANCE_REQUIRED', label: '🔴 Doctor Waiver Req.', count: stats.requiredCount },
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
        searchPlaceholder="Search medical records by member name, ID, conditions..."
      />

      {/* Log Medical Profile Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-rose-500" />
              <span>Record Member Medical Profile & PAR-Q</span>
            </DialogTitle>
            <DialogDescription>
              Record health conditions, injury safeguards, allergies, and physician clearance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMedicalRecord} className="space-y-4 py-2">
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
                label="Clearance Status"
                value={clearanceLevel}
                onChange={(v) => setClearanceLevel(v as any)}
                options={[
                  { value: 'CLEARANCE_GRANTED', label: '🟢 Fully Cleared' },
                  { value: 'MODIFIED_PROGRAM', label: '🟡 Modified Load / Injury' },
                  { value: 'PHYSICIAN_CLEARANCE_REQUIRED', label: '🔴 Doctor Waiver Required' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Blood Group</label>
                <Input
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="e.g. O+, A+, B-"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Allergies (comma separated)</label>
                <Input
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. Penicillin, Latex, Peanuts"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Injury & Orthopedic Restrictions</label>
              <Input
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Post-ACL knee repair. Avoid heavy plyometrics."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Current Medications</label>
                <Input
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. Albuterol inhaler PRN"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Physician Name & Phone</label>
                <Input
                  value={physicianName}
                  onChange={(e) => setPhysicianName(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Dr. Name (+1 555-000-0000)"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Emergency Safeguard Notes</label>
              <Input
                value={emergencyNotes}
                onChange={(e) => setEmergencyNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Rescue inhaler location, emergency card, etc."
              />
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground">Physical Activity Readiness Waiver</p>
                <p className="text-muted-foreground">PAR-Q signed by member & coach</p>
              </div>
              <input
                type="checkbox"
                checked={waiverSigned}
                onChange={(e) => setWaiverSigned(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Saving Profile...' : 'Save Medical Profile'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
