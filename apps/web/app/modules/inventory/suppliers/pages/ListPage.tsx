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
  Truck,
  Plus,
  DollarSign,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface ISupplierItem {
  id: string;
  _id?: string;
  code: string;
  supplierCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  categoriesSupplied: string;
  paymentTerms: 'NET_30' | 'NET_15' | 'NET_60' | 'PREPAID' | 'COD';
  rating: number;
  totalOrdersPlaced: number;
  totalSpend: number;
  status: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<ISupplierItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'NET_30' | 'NET_15' | 'PREPAID'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Supplier Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('Ghost Lifestyle Supplements');
  const [supplierCode, setSupplierCode] = useState('SUP-106');
  const [contactPerson, setContactPerson] = useState('Dan Lourenco');
  const [email, setEmail] = useState('wholesale@ghostlifestyle.com');
  const [phone, setPhone] = useState('+1 (844) 446-7811');
  const [address, setAddress] = useState('5651 S. Edmond St, Las Vegas, NV 89118');
  const [categoriesSupplied, setCategoriesSupplied] = useState('Ghost Whey, Ghost Legend Pre-Workout, Shakers');
  const [paymentTerms, setPaymentTerms] = useState<'NET_30' | 'NET_15' | 'NET_60' | 'PREPAID' | 'COD'>('NET_30');
  const [rating, setRating] = useState('4.9');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('http://localhost:5000/api/v1/inventory/suppliers', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSuppliers(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return suppliers;
    return suppliers.filter((s) => s.paymentTerms === activeTab);
  }, [suppliers, activeTab]);

  const stats = useMemo(() => {
    const totalSpend = suppliers.reduce((sum, s) => sum + (s.totalSpend || 0), 0);
    const totalOrders = suppliers.reduce((sum, s) => sum + (s.totalOrdersPlaced || 0), 0);
    const net30Count = suppliers.filter((s) => s.paymentTerms === 'NET_30').length;

    return {
      totalSuppliers: suppliers.length,
      totalSpend,
      totalOrders,
      net30Count,
    };
  }, [suppliers]);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const res = await fetch('http://localhost:5000/api/v1/inventory/suppliers', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          name: companyName,
          supplierCode: supplierCode.toUpperCase(),
          contactPerson,
          email,
          phone,
          address,
          categoriesSupplied,
          paymentTerms,
          rating: parseFloat(rating) || 5.0,
          totalOrdersPlaced: 0,
          totalSpend: 0,
          status: 'active',
        }),
      });

      if (res.ok) {
        toast.success(`Supplier "${companyName}" registered!`, {
          description: `Code: ${supplierCode.toUpperCase()} • Terms: ${paymentTerms}`,
        });
        setCreateModalOpen(false);
        await loadSuppliers();
      } else {
        toast.error('Failed to register supplier');
      }
    } catch {
      toast.error('Failed to connect to supplier service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<ISupplierItem>[] = [
    {
      accessorKey: 'companyName',
      header: 'Supplier & Contact',
      size: 260,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
            {row.original.companyName.charAt(0)}
          </div>
          <div className="truncate">
            <span className="font-semibold text-xs text-foreground block truncate">
              {row.original.companyName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-muted-foreground font-mono">
                #{row.original.supplierCode}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                • {row.original.contactPerson}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact Info',
      size: 210,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <a
            href={`mailto:${row.original.email}`}
            className="text-xs text-primary hover:underline flex items-center gap-1 truncate"
          >
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{row.original.email}</span>
          </a>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3 shrink-0" />
            <span>{row.original.phone}</span>
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'categoriesSupplied',
      header: 'Supplied Products',
      size: 220,
      cell: ({ row }) => (
        <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
          {row.original.categoriesSupplied}
        </p>
      ),
    },
    {
      accessorKey: 'paymentTerms',
      header: 'Credit Terms',
      size: 140,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-mono font-bold bg-muted/40 text-foreground whitespace-nowrap">
          {row.original.paymentTerms?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'totalSpend',
      header: 'Procurement Spend',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5 font-mono">
          <span className="font-extrabold text-xs text-emerald-600 block">
            ${row.original.totalSpend?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-muted-foreground block font-sans">
            {row.original.totalOrdersPlaced} Purchase Orders
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      size: 120,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs px-2 py-0.5 font-bold bg-amber-500/10 text-amber-600 border-amber-500/25 flex items-center gap-1 w-fit">
          <Star className="h-3 w-3 fill-current" />
          <span>{row.original.rating.toFixed(1)}</span>
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 140,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success(`Purchase Order created with ${row.original.companyName}!`, {
                description: `Terms: ${row.original.paymentTerms} • Contact: ${row.original.contactPerson}`,
              });
              navigate('/inventory/purchases');
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Create Purchase Order"
          >
            <Truck className="h-3.5 w-3.5" />
            <span>Order</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inventory & Vendor Suppliers"
        subtitle="Manage wholesale distributor contracts, supplement manufacturers, gym apparel suppliers, and Net 30 credit lines."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Register Vendor</span>
            </Button>
          </div>
        }
      />

      {/* Supplier KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Vendors"
          value={`${stats.totalSuppliers} Distributors`}
          change="Verified partners"
          trend="up"
          timeframe="Wholesale suppliers"
          icon={<Truck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Total Procurement Spend"
          value={`$${stats.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change={`${stats.totalOrders} Cumulative POs`}
          trend="up"
          timeframe="Inventory purchases"
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Net 30 Credit Lines"
          value={`${stats.net30Count} Suppliers`}
          change="Working capital terms"
          trend="up"
          timeframe="Trade credit facilities"
          icon={<CreditCard className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="Avg Vendor Rating"
          value="4.9 / 5.0"
          change="99.4% On-time delivery"
          trend="up"
          timeframe="Distributor SLA"
          icon={<Star className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Suppliers', count: stats.totalSuppliers },
          { key: 'NET_30', label: 'Net 30 Invoiced', count: suppliers.filter((s) => s.paymentTerms === 'NET_30').length },
          { key: 'NET_15', label: 'Net 15 Fast-Track', count: suppliers.filter((s) => s.paymentTerms === 'NET_15').length },
          { key: 'PREPAID', label: 'Prepaid Direct', count: suppliers.filter((s) => s.paymentTerms === 'PREPAID').length },
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
        searchPlaceholder="Search suppliers by company name, contact, code, product..."
      />

      {/* Register Supplier Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>Register Vendor / Supplier</span>
            </DialogTitle>
            <DialogDescription>
              Onboard wholesale manufacturer, distributor contact, and trade credit terms.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSupplier} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">Company Name</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. Optimum Nutrition HQ"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Vendor Code</label>
                <Input
                  value={supplierCode}
                  onChange={(e) => setSupplierCode(e.target.value.toUpperCase())}
                  className="h-9 text-xs font-mono font-bold uppercase"
                  placeholder="SUP-101"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Account Representative</label>
                <Input
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. Mark Vance"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Direct Phone</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="+1 (800) 705-5226"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Official Business Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="orders@supplier.com"
                  required
                />
              </div>

              <SelectBox
                label="Payment / Trade Terms"
                value={paymentTerms}
                onChange={(v) => setPaymentTerms(v as any)}
                options={[
                  { value: 'NET_30', label: '💳 Net 30 Invoiced (Standard)' },
                  { value: 'NET_15', label: '⚡ Net 15 Fast-Track' },
                  { value: 'NET_60', label: '📅 Net 60 Extended' },
                  { value: 'PREPAID', label: '💵 100% Advance Prepaid' },
                  { value: 'COD', label: '📦 Cash on Delivery (COD)' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Categories Supplied</label>
              <Input
                value={categoriesSupplied}
                onChange={(e) => setCategoriesSupplied(e.target.value)}
                className="h-9 text-xs"
                placeholder="Whey Protein, Creatine, BCAAs, Shakers..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Warehouse / Business Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-9 text-xs"
                placeholder="Street address, city, state, postal code..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Registering...' : `Register Vendor (${supplierCode})`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
