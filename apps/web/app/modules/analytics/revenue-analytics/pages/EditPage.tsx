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
import { IRevenueAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [modelTitle, setModelTitle] = useState('');
  const [reportingCadence, setReportingCadence] = useState<IRevenueAnalyticsModel['reportingCadence']>('MONTHLY');
  const [dateRange, setDateRange] = useState('');
  const [mrrAmount, setMrrAmount] = useState(0);
  const [arrAmount, setArrAmount] = useState(0);
  const [arpuAmount, setArpuAmount] = useState(0);
  const [cacPaybackMonths, setCacPaybackMonths] = useState(0);
  const [ltvToCacRatio, setLtvToCacRatio] = useState(0);
  const [subscriptionYieldPercent, setSubscriptionYieldPercent] = useState(0);
  const [ptYieldPercent, setPtYieldPercent] = useState(0);
  const [posRetailYieldPercent, setPosRetailYieldPercent] = useState(0);
  const [analystName, setAnalystName] = useState('');
  const [analystAvatar, setAnalystAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IRevenueAnalyticsModel['status']>('VALIDATED');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadModel();
  }, [id]);

  const loadModel = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_revenue_analytics');
      if (stored) {
        const customList: IRevenueAnalyticsModel[] = JSON.parse(stored);
        const match = customList.find((m) => (m.id || m._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/revenue-analytics/${id}`, {
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
      id: id || 'REV-ANL-101',
      _id: id || 'REV-ANL-101',
      modelTitle: 'Monthly Recurring Revenue (MRR) & Cohort Monetization Yield Model',
      reportingCadence: 'MONTHLY',
      dateRange: 'August 2026 Cohort Window',
      mrrAmount: 148500,
      arrAmount: 1782000,
      arpuAmount: 76.15,
      cacPaybackMonths: 2.4,
      ltvToCacRatio: 4.8,
      subscriptionYieldPercent: 68.5,
      ptYieldPercent: 21.0,
      posRetailYieldPercent: 10.5,
      analystName: 'Helena Frost (Lead Pricing Strategist)',
      analystAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'VALIDATED',
      branchName: 'PD Vihar',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (item: IRevenueAnalyticsModel) => {
    setModelTitle(item.modelTitle || '');
    setReportingCadence(item.reportingCadence || 'MONTHLY');
    setDateRange(item.dateRange || '');
    setMrrAmount(item.mrrAmount || 0);
    setArrAmount(item.arrAmount || 0);
    setArpuAmount(item.arpuAmount || 0);
    setCacPaybackMonths(item.cacPaybackMonths || 0);
    setLtvToCacRatio(item.ltvToCacRatio || 0);
    setSubscriptionYieldPercent(item.subscriptionYieldPercent || 0);
    setPtYieldPercent(item.ptYieldPercent || 0);
    setPosRetailYieldPercent(item.posRetailYieldPercent || 0);
    setAnalystName(item.analystName || '');
    setAnalystAvatar(item.analystAvatar);
    setStatus(item.status || 'VALIDATED');
    if (item.branchId) setBranchId(item.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedModel: Partial<IRevenueAnalyticsModel> = {
      modelTitle,
      reportingCadence,
      dateRange,
      mrrAmount,
      arrAmount,
      arpuAmount,
      cacPaybackMonths,
      ltvToCacRatio,
      subscriptionYieldPercent,
      ptYieldPercent,
      posRetailYieldPercent,
      analystName,
      analystAvatar,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_revenue_analytics');
      if (stored) {
        const customList: IRevenueAnalyticsModel[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedModel } as IRevenueAnalyticsModel;
          localStorage.setItem('gymflow_custom_revenue_analytics', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'REV-ANL-101', ...updatedModel } as IRevenueAnalyticsModel);
          localStorage.setItem('gymflow_custom_revenue_analytics', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/revenue-analytics/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModel),
      }).catch(() => {});

      toast.success(`Revenue model #${id} updated!`);
      navigate('/analytics/revenue-analytics');
    } catch {
      toast.error('Failed to update revenue model');
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
        title={`Edit Monetization Model #${id || '101'}`}
        subtitle="Modify MRR projections, ARPU parameters, and departmental yield mixes."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/revenue-analytics')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Models</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Monetization Model Scope & Financial Modeler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Lead Modeler Avatar</label>
                  <ImageUpload
                    value={analystAvatar}
                    onChange={(url) => setAnalystAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of revenue strategist / analyst"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Model Title / Scenario Descriptor <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={modelTitle}
                      onChange={(e) => setModelTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Analyst (Name & Title)</label>
                      <Input
                        value={analystName}
                        onChange={(e) => setAnalystName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Cadence</label>
                      <Select value={reportingCadence} onValueChange={(val) => setReportingCadence(val as IRevenueAnalyticsModel['reportingCadence'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cadence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">📈 Monthly MRR Model</SelectItem>
                          <SelectItem value="QUARTERLY">📑 Quarterly Board Run-Rate</SelectItem>
                          <SelectItem value="ANNUAL">🏛️ Annual Forecast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Cohort Time Window</label>
                    <Input
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                MRR, ARR, ARPU & Unit Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-600">Monthly Recurring Revenue MRR ($)</label>
                  <Input
                    type="number"
                    value={mrrAmount}
                    onChange={(e) => {
                      const mrr = parseFloat(e.target.value) || 0;
                      setMrrAmount(mrr);
                      setArrAmount(mrr * 12);
                    }}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Annualized Run-Rate ARR ($)</label>
                  <Input
                    type="number"
                    value={arrAmount}
                    onChange={(e) => setArrAmount(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Avg Revenue Per User ARPU ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={arpuAmount}
                    onChange={(e) => setArpuAmount(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">CAC Payback Window (Months)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cacPaybackMonths}
                    onChange={(e) => setCacPaybackMonths(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">LTV to CAC Ratio (e.g. 4.8x)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={ltvToCacRatio}
                    onChange={(e) => setLtvToCacRatio(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Subscription Yield %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={subscriptionYieldPercent}
                    onChange={(e) => setSubscriptionYieldPercent(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">PT Packages Yield %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={ptYieldPercent}
                    onChange={(e) => setPtYieldPercent(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">POS Retail Merch %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={posRetailYieldPercent}
                    onChange={(e) => setPosRetailYieldPercent(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Validation Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IRevenueAnalyticsModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VALIDATED">🟢 Validated Model</SelectItem>
                      <SelectItem value="FORECAST_PROJECTION">🔮 Forecast Projection</SelectItem>
                      <SelectItem value="AUDIT_PENDING">⏳ Audit Pending</SelectItem>
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
                Model ID: <strong className="font-mono text-foreground">{id || 'REV-ANL-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/analytics/revenue-analytics')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Model</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
