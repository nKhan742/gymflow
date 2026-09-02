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
  Award,
  DollarSign,
  CheckCircle2,
  Clock,
  Plus,
  FileDown,
  UserCheck,
  TrendingUp,
  Percent,
  Dumbbell,
  Users,
  Utensils,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface ITrainerCommissionItem {
  id: string;
  _id?: string;
  code: string;
  commissionCode: string;
  trainerCode: string;
  trainerName: string;
  role: string;
  clientMemberCode?: string;
  clientMemberName?: string;
  commissionType: '1_ON_1_PERSONAL_TRAINING' | 'GROUP_FITNESS_CLASS' | 'PACKAGE_SALES_COMMISSION' | 'NUTRITION_MEAL_PLAN' | 'MONTHLY_RETENTION_BONUS';
  sessionTitle: string;
  billedAmount: number;
  commissionRate: number;
  commissionEarned: number;
  currency: string;
  sessionCount: number;
  sessionDate: string;
  payoutStatus: 'SETTLED' | 'PENDING_PAYOUT' | 'IN_AUDIT';
  payoutDate?: string;
  approvedBy?: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState<ITrainerCommissionItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | '1_ON_1_PERSONAL_TRAINING' | 'GROUP_FITNESS_CLASS' | 'PACKAGE_SALES_COMMISSION' | 'NUTRITION_MEAL_PLAN'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Commission Log Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [trainerCode, setTrainerCode] = useState('STF-101');
  const [clientMemberCode, setClientMemberCode] = useState('GF-9284');
  const [commissionType, setCommissionType] = useState<'1_ON_1_PERSONAL_TRAINING' | 'GROUP_FITNESS_CLASS' | 'PACKAGE_SALES_COMMISSION' | 'NUTRITION_MEAL_PLAN' | 'MONTHLY_RETENTION_BONUS'>('1_ON_1_PERSONAL_TRAINING');
  const [sessionTitle, setSessionTitle] = useState('10-Session VIP Hypertrophy Periodization Program');
  const [billedAmount, setBilledAmount] = useState('700.00');
  const [commissionRate, setCommissionRate] = useState('50');
  const [sessionCount, setSessionCount] = useState('10');
  const [payoutStatus, setPayoutStatus] = useState<'SETTLED' | 'PENDING_PAYOUT'>('SETTLED');
  const [approvedBy, setApprovedBy] = useState('General Manager Chloe Bennett');
  const [notes, setNotes] = useState('All training sessions delivered with verified member signoff.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/trainer-commission', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCommissions(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const calculatedCommissionEarned = useMemo(() => {
    const billed = parseFloat(billedAmount) || 0;
    const rate = parseFloat(commissionRate) || 0;
    return Math.round(billed * (rate / 100) * 100) / 100;
  }, [billedAmount, commissionRate]);

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return commissions;
    return commissions.filter((c) => c.commissionType === activeTab);
  }, [commissions, activeTab]);

  const stats = useMemo(() => {
    const settled = commissions.filter((c) => c.payoutStatus === 'SETTLED');
    const pending = commissions.filter((c) => c.payoutStatus === 'PENDING_PAYOUT');

    const totalEarned = commissions.reduce((sum, c) => sum + (c.commissionEarned || 0), 0);
    const totalSettled = settled.reduce((sum, c) => sum + (c.commissionEarned || 0), 0);
    const totalPending = pending.reduce((sum, c) => sum + (c.commissionEarned || 0), 0);

    return {
      total: commissions.length,
      settledCount: settled.length,
      pendingCount: pending.length,
      totalEarned,
      totalSettled,
      totalPending,
    };
  }, [commissions]);

  const handleCreateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const trainerNames: Record<string, { name: string; role: string }> = {
        'STF-101': { name: 'Coach Alex Vance', role: 'HEAD_TRAINER' },
        'STF-102': { name: 'Elena Rostova', role: 'FITNESS_COACH' },
        'STF-103': { name: 'Sarah Vance', role: 'FRONT_DESK' },
        'STF-104': { name: 'Kevin Tran', role: 'NUTRITIONIST' },
      };

      const memberNames: Record<string, string> = {
        'GF-9284': 'Sarah Jenkins',
        'GF-3109': 'David Chen',
        'GF-4821': 'Marcus Rodriguez',
        'GF-7712': 'Emily Watson',
        'GF-5520': 'Liam O Connor',
        'GF-9014': 'Jessica Taylor',
        'GF-MULTIPLE': 'Group Class Attendees',
      };

      const trainerInfo = trainerNames[trainerCode] || { name: `Staff #${trainerCode}`, role: 'FITNESS_COACH' };
      const clientName = memberNames[clientMemberCode] || `Member #${clientMemberCode}`;

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/trainer-commission', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerCode,
          trainerName: trainerInfo.name,
          role: trainerInfo.role,
          clientMemberCode,
          clientMemberName: clientName,
          commissionType,
          sessionTitle,
          billedAmount: parseFloat(billedAmount) || 0,
          commissionRate: parseFloat(commissionRate) || 50,
          commissionEarned: calculatedCommissionEarned,
          currency: 'USD',
          sessionCount: parseInt(sessionCount) || 1,
          payoutStatus,
          approvedBy,
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Commission record of $${calculatedCommissionEarned.toFixed(2)} logged for ${trainerInfo.name}!`, {
          description: `${sessionTitle} (${commissionRate}% split on $${billedAmount})`,
        });
        setCreateModalOpen(false);
        await loadCommissions();
      } else {
        toast.error('Failed to log commission record');
      }
    } catch {
      toast.error('Failed to connect to commission service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveCommission = async (com: ITrainerCommissionItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const comId = com._id || com.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/finance/trainer-commission/${comId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payoutStatus: 'SETTLED',
          payoutDate: new Date(),
          approvedBy: 'General Manager Chloe Bennett',
          notes: `Approved and settled to trainer payroll statement on ${new Date().toLocaleDateString()}`,
        }),
      });

      if (res.ok) {
        toast.success(`Commission Payout Approved for ${com.trainerName}!`, {
          description: `$${com.commissionEarned.toFixed(2)} disbursed to monthly salary ledger.`,
        });
        await loadCommissions();
      } else {
        toast.error('Failed to approve commission payout');
      }
    } catch {
      toast.error('Failed to connect to commission gateway');
    }
  };

  const columns: ColumnDef<ITrainerCommissionItem>[] = [
    {
      accessorKey: 'trainerName',
      header: 'Trainer & Role',
      size: 210,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-amber-500/15 text-amber-600 font-bold flex items-center justify-center text-xs shrink-0">
            {row.original.trainerName.charAt(0)}
          </div>
          <div className="truncate">
            <span className="font-semibold text-xs text-foreground block truncate">
              {row.original.trainerName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold bg-muted/40 text-foreground whitespace-nowrap">
                {row.original.role?.replace(/_/g, ' ')}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-mono">
                #{row.original.trainerCode}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'clientMemberName',
      header: 'Client / Class',
      size: 190,
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.clientMemberName || 'Group Attendees'}
          </span>
          {row.original.clientMemberCode && (
            <span className="text-[10px] text-muted-foreground font-mono block">
              #{row.original.clientMemberCode}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'sessionTitle',
      header: 'Commission Item & Type',
      size: 240,
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold uppercase bg-primary/5 text-primary border-primary/20 whitespace-nowrap">
            {row.original.commissionType?.replace(/_/g, ' ')}
          </Badge>
          <p className="text-xs text-foreground truncate">{row.original.sessionTitle}</p>
        </div>
      ),
    },
    {
      accessorKey: 'commissionEarned',
      header: 'Earned Commission & Split',
      size: 220,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono font-extrabold text-xs text-emerald-600 block">
            ${row.original.commissionEarned?.toFixed(2)} USD
          </span>
          <span className="text-[10px] text-muted-foreground font-mono block">
            Billed: ${row.original.billedAmount?.toFixed(2)} • Split: <strong className="text-foreground">{row.original.commissionRate}%</strong> ({row.original.sessionCount} sessions)
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'payoutStatus',
      header: 'Payout Status',
      size: 170,
      cell: ({ row }) => {
        const st = row.original.payoutStatus;
        if (st === 'SETTLED') {
          return (
            <div className="space-y-0.5">
              <Badge variant="success" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2.5 py-0.5">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>Settled</span>
              </Badge>
              <span className="text-[10px] text-muted-foreground block truncate">By {row.original.approvedBy}</span>
            </div>
          );
        }
        return (
          <div className="space-y-0.5">
            <Badge variant="warning" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
              <Clock className="h-3 w-3 shrink-0" />
              <span>Pending Payout</span>
            </Badge>
            <span className="text-[10px] text-amber-600 font-semibold block truncate">In payroll queue</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'sessionDate',
      header: 'Session Date',
      size: 140,
      cell: ({ row }) => (
        <span className="font-semibold text-xs text-foreground block">
          {new Date(row.original.sessionDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 180,
      cell: ({ row }) => {
        const isPending = row.original.payoutStatus === 'PENDING_PAYOUT';
        return (
          <div className="flex items-center gap-1.5">
            {isPending ? (
              <Button
                size="sm"
                onClick={() => handleApproveCommission(row.original)}
                className="h-7 px-2.5 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                title="Approve Commission Payout"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Approve Payout</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success(`Exporting Commission Statement for ${row.original.trainerName}!`, {
                    description: `${row.original.sessionTitle} • Earned: $${row.original.commissionEarned.toFixed(2)}`,
                  });
                }}
                className="h-7 px-2 text-xs gap-1 shadow-xs"
                title="Download Commission Voucher"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Statement</span>
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
        title="Finance & Trainer Commission Settlements"
        subtitle="Track personal training session commission rates, group bootcamp class splits, membership sales incentives, and monthly payout disbursements."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Log Commission Record</span>
            </Button>
          </div>
        }
      />

      {/* Commission KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Commission Pool"
          value={`$${stats.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="Earned trainer incentives"
          trend="up"
          timeframe="Total active commissions"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Settled Disbursements"
          value={`$${stats.totalSettled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change={`${stats.settledCount} Settlements paid`}
          trend="up"
          timeframe="Disbursed via payroll"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Pending Payout Queue"
          value={`$${stats.totalPending.toFixed(2)}`}
          change={`${stats.pendingCount} Session pending`}
          trend="up"
          timeframe="Upcoming payroll cycle"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Top PT Producer"
          value="Coach Vance"
          change="$875.00 Earned this cycle"
          trend="up"
          timeframe="100% 5-Star rating"
          icon={<Award className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Commissions', count: stats.total },
          { key: '1_ON_1_PERSONAL_TRAINING', label: '🏋️ 1-on-1 PT Sessions', count: commissions.filter((c) => c.commissionType === '1_ON_1_PERSONAL_TRAINING').length },
          { key: 'GROUP_FITNESS_CLASS', label: '🥊 Group Class Bootcamps', count: commissions.filter((c) => c.commissionType === 'GROUP_FITNESS_CLASS').length },
          { key: 'PACKAGE_SALES_COMMISSION', label: '📦 Package Sales', count: commissions.filter((c) => c.commissionType === 'PACKAGE_SALES_COMMISSION').length },
          { key: 'NUTRITION_MEAL_PLAN', label: '🥗 Nutrition Plans', count: commissions.filter((c) => c.commissionType === 'NUTRITION_MEAL_PLAN').length },
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
        searchPlaceholder="Search commissions by trainer, client, title, code..."
      />

      {/* Log Commission Record Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Log Trainer Commission & Incentive</span>
            </DialogTitle>
            <DialogDescription>
              Record completed training sessions, class headcounts, package conversions, and commission splits.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCommission} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Select Trainer / Coach"
                value={trainerCode}
                onChange={setTrainerCode}
                options={[
                  { value: 'STF-101', label: '🏋️ Coach Alex Vance (#STF-101 • Head Trainer)' },
                  { value: 'STF-102', label: '🥊 Elena Rostova (#STF-102 • Fitness Coach)' },
                  { value: 'STF-103', label: '🛎️ Sarah Vance (#STF-103 • Front Desk)' },
                  { value: 'STF-104', label: '🥗 Kevin Tran (#STF-104 • Nutritionist)' },
                ]}
              />

              <SelectBox
                label="Select Client Member"
                value={clientMemberCode}
                onChange={setClientMemberCode}
                options={[
                  { value: 'GF-9284', label: '👑 Sarah Jenkins (#GF-9284 • VIP)' },
                  { value: 'GF-3109', label: '🥈 David Chen (#GF-3109 • Silver)' },
                  { value: 'GF-4821', label: '⭐ Marcus Rodriguez (#GF-4821 • Gold)' },
                  { value: 'GF-7712', label: '👑 Emily Watson (#GF-7712 • VIP)' },
                  { value: 'GF-5520', label: '🎓 Liam O Connor (#GF-5520 • Student)' },
                  { value: 'GF-9014', label: '⭐ Jessica Taylor (#GF-9014 • Gold)' },
                  { value: 'GF-MULTIPLE', label: '👥 Group Class (Multiple Attendees)' },
                ]}
              />
            </div>

            <SelectBox
              label="Commission Model"
              value={commissionType}
              onChange={(v) => setCommissionType(v as any)}
              options={[
                { value: '1_ON_1_PERSONAL_TRAINING', label: '🏋️ 1-on-1 Personal Training (50% Standard Split)' },
                { value: 'GROUP_FITNESS_CLASS', label: '🥊 Group Class Bootcamp (40% Class Share)' },
                { value: 'PACKAGE_SALES_COMMISSION', label: '📦 Membership / PT Package Sales (15% Bonus)' },
                { value: 'NUTRITION_MEAL_PLAN', label: '🥗 Nutrition Consulting (60% Split)' },
                { value: 'MONTHLY_RETENTION_BONUS', label: '⭐ Performance & Client Retention Bonus' },
              ]}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Session / Incentive Title</label>
              <Input
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. 10-Session VIP Hypertrophy Program"
                required
              />
            </div>

            {/* Commission Split Calculator Box */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Total Billed ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={billedAmount}
                    onChange={(e) => setBilledAmount(e.target.value)}
                    className="h-8 text-xs font-mono"
                    placeholder="700.00"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Commission Split (%)</label>
                  <Input
                    type="number"
                    step="1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="h-8 text-xs font-mono"
                    placeholder="50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Sessions / Units</label>
                  <Input
                    type="number"
                    value={sessionCount}
                    onChange={(e) => setSessionCount(e.target.value)}
                    className="h-8 text-xs font-mono"
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">Trainer Payout Earned:</span>
                <span className="font-mono font-extrabold text-base text-emerald-600">
                  ${calculatedCommissionEarned.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Payout Status"
                value={payoutStatus}
                onChange={(v) => setPayoutStatus(v as any)}
                options={[
                  { value: 'SETTLED', label: '🟢 Settled (Paid with Payroll)' },
                  { value: 'PENDING_PAYOUT', label: '🟡 Pending Payout (Queued)' },
                ]}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Approving Manager</label>
                <Input
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Manager Name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Verification Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Client attendance verification, review rating..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Logging...' : `Log Commission ($${calculatedCommissionEarned.toFixed(2)})`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
