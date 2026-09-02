import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Handshake,
  Edit2,
  Building2,
  ArrowLeft,
  RefreshCw,
  Clock,
  DollarSign,
  Activity,
  Award,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IPersonalTrainingPackage } from '../types';
import { DEFAULT_PT_PACKAGES } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<IPersonalTrainingPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackageData();
  }, [id]);

  const loadPackageData = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_personal_training');
      const customList: IPersonalTrainingPackage[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (p) => p.id === id || p.packageCode === id || p._id === id || p.id?.toLowerCase() === id?.toLowerCase() || p.packageCode?.toLowerCase() === id?.toLowerCase()
      );

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/personal-training/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setPkg(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setPkg(customMatch);
        setLoading(false);
        return;
      }

      const fallback = DEFAULT_PT_PACKAGES.find(
        (p) => p.id === id || p.packageCode === id || p.id?.toLowerCase() === id?.toLowerCase() || p.packageCode?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setPkg(fallback);
      } else {
        setPkg({
          id: id || 'PT-PKG-CUSTOM',
          packageCode: id || 'PT-PKG-CUSTOM',
          memberId: 'MEM-001',
          memberName: 'Client Member',
          coachId: 'STF-001',
          coachName: 'Lead Personal Trainer',
          packageTier: 'TIER_20_SESSIONS',
          totalSessionsPurchased: 20,
          sessionsCompleted: 4,
          sessionsRemaining: 16,
          hourlyRate: 85,
          totalPackagePrice: 1700,
          commissionPercentage: 60,
          startDate: '2026-08-01',
          expiryDate: '2026-11-01',
          status: 'ACTIVE',
          branchId: 'ALL',
          branchName: 'All Locations',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_personal_training');
      const customList: IPersonalTrainingPackage[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((p) => p.id === id || p.packageCode === id);
      const fallback = customMatch || DEFAULT_PT_PACKAGES.find((p) => p.id === id || p.packageCode === id) || DEFAULT_PT_PACKAGES[0];
      setPkg(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !pkg) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading PT Package Telemetry...</div>
        </div>
      </PageContainer>
    );
  }

  const completionPercent = Math.round(((pkg.sessionsCompleted || 0) / (pkg.totalSessionsPurchased || 1)) * 100);
  const coachPayout = ((pkg.totalPackagePrice * (pkg.commissionPercentage || 60)) / 100);

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/personal-training')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All PT Packages</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {pkg.memberName} • 1-on-1 PT Hub
              <span className="text-xs font-mono text-muted-foreground font-normal">({pkg.packageCode})</span>
            </h1>
            <p className="text-xs text-muted-foreground">Personal Trainer: {pkg.coachName} • Valid to {pkg.expiryDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/personal-training/${pkg.id || pkg._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Package</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <img
                src={pkg.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={pkg.memberName}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-border/80 shrink-0 shadow-sm"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{pkg.memberName}</h2>
                  <Badge variant="success" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {pkg.status}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {pkg.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Tier: <strong className="text-foreground font-mono">{pkg.packageTier ? String(pkg.packageTier).replace('TIER_', '').replace(/_/g, ' ') : 'Standard'}</strong></span>
                  <span>•</span>
                  <span>Assigned Trainer: <strong className="text-primary font-mono">{pkg.coachName}</strong></span>
                </div>
              </div>
            </div>

            {/* Remaining Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Credit Balance</div>
                <div className="text-xs font-bold text-foreground font-mono">{pkg.sessionsRemaining} Sessions Remaining</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Rate: ${pkg.hourlyRate} / hr</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Rendered Sessions</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{pkg.sessionsCompleted} / {pkg.totalSessionsPurchased}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Total Package Price</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">${pkg.totalPackagePrice?.toLocaleString()}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Coach Commission</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">${coachPayout?.toLocaleString()} ({pkg.commissionPercentage}%)</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Contract Expiry</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{pkg.expiryDate}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="sessions" className="text-xs font-semibold gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Session History & Completed Logs
          </TabsTrigger>
          <TabsTrigger value="contract" className="text-xs font-semibold gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Contract & Commission Breakdown
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SESSIONS */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1-on-1 PT Completed Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground">Session #14 • Heavy Squat Technique & Spotting</div>
                  <div className="text-[11px] text-muted-foreground">Aug 28, 2026 • 60 Mins • Coach Marcus</div>
                </div>
                <Badge variant="success" className="text-xs">Turnstile Verified</Badge>
              </div>
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground">Session #13 • Bench Press Bar Path Correction</div>
                  <div className="text-[11px] text-muted-foreground">Aug 25, 2026 • 60 Mins • Coach Marcus</div>
                </div>
                <Badge variant="success" className="text-xs">Turnstile Verified</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CONTRACT */}
        <TabsContent value="contract" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Package Financial Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
                <div className="font-bold text-foreground">Financial Ledger:</div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Gross Package Revenue:</span>
                  <span className="font-mono font-bold text-foreground">${pkg.totalPackagePrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Trainer Direct Commission ({pkg.commissionPercentage}%):</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${coachPayout?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Club Retained Margin:</span>
                  <span className="font-mono font-bold text-primary">${(pkg.totalPackagePrice - coachPayout)?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
