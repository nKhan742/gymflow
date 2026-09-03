import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { Save, ShieldCheck, Building2, Mail, DollarSign, Lock, Globe, RefreshCw, KeyRound, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { ISystemSettingsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

const getInitialSettings = (): ISystemSettingsModel => {
  let gymName = 'My Gym Facility';
  let email = 'admin@mygym.com';
  let currency = 'USD';

  try {
    const rawProfile = localStorage.getItem('gymflow_custom_gym_profile');
    if (rawProfile) {
      const p = JSON.parse(rawProfile);
      if (p.name) gymName = p.name;
      if (p.email) email = p.email;
      if (p.currency) currency = p.currency;
    }
    const rawUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u.email && !email) email = u.email;
    }
  } catch {}

  return {
    orgName: gymName,
    legalBusinessName: `${gymName} LLC`,
    taxIdGstNumber: '',
    logoUrl: '',
    faviconUrl: '',
    supportEmail: email,
    supportPhone: '',
    primaryCurrency: currency,
    currencySymbol: currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$',
    timezone: 'America/New_York (EST / UTC-5)',

    requireMfaPolicy: true,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90,
    ipQuorumWhitelist: '',

    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    senderDisplayName: `${gymName} Notifications`,
    webhookSecretKey: '',
    slackAlertWebhook: '',

    defaultTaxRatePercent: 0,
    gracePeriodDays: 3,
    autoDebitRetryCount: 3,
    maintenanceMode: false,
  };
};

