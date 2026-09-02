import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Dumbbell, DollarSign, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrainerReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState<ITrainerReport['reportingPeriod']>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [trainerAvatar, setTrainerAvatar] = useState<string | undefined>(undefined);
  const [trainerSpecialty, setTrainerSpecialty] = useState('');
  const [totalSessionsConducted, setTotalSessionsConducted] = useState(0);
  const [totalHoursRendered, setTotalHoursRendered] = useState(0);
  const [grossBillingGenerated, setGrossBillingGenerated] = useState(0);
  const [clientSatisfactionRating, setClientSatisfactionRating] = useState(5.0);
  const [auditedBy, setAuditedBy] = useState('');
  const [status, setStatus] = useState<ITrainerReport['status']>('APPROVED_FOR_PAYROLL');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  // 60/40 Commission Split Auto-Calculation
  const coachCommissionPayout = Math.round(grossBillingGenerated * 0.60);
  const facilityNetShare = grossBillingGenerated - coachCommissionPayout;

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_reports');
      if (stored) {
        const customList: ITrainerReport[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
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
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
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
      branchName: 'PD Vihar',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (rep: ITrainerReport) => {
    setReportTitle(rep.reportTitle || '');
    setReportingPeriod(rep.reportingPeriod || 'MONTHLY');
    setStartDate(rep.startDate || '');
    setEndDate(rep.endDate || '');
    setTrainerName(rep.trainerName || '');
    setTrainerAvatar(rep.trainerAvatar);
    setTrainerSpecialty(rep.trainerSpecialty || '');
    setTotalSessionsConducted(rep.totalSessionsConducted || 0);
    setTotalHoursRendered(rep.totalHoursRendered || 0);
    setGrossBillingGenerated(rep.grossBillingGenerated || 0);
    setClientSatisfactionRating(rep.clientSatisfactionRating || 5.0);
    setAuditedBy(rep.auditedBy || '');
    setStatus(rep.status || 'APPROVED_FOR_PAYROLL');
    if (rep.branchId) setBranchId(rep.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedReport: Partial<ITrainerReport> = {
      reportTitle,
      reportingPeriod,
      startDate,
      endDate,
      trainerName,
      trainerAvatar,
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
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_reports');
      if (stored) {
        const customList: ITrainerReport[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedReport } as ITrainerReport;
          localStorage.setItem('gymflow_custom_trainer_reports', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'TRN-101', ...updatedReport } as ITrainerReport);
          localStorage.setItem('gymflow_custom_trainer_reports', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/trainer-reports/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
      }).catch(() => {});

      toast.success(`Trainer performance report #${id} updated!`);
      navigate('/reports/trainer-reports');
    } catch {
      toast.error('Failed to update trainer report');
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
        title={`Edit Trainer Audit #${id || '101'}`}
        subtitle="Modify coach session tallies, 60/40 revenue split percentages, and payroll approval."
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
                Report ID: <strong className="font-mono text-foreground">{id || 'TRN-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/reports/trainer-reports')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Report</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
