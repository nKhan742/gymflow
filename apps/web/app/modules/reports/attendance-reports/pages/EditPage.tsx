import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Users, Calendar, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAttendanceReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState<IAttendanceReport['reportingPeriod']>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [uniqueMembers, setUniqueMembers] = useState(0);
  const [peakHour, setPeakHour] = useState('');
  const [peakHeadcount, setPeakHeadcount] = useState(0);
  const [averageDurationMinutes, setAverageDurationMinutes] = useState(0);
  const [groupClassAttendance, setGroupClassAttendance] = useState(0);
  const [turnstileScanPassRate, setTurnstileScanPassRate] = useState(99.6);
  const [auditedBy, setAuditedBy] = useState('');
  const [auditorAvatar, setAuditorAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IAttendanceReport['status']>('VERIFIED');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_attendance_reports');
      if (stored) {
        const customList: IAttendanceReport[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/attendance-reports/${id}`, {
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
      id: id || 'ATT-101',
      _id: id || 'ATT-101',
      reportTitle: 'Monthly Turnstile Footfall & Peak Hours Capacity Audit',
      reportingPeriod: 'MONTHLY',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      totalCheckIns: 14820,
      uniqueMembers: 1850,
      peakHour: '17:30 - 19:30 (Evening Peak)',
      peakHeadcount: 142,
      averageDurationMinutes: 68,
      groupClassAttendance: 3450,
      turnstileScanPassRate: 99.6,
      auditedBy: 'Marcus Sterling (Operations Lead)',
      auditorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'VERIFIED',
      branchName: 'Downtown Flagship',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (rep: IAttendanceReport) => {
    setReportTitle(rep.reportTitle || '');
    setReportingPeriod(rep.reportingPeriod || 'MONTHLY');
    setStartDate(rep.startDate || '');
    setEndDate(rep.endDate || '');
    setTotalCheckIns(rep.totalCheckIns || 0);
    setUniqueMembers(rep.uniqueMembers || 0);
    setPeakHour(rep.peakHour || '');
    setPeakHeadcount(rep.peakHeadcount || 0);
    setAverageDurationMinutes(rep.averageDurationMinutes || 0);
    setGroupClassAttendance(rep.groupClassAttendance || 0);
    setTurnstileScanPassRate(rep.turnstileScanPassRate || 99.6);
    setAuditedBy(rep.auditedBy || '');
    setAuditorAvatar(rep.auditorAvatar);
    setStatus(rep.status || 'VERIFIED');
    if (rep.branchId) setBranchId(rep.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedReport: Partial<IAttendanceReport> = {
      reportTitle,
      reportingPeriod,
      startDate,
      endDate,
      totalCheckIns,
      uniqueMembers,
      peakHour,
      peakHeadcount,
      averageDurationMinutes,
      groupClassAttendance,
      turnstileScanPassRate,
      auditedBy,
      auditorAvatar,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_attendance_reports');
      if (stored) {
        const customList: IAttendanceReport[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedReport } as IAttendanceReport;
          localStorage.setItem('gymflow_custom_attendance_reports', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'ATT-101', ...updatedReport } as IAttendanceReport);
          localStorage.setItem('gymflow_custom_attendance_reports', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/attendance-reports/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
      }).catch(() => {});

      toast.success(`Attendance report #${id} updated!`);
      navigate('/reports/attendance-reports');
    } catch {
      toast.error('Failed to update attendance report');
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
        title={`Edit Attendance Audit #${id || '101'}`}
        subtitle="Modify turnstile throughput metrics, studio attendance, and operational status."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/reports/attendance-reports')}>
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
                <Calendar className="h-4 w-4 text-primary" />
                Audit Scope, Time Window & Operations Lead
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Duty Operations Director</label>
                  <ImageUpload
                    value={auditorAvatar}
                    onChange={(url) => setAuditorAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of certifying operations officer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Report Title / Statement Descriptor <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Audited By (Name & Title)</label>
                      <Input
                        value={auditedBy}
                        onChange={(e) => setAuditedBy(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Reporting Cadence</label>
                      <Select value={reportingPeriod} onValueChange={(val) => setReportingPeriod(val as IAttendanceReport['reportingPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">📅 Daily Turnstile Log</SelectItem>
                          <SelectItem value="WEEKLY">📊 Weekly Rush Cycle</SelectItem>
                          <SelectItem value="MONTHLY">📈 Monthly Utilization</SelectItem>
                          <SelectItem value="QUARTERLY">📑 Quarterly Capacity Audit</SelectItem>
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
                <Users className="h-4 w-4 text-emerald-500" />
                Turnstile Telemetry & Rush Hours Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Turnstile Check-Ins</label>
                  <Input
                    type="number"
                    value={totalCheckIns}
                    onChange={(e) => setTotalCheckIns(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Unique Active Members</label>
                  <Input
                    type="number"
                    value={uniqueMembers}
                    onChange={(e) => setUniqueMembers(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Group Class Attendance</label>
                  <Input
                    type="number"
                    value={groupClassAttendance}
                    onChange={(e) => setGroupClassAttendance(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Peak Rush Window</label>
                  <Input
                    value={peakHour}
                    onChange={(e) => setPeakHour(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Peak Floor Headcount</label>
                  <Input
                    type="number"
                    value={peakHeadcount}
                    onChange={(e) => setPeakHeadcount(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Avg Workout Duration (Mins)</label>
                  <Input
                    type="number"
                    value={averageDurationMinutes}
                    onChange={(e) => setAverageDurationMinutes(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Audit Verification Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IAttendanceReport['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VERIFIED">🟢 Turnstile Logs Verified</SelectItem>
                      <SelectItem value="COMPILED">📑 Compiled Summary</SelectItem>
                      <SelectItem value="PROCESSING">⏳ Sensor Stream Processing</SelectItem>
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
                Report ID: <strong className="font-mono text-foreground">{id || 'ATT-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/reports/attendance-reports')}>
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
