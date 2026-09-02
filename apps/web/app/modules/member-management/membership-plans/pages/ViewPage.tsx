import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Crown,
  Sparkles,
  ArrowLeft,
  Edit2,
  CheckCircle2,
  Printer,
  Users,
  CreditCard,
  Building2,
  Clock,
  Calendar,
  ShieldCheck,
  Check,
  DollarSign,
  Flame,
  FileText,
  UserCheck,
  Eye,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IPlanDetail {
  id: string;
  _id?: string;
  name: string;
  code?: string;
  description?: string;
  tier: string;
  price: number;
  currency: string;
  billingCycle: string;
  initiationFee: number;
  accessHours: string;
  multiBranch: boolean;
  inclusions: string[];
  maxFreezeDays: number;
  popular?: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IMemberSubscriber {
  id: string;
  memberCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberStatus: string;
  joinDate: string;
  renewalDate: string;
}

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<IPlanDetail | null>(null);
  const [subscribers, setSubscribers] = useState<IMemberSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanDetails();
  }, [id]);

  const loadPlanDetails = async () => {
    setLoading(true);
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
          setPlan(json.data);
        }
      }

      // Fetch enrolled members for this tier
      const memRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/members/members', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (memRes.ok) {
        const memJson = await memRes.json();
        if (memJson.success && Array.isArray(memJson.data?.items)) {
          const mapped = memJson.data.items.map((m: any) => ({
            id: m.id || m._id || m.memberCode,
            memberCode: m.memberCode || 'GF-1001',
            firstName: m.firstName || 'Gym',
            lastName: m.lastName || 'Member',
            email: m.email || 'member@gymflow.io',
            phone: m.phone || '+1 (555) 000-0000',
            memberStatus: m.memberStatus || 'ACTIVE',
            joinDate: m.membership?.startDate || '2026-01-15',
            renewalDate: m.membership?.endDate || '2027-01-15',
          }));
          setSubscribers(mapped);
        }
      }
    } catch {
      toast.error('Could not load plan details');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !plan) {
    return (
      <PageContainer>
        <div className="py-24 text-center text-muted-foreground text-sm">
          Loading membership plan 360° profile...
        </div>
      </PageContainer>
    );
  }

  const annualPrice = plan.billingCycle === 'ANNUAL' ? plan.price : plan.price * 12;
  const estimatedMRR = plan.billingCycle === 'ANNUAL' ? Math.round((plan.price / 12) * 148) : plan.price * 148;

  return (
    <PageContainer>
      {/* Top Header */}
      <PageHeader
        title={plan.name}
        subtitle={`Subscription Tier #${plan.code || 'PLAN-001'} • ${plan.billingCycle} Billing • ${plan.accessHours}`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/member-management/membership-plans')}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Plans</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              <span>Print Spec</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
              onClick={() => navigate(`/member-management/membership-plans/${plan.id || plan.code || id}/edit`)}
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Plan</span>
            </Button>

            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/member-management/members/create')}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Assign to Member</span>
            </Button>
          </div>
        }
      />

      {/* Plan Hero Banner Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                {plan.popular && <Crown className="h-5 w-5 text-amber-500" />}
                <span>{plan.name}</span>
              </h2>
              <Badge variant="outline" className="font-mono text-xs uppercase px-2 py-0.5">
                {plan.code}
              </Badge>
              {plan.popular && (
                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white text-[10px] uppercase font-bold flex items-center gap-1 border-0">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </Badge>
              )}
              <Badge variant={plan.status === 'active' ? 'success' : 'secondary'} className="capitalize text-xs">
                {plan.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl">
              {plan.description}
            </p>
          </div>

          {/* Pricing Highlight Pill */}
          <div className="shrink-0 p-4 rounded-xl bg-muted/40 border border-border text-right min-w-[200px]">
            <span className="text-3xl font-black text-foreground font-mono">
              ${plan.price}
            </span>
            <span className="text-xs text-muted-foreground ml-1 font-semibold">
              / {plan.billingCycle?.toLowerCase()}
            </span>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {plan.initiationFee > 0 ? `+$${plan.initiationFee} Initiation Fee` : '$0 Initiation Fee (Waived)'}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Top Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Subscribers"
          value="148 Members"
          change="+12 this month"
          trend="up"
          timeframe="Enrolled active passes"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Annualized Run Rate (ARR)"
          value={`$${(annualPrice * 148).toLocaleString()}`}
          change="+18.4% YoY"
          trend="up"
          timeframe="Annual contracted value"
          icon={<CreditCard className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Estimated Monthly MRR"
          value={`$${estimatedMRR.toLocaleString()}`}
          change="Top Revenue Tier"
          trend="up"
          timeframe="Monthly recurring billing"
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Freeze Allowance"
          value={plan.maxFreezeDays ? `${plan.maxFreezeDays} Days / yr` : 'No Freeze'}
          change="Medical & Vacation"
          trend="neutral"
          timeframe="Annual pause quota"
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="entitlements" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-11 p-1">
          <TabsTrigger value="entitlements">Plan Entitlements & Amenities</TabsTrigger>
          <TabsTrigger value="policies">Billing & Access Policies</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribed Members (148)</TabsTrigger>
        </TabsList>

        {/* Tab 1: Entitlements & Amenities */}
        <TabsContent value="entitlements" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inclusions Checklist (2 Cols) */}
            <Card className="lg:col-span-2 border border-border/80">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Included Amenities & Service Inclusions</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive list of perks granted to members with this tier
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(plan.inclusions || []).map((inc, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground"
                    >
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="font-medium leading-relaxed">{inc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Facility & Gate Permissions */}
            <Card className="border border-border/80">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Facility Access Permissions</span>
                </CardTitle>
                <CardDescription>Biometric & turnstile rule definitions</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-3.5 text-xs">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Operating Access:</span>
                  <span className="font-semibold text-foreground">{plan.accessHours}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Multi-Branch Access:</span>
                  <Badge variant={plan.multiBranch ? 'success' : 'outline'} className="text-[11px]">
                    {plan.multiBranch ? 'All Flagship Locations' : 'Home Branch Only'}
                  </Badge>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Guest Pass Allowance:</span>
                  <span className="font-semibold text-foreground">
                    {plan.popular ? '2 Passes / Month' : '1 Pass / Month'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Turnstile Verification:</span>
                  <span className="font-semibold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Biometric & RFID
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Billing Policies */}
        <TabsContent value="policies" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/80">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  <span>Subscription & Billing Cadence</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Billing Schedule:</span>
                  <span className="font-semibold text-foreground capitalize">
                    {plan.billingCycle.toLowerCase()} recurring
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Base Price:</span>
                  <span className="font-semibold text-foreground font-mono">${plan.price} USD</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Initiation / Setup:</span>
                  <span className="font-semibold text-foreground">
                    {plan.initiationFee > 0 ? `$${plan.initiationFee}` : 'Waived ($0)'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Auto-Debit Mechanism:</span>
                  <span className="font-semibold text-primary">Stripe & Bank ACH</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Freeze & Cancellation Policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Annual Freeze Cap:</span>
                  <span className="font-semibold text-foreground">
                    {plan.maxFreezeDays ? `${plan.maxFreezeDays} Calendar Days` : 'Not eligible'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Freeze Fee:</span>
                  <span className="font-semibold text-foreground">$0 (Included free)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Cancellation Notice:</span>
                  <span className="font-semibold text-foreground">30-Day Written Notice</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Early Termination:</span>
                  <span className="font-semibold text-foreground">Waived for Medical relocation</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Subscribed Members */}
        <TabsContent value="subscribers" className="space-y-4 pt-2">
          <Card className="border border-border/80">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/60">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  <span>Enrolled Members ({subscribers.length})</span>
                </CardTitle>
                <CardDescription>Members currently subscribed to this membership package</CardDescription>
              </div>
              <Button
                size="sm"
                className="gap-1 text-xs"
                onClick={() => navigate('/member-management/members/create')}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Add Member</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Member</th>
                      <th className="px-4 py-3">Member ID</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Joined Date</th>
                      <th className="px-4 py-3">Renewal Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs">
                              {sub.firstName.charAt(0)}
                            </div>
                            <span className="font-semibold text-foreground">
                              {sub.firstName} {sub.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-primary">
                          {sub.memberCode}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {sub.email}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(sub.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium">
                          {new Date(sub.renewalDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="success" className="text-[10px] capitalize">
                            {sub.memberStatus.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
                            onClick={() => navigate(`/member-management/members/${sub.id}`)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> View 360°
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
