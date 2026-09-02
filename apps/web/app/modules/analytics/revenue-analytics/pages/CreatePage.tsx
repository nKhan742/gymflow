import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, DollarSign, Calendar, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IRevenueAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [modelTitle, setModelTitle] = useState('Monthly Recurring Revenue (MRR) & Cohort Monetization Yield Model');
  const [reportingCadence, setReportingCadence] = useState<IRevenueAnalyticsModel['reportingCadence']>('MONTHLY');
  const [dateRange, setDateRange] = useState('August 2026 Cohort Window');
  const [mrrAmount, setMrrAmount] = useState(148500);
  const [arrAmount, setArrAmount] = useState(1782000);
  const [arpuAmount, setArpuAmount] = useState(76.15);
  const [cacPaybackMonths, setCacPaybackMonths] = useState(2.4);
  const [ltvToCacRatio, setLtvToCacRatio] = useState(4.8);
  const [subscriptionYieldPercent, setSubscriptionYieldPercent] = useState(68.5);
  const [ptYieldPercent, setPtYieldPercent] = useState(21.0);
  const [posRetailYieldPercent, setPosRetailYieldPercent] = useState(10.5);
  const [analystName, setAnalystName] = useState('Helena Frost (Lead Pricing Strategist)');
  const [analystAvatar, setAnalystAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IRevenueAnalyticsModel['status']>('VALIDATED');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `REV-ANL-${Math.floor(100 + Math.random() * 900)}`;

    const newModel: IRevenueAnalyticsModel = {
      id: newId,
      _id: newId,
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
      analystAvatar: analystAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_revenue_analytics');
      const customList: IRevenueAnalyticsModel[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newModel);
      localStorage.setItem('gymflow_custom_revenue_analytics', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/analytics/revenue-analytics', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModel),
      }).catch(() => {});

      toast.success(`Revenue monetization model saved: "${modelTitle}"!`);
      navigate('/analytics/revenue-analytics');
    } catch {
      toast.error('Failed to save revenue analytics model');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Publish Revenue & Monetization Analytics Model"
        subtitle="Compile MRR, ARR run-rates, ARPU per athlete, LTV:CAC payback ratios, and departmental revenue yield distributions."
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
                Cadence: <strong className="text-foreground">{reportingCadence}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/analytics/revenue-analytics')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Publish Model</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
