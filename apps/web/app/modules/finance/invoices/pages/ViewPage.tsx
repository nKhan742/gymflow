import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  QrCode,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const localInvoicesRaw = localStorage.getItem('gymflow_custom_invoices');
      const localInvoices: any[] = localInvoicesRaw ? JSON.parse(localInvoicesRaw) : [];
      const match = localInvoices.find((i) => i.id === id || i._id === id || i.invoiceNumber === id);

      if (match) {
        setInvoice(match);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/finance/invoices/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setInvoice(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setInvoice(null);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-muted-foreground text-sm">
          Loading invoice details...
        </div>
      </PageContainer>
    );
  }

  if (!invoice) {
    return (
      <PageContainer>
        <div className="py-16 text-center space-y-4">
          <p className="text-muted-foreground text-sm">Invoice not found or has been removed.</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/finance/invoices')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Invoices
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => navigate('/finance/invoices')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Invoices</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            <span>Print Tax Receipt</span>
          </Button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <Card className="max-w-4xl mx-auto shadow-sm border border-border">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-border pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">GymFlow ERP</h1>
              </div>
              <p className="text-xs text-muted-foreground">Official Commercial Tax Invoice & Receipt</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <Badge variant={invoice.paymentStatus === 'PAID' ? 'success' : 'secondary'} className="text-xs font-bold">
                {invoice.paymentStatus}
              </Badge>
              <h2 className="text-lg font-mono font-bold text-foreground">{invoice.invoiceNumber}</h2>
              <p className="text-xs text-muted-foreground">Issued: {invoice.dueDate || new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Billed To</span>
              <p className="font-bold text-sm text-foreground">{invoice.memberName}</p>
              <p className="text-xs text-muted-foreground font-mono">{invoice.memberEmail}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Payment Details</span>
              <p className="text-xs font-medium text-foreground">Method: {invoice.paymentMethod}</p>
              <p className="text-xs text-muted-foreground font-mono">Status: {invoice.paymentStatus}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-foreground">{item.description}</td>
                      <td className="p-3 text-center font-mono">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">${Number(item.unitPrice || 0).toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold">${Number(item.total || item.unitPrice * item.quantity || 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 font-medium text-foreground">Subscription / Service Item</td>
                    <td className="p-3 text-center font-mono">1</td>
                    <td className="p-3 text-right font-mono">${Number(invoice.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold">${Number(invoice.totalAmount || 0).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Total */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-sm border-t border-border pt-2">
                <span>Total Amount:</span>
                <span className="font-mono text-primary">${Number(invoice.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
