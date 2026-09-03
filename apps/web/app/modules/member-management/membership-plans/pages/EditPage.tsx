import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { SelectBox } from '../../../../shared/components/ui/select';
import {
  ArrowLeft,
  Save,
  Crown,
  Sparkles,
  CreditCard,
  Building2,
  Clock,
  Calendar,
  Check,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [name, setName] = useState('VIP Platinum All-Access Annual');
  const [code, setCode] = useState('PLAN-VIP-01');
  const [tier, setTier] = useState('VIP_PLATINUM');
  const [description, setDescription] = useState('The ultimate luxury fitness experience with multi-branch access and VIP perks.');
  const [price, setPrice] = useState<number>(1499);
  const [billingCycle, setBillingCycle] = useState('ANNUAL');
  const [initiationFee, setInitiationFee] = useState<number>(0);
  const [accessHours, setAccessHours] = useState('24/7 Unlimited All-Access');
  const [multiBranch, setMultiBranch] = useState<boolean>(true);
  const [maxFreezeDays, setMaxFreezeDays] = useState<number>(60);
  const [popular, setPopular] = useState<boolean>(true);
  const [status, setStatus] = useState('active');

  // Inclusions List
  const [inclusions, setInclusions] = useState<string[]>([
    '24/7 Access to all Flagship & Express Locations',
    'Unlimited Group Fitness (Spin, Yoga, HIIT, Boxing)',
    'Executive Spa, Sauna, Steam & Recovery Zone',
    'Dedicated Smart Locker with digital passcode',
    '2 Complimentary Personal Training Consultations',
    '2 Free Guest Passes every month',
    '15% Pro-Shop & Smoothie Bar Discount',
  ]);
  const [newInclusion, setNewInclusion] = useState('');

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/member-management/membership-plans/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const p = json.data;
          setName(p.name || '');
          setCode(p.code || '');
          setTier(p.tier || 'GOLD_ANNUAL');
          setDescription(p.description || '');
          setPrice(p.price ?? 899);
          setBillingCycle(p.billingCycle || 'ANNUAL');
          setInitiationFee(p.initiationFee ?? 0);
          setAccessHours(p.accessHours || '24/7 All-Access');
          setMultiBranch(!!p.multiBranch);
          setMaxFreezeDays(p.maxFreezeDays ?? 30);
          setPopular(!!p.popular);
          setStatus(p.status || 'active');
          if (Array.isArray(p.inclusions) && p.inclusions.length > 0) {
            setInclusions(p.inclusions);
          }
        }
      }
    } catch {
      toast.error('Could not load plan from server');
    } finally {
      setFetching(false);
    }
  };

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    setInclusions([...inclusions, newInclusion.trim()]);
    setNewInclusion('');
  };

  const handleRemoveInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      code,
      tier,
      description,
      price: Number(price),
      billingCycle,
      initiationFee: Number(initiationFee),
      accessHours,
      multiBranch,
      maxFreezeDays: Number(maxFreezeDays),
      popular,
      status,
      inclusions,
    };

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/member-management/membership-plans/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Membership Plan "${name}" updated successfully!`);
        navigate('/member-management/membership-plans');
        return;
      }
    } catch {
      toast.error('Failed to update membership plan');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="py-20 text-center text-muted-foreground text-sm">
          Loading membership plan parameters...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Plan: ${name}`}
        subtitle={`Configure subscription pricing, entitlements, facility hours, and promotion status for #${code || id}`}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate('/member-management/membership-plans')}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Plans</span>
          </Button>
        }
      />

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Configuration Columns (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Identity & Tier Details */}
            <Card className="border border-border/80 shadow-md">
              <CardHeader className="pb-4 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span>Plan Identity & Tier Classification</span>
                </CardTitle>
                <CardDescription>
                  Define the display title, SKU identifier, and description
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Plan Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. VIP Platinum All-Access Annual"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Plan Code (SKU)</label>
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. PLAN-VIP-01"
                      className="font-mono text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectBox
                    label="Plan Tier"
                    value={tier}
                    onChange={setTier}
                    options={[
                      { value: 'VIP_PLATINUM', label: '👑 VIP Platinum All-Access' },
                      { value: 'GOLD_ANNUAL', label: '⭐ Gold Annual All-Access' },
                      { value: 'SILVER_MONTHLY', label: '🥈 Silver Monthly Recurring' },
                      { value: 'STUDENT_CORPORATE', label: '🎓 Student & Corporate Pass' },
                      { value: 'OFF_PEAK', label: '☀️ Off-Peak Early Bird' },
                      { value: 'CLASS_PACK', label: '🎟️ 10-Class Fitness Pack' },
                    ]}
                  />

                  <SelectBox
                    label="Publication Status"
                    value={status}
                    onChange={setStatus}
                    options={[
                      { value: 'active', label: '🟢 Active (Available for Signup)' },
                      { value: 'inactive', label: '🟡 Inactive (Hidden from Catalog)' },
                      { value: 'archived', label: '⚪ Archived' },
                    ]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Plan Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Brief description of the package and target demographic..."
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Highlight as "Most Popular"</p>
                      <p className="text-[11px] text-muted-foreground">
                        Displays premium badge and top recommendation styling
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPopular(!popular)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      popular ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        popular ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Pricing, Billing & Access */}
            <Card className="border border-border/80 shadow-md">
              <CardHeader className="pb-4 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  <span>Pricing, Billing & Access Permissions</span>
                </CardTitle>
                <CardDescription>
                  Set recurring billing amounts, facility entry hours, and freeze policies
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Price ($ USD)</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="e.g. 1499"
                      required
                    />
                  </div>

                  <SelectBox
                    label="Billing Cadence"
                    value={billingCycle}
                    onChange={setBillingCycle}
                    options={[
                      { value: 'ANNUAL', label: 'Annual (/ year)' },
                      { value: 'MONTHLY', label: 'Monthly (/ month)' },
                      { value: 'QUARTERLY', label: 'Quarterly (/ 3 mos)' },
                      { value: 'PACK', label: 'Class Pack (One-off)' },
                    ]}
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Initiation Fee ($)</label>
                    <Input
                      type="number"
                      value={initiationFee}
                      onChange={(e) => setInitiationFee(Number(e.target.value))}
                      placeholder="0 for waive"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Facility Access Hours</label>
                    <Input
                      value={accessHours}
                      onChange={(e) => setAccessHours(e.target.value)}
                      placeholder="e.g. 24/7 Unlimited All-Access"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Max Freeze Allowance (Days/yr)</label>
                    <Input
                      type="number"
                      value={maxFreezeDays}
                      onChange={(e) => setMaxFreezeDays(Number(e.target.value))}
                      placeholder="e.g. 60"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Multi-Branch Flagship Access</p>
                      <p className="text-[11px] text-muted-foreground">
                        Permit turnstile entry at all partner and regional club branches
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMultiBranch(!multiBranch)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      multiBranch ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        multiBranch ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Dynamic Inclusions & Perks Manager */}
            <Card className="border border-border/80 shadow-md">
              <CardHeader className="pb-4 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Plan Inclusions & Member Entitlements</span>
                </CardTitle>
                <CardDescription>
                  List of amenities, services, and classes included with this package
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {/* Add new inclusion row */}
                <div className="flex items-center gap-2">
                  <Input
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    placeholder="e.g. Unlimited Towel Service & Spa Access..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInclusion();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddInclusion}
                    className="gap-1 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Perk</span>
                  </Button>
                </div>

                {/* Inclusions List */}
                <div className="space-y-2">
                  {inclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background hover:bg-muted/40 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-foreground">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(idx)}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Remove perk"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Plan Card Preview */}
          <div className="space-y-6">
            <div className="sticky top-20 space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live Card Preview
                </h4>
              </div>

              {/* Preview Card */}
              <Card
                className={`border transition-all flex flex-col justify-between relative overflow-hidden ${
                  popular
                    ? 'border-primary/60 shadow-xl shadow-primary/15 ring-1 ring-primary/30'
                    : 'border-border/80 bg-card shadow-md'
                }`}
              >
                {popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-l from-primary to-purple-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <CardContent className="p-6 space-y-5">
                  <div>
                    <h3 className="font-extrabold text-base text-foreground tracking-tight">
                      {name || 'Untitled Plan'}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px] mt-1">
                      {description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-foreground font-mono">
                        ${price}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        / {billingCycle?.toLowerCase()}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {code || 'PLAN-001'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{accessHours}</span>
                    </span>
                    {multiBranch && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Multi-Branch</span>
                      </span>
                    )}
                    {maxFreezeDays > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        <span>{maxFreezeDays}d Freeze</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 border-t border-border pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Plan Inclusions ({inclusions.length}):
                    </p>
                    <ul className="space-y-1.5 text-xs text-foreground">
                      {inclusions.slice(0, 5).map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                          <span className="text-muted-foreground leading-tight">{inc}</span>
                        </li>
                      ))}
                      {inclusions.length > 5 && (
                        <li className="text-[11px] text-primary font-semibold pl-6">
                          + {inclusions.length - 5} more perks...
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Action Save Box */}
              <Card className="border border-border p-4 space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 shadow-md shadow-primary/25 font-semibold text-xs h-10"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving Plan...' : 'Save Plan Changes'}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => navigate('/member-management/membership-plans')}
                >
                  Cancel
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};
