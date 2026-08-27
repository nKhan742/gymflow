import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  QrCode,
  Flame,
  CheckCircle2,
  Snowflake,
  RefreshCw,
  Plus,
  Heart,
  ShieldCheck,
  FileText,
  FileDown,
  User,
  Crown,
  Dumbbell,
  Clock,
  Sparkles,
  Edit2,
  Lock,
  Building2,
  AlertCircle,
  Activity,
  Award,
} from 'lucide-react';
import { memberApi, IMemberItem } from '../api/memberApi';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

const WEIGHT_PROGRESSION = [
  { date: 'Apr 2026', weight: 74.2, bodyFat: 21.4 },
  { date: 'May 2026', weight: 72.8, bodyFat: 20.1 },
  { date: 'Jun 2026', weight: 71.5, bodyFat: 19.2 },
  { date: 'Jul 2026', weight: 69.8, bodyFat: 18.5 },
  { date: 'Aug 2026', weight: 68.4, bodyFat: 17.8 },
];

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<IMemberItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    setLoading(true);
    try {
      const data = await memberApi.getMemberById(id || 'GF-3109');
      setMember(data);
    } catch {
      toast.error('Failed to load member profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFastCheckIn = async () => {
    if (!member) return;
    try {
      await memberApi.checkInMember(member.id || member.memberCode);
      toast.success(`Check-In Verified: ${member.firstName} ${member.lastName}`, {
        description: 'Biometric turnstile gate unlocked successfully.',
      });
      loadMember();
    } catch {
      toast.error('Check-in failed');
    }
  };

  const handleFreeze = async () => {
    if (!member) return;
    try {
      await memberApi.freezeMember(member.id || member.memberCode, 30, 'Member Request');
      toast.info('Membership put on 30-day hold', {
        description: 'Turnstile access will remain paused until unfreeze.',
      });
      loadMember();
    } catch {
      toast.error('Freeze failed');
    }
  };

  const handleRenew = async () => {
    if (!member) return;
    try {
      await memberApi.renewMember(member.id || member.memberCode, 12);
      toast.success('Membership successfully renewed for 12 months!', {
        description: 'Updated anniversary date and generated tax invoice.',
      });
      loadMember();
    } catch {
      toast.error('Renewal failed');
    }
  };

  if (loading || !member) {
    return (
      <PageContainer>
        <div className="py-24 text-center text-muted-foreground text-sm">
          Loading 360° member telemetry profile...
        </div>
      </PageContainer>
    );
  }

  const startDate = new Date(member.membership?.startDate || member.createdAt || '2026-01-15');
  const endDate = new Date(member.membership?.endDate || '2027-01-15');
  const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const elapsedDays = Math.max(0, Math.min(totalDays, Math.round((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))));
  const progressPercent = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
  const daysLeft = Math.max(0, Math.round((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <PageContainer>
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-1">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => navigate('/member-management/members')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Member Directory</span>
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Branch:</span>
          <span className="font-mono text-foreground font-semibold px-2 py-0.5 rounded bg-muted">
            HQ Flagship Center
          </span>
        </div>
      </div>

      {/* 🌟 360° Luxury Hero Profile Card */}
      <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Avatar & Personal Coordinates */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-primary/25">
                {member.firstName.charAt(0)}
                {member.lastName.charAt(0)}
              </div>
              <span
                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card flex items-center justify-center ${
                  member.memberStatus === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                title={`Status: ${member.memberStatus}`}
              >
                <CheckCircle2 className="h-3 w-3 text-white" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  {member.firstName} {member.lastName}
                </h1>
                <Badge
                  variant={member.memberStatus === 'ACTIVE' ? 'success' : 'warning'}
                  className="text-xs font-bold px-2 py-0.5 capitalize"
                >
                  {member.memberStatus.toLowerCase()}
                </Badge>
                <Badge variant="outline" className="font-mono text-xs font-bold px-2 py-0.5 bg-background">
                  #{member.memberCode}
                </Badge>
              </div>

              {/* Coordinates Pill Strip */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 bg-background/80 px-2 py-1 rounded-md border border-border/60">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>{member.email}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-background/80 px-2 py-1 rounded-md border border-border/60">
                  <Phone className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{member.phone}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-background/80 px-2 py-1 rounded-md border border-border/60">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    Member since {startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shadow-xs"
              onClick={() => setShowQR(!showQR)}
            >
              <QrCode className="h-4 w-4 text-primary" />
              <span>Digital Pass</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shadow-xs"
              onClick={() => navigate(`/member-management/members/${member.id || member.memberCode}/edit`)}
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 shadow-xs"
              onClick={handleFreeze}
            >
              <Snowflake className="h-4 w-4" />
              <span>Freeze</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-primary hover:bg-primary/10 shadow-xs"
              onClick={handleRenew}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Renew</span>
            </Button>

            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 bg-primary text-primary-foreground font-semibold"
              onClick={handleFastCheckIn}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Check-In</span>
            </Button>
          </div>
        </div>

        {/* Digital QR Pass Drawer */}
        {showQR && (
          <div className="mt-5 p-4 rounded-xl border border-border bg-background flex items-center justify-between animate-in fade-in-50">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-white rounded-xl border border-border text-black shadow-xs">
                <QrCode className="h-12 w-12" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Biometric Digital Pass: #{member.memberCode}-PASS
                </p>
                <p className="text-xs text-muted-foreground">
                  Scan at turnstiles, smart lockers ({member.lockerNumber || 'L-101'}), or self-service kiosks
                </p>
              </div>
            </div>
            <Badge variant="success" className="font-semibold">Access Authorized</Badge>
          </div>
        )}
      </div>

      {/* 📑 8 Specialized Profile Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-11 p-1">
          <TabsTrigger value="overview">Overview & Telemetry</TabsTrigger>
          <TabsTrigger value="attendance">Attendance & Access</TabsTrigger>
          <TabsTrigger value="workout">Workout Protocols</TabsTrigger>
          <TabsTrigger value="diet">Diet & Macros</TabsTrigger>
          <TabsTrigger value="bmi">BMI & Measurements</TabsTrigger>
          <TabsTrigger value="billing">Invoices & Billing</TabsTrigger>
          <TabsTrigger value="medical">Medical & Waiver</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* 🌟 Tab 1: Overview (Completely Redesigned & Beautiful) */}
        <TabsContent value="overview" className="space-y-5 pt-2">
          {/* Top 4 KPI Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Plan Tier */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Package
                </span>
                <Crown className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-foreground truncate">
                  {member.membership?.planName || 'Gold Annual Pass'}
                </p>
                <p className="text-xs text-primary font-mono font-bold mt-0.5">
                  ${member.membership?.price || 899} / year
                </p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Auto-Renewal:</span>
                <span className="font-semibold text-emerald-500">Enabled</span>
              </div>
            </div>

            {/* KPI 2: Attendance Streak */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Attendance Consistency
                </span>
                <Flame className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-foreground">
                  {member.stats?.totalVisits || 84} Check-Ins
                </p>
                <p className="text-xs text-emerald-500 font-semibold mt-0.5 flex items-center gap-1">
                  <span>{member.stats?.visitsThisMonth || 14} Visits this month</span>
                </p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Streak:</span>
                <span className="font-semibold text-foreground">
                  {member.stats?.streakDays ? `${member.stats.streakDays} Days in a row 🔥` : 'Active'}
                </span>
              </div>
            </div>

            {/* KPI 3: Assigned Trainer */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Personal Coach
                </span>
                <Dumbbell className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-foreground truncate">
                  {member.assignedTrainer?.name || 'Marcus Thorne'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {member.assignedTrainer?.email || 'coach@gymflow.io'}
                </p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Specialty:</span>
                <span className="font-semibold text-primary">Strength & Hypertrophy</span>
              </div>
            </div>

            {/* KPI 4: Locker & Gate Security */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Smart Locker
                </span>
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-mono font-extrabold text-foreground">
                  {member.lockerNumber || 'L-204'}
                </p>
                <p className="text-xs text-muted-foreground">Executive Locker Zone</p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Access Level:</span>
                <span className="font-semibold text-emerald-500">24/7 All-Access</span>
              </div>
            </div>
          </div>

          {/* Main 2-Column Overview Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column: Subscription Lifecycle & Entitlements (2 Cols) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Card 1: Subscription Lifecycle & Validity Progress */}
              <Card className="border border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>Membership Subscription Lifecycle</span>
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {daysLeft} Days Remaining
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                      <span>Joined: {startDate.toLocaleDateString()}</span>
                      <span>Progress: {progressPercent}%</span>
                      <span>Expires: {endDate.toLocaleDateString()}</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Plan Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                        Tier Level
                      </span>
                      <span className="font-bold text-foreground text-xs block mt-0.5">
                        {member.membership?.tier?.replace(/_/g, ' ') || 'GOLD ANNUAL'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                        Annual Rate
                      </span>
                      <span className="font-bold text-foreground text-xs block mt-0.5 font-mono">
                        ${member.membership?.price || 899} / yr
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                        Freeze Quota
                      </span>
                      <span className="font-bold text-foreground text-xs block mt-0.5">
                        30 Days / yr
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                        Turnstile Verification
                      </span>
                      <span className="font-bold text-emerald-500 text-xs block mt-0.5">
                        Biometric & RFID
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Included Perks & Class Entitlements */}
              <Card className="border border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Included Amenities & Facility Entitlements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {[
                      '24/7 Access to Free Weights, Machines & Cardio Deck',
                      'Unlimited Group Fitness Classes (Spin, HIIT, Yoga)',
                      'Executive Sauna, Steam Room & Hydro-Spa Access',
                      'Dedicated Smart Locker Assignment with digital PIN',
                      '1 Complimentary Monthly Guest Pass',
                      '10% Pro-Shop & Nutrition Smoothie Bar Discount',
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-muted/20 text-foreground"
                      >
                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Emergency & Medical Safeguards (1 Col) */}
            <div className="space-y-5">
              {/* Emergency Contact Card */}
              <Card className="border border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span>Emergency Contact</span>
                  </CardTitle>
                  <CardDescription>Primary guardian & next-of-kin</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Contact Name:</span>
                    <span className="font-semibold text-foreground">
                      {member.emergencyContact?.name || 'Lily Chen'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Relationship:</span>
                    <span className="font-semibold text-foreground">
                      {member.emergencyContact?.relationship || 'Sister'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Phone Number:</span>
                    <span className="font-semibold text-primary font-mono">
                      {member.emergencyContact?.phone || '+1 (555) 891-9944'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">PAR-Q Waiver:</span>
                    <Badge variant="success" className="text-[10px]">
                      Cleared & Signed
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Mini-Feed */}
              <Card className="border border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>Recent Access Telemetry</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-foreground truncate">Main Entrance Turnstile #1</p>
                      <p className="text-[10px] text-muted-foreground">Today at 07:30 AM • Facial Biometric</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-foreground truncate">Locker Room Door #4</p>
                      <p className="text-[10px] text-muted-foreground">Yesterday at 06:15 PM • RFID Wristband</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Attendance */}
        <TabsContent value="attendance" className="pt-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Biometric & RFID Access Log</CardTitle>
                <CardDescription>Recorded entry timestamps across facility turnstiles</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1 text-xs">
                <FileDown className="h-3.5 w-3.5" />
                <span>Export Attendance History</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border text-sm">
                <div className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Main Entrance Turnstile #2</p>
                      <p className="text-xs text-muted-foreground">Today at 07:30 AM • Facial Biometric</p>
                    </div>
                  </div>
                  <Badge variant="success">Access Granted</Badge>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Executive Locker Room Door</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 06:15 PM • RFID Wristband</p>
                    </div>
                  </div>
                  <Badge variant="success">Access Granted</Badge>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Main Entrance Turnstile #1</p>
                      <p className="text-xs text-muted-foreground">Aug 24, 2026 at 07:15 AM • Facial Biometric</p>
                    </div>
                  </div>
                  <Badge variant="success">Access Granted</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Workouts */}
        <TabsContent value="workout" className="pt-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Training Protocol</CardTitle>
                <CardDescription>
                  Assigned by Coach {member.assignedTrainer?.name || 'Marcus Thorne'} • Focus: Strength & Power
                </CardDescription>
              </div>
              <Button size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Assign New Routine</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-foreground text-sm">Day 1: Upper Body Strength & Hypertrophy</h4>
                  <Badge variant="default">4 Sets / Exercise</Badge>
                </div>
                <div className="divide-y divide-border text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-foreground">1. Barbell Incline Bench Press</span>
                    <span className="text-muted-foreground">4 Sets × 8 Reps @ 65kg</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-foreground">2. Weighted Pull-Ups</span>
                    <span className="text-muted-foreground">4 Sets × 6 Reps @ +10kg</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-foreground">3. Standing Dumbbell Overhead Press</span>
                    <span className="text-muted-foreground">3 Sets × 10 Reps @ 20kg</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-foreground">4. Cable Lateral Raises (Dropset)</span>
                    <span className="text-muted-foreground">3 Sets × 15 Reps</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Diet & Macros */}
        <TabsContent value="diet" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Nutritional Prescription</CardTitle>
              <CardDescription>Daily macronutrient targets (2,400 kcal)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border text-center">
                  <p className="text-xs text-muted-foreground font-semibold">Protein Target</p>
                  <p className="text-xl font-bold text-primary mt-1">160g</p>
                  <p className="text-[10px] text-muted-foreground">30% Total Cal</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border text-center">
                  <p className="text-xs text-muted-foreground font-semibold">Carbohydrates</p>
                  <p className="text-xl font-bold text-amber-500 mt-1">260g</p>
                  <p className="text-[10px] text-muted-foreground">45% Total Cal</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border text-center">
                  <p className="text-xs text-muted-foreground font-semibold">Healthy Fats</p>
                  <p className="text-xl font-bold text-emerald-500 mt-1">65g</p>
                  <p className="text-[10px] text-muted-foreground">25% Total Cal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: BMI & Measurements */}
        <TabsContent value="bmi" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Weight & Body Composition Trajectory</CardTitle>
              <CardDescription>5-month progressive measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={WEIGHT_PROGRESSION}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#8b5cf6" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="#10b981" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Invoices & Billing */}
        <TabsContent value="billing" className="pt-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Billing History & Invoices</CardTitle>
                <CardDescription>Auto-renewing card: Visa ending in •••• 4092</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Update Payment Method</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border text-xs">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">Invoice #INV-2026-081</p>
                    <p className="text-muted-foreground">
                      {member.membership?.planName || 'Gold Annual Pass'} • Paid via Card
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground font-mono">
                      ${member.membership?.price || 899}.00
                    </p>
                    <Badge variant="success" className="text-[10px] mt-0.5">Paid</Badge>
                  </div>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">Invoice #INV-2025-014</p>
                    <p className="text-muted-foreground">Personal Training 20x Session Pack</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground font-mono">$800.00</p>
                    <Badge variant="success" className="text-[10px] mt-0.5">Paid</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: Medical */}
        <TabsContent value="medical" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Medical Clearance & Health History</CardTitle>
              <CardDescription>Confidential health questionnaire and liability release</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-semibold text-foreground">Physician Clearance Certificate</p>
                    <p className="text-muted-foreground">Valid through March 2027</p>
                  </div>
                </div>
                <Badge variant="success">Cleared for Heavy Lifting</Badge>
              </div>
              <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Heart className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-foreground">Cardiovascular History</p>
                    <p className="text-muted-foreground">No prior cardiac conditions reported</p>
                  </div>
                </div>
                <Badge variant="secondary">Normal</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 8: Documents */}
        <TabsContent value="documents" className="pt-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Member Documents & Agreements</CardTitle>
                <CardDescription>Digitally signed contracts and identity verification</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Upload Document</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Signed Membership Agreement (#{member.memberCode}).pdf
                    </p>
                    <p className="text-muted-foreground">E-signed via GymFlow DocuSign • 1.2 MB</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="gap-1">
                  <FileDown className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
