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
  Package,
  Plus,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Barcode,
  Truck,
  Layers,
  ArrowUpRight,
  Boxes,
  Eye,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IProductItem {
  id?: string;
  _id?: string;
  code: string;
  name: string;
  sku: string;
  barcode?: string;
  category: 'SUPPLEMENTS' | 'BEVERAGES' | 'APPAREL' | 'ACCESSORIES' | 'SNACKS' | 'PASSES';
  price: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  supplier: string;
  unit: string;
  icon?: string;
  description?: string;
  status: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'SUPPLEMENTS' | 'BEVERAGES' | 'APPAREL' | 'ACCESSORIES'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Product Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('Optimum Nutrition Micronized Creatine Powder (600g)');
  const [sku, setSku] = useState('SKU-CREAT-600G');
  const [barcode, setBarcode] = useState('8901029387');
  const [category, setCategory] = useState<'SUPPLEMENTS' | 'BEVERAGES' | 'APPAREL' | 'ACCESSORIES' | 'SNACKS' | 'PASSES'>('SUPPLEMENTS');
  const [price, setPrice] = useState('34.99');
  const [costPrice, setCostPrice] = useState('19.50');
  const [stockQuantity, setStockQuantity] = useState('30');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [unit, setUnit] = useState('Tub (120 Servings)');
  const [supplier, setSupplier] = useState('Optimum Nutrition HQ');
  const [icon, setIcon] = useState('🥛');
  const [description, setDescription] = useState('100% pure micronized creatine monohydrate for strength & ATP power.');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Quick Restock Modal State
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProductItem | null>(null);
  const [restockQty, setRestockQty] = useState('24');
  const [supplierInvoice, setSupplierInvoice] = useState('PO-2026-AUG-88');
  const [submittingRestock, setSubmittingRestock] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('http://localhost:5000/api/v1/inventory/products', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const calculatedMargin = useMemo(() => {
    const p = parseFloat(price) || 0;
    const c = parseFloat(costPrice) || 0;
    const profit = Math.max(0, p - c);
    const marginPct = p > 0 ? (profit / p) * 100 : 0;
    return {
      profit: profit.toFixed(2),
      percent: marginPct.toFixed(1),
    };
  }, [price, costPrice]);

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return products;
    return products.filter((p) => p.category === activeTab);
  }, [products, activeTab]);

  const stats = useMemo(() => {
    const totalValuation = products.reduce((sum, p) => sum + (p.price || 0) * (p.stockQuantity || 0), 0);
    const totalUnits = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
    const lowStockItems = products.filter((p) => (p.stockQuantity || 0) <= (p.lowStockThreshold || 10));

    const totalProfitPool = products.reduce((sum, p) => sum + ((p.price || 0) - (p.costPrice || 0)) * (p.stockQuantity || 0), 0);
    const avgMargin = totalValuation > 0 ? ((totalProfitPool / totalValuation) * 100).toFixed(1) : '40.0';

    return {
      totalSKUs: products.length,
      totalValuation,
      totalUnits,
      lowStockCount: lowStockItems.length,
      avgMargin,
    };
  }, [products]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProduct(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const res = await fetch('http://localhost:5000/api/v1/inventory/products', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          sku: sku.toUpperCase(),
          barcode,
          category,
          price: parseFloat(price) || 0,
          costPrice: parseFloat(costPrice) || 0,
          stockQuantity: parseInt(stockQuantity) || 0,
          lowStockThreshold: parseInt(lowStockThreshold) || 10,
          unit,
          supplier,
          icon,
          description,
          status: 'active',
        }),
      });

      if (res.ok) {
        toast.success(`Product ${name} added to catalog!`, {
          description: `SKU: ${sku.toUpperCase()} • Price: $${price} (${calculatedMargin.percent}% margin)`,
        });
        setCreateModalOpen(false);
        await loadProducts();
      } else {
        toast.error('Failed to create product');
      }
    } catch {
      toast.error('Failed to connect to inventory service');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmittingRestock(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const prodId = selectedProduct._id || selectedProduct.id;
      const additionalUnits = parseInt(restockQty) || 0;
      const newStock = (selectedProduct.stockQuantity || 0) + additionalUnits;

      const res = await fetch(`http://localhost:5000/api/v1/inventory/products/${prodId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockQuantity: newStock,
        }),
      });

      if (res.ok) {
        toast.success(`Restocked ${additionalUnits} units for ${selectedProduct.name}!`, {
          description: `Total Stock in Vault: ${newStock} Units • Invoice: ${supplierInvoice}`,
        });
        setRestockModalOpen(false);
        await loadProducts();
      } else {
        toast.error('Failed to restock product');
      }
    } catch {
      toast.error('Failed to connect to inventory gateway');
    } finally {
      setSubmittingRestock(false);
    }
  };

  const columns: ColumnDef<IProductItem>[] = [
    {
      accessorKey: 'name',
      header: 'Product Name & Packaging',
      size: 260,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center text-lg shrink-0 border border-border/70">
            {row.original.icon || '📦'}
          </div>
          <div className="truncate">
            <span className="font-semibold text-xs text-foreground block truncate">
              {row.original.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold bg-muted/40 text-foreground whitespace-nowrap">
                {row.original.unit || 'Unit'}
              </Badge>
              <span className="text-[10px] text-muted-foreground truncate">
                {row.original.supplier}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'sku',
      header: 'SKU Code & Barcode',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Badge variant="outline" className="font-mono font-bold text-[10px] bg-primary/10 text-primary border-primary/25 whitespace-nowrap">
            {row.original.sku}
          </Badge>
          {row.original.barcode && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
              <Barcode className="h-3 w-3" />
              <span>{row.original.barcode}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 160,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-semibold bg-muted/30 text-foreground uppercase whitespace-nowrap">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Pricing & Gross Margin',
      size: 210,
      cell: ({ row }) => {
        const p = row.original.price || 0;
        const c = row.original.costPrice || 0;
        const margin = p > 0 ? (((p - c) / p) * 100).toFixed(0) : '0';
        return (
          <div className="space-y-0.5 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-foreground block">
                ${p.toFixed(2)}
              </span>
              <Badge variant="outline" className="text-[9px] px-1 py-0 font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/25">
                +{margin}% Margin
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground block font-sans">
              Cost: ${c.toFixed(2)} • Profit: ${(p - c).toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'stockQuantity',
      header: 'Inventory Level',
      size: 190,
      cell: ({ row }) => {
        const qty = row.original.stockQuantity;
        const low = row.original.lowStockThreshold || 10;
        if (qty <= low) {
          return (
            <div className="space-y-0.5">
              <Badge variant="destructive" className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap px-2 py-0.5">
                <AlertTriangle className="h-3 w-3" />
                <span>{qty} Units (Low Stock)</span>
              </Badge>
              <span className="text-[10px] text-rose-500 font-semibold block">Reorder point: {low}</span>
            </div>
          );
        }
        return (
          <div className="space-y-0.5">
            <Badge variant="success" className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2 py-0.5">
              <CheckCircle2 className="h-3 w-3" />
              <span>{qty} Units in Stock</span>
            </Badge>
            <span className="text-[10px] text-muted-foreground block font-mono">
              Valuation: ${(qty * row.original.price).toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 160,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={() => {
              setSelectedProduct(row.original);
              setRestockModalOpen(true);
            }}
            className="h-7 px-2.5 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
            title="Fast Restock Inventory"
          >
            <Boxes className="h-3.5 w-3.5" />
            <span>Restock</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inventory & Product Master SKUs"
        subtitle="Manage gym supplements, protein smoothies, athletic apparel, deadlift straps, barcode SKU tracking, and profit margins."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product SKU</span>
            </Button>
          </div>
        }
      />

      {/* Inventory KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Inventory Valuation"
          value={`$${stats.totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change={`${stats.totalUnits} Units in stock`}
          trend="up"
          timeframe="Retail goods & supplements"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Active Product SKUs"
          value={`${stats.totalSKUs} Items`}
          change="Across all categories"
          trend="up"
          timeframe="Retail catalog"
          icon={<Package className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Avg Profit Margin"
          value={`+${stats.avgMargin}%`}
          change="Cost vs Retail Price"
          trend="up"
          timeframe="Retail markup health"
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="Low Stock Reorders"
          value={`${stats.lowStockCount} Reorder`}
          change="Below safety buffer"
          trend={stats.lowStockCount > 0 ? 'down' : 'neutral'}
          timeframe="Immediate restock required"
          icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Products', count: stats.totalSKUs },
          { key: 'SUPPLEMENTS', label: '🥛 Supplements & Protein', count: products.filter((p) => p.category === 'SUPPLEMENTS').length },
          { key: 'BEVERAGES', label: '🥤 Smoothies & Drinks', count: products.filter((p) => p.category === 'BEVERAGES').length },
          { key: 'APPAREL', label: '👕 Apparel & Merch', count: products.filter((p) => p.category === 'APPAREL').length },
          { key: 'ACCESSORIES', label: '🎒 Gear & Accessories', count: products.filter((p) => p.category === 'ACCESSORIES').length },
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
        searchPlaceholder="Search products by name, SKU, barcode, supplier..."
      />

      {/* Add Product Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span>Add New Product SKU</span>
            </DialogTitle>
            <DialogDescription>
              Create inventory item with SKU, retail selling price, cost basis, profit margins, and reorder levels.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProduct} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Product Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Optimum Nutrition Gold Standard Whey 5lb"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Product Category"
                value={category}
                onChange={(v) => setCategory(v as any)}
                options={[
                  { value: 'SUPPLEMENTS', label: '🥛 Supplements & Nutrition' },
                  { value: 'BEVERAGES', label: '🥤 Smoothies & Energy Drinks' },
                  { value: 'APPAREL', label: '👕 Gym Apparel & Merch' },
                  { value: 'ACCESSORIES', label: '🎒 Lifting Gear & Shakers' },
                  { value: 'SNACKS', label: '🍫 Protein Bars & Snacks' },
                  { value: 'PASSES', label: '🎟️ Drop-in Passes' },
                ]}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Packaging Unit</label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. 5 lb Tub / Bottle"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">SKU Code</label>
                <Input
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  className="h-9 text-xs font-mono font-bold uppercase"
                  placeholder="e.g. SKU-WHEY-5LB"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Barcode / EAN</label>
                <Input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="e.g. 8901029381"
                />
              </div>
            </div>

            {/* Price & Margin Calculation Box */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-foreground">Retail Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-8 text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-foreground">Cost Basis ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="h-8 text-xs font-mono text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-foreground">Initial Stock</label>
                  <Input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-foreground">Reorder Min</label>
                  <Input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">Gross Profit Margin:</span>
                <span className="font-mono font-extrabold text-sm text-emerald-600">
                  +${calculatedMargin.profit} ({calculatedMargin.percent}% Profit Margin)
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Supplier / Distributor</label>
              <Input
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Optimum Nutrition HQ"
                required
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submittingProduct} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submittingProduct ? 'Saving...' : `Save Product ($${price})`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Restock Modal */}
      <Dialog open={restockModalOpen} onOpenChange={setRestockModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <Boxes className="h-5 w-5" />
              <span>Fast Restock Inventory Vault</span>
            </DialogTitle>
            <DialogDescription>
              Record incoming shipments and update live stock quantity for the front desk.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <form onSubmit={handleRestock} className="space-y-4 py-2">
              <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">{selectedProduct.name}</span>
                  <span className="text-[11px] text-muted-foreground font-mono">SKU: {selectedProduct.sku}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Current Stock</span>
                  <span className="font-mono font-extrabold text-sm text-foreground">
                    {selectedProduct.stockQuantity} Units
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Additional Incoming Units</label>
                <Input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="h-9 text-xs font-mono font-bold"
                  placeholder="24"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Supplier Purchase Invoice Ref</label>
                <Input
                  value={supplierInvoice}
                  onChange={(e) => setSupplierInvoice(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="e.g. PO-2026-AUG-88"
                />
              </div>

              <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setRestockModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submittingRestock} className="gap-1.5 font-bold shadow-md shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Boxes className="h-4 w-4" />
                  <span>{submittingRestock ? 'Updating...' : `Add +${restockQty} Units`}</span>
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
