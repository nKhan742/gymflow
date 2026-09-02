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
import { Save, Palette, Globe, DollarSign, LayoutDashboard, Sliders, Laptop, Building2, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAppPreferenceModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State initialized from authenticated user
  const [userName, setUserName] = useState('Administrator');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [uiTheme, setUiTheme] = useState<IAppPreferenceModel['uiTheme']>('DARK');
  const [systemLocale, setSystemLocale] = useState<IAppPreferenceModel['systemLocale']>('en-US');
  const [displayCurrency, setDisplayCurrency] = useState<IAppPreferenceModel['displayCurrency']>('USD');
  const [defaultLandingPage, setDefaultLandingPage] = useState('/dashboard/admin-dashboard');
  const [tableDensity, setTableDensity] = useState<IAppPreferenceModel['tableDensity']>('COMFORTABLE');
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(false);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  const [timezone, setTimezone] = useState('America/New_York (EST - UTC-5)');
  const [dateFormat, setDateFormat] = useState<IAppPreferenceModel['dateFormat']>('MM/DD/YYYY');
  const [status, setStatus] = useState<IAppPreferenceModel['status']>('ACTIVE');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    try {
      const authRaw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (authRaw) {
        const u = JSON.parse(authRaw);
        if (u.fullName || u.name) setUserName(u.fullName || u.name);
        if (u.email) setUserEmail(u.email);
        if (u.avatar || u.avatarUrl) setUserAvatar(u.avatar || u.avatarUrl);
      }
      const rawProfile = localStorage.getItem('gymflow_custom_gym_profile');
      if (rawProfile) {
        const p = JSON.parse(rawProfile);
        if (p.currency) setDisplayCurrency(p.currency);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedPreference: IAppPreferenceModel = {
      id: 'PREF-CURRENT-USER',
      _id: 'PREF-CURRENT-USER',
      userName,
      userEmail,
      userAvatar,
      uiTheme,
      systemLocale,
      displayCurrency,
      defaultLandingPage,
      tableDensity,
      soundEffectsEnabled,
      autoSaveDrafts,
      timezone,
      dateFormat,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Campus',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('gymflow_custom_app_preferences', JSON.stringify([updatedPreference]));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-preferences', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreference),
      }).catch(() => {});

      toast.success('App UI and workspace preferences saved!');
    } catch {
      toast.error('Failed to update workspace preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="App UI & Workspace Preferences"
        subtitle="Personalize OLED dark/light visual themes, localized currencies, default navigation hubs, table layout density, and draft caching."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Config</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="ACTIVE THEME"
          value={uiTheme === 'DARK' ? 'OLED Dark' : 'Clean Light'}
          change="Modern High-Contrast UI"
          trend="up"
          timeframe="Theme Engine"
          icon={<Palette className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="DISPLAY CURRENCY"
          value={displayCurrency}
          change="Financial Formats"
          trend="up"
          timeframe="Localization"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="TABLE DENSITY"
          value={tableDensity}
          change="Grid Layout"
          trend="neutral"
          timeframe="Data Tables"
          icon={<Sliders className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="DEFAULT HUB"
          value="Admin Dashboard"
          change="Quick Landing"
          trend="up"
          timeframe="App Router"
          icon={<LayoutDashboard className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Identity Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Laptop className="h-4 w-4 text-primary" />
                Active Account Identity
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
                      ACTIVE USER
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{userEmail || 'admin@gymflow.io'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                Interface & Formatting Preferences
              </CardTitle>
              <CardDescription className="text-xs">
                Configure your preferred currency, layout density, and regional date formatting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Display Currency</label>
                  <Select value={displayCurrency} onValueChange={(val: any) => setDisplayCurrency(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                      <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                      <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                      <SelectItem value="CAD">CAD ($) - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD ($) - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Data Table Density</label>
                  <Select value={tableDensity} onValueChange={(val: any) => setTableDensity(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMPACT">Compact (High Information Density)</SelectItem>
                      <SelectItem value="COMFORTABLE">Comfortable (Balanced)</SelectItem>
                      <SelectItem value="SPACIOUS">Spacious (Touch / Tablet Friendly)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t border-border pt-4 bg-muted/20">
              <Button type="submit" disabled={loading} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Workspace Preferences'}</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
