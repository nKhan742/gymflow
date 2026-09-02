import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, DoorClosed, Calendar, Clock, Building2, Flame, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAttendanceAnalyticsModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [analysisTitle, setAnalysisTitle] = useState('Turnstile Access Throughput, Peak Rush Heatmap & Dwell Duration Analysis');
  const [analysisPeriod, setAnalysisPeriod] = useState<IAttendanceAnalyticsModel['analysisPeriod']>('WEEKLY');
  const [analysisDate, setAnalysisDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalTurnstileThroughput, setTotalTurnstileThroughput] = useState(14820);
  const [peakRushHourWindow, setPeakRushHourWindow] = useState('17:30 - 19:30 (Evening Rush)');
  const [peakFloorHeadcount, setPeakFloorHeadcount] = useState(142);
  const [avgWorkoutDurationMinutes, setAvgWorkoutDurationMinutes] = useState(68);
  const [studioClassCapacityUtilization, setStudioClassCapacityUtilization] = useState(91.5);
  const [biometricNfcScanSuccessRate, setBiometricNfcScanSuccessRate] = useState(99.7);
  const [operationsAnalyst, setOperationsAnalyst] = useState('Devon Ray (IoT Operations Specialist)');
  const [analystAvatar, setAnalystAvatar] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<IAttendanceAnalyticsModel['status']>('NORMAL_OPERATIONS');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `ATT-ANL-${Math.floor(100 + Math.random() * 900)}`;

    const newAnalysis: IAttendanceAnalyticsModel = {
      id: newId,
      _id: newId,
      analysisTitle,
      analysisPeriod,
      analysisDate,
      totalTurnstileThroughput,
      peakRushHourWindow,
      peakFloorHeadcount,
      avgWorkoutDurationMinutes,
      studioClassCapacityUtilization,
      biometricNfcScanSuccessRate,
      operationsAnalyst,
      analystAvatar: analystAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_attendance_analytics');
      const customList: IAttendanceAnalyticsModel[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newAnalysis);
      localStorage.setItem('gymflow_custom_attendance_analytics', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/analytics/attendance-analytics', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnalysis),
      }).catch(() => {});

      toast.success(`Attendance analytics report saved: "${analysisTitle}"!`);
      navigate('/analytics/attendance-analytics');
    } catch {
      toast.error('Failed to save attendance analytics model');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Publish Attendance & Footfall Traffic Analysis"
        subtitle="Record optical turnstile scan throughput, peak concurrent headcounts, studio utilization, and workout dwell durations."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/analytics/attendance-analytics')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Traffic</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Footfall Audit Window & Operations Specialist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Operations Lead Avatar</label>
                  <ImageUpload
                    value={analystAvatar}
                    onChange={(url) => setAnalystAvatar(url)}
                    variant="avatar"
                    helperText="Upload photo of operations / IoT analyst"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Analysis Title / Rush Audit Descriptor <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={analysisTitle}
                      onChange={(e) => setAnalysisTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Analyst (Name & Title)</label>
                      <Input
                        value={operationsAnalyst}
                        onChange={(e) => setOperationsAnalyst(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Cadence</label>
                      <Select value={analysisPeriod} onValueChange={(val) => setAnalysisPeriod(val as IAttendanceAnalyticsModel['analysisPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">📅 Daily Footfall Log</SelectItem>
                          <SelectItem value="WEEKLY">📊 Weekly Traffic Radar</SelectItem>
                          <SelectItem value="MONTHLY">🏛️ Monthly Multi-Campus Audit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Date Recorded</label>
                      <Input
                        type="date"
                        value={analysisDate}
                        onChange={(e) => setAnalysisDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Peak Rush Hour Window</label>
                      <Input
                        value={peakRushHourWindow}
                        onChange={(e) => setPeakRushHourWindow(e.target.value)}
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
                <DoorClosed className="h-4 w-4 text-emerald-500" />
                Turnstile Throughput, Headcounts & Duration Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Turnstile Scans</label>
                  <Input
                    type="number"
                    value={totalTurnstileThroughput}
                    onChange={(e) => setTotalTurnstileThroughput(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Peak Headcount</label>
                  <Input
                    type="number"
                    value={peakFloorHeadcount}
                    onChange={(e) => setPeakFloorHeadcount(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Avg Dwell (Mins)</label>
                  <Input
                    type="number"
                    value={avgWorkoutDurationMinutes}
                    onChange={(e) => setAvgWorkoutDurationMinutes(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Studio Fill %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={studioClassCapacityUtilization}
                    onChange={(e) => setStudioClassCapacityUtilization(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-blue-600">Turnstile NFC Pass Rate %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={biometricNfcScanSuccessRate}
                    onChange={(e) => setBiometricNfcScanSuccessRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Traffic State</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IAttendanceAnalyticsModel['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NORMAL_OPERATIONS">🟢 Normal Operational Flow</SelectItem>
                      <SelectItem value="PEAK_SURGE">🔥 High Peak Rush Surge</SelectItem>
                      <SelectItem value="EQUIPMENT_LOCKOUT">⚠️ Maintenance Lane Divert</SelectItem>
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
                Cadence: <strong className="text-foreground">{analysisPeriod}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/analytics/attendance-analytics')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Publish Analysis</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
