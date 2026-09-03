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
  Layers,
  Plus,
  Package,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  Percent,
  Eye,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface ICategoryItem {
  id: string;
  _id?: string;
  code: string;
  categoryCode: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount: number;
  taxRate: number;
  isDisplayedInPOS: boolean;
  status: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Category Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('Functional Training Accessories');
  const [categoryCode, setCategoryCode] = useState('CAT-FUNC');
  const [slug, setSlug] = useState('functional-training-accessories');
  const [icon, setIcon] = useState('🏋️');
  const [description, setDescription] = useState('Kettlebells, resistance bands, jump ropes, and agility cones.');
  const [taxRate, setTaxRate] = useState('10.0');
  const [isDisplayedInPOS, setIsDisplayedInPOS] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/inventory/categories', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const stats = useMemo(() => {
    const totalSKUs = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
    const posActive = categories.filter((c) => c.isDisplayedInPOS).length;

    return {
      totalCategories: categories.length,
      posActive,
      totalSKUs,
      avgTaxRate: '8.8%',
    };
  }, [categories]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/inventory/categories', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          categoryCode: categoryCode.toUpperCase(),
          slug: slug.toLowerCase(),
          icon,
          description,
          taxRate: parseFloat(taxRate) || 10,
          productCount: 0,
          isDisplayedInPOS,
          status: 'active',
        }),
      });

      if (res.ok) {
        toast.success(`Category "${name}" created!`, {
          description: `Code: ${categoryCode.toUpperCase()} • Tax: ${taxRate}%`,
        });
        setCreateModalOpen(false);
        await loadCategories();
      } else {
        toast.error('Failed to create category');
      }
    } catch {
      toast.error('Failed to connect to category service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePOS = async (cat: ICategoryItem) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const catId = cat._id || cat.id;

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/inventory/categories/${catId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDisplayedInPOS: !cat.isDisplayedInPOS,
        }),
      });

      if (res.ok) {
        toast.success(`Category "${cat.name}" POS Visibility Updated!`);
        await loadCategories();
      } else {
        toast.error('Failed to update category POS visibility');
      }
    } catch {
      toast.error('Failed to connect to category gateway');
    }
  };

  const columns: ColumnDef<ICategoryItem>[] = [
    {
      accessorKey: 'name',
      header: 'Category & Icon',
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
            <span className="text-[10px] text-muted-foreground block truncate">
              {row.original.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'categoryCode',
      header: 'Category Code & Slug',
      size: 190,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Badge variant="outline" className="font-mono font-bold text-[10px] bg-primary/10 text-primary border-primary/25 whitespace-nowrap">
            {row.original.categoryCode}
          </Badge>
          <span className="text-[10px] text-muted-foreground font-mono block">
            /{row.original.slug}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'productCount',
      header: 'Catalog SKUs',
      size: 150,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs px-2 py-0.5 font-mono font-bold bg-muted/40 text-foreground whitespace-nowrap">
          {row.original.productCount} Active SKUs
        </Badge>
      ),
    },
    {
      accessorKey: 'taxRate',
      header: 'Default Tax',
      size: 140,
      cell: ({ row }) => (
        <span className="text-xs font-mono font-bold text-foreground block">
          {row.original.taxRate.toFixed(1)}% Tax
        </span>
      ),
    },
    {
      accessorKey: 'isDisplayedInPOS',
      header: 'POS Register Visibility',
      size: 180,
      cell: ({ row }) => (
        <Badge
          variant={row.original.isDisplayedInPOS ? 'success' : 'secondary'}
          className={`text-xs font-semibold whitespace-nowrap px-2 py-0.5 ${
            row.original.isDisplayedInPOS ? 'bg-emerald-600' : ''
          }`}
        >
          {row.original.isDisplayedInPOS ? '🟢 Visible in POS' : '⚫ Hidden'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 160,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTogglePOS(row.original)}
            className={`h-7 px-2 text-xs gap-1 shadow-xs ${
              row.original.isDisplayedInPOS ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <span>{row.original.isDisplayedInPOS ? 'Hide POS' : 'Show POS'}</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inventory & Product Categories"
        subtitle="Organize retail products, supplement categories, front-desk POS quick-select tabs, and category-level tax rates."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
          </div>
        }
      />

      {/* Category KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Categories"
          value={`${stats.totalCategories} Groups`}
          change="Catalog hierarchy"
          trend="up"
          timeframe="Active product groups"
          icon={<Layers className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="POS Active Tabs"
          value={`${stats.posActive} Categories`}
          change="Available on cashier POS"
          trend="up"
          timeframe="Quick checkout tabs"
          icon={<ShoppingBag className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Catalog SKUs Covered"
          value={`${stats.totalSKUs} SKUs`}
          change="Mapped inventory items"
          trend="up"
          timeframe="Active retail stock"
          icon={<Package className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="Avg Applicable Tax"
          value={stats.avgTaxRate}
          change="Standardized category rates"
          trend="neutral"
          timeframe="Compliance rate"
          icon={<Percent className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        searchPlaceholder="Search categories by name, code, slug..."
      />

      {/* Add Category Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <span>Add Product Category</span>
            </DialogTitle>
            <DialogDescription>
              Create inventory category group for product catalog and front-desk POS registers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">Category Name</label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  className="h-9 text-xs"
                  placeholder="e.g. Supplements & Protein"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Emoji Icon</label>
                <Input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="h-9 text-xs text-center text-lg"
                  placeholder="🥛"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Category Code</label>
                <Input
                  value={categoryCode}
                  onChange={(e) => setCategoryCode(e.target.value.toUpperCase())}
                  className="h-9 text-xs font-mono font-bold uppercase"
                  placeholder="e.g. CAT-SUPP"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">URL Slug</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  className="h-9 text-xs font-mono"
                  placeholder="supplements-protein"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Default Tax Rate (%)</label>
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

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="posCheck"
                  checked={isDisplayedInPOS}
                  onChange={(e) => setIsDisplayedInPOS(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="posCheck" className="text-xs font-semibold text-foreground cursor-pointer">
                  Display in POS Register
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 text-xs"
                placeholder="Brief description of products in this category..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Creating...' : `Save Category (${categoryCode})`}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
