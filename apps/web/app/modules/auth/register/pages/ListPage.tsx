import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shared/components/ui/select';
import {
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Dumbbell,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../../../../core/store/authStore';
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '../../../../core/store/currencyStore';
import { usePlanStore } from '../../../../core/store/planStore';
import { PLAN_DEFINITIONS, PlanTier, BillingCycle } from '../../../../core/config/planFeaturesConfig';
import { formatCurrency } from '../../../../core/helpers/formatters';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { setPlan } = usePlanStore();
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } = useCurrencyStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Organization State
  const [gymName, setGymName] = useState('');
  const [campusName, setCampusName] = useState('');
  const [city, setCity] = useState('');
  const [currency, setCurrency] = useState(globalCurrency || 'INR');
  const [planTier, setPlanTier] = useState<PlanTier>('PROFESSIONAL');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error('Please enter your full name, work email, and password.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymName) {
      toast.error('Please enter your Gym or Athletic Club name.');
      return;
    }

    setLoading(true);

    try {
      // 1. Try Backend Registration API
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          gymName,
          campusName: campusName || `${gymName} Main Campus`,
          city: city || 'San Francisco',
          currency,
          planTier,
        }),
      });

      const resData = await res.json().catch(() => null);

      if (res.ok && resData?.success && resData?.data) {
        const { user, tokens, gymProfile, branch } = resData.data;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));

        if (gymProfile) {
          localStorage.setItem('gymflow_custom_gym_profile', JSON.stringify(gymProfile));
        }
        if (branch) {
          localStorage.setItem('gymflow_custom_gym_branches', JSON.stringify([branch]));
          localStorage.setItem(STORAGE_KEYS.ACTIVE_BRANCH, branch.id || branch._id || branch.code);
        }

        setAuth(user, tokens.accessToken, tokens.refreshToken);
        setPlan(planTier, billingCycle);
        toast.success(`🎉 Welcome to GymFlow ERP, ${fullName}! Your database workspace has been initialized.`);
        navigate('/dashboard/admin-dashboard');
        return;
      } else {
        const errMsg =
          resData?.message ||
          resData?.errors?.[0]?.message ||
          (typeof resData?.errors === 'string' ? resData.errors : null) ||
          'Registration failed. An account with this email may already exist.';

        if (errMsg.toLowerCase().includes('already exists')) {
          toast.error(errMsg, {
            action: {
              label: 'Go to Login',
              onClick: () => navigate('/auth/login'),
            },
          });
        } else {
          toast.error(errMsg);
        }
        setLoading(false);
        return;
      }
    } catch (err: any) {
      toast.error(err?.message || 'Network connection failed. Please check your backend server.');
      setLoading(false);
      return;
    }

    // 2. Client-side Local Registration & Bootstrapping
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Admin';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const newUser = {
      id: `usr_${Date.now()}`,
      email,
      firstName,
      lastName,
      fullName,
      phone,
      role: 'SUPER_ADMIN',
      roleName: 'Super Administrator',
      department: 'Executive Leadership',
      branchName: campusName || `${gymName} Flagship Campus`,
      mfaEnabled: false,
      status: 'ACTIVE',
      securityScore: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newBranch = {
      id: 'BR-001',
      code: 'GF-HQ-01',
      name: campusName || `${gymName} Flagship Campus`,
      tagline: 'Main performance & athletic center',
      phone: phone || '+1 (555) 019-2830',
      email,
      sqFt: 18000,
      capacity: 300,
      currentOccupancy: 0,
      memberCount: 0,
      staffCount: 1,
      turnstileCount: 2,
      monthlyRevenue: 0,
      address: {
        street: '100 Fitness Blvd',
        city: city || 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
      },
      status: 'active',
    };

    const newProfile = {
      id: 'default',
      name: gymName,
      code: 'GF-MAIN',
      tagline: 'Premier Athletic Club & Wellness Facility',
      description: `${gymName} powered by GymFlow ERP Enterprise.`,
      logo: '',
      currency,
      defaultTaxRate: 8.0,
      invoiceHeader: `${gymName} • Official Tax Invoice`,
      invoiceFooter: `Thank you for training with ${gymName}.`,
      is24x7: false,
      maxCapacity: 300,
      currentOccupancy: 0,
      address: newBranch.address,
      contacts: {
        phone: phone || '+1 (555) 019-2830',
        email,
        website: `https://${gymName.toLowerCase().replace(/[^a-z0-9]/g, '')}.gymflow.io`,
      },
      amenities: ['Strength Zone', 'Cardio Mezzanine', 'Locker Suites'],
      zones: [],
      status: 'active',
    };

    // Store custom local data
    const existingUsersRaw = localStorage.getItem('gymflow_custom_admin_users');
    const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw as string) : [];
    localStorage.setItem('gymflow_custom_admin_users', JSON.stringify([...existingUsers, newUser]));

    localStorage.setItem('gymflow_custom_gym_branches', JSON.stringify([newBranch]));
    localStorage.setItem('gymflow_custom_gym_profile', JSON.stringify(newProfile));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BRANCH, 'BR-001');

    const token = `jwt_session_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));

    setAuth(newUser as any, token);
    setPlan(planTier, billingCycle);
    setLoading(false);

    toast.success(`🎉 Welcome to GymFlow, ${firstName}! Your gym workspace has been created.`);
    navigate('/dashboard/admin-dashboard');
  };

  return (
    <Card className="border border-border/80 shadow-2xl bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden max-w-lg w-full">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-primary/30">
          <Dumbbell className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create GymFlow Account</CardTitle>
        <CardDescription>
          {step === 1 ? 'Step 1 of 2: Set up your administrator credentials' : 'Step 2 of 2: Configure your gym & campus identity'}
        </CardDescription>

        {/* Mini Step Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className={`h-1.5 w-12 rounded-full transition-all ${step === 1 ? 'bg-primary' : 'bg-primary/40'}`} />
          <div className={`h-1.5 w-12 rounded-full transition-all ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </CardHeader>

      {step === 1 ? (
        <form onSubmit={handleNextStep}>
          <CardContent className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Full Name *</label>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Vance"
                icon={<User className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Business Email Address *</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@yourgym.com"
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Phone Number</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2830"
                icon={<Phone className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Password *</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock className="h-4 w-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Confirm Password *</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-3">
            <Button type="submit" className="w-full gap-2 font-semibold shadow-md shadow-primary/25">
              <span>Next: Gym Details</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Already have an enterprise account?</span>
              <button
                type="button"
                onClick={() => navigate('/auth/login')}
                className="text-primary hover:underline font-semibold"
              >
                Sign In
              </button>
            </div>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Gym / Fitness Brand Name *</label>
              <Input
                type="text"
                required
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                placeholder="e.g. Apex Athletic Performance"
                icon={<Building2 className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Primary Branch Name</label>
                <Input
                  type="text"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  placeholder="e.g. Flagship Campus"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">City / State</label>
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Operating Currency (App-Wide Default)</label>
              <Select
                value={currency}
                onValueChange={(val) => {
                  setCurrency(val);
                  setGlobalCurrency(val);
                }}
              >
                <SelectTrigger className="h-10 rounded-xl bg-background/80 dark:bg-card/70 border-input text-sm text-foreground">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} ({c.symbol}) — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Interactive Software Plan Tier Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Select Software Plan Tier</label>
                {/* Billing Cycle Pill Toggle */}
                <div className="inline-flex items-center p-0.5 rounded-lg bg-muted border border-border text-[11px]">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('MONTHLY')}
                    className={`px-2.5 py-0.5 rounded-md font-semibold transition-all ${
                      billingCycle === 'MONTHLY'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('ANNUAL')}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold transition-all ${
                      billingCycle === 'ANNUAL'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="px-1 py-0.1 rounded text-[9px] bg-amber-400 text-slate-950 font-bold">
                      Save ₹{planTier === 'ENTERPRISE' ? '6k' : planTier === 'PROFESSIONAL' ? '5k' : '3k'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['ESSENTIAL', 'PROFESSIONAL', 'ENTERPRISE'] as PlanTier[]).map((tier) => {
                  const plan = PLAN_DEFINITIONS[tier];
                  const isSelected = planTier === tier;
                  const priceFormatted =
                    billingCycle === 'MONTHLY'
                      ? `₹${plan.pricing.monthlyINR.toLocaleString('en-IN')}`
                      : `₹${plan.pricing.annualINR.toLocaleString('en-IN')}`;
                  const periodSuffix = billingCycle === 'MONTHLY' ? '/mo' : '/yr';

                  return (
                    <div
                      key={tier}
                      onClick={() => setPlanTier(tier)}
                      className={`relative p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                          : plan.recommended
                          ? 'border-indigo-500/50 bg-indigo-50/10 dark:bg-indigo-950/10 hover:border-indigo-500'
                          : 'border-border/80 bg-background/60 hover:border-border hover:bg-muted/40'
                      }`}
                    >
                      {plan.recommended && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-primary text-[9px] font-bold text-white shadow-xs">
                          ⭐ Recommended
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-foreground">{plan.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                      <div className="text-base font-extrabold text-foreground tracking-tight">
                        {priceFormatted}
                        <span className="text-[10px] font-normal text-muted-foreground">{periodSuffix}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                        {plan.bestFor}
                      </p>
                      {billingCycle === 'ANNUAL' && (
                        <div className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Save ₹{plan.pricing.annualSavingsINR.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Feature Summary */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Automated Tenant & Currency Provisioning</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Your database workspace will be provisioned in <strong>{currency}</strong> with POS billing, memberships, and invoices synchronized automatically.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-3">
            <div className="flex items-center gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/3"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-2/3 gap-2 font-semibold shadow-md shadow-primary/25"
                loading={loading}
              >
                <Sparkles className="h-4 w-4" />
                <span>Register & Launch</span>
              </Button>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  );
};
