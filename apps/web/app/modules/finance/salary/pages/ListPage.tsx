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
  Banknote,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  FileDown,
  Building,
  DollarSign,
  Briefcase,
  Award,
  Send,
  FileText,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface ISalaryItem {
  id: string;
  _id?: string;
  code: string;
  paySlipCode: string;
  staffCode: string;
  staffName: string;
  role: 'HEAD_TRAINER' | 'FITNESS_COACH' | 'GENERAL_MANAGER' | 'FRONT_DESK' | 'NUTRITIONIST' | 'MAINTENANCE';
  payPeriod: string;
  baseSalary: number;
  commissionAmount: number;
  bonusAmount: number;
  deductions: number;
  netSalary: number;
  currency: string;
  paymentMethod: 'DIRECT_DEPOSIT' | 'BANK_TRANSFER' | 'CHECK' | 'CASH';
  bankName: string;
  accountNumber: string;
  disbursementStatus: 'DISBURSED' | 'PROCESSING' | 'ON_HOLD';
  disbursementDate: string;
  disbursedBy?: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState<ISalaryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'HEAD_TRAINER' | 'FITNESS_COACH' | 'GENERAL_MANAGER' | 'FRONT_DESK' | 'NUTRITIONIST' | 'MAINTENANCE'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Run Payroll Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [staffCode, setStaffCode] = useState('STF-101');
  const [role, setRole] = useState<'HEAD_TRAINER' | 'FITNESS_COACH' | 'GENERAL_MANAGER' | 'FRONT_DESK' | 'NUTRITIONIST' | 'MAINTENANCE'>('HEAD_TRAINER');
  const [payPeriod, setPayPeriod] = useState('August 2026');
  const [baseSalary, setBaseSalary] = useState('4500.00');
  const [commissionAmount, setCommissionAmount] = useState('1250.00');
  const [bonusAmount, setBonusAmount] = useState('300.00');
  const [deductions, setDeductions] = useState('580.00');
  const [paymentMethod, setPaymentMethod] = useState<'DIRECT_DEPOSIT' | 'BANK_TRANSFER' | 'CHECK' | 'CASH'>('DIRECT_DEPOSIT');
  const [bankName, setBankName] = useState('Chase Premier Checking');
  const [accountNumber, setAccountNumber] = useState('•••• 4829');
  const [disbursementStatus, setDisbursementStatus] = useState<'DISBURSED' | 'PROCESSING'>('DISBURSED');
  const [notes, setNotes] = useState('Includes VIP personal training commission payouts.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSalaries();
  }, []);

  const loadSalaries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/salary', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSalaries(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const calculatedNet = useMemo(() => {
    const base = parseFloat(baseSalary) || 0;
    const comm = parseFloat(commissionAmount) || 0;
    const bon = parseFloat(bonusAmount) || 0;
    const ded = parseFloat(deductions) || 0;
    return Math.max(0, Math.round((base + comm + bon - ded) * 100) / 100);
  }, [baseSalary, commissionAmount, bonusAmount, deductions]);

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return salaries;
    return salaries.filter((s) => s.role === activeTab);
  }, [salaries, activeTab]);

  const stats = useMemo(() => {
    const disbursed = salaries.filter((s) => s.disbursementStatus === 'DISBURSED');
    const processing = salaries.filter((s) => s.disbursementStatus === 'PROCESSING');

    const totalNet = salaries.reduce((sum, s) => sum + (s.netSalary || 0), 0);
    const totalDisbursed = disbursed.reduce((sum, s) => sum + (s.netSalary || 0), 0);
    const totalCommission = salaries.reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
    const totalProcessing = processing.reduce((sum, s) => sum + (s.netSalary || 0), 0);

    return {
      total: salaries.length,
      disbursedCount: disbursed.length,
      processingCount: processing.length,
      totalNet,
      totalDisbursed,
      totalCommission,
      totalProcessing,
    };
  }, [salaries]);

  const handleCreateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const staffNames: Record<string, string> = {
        'STF-101': 'Coach Alex Vance',
        'STF-102': 'Elena Rostova',
        'STF-103': 'Sarah Vance',
        'STF-104': 'Kevin Tran',
        'STF-105': 'Chloe Bennett',
        'STF-106': 'Dave Miller',
      };

      const name = staffNames[staffCode] || `Staff #${staffCode}`;

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/salary', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staffCode,
          staffName: name,
          role,
          payPeriod,
          baseSalary: parseFloat(baseSalary) || 0,
          commissionAmount: parseFloat(commissionAmount) || 0,
          bonusAmount: parseFloat(bonusAmount) || 0,
          deductions: parseFloat(deductions) || 0,
          netSalary: calculatedNet,
          currency: 'USD',
          paymentMethod,
          bankName,
          accountNumber,
          disbursementStatus,
          disbursedBy: 'Finance Director Marcus Hayes',
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Salary slip generated for ${name} ($${calculatedNet.toFixed(2)})!`, {
          description: `Disbursement: ${paymentMethod.replace(/_/g, ' ')} • Period: ${payPeriod}`,
        });
        setCreateModalOpen(false);
        await loadSalaries();
      } else {
        toast.error('Failed to generate salary slip');
      }
    } catch {
      toast.error('Failed to connect to payroll service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisbursePayment = async (sal: ISalaryItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const salId = sal._id || sal.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/finance/salary/${salId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disbursementStatus: 'DISBURSED',
          disbursedBy: 'Finance Director Marcus Hayes',
          notes: `Direct Deposit settled via ${sal.bankName} by Finance Director Marcus Hayes`,
        }),
      });

      if (res.ok) {
        toast.success(`Salary Disbursed to ${sal.staffName}!`, {
          description: `$${sal.netSalary.toFixed(2)} wired via Direct Deposit (${sal.bankName})`,
        });
        await loadSalaries();
      } else {
        toast.error('Failed to disburse salary');
      }
    } catch {
      toast.error('Failed to connect to payroll gateway');
    }
  };

  const columns: ColumnDef<ISalaryItem>[] = [
    {
      accessorKey: 'staffName',
      header: 'Staff Member & Role',
      size: 210,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0">
            {row.original.staffName.charAt(0)}
          </div>
          <div className="truncate">
            <span className="font-semibold text-xs text-foreground block truncate">
              {row.original.staffName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold bg-muted/40 text-foreground whitespace-nowrap">
                {row.original.role?.replace(/_/g, ' ') || 'STAFF'}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-mono">
                #{row.original.staffCode}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'paySlipCode',
      header: 'Pay Slip & Period',
      size: 180,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-xs text-foreground block">
            {row.original.paySlipCode}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            Period: <strong className="text-foreground">{row.original.payPeriod}</strong>
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'netSalary',
      header: 'Net Pay & Breakdown',
      size: 240,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono font-extrabold text-xs text-emerald-600 block">
            ${row.original.netSalary?.toFixed(2)} USD
          </span>
          <span className="text-[10px] text-muted-foreground font-mono block">
            Base: ${row.original.baseSalary?.toFixed(2)} • Comm: +${row.original.commissionAmount?.toFixed(2)} • Ded: -${row.original.deductions?.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Bank & Tender',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.bankName}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
            <Badge variant="outline" className="text-[8px] px-1 py-0 uppercase">
              {row.original.paymentMethod?.replace(/_/g, ' ') || 'DIRECT DEPOSIT'}
            </Badge>
            <span>{row.original.accountNumber}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'disbursementStatus',
      header: 'Disbursement Status',
      size: 180,
      cell: ({ row }) => {
        const st = row.original.disbursementStatus;
        if (st === 'DISBURSED') {
          return (
            <div className="space-y-0.5">
              <Badge variant="success" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2.5 py-0.5">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>Disbursed</span>
              </Badge>
              <span className="text-[10px] text-muted-foreground block truncate">By {row.original.disbursedBy}</span>
            </div>
          );
        }
        return (
          <div className="space-y-0.5">
            <Badge variant="warning" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
              <Clock className="h-3 w-3 shrink-0" />
              <span>In Processing</span>
            </Badge>
            <span className="text-[10px] text-amber-600 font-semibold block truncate">Pending bank clearance</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'disbursementDate',
      header: 'Pay Date',
      size: 140,
      cell: ({ row }) => (
        <span className="font-semibold text-xs text-foreground block">
          {new Date(row.original.disbursementDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 180,
      cell: ({ row }) => {
        const isProcessing = row.original.disbursementStatus === 'PROCESSING';
        return (
          <div className="flex items-center gap-1.5">
            {isProcessing ? (
              <Button
                size="sm"
                onClick={() => handleDisbursePayment(row.original)}
                className="h-7 px-2.5 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                title="Disburse Direct Deposit"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Disburse</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success(`Exporting Pay Slip for ${row.original.staffName}!`, {
                    description: `Period: ${row.original.payPeriod} • Net Pay: $${row.original.netSalary.toFixed(2)}`,
                  });
                }}
                className="h-7 px-2 text-xs gap-1 shadow-xs"
                title="Download Official Pay Slip"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Pay Slip</span>
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
        title="Finance & Staff Payroll (Salary)"
        subtitle="Monthly staff compensation, personal trainer commission payouts, performance bonuses, tax deductions, and direct bank disbursement."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Generate Pay Slip</span>
            </Button>
          </div>
        }
      />

      {/* Payroll KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Payroll (August)"
          value={`$${stats.totalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="Monthly net compensation"
          trend="up"
          timeframe="Total staff liability"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Disbursed via Direct Deposit"
          value={`$${stats.totalDisbursed.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change={`${stats.disbursedCount} Staff paid`}
          trend="up"
          timeframe="ACH bank settled"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="PT Commissions Earned"
          value={`$${stats.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="Trainer incentives"
          trend="up"
          timeframe="Commission bonus pool"
          icon={<Award className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="In-Transit Processing"
          value={`$${stats.totalProcessing.toFixed(2)}`}
          change={`${stats.processingCount} Pay slip`}
          trend="up"
          timeframe="Pending bank batch"
          icon={<Clock className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Staff Payroll', count: stats.total },
          { key: 'HEAD_TRAINER', label: '🏋️ Head Trainer', count: salaries.filter((s) => s.role === 'HEAD_TRAINER').length },
          { key: 'FITNESS_COACH', label: '🥊 Fitness Coaches', count: salaries.filter((s) => s.role === 'FITNESS_COACH').length },
          { key: 'GENERAL_MANAGER', label: '👑 Management', count: salaries.filter((s) => s.role === 'GENERAL_MANAGER').length },
          { key: 'FRONT_DESK', label: '🛎️ Front Desk', count: salaries.filter((s) => s.role === 'FRONT_DESK').length },
          { key: 'NUTRITIONIST', label: '🥗 Nutritionist', count: salaries.filter((s) => s.role === 'NUTRITIONIST').length },
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
        searchPlaceholder="Search salary by staff name, ID, slip code, role..."
      />

      {/* Generate Pay Slip Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-emerald-500" />
              <span>Generate Monthly Staff Salary Slip</span>
            </DialogTitle>
            <DialogDescription>
              Record staff base compensation, personal training commissions, bonuses, and tax withholdings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSalary} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Select Staff Member"
                value={staffCode}
                onChange={setStaffCode}
                options={[
                  { value: 'STF-101', label: '🏋️ Coach Alex Vance (#STF-101 • Head Trainer)' },
                  { value: 'STF-102', label: '🥊 Elena Rostova (#STF-102 • Fitness Coach)' },
                  { value: 'STF-103', label: '🛎️ Sarah Vance (#STF-103 • Front Desk)' },
                  { value: 'STF-104', label: '🥗 Kevin Tran (#STF-104 • Nutritionist)' },
                  { value: 'STF-105', label: '👑 Chloe Bennett (#STF-105 • General Manager)' },
                  { value: 'STF-106', label: '🧹 Dave Miller (#STF-106 • Maintenance)' },
                ]}
              />

              <SelectBox
                label="Staff Role"
                value={role}
                onChange={(v) => setRole(v as any)}
                options={[
                  { value: 'HEAD_TRAINER', label: '🏋️ Head Trainer' },
                  { value: 'FITNESS_COACH', label: '🥊 Fitness Coach' },
                  { value: 'GENERAL_MANAGER', label: '👑 General Manager' },
                  { value: 'FRONT_DESK', label: '🛎️ Front Desk Reception' },
                  { value: 'NUTRITIONIST', label: '🥗 Certified Nutritionist' },
                  { value: 'MAINTENANCE', label: '🧹 Facility Maintenance' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pay Period</label>
              <Input
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. August 2026"
                required
              />
            </div>

            {/* Compensation & Deductions Box */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-foreground">Base ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-foreground">PT Comm ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-foreground">Bonus ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-foreground">Deductions ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="h-8 text-xs font-mono text-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">Net Disbursable Salary:</span>
                <span className="font-mono font-extrabold text-base text-emerald-600">
                  ${calculatedNet.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Bank Name</label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. Chase Bank NA"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Account Number</label>
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="•••• 4829"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Payment Method"
                value={paymentMethod}
                onChange={(v) => setPaymentMethod(v as any)}
                options={[
                  { value: 'DIRECT_DEPOSIT', label: '🏦 Direct Bank Deposit (ACH)' },
                  { value: 'BANK_TRANSFER', label: '🌐 Wire Transfer' },
                  { value: 'CHECK', label: '📜 Paper Check' },
                  { value: 'CASH', label: '💵 Cash Payout' },
                ]}
              />

              <SelectBox
                label="Disbursement Status"
                value={disbursementStatus}
                onChange={(v) => setDisbursementStatus(v as any)}
                options={[
                  { value: 'DISBURSED', label: '🟢 Disbursed & Settled' },
                  { value: 'PROCESSING', label: '🟡 In Processing Queue' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Payroll Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Commission notes, bonus remarks..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Generating...' : `Disburse $${calculatedNet.toFixed(2)}`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
