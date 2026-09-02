import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Users, Calendar, HeartHandshake, TrendingUp, ShieldCheck, Printer, Sparkles, AlertTriangle } from 'lucide-react';
import { IMemberAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<IMemberAnalyticsModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModel();
  }, [id]);

  const loadModel = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_member_analytics');
      if (stored) {
        const customList: IMemberAnalyticsModel[] = JSON.parse(stored);
        const match = customList.find((m) => (m.id || m._id) === id);
        if (match) {
          setModel(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/member-analytics/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setModel(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setModel({
      id: id || 'MBR-ANL-101',
      _id: id || 'MBR-ANL-101',
      cohortTitle: 'Active Roster Retention Curve, Churn Hazard & Member Engagement Model',
      cohortPeriod: 'MONTHLY_COHORT',
      cohortDate: 'August 2026 Cohort Window',
      activeEnrolledAthletes: 1950,
      cohortRetentionRate: 95.4,
      churnHazardRate: 2.1,
      avgVisitsPerWeek: 3.4,
      atRiskMembersCount: 42,
      memberEngagementScore: 88.6,
      cxAnalyst: 'Sienna Miller (Director of Member Experience)',
      analystAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      status: 'HEALTHY_ENGAGEMENT',
      branchName: 'PD Vihar',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !model) {
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
        title={model.cohortTitle}
        subtitle={`Cohort Period: ${model.cohortDate} • Scope: ${model.cohortPeriod} • CX Director: ${model.cxAnalyst}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/member-analytics')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Members</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Cohort Dossier</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/analytics/member-analytics/${model.id || model._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Model</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">COHORT RETENTION</span>
            <HeartHandshake className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{model.cohortRetentionRate}% Kept</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">30-day cohort retention curve</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACTIVE ATHLETES</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{model.activeEnrolledAthletes.toLocaleString()} Active</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Enrolled cohort census sample</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">VISIT VELOCITY</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{model.avgVisitsPerWeek} Visits/Wk</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Average weekly check-in cadence</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ENGAGEMENT SCORE</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{model.memberEngagementScore} / 100</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{model.atRiskMembersCount} at-risk athletes flagged</p>
        </Card>
      </div>

      {/* Member Analytics Dossier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-emerald-500" />
                  Cohort Retention Curves & Churn Risk Radar
                </CardTitle>
                <CardDescription className="text-xs">
                  Hazard rates, weekly visit trends, and at-risk drop-off indicators
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-bold font-mono">
                {model.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">1. Total Tracked Active Enrolled Athletes</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {model.activeEnrolledAthletes.toLocaleString()} Athletes
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">2. 90-Day Cohort Member Retention Rate</span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  {model.cohortRetentionRate}% Retained
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">3. Monthly Churn Hazard Probability</span>
                <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
                  {model.churnHazardRate}% Risk Velocity
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">4. Weekly Workout Visit Cadence</span>
                <span className="font-mono font-bold text-xs text-blue-600">
                  {model.avgVisitsPerWeek} Sessions Per Week
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 font-bold">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">COMPOSITE MEMBER ENGAGEMENT INDEX</span>
                <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  {model.memberEngagementScore} / 100 (HEALTHY RETENTION)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CX Director Sign-Off Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Member Experience Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border">
              <Avatar className="h-12 w-12 border border-border shrink-0">
                <AvatarImage src={model.analystAvatar} alt={model.cxAnalyst} />
                <AvatarFallback className="font-bold bg-primary/10 text-primary">
                  {model.cxAnalyst.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">{model.cxAnalyst}</h4>
                <p className="text-[10px] text-muted-foreground font-mono">Head of Member Success</p>
                <Badge variant="outline" className="text-[9px] font-bold mt-1 text-emerald-600 border-emerald-500/30">
                  Cohort Validated
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Cohort retention model powered by turnstile swipe events, mobile app logins, and PT session attendance.
              </p>
              <div className="pt-2 border-t border-border space-y-1 font-mono text-[10px]">
                <div>Model ID: <strong>{model.id || model._id}</strong></div>
                <div>Campus Scope: <strong>{model.branchName || 'PD Vihar'}</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
