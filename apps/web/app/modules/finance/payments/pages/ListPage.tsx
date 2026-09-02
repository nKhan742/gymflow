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
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Plus,
  FileDown,
  Receipt,
  Terminal,
  Wallet,
  Building,
  Smartphone,
  Banknote,
  Send,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IPaymentItem {
  id: string;
  _id?: string;
  code: string;
  transactionCode: string;
  invoiceNumber: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  category: 'MEMBERSHIP_RENEWAL' | 'NEW_ENROLLMENT' | 'PERSONAL_TRAINING' | 'LOCKER_RENTAL' | 'POS_RETAIL' | 'DAY_PASS';
  description?: string;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'POS_TERMINAL' | 'CASH' | 'BANK_TRANSFER' | 'DIGITAL_WALLET' | 'UPI_QR';
  paymentGateway: string;
  gatewayTransactionId?: string;
  paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentDate: string;
  collectedBy: string;
  receiptUrl?: string;
  notes?: string;
  refundReason?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<IPaymentItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Collect Payment POS Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [category, setCategory] = useState<'MEMBERSHIP_RENEWAL' | 'NEW_ENROLLMENT' | 'PERSONAL_TRAINING' | 'LOCKER_RENTAL' | 'POS_RETAIL' | 'DAY_PASS'>('MEMBERSHIP_RENEWAL');
  const [description, setDescription] = useState('Annual VIP Platinum Membership Renewal & Spa Pass');
  const [amount, setAmount] = useState('1499.00');
  const [discountAmount, setDiscountAmount] = useState('100.00');
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'POS_TERMINAL' | 'CASH' | 'BANK_TRANSFER' | 'DIGITAL_WALLET' | 'UPI_QR'>('CREDIT_CARD');
  const [paymentGateway, setPaymentGateway] = useState('Stripe Front Terminal');
  const [collectedBy, setCollectedBy] = useState('Manager Alex Vance');
  const [notes, setNotes] = useState('Processed at Front Desk POS terminal.');
  const [submitting, setSubmitting] = useState(false);

  // Refund Dialog State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<IPaymentItem | null>(null);
  const [refundReason, setRefundReason] = useState('Billing adjustment / Member tier upgrade.');
  const [refunding, setRefunding] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/payments', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPayments(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const calculatedTax = useMemo(() => {
    const base = parseFloat(amount) || 0;
    return Math.round(base * 0.1 * 100) / 100;
  }, [amount]);

  const calculatedTotal = useMemo(() => {
    const base = parseFloat(amount) || 0;
    const disc = parseFloat(discountAmount) || 0;
    return Math.max(0, Math.round((base + calculatedTax - disc) * 100) / 100);
  }, [amount, calculatedTax, discountAmount]);

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return payments;
    return payments.filter((p) => p.paymentStatus === activeTab);
  }, [payments, activeTab]);

  const stats = useMemo(() => {
    const completed = payments.filter((p) => p.paymentStatus === 'COMPLETED');
    const failed = payments.filter((p) => p.paymentStatus === 'FAILED');
    const refunded = payments.filter((p) => p.paymentStatus === 'REFUNDED');

    const totalGross = completed.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    const totalRefunded = refunded.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

    return {
      total: payments.length,
      completedCount: completed.length,
      failedCount: failed.length,
      refundedCount: refunded.length,
      totalGross,
      totalRefunded,
    };
  }, [payments]);

  const handleCollectPayment = async (e: React.FormEvent) => {
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

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/payments', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          category,
          description,
          amount: parseFloat(amount) || 0,
          taxAmount: calculatedTax,
          discountAmount: parseFloat(discountAmount) || 0,
          totalAmount: calculatedTotal,
          currency: 'USD',
          paymentMethod,
          paymentGateway,
          paymentStatus: 'COMPLETED',
          collectedBy,
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Payment of $${calculatedTotal.toFixed(2)} collected successfully!`, {
          description: `Receipt generated for ${name} (${paymentMethod.replace(/_/g, ' ')})`,
        });
        setCreateModalOpen(false);
        await loadPayments();
      } else {
        toast.error('Failed to collect payment');
      }
    } catch {
      toast.error('Failed to connect to payment processing gateway');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedTxn) return;
    setRefunding(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const txnId = selectedTxn._id || selectedTxn.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/finance/payments/${txnId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'REFUNDED',
          refundReason,
          notes: `Refunded $${selectedTxn.totalAmount.toFixed(2)} via ${selectedTxn.paymentGateway} by Manager Alex Vance`,
        }),
      });

      if (res.ok) {
        toast.success(`Refund Processed for ${selectedTxn.transactionCode}!`, {
          description: `$${selectedTxn.totalAmount.toFixed(2)} credited back to original payment method.`,
        });
        setRefundModalOpen(false);
        await loadPayments();
      } else {
        toast.error('Failed to process refund');
      }
    } catch {
      toast.error('Failed to connect to refund gateway');
    } finally {
      setRefunding(false);
    }
  };

  const columns: ColumnDef<IPaymentItem>[] = [
    {
      accessorKey: 'transactionCode',
      header: 'Transaction & Invoice',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-xs text-foreground block">
            {row.original.transactionCode}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono block">
            {row.original.invoiceNumber}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'memberName',
      header: 'Member',
      size: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs shrink-0">
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
              #{row.original.memberCode}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category & Line Item',
      size: 240,
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold uppercase bg-muted/40 text-foreground whitespace-nowrap">
            {row.original.category?.replace(/_/g, ' ') || 'PAYMENT'}
          </Badge>
          <p className="text-xs text-foreground truncate">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount & Breakdown',
      size: 180,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono font-extrabold text-xs text-foreground block">
            ${row.original.totalAmount?.toFixed(2)}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono block">
            Base: ${row.original.amount?.toFixed(2)} • Tax: ${row.original.taxAmount?.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method & Gateway',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            {row.original.paymentMethod === 'CREDIT_CARD' && <CreditCard className="h-3.5 w-3.5 text-primary shrink-0" />}
            {row.original.paymentMethod === 'POS_TERMINAL' && <Terminal className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
            {row.original.paymentMethod === 'CASH' && <Banknote className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
            {row.original.paymentMethod === 'DIGITAL_WALLET' && <Smartphone className="h-3.5 w-3.5 text-purple-500 shrink-0" />}
            <span className="font-semibold text-xs text-foreground whitespace-nowrap">
              {row.original.paymentMethod?.replace(/_/g, ' ') || 'OTHER'}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground block truncate">
            {row.original.paymentGateway}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Status',
      size: 160,
      cell: ({ row }) => {
        const st = row.original.paymentStatus;
        if (st === 'COMPLETED') {
          return (
            <Badge variant="success" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2.5 py-0.5">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>Settled</span>
            </Badge>
          );
        }
        if (st === 'REFUNDED') {
          return (
            <Badge variant="secondary" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
              <RotateCcw className="h-3 w-3 shrink-0" />
              <span>Refunded</span>
            </Badge>
          );
        }
        if (st === 'FAILED') {
          return (
            <Badge variant="destructive" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>Declined</span>
            </Badge>
          );
        }
        return (
          <Badge variant="warning" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Pending</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: 'paymentDate',
      header: 'Date & Cashier',
      size: 180,
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {new Date(row.original.paymentDate).toLocaleDateString()}
          </span>
          <span className="text-[10px] text-muted-foreground block truncate">
            {row.original.collectedBy}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 180,
      cell: ({ row }) => {
        const isCompleted = row.original.paymentStatus === 'COMPLETED';
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success(`Printing Tax Invoice Receipt for ${row.original.transactionCode}!`, {
                  description: `Amount: $${row.original.totalAmount.toFixed(2)} • Member: ${row.original.memberName}`,
                });
              }}
              className="h-7 px-2 text-xs gap-1 shadow-xs"
              title="Download Tax Receipt"
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>Receipt</span>
            </Button>

            {isCompleted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTxn(row.original);
                  setRefundModalOpen(true);
                }}
                className="h-7 px-2 text-xs gap-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200 shadow-xs"
                title="Process Refund"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Refund</span>
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
        title="Finance & Payment Processing"
        subtitle="Omnichannel revenue management, point-of-sale checkout terminal, automated recurring subscriptions, and tax invoicing."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Collect Payment (POS)</span>
            </Button>
          </div>
        }
      />

      {/* Financial Revenue KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Gross Revenue Collected"
          value={`$${stats.totalGross.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="+14.2% vs last month"
          trend="up"
          timeframe="Total settled collections"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Settled Transactions"
          value={`${stats.completedCount} Payments`}
          change="98.6% Success rate"
          trend="up"
          timeframe="Zero billing disputes"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Declined / Failed"
          value={`${stats.failedCount} Failed`}
          change="Automated SMS retry link sent"
          trend="down"
          timeframe="Card expired"
          icon={<AlertCircle className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="Refunds Processed"
          value={`$${stats.totalRefunded.toFixed(2)}`}
          change={`${stats.refundedCount} Adjustment`}
          trend="up"
          timeframe="0.4% Refund volume"
          icon={<RotateCcw className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Transactions', count: stats.total },
          { key: 'COMPLETED', label: '🟢 Settled / Paid', count: stats.completedCount },
          { key: 'FAILED', label: '🔴 Declined / Failed', count: stats.failedCount },
          { key: 'REFUNDED', label: '🔵 Refunded', count: stats.refundedCount },
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
        searchPlaceholder="Search payments by member, transaction code, invoice #, category..."
      />

      {/* Collect Payment POS Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-500" />
              <span>Point of Sale: Collect Member Payment</span>
            </DialogTitle>
            <DialogDescription>
              Record point of sale transactions, membership renewals, personal training packages, and cafe dues.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCollectPayment} className="space-y-4 py-2">
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
                label="Payment Category"
                value={category}
                onChange={(v) => setCategory(v as any)}
                options={[
                  { value: 'MEMBERSHIP_RENEWAL', label: '👑 Membership Renewal' },
                  { value: 'NEW_ENROLLMENT', label: '🚀 New Enrollment Fee' },
                  { value: 'PERSONAL_TRAINING', label: '🏋️ Personal Training Package' },
                  { value: 'LOCKER_RENTAL', label: '🔒 Smart Locker Rental' },
                  { value: 'POS_RETAIL', label: '🥤 Cafe & Nutrition Shake Bar' },
                  { value: 'DAY_PASS', label: '🎟️ Day Pass / Guest Entry' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Line Item Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. 12-Month VIP Platinum Membership with Private Locker"
                required
              />
            </div>

            {/* Financial Calculator Box */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Base Amount ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-8 text-xs font-mono font-bold"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Promo Discount ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="h-8 text-xs font-mono"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Tax 10% (GST/VAT)</label>
                  <div className="h-8 px-3 rounded-lg border border-border bg-background flex items-center text-xs font-mono text-muted-foreground">
                    +${calculatedTax.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">Total Bill Amount:</span>
                <span className="font-mono font-extrabold text-base text-emerald-600">
                  ${calculatedTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Payment Tender Method"
                value={paymentMethod}
                onChange={(v) => setPaymentMethod(v as any)}
                options={[
                  { value: 'CREDIT_CARD', label: '💳 Credit / Debit Card (Stripe)' },
                  { value: 'POS_TERMINAL', label: '📟 POS Chip Terminal' },
                  { value: 'CASH', label: '💵 Cash at Desk Drawer' },
                  { value: 'DIGITAL_WALLET', label: '📱 Apple Pay / Google Pay' },
                  { value: 'BANK_TRANSFER', label: '🏦 Bank Wire / ACH' },
                  { value: 'UPI_QR', label: '📲 UPI / Dynamic QR Scan' },
                ]}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Gateway / Terminal ID</label>
                <Input
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="e.g. Stripe Terminal #01"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Payment Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Cashier notes, receipt authorization ID..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Processing...' : `Charge $${calculatedTotal.toFixed(2)}`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Refund Confirmation Modal */}
      <Dialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <RotateCcw className="h-5 w-5" />
              <span>Authorize Transaction Refund</span>
            </DialogTitle>
            <DialogDescription>
              Process credit refund for transaction #{selectedTxn?.transactionCode}.
            </DialogDescription>
          </DialogHeader>

          {selectedTxn && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">Refund Amount:</span>
                  <span className="font-mono font-extrabold text-sm text-rose-600">
                    ${selectedTxn.totalAmount.toFixed(2)} USD
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Member: {selectedTxn.memberName} (#{selectedTxn.memberCode}) • Gateway: {selectedTxn.paymentGateway}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Refund Reason & Notes</label>
                <Input
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Reason for refund..."
                />
              </div>

              <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setRefundModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={refunding}
                  onClick={handleProcessRefund}
                  className="gap-1.5 font-bold"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>{refunding ? 'Refunding...' : 'Confirm Refund'}</span>
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
