import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, UserCheck, Calendar, Building2, HeartHandshake } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IMembershipReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState<IMembershipReport['reportingPeriod']>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeMembers, setActiveMembers] = useState(0);
  const [newSignups, setNewSignups] = useState(0);
  const [renewals, setRenewals] = useState(0);
  const [cancellations, setCancellations] = useState(0);
  const [frozenMemberships, setFrozenMemberships] = useState(0);
  const [retentionRate, setRetentionRate] = useState(95.4);
  const [churnRate, setChurnRate] = useState(2.3);
  const [auditedBy, setAuditedBy] = useState('');
  const [auditorAvatar, setAuditorAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IMembershipReport['status']>('CERTIFIED');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_membership_reports');
      if (stored) {
        const customList: IMembershipReport[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/membership-reports/${id}`, {
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
      id: id || 'MBR-101',
      _id: id || 'MBR-101',
      reportTitle: 'Monthly Member Retention, Churn & Lifecycle Cohort Audit',
      reportingPeriod: 'MONTHLY',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      activeMembers: 1950,
      newSignups: 148,
      renewals: 380,
      cancellations: 32,
      frozenMemberships: 45,
      retentionRate: 95.4,
      churnRate: 2.3,
      auditedBy: 'Sarah Jenkins (Head of CX)',
      auditorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      status: 'CERTIFIED',
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (rep: IMembershipReport) => {
    setReportTitle(rep.reportTitle || '');
    setReportingPeriod(rep.reportingPeriod || 'MONTHLY');
    setStartDate(rep.startDate || '');
    setEndDate(rep.endDate || '');
    setActiveMembers(rep.activeMembers || 0);
    setNewSignups(rep.newSignups || 0);
    setRenewals(rep.renewals || 0);
    setCancellations(rep.cancellations || 0);
    setFrozenMemberships(rep.frozenMemberships || 0);
    setRetentionRate(rep.retentionRate || 95.4);
    setChurnRate(rep.churnRate || 2.3);
    setAuditedBy(rep.auditedBy || '');
    setAuditorAvatar(rep.auditorAvatar);
    setStatus(rep.status || 'CERTIFIED');
    if (rep.branchId) setBranchId(rep.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedReport: Partial<IMembershipReport> = {
      reportTitle,
      reportingPeriod,
      startDate,
      endDate,
      activeMembers,
      newSignups,
      renewals,
      cancellations,
      frozenMemberships,
      retentionRate,
      churnRate,
      auditedBy,
      auditorAvatar,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_membership_reports');
      if (stored) {
        const customList: IMembershipReport[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedReport } as IMembershipReport;
          localStorage.setItem('gymflow_custom_membership_reports', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'MBR-101', ...updatedReport } as IMembershipReport);
          localStorage.setItem('gymflow_custom_membership_reports', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/membership-reports/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
      }).catch(() => {});

      toast.success(`Membership report #${id} updated!`);
      navigate('/reports/membership-reports');
    } catch {
      toast.error('Failed to update membership report');
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
        title={`Edit Membership Audit #${id || '101'}`}
        subtitle="Modify member enrollment counts, churn metrics, and customer experience certification."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/reports/membership-reports')}>
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
                Audit Scope, Time Window & Member Experience Lead
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Member Experience Lead</label>
                  <ImageUpload
                    value={auditorAvatar}
                    onChange={(url) => setAuditorAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of certifying membership officer"
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
                      <Select value={reportingPeriod} onValueChange={(val) => setReportingPeriod(val as IMembershipReport['reportingPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">📈 Monthly Cohort Retention</SelectItem>
                          <SelectItem value="QUARTERLY">📑 Quarterly Member Census</SelectItem>
                          <SelectItem value="ANNUAL">🏛️ Annual Franchise Retention</SelectItem>
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
                <HeartHandshake className="h-4 w-4 text-emerald-500" />
                Member Growth, Renewal & Churn Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Active Members</label>
                  <Input
                    type="number"
                    value={activeMembers}
                    onChange={(e) => setActiveMembers(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">New Member Signups</label>
                  <Input
                    type="number"
                    value={newSignups}
                    onChange={(e) => setNewSignups(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Successful Renewals</label>
                  <Input
                    type="number"
                    value={renewals}
                    onChange={(e) => setRenewals(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Frozen Passes</label>
                  <Input
                    type="number"
                    value={frozenMemberships}
                    onChange={(e) => setFrozenMemberships(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-rose-500">Cancellations / Churn</label>
                  <Input
                    type="number"
                    value={cancellations}
                    onChange={(e) => setCancellations(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-600">Calculated Retention Rate %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={retentionRate}
                    onChange={(e) => setRetentionRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-rose-600">Monthly Churn Rate %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={churnRate}
                    onChange={(e) => setChurnRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Audit Certification Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IMembershipReport['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CERTIFIED">🟢 Certified by Member Experience</SelectItem>
                      <SelectItem value="PRELIMINARY">📑 Preliminary Rollup</SelectItem>
                      <SelectItem value="AUDIT_IN_PROGRESS">⏳ Active Cohort Audit</SelectItem>
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
                Report ID: <strong className="font-mono text-foreground">{id || 'MBR-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/reports/membership-reports')}>
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
