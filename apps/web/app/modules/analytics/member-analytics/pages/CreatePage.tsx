import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Users, Calendar, HeartHandshake, Building2, ShieldAlert, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IMemberAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [cohortTitle, setCohortTitle] = useState('Active Roster Retention Curve, Churn Hazard & Member Engagement Model');
  const [cohortPeriod, setCohortPeriod] = useState<IMemberAnalyticsModel['cohortPeriod']>('MONTHLY_COHORT');
  const [cohortDate, setCohortDate] = useState('August 2026 Cohort Window');
  const [activeEnrolledAthletes, setActiveEnrolledAthletes] = useState(1950);
  const [cohortRetentionRate, setCohortRetentionRate] = useState(95.4);
  const [churnHazardRate, setChurnHazardRate] = useState(2.1);
  const [avgVisitsPerWeek, setAvgVisitsPerWeek] = useState(3.4);
  const [atRiskMembersCount, setAtRiskMembersCount] = useState(42);
  const [memberEngagementScore, setMemberEngagementScore] = useState(88.6);
  const [cxAnalyst, setCxAnalyst] = useState('Sienna Miller (Director of Member Experience)');
  const [analystAvatar, setAnalystAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IMemberAnalyticsModel['status']>('HEALTHY_ENGAGEMENT');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `MBR-ANL-${Math.floor(100 + Math.random() * 900)}`;

    const newModel: IMemberAnalyticsModel = {
      id: newId,
      _id: newId,
      cohortTitle,
      cohortPeriod,
      cohortDate,
      activeEnrolledAthletes,
      cohortRetentionRate,
      churnHazardRate,
      avgVisitsPerWeek,
      atRiskMembersCount,
      memberEngagementScore,
      cxAnalyst,
      analystAvatar: analystAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_member_analytics');
      const customList: IMemberAnalyticsModel[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newModel);
      localStorage.setItem('gymflow_custom_member_analytics', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/analytics/member-analytics', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModel),
      }).catch(() => {});

      toast.success(`Member intelligence model saved: "${cohortTitle}"!`);
      navigate('/analytics/member-analytics');
    } catch {
      toast.error('Failed to save member analytics model');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Publish Member Intelligence & Retention Model"
        subtitle="Analyze monthly cohort retention curves, churn hazard modeling, frequency of visits, and member health scores."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/member-analytics')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Members</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Cohort Scope & Member Success Director
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">CX Lead Avatar</label>
                  <ImageUpload
                    value={analystAvatar}
                    onChange={(url) => setAnalystAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of Member Success Lead"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Model Title / Cohort Descriptor <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={cohortTitle}
                      onChange={(e) => setCohortTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">CX Analyst (Name & Title)</label>
                      <Input
                        value={cxAnalyst}
                        onChange={(e) => setCxAnalyst(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Cohort Cadence</label>
                      <Select value={cohortPeriod} onValueChange={(val) => setCohortPeriod(val as IMemberAnalyticsModel['cohortPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cadence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY_COHORT">📈 Monthly Cohort Matrix</SelectItem>
                          <SelectItem value="QUARTERLY_CENSUS">📊 Quarterly Census</SelectItem>
                          <SelectItem value="ANNUAL_LIFECYCLE">🏛️ Annual Lifecycle Curve</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Cohort Time Window</label>
                    <Input
                      value={cohortDate}
                      onChange={(e) => setCohortDate(e.target.value)}
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
                <HeartHandshake className="h-4 w-4 text-emerald-500" />
                Retention %, Churn Hazard & Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Active Cohort Athletes</label>
                  <Input
                    type="number"
                    value={activeEnrolledAthletes}
                    onChange={(e) => setActiveEnrolledAthletes(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-600">Cohort Retention %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cohortRetentionRate}
                    onChange={(e) => setCohortRetentionRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-rose-600">Monthly Churn Hazard %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={churnHazardRate}
                    onChange={(e) => setChurnHazardRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Avg Visits Per Week</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={avgVisitsPerWeek}
                    onChange={(e) => setAvgVisitsPerWeek(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-600">At-Risk Member Flag Count</label>
                  <Input
                    type="number"
                    value={atRiskMembersCount}
                    onChange={(e) => setAtRiskMembersCount(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-blue-600">Engagement Score (0-100)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={memberEngagementScore}
                    onChange={(e) => setMemberEngagementScore(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Engagement Tier Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IMemberAnalyticsModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HEALTHY_ENGAGEMENT">🟢 High / Healthy Engagement</SelectItem>
                      <SelectItem value="CHURN_ALERT">⚠️ Moderate Risk / Churn Alert</SelectItem>
                      <SelectItem value="CAMPAIGN_TRIGGERED">📢 Win-Back Campaign Active</SelectItem>
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
                Cadence: <strong className="text-foreground">{cohortPeriod}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/analytics/member-analytics')}>
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
