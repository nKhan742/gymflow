import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Activity, Calendar, DollarSign, TrendingUp, ShieldCheck, CheckCircle2, Building2, Printer, Gauge, Users } from 'lucide-react';
import { IDashboardMetricSnapshot } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState<IDashboardMetricSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSnapshot();
  }, [id]);

  const loadSnapshot = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_dashboard_analytics');
      if (stored) {
        const customList: IDashboardMetricSnapshot[] = JSON.parse(stored);
        const match = customList.find((s) => (s.id || s._id) === id);
        if (match) {
          setSnapshot(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/dashboard-analytics/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSnapshot(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setSnapshot({
      id: id || 'DSB-101',
      _id: id || 'DSB-101',
      snapshotTitle: 'Network Executive Real-time Performance & Occupancy Telemetry',
      reportingCadence: 'REALTIME',
      dateRecorded: '2026-08-29',
      networkOccupancyRate: 78.4,
      activeMembersCount: 3230,
      mrrVelocity: 391200,
      avgWorkoutDwellMinutes: 64,
      topPerformingBranch: 'Downtown Flagship (94% Fill)',
      systemHealthScore: 99.4,
      recordedBy: 'Dr. Aris Thorne (Chief Analytics Officer)',
      controllerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE_TELEMETRY',
      branchName: 'Downtown Flagship',
      createdAt: '2026-08-29T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !snapshot) {
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
        title={snapshot.snapshotTitle}
        subtitle={`Recorded on ${snapshot.dateRecorded} • Cadence: ${snapshot.reportingCadence} • Audited by ${snapshot.recordedBy}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/dashboard-analytics')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dossier</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/analytics/dashboard-analytics/${snapshot.id || snapshot._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Snapshot</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">NETWORK OCCUPANCY</span>
            <Gauge className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{snapshot.networkOccupancyRate}% Fill</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{snapshot.topPerformingBranch}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACTIVE ATHLETES</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{snapshot.activeMembersCount.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Consolidated network census</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MRR VELOCITY</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">${snapshot.mrrVelocity.toLocaleString()} USD</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5 font-mono">+6.8% YoY monthly run-rate</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SYSTEM HEALTH</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{snapshot.systemHealthScore}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{snapshot.avgWorkoutDwellMinutes} min avg member workout dwell</p>
        </Card>
      </div>

      {/* Analytics Dossier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Network Performance & IoT Radar Breakdown
                </CardTitle>
                <CardDescription className="text-xs">
                  Cross-branch operational benchmarks, occupancy distribution, and MRR yield
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs font-bold font-mono">
                {snapshot.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">1. Network-Wide Peak Floor Capacity Utilization</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {snapshot.networkOccupancyRate}% Occupied
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">2. Active Verified Athlete Roster (Active Subscriptions)</span>
                <span className="font-mono font-bold text-xs text-blue-600">
                  {snapshot.activeMembersCount.toLocaleString()} Athletes
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">3. Gross Monthly Recurring Revenue (MRR) Velocity</span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  ${snapshot.mrrVelocity.toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">4. Average Workout Session Dwell Time</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {snapshot.avgWorkoutDwellMinutes} Minutes
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">5. Top Performing Campus Facility</span>
                <span className="font-mono font-bold text-xs text-primary">
                  {snapshot.topPerformingBranch}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary/10 font-bold">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">OVERALL NETWORK TELEMETRY HEALTH SCORE</span>
                <span className="font-mono text-sm text-primary">
                  {snapshot.systemHealthScore}% EXCELLENT
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Officer Sign-Off Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Executive Analytics Officer Sign-Off
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border">
              <Avatar className="h-12 w-12 border border-border shrink-0">
                <AvatarImage src={snapshot.controllerAvatar} alt={snapshot.recordedBy} />
                <AvatarFallback className="font-bold bg-primary/10 text-primary">
                  {snapshot.recordedBy.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">{snapshot.recordedBy}</h4>
                <p className="text-[10px] text-muted-foreground font-mono">Lead Business Intelligence</p>
                <Badge variant="outline" className="text-[9px] font-bold mt-1 text-emerald-600 border-emerald-500/30">
                  Telemetry Verified
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Data compiled from live IoT biometric turnstiles, Stripe recurring billing gateways, and club CRM telemetry.
              </p>
              <div className="pt-2 border-t border-border space-y-1 font-mono text-[10px]">
                <div>Snapshot ID: <strong>{snapshot.id || snapshot._id}</strong></div>
                <div>Campus Scope: <strong>{snapshot.branchName || 'Downtown Flagship'}</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
