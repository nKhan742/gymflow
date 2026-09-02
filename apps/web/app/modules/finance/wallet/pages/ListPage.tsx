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
  Wallet,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  CreditCard,
  Zap,
  ShoppingBag,
  Coins,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IWalletItem {
  id: string;
  _id?: string;
  code: string;
  walletCode: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  currentBalance: number;
  lifetimeDeposited: number;
  lifetimeSpent: number;
  rewardPoints: number;
  currency: string;
  autoTopUpEnabled: boolean;
  autoTopUpThreshold?: number;
  autoTopUpAmount?: number;
  lastTransactionDate: string;
  lastTransactionType?: 'TOP_UP_DEPOSIT' | 'CAFE_POS_DEBIT' | 'SESSION_DEBIT' | 'CASHBACK_REWARD' | 'REFUND_CREDIT';
  lastTransactionAmount?: number;
  walletStatus: 'ACTIVE' | 'LOW_BALANCE' | 'FROZEN';
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<IWalletItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'HIGH_BALANCE' | 'ACTIVE' | 'LOW_BALANCE'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Top-Up Modal State
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [topUpAmount, setTopUpAmount] = useState('100.00');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cashierNotes, setCashierNotes] = useState('Desk recharge via POS terminal.');
  const [submittingTopUp, setSubmittingTopUp] = useState(false);

  // Quick Charge / Debit Modal State
  const [debitModalOpen, setDebitModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<IWalletItem | null>(null);
  const [debitAmount, setDebitAmount] = useState('15.00');
  const [debitReason, setDebitReason] = useState('Cafe Protein Shake & Pre-Workout Drink');
  const [submittingDebit, setSubmittingDebit] = useState(false);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/wallet', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setWallets(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return wallets;
    if (activeTab === 'HIGH_BALANCE') return wallets.filter((w) => w.currentBalance >= 200);
    if (activeTab === 'LOW_BALANCE') return wallets.filter((w) => w.currentBalance < 50);
    return wallets.filter((w) => w.walletStatus === 'ACTIVE');
  }, [wallets, activeTab]);

  const stats = useMemo(() => {
    const totalStoredValue = wallets.reduce((sum, w) => sum + (w.currentBalance || 0), 0);
    const totalDeposited = wallets.reduce((sum, w) => sum + (w.lifetimeDeposited || 0), 0);
    const totalPoints = wallets.reduce((sum, w) => sum + (w.rewardPoints || 0), 0);
    const lowBalanceCount = wallets.filter((w) => w.currentBalance < 50).length;

    return {
      total: wallets.length,
      totalStoredValue,
      totalDeposited,
      totalPoints,
      lowBalanceCount,
    };
  }, [wallets]);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTopUp(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const target = wallets.find((w) => w.memberCode === memberCode);
      const amountToAdd = parseFloat(topUpAmount) || 0;

      if (target) {
        const targetId = target._id || target.id;
        const newBal = (target.currentBalance || 0) + amountToAdd;
        const newDeposited = (target.lifetimeDeposited || 0) + amountToAdd;
        const earnedPoints = (target.rewardPoints || 0) + Math.round(amountToAdd * 0.5);

        const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/finance/wallet/${targetId}`, {
          method: 'PUT',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentBalance: newBal,
            lifetimeDeposited: newDeposited,
            rewardPoints: earnedPoints,
            walletStatus: newBal < 20 ? 'LOW_BALANCE' : 'ACTIVE',
            lastTransactionDate: new Date(),
            lastTransactionType: 'TOP_UP_DEPOSIT',
            lastTransactionAmount: amountToAdd,
            notes: cashierNotes,
          }),
        });

        if (res.ok) {
          toast.success(`Top-Up of $${amountToAdd.toFixed(2)} added to ${target.memberName}'s wallet!`, {
            description: `New Available Balance: $${newBal.toFixed(2)} (+${Math.round(amountToAdd * 0.5)} Reward Points)`,
          });
          setTopUpModalOpen(false);
          await loadWallets();
        } else {
          toast.error('Failed to process wallet top-up');
        }
      }
    } catch {
      toast.error('Failed to connect to wallet service');
    } finally {
      setSubmittingTopUp(false);
    }
  };

  const handleDebit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    setSubmittingDebit(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const amountToDebit = parseFloat(debitAmount) || 0;

      if (selectedWallet.currentBalance < amountToDebit) {
        toast.error(`Insufficient Wallet Balance! Available: $${selectedWallet.currentBalance.toFixed(2)}`);
        setSubmittingDebit(false);
        return;
      }

      const targetId = selectedWallet._id || selectedWallet.id;
      const newBal = selectedWallet.currentBalance - amountToDebit;
      const newSpent = (selectedWallet.lifetimeSpent || 0) + amountToDebit;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/finance/wallet/${targetId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentBalance: newBal,
          lifetimeSpent: newSpent,
          walletStatus: newBal < 20 ? 'LOW_BALANCE' : 'ACTIVE',
          lastTransactionDate: new Date(),
          lastTransactionType: 'CAFE_POS_DEBIT',
          lastTransactionAmount: -amountToDebit,
          notes: debitReason,
        }),
      });

      if (res.ok) {
        toast.success(`Debited $${amountToDebit.toFixed(2)} for ${selectedWallet.memberName}!`, {
          description: `${debitReason} • Remaining Balance: $${newBal.toFixed(2)}`,
        });
        setDebitModalOpen(false);
        await loadWallets();
      } else {
        toast.error('Failed to process wallet charge');
      }
    } catch {
      toast.error('Failed to connect to wallet gateway');
    } finally {
      setSubmittingDebit(false);
    }
  };

  const columns: ColumnDef<IWalletItem>[] = [
    {
      accessorKey: 'memberName',
      header: 'Member & Tier',
      size: 210,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0">
            {row.original.memberName.charAt(0)}
          </div>
          <div className="truncate">
            <span
              onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
              className="font-semibold text-xs text-foreground block truncate hover:underline hover:text-primary cursor-pointer"
            >
              {row.original.memberName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-muted-foreground font-mono">
                #{row.original.memberCode}
              </span>
              <Badge variant="outline" className="text-[9px] px-1 py-0 font-semibold bg-muted/40 text-foreground whitespace-nowrap">
                {row.original.planTier?.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'currentBalance',
      header: 'Available Prepaid Balance',
      size: 210,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono font-extrabold text-sm text-emerald-600 block">
            ${row.original.currentBalance?.toFixed(2)} USD
          </span>
          <span className="text-[10px] text-muted-foreground font-mono block">
            Deposited: ${row.original.lifetimeDeposited?.toFixed(2)} • Spent: ${row.original.lifetimeSpent?.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'rewardPoints',
      header: 'Loyalty Reward Points',
      size: 180,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Badge variant="outline" className="text-xs px-2 py-0.5 font-bold bg-amber-500/10 text-amber-600 border-amber-500/25 whitespace-nowrap flex items-center gap-1 w-fit">
            <Coins className="h-3 w-3" />
            <span>{row.original.rewardPoints} Pts</span>
          </Badge>
          <span className="text-[10px] text-muted-foreground block font-mono">
            Redeem value: ${(row.original.rewardPoints / 10).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'autoTopUpEnabled',
      header: 'Auto Top-Up Rule',
      size: 190,
      cell: ({ row }) => (
        <div>
          {row.original.autoTopUpEnabled ? (
            <div className="space-y-0.5">
              <Badge variant="success" className="text-[9px] px-1.5 py-0 font-bold bg-emerald-600/15 text-emerald-700 border-emerald-600/30 whitespace-nowrap">
                ⚡ Auto +${row.original.autoTopUpAmount}
              </Badge>
              <span className="text-[10px] text-muted-foreground block">
                Trigger: when &lt;${row.original.autoTopUpThreshold}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground block">Manual Reload</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'lastTransactionType',
      header: 'Last Activity',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.lastTransactionType?.replace(/_/g, ' ') || 'Top-Up'}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            {new Date(row.original.lastTransactionDate).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'walletStatus',
      header: 'Status',
      size: 140,
      cell: ({ row }) => {
        const st = row.original.walletStatus;
        if (st === 'ACTIVE') {
          return (
            <Badge variant="success" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2.5 py-0.5">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>Active</span>
            </Badge>
          );
        }
        if (st === 'LOW_BALANCE') {
          return (
            <Badge variant="warning" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>Low Balance</span>
            </Badge>
          );
        }
        return (
          <Badge variant="destructive" className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
            <span>Frozen</span>
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 190,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={() => {
              setMemberCode(row.original.memberCode);
              setTopUpModalOpen(true);
            }}
            className="h-7 px-2.5 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
            title="Top-up Wallet"
          >
            <Plus className="h-3 w-3" />
            <span>Top-Up</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedWallet(row.original);
              setDebitModalOpen(true);
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs text-rose-600 hover:bg-rose-50 border-rose-200"
            title="Charge / Debit"
          >
            <ShoppingBag className="h-3 w-3" />
            <span>Charge</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Finance & Member Digital Wallets"
        subtitle="Manage pre-funded member balances for contactless cafe & shake bar debits, session drop-in passes, auto top-up rules, and loyalty reward points."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setTopUpModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Recharge Wallet</span>
            </Button>
          </div>
        }
      />

      {/* Wallet KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Pre-Funded Balances"
          value={`$${stats.totalStoredValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="Stored member funds"
          trend="up"
          timeframe="Total active deposits"
          icon={<Wallet className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Lifetime Deposits"
          value={`$${stats.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="Cumulative recharges"
          trend="up"
          timeframe="All-time pre-funding"
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Total Reward Points"
          value={`${stats.totalPoints.toLocaleString()} Pts`}
          change={`$${(stats.totalPoints / 10).toFixed(2)} Value`}
          trend="up"
          timeframe="Loyalty reward pool"
          icon={<Coins className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Low Balance Alerts"
          value={`${stats.lowBalanceCount} Wallets`}
          change="Balance < $50.00"
          trend="down"
          timeframe="Auto top-up recommended"
          icon={<AlertCircle className="h-5 w-5 text-rose-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Wallets', count: stats.total },
          { key: 'HIGH_BALANCE', label: '💎 High Balance (>$200)', count: wallets.filter((w) => w.currentBalance >= 200).length },
          { key: 'ACTIVE', label: '🟢 Standard Active', count: wallets.filter((w) => w.walletStatus === 'ACTIVE').length },
          { key: 'LOW_BALANCE', label: '🟡 Low Balance (<$50)', count: stats.lowBalanceCount },
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
        searchPlaceholder="Search wallets by member name, member code, wallet code..."
      />

      {/* Top-Up Wallet Modal */}
      <Dialog open={topUpModalOpen} onOpenChange={setTopUpModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-500" />
              <span>Top-Up Member Digital Wallet</span>
            </DialogTitle>
            <DialogDescription>
              Recharge member pre-funded balance for contactless cafe, PT session debits, and club purchases.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTopUp} className="space-y-4 py-2">
            <SelectBox
              label="Select Member"
              value={memberCode}
              onChange={setMemberCode}
              options={[
                { value: 'GF-9284', label: '👑 Sarah Jenkins (#GF-9284 • VIP • Balance: $485.50)' },
                { value: 'GF-3109', label: '🥈 David Chen (#GF-3109 • Silver • Balance: $120.00)' },
                { value: 'GF-4821', label: '⭐ Marcus Rodriguez (#GF-4821 • Gold • Balance: $245.00)' },
                { value: 'GF-7712', label: '👑 Emily Watson (#GF-7712 • VIP • Balance: $310.00)' },
                { value: 'GF-5520', label: '🎓 Liam O Connor (#GF-5520 • Student • Balance: $18.50)' },
                { value: 'GF-9014', label: '⭐ Jessica Taylor (#GF-9014 • Gold • Balance: $165.00)' },
              ]}
            />

            {/* Quick Recharge Amounts */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Top-Up Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {['50.00', '100.00', '200.00', '500.00'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                      topUpAmount === amt
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/25'
                        : 'bg-muted/40 text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Custom Amount ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="h-9 text-xs font-mono font-bold"
                  placeholder="100.00"
                  required
                />
              </div>

              <SelectBox
                label="Payment Tender Method"
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={[
                  { value: 'CREDIT_CARD', label: '💳 Credit / Debit Card (Stripe)' },
                  { value: 'POS_TERMINAL', label: '📟 POS Terminal Tap' },
                  { value: 'CASH', label: '💵 Front Desk Cash' },
                  { value: 'BANK_TRANSFER', label: '🏦 Direct Bank Wire' },
                ]}
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-foreground">Loyalty Cashback Incentive</p>
                <p className="text-muted-foreground">+50% Reward Points automatically credited</p>
              </div>
              <span className="font-mono font-extrabold text-emerald-600">
                +{Math.round((parseFloat(topUpAmount) || 0) * 0.5)} Pts
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Cashier Notes</label>
              <Input
                value={cashierNotes}
                onChange={(e) => setCashierNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Top-up reference, cashier notes..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setTopUpModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submittingTopUp} className="gap-1.5 font-bold shadow-md shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submittingTopUp ? 'Recharging...' : `Credit $${parseFloat(topUpAmount || '0').toFixed(2)}`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Charge / Debit Modal */}
      <Dialog open={debitModalOpen} onOpenChange={setDebitModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <ShoppingBag className="h-5 w-5" />
              <span>Charge Member Prepaid Wallet</span>
            </DialogTitle>
            <DialogDescription>
              Quick point of sale debit for cafe, shake bar, towels, or guest entries.
            </DialogDescription>
          </DialogHeader>

          {selectedWallet && (
            <form onSubmit={handleDebit} className="space-y-4 py-2">
              <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">{selectedWallet.memberName}</span>
                  <span className="text-[11px] text-muted-foreground font-mono">#{selectedWallet.memberCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Available Balance</span>
                  <span className="font-mono font-extrabold text-sm text-emerald-600">
                    ${selectedWallet.currentBalance.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Debit Amount ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={debitAmount}
                  onChange={(e) => setDebitAmount(e.target.value)}
                  className="h-9 text-xs font-mono font-bold"
                  placeholder="15.00"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Purchase Line Item Description</label>
                <Input
                  value={debitReason}
                  onChange={(e) => setDebitReason(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. ISO Whey Smoothie & Energy Bar"
                  required
                />
              </div>

              <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setDebitModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submittingDebit} className="gap-1.5 font-bold shadow-md shadow-rose-600/25 bg-rose-600 hover:bg-rose-700 text-white">
                  <ShoppingBag className="h-4 w-4" />
                  <span>{submittingDebit ? 'Charging...' : `Debit $${parseFloat(debitAmount || '0').toFixed(2)}`}</span>
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
