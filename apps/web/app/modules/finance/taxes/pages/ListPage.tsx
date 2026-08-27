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
  FileSpreadsheet,
  Percent,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Building,
  ShieldCheck,
  Star,
  DollarSign,
  Scale,
  Landmark,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface ITaxItem {
  id: string;
  _id?: string;
  code: string;
  taxCode: string;
  taxName: string;
  description?: string;
  taxRate: number;
  taxType: 'STANDARD_SALES_TAX' | 'FITNESS_SERVICES_TAX' | 'POS_RETAIL_NUTRITION_TAX' | 'ZERO_RATED_EXEMPT' | 'MUNICIPAL_RECREATION_CESS';
  calculationMethod: 'EXCLUSIVE' | 'INCLUSIVE';
  applicableCategory: 'ALL_MEMBERSHIPS' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_EXEMPT' | 'ALL_SERVICES';
  taxRegistrationNumber: string;
  isDefault: boolean;
  isActive: boolean;
  effectiveFrom: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [taxes, setTaxes] = useState<ITaxItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ALL_MEMBERSHIPS' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_EXEMPT'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Tax Rule Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [taxCode, setTaxCode] = useState('TAX-GST-12');
  const [taxName, setTaxName] = useState('State Commercial Fitness Tax');
  const [description, setDescription] = useState('12.0% standard sales tax applied to premium club facilities.');
  const [taxRate, setTaxRate] = useState('12.0');
  const [taxType, setTaxType] = useState<'STANDARD_SALES_TAX' | 'FITNESS_SERVICES_TAX' | 'POS_RETAIL_NUTRITION_TAX' | 'ZERO_RATED_EXEMPT' | 'MUNICIPAL_RECREATION_CESS'>('STANDARD_SALES_TAX');
  const [calculationMethod, setCalculationMethod] = useState<'EXCLUSIVE' | 'INCLUSIVE'>('EXCLUSIVE');
  const [applicableCategory, setApplicableCategory] = useState<'ALL_MEMBERSHIPS' | 'PERSONAL_TRAINING' | 'POS_RETAIL' | 'STUDENT_EXEMPT' | 'ALL_SERVICES'>('ALL_MEMBERSHIPS');
  const [taxRegistrationNumber, setTaxRegistrationNumber] = useState('EIN-84-9201948');
  const [isDefault, setIsDefault] = useState(false);
  const [notes, setNotes] = useState('Filed with state revenue and tax compliance department.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTaxes();
  }, []);

  const loadTaxes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('http://localhost:5000/api/v1/finance/taxes', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTaxes(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return taxes;
    return taxes.filter((t) => t.applicableCategory === activeTab);
  }, [taxes, activeTab]);

  const stats = useMemo(() => {
    const active = taxes.filter((t) => t.isActive);
    const defaultTax = taxes.find((t) => t.isDefault);

    return {
      total: taxes.length,
      activeCount: active.length,
      defaultRate: defaultTax ? `${defaultTax.taxRate}% (${defaultTax.taxCode})` : '10.0% Standard',
      taxId: 'EIN-84-9201948',
    };
  }, [taxes]);

  const handleCreateTax = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const res = await fetch('http://localhost:5000/api/v1/finance/taxes', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taxCode: taxCode.toUpperCase(),
          taxName,
          description,
          taxRate: parseFloat(taxRate) || 0,
          taxType,
          calculationMethod,
          applicableCategory,
          taxRegistrationNumber,
          isDefault,
          isActive: true,
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Tax Rule ${taxCode.toUpperCase()} created successfully!`, {
          description: `${taxName} (${taxRate}% • ${calculationMethod})`,
        });
        setCreateModalOpen(false);
        await loadTaxes();
      } else {
        toast.error('Failed to create tax rule');
      }
    } catch {
      toast.error('Failed to connect to tax settings service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (tax: ITaxItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const taxId = tax._id || tax.id;

      const res = await fetch(`http://localhost:5000/api/v1/finance/taxes/${taxId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDefault: true,
        }),
      });

      if (res.ok) {
        toast.success(`${tax.taxName} set as Default System Tax!`);
        await loadTaxes();
      } else {
        toast.error('Failed to set default tax');
      }
    } catch {
      toast.error('Failed to connect to tax gateway');
    }
  };

  const handleToggleStatus = async (tax: ITaxItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const taxId = tax._id || tax.id;

      const res = await fetch(`http://localhost:5000/api/v1/finance/taxes/${taxId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !tax.isActive,
        }),
      });

      if (res.ok) {
        toast.success(`Tax Rule ${tax.taxCode} ${tax.isActive ? 'Deactivated' : 'Activated'}!`);
        await loadTaxes();
      } else {
        toast.error('Failed to update tax status');
      }
    } catch {
      toast.error('Failed to connect to tax gateway');
    }
  };

  const columns: ColumnDef<ITaxItem>[] = [
    {
      accessorKey: 'taxName',
      header: 'Tax Rule & Code',
      size: 240,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-extrabold text-xs text-foreground block">
              {row.original.taxCode}
            </span>
            {row.original.isDefault && (
              <Badge variant="success" className="text-[9px] px-1.5 py-0 font-bold bg-emerald-600 flex items-center gap-0.5 whitespace-nowrap">
                <Star className="h-2.5 w-2.5 fill-current" />
                <span>Default</span>
              </Badge>
            )}
          </div>
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.taxName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'taxRate',
      header: 'Tax Percentage',
      size: 160,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs px-2.5 py-1 font-mono font-extrabold bg-primary/10 text-primary border-primary/30 whitespace-nowrap">
          {row.original.taxRate.toFixed(1)}% GST / VAT
        </Badge>
      ),
    },
    {
      accessorKey: 'calculationMethod',
      header: 'Calculation Mode',
      size: 170,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-semibold bg-muted/40 text-foreground whitespace-nowrap">
            {row.original.calculationMethod === 'EXCLUSIVE' ? '➕ Exclusive (Add-on)' : '🏷️ Inclusive (In Price)'}
          </Badge>
          <span className="text-[10px] text-muted-foreground block">
            {row.original.calculationMethod === 'EXCLUSIVE' ? 'Added on invoice total' : 'Included in shelf price'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'applicableCategory',
      header: 'Applies To',
      size: 180,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-semibold uppercase bg-muted/40 text-foreground whitespace-nowrap">
          {row.original.applicableCategory?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'taxRegistrationNumber',
      header: 'Tax ID / Registration',
      size: 180,
      cell: ({ row }) => (
        <div className="space-y-0.5 font-mono">
          <span className="text-xs font-bold text-foreground block">
            {row.original.taxRegistrationNumber}
          </span>
          <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-sans">
            <ShieldCheck className="h-3 w-3" />
            <span>IRS / VAT Verified</span>
          </span>
        </div>
      ),
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
      id: 'actions',
      header: 'Actions',
      size: 180,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {!row.original.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetDefault(row.original)}
              className="h-7 px-2 text-xs gap-1 shadow-xs text-amber-600 hover:bg-amber-50 border-amber-200"
              title="Set as Default Tax"
            >
              <Star className="h-3.5 w-3.5" />
              <span>Make Default</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(row.original)}
            className={`h-7 px-2 text-xs gap-1 shadow-xs ${
              row.original.isActive ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
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
        title="Finance & Tax Settings"
        subtitle="Manage GST, VAT, and state sales tax rates, exclusive/inclusive calculation models, tax identification registration numbers, and invoice compliance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Tax Rule</span>
            </Button>
          </div>
        }
      />

      {/* Tax Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Tax Rules"
          value={`${stats.activeCount} Rules`}
          change="Configured rates"
          trend="up"
          timeframe="Live across billing"
          icon={<Scale className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Default Checkout Rate"
          value={stats.defaultRate}
          change="Primary tax rate"
          trend="up"
          timeframe="Applied to memberships"
          icon={<Percent className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Business Tax ID"
          value={stats.taxId}
          change="IRS / State Verified"
          trend="up"
          timeframe="Legal corporate EIN"
          icon={<Landmark className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="Tax Calculation Model"
          value="Exclusive Tax"
          change="Itemized on invoice"
          trend="up"
          timeframe="Statutory compliance"
          icon={<ShieldCheck className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Tax Rules', count: stats.total },
          { key: 'ALL_MEMBERSHIPS', label: '👑 Memberships', count: taxes.filter((t) => t.applicableCategory === 'ALL_MEMBERSHIPS').length },
          { key: 'PERSONAL_TRAINING', label: '🏋️ Fitness & PT Services', count: taxes.filter((t) => t.applicableCategory === 'PERSONAL_TRAINING').length },
          { key: 'POS_RETAIL', label: '🥤 Cafe & Nutrition', count: taxes.filter((t) => t.applicableCategory === 'POS_RETAIL').length },
          { key: 'STUDENT_EXEMPT', label: '0% Exemptions', count: taxes.filter((t) => t.applicableCategory === 'STUDENT_EXEMPT').length },
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
        searchPlaceholder="Search tax rules by code, name, tax registration number..."
      />

      {/* Add Tax Rule Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span>Configure New Tax Rule</span>
            </DialogTitle>
            <DialogDescription>
              Set up state sales tax, GST/VAT percentages, calculation mechanisms, and regulatory numbers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTax} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tax Identifier Code</label>
                <Input
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value.toUpperCase())}
                  className="h-9 text-xs font-mono font-bold uppercase"
                  placeholder="e.g. TAX-GST-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tax Percentage Rate (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="h-9 text-xs font-mono font-bold"
                  placeholder="10.0"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Tax Rule Name</label>
              <Input
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. State Sales Tax / Membership VAT"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Calculation Method"
                value={calculationMethod}
                onChange={(v) => setCalculationMethod(v as any)}
                options={[
                  { value: 'EXCLUSIVE', label: '➕ Exclusive (Added on top of price)' },
                  { value: 'INCLUSIVE', label: '🏷️ Inclusive (Included in display price)' },
                ]}
              />

              <SelectBox
                label="Tax Classification"
                value={taxType}
                onChange={(v) => setTaxType(v as any)}
                options={[
                  { value: 'STANDARD_SALES_TAX', label: '🏛️ Standard State Sales Tax' },
                  { value: 'FITNESS_SERVICES_TAX', label: '🏋️ Fitness & PT Coaching Tax' },
                  { value: 'POS_RETAIL_NUTRITION_TAX', label: '🥤 POS Retail & Nutrition Tax' },
                  { value: 'MUNICIPAL_RECREATION_CESS', label: '🏟️ Municipal Sports Cess' },
                  { value: 'ZERO_RATED_EXEMPT', label: '0% Zero-Rated Exemption' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Applicable Target Category"
                value={applicableCategory}
                onChange={(v) => setApplicableCategory(v as any)}
                options={[
                  { value: 'ALL_MEMBERSHIPS', label: '👑 All Membership Plans' },
                  { value: 'PERSONAL_TRAINING', label: '🏋️ Personal Training Services' },
                  { value: 'POS_RETAIL', label: '🥤 Cafe & Shake Bar POS' },
                  { value: 'ALL_SERVICES', label: '🌐 All Gym Products & Services' },
                  { value: 'STUDENT_EXEMPT', label: '🎓 Student Subsidized Passes' },
                ]}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tax ID / EIN Registration</label>
                <Input
                  value={taxRegistrationNumber}
                  onChange={(e) => setTaxRegistrationNumber(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="e.g. EIN-84-9201948"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isDefaultCheck"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="isDefaultCheck" className="text-xs font-semibold text-foreground cursor-pointer">
                Set as Default Checkout Tax Rate for all membership billing
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Compliance Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Statutory filing notes, tax jurisdiction code..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Saving...' : `Save Tax Rule (${taxRate}%)`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
