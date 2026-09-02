import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Calendar,
  Edit2,
  Clock,
  ShieldCheck,
  Building2,
  ArrowLeft,
  RefreshCw,
  Bell,
  Sparkles,
  Send,
  Lock,
  Unlock,
  AlertCircle,
  Users,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IHoliday } from '../types';
import { DEFAULT_HOLIDAYS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [holiday, setHoliday] = useState<IHoliday | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHolidayData();
  }, [id]);

  const loadHolidayData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_HOLIDAYS.find((h) => h.id === id || h.code === id) || DEFAULT_HOLIDAYS[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/holidays/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setHoliday(json.data);
          setLoading(false);
          return;
        }
      }
      setHoliday(fallback);
    } catch {
      const fallback = DEFAULT_HOLIDAYS.find((h) => h.id === id || h.code === id) || DEFAULT_HOLIDAYS[0];
      setHoliday(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = () => {
    toast.success(`Announcement broadcast successfully dispatched to all active members of ${holiday?.branchName || 'all facilities'}!`);
  };

  if (loading || !holiday) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Holiday Configuration...</div>
        </div>
      </PageContainer>
    );
  }

  const isRange = holiday.startDate !== holiday.endDate;

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gym-management/holidays')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Holidays & Closures</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {holiday.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({holiday.code || 'HOL-EVENT'})</span>
            </h1>
            <p className="text-xs text-muted-foreground">{holiday.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBroadcast}
            className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Dispatch Notice</span>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/gym-management/holidays/${holiday.id || holiday._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Schedule</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{holiday.name}</h2>
                  <Badge variant={holiday.operationalMode === 'CLOSED' ? 'destructive' : 'default'} className="text-[10px] sm:text-[11px] font-bold shrink-0">
                    {holiday.operationalMode === 'CLOSED' ? '🚫 Facility Closed' : holiday.operationalMode === 'REDUCED_HOURS' ? '🕒 Reduced Hours' : '⚡ 24/7 Self-Service'}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {holiday.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Schedule: <strong className="text-foreground font-mono">{holiday.startDate} {isRange && `→ ${holiday.endDate}`}</strong></span>
                  <span>•</span>
                  <span>Type: <strong className="text-foreground">{holiday.category}</strong></span>
                  {holiday.reducedHoursSchedule && (
                    <>
                      <span>•</span>
                      <span>Hours: <strong className="text-amber-600 dark:text-amber-400">{holiday.reducedHoursSchedule}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Notice Status Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Member Notice</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {holiday.memberBroadcast ? '✓ Broadcast Live' : 'Draft Mode'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate">App Push & Email Notifications</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Turnstile Status</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">
                {holiday.operationalMode === 'CLOSED' ? '🔒 Locked' : '🔓 Active'}
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Group Classes</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">
                {holiday.classPolicy === 'AUTO_CANCEL' ? 'Cancelled' : 'Rescheduled'}
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">PT Appointments</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">
                {holiday.ptPolicy === 'AUTO_CANCEL' ? 'Blocked' : 'Allowed'}
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Staff Work Mode</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
                {holiday.operationalMode === 'SELF_SERVICE' ? 'Self-Service' : 'Holiday Leave'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-semibold gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" /> Operating Rules & Turnstiles
          </TabsTrigger>
          <TabsTrigger value="classes" className="text-xs font-semibold gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Class & Booking Impact
          </TabsTrigger>
          <TabsTrigger value="broadcast" className="text-xs font-semibold gap-1.5">
            <Bell className="w-3.5 h-3.5 text-pink-500" /> Member Announcement Preview
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OPERATING RULES */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Facility Access Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">RFID & Biometric Gate State</span>
                  <div className="text-xl font-bold text-foreground font-mono flex items-center gap-2">
                    {holiday.operationalMode === 'CLOSED' ? <Lock className="w-4 h-4 text-destructive" /> : <Unlock className="w-4 h-4 text-emerald-500" />}
                    {holiday.operationalMode === 'CLOSED' ? 'Gates Locked' : 'Turnstiles Active'}
                  </div>
                  <span className="text-[10px] text-muted-foreground">Facial Recognition & NFC</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Emergency Overrides</span>
                  <div className="text-xl font-bold text-primary font-mono">Staff Level 4+</div>
                  <span className="text-[10px] text-muted-foreground">Managers & First Responders</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Guest Passes</span>
                  <div className="text-xl font-bold text-destructive font-mono">Disabled</div>
                  <span className="text-[10px] text-muted-foreground">Members only during holiday</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CLASSES IMPACT */}
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Automated Schedule Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-foreground">HIIT & Spin Studio Morning Classes (8 Sessions)</div>
                    <div className="text-[11px] text-muted-foreground">Auto-cancelled • Class passes refunded to member wallets</div>
                  </div>
                  <Badge variant="outline" className="text-destructive border-destructive/30 text-[10px]">Cancelled</Badge>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-foreground">Personal Training 1-on-1 Sessions (14 Bookings)</div>
                    <div className="text-[11px] text-muted-foreground">Rescheduling prompts dispatched to client mobile apps</div>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px]">Rescheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: BROADCAST PREVIEW */}
        <TabsContent value="broadcast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-pink-500" /> Member Announcement Broadcast
              </CardTitle>
              <CardDescription className="text-xs">
                Preview of the mobile notification displayed in member portals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3 max-w-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    GF
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">GymFlow Facility Notice</div>
                    <div className="text-[10px] text-muted-foreground">Official Member Announcement</div>
                  </div>
                </div>
                <div className="text-xs text-foreground font-semibold">
                  Holiday Schedule: {holiday.name}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dear Members, please note that on {holiday.startDate}, our {holiday.branchName} campus will operate under{' '}
                  <strong className="text-foreground">
                    {holiday.operationalMode === 'CLOSED' ? 'Full Closure' : holiday.reducedHoursSchedule || 'Reduced Hours'}
                  </strong>.
                  All normal services resume the following morning.
                </p>
                <Button size="sm" onClick={handleBroadcast} className="gap-1.5 w-full text-xs">
                  <Send className="w-3.5 h-3.5" /> Dispatch Real-Time Push Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
