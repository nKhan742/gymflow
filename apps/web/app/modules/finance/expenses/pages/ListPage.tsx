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
  Receipt,
  TrendingDown,
  Wrench,
  Building,
  Zap,
  Package,
  Megaphone,
  Plus,
  FileDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Building2,
  DollarSign,
  UserCheck,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IExpenseItem {
  id: string;
  _id?: string;
  code: string;
  voucherCode: string;
  vendorName: string;
  category: 'EQUIPMENT_MAINTENANCE' | 'FACILITY_RENT' | 'UTILITIES_HVAC' | 'INVENTORY_SUPPLIES' | 'MARKETING_ADS' | 'SOFTWARE_SAAS' | 'PETTY_CASH_MISC';
  title: string;
  description?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'CORPORATE_CARD' | 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'PETTY_CASH';
  paymentStatus: 'PAID' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'REJECTED';
  expenseDate: string;
  dueDate?: string;
  recordedBy: string;
  approvedBy?: string;
  receiptFileName?: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<IExpenseItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'EQUIPMENT_MAINTENANCE' | 'FACILITY_RENT' | 'UTILITIES_HVAC' | 'INVENTORY_SUPPLIES' | 'MARKETING_ADS'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Expense Voucher Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [vendorName, setVendorName] = useState('TechnoGym Global Service LLC');
  const [category, setCategory] = useState<'EQUIPMENT_MAINTENANCE' | 'FACILITY_RENT' | 'UTILITIES_HVAC' | 'INVENTORY_SUPPLIES' | 'MARKETING_ADS' | 'SOFTWARE_SAAS' | 'PETTY_CASH_MISC'>('EQUIPMENT_MAINTENANCE');
  const [title, setTitle] = useState('Bi-Monthly Cardio Motor Inspection & Belt Replacement');
  const [description, setDescription] = useState('Routine maintenance of 12 commercial treadmills, belt tensioning, and motor calibration.');
  const [amount, setAmount] = useState('1450.00');
  const [paymentMethod, setPaymentMethod] = useState<'CORPORATE_CARD' | 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'PETTY_CASH'>('CORPORATE_CARD');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING_APPROVAL'>('PAID');
  const [recordedBy, setRecordedBy] = useState('Manager Alex Vance');
  const [approvedBy, setApprovedBy] = useState('Director Marcus Hayes');
  const [notes, setNotes] = useState('Completed by Senior Field Engineer.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/expenses', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setExpenses(json.data);
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
    return Math.round((base + calculatedTax) * 100) / 100;
  }, [amount, calculatedTax]);

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return expenses;
    return expenses.filter((e) => e.category === activeTab);
  }, [expenses, activeTab]);

  const stats = useMemo(() => {
    const paid = expenses.filter((e) => e.paymentStatus === 'PAID');
    const pending = expenses.filter((e) => e.paymentStatus === 'PENDING_APPROVAL');

    const totalPaid = paid.reduce((sum, e) => sum + (e.totalAmount || 0), 0);
    const totalPending = pending.reduce((sum, e) => sum + (e.totalAmount || 0), 0);

    const rentAndUtilities = paid
      .filter((e) => e.category === 'FACILITY_RENT' || e.category === 'UTILITIES_HVAC')
      .reduce((sum, e) => sum + (e.totalAmount || 0), 0);

    const maintenance = paid
      .filter((e) => e.category === 'EQUIPMENT_MAINTENANCE')
      .reduce((sum, e) => sum + (e.totalAmount || 0), 0);

    return {
      total: expenses.length,
      paidCount: paid.length,
      pendingCount: pending.length,
      totalPaid,
      totalPending,
      rentAndUtilities,
      maintenance,
    };
  }, [expenses]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/expenses', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorName,
          category,
          title,
          description,
          amount: parseFloat(amount) || 0,
          taxAmount: calculatedTax,
          totalAmount: calculatedTotal,
          currency: 'USD',
          paymentMethod,
          paymentStatus,
          recordedBy,
          approvedBy,
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Expense voucher of $${calculatedTotal.toFixed(2)} recorded!`, {
          description: `${vendorName} • ${category.replace(/_/g, ' ')}`,
        });
        setCreateModalOpen(false);
        await loadExpenses();
      } else {
        toast.error('Failed to record expense voucher');
      }
    } catch {
      toast.error('Failed to connect to expense processing service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveExpense = async (exp: IExpenseItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const expId = exp._id || exp.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/finance/expenses/${expId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'PAID',
          approvedBy: 'Director Marcus Hayes',
          notes: `Approved and settled via Corporate Account by Director Marcus Hayes on ${new Date().toLocaleDateString()}`,
        }),
      });

      if (res.ok) {
        toast.success(`Expense Voucher #${exp.voucherCode} Approved & Settled!`, {
          description: `$${exp.totalAmount.toFixed(2)} paid to ${exp.vendorName}`,
        });
        await loadExpenses();
      } else {
        toast.error('Failed to approve expense');
      }
    } catch {
      toast.error('Failed to connect to approval service');
    }
  };

  const columns: ColumnDef<IExpenseItem>[] = [
    {
      accessorKey: 'voucherCode',
      header: 'Voucher & Vendor',
      size: 210,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-xs text-foreground block">
            {row.original.voucherCode}
          </span>
          <span className="font-semibold text-xs text-primary block truncate">
            {row.original.vendorName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Expense Item & Details',
      size: 250,
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-bold text-xs text-foreground block truncate">
            {row.original.title}
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold uppercase bg-muted/40 text-foreground whitespace-nowrap">
              {row.original.category?.replace(/_/g, ' ') || 'EXPENSE'}
            </Badge>
            <span className="text-[10px] text-muted-foreground truncate">{row.original.description}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount & Tax',
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
      header: 'Payment Method',
      size: 180,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-semibold whitespace-nowrap">
            {row.original.paymentMethod?.replace(/_/g, ' ') || 'OTHER'}
          </Badge>
          <span className="text-[10px] text-muted-foreground block truncate">
            Rec: {row.original.recordedBy}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Status & Approval',
      size: 180,
      cell: ({ row }) => {
        const st = row.original.paymentStatus;
        if (st === 'PAID') {
          return (
            <div className="space-y-0.5">
              <Badge variant="success" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2.5 py-0.5">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>Paid & Settled</span>
              </Badge>
              <span className="text-[10px] text-muted-foreground block truncate">By {row.original.approvedBy}</span>
            </div>
          );
        }
        return (
          <div className="space-y-0.5">
            <Badge variant="warning" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
              <Clock className="h-3 w-3 shrink-0" />
              <span>Pending Sign-off</span>
            </Badge>
            <span className="text-[10px] text-amber-600 font-semibold block truncate">Director approval req.</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'expenseDate',
      header: 'Expense Date',
      size: 150,
      cell: ({ row }) => (
        <span className="font-semibold text-xs text-foreground block">
          {new Date(row.original.expenseDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 190,
      cell: ({ row }) => {
        const isPending = row.original.paymentStatus === 'PENDING_APPROVAL';
        return (
          <div className="flex items-center gap-1.5">
            {isPending ? (
              <Button
                size="sm"
                onClick={() => handleApproveExpense(row.original)}
                className="h-7 px-2.5 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                title="Approve & Settle Expense"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Approve & Settle</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success(`Printing Voucher & Invoice for ${row.original.voucherCode}!`, {
                    description: `Vendor: ${row.original.vendorName} • Amount: $${row.original.totalAmount.toFixed(2)}`,
                  });
                }}
                className="h-7 px-2 text-xs gap-1 shadow-xs"
                title="Download Expense Voucher"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Voucher</span>
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
        title="Finance & Operational Expenses (OPEX)"
        subtitle="Track equipment maintenance, facility lease, commercial utilities, inventory replenishment, and staff expenditure."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Record Expense Voucher</span>
            </Button>
          </div>
        }
      />

      {/* Financial OPEX KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total OPEX Paid (MTD)"
          value={`$${stats.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="Operational expenditures"
          trend="down"
          timeframe="Total settled bills"
          icon={<DollarSign className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="Facility Rent & Utilities"
          value={`$${stats.rentAndUtilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="60% of Monthly OPEX"
          trend="up"
          timeframe="Facility lease & HVAC power"
          icon={<Building className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Equipment Maintenance"
          value={`$${stats.maintenance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="100% Machines operational"
          trend="up"
          timeframe="Cardio & cable servicing"
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Pending Approval"
          value={`$${stats.totalPending.toFixed(2)}`}
          change={`${stats.pendingCount} Purchase Order`}
          trend="up"
          timeframe="Awaiting director sign-off"
          icon={<Clock className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Expenses', count: stats.total },
          { key: 'EQUIPMENT_MAINTENANCE', label: '⚙️ Equipment & Repairs', count: expenses.filter((e) => e.category === 'EQUIPMENT_MAINTENANCE').length },
          { key: 'FACILITY_RENT', label: '🏢 Facility Rent', count: expenses.filter((e) => e.category === 'FACILITY_RENT').length },
          { key: 'UTILITIES_HVAC', label: '⚡ Utilities & Power', count: expenses.filter((e) => e.category === 'UTILITIES_HVAC').length },
          { key: 'INVENTORY_SUPPLIES', label: '📦 Shake Bar & Supplies', count: expenses.filter((e) => e.category === 'INVENTORY_SUPPLIES').length },
          { key: 'MARKETING_ADS', label: '📣 Marketing & Ads', count: expenses.filter((e) => e.category === 'MARKETING_ADS').length },
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
        searchPlaceholder="Search expenses by vendor, voucher code, title, description..."
      />

      {/* Record Expense Voucher Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <span>Record Operational Expense Voucher</span>
            </DialogTitle>
            <DialogDescription>
              Record equipment repairs, utility bills, facility rent, or inventory orders.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateExpense} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Vendor / Payee Name</label>
                <Input
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. TechnoGym Global Service LLC"
                  required
                />
              </div>

              <SelectBox
                label="Expense Category"
                value={category}
                onChange={(v) => setCategory(v as any)}
                options={[
                  { value: 'EQUIPMENT_MAINTENANCE', label: '⚙️ Equipment Maintenance & Repairs' },
                  { value: 'FACILITY_RENT', label: '🏢 Facility Lease & Rent' },
                  { value: 'UTILITIES_HVAC', label: '⚡ Commercial Electricity & HVAC' },
                  { value: 'INVENTORY_SUPPLIES', label: '📦 Shake Bar & Towel Supplies' },
                  { value: 'MARKETING_ADS', label: '📣 Marketing & Social Ads' },
                  { value: 'SOFTWARE_SAAS', label: '💻 Software & SaaS Subscriptions' },
                  { value: 'PETTY_CASH_MISC', label: '☕ Office & Petty Cash Misc' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Voucher Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Bi-Monthly Treadmill Maintenance"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description & Scope of Work</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 text-xs"
                placeholder="Details of service provided or parts replaced..."
              />
            </div>

            {/* Financial Calculation Box */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="text-[11px] font-semibold text-foreground">Tax 10% (GST/VAT)</label>
                  <div className="h-8 px-3 rounded-lg border border-border bg-background flex items-center text-xs font-mono text-muted-foreground">
                    +${calculatedTax.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">Total Voucher Amount:</span>
                <span className="font-mono font-extrabold text-base text-rose-600">
                  ${calculatedTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Payment Method"
                value={paymentMethod}
                onChange={(v) => setPaymentMethod(v as any)}
                options={[
                  { value: 'CORPORATE_CARD', label: '💳 Corporate Visa / Mastercard' },
                  { value: 'BANK_TRANSFER', label: '🏦 Direct Bank Wire / ACH' },
                  { value: 'CASH', label: '💵 Petty Cash Drawer' },
                  { value: 'CHECK', label: '📜 Company Check' },
                ]}
              />

              <SelectBox
                label="Payment Status"
                value={paymentStatus}
                onChange={(v) => setPaymentStatus(v as any)}
                options={[
                  { value: 'PAID', label: '🟢 Paid & Settled' },
                  { value: 'PENDING_APPROVAL', label: '🟡 Pending Director Sign-off' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Recorded By</label>
                <Input
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Staff Name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Approving Director</label>
                <Input
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Director Name"
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Recording...' : `Record Voucher ($${calculatedTotal.toFixed(2)})`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
