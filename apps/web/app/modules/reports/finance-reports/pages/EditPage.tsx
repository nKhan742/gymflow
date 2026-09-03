import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Landmark, Calendar, DollarSign, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IFinanceReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState<IFinanceReport['reportingPeriod']>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [operatingExpenses, setOperatingExpenses] = useState(0);
  const [payrollExpenses, setPayrollExpenses] = useState(0);
  const [facilitiesRentLease, setFacilitiesRentLease] = useState(0);
  const [auditedBy, setAuditedBy] = useState('');
  const [auditorAvatar, setAuditorAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IFinanceReport['status']>('BOARD_APPROVED');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  // Dynamic P&L Calculations
  const totalOpex = operatingExpenses + payrollExpenses + facilitiesRentLease;
  const ebitda = totalRevenue - totalOpex;
  const ebitdaMarginPercentage = totalRevenue > 0 ? parseFloat(((ebitda / totalRevenue) * 100).toFixed(1)) : 0;
  const netProfit = Math.round(ebitda * 0.79);
  const netProfitMarginPercentage = totalRevenue > 0 ? parseFloat(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_finance_reports');
      if (stored) {
        const customList: IFinanceReport[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/finance-reports/${id}`, {
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
      id: id || 'FIN-101',
      _id: id || 'FIN-101',
      reportTitle: 'Monthly Executive P&L, EBITDA & Fiscal Health Statement',
      reportingPeriod: 'MONTHLY',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      totalRevenue: 148500,
      operatingExpenses: 38400,
      payrollExpenses: 48200,
      facilitiesRentLease: 19500,
      ebitda: 42400,
      ebitdaMarginPercentage: 28.6,
      netProfit: 33500,
      netProfitMarginPercentage: 22.6,
      auditedBy: 'Julian Vance, Chief Financial Officer',
      auditorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'BOARD_APPROVED',
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (rep: IFinanceReport) => {
    setReportTitle(rep.reportTitle || '');
    setReportingPeriod(rep.reportingPeriod || 'MONTHLY');
    setStartDate(rep.startDate || '');
    setEndDate(rep.endDate || '');
    setTotalRevenue(rep.totalRevenue || 0);
    setOperatingExpenses(rep.operatingExpenses || 0);
    setPayrollExpenses(rep.payrollExpenses || 0);
    setFacilitiesRentLease(rep.facilitiesRentLease || 0);
    setAuditedBy(rep.auditedBy || '');
    setAuditorAvatar(rep.auditorAvatar);
    setStatus(rep.status || 'BOARD_APPROVED');
    if (rep.branchId) setBranchId(rep.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedReport: Partial<IFinanceReport> = {
      reportTitle,
      reportingPeriod,
      startDate,
      endDate,
      totalRevenue,
      operatingExpenses,
      payrollExpenses,
      facilitiesRentLease,
      ebitda,
      ebitdaMarginPercentage,
      netProfit,
      netProfitMarginPercentage,
      auditedBy,
      auditorAvatar,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_finance_reports');
      if (stored) {
        const customList: IFinanceReport[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedReport } as IFinanceReport;
          localStorage.setItem('gymflow_custom_finance_reports', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'FIN-101', ...updatedReport } as IFinanceReport);
          localStorage.setItem('gymflow_custom_finance_reports', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/finance-reports/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
      }).catch(() => {});

      toast.success(`Finance report #${id} updated!`);
      navigate('/reports/finance-reports');
    } catch {
      toast.error('Failed to update finance report');
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
        title={`Edit Financial Audit #${id || '101'}`}
        subtitle="Modify gross revenues, departmental expenditures, EBITDA metrics, and board approval."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/reports/finance-reports')}>
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
                Audit Scope, Time Window & Certifying CFO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">CFO / Controller Avatar</label>
                  <ImageUpload
                    value={auditorAvatar}
                    onChange={(url) => setAuditorAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of certifying CFO or partner"
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
                      <label className="text-xs font-semibold text-foreground">Cadence</label>
                      <Select value={reportingPeriod} onValueChange={(val) => setReportingPeriod(val as IFinanceReport['reportingPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">📈 Monthly P&L Ledger</SelectItem>
                          <SelectItem value="QUARTERLY">📑 Quarterly Board Filing</SelectItem>
                          <SelectItem value="ANNUAL">🏛️ Annual Corporate Audit</SelectItem>
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
                <Landmark className="h-4 w-4 text-emerald-500" />
                Revenue, OPEX Overhead & Net Operating Income
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Gross Revenue ($)</label>
                  <Input
                    type="number"
                    value={totalRevenue}
                    onChange={(e) => setTotalRevenue(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Payroll & Trainer Wages ($)</label>
                  <Input
                    type="number"
                    value={payrollExpenses}
                    onChange={(e) => setPayrollExpenses(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Facility Rent & Leases ($)</label>
                  <Input
                    type="number"
                    value={facilitiesRentLease}
                    onChange={(e) => setFacilitiesRentLease(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">General OPEX ($)</label>
                  <Input
                    type="number"
                    value={operatingExpenses}
                    onChange={(e) => setOperatingExpenses(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              {/* Dynamic EBITDA & Net Margin Calculation Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 mt-2">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">REALIZED EBITDA ({ebitdaMarginPercentage}% MARGIN)</span>
                  <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    ${ebitda.toLocaleString()} USD
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block font-medium">NET OPERATING PROFIT ({netProfitMarginPercentage}% MARGIN)</span>
                  <span className="text-xl font-bold font-mono text-foreground mt-0.5 block">
                    ${netProfit.toLocaleString()} USD
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Board Approval Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IFinanceReport['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOARD_APPROVED">🟢 Approved by Executive Board</SelectItem>
                      <SelectItem value="PRELIMINARY">📑 Preliminary P&L Rollup</SelectItem>
                      <SelectItem value="UNDER_AUDIT">⏳ External CPA Audit in Progress</SelectItem>
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
                Report ID: <strong className="font-mono text-foreground">{id || 'FIN-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/reports/finance-reports')}>
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
