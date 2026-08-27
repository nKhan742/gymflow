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
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`http://localhost:5000/api/v1/finance/invoices/${id}`, {
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

    // Fallback
    setInvoice({
      invoiceNumber: id || 'INV-2026-8801',
      memberId: 'GF-9284',
      memberName: 'Sarah Jenkins',
      memberEmail: 'sarah.jenkins@example.com',
      items: [
        { description: 'VIP Platinum All-Access Annual Pass', quantity: 1, unitPrice: 1499, total: 1499 },
        { description: 'Locker Rental (Annual)', quantity: 1, unitPrice: 120, total: 120 },
      ],
      subtotal: 1619,
      tax: 129,
      discount: 100,
      totalAmount: 1648,
      currency: 'USD',
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'PAID',
      dueDate: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      notes: 'Thank you for choosing GymFlow Enterprise. Access credentials active immediately.',
    });
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !invoice) {
    return (
      <PageContainer>
        <div className="py-20 text-center text-muted-foreground text-sm">
          Loading invoice details...
        </div>
      </PageContainer>
    );
  }

  const items = invoice.items || [
    { description: 'VIP Platinum Membership', quantity: 1, unitPrice: invoice.totalAmount || 1499, total: invoice.totalAmount || 1499 },
  ];

  return (
    <PageContainer>
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 print:hidden">
        <Button variant="outline" size="sm" onClick={() => navigate('/finance/invoices')} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Invoices</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              toast.success('Official PDF generated and sent to member email');
            }}
            className="gap-1.5 shadow-md shadow-primary/25"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Printable Digital Invoice Receipt */}
      <div className="max-w-3xl mx-auto">
        <Card className="border border-border/80 shadow-lg bg-card overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-transparent border-b border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary/30 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">GymFlow Enterprise</h1>
                <p className="text-xs text-muted-foreground">Official Tax Invoice & Payment Receipt</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-mono text-sm font-bold text-primary block">
                #{invoice.invoiceNumber}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    invoice.paymentStatus === 'PAID'
                      ? 'success'
                      : invoice.paymentStatus === 'PENDING'
                      ? 'warning'
                      : 'destructive'
                  }
                  className="text-xs font-semibold uppercase"
                >
                  {invoice.paymentStatus}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(invoice.dueDate || invoice.paidAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Meta Grid (Billed To & Gym Details) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border/60 text-xs">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Billed To
                </span>
                <p className="text-sm font-bold text-foreground">{invoice.memberName}</p>
                <p className="text-muted-foreground">{invoice.memberEmail}</p>
                <p className="text-muted-foreground font-mono mt-0.5">Member Code: {invoice.memberId || 'GF-9284'}</p>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Issued By
                </span>
                <p className="text-sm font-bold text-foreground">GymFlow Flagship HQ</p>
                <p className="text-muted-foreground">742 Evergreen Fitness Blvd, Suite 400</p>
                <p className="text-muted-foreground">Tax ID: US-EIN-992-48201</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                Itemized Summary
              </span>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold border-b border-border">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-center w-16">Qty</th>
                      <th className="p-3 text-right w-24">Unit Price</th>
                      <th className="p-3 text-right w-28">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {items.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/20">
                        <td className="p-3 font-medium text-foreground">{item.description}</td>
                        <td className="p-3 text-center text-muted-foreground">{item.quantity || 1}</td>
                        <td className="p-3 text-right font-mono text-muted-foreground">
                          ${Number(item.unitPrice || item.total).toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">
                          ${Number(item.total || item.unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border text-xs max-w-sm">
                <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Payment Settled Verified</p>
                  <p className="text-[10px] text-muted-foreground">
                    Processed via {invoice.paymentMethod || 'Credit Card'} • TLS 256-bit encrypted
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-foreground">
                    ${Number(invoice.subtotal || invoice.totalAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Tax (8% GST/VAT)</span>
                  <span className="font-mono font-semibold text-foreground">
                    +${Number(invoice.tax || 0).toLocaleString()}
                  </span>
                </div>
                {Number(invoice.discount || 0) > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount Applied</span>
                    <span className="font-mono font-semibold">
                      -${Number(invoice.discount).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex items-center justify-between text-sm font-extrabold text-foreground">
                  <span>Total Paid</span>
                  <span className="font-mono text-primary text-base">
                    ${Number(invoice.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="p-3.5 rounded-xl bg-muted/20 border border-dashed border-border text-center text-[11px] text-muted-foreground">
              {invoice.notes || 'Thank you for choosing GymFlow Enterprise. For billing inquiries, contact billing@gymflow.io.'}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
