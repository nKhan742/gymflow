import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Plus,
  Eye,
  DollarSign,
  FileText,
  CheckCircle2,
  MoreHorizontal,
  Printer,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IInvoiceItem {
  id?: string;
  _id?: string;
  invoiceNumber: string;
  memberName: string;
  memberEmail: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal?: number;
  tax?: number;
  discount?: number;
  totalAmount: number;
  currency?: string;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'REFUNDED';
  dueDate: string;
  paidAt?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<IInvoiceItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadInvoices();
  }, [statusFilter]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const localInvoicesRaw = localStorage.getItem('gymflow_custom_invoices');
      const localInvoices: IInvoiceItem[] = localInvoicesRaw ? JSON.parse(localInvoicesRaw) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const url = new URL('https://gymflow-api-2jdh.onrender.com/api/v1/finance/invoices');
      if (statusFilter !== 'ALL') url.searchParams.append('status', statusFilter);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const serverItems = Array.isArray(json.data) ? json.data : json.data?.items || [];
        setInvoices([...localInvoices, ...serverItems]);
      } else {
        setInvoices(localInvoices);
      }
    } catch {
      const localInvoicesRaw = localStorage.getItem('gymflow_custom_invoices');
      setInvoices(localInvoicesRaw ? JSON.parse(localInvoicesRaw) : []);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (invoiceNumber: string) => {
    toast.success(`Preparing printable receipt for #${invoiceNumber}`);
    navigate(`/finance/invoices/${invoiceNumber}`);
  };

  const columns: ColumnDef<IInvoiceItem>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('invoiceNumber')}
        </span>
      ),
    },
    {
      accessorKey: 'memberName',
      header: 'Billed Member',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-xs text-foreground block">
            {row.getValue('memberName')}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono block">
            {row.original.memberEmail}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-foreground">
          ${Number(row.getValue('totalAmount') || 0).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground">
          {row.getValue('paymentMethod')}
        </span>
      ),
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as string;
        const variants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
          PAID: 'success',
          PENDING: 'warning',
          OVERDUE: 'destructive',
          REFUNDED: 'secondary',
        };
        return (
          <Badge variant={variants[status] || 'default'} className="text-[10px] font-semibold">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due / Paid Date',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.paidAt ? `Paid: ${row.original.paidAt}` : `Due: ${row.original.dueDate}`}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => navigate(`/finance/invoices/${row.original._id || row.original.invoiceNumber}`)}
            className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
            title="View Invoice"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handlePrint(row.original.invoiceNumber)}
            className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
            title="Print Tax Receipt"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const totalRevenue = invoices.reduce((acc, i) => acc + (i.totalAmount || 0), 0);
  const paidCount = invoices.filter((i) => i.paymentStatus === 'PAID').length;
  const pendingCount = invoices.filter((i) => i.paymentStatus === 'PENDING' || i.paymentStatus === 'OVERDUE').length;

  return (
    <PageContainer>
      <PageHeader
        title="Invoices & Billing"
        subtitle="Manage member billing transactions, recurring subscriptions, point-of-sale invoices, and tax receipts."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={loadInvoices}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/finance/pos')}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>POS Register</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/finance/invoices/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Generate Invoice</span>
            </Button>
          </>
        }
      />

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Gross Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="GAAP Ledger"
          trend="up"
          timeframe="All processed"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Paid Invoices"
          value={`${paidCount}`}
          change={`${invoices.length > 0 ? Math.round((paidCount / invoices.length) * 100) : 100}% collected`}
          trend="up"
          timeframe="Settled transactions"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Pending / Overdue"
          value={`${pendingCount}`}
          change={pendingCount === 0 ? '0 Overdue' : `${pendingCount} action required`}
          trend={pendingCount === 0 ? 'neutral' : 'down'}
          timeframe="Outstanding receivables"
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === s
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {s === 'ALL' ? 'All Invoices' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="Search invoices by #INV, member name, email..."
      />
    </PageContainer>
  );
};
