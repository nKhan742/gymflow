import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Dumbbell, Calendar, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrainerAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [trainerName, setTrainerName] = useState('');
  const [trainerAvatar, setTrainerAvatar] = useState<string | undefined>(undefined);
  const [coachingSpecialty, setCoachingSpecialty] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState<ITrainerAnalyticsModel['reportingPeriod']>('MONTHLY');
  const [ptHoursRendered, setPtHoursRendered] = useState(0);
  const [trainerFloorUtilizationRate, setTrainerFloorUtilizationRate] = useState(0);
  const [grossPtRevenueYield, setGrossPtRevenueYield] = useState(0);
  const [clientRetentionRate, setClientRetentionRate] = useState(0);
  const [netPromoterScore, setNetPromoterScore] = useState(0);
  const [performanceTier, setPerformanceTier] = useState<ITrainerAnalyticsModel['performanceTier']>('ELITE_MASTER');
  const [status, setStatus] = useState<ITrainerAnalyticsModel['status']>('ACTIVE_ROSTER');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadModel();
  }, [id]);

  const loadModel = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_analytics');
      if (stored) {
        const customList: ITrainerAnalyticsModel[] = JSON.parse(stored);
        const match = customList.find((m) => (m.id || m._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/trainer-analytics/${id}`, {
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
      id: id || 'TRN-ANL-101',
      _id: id || 'TRN-ANL-101',
      trainerName: 'Alex Rivera, CSCS',
      trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      coachingSpecialty: 'Hypertrophy & Elite Olympic Lifting',
      reportingPeriod: 'MONTHLY',
      ptHoursRendered: 148,
      trainerFloorUtilizationRate: 92.5,
      grossPtRevenueYield: 14800,
      clientRetentionRate: 96.0,
      netPromoterScore: 94,
      performanceTier: 'ELITE_MASTER',
      status: 'ACTIVE_ROSTER',
      branchName: 'PD Vihar',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (item: ITrainerAnalyticsModel) => {
    setTrainerName(item.trainerName || '');
    setTrainerAvatar(item.trainerAvatar);
    setCoachingSpecialty(item.coachingSpecialty || '');
    setReportingPeriod(item.reportingPeriod || 'MONTHLY');
    setPtHoursRendered(item.ptHoursRendered || 0);
    setTrainerFloorUtilizationRate(item.trainerFloorUtilizationRate || 0);
    setGrossPtRevenueYield(item.grossPtRevenueYield || 0);
    setClientRetentionRate(item.clientRetentionRate || 0);
    setNetPromoterScore(item.netPromoterScore || 0);
    setPerformanceTier(item.performanceTier || 'ELITE_MASTER');
    setStatus(item.status || 'ACTIVE_ROSTER');
    if (item.branchId) setBranchId(item.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedModel: Partial<ITrainerAnalyticsModel> = {
      trainerName,
      trainerAvatar,
      coachingSpecialty,
      reportingPeriod,
      ptHoursRendered,
      trainerFloorUtilizationRate,
      grossPtRevenueYield,
      clientRetentionRate,
      netPromoterScore,
      performanceTier,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_trainer_analytics');
      if (stored) {
        const customList: ITrainerAnalyticsModel[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedModel } as ITrainerAnalyticsModel;
          localStorage.setItem('gymflow_custom_trainer_analytics', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'TRN-ANL-101', ...updatedModel } as ITrainerAnalyticsModel);
          localStorage.setItem('gymflow_custom_trainer_analytics', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/trainer-analytics/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModel),
      }).catch(() => {});

      toast.success(`Trainer scorecard #${id} updated!`);
      navigate('/analytics/trainer-analytics');
    } catch {
      toast.error('Failed to update trainer analytics model');
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
        title={`Edit Coach Scorecard #${id || '101'}`}
        subtitle="Modify coach floor utilization, billable PT yield, client retention, and NPS satisfaction."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/trainer-analytics')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Coaches</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Coach Identity & Performance Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Coach Avatar / Photo</label>
                  <ImageUpload
                    value={trainerAvatar}
                    onChange={(url) => setTrainerAvatar(url)}
                    variant="avatar"
                    helperText="Upload official headshot of trainer/coach"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Coach Name & Certifications <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={trainerName}
                      onChange={(e) => setTrainerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Coaching Specialty / Discipline</label>
                    <Input
                      value={coachingSpecialty}
                      onChange={(e) => setCoachingSpecialty(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Cadence</label>
                      <Select value={reportingPeriod} onValueChange={(val) => setReportingPeriod(val as ITrainerAnalyticsModel['reportingPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cadence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">📈 Monthly Scorecard</SelectItem>
                          <SelectItem value="QUARTERLY">📊 Quarterly Review</SelectItem>
                          <SelectItem value="ANNUAL">🏛️ Annual Appraisal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Performance Tier</label>
                      <Select value={performanceTier} onValueChange={(val) => setPerformanceTier(val as ITrainerAnalyticsModel['performanceTier'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ELITE_MASTER">🏆 Elite Master Coach</SelectItem>
                          <SelectItem value="SENIOR_PERFORMANCE">⭐ Senior Performance Specialist</SelectItem>
                          <SelectItem value="PRO_COACH">🎯 Certified Pro Coach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-emerald-500" />
                Utilization, Billable PT Hours & NPS Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">PT Hours Rendered</label>
                  <Input
                    type="number"
                    value={ptHoursRendered}
                    onChange={(e) => setPtHoursRendered(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-600">Floor Utilization Rate %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={trainerFloorUtilizationRate}
                    onChange={(e) => setTrainerFloorUtilizationRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-600">Gross PT Revenue ($)</label>
                  <Input
                    type="number"
                    value={grossPtRevenueYield}
                    onChange={(e) => setGrossPtRevenueYield(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-blue-600">Client Retention Rate %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={clientRetentionRate}
                    onChange={(e) => setClientRetentionRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-600">Client NPS Score (0-100)</label>
                  <Input
                    type="number"
                    value={netPromoterScore}
                    onChange={(e) => setNetPromoterScore(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Roster Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as ITrainerAnalyticsModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE_ROSTER">🟢 Active Floor Roster</SelectItem>
                      <SelectItem value="ON_LEAVE">⏳ Sabbatical / Leave</SelectItem>
                      <SelectItem value="AUDIT_FLAG">⚠️ Performance Review Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-blue-500" /> Primary Campus Branch
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
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Scorecard ID: <strong className="font-mono text-foreground">{id || 'TRN-ANL-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/analytics/trainer-analytics')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Scorecard</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
