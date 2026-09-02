import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Bell, Mail, MessageSquare, Smartphone, Building2, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { INotificationPreferenceModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [userName, setUserName] = useState('Sarah Jenkins');
  const [userEmail, setUserEmail] = useState('s.jenkins@gymflow.io');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [inAppPushEnabled, setInAppPushEnabled] = useState(true);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [emailCadence, setEmailCadence] = useState<INotificationPreferenceModel['emailCadence']>('INSTANT');
  const [smsUrgentAlertsEnabled, setSmsUrgentAlertsEnabled] = useState(true);
  const [whatsappDispatchEnabled, setWhatsappDispatchEnabled] = useState(true);
  const [turnstileSecurityAlerts, setTurnstileSecurityAlerts] = useState(true);
  const [ptBookingReminders, setPtBookingReminders] = useState(true);
  const [invoicePaymentReceipts, setInvoicePaymentReceipts] = useState(true);
  const [emergencySosAlerts, setEmergencySosAlerts] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');
  const [status, setStatus] = useState<INotificationPreferenceModel['status']>('ACTIVE');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `NOTIF-${Math.floor(100 + Math.random() * 900)}`;

    const enabledChannelsCount = [
      inAppPushEnabled,
      emailDigestEnabled,
      smsUrgentAlertsEnabled,
      whatsappDispatchEnabled,
    ].filter(Boolean).length;

    const newPreference: INotificationPreferenceModel = {
      id: newId,
      _id: newId,
      userName,
      userEmail,
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
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
      enabledChannelsCount,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_notification_preferences');
      const customList: INotificationPreferenceModel[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newPreference);
      localStorage.setItem('gymflow_custom_notification_preferences', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-notifications', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreference),
      }).catch(() => {});

      toast.success(`Notification preferences saved for "${userName}"!`);
      navigate('/profile/profile-notifications');
    } catch {
      toast.error('Failed to save notification preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Configure Notification & Dispatch Channels"
        subtitle="Customize omni-channel routing for in-app push, email digests, SMS urgent alerts, WhatsApp webhooks, and quiet hours."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/profile/profile-notifications')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Notifications</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Staff Recipient Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Staff Member Avatar</label>
                  <ImageUpload
                    value={userAvatar}
                    onChange={(url) => setUserAvatar(url)}
                    variant="avatar"
                    helperText="Upload official profile portrait"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-500" />
                Active Delivery Channels
              </CardTitle>
              <CardDescription className="text-xs">
                Select which hardware and software gateways to receive system telemetry on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-xs font-semibold text-foreground block">In-App Push Alerts</span>
                      <span className="text-[10px] text-muted-foreground">Instant bell badge & web toast</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={inAppPushEnabled}
                    onChange={(e) => setInAppPushEnabled(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="text-xs font-semibold text-foreground block">Email Dispatch</span>
                      <span className="text-[10px] text-muted-foreground">Digest reports & receipts</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigestEnabled}
                    onChange={(e) => setEmailDigestEnabled(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="h-4 w-4 text-amber-500" />
                    <div>
                      <span className="text-xs font-semibold text-foreground block">SMS Gateway</span>
                      <span className="text-[10px] text-muted-foreground">High priority short text</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsUrgentAlertsEnabled}
                    onChange={(e) => setSmsUrgentAlertsEnabled(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="h-4 w-4 text-emerald-500" />
                    <div>
                      <span className="text-xs font-semibold text-foreground block">WhatsApp Dispatch</span>
                      <span className="text-[10px] text-muted-foreground">Automated bot notifications</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappDispatchEnabled}
                    onChange={(e) => setWhatsappDispatchEnabled(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email Cadence Frequency</label>
                  <Select value={emailCadence} onValueChange={(val) => setEmailCadence(val as INotificationPreferenceModel['emailCadence'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Email Cadence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INSTANT">⚡ Instant Delivery</SelectItem>
                      <SelectItem value="DAILY_DIGEST">📅 Daily Digest (08:00 EST)</SelectItem>
                      <SelectItem value="WEEKLY_SUMMARY">📊 Weekly Summary (Monday)</SelectItem>
                      <SelectItem value="DISABLED">🚫 Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Account Notification State</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as INotificationPreferenceModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active & Dispatching</SelectItem>
                      <SelectItem value="DO_NOT_DISTURB">🌙 Do Not Disturb (DND)</SelectItem>
                      <SelectItem value="PAUSED">⏸️ Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Moon className="h-4 w-4 text-purple-500" />
                Quiet Hours & Critical Event Triggers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border rounded-xl">
                  <span className="text-xs font-semibold text-foreground">1. Turnstile Hardware Access & Tailgating Alerts</span>
                  <input
                    type="checkbox"
                    checked={turnstileSecurityAlerts}
                    onChange={(e) => setTurnstileSecurityAlerts(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border rounded-xl">
                  <span className="text-xs font-semibold text-foreground">2. 1-on-1 PT Booking & Studio Schedule Changes</span>
                  <input
                    type="checkbox"
                    checked={ptBookingReminders}
                    onChange={(e) => setPtBookingReminders(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border rounded-xl">
                  <span className="text-xs font-semibold text-foreground">3. Member Invoice & POS Payment Receipts</span>
                  <input
                    type="checkbox"
                    checked={invoicePaymentReceipts}
                    onChange={(e) => setInvoicePaymentReceipts(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border rounded-xl">
                  <span className="text-xs font-semibold text-rose-600 font-bold">4. Emergency Campus SOS & Fire Drills</span>
                  <input
                    type="checkbox"
                    checked={emergencySosAlerts}
                    onChange={(e) => setEmergencySosAlerts(e.target.checked)}
                    className="h-4 w-4 accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Quiet Hours Start</label>
                  <Input
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Quiet Hours End</label>
                  <Input
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Scope
                  </label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Dispatch Status: <strong className="text-emerald-600">Active Omni-Channel</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/profile/profile-notifications')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Save Preferences</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
