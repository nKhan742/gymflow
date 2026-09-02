import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Dumbbell, DollarSign, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrainerReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [reportTitle, setReportTitle] = useState('Monthly Trainer Performance, 60/40 Split & Session Audit');
  const [reportingPeriod, setReportingPeriod] = useState<ITrainerReport['reportingPeriod']>('MONTHLY');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');
  const [trainerName, setTrainerName] = useState('Coach Alex Rivera');
  const [trainerAvatar, setTrainerAvatar] = useState<string | undefined>(undefined);
  const [trainerSpecialty, setTrainerSpecialty] = useState('Elite Hypertrophy & Powerlifting');
  const [totalSessionsConducted, setTotalSessionsConducted] = useState(64);
  const [totalHoursRendered, setTotalHoursRendered] = useState(64);
  const [grossBillingGenerated, setGrossBillingGenerated] = useState(6400);
  const [clientSatisfactionRating, setClientSatisfactionRating] = useState(4.9);
  const [auditedBy, setAuditedBy] = useState('Dmitri Volkov (Head of Training)');
  const [status, setStatus] = useState<ITrainerReport['status']>('APPROVED_FOR_PAYROLL');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  // 60/40 Commission Split Auto-Calculation
  const coachCommissionPayout = Math.round(grossBillingGenerated * 0.60);
  const facilityNetShare = grossBillingGenerated - coachCommissionPayout;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `TRN-${Math.floor(100 + Math.random() * 900)}`;

    const newReport: ITrainerReport = {
      id: newId,
      _id: newId,
      reportTitle,
      reportingPeriod,
      startDate,
      endDate,
      trainerName,
      trainerAvatar: trainerAvatar || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
      trainerSpecialty,
      totalSessionsConducted,
      totalHoursRendered,
      clientSatisfactionRating,
      grossBillingGenerated,
      coachCommissionPayout,
      facilityNetShare,
      auditedBy,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_reports');
      const customList: ITrainerReport[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newReport);
      localStorage.setItem('gymflow_custom_trainer_reports', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/reports/trainer-reports', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReport),
      }).catch(() => {});

      toast.success(`Trainer performance report compiled for ${trainerName}!`);
      navigate('/reports/trainer-reports');
    } catch {
      toast.error('Failed to compile trainer report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Generate Trainer Productivity & Commission Audit"
        subtitle="Compile coach session banks, 60/40 facility commission splits, client satisfaction scores, and payroll authorization."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/reports/trainer-reports')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Reports</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                Coach Identity, Specialty & Audit Window
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Trainer Profile Photo</label>
                  <ImageUpload
                    value={trainerAvatar}
                    onChange={(url) => setTrainerAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of personal trainer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Trainer Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={trainerName}
                      onChange={(e) => setTrainerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Coaching Specialty / Tier</label>
                    <Input
                      value={trainerSpecialty}
                      onChange={(e) => setTrainerSpecialty(e.target.value)}
                      placeholder="e.g. Master Trainer - Hypertrophy & Powerlifting"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Report Title</label>
                      <Input
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Cadence</label>
                      <Select value={reportingPeriod} onValueChange={(val) => setReportingPeriod(val as ITrainerReport['reportingPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WEEKLY">📅 Weekly Payout</SelectItem>
                          <SelectItem value="BIWEEKLY">📊 Bi-Weekly Payroll</SelectItem>
                          <SelectItem value="MONTHLY">📈 Monthly Commission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Start Date</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">End Date</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Session Telemetry & 60/40 Commission Split Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Completed Sessions</label>
                  <Input
                    type="number"
                    value={totalSessionsConducted}
                    onChange={(e) => setTotalSessionsConducted(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Coaching Hours</label>
                  <Input
                    type="number"
                    value={totalHoursRendered}
                    onChange={(e) => setTotalHoursRendered(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Gross PT Intake ($)</label>
                  <Input
                    type="number"
                    value={grossBillingGenerated}
                    onChange={(e) => setGrossBillingGenerated(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-500">Client Rating (1-5)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={clientSatisfactionRating}
                    onChange={(e) => setClientSatisfactionRating(parseFloat(e.target.value) || 5)}
                    required
                  />
                </div>
              </div>

              {/* Commission calculation preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-border mt-2">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">COACH COMMISSION PAYOUT (60% SPLIT)</span>
                  <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    ${coachCommissionPayout.toLocaleString()} USD
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block font-medium">FACILITY RETAINED SHARE (40% SPLIT)</span>
                  <span className="text-xl font-bold font-mono text-foreground mt-0.5 block">
                    ${facilityNetShare.toLocaleString()} USD
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Certifying Fitness Director</label>
                  <Input
                    value={auditedBy}
                    onChange={(e) => setAuditedBy(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Payroll Authorization</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as ITrainerReport['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVED_FOR_PAYROLL">🟢 Approved for Payroll</SelectItem>
                      <SelectItem value="PENDING_REVIEW">⏳ Pending HR Review</SelectItem>
                      <SelectItem value="FLAGGED">🔴 Flagged / Session Discrepancy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Branch Scope
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
                Period: <strong className="text-foreground">{reportingPeriod}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/reports/trainer-reports')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Generate Report</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
