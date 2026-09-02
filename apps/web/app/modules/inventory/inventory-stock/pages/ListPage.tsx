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
  Boxes,
  Plus,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IStockItem {
  id: string;
  _id?: string;
  code: string;
  stockCode: string;
  productName: string;
  sku: string;
  category: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  reorderLevel: number;
  reorderQuantity: number;
  warehouseLocation: string;
  lastRestockedDate: string;
  stockHealth: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK';
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [stockList, setStockList] = useState<IStockItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Quick Adjustment Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<IStockItem | null>(null);
  const [newOnHand, setNewOnHand] = useState('36');
  const [newReserved, setNewReserved] = useState('4');
  const [location, setLocation] = useState('Main Vault • Bay 1 (Shelf A-02)');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/inventory/inventory', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setStockList(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return stockList;
    return stockList.filter((s) => s.stockHealth === activeTab);
  }, [stockList, activeTab]);

  const stats = useMemo(() => {
    const totalOnHand = stockList.reduce((sum, s) => sum + (s.quantityOnHand || 0), 0);
    const totalAvailable = stockList.reduce((sum, s) => sum + (s.quantityAvailable || 0), 0);
    const totalReserved = stockList.reduce((sum, s) => sum + (s.quantityReserved || 0), 0);
    const lowCount = stockList.filter((s) => s.stockHealth === 'LOW_STOCK' || s.stockHealth === 'CRITICAL').length;

    return {
      totalSKUs: stockList.length,
      totalOnHand,
      totalAvailable,
      totalReserved,
      lowCount,
    };
  }, [stockList]);

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const stId = selectedStock._id || selectedStock.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/inventory/inventory/${stId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantityOnHand: parseInt(newOnHand) || 0,
          quantityReserved: parseInt(newReserved) || 0,
          warehouseLocation: location,
        }),
      });

      if (res.ok) {
        toast.success(`Inventory Stock Updated for ${selectedStock.productName}!`, {
          description: `On Hand: ${newOnHand} • Available: ${Math.max(0, parseInt(newOnHand) - parseInt(newReserved))} Units`,
        });
        setAdjustModalOpen(false);
        await loadStock();
      } else {
        toast.error('Failed to update stock');
      }
    } catch {
      toast.error('Failed to connect to inventory stock service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IStockItem>[] = [
    {
      accessorKey: 'productName',
      header: 'Product Name & Category',
      size: 260,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.productName}
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold bg-muted/40 text-foreground uppercase whitespace-nowrap">
              {row.original.category}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-mono">
              #{row.original.stockCode}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'sku',
      header: 'SKU Code',
      size: 160,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono font-bold text-[10px] bg-primary/10 text-primary border-primary/25 whitespace-nowrap">
          {row.original.sku}
        </Badge>
      ),
    },
    {
      accessorKey: 'warehouseLocation',
      header: 'Warehouse / Shelf Location',
      size: 220,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs text-foreground truncate">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">{row.original.warehouseLocation}</span>
        </div>
      ),
    },
    {
      accessorKey: 'quantityOnHand',
      header: 'On-Hand / Reserved',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-foreground">
              {row.original.quantityOnHand} On Hand
            </span>
            {row.original.quantityReserved > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold">
                ({row.original.quantityReserved} Rsvd)
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block font-sans">
            ⚡ {row.original.quantityAvailable} Available to Sell
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'stockHealth',
      header: 'Stock Health',
      size: 160,
      cell: ({ row }) => {
        const st = row.original.stockHealth;
        if (st === 'OPTIMAL') {
          return (
            <Badge variant="success" className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2.5 py-0.5">
              <CheckCircle2 className="h-3 w-3" />
              <span>Optimal Stock</span>
            </Badge>
          );
        }
        if (st === 'LOW_STOCK') {
          return (
            <Badge variant="warning" className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
              <AlertTriangle className="h-3 w-3" />
              <span>Low Stock</span>
            </Badge>
          );
        }
        return (
          <Badge variant="destructive" className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
            <span>Critical Stockout</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: 'lastRestockedDate',
      header: 'Last Restocked',
      size: 140,
      cell: ({ row }) => (
        <span className="text-xs text-foreground font-mono block">
          {new Date(row.original.lastRestockedDate).toLocaleDateString()}
        </span>
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
              setSelectedStock(row.original);
              setNewOnHand(row.original.quantityOnHand.toString());
              setNewReserved(row.original.quantityReserved.toString());
              setLocation(row.original.warehouseLocation);
              setAdjustModalOpen(true);
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Adjust Stock & Location"
          >
            <Boxes className="h-3.5 w-3.5" />
            <span>Adjust</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inventory & Live Stock Balances"
        subtitle="Real-time multi-location warehouse inventory tracking, reserved quantities for pending orders, and restock buffer telemetry."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => navigate('/inventory/products')}
            >
              <Package className="h-4 w-4" />
              <span>Manage Products</span>
            </Button>
          </div>
        }
      />

      {/* Stock Health Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Units On-Hand"
          value={`${stats.totalOnHand} Units`}
          change="Across all shelves"
          trend="up"
          timeframe="Vault physical inventory"
          icon={<Boxes className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Available to Sell"
          value={`${stats.totalAvailable} Units`}
          change={`${stats.totalReserved} Units reserved`}
          trend="up"
          timeframe="Live POS checkout pool"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Low Stock Warnings"
          value={`${stats.lowCount} SKUs`}
          change="At or below buffer"
          trend={stats.lowCount > 0 ? 'down' : 'neutral'}
          timeframe="Procurement alert"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Inventory Accuracy"
          value="99.8%"
          change="Physical count vs ERP"
          trend="up"
          timeframe="Cycle count audit"
          icon={<ShieldCheck className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Stock Items', count: stats.totalSKUs },
          { key: 'OPTIMAL', label: '🟢 Optimal Levels', count: stockList.filter((s) => s.stockHealth === 'OPTIMAL').length },
          { key: 'LOW_STOCK', label: '🟡 Low Stock (<Min)', count: stats.lowCount },
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
        searchPlaceholder="Search stock by product, SKU, location..."
      />

      {/* Adjust Stock Modal */}
      <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" />
              <span>Adjust Stock & Location</span>
            </DialogTitle>
            <DialogDescription>
              Update physical on-hand quantity, reserved units, and bin location.
            </DialogDescription>
          </DialogHeader>

          {selectedStock && (
            <form onSubmit={handleUpdateStock} className="space-y-4 py-2">
              <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">{selectedStock.productName}</span>
                  <span className="text-[11px] text-muted-foreground font-mono">SKU: {selectedStock.sku}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Current Available</span>
                  <span className="font-mono font-extrabold text-sm text-emerald-600">
                    {selectedStock.quantityAvailable} Units
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total On-Hand</label>
                  <Input
                    type="number"
                    value={newOnHand}
                    onChange={(e) => setNewOnHand(e.target.value)}
                    className="h-9 text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reserved Units</label>
                  <Input
                    type="number"
                    value={newReserved}
                    onChange={(e) => setNewReserved(e.target.value)}
                    className="h-9 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Storage / Warehouse Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. Retail Vault • Bay 1 (Shelf A-02)"
                  required
                />
              </div>

              <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setAdjustModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{submitting ? 'Updating...' : 'Save Stock Update'}</span>
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
