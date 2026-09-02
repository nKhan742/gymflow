import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import {
  DollarSign,
  FileSpreadsheet,
  Download,
  Plus,
  ShieldCheck,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Receipt,
  Printer,
  Scale,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IInvoiceSettlementItem, ICashDrawerRecord } from '../types';

export const DEFAULT_DRAWERS: any[] = [];


export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<IInvoiceSettlementItem[]>(() => {
    const saved = localStorage.getItem('gymflow_accountant_invoices');
    return saved ? JSON.parse(saved) : [];
  });
  const [drawers, setDrawers] = useState<ICashDrawerRecord[]>(() => {
    const saved = localStorage.getItem('gymflow_accountant_drawers');
    return saved ? JSON.parse(saved) : [];
  });

  const handleExportSheet = () => {
    const csv = 'Invoice,Customer,Amount,Tax,Method,Status,Date\n' + invoices.map((i) => `"${i.invoiceNumber}","${i.customerName}",${i.amount},${i.taxAmount},"${i.paymentMethod}","${i.status}","${i.dueDate}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-settlements-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('Financial Settlement Ledger exported to CSV');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Financial Controller & Accountant Hub"
        subtitle="Real-time revenue settlement, tax invoicing, POS cash reconciliation, and GAAP P&L tracking."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleExportSheet}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Balance Sheet</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => window.print()}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print GAAP Summary</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/finance/invoices/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Create Tax Invoice</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="COLLECTED REVENUE (MTD)"
          value={`$${invoices.filter((i) => i.status === 'SETTLED').reduce((sum, i) => sum + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change="GAAP Ledger"
          trend="up"
          timeframe="MTD"
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="OVERDUE RECEIVABLES"
          value={`$${invoices.filter((i) => i.status === 'OVERDUE').reduce((sum, i) => sum + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change={`${invoices.filter((i) => i.status === 'OVERDUE').length} Invoices Flagged`}
          trend="down"
          timeframe="Aging > 3 Days"
          icon={<AlertCircle className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="POS CASH BALANCED"
          value={`$${drawers.reduce((sum, d) => sum + d.countedCash, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change="0.00 Variance"
          trend="neutral"
          timeframe="POS Drawers"
          icon={<CreditCard className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="EBITDA MARGIN"
          value="0.0% Net"
          change="Operating Yield"
          trend="neutral"
          timeframe="GAAP Standard"
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Two Column Layout: Settlement Ledger & Cash Reconciliation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Invoice Settlement Ledger (2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Live Invoice Settlement & Payment Stream
              </CardTitle>
              <CardDescription>Multi-gateway customer settlements with automated tax withholding calculations.</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
              REAL-TIME RECONCILED
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {invoices.map((inv) => (
                <div key={inv.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border shadow-2xs">
                      <AvatarImage src={inv.customerAvatar} alt={inv.customerName} />
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {inv.customerName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{inv.customerName}</span>
                        <span className="text-[10px] font-mono font-bold text-primary">
                          {inv.invoiceNumber}
                        </span>
                        <Badge
                          variant={inv.status === 'SETTLED' ? 'success' : 'destructive'}
                          className="text-[9px] font-bold"
                        >
                          {inv.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <span>Method: <strong>{inv.paymentMethod.replace('_', ' ')}</strong></span>
                        <span>•</span>
                        <span>Tax: ${inv.taxAmount.toFixed(2)} (8%)</span>
                        <span>•</span>
                        <span>Due: {inv.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground font-mono block">
                      ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] text-primary p-0 hover:underline"
                      onClick={() => navigate(`/finance/invoices`)}
                    >
                      View Invoice →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: POS Cash Drawers & Tax Safeguards */}
        <div className="space-y-6">
          {/* POS Cash Drawers Balance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-500" />
                POS Cash Drawer Balance
              </CardTitle>
              <CardDescription>Shift drawer count vs expected receipts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEFAULT_DRAWERS.map((drw) => (
                <div key={drw.registerId} className="p-3 rounded-lg border border-border bg-muted/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{drw.registerId}</span>
                    <Badge variant="success" className="text-[9px] font-bold">
                      {drw.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Counted:</span>
                    <span className="font-bold text-emerald-600">${drw.countedCash.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>Cashier: {drw.cashierName}</span>
                    <span>Variance: $0.00</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tax Compliance & Withholding */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4 text-purple-500" />
                Tax & GAAP Withholding
              </CardTitle>
              <CardDescription>Monthly state/federal sales tax liabilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Sales Tax Rate:</span>
                <span className="font-bold text-foreground">8.0% Standard</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Accrued Tax Liability:</span>
                <span className="font-bold text-foreground font-mono">$10,276.00</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Compliance Status:</span>
                <span className="font-bold text-emerald-600">🟢 GAAP Certified</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
