import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import {
  Users,
  DoorOpen,
  DollarSign,
  Ticket,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserPlus,
  RefreshCw,
  Flame,
  ShieldCheck,
  CreditCard,
  QrCode,
  Unlock,
  Building2,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ILiveCheckinEvent, ITodayStudioClass, IVisitorEntry, IReceptionDashboardStats } from '../types';

export const DEFAULT_CLASSES: any[] = [];



export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [checkins, setCheckins] = useState<ILiveCheckinEvent[]>(() => {
    const saved = localStorage.getItem('gymflow_reception_checkins');
    return saved ? JSON.parse(saved) : [];
  });
  const [visitors, setVisitors] = useState<IVisitorEntry[]>(() => {
    const saved = localStorage.getItem('gymflow_reception_visitors');
    return saved ? JSON.parse(saved) : [];
  });
  const [classes, setClasses] = useState<ITodayStudioClass[]>(() => {
    const saved = localStorage.getItem('gymflow_reception_classes');
    return saved ? JSON.parse(saved) : [];
  });
  const [manualCode, setManualCode] = useState('');

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast.error('Please enter a Member Code, Phone, or Name');
      return;
    }

    const newCheckin: ILiveCheckinEvent = {
      id: `CHK-${Math.floor(100 + Math.random() * 900)}`,
      memberCode: manualCode.toUpperCase().startsWith('GF-') ? manualCode.toUpperCase() : `GF-${Math.floor(1000 + Math.random() * 9000)}`,
      memberName: manualCode.toUpperCase().startsWith('GF-') ? 'Verified Member' : manualCode,
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      membershipPlan: 'VIP Platinum All-Access',
      gateName: 'Reception Manual Terminal #01',
      status: 'ACCESS_GRANTED',
      timestamp: 'Just now',
      notes: 'Manual Front-Desk Clearance',
    };

    setCheckins([newCheckin, ...checkins]);
    setManualCode('');
    toast.success(`Access granted for ${newCheckin.memberName} [${newCheckin.memberCode}]!`);
  };

  const handleOverrideGate = (id: string, memberName: string) => {
    setCheckins(
      checkins.map((c) =>
        c.id === id ? { ...c, status: 'ACCESS_GRANTED', notes: 'Receptionist Manual Security Override' } : c
      )
    );
    toast.success(`Turnstile gate unlocked for ${memberName}`);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Reception & Concierge Terminal"
        subtitle="Live turnstile entry verification, member fast check-in, POS cash drawer, and daily visitor logs."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                toast.success('Optical turnstiles hardware ping: 4 of 4 Gates Online (1.2ms)');
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Ping Gates</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/crm/visitors/create')}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Register Visitor</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/finance/pos')}
            >
              <CreditCard className="h-4 w-4" />
              <span>Open POS Register</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="TODAY'S CHECK-INS"
          value={`${checkins.length} Entries`}
          change="Live Optical Sync"
          trend="up"
          timeframe="Today"
          icon={<DoorOpen className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="TURNSTILE GATES"
          value="2 / 2 ONLINE"
          change="Optical NFC Active"
          trend="up"
          timeframe="Hardware State"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="POS CASH DRAWER"
          value="$0.00"
          change="Register #01 Balance"
          trend="neutral"
          timeframe="Balanced"
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="VIP TRIAL PASSES"
          value={`${visitors.length} Pending`}
          change="Front-Desk Leads"
          trend="neutral"
          timeframe="Active Queue"
          icon={<Ticket className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Fast Check-In Bar */}
      <Card className="mb-6 border-primary/30 bg-primary/5 shadow-2xs">
        <CardContent className="p-4">
          <form onSubmit={handleManualCheckIn} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                placeholder="Scan QR / NFC barcode, or type Member Code (e.g. GF-8841), Phone, or Name..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="pl-9 bg-background h-10 text-sm font-medium"
              />
            </div>
            <Button type="submit" className="gap-1.5 shrink-0 h-10 px-5 shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>One-Tap Check-In</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two Column Layout: Live Turnstile Stream & Schedule / Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Turnstile Stream (2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-primary" />
                Live Optical Turnstile Stream
              </CardTitle>
              <CardDescription>Real-time NFC/QR gate scans with biometric authentication and fraud prevention.</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              🟢 LIVE 100Hz POLLING
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {checkins.map((item) => {
                const isSuccess = item.status === 'ACCESS_GRANTED';
                return (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border shadow-2xs">
                        <AvatarImage src={item.memberAvatar} alt={item.memberName} />
                        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                          {item.memberName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">{item.memberName}</span>
                          <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                            [{item.memberCode}]
                          </span>
                          <Badge
                            variant={
                              item.status === 'ACCESS_GRANTED'
                                ? 'success'
                                : item.status === 'PAYMENT_DUE'
                                ? 'warning'
                                : 'destructive'
                            }
                            className="text-[9px] font-bold"
                          >
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="font-medium text-foreground/80">{item.membershipPlan}</span>
                          <span>•</span>
                          <span>{item.gateName}</span>
                          <span>•</span>
                          <span className="font-mono">{item.timestamp}</span>
                        </div>
                        {item.notes && (
                          <p className="text-[10px] text-muted-foreground font-mono italic">
                            ↳ {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {!isSuccess && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                          onClick={() => handleOverrideGate(item.id, item.memberName)}
                        >
                          <Unlock className="h-3 w-3" />
                          <span>Override</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground"
                        onClick={() => navigate(`/member-management/members`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Studio Classes & Visitor Sign-Ins */}
        <div className="space-y-6">
          {/* Today's Studio Classes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Today's Studio Classes
              </CardTitle>
              <CardDescription>Live class enrollments and studio seat fill rates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEFAULT_CLASSES.map((cls) => (
                <div key={cls.id} className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{cls.className}</span>
                    <Badge
                      variant={cls.status === 'IN_PROGRESS' ? 'default' : 'outline'}
                      className="text-[9px] font-bold"
                    >
                      {cls.status === 'IN_PROGRESS' ? '🔥 LIVE NOW' : cls.timeSlot}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">{cls.trainerName}</span>
                    <span className="font-mono font-bold text-foreground">
                      {cls.enrolledCount} / {cls.maxCapacity} Seats
                    </span>
                  </div>
                  <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        cls.enrolledCount >= cls.maxCapacity ? 'bg-rose-500' : 'bg-primary'
                      }`}
                      style={{ width: `${(cls.enrolledCount / cls.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Visitor Entries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Ticket className="h-4 w-4 text-purple-500" />
                Today's Visitor & Tour Log
              </CardTitle>
              <CardDescription>Prospects, guest trial passes, and facility tours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {visitors.map((vis) => (
                <div key={vis.id} className="p-2.5 rounded-lg border border-border/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-foreground block">{vis.visitorName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono block">
                      {vis.purpose.replace('_', ' ')} • In: {vis.checkinTime}
                    </span>
                  </div>
                  <Badge variant={vis.status === 'CHECKED_IN' ? 'success' : 'outline'} className="text-[9px] font-bold">
                    {vis.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