export const ListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<ISystemSettingsModel>(getInitialSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const initial = getInitialSettings();
    const stored = localStorage.getItem('gymflow_custom_admin_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...initial, ...parsed });
      } catch {
        setSettings(initial);
      }
    } else {
      setSettings(initial);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem('gymflow_custom_admin_settings', JSON.stringify(settings));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/settings', {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      }).catch(() => {});

      toast.success('Global system configuration & security policies updated successfully!');
    } catch {
      toast.error('Failed to update system settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Global Administration & System Settings"
        subtitle="Manage SaaS organization profile, security compliance rules, zero-trust MFA, SMTP routing, and financial defaults."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shadow-xs"
              onClick={loadSettings}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset Defaults</span>
            </Button>
            <Button
              size="sm"
              disabled={loading}
              onClick={handleSave}
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Configuration'}</span>
            </Button>
          </div>
        }
      />

      {/* 4 Global System Health KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="SECURITY POSTURE"
          value={settings.requireMfaPolicy ? 'MFA Enforced' : 'Standard Auth'}
          change="Zero-Trust Policy"
          trend="up"
          timeframe="Tenant Policy"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="SESSION TIMEOUT"
          value={`${settings.sessionTimeoutMinutes} Mins`}
          change="Inactivity Lock"
          trend="neutral"
          timeframe="OWASP Standard"
          icon={<Lock className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="PRIMARY CURRENCY"
          value={`${settings.primaryCurrency} (${settings.currencySymbol})`}
          change="Ledger Standard"
          trend="up"
          timeframe="Base Exchange"
          icon={<DollarSign className="h-5 w-5 text-purple-500" />}
        />
        <MetricCard
          title="PASSWORD ROTATION"
          value={`${settings.passwordExpiryDays} Days`}
          change="Automated Expiry"
          trend="up"
          timeframe="Compliance Cycle"
          icon={<KeyRound className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: SaaS Organization Identity */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Organization & Commercial Profile
            </CardTitle>
            <CardDescription className="text-xs">
              Configure master brand names, billing legal entity title, and consumer-facing support lines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Organization Display Name</label>
                <Input
                  value={settings.orgName}
                  onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                  placeholder="e.g. Apex Performance Gyms"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Legal Commercial Entity Name</label>
                <Input
                  value={settings.legalBusinessName}
                  onChange={(e) => setSettings({ ...settings, legalBusinessName: e.target.value })}
                  placeholder="e.g. Apex Fitness Enterprises LLC"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tax ID / GSTIN / EIN Number</label>
                <Input
                  value={settings.taxIdGstNumber}
                  onChange={(e) => setSettings({ ...settings, taxIdGstNumber: e.target.value })}
                  placeholder="e.g. US-EIN-12345678"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Customer Support Email</label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  placeholder="support@mygym.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Customer Support Phone</label>
                <Input
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  placeholder="+1 (800) 555-0199"
                />
              </div>
            </div>

            {/* Logo & Favicon upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <ImageUpload
                label="Master Organization Logo"
                value={settings.logoUrl}
                onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                maxSizeMb={3}
              />
              <ImageUpload
                label="Application Browser Favicon"
                value={settings.faviconUrl}
                onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                maxSizeMb={1}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Currency & Localization */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Currency & Timezone Localization
            </CardTitle>
            <CardDescription className="text-xs">
              Primary GAAP reporting currency, financial symbol, and member calendar timezones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Primary Operating Currency</label>
                <Select
                  value={settings.primaryCurrency}
                  onValueChange={(val) => {
                    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: '$', AUD: '$', AED: 'AED ' };
                    setSettings({ ...settings, primaryCurrency: val, currencySymbol: symbols[val] || '$' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                    <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                    <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                    <SelectItem value="CAD">CAD ($) - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD ($) - Australian Dollar</SelectItem>
                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Currency Symbol</label>
                <Input
                  value={settings.currencySymbol}
                  onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                  placeholder="$"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Facility Master Timezone</label>
                <Input
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  placeholder="America/New_York (EST / UTC-5)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Zero-Trust Security Policies */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Security Governance & Zero-Trust MFA
            </CardTitle>
            <CardDescription className="text-xs">
              Enforce multi-factor authentication, automatic lockouts, and session idle windows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Enforce Staff 2FA / MFA</label>
                <Select
                  value={settings.requireMfaPolicy ? 'YES' : 'NO'}
                  onValueChange={(val) => setSettings({ ...settings, requireMfaPolicy: val === 'YES' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">🟢 Required for All Staff</SelectItem>
                    <SelectItem value="NO">⚪ Optional / Voluntary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Session Timeout (Minutes)</label>
                <Input
                  type="number"
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value) || 30 })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Max Login Attempts (Lockout)</label>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Password Expiry (Days)</label>
                <Input
                  type="number"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => setSettings({ ...settings, passwordExpiryDays: parseInt(e.target.value) || 90 })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">IP Quorum Whitelist (Optional CIDR Blocks)</label>
              <Input
                value={settings.ipQuorumWhitelist}
                onChange={(e) => setSettings({ ...settings, ipQuorumWhitelist: e.target.value })}
                placeholder="e.g. 192.168.1.0/24 (leave blank for unrestricted secure access)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Email SMTP & Notification Routing */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              SMTP Email Delivery Gateway
            </CardTitle>
            <CardDescription className="text-xs">
              Configure SMTP credentials for transactional invoices, OTPs, and turnstile alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">SMTP Host Server</label>
                <Input
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  placeholder="e.g. smtp.sendgrid.net or smtp.gmail.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">SMTP Port</label>
                <Input
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })}
                  placeholder="587"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Sender Display Name</label>
                <Input
                  value={settings.senderDisplayName}
                  onChange={(e) => setSettings({ ...settings, senderDisplayName: e.target.value })}
                  placeholder="e.g. GymFlow Notifications"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Webhook Secret Signing Key</label>
                <Input
                  type="password"
                  value={settings.webhookSecretKey}
                  onChange={(e) => setSettings({ ...settings, webhookSecretKey: e.target.value })}
                  placeholder="e.g. whsec_..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Slack Incident Alerts Webhook (Optional)</label>
                <Input
                  value={settings.slackAlertWebhook}
                  onChange={(e) => setSettings({ ...settings, slackAlertWebhook: e.target.value })}
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-border pt-4 bg-muted/20">
            <Button
              type="submit"
              disabled={loading}
              className="gap-1.5 font-bold shadow-md shadow-primary/25"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save All Settings'}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  );
};
