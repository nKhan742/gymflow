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
  FileDiff,
  Plus,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Trash2,
  Boxes,
  Package,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IStockAdjustmentItem {
  id: string;
  _id?: string;
  code: string;
  adjustmentCode: string;
  productName: string;
  sku: string;
  adjustmentType: 'INCREASE' | 'DECREASE' | 'DAMAGE_WRITE_OFF' | 'EXPIRED_BATCH' | 'THEFT_LOSS' | 'CYCLE_COUNT_CORRECTION';
  previousQuantity: number;
  adjustedQuantity: number;
  finalQuantity: number;
  reason: string;
  adjustedDate: string;
  adjustedBy: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [adjustments, setAdjustments] = useState<IStockAdjustmentItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'DAMAGE_WRITE_OFF' | 'EXPIRED_BATCH' | 'CYCLE_COUNT_CORRECTION' | 'THEFT_LOSS'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Adjustment Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [productName, setProductName] = useState('Optimum Nutrition Gold Standard Whey (5 lbs)');
  const [sku, setSku] = useState('SKU-WHEY-5LB');
  const [adjustmentType, setAdjustmentType] = useState<'INCREASE' | 'DECREASE' | 'DAMAGE_WRITE_OFF' | 'EXPIRED_BATCH' | 'THEFT_LOSS' | 'CYCLE_COUNT_CORRECTION'>('DAMAGE_WRITE_OFF');
  const [previousQuantity, setPreviousQuantity] = useState('36');
  const [adjustedQuantity, setAdjustedQuantity] = useState('-2');
  const [reason, setReason] = useState('Container plastic tub seal broken during shelf stocking.');
  const [notes, setNotes] = useState('Damaged unit disposed of per safety protocols.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAdjustments();
  }, []);

  const loadAdjustments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/inventory/stock-adjustment', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAdjustments(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const calculatedFinal = useMemo(() => {
    const prev = parseInt(previousQuantity) || 0;
    const adj = parseInt(adjustedQuantity) || 0;
    return Math.max(0, prev + adj);
  }, [previousQuantity, adjustedQuantity]);

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return adjustments;
    return adjustments.filter((a) => a.adjustmentType === activeTab);
  }, [adjustments, activeTab]);

  const stats = useMemo(() => {
    const damages = adjustments.filter((a) => a.adjustmentType === 'DAMAGE_WRITE_OFF' || a.adjustmentType === 'EXPIRED_BATCH');
    const shrinkages = adjustments.filter((a) => a.adjustmentType === 'THEFT_LOSS');
    const corrections = adjustments.filter((a) => a.adjustmentType === 'CYCLE_COUNT_CORRECTION');

    return {
      totalAudits: adjustments.length,
      damageCount: damages.length,
      theftCount: shrinkages.length,
      correctionCount: corrections.length,
    };
  }, [adjustments]);

  const handleCreateAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/inventory/stock-adjustment', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          sku,
          adjustmentType,
          previousQuantity: parseInt(previousQuantity) || 0,
          adjustedQuantity: parseInt(adjustedQuantity) || 0,
          finalQuantity: calculatedFinal,
          reason,
          adjustedBy: 'General Manager Chloe Bennett',
          notes,
        }),
      });

      if (res.ok) {
        toast.success(`Stock Adjustment Logged for ${productName}!`, {
          description: `Variance: ${adjustedQuantity} Units • Final Stock: ${calculatedFinal} Units`,
        });
        setCreateModalOpen(false);
        await loadAdjustments();
      } else {
        toast.error('Failed to log stock adjustment');
      }
    } catch {
      toast.error('Failed to connect to stock adjustment service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IStockAdjustmentItem>[] = [
    {
      accessorKey: 'adjustmentCode',
      header: 'Audit Ref & Date',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Badge variant="outline" className="font-mono font-bold text-[10px] bg-primary/10 text-primary border-primary/25 whitespace-nowrap">
            {row.original.adjustmentCode}
          </Badge>
          <span className="text-[10px] text-muted-foreground block">
            {new Date(row.original.adjustedDate).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'productName',
      header: 'Product Name & SKU',
      size: 260,
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.productName}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono block">
            SKU: {row.original.sku}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'adjustmentType',
      header: 'Audit Classification',
      size: 210,
      cell: ({ row }) => {
        const t = row.original.adjustmentType;
        if (t === 'DAMAGE_WRITE_OFF' || t === 'EXPIRED_BATCH') {
          return (
            <Badge variant="destructive" className="text-[10px] font-semibold uppercase whitespace-nowrap px-2 py-0.5">
              💥 {t?.replace(/_/g, ' ') || 'WRITE OFF'}
            </Badge>
          );
        }
        if (t === 'THEFT_LOSS') {
          return (
            <Badge variant="warning" className="text-[10px] font-semibold uppercase whitespace-nowrap px-2 py-0.5">
              ⚠️ {t?.replace(/_/g, ' ') || 'LOSS'}
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="text-[10px] font-semibold uppercase bg-muted/40 text-foreground whitespace-nowrap px-2 py-0.5">
            🔍 {t?.replace(/_/g, ' ') || 'AUDIT'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'adjustedQuantity',
      header: 'Quantity Variance',
      size: 190,
      cell: ({ row }) => {
        const isNegative = row.original.adjustedQuantity < 0;
        return (
          <div className="space-y-0.5 font-mono">
            <span className={`font-extrabold text-xs block ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
              {row.original.adjustedQuantity > 0 ? `+${row.original.adjustedQuantity}` : row.original.adjustedQuantity} Units
            </span>
            <span className="text-[10px] text-muted-foreground block font-sans">
              From {row.original.previousQuantity} ➔ {row.original.finalQuantity} Units
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'reason',
      header: 'Root Cause Reason & Auditor',
      size: 260,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
            {row.original.reason}
          </p>
          <span className="text-[10px] text-muted-foreground block font-mono truncate">
            Auditor: {row.original.adjustedBy}
          </span>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inventory & Stock Adjustments"
        subtitle="Record physical count discrepancies, damaged merchandise write-offs, expired supplements, and shrinkage audits."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Log Stock Adjustment</span>
            </Button>
          </div>
        }
      />

      {/* Adjustment Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Audit Events"
          value={`${stats.totalAudits} Logs`}
          change="Physical variance audits"
          trend="neutral"
          timeframe="Cycle inventory audit"
          icon={<FileDiff className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Damaged / Expired"
          value={`${stats.damageCount} Write-offs`}
          change="Discarded per policy"
          trend="neutral"
          timeframe="Quality control"
          icon={<Flame className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="Cycle Corrections"
          value={`${stats.correctionCount} Reconciliations`}
          change="Vault physical match"
          trend="up"
          timeframe="Count accuracy"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Shrinkage & Theft"
          value={`${stats.theftCount} Incident`}
          change="Security tagged"
          trend="down"
          timeframe="Loss prevention"
          icon={<ShieldAlert className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Adjustments', count: stats.totalAudits },
          { key: 'DAMAGE_WRITE_OFF', label: '💥 Damaged Goods', count: adjustments.filter((a) => a.adjustmentType === 'DAMAGE_WRITE_OFF').length },
          { key: 'EXPIRED_BATCH', label: '⏳ Expired Batches', count: adjustments.filter((a) => a.adjustmentType === 'EXPIRED_BATCH').length },
          { key: 'CYCLE_COUNT_CORRECTION', label: '🔍 Cycle Corrections', count: stats.correctionCount },
          { key: 'THEFT_LOSS', label: '⚠️ Loss / Shrinkage', count: stats.theftCount },
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
        searchPlaceholder="Search adjustments by product, SKU, audit code, reason..."
      />

      {/* Log Stock Adjustment Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileDiff className="h-5 w-5 text-primary" />
              <span>Log Stock Adjustment / Damage Write-Off</span>
            </DialogTitle>
            <DialogDescription>
              Record physical inventory corrections, expired batch write-downs, or transit damaged units.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAdjustment} className="space-y-4 py-2">
            <SelectBox
              label="Select Product SKU"
              value={sku}
              onChange={(v) => {
                setSku(v);
                if (v === 'SKU-WHEY-5LB') {
                  setProductName('Optimum Nutrition Gold Standard Whey (5 lbs)');
                  setPreviousQuantity('36');
                } else if (v === 'SKU-C4-PRE') {
                  setProductName('C4 Original High Explosive Pre-Workout (30 Serv)');
                  setPreviousQuantity('24');
                } else if (v === 'SKU-SMOOTH-01') {
                  setProductName('Cold-Pressed Muscle Recovery Protein Smoothie');
                  setPreviousQuantity('18');
                } else if (v === 'SKU-GEAR-SHAKE') {
                  setProductName('Matte Black 750ml Stainless Steel Shaker Bottle');
                  setPreviousQuantity('6');
                }
              }}
              options={[
                { value: 'SKU-WHEY-5LB', label: '🥛 Optimum Nutrition Gold Standard Whey 5lb (#SKU-WHEY-5LB)' },
                { value: 'SKU-C4-PRE', label: '⚡ C4 Original Pre-Workout 30 Serv (#SKU-C4-PRE)' },
                { value: 'SKU-SMOOTH-01', label: '🧃 Cold-Pressed Protein Smoothie (#SKU-SMOOTH-01)' },
                { value: 'SKU-GEAR-SHAKE', label: '🍶 Matte Black Shaker Bottle (#SKU-GEAR-SHAKE)' },
              ]}
            />

            <SelectBox
              label="Audit Classification"
              value={adjustmentType}
              onChange={(v) => setAdjustmentType(v as any)}
              options={[
                { value: 'DAMAGE_WRITE_OFF', label: '💥 Damaged Product / Broken Seal Write-Off' },
                { value: 'EXPIRED_BATCH', label: '⏳ Expired Batch / Past Freshness Date' },
                { value: 'CYCLE_COUNT_CORRECTION', label: '🔍 Physical Count Discrepancy (Reconciliation)' },
                { value: 'THEFT_LOSS', label: '⚠️ Unaccounted Floor Shrinkage / Loss' },
                { value: 'INCREASE', label: '➕ Surplus Inventory Found' },
              ]}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Previous Stock</label>
                <Input
                  type="number"
                  value={previousQuantity}
                  onChange={(e) => setPreviousQuantity(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Adjustment (+/-)</label>
                <Input
                  type="number"
                  value={adjustedQuantity}
                  onChange={(e) => setAdjustedQuantity(e.target.value)}
                  className="h-9 text-xs font-mono font-bold"
                  placeholder="-2"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Final Stock</label>
                <Input
                  type="number"
                  value={calculatedFinal}
                  readOnly
                  className="h-9 text-xs font-mono font-extrabold bg-muted"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Root Cause Explanation</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-9 text-xs"
                placeholder="Detailed reason for inventory count adjustment..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Auditor Action Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
                placeholder="Disposal confirmation, security investigation..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Logging...' : 'Authorize Audit Log'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
