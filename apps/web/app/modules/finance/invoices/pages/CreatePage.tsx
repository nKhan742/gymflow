import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  FileText,
  User,
  Plus,
  Trash2,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Receipt,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

interface IInvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Step 1: Member Selection
  const [membersList, setMembersList] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberSearch, setMemberSearch] = useState<string>('');

  // Step 2: Line Items
  const [items, setItems] = useState<IInvoiceLineItem[]>([
    {
      id: '1',
      description: 'VIP Platinum Annual Pass',
      quantity: 1,
      unitPrice: 1499,
      total: 1499,
    },
  ]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxRate] = useState<number>(0.08); // 8% standard sales tax

  // Step 3: Payment Details
  const [paymentMethod, setPaymentMethod] = useState<string>('CREDIT_CARD');
  const [paymentStatus, setPaymentStatus] = useState<string>('PAID');
  const [invoiceNotes, setInvoiceNotes] = useState<string>('Thank you for choosing GymFlow Enterprise. Access credentials active immediately.');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/members/members', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          setMembersList(json.data.items);
          if (json.data.items.length > 0) {
            setSelectedMember(json.data.items[0]);
          }
        }
      }
    } catch {}
  };

  const handleAddItem = (preset?: { desc: string; price: number }) => {
    const newItem: IInvoiceLineItem = {
      id: String(Date.now()),
      description: preset?.desc || 'General Gym Services / Personal Training',
      quantity: 1,
      unitPrice: preset?.price || 150,
      total: preset?.price || 150,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error('Invoice must have at least one line item');
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: 'description' | 'quantity' | 'unitPrice', val: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          if (field === 'quantity' || field === 'unitPrice') {
            const q = field === 'quantity' ? Number(val) : item.quantity;
            const p = field === 'unitPrice' ? Number(val) : item.unitPrice;
            updated.total = Math.max(0, q * p);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = Math.round(subtotal * taxRate);
  const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const payload = {
        invoiceNumber,
        memberId: selectedMember?.memberCode || selectedMember?.id || 'mem_default',
        memberName: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : 'Walk-in Member',
        memberEmail: selectedMember?.email || 'member@gymflow.io',
        items: items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total,
        })),
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        totalAmount,
        paymentMethod,
        paymentStatus,
        dueDate: new Date().toISOString(),
        notes: invoiceNotes,
      };

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/finance/invoices', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Invoice ${invoiceNumber} created and saved to MongoDB!`, {
          description: `Total Billed: $${totalAmount.toLocaleString()} • ${paymentStatus}`,
        });
        navigate('/finance/invoices');
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to generate invoice');
      }
    } catch (err: any) {
      toast.error('Failed to create invoice', {
        description: err.message || 'Please check the form and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Generate Tax Invoice"
        subtitle="Create an itemized member invoice, personal training bill, or point-of-sale receipt."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/finance/invoices')}>
            Cancel
          </Button>
        }
      />

      {/* Stepper Wizard Progress */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-6">
        {[
          { num: 1, label: 'Billed Member', icon: <User className="h-4 w-4" /> },
          { num: 2, label: 'Line Items & Tax', icon: <ShoppingBag className="h-4 w-4" /> },
          { num: 3, label: 'Payment & Receipt', icon: <Receipt className="h-4 w-4" /> },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                step === s.num
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/20'
                  : step > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.icon}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">Step {s.num} of 3</p>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Select Billed Member
              </CardTitle>
              <CardDescription>
                Choose an active gym member from the live MongoDB directory or enter walk-in customer details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Search & Select Registered Member
                </label>
                <Input
                  placeholder="Filter members by name, email, or #GF- code..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="mb-3"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {membersList
                    .filter((m) =>
                      `${m.firstName} ${m.lastName} ${m.email} ${m.memberCode}`
                        .toLowerCase()
                        .includes(memberSearch.toLowerCase())
                    )
                    .map((m) => {
                      const isSelected = selectedMember?.memberCode === m.memberCode;
                      return (
                        <div
                          key={m.memberCode || m.id}
                          onClick={() => setSelectedMember(m)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30'
                              : 'border-border bg-card hover:bg-muted/40'
                          }`}
                        >
                          <div className="h-9 w-9 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {m.firstName?.charAt(0)}
                            {m.lastName?.charAt(0)}
                          </div>
                          <div className="truncate flex-1">
                            <p className="font-semibold text-xs text-foreground truncate">
                              {m.firstName} {m.lastName}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">{m.email}</p>
                            <Badge variant="outline" className="text-[9px] mt-1">
                              {m.memberCode} • {m.membership?.tier || 'ACTIVE'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {selectedMember && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground">Selected Member: </span>
                    <span className="font-semibold text-foreground">
                      {selectedMember.firstName} {selectedMember.lastName} ({selectedMember.email})
                    </span>
                  </div>
                  <Badge variant="success" className="text-[10px]">Verified Member</Badge>
                </div>
              )}

              <div className="flex justify-end pt-3">
                <Button onClick={() => setStep(2)} className="gap-2">
                  <span>Continue to Items</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Itemized Charges & Tax
              </CardTitle>
              <CardDescription>
                Add membership subscription fees, locker rentals, personal training packs, or retail items.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Add:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1"
                  onClick={() => handleAddItem({ desc: 'VIP Platinum Annual Pass', price: 1499 })}
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>VIP Plan ($1,499)</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1"
                  onClick={() => handleAddItem({ desc: 'Gold Annual Pass', price: 899 })}
                >
                  <span>Gold Plan ($899)</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1"
                  onClick={() => handleAddItem({ desc: 'Personal Training 10-Pack', price: 650 })}
                >
                  <span>10x PT Sessions ($650)</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1"
                  onClick={() => handleAddItem({ desc: 'Locker Rental (Annual)', price: 120 })}
                >
                  <span>Locker ($120)</span>
                </Button>
              </div>

              {/* Line Items Table */}
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl border border-border bg-card shadow-xs"
                  >
                    <div className="col-span-6">
                      <label className="text-[10px] text-muted-foreground font-semibold block mb-1">
                        Item Description
                      </label>
                      <Input
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        placeholder="Description..."
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground font-semibold block mb-1">
                        Qty
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                        className="h-8 text-xs text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground font-semibold block mb-1">
                        Price ($)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between pt-4">
                      <span className="font-bold text-xs text-foreground">
                        ${item.total.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 text-xs border-dashed"
                  onClick={() => handleAddItem()}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Custom Item</span>
                </Button>
              </div>

              {/* Calculations Summary */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-foreground">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-mono font-semibold text-foreground">+${taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Promo / Discount ($)</span>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="h-7 text-xs text-right"
                    />
                  </div>
                </div>
                <div className="border-t border-border pt-2 flex items-center justify-between font-bold text-sm text-foreground">
                  <span>Total Amount Due</span>
                  <span className="font-mono text-primary text-base">${totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  <span>Continue to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment Gateway & Settlement
              </CardTitle>
              <CardDescription>
                Select payment method and issue the official tax invoice receipt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Settlement Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
                    { id: 'STRIPE', label: 'Stripe Pay', icon: '⚡' },
                    { id: 'CASH', label: 'Cash Drawer', icon: '💵' },
                    { id: 'BANK_TRANSFER', label: 'Wire Transfer', icon: '🏦' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === m.id
                          ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                          : 'border-border bg-card hover:bg-muted/40'
                      }`}
                    >
                      <span className="text-xl block mb-1">{m.icon}</span>
                      <span className="text-xs font-semibold text-foreground block">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Initial Payment Status
                </label>
                <div className="flex items-center gap-3">
                  {['PAID', 'PENDING'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setPaymentStatus(st)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        paymentStatus === st
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-card border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {st === 'PAID' ? '✓ Mark as Paid (Instant Receipt)' : '⏳ Mark as Pending (Pay Later)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memo / Notes */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Customer Receipt Notes
                </label>
                <Input
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  placeholder="Terms, tax registration #, or turnstile instructions..."
                  className="text-xs"
                />
              </div>

              {/* Final Invoice Summary Box */}
              <div className="p-4 rounded-xl bg-gradient-to-tr from-primary/10 via-purple-500/5 to-transparent border border-primary/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span className="font-semibold text-foreground">
                    {selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : 'Walk-in Member'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold text-foreground font-mono">{paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-foreground border-t border-primary/20 pt-2">
                  <span>Grand Total to Process:</span>
                  <span className="font-mono text-primary text-lg">${totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="gap-2 shadow-md shadow-primary/25 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{loading ? 'Processing...' : 'Complete & Issue Invoice'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
