import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, DollarSign, Calendar, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IRevenueReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState<IRevenueReport['reportingPeriod']>('QUARTERLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [membershipRevenue, setMembershipRevenue] = useState(0);
  const [ptRevenue, setPtRevenue] = useState(0);
  const [posRetailRevenue, setPosRetailRevenue] = useState(0);
  const [amenityRevenue, setAmenityRevenue] = useState(0);
  const [refundsDeductions, setRefundsDeductions] = useState(0);
  const [auditedBy, setAuditedBy] = useState('');
  const [auditorAvatar, setAuditorAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IRevenueReport['status']>('FINALIZED');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  // Calculations
  const grossRevenue = membershipRevenue + ptRevenue + posRetailRevenue + amenityRevenue;
  const netRevenue = grossRevenue - refundsDeductions;
  const growthPercentage = 14.8;

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_revenue_reports');
      if (stored) {
        const customList: IRevenueReport[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/revenue-reports/${id}`, {
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
      id: id || 'REV-101',
      _id: id || 'REV-101',
      reportTitle: 'Q3 Comprehensive Campus Gross Yield & Recurring Revenue Audit',
      reportingPeriod: 'QUARTERLY',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      grossRevenue: 131900,
      netRevenue: 130050,
      membershipRevenue: 78500,
      ptRevenue: 34200,
      posRetailRevenue: 12800,
      amenityRevenue: 6400,
      refundsDeductions: 1850,
      growthPercentage: 14.8,
      auditedBy: 'Rachel Sterling, CPA',
      auditorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'FINALIZED',
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (rep: IRevenueReport) => {
    setReportTitle(rep.reportTitle || '');
    setReportingPeriod(rep.reportingPeriod || 'QUARTERLY');
    setStartDate(rep.startDate || '');
    setEndDate(rep.endDate || '');
    setMembershipRevenue(rep.membershipRevenue || 0);
    setPtRevenue(rep.ptRevenue || 0);
    setPosRetailRevenue(rep.posRetailRevenue || 0);
    setAmenityRevenue(rep.amenityRevenue || 0);
    setRefundsDeductions(rep.refundsDeductions || 0);
    setAuditedBy(rep.auditedBy || '');
    setAuditorAvatar(rep.auditorAvatar);
    setStatus(rep.status || 'FINALIZED');
    if (rep.branchId) setBranchId(rep.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedReport: Partial<IRevenueReport> = {
      reportTitle,
      reportingPeriod,
      startDate,
      endDate,
      grossRevenue,
      netRevenue,
      membershipRevenue,
      ptRevenue,
      posRetailRevenue,
      amenityRevenue,
      refundsDeductions,
      growthPercentage,
      auditedBy,
      auditorAvatar,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_revenue_reports');
      if (stored) {
        const customList: IRevenueReport[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedReport } as IRevenueReport;
          localStorage.setItem('gymflow_custom_revenue_reports', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'REV-101', ...updatedReport } as IRevenueReport);
          localStorage.setItem('gymflow_custom_revenue_reports', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/revenue-reports/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
      }).catch(() => {});

      toast.success(`Revenue report #${id} updated!`);
      navigate('/reports/revenue-reports');
    } catch {
      toast.error('Failed to update revenue report');
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
        title={`Edit Revenue Audit #${id || '101'}`}
        subtitle="Modify audited figures, departmental income streams, and certification metadata."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/reports/revenue-reports')}>
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
                Audit Scope, Period & Certifying Accountant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Lead Auditor / Financial Officer</label>
                  <ImageUpload
                    value={auditorAvatar}
                    onChange={(url) => setAuditorAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of certifying financial controller"
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
                      <Select value={reportingPeriod} onValueChange={(val) => setReportingPeriod(val as IRevenueReport['reportingPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">📅 Daily Reconciliation</SelectItem>
                          <SelectItem value="WEEKLY">📊 Weekly Cycle</SelectItem>
                          <SelectItem value="MONTHLY">📈 Monthly Statement</SelectItem>
                          <SelectItem value="QUARTERLY">📑 Quarterly Fiscal Audit</SelectItem>
                          <SelectItem value="ANNUAL">🏛️ Annual Corporate Filing</SelectItem>
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
                Revenue Streams & Deduction Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Membership Dues ($)</label>
                  <Input
                    type="number"
                    value={membershipRevenue}
                    onChange={(e) => setMembershipRevenue(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Personal Training ($)</label>
                  <Input
                    type="number"
                    value={ptRevenue}
                    onChange={(e) => setPtRevenue(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">POS Retail & Cafe ($)</label>
                  <Input
                    type="number"
                    value={posRetailRevenue}
                    onChange={(e) => setPosRetailRevenue(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Amenity Pod Rentals ($)</label>
                  <Input
                    type="number"
                    value={amenityRevenue}
                    onChange={(e) => setAmenityRevenue(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-rose-500 font-medium">Refunds & Chargebacks ($)</label>
                  <Input
                    type="number"
                    value={refundsDeductions}
                    onChange={(e) => setRefundsDeductions(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Audit Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IRevenueReport['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FINALIZED">🟢 Finalized & Certified</SelectItem>
                      <SelectItem value="AUDIT_PENDING">⏳ Audit Pending</SelectItem>
                      <SelectItem value="RECONCILED">✨ Reconciled with Bank</SelectItem>
                      <SelectItem value="DRAFT">⚪ Internal Draft</SelectItem>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-border mt-4">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">GROSS AGGREGATE REVENUE</span>
                  <span className="text-xl font-bold font-mono text-foreground mt-0.5 block">
                    ${grossRevenue.toLocaleString()} USD
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block font-medium">NET REALIZED YIELD</span>
                  <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    ${netRevenue.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Report ID: <strong className="font-mono text-foreground">{id || 'REV-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/reports/revenue-reports')}>
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
