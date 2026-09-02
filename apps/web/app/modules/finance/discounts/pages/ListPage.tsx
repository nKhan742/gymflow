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
  Tag,
  Percent,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Copy,
  DollarSign,
  Sparkles,
  Flame,
  Check,
  Zap,
  Gift,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IDiscountItem {
  id: string;
  _id?: string;
  code: string;
  promoCode: string;
  title: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_TRIAL_PERIOD';
  discountValue: number;
  currency: string;
  applicableDomain: 'ALL_MEMBERSHIPS' | 'ANNUAL_VIP' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_CORPORATE';
  minPurchaseAmount: number;
  maxUsageCount: number;
  usedCount: number;
  startDate: string;
  expiryDate?: string;
  isActive: boolean;
  createdBy?: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState<IDiscountItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ALL_MEMBERSHIPS' | 'ANNUAL_VIP' | 'PERSONAL_TRAINING' | 'STUDENT_CORPORATE' | 'POS_RETAIL'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Promo Code Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('AUTUMN20');
  const [title, setTitle] = useState('Autumn Fitness Kickoff 20% Off');
  const [description, setDescription] = useState('Seasonal discount code for all annual and semester gym memberships.');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('20');
  const [applicableDomain, setApplicableDomain] = useState<'ALL_MEMBERSHIPS' | 'ANNUAL_VIP' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_CORPORATE'>('ALL_MEMBERSHIPS');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('100.00');
  const [maxUsageCount, setMaxUsageCount] = useState('100');
  const [notes, setNotes] = useState('Promoted on Instagram and gym digital posters.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/discounts', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDiscounts(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return discounts;
    return discounts.filter((d) => d.applicableDomain === activeTab);
  }, [discounts, activeTab]);

  const stats = useMemo(() => {
    const active = discounts.filter((d) => d.isActive);
    const totalRedemptions = discounts.reduce((sum, d) => sum + (d.usedCount || 0), 0);

    return {
      total: discounts.length,
      activeCount: active.length,
      totalRedemptions,
      conversionLift: '+28.4%',
    };
  }, [discounts]);

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/discounts', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promoCode: promoCode.toUpperCase(),
          title,
          description,
          discountType,
          discountValue: parseFloat(discountValue) || 10,
          currency: 'USD',
          applicableDomain,
          minPurchaseAmount: parseFloat(minPurchaseAmount) || 0,
          maxUsageCount: parseInt(maxUsageCount) || 100,
          usedCount: 0,
          isActive: true,
          createdBy: 'Marketing Lead Chloe Bennett',
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Promo Code ${promoCode.toUpperCase()} created successfully!`, {
          description: `${title} (${discountType === 'PERCENTAGE' ? `${discountValue}% OFF` : `$${discountValue} OFF`})`,
        });
        setCreateModalOpen(false);
        await loadDiscounts();
      } else {
        toast.error('Failed to create promotional discount');
      }
    } catch {
      toast.error('Failed to connect to promotional discounts service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (disc: IDiscountItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const discId = disc._id || disc.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/finance/discounts/${discId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !disc.isActive,
        }),
      });

      if (res.ok) {
        toast.success(`Promo Code ${disc.promoCode} ${disc.isActive ? 'Deactivated' : 'Activated'}!`);
        await loadDiscounts();
      } else {
        toast.error('Failed to update discount status');
      }
    } catch {
      toast.error('Failed to connect to discount gateway');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied "${text}" to clipboard!`, {
      description: 'Ready to paste in checkout or send to member.',
    });
  };

  const columns: ColumnDef<IDiscountItem>[] = [
    {
      accessorKey: 'promoCode',
      header: 'Promo Code & Title',
      size: 240,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              onClick={() => copyToClipboard(row.original.promoCode)}
              className="font-mono font-extrabold text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 cursor-pointer flex items-center gap-1 group whitespace-nowrap shadow-xs"
              title="Click to copy promo code"
            >
              <span>{row.original.promoCode}</span>
              <Copy className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
            </Badge>
          </div>
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.title}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'discountValue',
      header: 'Discount Benefit',
      size: 170,
      cell: ({ row }) => {
        const isPct = row.original.discountType === 'PERCENTAGE';
        return (
          <div className="space-y-0.5">
            <span className="font-extrabold text-sm text-emerald-600 block font-mono">
              {isPct ? `${row.original.discountValue}% OFF` : `$${row.original.discountValue}.00 OFF`}
            </span>
            {row.original.minPurchaseAmount > 0 && (
              <span className="text-[10px] text-muted-foreground block">
                Min spend: ${row.original.minPurchaseAmount.toFixed(2)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'applicableDomain',
      header: 'Applies To',
      size: 190,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-semibold bg-muted/40 text-foreground whitespace-nowrap">
          {row.original.applicableDomain?.replace(/_/g, ' ') || 'ALL'}
        </Badge>
      ),
    },
    {
      accessorKey: 'usedCount',
      header: 'Redemptions / Cap',
      size: 200,
      cell: ({ row }) => {
        const pct = Math.min(100, Math.round((row.original.usedCount / Math.max(1, row.original.maxUsageCount)) * 100));
        return (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-foreground">{row.original.usedCount} used</span>
              <span className="text-muted-foreground">cap {row.original.maxUsageCount}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${pct > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      size: 140,
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? 'success' : 'secondary'}
          className={`text-xs font-semibold whitespace-nowrap px-2 py-0.5 ${
            row.original.isActive ? 'bg-emerald-600' : ''
          }`}
        >
          {row.original.isActive ? '🟢 Active' : '⚫ Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'expiryDate',
      header: 'Validity',
      size: 150,
      cell: ({ row }) => (
        <div>
          {row.original.expiryDate ? (
            <span className="text-xs text-foreground block font-mono">
              Exp: {new Date(row.original.expiryDate).toLocaleDateString()}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground block">No Expiration</span>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 170,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(row.original.promoCode)}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Copy Code"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(row.original)}
            className={`h-7 px-2 text-xs gap-1 shadow-xs ${
              row.original.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <span>{row.original.isActive ? 'Pause' : 'Activate'}</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Finance & Promotional Discounts"
        subtitle="Configure seasonal promotional coupon codes, student & corporate subsidies, membership renewal vouchers, and point-of-sale perks."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Create Promo Code</span>
            </Button>
          </div>
        }
      />

      {/* Promotion KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Promo Codes"
          value={`${stats.activeCount} Campaigns`}
          change="Currently active"
          trend="up"
          timeframe="Live across checkout"
          icon={<Tag className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Total Redemptions"
          value={`${stats.totalRedemptions} Uses`}
          change="Across all campaigns"
          trend="up"
          timeframe="Member checkouts"
          icon={<Sparkles className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Conversion Lift"
          value={stats.conversionLift}
          change="Sales revenue acceleration"
          trend="up"
          timeframe="Promo campaign ROI"
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="Avg Discount Benefit"
          value="20% OFF"
          change="Weighted average"
          trend="up"
          timeframe="Member loyalty savings"
          icon={<Percent className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Promotions', count: stats.total },
          { key: 'ALL_MEMBERSHIPS', label: '👑 Memberships', count: discounts.filter((d) => d.applicableDomain === 'ALL_MEMBERSHIPS').length },
          { key: 'ANNUAL_VIP', label: '⭐ VIP Platinum', count: discounts.filter((d) => d.applicableDomain === 'ANNUAL_VIP').length },
          { key: 'PERSONAL_TRAINING', label: '🏋️ Personal Training', count: discounts.filter((d) => d.applicableDomain === 'PERSONAL_TRAINING').length },
          { key: 'STUDENT_CORPORATE', label: '🎓 Student / Corporate', count: discounts.filter((d) => d.applicableDomain === 'STUDENT_CORPORATE').length },
          { key: 'POS_RETAIL', label: '🥤 Cafe & Shake Bar', count: discounts.filter((d) => d.applicableDomain === 'POS_RETAIL').length },
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
        searchPlaceholder="Search promo codes, campaign titles, created by..."
      />

      {/* Create Promo Code Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <span>Create Promotional Discount Code</span>
            </DialogTitle>
            <DialogDescription>
              Configure coupon codes, percentage or fixed discounts, usage limits, and expiration dates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDiscount} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Promo Coupon Code</label>
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="h-9 text-xs font-mono font-bold uppercase"
                  placeholder="e.g. SUMMER2026"
                  required
                />
              </div>

              <SelectBox
                label="Discount Type"
                value={discountType}
                onChange={(v) => setDiscountType(v as any)}
                options={[
                  { value: 'PERCENTAGE', label: '🏷️ Percentage Discount (%)' },
                  { value: 'FIXED_AMOUNT', label: '💵 Fixed Cash Off ($)' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Campaign Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Summer Flash Sale 20% Off All Memberships"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {discountType === 'PERCENTAGE' ? 'Discount Rate (%)' : 'Discount Amount ($)'}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="h-9 text-xs font-mono font-bold"
                  placeholder="20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Min Spend ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={minPurchaseAmount}
                  onChange={(e) => setMinPurchaseAmount(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="100.00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Usage Cap</label>
                <Input
                  type="number"
                  value={maxUsageCount}
                  onChange={(e) => setMaxUsageCount(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <SelectBox
              label="Applicable Target Domain"
              value={applicableDomain}
              onChange={(v) => setApplicableDomain(v as any)}
              options={[
                { value: 'ALL_MEMBERSHIPS', label: '👑 All Membership Plans & Renewals' },
                { value: 'ANNUAL_VIP', label: '⭐ VIP Platinum Tier Only' },
                { value: 'PERSONAL_TRAINING', label: '🏋️ Personal Training Packages' },
                { value: 'STUDENT_CORPORATE', label: '🎓 Student & Corporate Passes' },
                { value: 'POS_RETAIL', label: '🥤 Cafe & Shake Bar POS' },
              ]}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Campaign Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Marketing channel, promotional terms..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <Sparkles className="h-4 w-4" />
                <span>{submitting ? 'Creating...' : `Launch Code (${promoCode})`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
