import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, DollarSign, Calendar, TrendingUp, ShieldCheck, CheckCircle2, Building2, Printer, PieChart } from 'lucide-react';
import { IRevenueAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<IRevenueAnalyticsModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModel();
  }, [id]);

  const loadModel = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_revenue_analytics');
      if (stored) {
        const customList: IRevenueAnalyticsModel[] = JSON.parse(stored);
        const match = customList.find((m) => (m.id || m._id) === id);
        if (match) {
          setModel(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/revenue-analytics/${id}`, {
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
      id: id || 'REV-ANL-101',
      _id: id || 'REV-ANL-101',
      modelTitle: 'Monthly Recurring Revenue (MRR) & Cohort Monetization Yield Model',
      reportingCadence: 'MONTHLY',
      dateRange: 'August 2026 Cohort Window',
      mrrAmount: 148500,
      arrAmount: 1782000,
      arpuAmount: 76.15,
      cacPaybackMonths: 2.4,
      ltvToCacRatio: 4.8,
      subscriptionYieldPercent: 68.5,
      ptYieldPercent: 21.0,
      posRetailYieldPercent: 10.5,
      analystName: 'Helena Frost (Lead Pricing Strategist)',
      analystAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'VALIDATED',
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
        title={model.modelTitle}
        subtitle={`Cohort Scope: ${model.dateRange} • Model Cadence: ${model.reportingCadence} • Compiled by ${model.analystName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/revenue-analytics')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Models</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Model</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/analytics/revenue-analytics/${model.id || model._id}/edit`)}
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
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MONTHLY MRR</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">${model.mrrAmount.toLocaleString()} USD</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Normalized monthly run-rate</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ANNUAL RUN-RATE</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">${model.arrAmount.toLocaleString()} USD</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">12-Month forward projection</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ARPU YIELD</span>
            <PieChart className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">${model.arpuAmount.toFixed(2)} USD</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Blended revenue per active user</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LTV : CAC RATIO</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{model.ltvToCacRatio}x Multiple</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{model.cacPaybackMonths} Months payback speed</p>
        </Card>
      </div>

      {/* Revenue Model Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  Revenue Streams & Monetization Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Portfolio stream yields, subscription dues, and add-on attach rates
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs font-bold font-mono">
                {model.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">1. Recurring Member Dues & Subscriptions Yield</span>
                <span className="font-mono font-bold text-xs text-primary">
                  {model.subscriptionYieldPercent}% (${Math.round((model.mrrAmount * model.subscriptionYieldPercent) / 100).toLocaleString()} USD)
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">2. 1-on-1 Personal Training (PT) Packages & Consultations</span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  {model.ptYieldPercent}% (${Math.round((model.mrrAmount * model.ptYieldPercent) / 100).toLocaleString()} USD)
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">3. Point-of-Sale (POS) Retail, Merch & Smoothie Bar</span>
                <span className="font-mono font-bold text-xs text-amber-600">
                  {model.posRetailYieldPercent}% (${Math.round((model.mrrAmount * model.posRetailYieldPercent) / 100).toLocaleString()} USD)
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">4. Customer Acquisition Cost (CAC) Payback Window</span>
                <span className="font-mono font-bold text-xs text-blue-600">
                  {model.cacPaybackMonths} Months
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 font-bold">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">ESTIMATED ATHLETE LIFETIME VALUE (LTV : CAC)</span>
                <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  {model.ltvToCacRatio}x MULTIPLE (EXCELLENT ROI)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Strategist Sign-Off Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Strategic Pricing Clearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border">
              <Avatar className="h-12 w-12 border border-border shrink-0">
                <AvatarImage src={model.analystAvatar} alt={model.analystName} />
                <AvatarFallback className="font-bold bg-primary/10 text-primary">
                  {model.analystName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">{model.analystName}</h4>
                <p className="text-[10px] text-muted-foreground font-mono">Lead Pricing & Monetization</p>
                <Badge variant="outline" className="text-[9px] font-bold mt-1 text-emerald-600 border-emerald-500/30">
                  Model Certified
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Monetization assumptions derived from Stripe recurring cashflows, member cohort churn rates, and point-of-sale logs.
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
