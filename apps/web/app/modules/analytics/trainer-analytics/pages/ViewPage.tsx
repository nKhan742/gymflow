import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Dumbbell, Calendar, DollarSign, Award, Star, TrendingUp, ShieldCheck, Printer } from 'lucide-react';
import { ITrainerAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<ITrainerAnalyticsModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModel();
  }, [id]);

  const loadModel = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_analytics');
      if (stored) {
        const customList: ITrainerAnalyticsModel[] = JSON.parse(stored);
        const match = customList.find((m) => (m.id || m._id) === id);
        if (match) {
          setModel(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/trainer-analytics/${id}`, {
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
      id: id || 'TRN-ANL-101',
      _id: id || 'TRN-ANL-101',
      trainerName: 'Alex Rivera, CSCS',
      trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      coachingSpecialty: 'Hypertrophy & Elite Olympic Lifting',
      reportingPeriod: 'MONTHLY',
      ptHoursRendered: 148,
      trainerFloorUtilizationRate: 92.5,
      grossPtRevenueYield: 14800,
      clientRetentionRate: 96.0,
      netPromoterScore: 94,
      performanceTier: 'ELITE_MASTER',
      status: 'ACTIVE_ROSTER',
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
        title={model.trainerName}
        subtitle={`${model.coachingSpecialty} • Cadence: ${model.reportingPeriod} • Campus: ${model.branchName || 'PD Vihar'}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/trainer-analytics')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Coaches</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Scorecard</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/analytics/trainer-analytics/${model.id || model._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Scorecard</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PT HOURS COMPLETED</span>
            <Dumbbell className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{model.ptHoursRendered} Hours</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Billable 1-on-1 personal training</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FLOOR UTILIZATION</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{model.trainerFloorUtilizationRate}% Util</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Prime floor training efficiency</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GROSS PT YIELD</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">${model.grossPtRevenueYield.toLocaleString()} USD</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Revenue generated for branch</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CLIENT NPS ADVOCACY</span>
            <Star className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{model.netPromoterScore} NPS</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{model.clientRetentionRate}% client retention</p>
        </Card>
      </div>

      {/* Coach Scorecard Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-emerald-500" />
                  Coach Performance Matrix & Revenue Yield
                </CardTitle>
                <CardDescription className="text-xs">
                  Floor utilization efficiency, client satisfaction indices, and billing telemetry
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
                <span className="text-xs font-semibold text-foreground">1. Total Billable Personal Training (PT) Hours</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {model.ptHoursRendered} Hours
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">2. Floor Schedule Booking & Utilization Rate</span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  {model.trainerFloorUtilizationRate}% Booked
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">3. Gross PT Revenue Cashflow Yield</span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  ${model.grossPtRevenueYield.toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">4. Client Roster Renewal / Retention Rate</span>
                <span className="font-mono font-bold text-xs text-blue-600">
                  {model.clientRetentionRate}% Renewals
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 font-bold">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">CLIENT ADVOCACY NET PROMOTER SCORE (NPS)</span>
                <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  {model.netPromoterScore} NPS (WORLD CLASS SATISFACTION)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coach Profile Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Coach Tier Accreditation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border">
              <Avatar className="h-12 w-12 border border-border shrink-0">
                <AvatarImage src={model.trainerAvatar} alt={model.trainerName} />
                <AvatarFallback className="font-bold bg-primary/10 text-primary">
                  {model.trainerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">{model.trainerName}</h4>
                <p className="text-[10px] text-muted-foreground font-mono">{model.coachingSpecialty}</p>
                <Badge variant="default" className="text-[9px] font-bold mt-1">
                  {model.performanceTier}
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Performance telemetry compiled from client PT booking credits, workout completion check-ins, and quarterly athlete feedback surveys.
              </p>
              <div className="pt-2 border-t border-border space-y-1 font-mono text-[10px]">
                <div>Scorecard ID: <strong>{model.id || model._id}</strong></div>
                <div>Campus Scope: <strong>{model.branchName || 'PD Vihar'}</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
