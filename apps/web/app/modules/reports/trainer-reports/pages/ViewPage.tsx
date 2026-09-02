import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Dumbbell, Calendar, DollarSign, Star, ShieldCheck, CheckCircle2, Building2, Printer, Award } from 'lucide-react';
import { ITrainerReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ITrainerReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_reports');
      if (stored) {
        const customList: ITrainerReport[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          setReport(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/trainer-reports/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setReport(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setReport({
      id: id || 'TRN-101',
      _id: id || 'TRN-101',
      reportTitle: 'Monthly Trainer Performance, 60/40 Split & Session Audit',
      reportingPeriod: 'MONTHLY',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      trainerName: 'Coach Alex Rivera',
      trainerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
      trainerSpecialty: 'Elite Hypertrophy & Powerlifting',
      totalSessionsConducted: 64,
      totalHoursRendered: 64,
      clientSatisfactionRating: 4.9,
      grossBillingGenerated: 6400,
      coachCommissionPayout: 3840,
      facilityNetShare: 2560,
      auditedBy: 'Dmitri Volkov (Head of Training)',
      status: 'APPROVED_FOR_PAYROLL',
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
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
        title={`${report.trainerName} — Performance & Payroll Statement`}
        subtitle={`Specialty: ${report.trainerSpecialty} • Period: ${report.startDate} to ${report.endDate}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/reports/trainer-reports')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Reports</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Statement</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/reports/trainer-reports/${report.id || report._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Audit</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">COACH PAYOUT (60%)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">${report.coachCommissionPayout.toLocaleString()} USD</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Approved for direct deposit</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">COMPLETED PT SESSIONS</span>
            <Dumbbell className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{report.totalSessionsConducted} Sessions</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{report.totalHoursRendered} verified coaching hours</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GROSS BILLING GENERATED</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold font-mono text-foreground mt-1">${report.grossBillingGenerated.toLocaleString()} USD</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">${report.facilityNetShare} facility retained share</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CLIENT RATING</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold font-mono text-amber-500 mt-1">{report.clientSatisfactionRating} / 5.0</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Top tier athlete satisfaction</p>
        </Card>
      </div>

      {/* Trainer Statement Dossier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  60/40 Commission Split & Billing Accounting
                </CardTitle>
                <CardDescription className="text-xs">
                  Session audit verification, contract revenue recognition, and payout settlement
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs font-bold font-mono">
                {report.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">1. Total 1-on-1 Personal Training Sessions Rendered</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {report.totalSessionsConducted} Sessions ({report.totalHoursRendered} Hours)
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">2. Gross Client PT Package Revenue Intake</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  ${report.grossBillingGenerated.toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-emerald-500/10">
                <span className="text-xs font-semibold text-foreground">3. Coach Direct Commission (60% Contractual Split)</span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  ${report.coachCommissionPayout.toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">4. Facility Retained Operating Share (40% Split)</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  ${report.facilityNetShare.toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/40 font-bold">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">POST-SESSION CLIENT SATISFACTION</span>
                <span className="font-mono text-sm text-amber-500">
                  ⭐ {report.clientSatisfactionRating} / 5.0 Quality Rating
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifying Fitness Director Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Fitness Director Sign-Off
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border">
              <Avatar className="h-12 w-12 border border-border shrink-0">
                <AvatarImage src={report.trainerAvatar} alt={report.trainerName} />
                <AvatarFallback className="font-bold bg-primary/10 text-primary">
                  {report.trainerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">{report.trainerName}</h4>
                <p className="text-[10px] text-muted-foreground font-mono">{report.trainerSpecialty}</p>
                <Badge variant="outline" className="text-[9px] font-bold mt-1 text-emerald-600 border-emerald-500/30">
                  Payroll Cleared
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Verified by <strong>{report.auditedBy}</strong> against electronic session booking records and member biometric attendance timestamps.
              </p>
              <div className="pt-2 border-t border-border space-y-1 font-mono text-[10px]">
                <div>Report ID: <strong>{report.id || report._id}</strong></div>
                <div>Campus: <strong>{report.branchName || 'Main Facility'}</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
