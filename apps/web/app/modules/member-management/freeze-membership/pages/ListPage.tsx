import React, { useEffect, useState, useMemo } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { SelectBox } from '../../../../shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import {
  Snowflake,
  Play,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  FileText,
  User,
  Crown,
  Sparkles,
  Plane,
  HeartPulse,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IFreezeItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  planTier: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: 'MEDICAL' | 'TRAVEL' | 'WORK_RELOCATION' | 'PERSONAL' | 'PREGNANCY';
  freezeStatus: 'ACTIVE_FROZEN' | 'SCHEDULED' | 'PENDING_APPROVAL' | 'COMPLETED_UNFROZEN' | 'REJECTED';
  feeAmount: number;
  quotaDaysUsed: number;
  maxQuotaDays: number;
  doctorNoteAttached: boolean;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [holds, setHolds] = useState<IFreezeItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE_FROZEN' | 'SCHEDULED' | 'PENDING_APPROVAL' | 'COMPLETED_UNFROZEN'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Freeze Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [durationDays, setDurationDays] = useState('30');
  const [reason, setReason] = useState<'MEDICAL' | 'TRAVEL' | 'WORK_RELOCATION' | 'PERSONAL'>('MEDICAL');
  const [doctorNote, setDoctorNote] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadHolds();
  }, []);

  const loadHolds = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/freeze-membership', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setHolds(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredHolds = useMemo(() => {
    if (activeTab === 'ALL') return holds;
    return holds.filter((h) => h.freezeStatus === activeTab);
  }, [holds, activeTab]);

  const stats = useMemo(() => {
    const active = holds.filter((h) => h.freezeStatus === 'ACTIVE_FROZEN');
    const scheduled = holds.filter((h) => h.freezeStatus === 'SCHEDULED');
    const pending = holds.filter((h) => h.freezeStatus === 'PENDING_APPROVAL');
    const completed = holds.filter((h) => h.freezeStatus === 'COMPLETED_UNFROZEN');
    return {
      total: holds.length,
      activeCount: active.length,
      scheduledCount: scheduled.length,
      pendingCount: pending.length,
      completedCount: completed.length,
    };
  }, [holds]);

  const handleCreateFreeze = async (e: React.FormEvent) => {
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
      const start = new Date();
      const end = new Date(start.getTime() + Number(durationDays) * 24 * 60 * 60 * 1000);

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/freeze-membership', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          memberEmail: `${memberCode.toLowerCase()}@gymflow.io`,
          memberPhone: '+1 (555) 000-0000',
          planTier: 'GOLD_ANNUAL',
          startDate: start,
          endDate: end,
          durationDays: Number(durationDays),
          reason,
          freezeStatus: 'ACTIVE_FROZEN',
          feeAmount: reason === 'MEDICAL' ? 0 : 10,
          quotaDaysUsed: Number(durationDays),
          maxQuotaDays: 60,
          doctorNoteAttached: doctorNote,
          notes: `Requested hold for ${durationDays} days. Reason: ${reason}`,
        }),
      });

      if (res.ok) {
        toast.success(`Membership frozen for ${name}!`, {
          description: `Turnstile paused for ${durationDays} days. Expiry date extended.`,
        });
        setCreateModalOpen(false);
        await loadHolds();
      } else {
        toast.error('Failed to create freeze request');
      }
    } catch {
      toast.error('Failed to connect to freeze service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnfreezeEarly = async (item: IFreezeItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(
        `https://gymflow-api-2jdh.onrender.com/api/v1/member-management/freeze-membership/${item.id || item.code}/unfreeze`,
        {
          method: 'POST',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.ok) {
        toast.success(`Membership unfrozen for ${item.memberName}!`, {
          description: 'Biometric turnstile access has been immediately restored.',
        });
        await loadHolds();
      } else {
        toast.error('Failed to unfreeze member');
      }
    } catch {
      toast.error('Failed to communicate with access controller');
    }
  };

  const columns: ColumnDef<IFreezeItem>[] = [
    {
      accessorKey: 'memberName',
      header: 'Member',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-cyan-500/15 text-cyan-600 font-bold flex items-center justify-center text-xs shrink-0">
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
              #{row.original.memberCode} • {row.original.memberEmail}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'planTier',
      header: 'Plan & Annual Quota',
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {row.original.planTier?.replace(/_/g, ' ') || 'STANDARD'}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
            <span>Quota:</span>
            <span className="font-mono font-bold text-foreground">
              {row.original.quotaDaysUsed} / {row.original.maxQuotaDays} Days Used
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'durationDays',
      header: 'Hold Period & Dates',
      cell: ({ row }) => {
        const s = new Date(row.original.startDate);
        const e = new Date(row.original.endDate);
        return (
          <div>
            <span className="font-semibold text-xs text-foreground block">
              {row.original.durationDays} Days Duration
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {s.toLocaleDateString()} → {e.toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'reason',
      header: 'Reason & Safeguards',
      cell: ({ row }) => {
        const r = row.original.reason;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              {r === 'MEDICAL' && <HeartPulse className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
              {r === 'TRAVEL' && <Plane className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
              {r === 'WORK_RELOCATION' && <Briefcase className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
              <Badge variant="outline" className="text-[10px] font-semibold">
                {r?.replace(/_/g, ' ') || 'OTHER'}
              </Badge>
            </div>
            {row.original.doctorNoteAttached && (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Doctor Note Attached
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'freezeStatus',
      header: 'Hold Status',
      cell: ({ row }) => {
        const st = row.original.freezeStatus;
        if (st === 'ACTIVE_FROZEN') {
          return (
            <Badge variant="destructive" className="gap-1 text-[10px] font-semibold bg-cyan-600 hover:bg-cyan-700">
              <Snowflake className="h-3 w-3" />
              <span>Currently Frozen</span>
            </Badge>
          );
        }
        if (st === 'SCHEDULED') {
          return (
            <Badge variant="warning" className="gap-1 text-[10px] font-semibold">
              <Clock className="h-3 w-3" />
              <span>Scheduled Future</span>
            </Badge>
          );
        }
        if (st === 'PENDING_APPROVAL') {
          return (
            <Badge variant="secondary" className="gap-1 text-[10px] font-semibold">
              <AlertCircle className="h-3 w-3" />
              <span>Pending Review</span>
            </Badge>
          );
        }
        return (
          <Badge variant="success" className="gap-1 text-[10px] font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            <span>Resumed / Active</span>
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const isFrozen = row.original.freezeStatus === 'ACTIVE_FROZEN';
        return (
          <div className="flex items-center gap-1.5">
            {isFrozen ? (
              <Button
                size="sm"
                onClick={() => handleUnfreezeEarly(row.original)}
                className="h-7 px-2.5 text-xs font-semibold gap-1 bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
              >
                <Play className="h-3 w-3" />
                <span>Unfreeze Now</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
                className="h-7 px-2.5 text-xs font-semibold"
              >
                Profile
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
        title="Membership Freeze & Subscription Holds"
        subtitle="Manage temporary membership hold requests for medical, travel, or work relocation reasons without losing member records."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Submit Freeze Request</span>
            </Button>
          </div>
        }
      />

      {/* KPI Retention Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Currently Frozen"
          value={`${stats.activeCount} Members`}
          change="Turnstiles Auto-Paused"
          trend="neutral"
          timeframe="Active holds"
          icon={<Snowflake className="h-5 w-5 text-cyan-500" />}
        />
        <MetricCard
          title="Scheduled Upcoming"
          value={`${stats.scheduledCount} Holds`}
          change="Starting Next Month"
          trend="up"
          timeframe="Planned travel"
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="Pending Approval"
          value={`${stats.pendingCount} Request`}
          change="Physician review needed"
          trend="down"
          timeframe="Manager queue"
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Resumed / Completed"
          value={`${stats.completedCount} Restored`}
          change="Full turnstile access"
          trend="up"
          timeframe="Past holds"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      {/* Pipeline Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Hold Requests', count: stats.total },
          { key: 'ACTIVE_FROZEN', label: '❄️ Currently Frozen', count: stats.activeCount },
          { key: 'SCHEDULED', label: '🗓️ Scheduled Future', count: stats.scheduledCount },
          { key: 'PENDING_APPROVAL', label: '⏳ Pending Approval', count: stats.pendingCount },
          { key: 'COMPLETED_UNFROZEN', label: '🟢 Resumed & Completed', count: stats.completedCount },
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

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredHolds}
        loading={loading}
        searchPlaceholder="Search freeze records by member name, ID, reason..."
      />

      {/* Submit New Freeze Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-cyan-500" />
              <span>Submit Membership Freeze Hold</span>
            </DialogTitle>
            <DialogDescription>
              Pause turnstile access and automatically extend the member's subscription expiry date.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateFreeze} className="space-y-4 py-3">
            <SelectBox
              label="Select Member"
              value={memberCode}
              onChange={setMemberCode}
              options={[
                { value: 'GF-9284', label: '👑 Sarah Jenkins (#GF-9284 • VIP Platinum)' },
                { value: 'GF-3109', label: '🥈 David Chen (#GF-3109 • Silver Monthly)' },
                { value: 'GF-4821', label: '⭐ Marcus Rodriguez (#GF-4821 • Gold Annual)' },
                { value: 'GF-7712', label: '👑 Emily Watson (#GF-7712 • VIP Platinum)' },
                { value: 'GF-5520', label: '🎓 Liam O Connor (#GF-5520 • Student)' },
                { value: 'GF-9014', label: '⭐ Jessica Taylor (#GF-9014 • Gold Annual)' },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectBox
                label="Freeze Duration"
                value={durationDays}
                onChange={setDurationDays}
                options={[
                  { value: '15', label: '⏱️ 15 Days (Quick Hold)' },
                  { value: '30', label: '🗓️ 30 Days (Standard Hold)' },
                  { value: '45', label: '⏳ 45 Days (Mid Hold)' },
                  { value: '60', label: '❄️ 60 Days (Max Annual Quota)' },
                ]}
              />

              <SelectBox
                label="Hold Reason Category"
                value={reason}
                onChange={(val) => setReason(val as any)}
                options={[
                  { value: 'MEDICAL', label: '🩺 Medical / Injury Recovery' },
                  { value: 'TRAVEL', label: '✈️ Vacation / Travel Abroad' },
                  { value: 'WORK_RELOCATION', label: '💼 Temporary Work Relocation' },
                  { value: 'PERSONAL', label: '🎓 Personal / Exams' },
                ]}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground">Doctor's Certificate / Proof</p>
                <p className="text-muted-foreground">Waives maintenance holding fee ($10)</p>
              </div>
              <input
                type="checkbox"
                checked={doctorNote}
                onChange={(e) => setDoctorNote(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold">
                <Snowflake className="h-4 w-4" />
                <span>{submitting ? 'Submitting Hold...' : 'Confirm & Freeze Membership'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
