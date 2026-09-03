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
  CheckCircle2,
  Clock,
  Package,
  Boxes,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IPurchaseItem {
  id: string;
  _id?: string;
  code: string;
  purchaseOrderNumber: string;
  supplierCode: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  itemCount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  orderStatus: 'RECEIVED' | 'IN_TRANSIT' | 'ORDERED' | 'CANCELLED';
  receivedDate?: string;
  receivedBy?: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<IPurchaseItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'RECEIVED' | 'IN_TRANSIT' | 'ORDERED'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New PO Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [supplierCode, setSupplierCode] = useState('SUP-101');
  const [poDescription, setPoDescription] = useState('Optimum Nutrition Gold Standard Whey (24 Tubs)');
  const [itemCount, setItemCount] = useState('24');
  const [subtotal, setSubtotal] = useState('1008.00');
  const [tax, setTax] = useState('80.64');
  const [shippingCost, setShippingCost] = useState('35.00');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING'>('PAID');
  const [orderStatus, setOrderStatus] = useState<'ORDERED' | 'IN_TRANSIT' | 'RECEIVED'>('ORDERED');
  const [notes, setNotes] = useState('Restock order for front desk retail shelves.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/inventory/purchases', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPurchases(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const calculatedTotal = useMemo(() => {
    const sub = parseFloat(subtotal) || 0;
    const tx = parseFloat(tax) || 0;
    const sh = parseFloat(shippingCost) || 0;
    return Math.round((sub + tx + sh) * 100) / 100;
  }, [subtotal, tax, shippingCost]);

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return purchases;
    return purchases.filter((p) => p.orderStatus === activeTab);
  }, [purchases, activeTab]);

  const stats = useMemo(() => {
    const received = purchases.filter((p) => p.orderStatus === 'RECEIVED');
    const inTransit = purchases.filter((p) => p.orderStatus === 'IN_TRANSIT');
    const totalPurchases = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

    return {
      totalOrders: purchases.length,
      totalPurchases,
      receivedCount: received.length,
      inTransitCount: inTransit.length,
    };
  }, [purchases]);

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const supplierNames: Record<string, string> = {
        'SUP-101': 'Optimum Nutrition HQ Distributors',
        'SUP-102': 'Cellucor Sports Nutrition',
        'SUP-103': 'GreenFresh Juice Bar Co.',
        'SUP-104': 'Aesthetic Gym Apparel Group',
        'SUP-105': 'Rogue Barbell & Lifting Gear Co.',
      };

      const sName = supplierNames[supplierCode] || `Vendor #${supplierCode}`;

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/inventory/purchases', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplierCode,
          supplierName: sName,
          itemCount: parseInt(itemCount) || 1,
          subtotal: parseFloat(subtotal) || 0,
          tax: parseFloat(tax) || 0,
          shippingCost: parseFloat(shippingCost) || 0,
          totalAmount: calculatedTotal,
          currency: 'USD',
          paymentStatus,
          orderStatus,
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Purchase Order generated for ${sName}!`, {
          description: `Total: $${calculatedTotal.toFixed(2)} • Units: ${itemCount}`,
        });
        setCreateModalOpen(false);
        await loadPurchases();
      } else {
        toast.error('Failed to create purchase order');
      }
    } catch {
      toast.error('Failed to connect to purchase order service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceivePO = async (po: IPurchaseItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const poId = po._id || po.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/inventory/purchases/${poId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderStatus: 'RECEIVED',
          paymentStatus: 'PAID',
          receivedDate: new Date(),
          receivedBy: 'General Manager Chloe Bennett',
          notes: `Shipment received and checked into vault by Manager Chloe Bennett on ${new Date().toLocaleDateString()}`,
        }),
      });

      if (res.ok) {
        toast.success(`Shipment #${po.purchaseOrderNumber} Received & Stocked!`, {
          description: `${po.itemCount} units added to live inventory balance.`,
        });
        await loadPurchases();
      } else {
        toast.error('Failed to mark shipment as received');
      }
    } catch {
      toast.error('Failed to connect to procurement gateway');
    }
  };

  const columns: ColumnDef<IPurchaseItem>[] = [
    {
      accessorKey: 'purchaseOrderNumber',
      header: 'PO # & Order Date',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Badge variant="outline" className="font-mono font-bold text-[10px] bg-primary/10 text-primary border-primary/25 whitespace-nowrap">
            {row.original.purchaseOrderNumber}
          </Badge>
          <span className="text-[10px] text-muted-foreground block">
            {new Date(row.original.orderDate).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'supplierName',
      header: 'Supplier / Vendor',
      size: 240,
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.supplierName}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono block">
            #{row.original.supplierCode}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'itemCount',
      header: 'Units Ordered',
      size: 140,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs px-2 py-0.5 font-mono font-bold bg-muted/40 text-foreground whitespace-nowrap">
          {row.original.itemCount} Units
        </Badge>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Procurement Cost',
      size: 210,
      cell: ({ row }) => (
        <div className="space-y-0.5 font-mono">
          <span className="font-extrabold text-xs text-emerald-600 block">
            ${row.original.totalAmount?.toFixed(2)} USD
          </span>
          <span className="text-[10px] text-muted-foreground block font-sans">
            Subtotal: ${row.original.subtotal?.toFixed(2)} • Ship: ${row.original.shippingCost?.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'orderStatus',
      header: 'Shipment Status',
      size: 170,
      cell: ({ row }) => {
        const st = row.original.orderStatus;
        if (st === 'RECEIVED') {
          return (
            <div className="space-y-0.5">
              <Badge variant="success" className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-600 whitespace-nowrap px-2.5 py-0.5">
                <CheckCircle2 className="h-3 w-3" />
                <span>Received</span>
              </Badge>
              <span className="text-[10px] text-muted-foreground block truncate">By {row.original.receivedBy}</span>
            </div>
          );
        }
        if (st === 'IN_TRANSIT') {
          return (
            <div className="space-y-0.5">
              <Badge variant="warning" className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5">
                <Clock className="h-3 w-3" />
                <span>In Transit</span>
              </Badge>
              <span className="text-[10px] text-amber-600 font-semibold block truncate">FedEx Ground</span>
            </div>
          );
        }
        return (
          <Badge variant="secondary" className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap px-2 py-0.5">
            <span>Ordered</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      size: 130,
      cell: ({ row }) => (
        <Badge
          variant={row.original.paymentStatus === 'PAID' ? 'outline' : 'warning'}
          className={`text-xs font-mono font-bold whitespace-nowrap px-2 py-0.5 ${
            row.original.paymentStatus === 'PAID' ? 'text-emerald-600 border-emerald-500/30' : ''
          }`}
        >
          {row.original.paymentStatus}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 160,
      cell: ({ row }) => {
        const isTransit = row.original.orderStatus === 'IN_TRANSIT' || row.original.orderStatus === 'ORDERED';
        return (
          <div className="flex items-center gap-1.5">
            {isTransit ? (
              <Button
                size="sm"
                onClick={() => handleReceivePO(row.original)}
                className="h-7 px-2.5 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                title="Confirm & Receive Shipment"
              >
                <Boxes className="h-3.5 w-3.5" />
                <span>Receive</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success(`Exporting Purchase Voucher #${row.original.purchaseOrderNumber}`);
                }}
                className="h-7 px-2 text-xs gap-1 shadow-xs"
                title="View PO Invoice"
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
        title="Inventory & Purchase Orders (Procurement)"
        subtitle="Manage wholesale vendor purchase orders, incoming carrier shipments, receiving dock checklists, and inventory restock batches."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Create Purchase Order</span>
            </Button>
          </div>
        }
      />

      {/* PO Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Procurement Spend"
          value={`$${stats.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change={`${stats.totalOrders} Cumulative POs`}
          trend="up"
          timeframe="Wholesale inventory spend"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Received Shipments"
          value={`${stats.receivedCount} Shipments`}
          change="Stocked in vault"
          trend="up"
          timeframe="Checked into retail"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="In-Transit Orders"
          value={`${stats.inTransitCount} Shipments`}
          change="Carrier transit"
          trend="up"
          timeframe="Expected delivery 48h"
          icon={<Truck className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Avg Lead Time"
          value="2.4 Days"
          change="Express freight delivery"
          trend="up"
          timeframe="Supplier response time"
          icon={<Clock className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Orders', count: stats.totalOrders },
          { key: 'RECEIVED', label: '🟢 Fully Received', count: stats.receivedCount },
          { key: 'IN_TRANSIT', label: '🟡 In Transit', count: stats.inTransitCount },
          { key: 'ORDERED', label: '📦 Placed Orders', count: purchases.filter((p) => p.orderStatus === 'ORDERED').length },
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
        loading={loading}
        searchPlaceholder="Search purchases by PO #, supplier name, code..."
      />

      {/* Create Purchase Order Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>Generate Purchase Order (PO)</span>
            </DialogTitle>
            <DialogDescription>
              Place wholesale inventory orders with registered suppliers and schedule receiving delivery.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePO} className="space-y-4 py-2">
            <SelectBox
              label="Select Wholesale Supplier"
              value={supplierCode}
              onChange={setSupplierCode}
              options={[
                { value: 'SUP-101', label: '🥛 Optimum Nutrition HQ (#SUP-101 • Net 30)' },
                { value: 'SUP-102', label: '⚡ Cellucor Sports Nutrition (#SUP-102 • Net 30)' },
                { value: 'SUP-103', label: '🧃 GreenFresh Juice Bar Co. (#SUP-103 • Net 15)' },
                { value: 'SUP-104', label: '👕 Aesthetic Gym Apparel Group (#SUP-104 • Prepaid)' },
                { value: 'SUP-105', label: '🎒 Rogue Barbell & Lifting Gear (#SUP-105 • Net 30)' },
              ]}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Order Items & Description</label>
              <Input
                value={poDescription}
                onChange={(e) => setPoDescription(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. 24x Whey Gold Tubs, 12x Creatine Powders"
                required
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-foreground">Total Units</label>
                <Input
                  type="number"
                  value={itemCount}
                  onChange={(e) => setItemCount(e.target.value)}
                  className="h-8 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-foreground">Subtotal ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                  className="h-8 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-foreground">Tax ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-foreground">Shipping ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
              <span className="font-bold text-xs text-foreground">Total Purchase Order Amount:</span>
              <span className="font-mono font-extrabold text-base text-emerald-600">
                ${calculatedTotal.toFixed(2)} USD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Shipment Initial Status"
                value={orderStatus}
                onChange={(v) => setOrderStatus(v as any)}
                options={[
                  { value: 'ORDERED', label: '📦 Placed Order (Sent to Vendor)' },
                  { value: 'IN_TRANSIT', label: '🚚 In Transit (Dispatched)' },
                  { value: 'RECEIVED', label: '🟢 Received & Checked into Vault' },
                ]}
              />

              <SelectBox
                label="Invoice Payment Status"
                value={paymentStatus}
                onChange={(v) => setPaymentStatus(v as any)}
                options={[
                  { value: 'PAID', label: '💳 Paid / Settled' },
                  { value: 'PENDING', label: '⏳ Pending Invoiced (Net 30)' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Receiving Dock Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Pallet delivery instructions, expiration batch notes..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Generating...' : `Authorize PO ($${calculatedTotal.toFixed(2)})`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
