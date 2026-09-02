import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Activity, Calendar, DollarSign, Building2, Gauge } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IDashboardMetricSnapshot } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [snapshotTitle, setSnapshotTitle] = useState('');
  const [reportingCadence, setReportingCadence] = useState<IDashboardMetricSnapshot['reportingCadence']>('REALTIME');
  const [dateRecorded, setDateRecorded] = useState('');
  const [networkOccupancyRate, setNetworkOccupancyRate] = useState(0);
  const [activeMembersCount, setActiveMembersCount] = useState(0);
  const [mrrVelocity, setMrrVelocity] = useState(0);
  const [avgWorkoutDwellMinutes, setAvgWorkoutDwellMinutes] = useState(0);
  const [topPerformingBranch, setTopPerformingBranch] = useState('');
  const [systemHealthScore, setSystemHealthScore] = useState(0);
  const [recordedBy, setRecordedBy] = useState('');
  const [controllerAvatar, setControllerAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IDashboardMetricSnapshot['status']>('ACTIVE_TELEMETRY');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadSnapshot();
  }, [id]);

  const loadSnapshot = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_dashboard_analytics');
      if (stored) {
        const customList: IDashboardMetricSnapshot[] = JSON.parse(stored);
        const match = customList.find((s) => (s.id || s._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/dashboard-analytics/${id}`, {
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
      id: id || 'DSB-101',
      _id: id || 'DSB-101',
      snapshotTitle: 'Network Executive Real-time Performance & Occupancy Telemetry',
      reportingCadence: 'REALTIME',
      dateRecorded: '2026-08-29',
      networkOccupancyRate: 78.4,
      activeMembersCount: 3230,
      mrrVelocity: 391200,
      avgWorkoutDwellMinutes: 64,
      topPerformingBranch: 'Main Facility (94% Fill)',
      systemHealthScore: 99.4,
      recordedBy: 'Dr. Aris Thorne (Chief Analytics Officer)',
      controllerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE_TELEMETRY',
      branchName: 'Main Facility',
      createdAt: '2026-08-29T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (item: IDashboardMetricSnapshot) => {
    setSnapshotTitle(item.snapshotTitle || '');
    setReportingCadence(item.reportingCadence || 'REALTIME');
    setDateRecorded(item.dateRecorded || '');
    setNetworkOccupancyRate(item.networkOccupancyRate || 0);
    setActiveMembersCount(item.activeMembersCount || 0);
    setMrrVelocity(item.mrrVelocity || 0);
    setAvgWorkoutDwellMinutes(item.avgWorkoutDwellMinutes || 0);
    setTopPerformingBranch(item.topPerformingBranch || '');
    setSystemHealthScore(item.systemHealthScore || 0);
    setRecordedBy(item.recordedBy || '');
    setControllerAvatar(item.controllerAvatar);
    setStatus(item.status || 'ACTIVE_TELEMETRY');
    if (item.branchId) setBranchId(item.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedSnapshot: Partial<IDashboardMetricSnapshot> = {
      snapshotTitle,
      reportingCadence,
      dateRecorded,
      networkOccupancyRate,
      activeMembersCount,
      mrrVelocity,
      avgWorkoutDwellMinutes,
      topPerformingBranch,
      systemHealthScore,
      recordedBy,
      controllerAvatar,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_dashboard_analytics');
      if (stored) {
        const customList: IDashboardMetricSnapshot[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedSnapshot } as IDashboardMetricSnapshot;
          localStorage.setItem('gymflow_custom_dashboard_analytics', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'DSB-101', ...updatedSnapshot } as IDashboardMetricSnapshot);
          localStorage.setItem('gymflow_custom_dashboard_analytics', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/analytics/dashboard-analytics/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSnapshot),
      }).catch(() => {});

      toast.success(`Dashboard snapshot #${id} updated!`);
      navigate('/analytics/dashboard-analytics');
    } catch {
      toast.error('Failed to update dashboard snapshot');
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
        title={`Edit Dashboard Telemetry #${id || '101'}`}
        subtitle="Modify campus fill rates, MRR velocity, and IoT telemetry parameters."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/dashboard-analytics')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                Snapshot Descriptor, Cadence & Chief Analytics Lead
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Analytics Director Avatar</label>
                  <ImageUpload
                    value={controllerAvatar}
                    onChange={(url) => setControllerAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of analytics lead / system auditor"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Snapshot Title / Radar Descriptor <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={snapshotTitle}
                      onChange={(e) => setSnapshotTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Audited By (Name & Title)</label>
                      <Input
                        value={recordedBy}
                        onChange={(e) => setRecordedBy(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Telemetry Cadence</label>
                      <Select value={reportingCadence} onValueChange={(val) => setReportingCadence(val as IDashboardMetricSnapshot['reportingCadence'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cadence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REALTIME">⚡ Real-time Telemetry</SelectItem>
                          <SelectItem value="DAILY">📅 Daily Snapshot</SelectItem>
                          <SelectItem value="WEEKLY">📊 Weekly Consolidation</SelectItem>
                          <SelectItem value="MONTHLY">🏛️ Monthly Executive Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Recorded Date</label>
                      <Input
                        type="date"
                        value={dateRecorded}
                        onChange={(e) => setDateRecorded(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Top Performing Campus</label>
                      <Input
                        value={topPerformingBranch}
                        onChange={(e) => setTopPerformingBranch(e.target.value)}
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
                <Activity className="h-4 w-4 text-emerald-500" />
                Network Telemetry, Capacity & MRR Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Network Occupancy %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={networkOccupancyRate}
                    onChange={(e) => setNetworkOccupancyRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Active Roster Count</label>
                  <Input
                    type="number"
                    value={activeMembersCount}
                    onChange={(e) => setActiveMembersCount(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-600">MRR Run-Rate ($)</label>
                  <Input
                    type="number"
                    value={mrrVelocity}
                    onChange={(e) => setMrrVelocity(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Avg Dwell (Mins)</label>
                  <Input
                    type="number"
                    value={avgWorkoutDwellMinutes}
                    onChange={(e) => setAvgWorkoutDwellMinutes(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-blue-600">System Health Score %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={systemHealthScore}
                    onChange={(e) => setSystemHealthScore(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Snapshot Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IDashboardMetricSnapshot['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE_TELEMETRY">🟢 Active Live Telemetry</SelectItem>
                      <SelectItem value="ARCHIVED">📑 Archived Historical</SelectItem>
                      <SelectItem value="ANOMALY_DETECTED">🔴 Anomaly / Spike Flagged</SelectItem>
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
                Snapshot ID: <strong className="font-mono text-foreground">{id || 'DSB-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/analytics/dashboard-analytics')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Snapshot</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
