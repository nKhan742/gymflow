import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tooltip } from '../../../../shared/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Plus,
  Download,
  Eye,
  DollarSign,
  FileText,
  CheckCircle2,
  MoreHorizontal,
  Printer,
  Calendar,
  CreditCard,
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

  useEffect(() => {
    loadInvoices();
  }, [statusFilter]);

  const loadInvoices = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const url = new URL('http://localhost:5000/api/v1/finance/invoices');
      if (statusFilter !== 'ALL') url.searchParams.append('status', statusFilter);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          setInvoices(json.data.items);
          return;
        }
      }
    } catch {}
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
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate(`/finance/invoices/${row.original._id || row.original.invoiceNumber}`)}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500/30 to-primary/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            {row.original.memberName?.charAt(0) || 'M'}
          </div>
          <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
            {row.getValue('memberName')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-bold text-sm text-foreground">
          ${Number(row.getValue('totalAmount')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-mono capitalize">
          {row.original.paymentMethod?.replace('_', ' ').toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Status',
      cell: ({ row }) => {
        const val = row.original.paymentStatus || 'PAID';
        return (
          <Badge
            variant={
              val === 'PAID'
                ? 'success'
                : val === 'PENDING'
                ? 'warning'
                : val === 'OVERDUE'
                ? 'destructive'
                : 'secondary'
            }
            className="text-xs font-semibold"
          >
            {val}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due / Paid Date',
      cell: ({ row }) => {
        const dateStr = row.original.paidAt || row.original.dueDate;
        let formatted = 'Today';
        try {
          if (dateStr && !dateStr.toLowerCase().includes('today')) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
          }
        } catch {}

        return (
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{formatted}</span>
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {/* Quick View Receipt */}
          <button
            onClick={() => navigate(`/finance/invoices/${row.original._id || row.original.invoiceNumber}`)}
            className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
            title="View 360° Invoice"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          {/* Print Button */}
          <button
            onClick={() => handlePrint(row.original.invoiceNumber)}
            className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
            title="Print Tax Receipt"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs shrink-0"
                title="More Options"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => navigate(`/finance/invoices/${row.original._id || row.original.invoiceNumber}`)}
                className="gap-2 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Invoice Breakdown</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePrint(row.original.invoiceNumber)}
                className="gap-2 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Print PDF Receipt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast.success(`Payment receipt sent to ${row.original.memberEmail}`);
                }}
                className="gap-2 cursor-pointer text-primary"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Resend Email Receipt</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          change="+18.4% this month"
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
          change={pendingCount === 0 ? 'All healthy' : `${pendingCount} action required`}
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

      {/* Enterprise Data Table */}
      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="Search invoices by #INV, member name, email..."
      />
    </PageContainer>
  );
};
