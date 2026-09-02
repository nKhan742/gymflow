import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Palette, Globe, DollarSign, LayoutDashboard, Sliders, Building2, Laptop } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAppPreferenceModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [uiTheme, setUiTheme] = useState<IAppPreferenceModel['uiTheme']>('DARK');
  const [systemLocale, setSystemLocale] = useState<IAppPreferenceModel['systemLocale']>('en-US');
  const [displayCurrency, setDisplayCurrency] = useState<IAppPreferenceModel['displayCurrency']>('USD');
  const [defaultLandingPage, setDefaultLandingPage] = useState('/analytics/dashboard-analytics');
  const [tableDensity, setTableDensity] = useState<IAppPreferenceModel['tableDensity']>('COMFORTABLE');
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(false);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  const [timezone, setTimezone] = useState('America/New_York (EST - UTC-5)');
  const [dateFormat, setDateFormat] = useState<IAppPreferenceModel['dateFormat']>('MM/DD/YYYY');
  const [status, setStatus] = useState<IAppPreferenceModel['status']>('CUSTOM');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadPreference();
  }, [id]);

  const loadPreference = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_app_preferences');
      if (stored) {
        const customList: IAppPreferenceModel[] = JSON.parse(stored);
        const match = customList.find((p) => (p.id || p._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-preferences/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
      id: id || 'PREF-101',
      _id: id || 'PREF-101',
      userName: 'Sarah Jenkins',
      userEmail: 's.jenkins@gymflow.io',
      userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      uiTheme: 'DARK',
      systemLocale: 'en-US',
      displayCurrency: 'USD',
      defaultLandingPage: '/analytics/dashboard-analytics',
      tableDensity: 'COMFORTABLE',
      soundEffectsEnabled: false,
      autoSaveDrafts: true,
      timezone: 'America/New_York (EST - UTC-5)',
      dateFormat: 'MM/DD/YYYY',
      status: 'ACTIVE',
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (item: IAppPreferenceModel) => {
    setUserName(item.userName || '');
    setUserEmail(item.userEmail || '');
    setUserAvatar(item.userAvatar);
    setUiTheme(item.uiTheme || 'DARK');
    setSystemLocale(item.systemLocale || 'en-US');
    setDisplayCurrency(item.displayCurrency || 'USD');
    setDefaultLandingPage(item.defaultLandingPage || '/analytics/dashboard-analytics');
    setTableDensity(item.tableDensity || 'COMFORTABLE');
    setSoundEffectsEnabled(item.soundEffectsEnabled ?? false);
    setAutoSaveDrafts(item.autoSaveDrafts ?? true);
    setTimezone(item.timezone || 'America/New_York (EST - UTC-5)');
    setDateFormat(item.dateFormat || 'MM/DD/YYYY');
    setStatus(item.status || 'CUSTOM');
    if (item.branchId) setBranchId(item.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedPreference: Partial<IAppPreferenceModel> = {
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
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_app_preferences');
      if (stored) {
        const customList: IAppPreferenceModel[] = JSON.parse(stored);
        const index = customList.findIndex((p) => (p.id || p._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedPreference } as IAppPreferenceModel;
          localStorage.setItem('gymflow_custom_app_preferences', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'PREF-101', ...updatedPreference } as IAppPreferenceModel);
          localStorage.setItem('gymflow_custom_app_preferences', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/profile/profile-preferences/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreference),
      }).catch(() => {});

      toast.success(`Workspace preferences #${id} updated!`);
      navigate('/profile/profile-preferences');
    } catch {
      toast.error('Failed to update workspace preferences');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Preferences: ${userName || 'Staff Member'}`}
        subtitle={`Modify visual theme, localization, currency units, and default workspace views for #${id || '101'}`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/profile/profile-preferences')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Preferences</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Laptop className="h-4 w-4 text-primary" />
                Staff Workspace Identity
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

          {/* Visual Theme & Localization */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-emerald-500" />
                Visual Design, Currency & Locale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">UI Theme Mode</label>
                  <Select value={uiTheme} onValueChange={(val) => setUiTheme(val as IAppPreferenceModel['uiTheme'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DARK">🌙 Dark Mode (OLED)</SelectItem>
                      <SelectItem value="LIGHT">☀️ Light Mode</SelectItem>
                      <SelectItem value="SYSTEM">💻 Match Operating System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">System Language / Locale</label>
                  <Select value={systemLocale} onValueChange={(val) => setSystemLocale(val as IAppPreferenceModel['systemLocale'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Locale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">🇺🇸 English (United States)</SelectItem>
                      <SelectItem value="es-ES">🇪🇸 Spanish (Español)</SelectItem>
                      <SelectItem value="fr-FR">🇫🇷 French (Français)</SelectItem>
                      <SelectItem value="de-DE">🇩🇪 German (Deutsch)</SelectItem>
                      <SelectItem value="ar-SA">🇸🇦 Arabic (العربية)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Display Currency</label>
                  <Select value={displayCurrency} onValueChange={(val) => setDisplayCurrency(val as IAppPreferenceModel['displayCurrency'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">€ EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">£ GBP (British Pound)</SelectItem>
                      <SelectItem value="INR">₹ INR (Indian Rupee)</SelectItem>
                      <SelectItem value="CAD">$ CAD (Canadian Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Default Landing Workspace</label>
                  <Select value={defaultLandingPage} onValueChange={setDefaultLandingPage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Landing Page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="/analytics/dashboard-analytics">📊 Dashboard Analytics Cockpit</SelectItem>
                      <SelectItem value="/member-management/members">👥 Member Directory</SelectItem>
                      <SelectItem value="/fitness/workout-assignment">🏋️ Fitness Program Assignments</SelectItem>
                      <SelectItem value="/finance/invoices">💳 Invoices & Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Data Table Density</label>
                  <Select value={tableDensity} onValueChange={(val) => setTableDensity(val as IAppPreferenceModel['tableDensity'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Table Density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMFORTABLE">📖 Comfortable (Default)</SelectItem>
                      <SelectItem value="COMPACT">📊 Compact Density (High Data)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Date Format Display</label>
                  <Select value={dateFormat} onValueChange={(val) => setDateFormat(val as IAppPreferenceModel['dateFormat'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US Format)</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (UK/EU Format)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Behavior & Campus Scope */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Sliders className="h-4 w-4 text-purple-500" />
                Workspace Behaviors & Automation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Auto-Save Form Drafts</span>
                    <span className="text-[10px] text-muted-foreground">Persist inputs during unexpected network loss</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSaveDrafts}
                    onChange={(e) => setAutoSaveDrafts(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">System Sound FX & Chimes</span>
                    <span className="text-[10px] text-muted-foreground">Audio feedback on turnstile barcode scans</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEffectsEnabled}
                    onChange={(e) => setSoundEffectsEnabled(e.target.checked)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Timezone Alignment</label>
                  <Input
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Primary Branch Alignment
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
                Display Locale: <strong className="text-primary font-mono">{systemLocale} • {displayCurrency}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/profile/profile-preferences')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Workspace</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
