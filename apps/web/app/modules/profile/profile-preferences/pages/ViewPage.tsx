import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Palette, Globe, DollarSign, LayoutDashboard, Sliders, Laptop, Printer, CheckCircle2 } from 'lucide-react';
import { IAppPreferenceModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [preference, setPreference] = useState<IAppPreferenceModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreference();
  }, [id]);

  const loadPreference = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_app_preferences');
      if (stored) {
        const customList: IAppPreferenceModel[] = JSON.parse(stored);
        const match = customList.find((p) => (p.id || p._id) === id);
        if (match) {
          setPreference(match);
          setLoading(false);
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
          setPreference(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setPreference({
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
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !preference) {
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
        title={`Workspace Preferences: ${preference.userName}`}
        subtitle={`${preference.userEmail} • Active Theme: ${preference.uiTheme} • Scope: ${preference.branchName || 'Main Facility'}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/profile/profile-preferences')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Preferences</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Config</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/profile/profile-preferences/${preference.id || preference._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Workspace</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">UI THEME ENGINE</span>
            <Palette className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{preference.uiTheme} MODE</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">OLED contrast rendering</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SYSTEM LOCALE</span>
            <Globe className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{preference.systemLocale}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{preference.timezone}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CURRENCY SYMBOL</span>
            <DollarSign className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{preference.displayCurrency} ($)</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Date: {preference.dateFormat}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">WORKSPACE STATUS</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold font-mono text-primary mt-1">{preference.status}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{preference.tableDensity} density</p>
        </Card>
      </div>

      {/* Workspace Settings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Workspace Layout & Behavioral Configuration
                </CardTitle>
                <CardDescription className="text-xs">
                  User experience customization, caching behaviors, and localization parameters
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-bold font-mono">
                {preference.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">1. Active Visual Palette & Contrast</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {preference.uiTheme} Theme Mode
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">2. Default Landing Dashboard Hub</span>
                <span className="font-mono font-bold text-xs text-primary">
                  {preference.defaultLandingPage}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">3. System Timezone & Formatting</span>
                <span className="font-mono text-xs text-foreground">
                  {preference.timezone} • {preference.dateFormat}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">4. Auto-Save Drafts & Cache Persistence</span>
                <Badge variant={preference.autoSaveDrafts ? 'default' : 'outline'} className="text-[10px] font-mono">
                  {preference.autoSaveDrafts ? '🟢 ENABLED' : 'DISABLED'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 font-bold">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">LOCALIZATION & CURRENCY</span>
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  {preference.systemLocale} ({preference.displayCurrency})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Profile Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Laptop className="h-4 w-4 text-primary" />
              Workspace Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border">
              <Avatar className="h-12 w-12 border border-border shrink-0">
                <AvatarImage src={preference?.userAvatar} alt={preference?.userName || 'User'} />
                <AvatarFallback className="font-bold bg-primary/10 text-primary">
                  {(preference?.userName || 'User').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">{preference.userName}</h4>
                <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px]">{preference.userEmail}</p>
                <Badge variant="default" className="text-[9px] font-bold mt-1">
                  CONFIG SYNCHRONIZED
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                User workspace preferences are applied dynamically to CSS variables and React Context providers.
              </p>
              <div className="pt-2 border-t border-border space-y-1 font-mono text-[10px]">
                <div>Config ID: <strong>{preference.id || preference._id}</strong></div>
                <div>Campus Scope: <strong>{preference.branchName || 'Main Facility'}</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
