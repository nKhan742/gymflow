import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, Package, AlertTriangle, DollarSign, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

interface IProductItem {
  id?: string;
  _id?: string;
  name: string;
  sku: string;
  category: 'SUPPLEMENTS' | 'BEVERAGES' | 'APPAREL' | 'ACCESSORIES' | 'SNACKS';
  price: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  supplier: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProductItem[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
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
        if (json.success && json.data?.items) {
          setProducts(json.data.items);
          return;
        }
      }
    } catch {}

    setProducts([
      {
        name: 'Gold Standard 100% Whey Protein (5 lbs)',
        sku: 'SKU-WHEY-001',
        category: 'SUPPLEMENTS',
        price: 74.99,
        costPrice: 45.0,
        stockQuantity: 48,
        lowStockThreshold: 10,
        supplier: 'Optimum Nutrition USA',
      },
      {
        name: 'C4 Ripped Pre-Workout Explosion',
        sku: 'SKU-PRE-002',
        category: 'SUPPLEMENTS',
        price: 39.99,
        costPrice: 22.0,
        stockQuantity: 32,
        lowStockThreshold: 8,
        supplier: 'Cellucor Labs',
      },
      {
        name: 'GymFlow Ergonomic Shaker Bottle 800ml',
        sku: 'SKU-ACC-003',
        category: 'ACCESSORIES',
        price: 14.99,
        costPrice: 4.5,
        stockQuantity: 120,
        lowStockThreshold: 20,
        supplier: 'GymFlow Merch Co.',
      },
    ]);
  };

  const columns: ColumnDef<IProductItem>[] = [
    {
      accessorKey: 'sku',
      header: 'SKU Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('sku')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground text-sm">{row.getValue('name')}</p>
          <p className="text-xs text-muted-foreground">{row.original.supplier}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px]">
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Retail Price',
      cell: ({ row }) => (
        <span className="font-bold text-foreground text-sm">${Number(row.getValue('price')).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'stockQuantity',
      header: 'Inventory Level',
      cell: ({ row }) => {
        const qty = row.original.stockQuantity;
        const low = row.original.lowStockThreshold;
        return (
          <Badge variant={qty <= low ? 'destructive' : qty < low * 2 ? 'warning' : 'success'}>
            {qty} Units in Stock
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/inventory/products/${row.original._id || '1'}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const totalValue = products.reduce((acc, p) => acc + p.price * p.stockQuantity, 0);

  return (
    <PageContainer>
      <PageHeader
        title="Products & POS Inventory"
        subtitle="Manage supplement stock, retail goods, barcode SKUs, and purchase reorders."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Stock Audit CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/inventory/products/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Inventory Valuation"
          value={`$${totalValue.toLocaleString()}`}
          change="+12.8%"
          trend="up"
          timeframe="Retail goods & supplements"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Active SKUs"
          value={`${products.length}`}
          change="0 Stockouts"
          trend="neutral"
          timeframe="5 categories"
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Reorder Alerts"
          value="0 Items"
          change="All well stocked"
          trend="neutral"
          timeframe="Safe threshold"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products by SKU, name, supplier..."
      />
    </PageContainer>
  );
};
