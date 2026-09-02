import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  CreditCard,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Search,
  DollarSign,
  Receipt,
  User,
  Zap,
  Tag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { PlanGateGuard } from '../../../../shared/components/plan/PlanGateGuard';

interface IPOSProduct {
  id: string;
  name: string;
  category: 'PASSES' | 'SUPPLEMENTS' | 'MERCH' | 'DRINKS';
  price: number;
  icon: string;
  stock: number;
}

interface ICartItem {
  product: IPOSProduct;
  quantity: number;
}

const POS_PRODUCTS: IPOSProduct[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const addToCart = (product: IPOSProduct) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as ICartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setDiscountCode('');
  };

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'GYM10') {
      setDiscountPercent(0.1);
      toast.success('Promo Code GYM10 Applied: 10% Off!');
    } else if (discountCode.toUpperCase() === 'VIP20') {
      setDiscountPercent(0.2);
      toast.success('VIP20 Applied: 20% Off!');
    } else {
      toast.error('Invalid coupon code. Try GYM10 or VIP20');
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discountPercent * 100) / 100;
  const taxAmount = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount);

  const handleCheckout = async (paymentMethod: 'CASH' | 'CREDIT_CARD' | 'STRIPE') => {
    if (cart.length === 0) {
      toast.error('Cart is empty. Please add items to process checkout.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const invoiceNumber = `INV-POS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const payload = {
        invoiceNumber,
        memberName: customerName || 'Walk-in Retail Customer',
        memberEmail: 'retail@gymflow.io',
        items: cart.map((i) => ({
          description: `${i.product.name}`,
          quantity: i.quantity,
          unitPrice: i.product.price,
          total: i.product.price * i.quantity,
        })),
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        totalAmount,
        paymentMethod,
        paymentStatus: 'PAID',
        dueDate: new Date().toISOString(),
        notes: `POS Retail Sale • Cashier Register #1 • Method: ${paymentMethod}`,
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
        toast.success(`POS Sale Complete! #${invoiceNumber}`, {
          description: `Billed $${totalAmount.toFixed(2)} via ${paymentMethod}`,
        });
        clearCart();
        navigate('/finance/invoices');
      } else {
        throw new Error('Failed to record POS transaction');
      }
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = POS_PRODUCTS.filter((p) => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <PlanGateGuard featureKey="finance/pos" featureTitle="Point of Sale (POS) Billing" requiredTier="PROFESSIONAL">
      <PageContainer>
      <PageHeader
        title="Point of Sale (POS) Register"
        subtitle="Process quick retail sales, guest passes, supplements, and gym merchandise."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/finance/invoices')}>
            View Invoices
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Product Catalog Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Search products, passes, gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'PASSES', 'SUPPLEMENTS', 'MERCH', 'DRINKS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat === 'ALL' ? 'All Items' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <h3 className="font-semibold text-xs text-foreground line-clamp-2 leading-tight">
                    {p.name}
                  </h3>
                  <Badge variant="outline" className="text-[9px] mt-1">
                    {p.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                  <span className="font-extrabold text-sm text-foreground font-mono">
                    ${p.price.toFixed(2)}
                  </span>
                  <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Active Cart Register */}
        <div className="lg:col-span-5">
          <Card className="border border-border shadow-md bg-card sticky top-20">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <h2 className="font-bold text-sm text-foreground">Current Cart</h2>
                <Badge variant="secondary" className="text-[10px]">{cart.length} items</Badge>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <CardContent className="p-4 space-y-4">
              {/* Customer Name */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Customer / Member Name
                </label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in or member name..."
                  className="h-8 text-xs"
                />
              </div>

              {/* Cart Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-xs">
                    Cart is empty. Tap any product on the left to add.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-2.5 rounded-lg border border-border/70 bg-muted/20 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 truncate flex-1">
                        <span className="text-base">{item.product.icon}</span>
                        <div className="truncate">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            ${item.product.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="h-6 w-6 rounded border border-border bg-background hover:bg-muted flex items-center justify-center text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="h-6 w-6 rounded border border-border bg-background hover:bg-muted flex items-center justify-center text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-bold text-xs font-mono w-16 text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Promo Code */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <Input
                  placeholder="Promo (e.g. GYM10)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="h-7 text-xs uppercase font-mono"
                />
                <Button variant="outline" size="sm" onClick={applyDiscount} className="h-7 text-xs px-2.5">
                  Apply
                </Button>
              </div>

              {/* Order Calculations */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono font-semibold text-foreground">+${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-1.5 flex items-center justify-between text-sm font-extrabold text-foreground">
                  <span>Total Due</span>
                  <span className="font-mono text-primary text-base">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Fast Checkout Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <Button
                  onClick={() => handleCheckout('CASH')}
                  disabled={loading || cart.length === 0}
                  variant="outline"
                  className="gap-1 text-xs h-10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Cash</span>
                </Button>

                <Button
                  onClick={() => handleCheckout('CREDIT_CARD')}
                  disabled={loading || cart.length === 0}
                  className="gap-1 text-xs h-10 shadow-sm shadow-primary/20"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </Button>

                <Button
                  onClick={() => handleCheckout('STRIPE')}
                  disabled={loading || cart.length === 0}
                  variant="secondary"
                  className="gap-1 text-xs h-10 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
                >
                  <Zap className="h-4 w-4" />
                  <span>Stripe</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
    </PlanGateGuard>
  );
};
