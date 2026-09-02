import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Save, Bell, Mail, Smartphone, MessageSquare, Moon, Volume2, CheckCircle2, Shield, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { INotificationPreferenceModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State initialized from authenticated user
  const [userName, setUserName] = useState('Administrator');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [inAppPushEnabled, setInAppPushEnabled] = useState(true);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [emailCadence, setEmailCadence] = useState<INotificationPreferenceModel['emailCadence']>('INSTANT');
  const [smsUrgentAlertsEnabled, setSmsUrgentAlertsEnabled] = useState(false);
  const [whatsappDispatchEnabled, setWhatsappDispatchEnabled] = useState(false);
  const [turnstileSecurityAlerts, setTurnstileSecurityAlerts] = useState(true);
  const [ptBookingReminders, setPtBookingReminders] = useState(true);
  const [invoicePaymentReceipts, setInvoicePaymentReceipts] = useState(true);
  const [emergencySosAlerts, setEmergencySosAlerts] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');
  const [status, setStatus] = useState<INotificationPreferenceModel['status']>('ACTIVE');

  useEffect(() => {
    try {
      const authRaw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (authRaw) {
        const u = JSON.parse(authRaw);
        if (u.fullName || u.name) setUserName(u.fullName || u.name);
        if (u.email) setUserEmail(u.email);
        if (u.avatar || u.avatarUrl) setUserAvatar(u.avatar || u.avatarUrl);
      }
    } catch {}
  }, []);

  const enabledCount = [
    inAppPushEnabled,
    emailDigestEnabled,
    smsUrgentAlertsEnabled,
    whatsappDispatchEnabled,
  ].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedPreference: INotificationPreferenceModel = {
      id: 'NOTIF-CURRENT-USER',
      _id: 'NOTIF-CURRENT-USER',
      userName,
      userEmail,
      userAvatar,
      inAppPushEnabled,
      emailDigestEnabled,
      emailCadence,
      smsUrgentAlertsEnabled,
      whatsappDispatchEnabled,
      turnstileSecurityAlerts,
      ptBookingReminders,
      invoicePaymentReceipts,
      emergencySosAlerts,
      quietHoursStart,
      quietHoursEnd,
      enabledChannelsCount: enabledCount,
      status,
      branchName: 'Main Campus',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('gymflow_custom_notification_preferences', JSON.stringify([updatedPreference]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-notifications', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreference),
      }).catch(() => {});

      toast.success('Notification preferences saved successfully!');
    } catch {
      toast.error('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Notification & Omni-Channel Preferences"
        subtitle="Configure real-time in-app pushes, email digests, SMS urgent alerts, WhatsApp routing, and quiet hours."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Preferences</span>
            </Button>
          </div>
        }
      />

      {/* 4 Omni-Channel Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="ACTIVE CHANNELS"
          value={`${enabledCount} Active`}
          change="Real-time Dispatch"
          trend="up"
          timeframe="Notification Matrix"
          icon={<Bell className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="EMAIL DIGEST"
          value={emailDigestEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}
          change={`Delivery: ${emailCadence}`}
          trend="up"
          timeframe="Email Hub"
          icon={<Mail className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="QUIET HOURS"
          value={`${quietHoursStart} – ${quietHoursEnd}`}
          change="Do Not Disturb"
          trend="neutral"
          timeframe="Daily Window"
          icon={<Moon className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="CHANNEL HEALTH"
          value="100% Operational"
          change="Zero Delivery Failures"
          trend="up"
          timeframe="Gateway Status"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Identity Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Notification Subscriber Identity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl border border-border">
                <Avatar className="h-12 w-12 border border-border shrink-0 shadow-sm">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{userName}</h3>
                    <Badge variant="success" className="text-[9px] font-bold">
                      VERIFIED RECIPIENT
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{userEmail || 'admin@gymflow.io'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Omni-Channel Dispatch Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                Omni-Channel Delivery Gateways
              </CardTitle>
              <CardDescription className="text-xs">
                Select communication channels used to dispatch system telemetry, turnstile scans, and receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" /> In-App Web Push
                    </span>
                    <Badge variant={inAppPushEnabled ? 'success' : 'secondary'} className="text-[10px]">
                      {inAppPushEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Receive real-time toasts and activity badges inside the web dashboard.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-7"
                    onClick={() => setInAppPushEnabled(!inAppPushEnabled)}
                  >
                    {inAppPushEnabled ? 'Disable Web Push' : 'Enable Web Push'}
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-500" /> Email Notifications
                    </span>
                    <Badge variant={emailDigestEnabled ? 'success' : 'secondary'} className="text-[10px]">
                      {emailDigestEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Receive financial receipts, summary reports, and security OTPs by email.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-7"
                    onClick={() => setEmailDigestEnabled(!emailDigestEnabled)}
                  >
                    {emailDigestEnabled ? 'Disable Email' : 'Enable Email'}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t border-border pt-4 bg-muted/20">
              <Button type="submit" disabled={loading} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Notification Preferences'}</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
