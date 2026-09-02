import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, DoorClosed, Clock, Printer, Flame, Users, ShieldCheck } from 'lucide-react';
import { IAttendanceAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<IAttendanceAnalyticsModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_attendance_analytics');
      if (stored) {
        const customList: IAttendanceAnalyticsModel[] = JSON.parse(stored);
        const match = customList.find((a) => (a.id || a._id) === id);
        if (match) {
          setAnalysis(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/attendance-analytics/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAnalysis(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setAnalysis({
      id: id || 'ATT-ANL-101',
      _id: id || 'ATT-ANL-101',
      analysisTitle: 'Turnstile Access Throughput, Peak Rush Heatmap & Dwell Duration Analysis',
      analysisPeriod: 'WEEKLY',
      analysisDate: '2026-08-29',
      totalTurnstileThroughput: 14820,
      peakRushHourWindow: '17:30 - 19:30 (Evening Rush)',
      peakFloorHeadcount: 142,
      avgWorkoutDurationMinutes: 68,
      studioClassCapacityUtilization: 91.5,
      biometricNfcScanSuccessRate: 99.7,
      operationsAnalyst: 'Devon Ray (IoT Operations Specialist)',
      analystAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'NORMAL_OPERATIONS',
      branchName: 'PD Vihar',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !analysis) {
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
        title={analysis.analysisTitle}
        subtitle={`Audit Date: ${analysis.analysisDate} • Window: ${analysis.peakRushHourWindow} • Analyst: ${analysis.operationsAnalyst}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/attendance-analytics')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Traffic</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Audit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/analytics/attendance-analytics/${analysis.id || analysis._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Analysis</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TURNSTILE SCANS</span>
            <DoorClosed className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{analysis.totalTurnstileThroughput.toLocaleString()} Scans</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5 font-mono">{analysis.biometricNfcScanSuccessRate}% NFC Gate Success</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PEAK HEADCOUNT</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">{analysis.peakFloorHeadcount} Athletes</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{analysis.peakRushHourWindow}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">WORKOUT DWELL</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{analysis.avgWorkoutDurationMinutes} Minutes</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Average floor workout time</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">STUDIO OCCUPANCY</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{analysis.studioClassCapacityUtilization}% Fill</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Group fitness capacity rate</p>
        </Card>
      </div>

      {/* Footfall Analytics Dossier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <DoorClosed className="h-4 w-4 text-primary" />
                  Turnstile Traffic & Floor Surge Radar
                </CardTitle>
                <CardDescription className="text-xs">
                  Biometric turnstile throughput, rush hour distributions, and studio class fill rates
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-bold font-mono">
                {analysis.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">1. Total Hardware Optical Turnstile Scan Events</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {analysis.totalTurnstileThroughput.toLocaleString()} Scans
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">2. Biometric NFC / QR Pass Recognition Success Rate</span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  {analysis.biometricNfcScanSuccessRate}% Success
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">3. Peak Floor Rush Window & Headcount Load</span>
                <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
                  {analysis.peakFloorHeadcount} Athletes ({analysis.peakRushHourWindow})
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <span className="text-xs font-semibold text-foreground">4. Average Floor Workout Dwell Duration</span>
                <span className="font-mono font-bold text-xs text-blue-600">
                  {analysis.avgWorkoutDurationMinutes} Minutes
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary/10 font-bold">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">GROUP FITNESS & STUDIO CLASS FILL RATE</span>
                <span className="font-mono text-sm text-primary">
                  {analysis.studioClassCapacityUtilization}% OCCUPANCY
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operations Specialist Sign-Off Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              IoT Footfall Audit Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border">
              <Avatar className="h-12 w-12 border border-border shrink-0">
                <AvatarImage src={analysis.analystAvatar} alt={analysis.operationsAnalyst} />
                <AvatarFallback className="font-bold bg-primary/10 text-primary">
                  {analysis.operationsAnalyst.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">{analysis.operationsAnalyst}</h4>
                <p className="text-[10px] text-muted-foreground font-mono">IoT Systems Lead</p>
                <Badge variant="outline" className="text-[9px] font-bold mt-1 text-emerald-600 border-emerald-500/30">
                  Telemetry Inspected
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Verified against turnstile hardware event buses, optical infrared lane sensors, and class check-in scans.
              </p>
              <div className="pt-2 border-t border-border space-y-1 font-mono text-[10px]">
                <div>Audit ID: <strong>{analysis.id || analysis._id}</strong></div>
                <div>Campus Scope: <strong>{analysis.branchName || 'PD Vihar'}</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
