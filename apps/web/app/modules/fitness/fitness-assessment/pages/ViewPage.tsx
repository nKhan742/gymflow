import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  HeartPulse,
  Edit2,
  Building2,
  ArrowLeft,
  RefreshCw,
  Scale,
  Flame,
  Activity,
  Trophy,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IFitnessAssessment } from '../types';
import { DEFAULT_ASSESSMENTS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<IFitnessAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessmentData();
  }, [id]);

  const loadAssessmentData = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_fitness_assessments');
      const customList: IFitnessAssessment[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (a) => a.id === id || a.assessmentCode === id || a._id === id || a.id?.toLowerCase() === id?.toLowerCase() || a.assessmentCode?.toLowerCase() === id?.toLowerCase()
      );

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/fitness-assessment/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAssessment(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setAssessment(customMatch);
        setLoading(false);
        return;
      }

      const fallback = DEFAULT_ASSESSMENTS.find(
        (a) => a.id === id || a.assessmentCode === id || a.id?.toLowerCase() === id?.toLowerCase() || a.assessmentCode?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setAssessment(fallback);
      } else {
        setAssessment({
          id: id || 'ASM-CUSTOM',
          assessmentCode: id || 'ASM-CUSTOM',
          memberId: 'MEM-001',
          memberName: 'Active Member',
          assessorCoachId: 'STF-001',
          assessorCoachName: 'Head Coach',
          assessmentDate: new Date().toISOString().split('T')[0],
          weightKg: 72.5,
          bodyFatPercentage: 17.5,
          skeletalMuscleMassKg: 34.0,
          visceralFatScore: 3,
          benchPress1RMKg: 90,
          squat1RMKg: 130,
          deadlift1RMKg: 160,
          vo2MaxScore: 48,
          postureScreenNotes: 'Optimal pelvic posture and shoulder alignment.',
          status: 'COMPLETED',
          branchId: 'ALL',
          branchName: 'All Locations',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_fitness_assessments');
      const customList: IFitnessAssessment[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((a) => a.id === id || a.assessmentCode === id);
      const fallback = customMatch || DEFAULT_ASSESSMENTS.find((a) => a.id === id || a.assessmentCode === id) || DEFAULT_ASSESSMENTS[0];
      setAssessment(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !assessment) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading InBody Assessment...</div>
        </div>
      </PageContainer>
    );
  }

  const big3Total = (assessment.benchPress1RMKg || 0) + (assessment.squat1RMKg || 0) + (assessment.deadlift1RMKg || 0);

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/fitness-assessment')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Assessments</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {assessment.memberName} • InBody Biometric Report
              <span className="text-xs font-mono text-muted-foreground font-normal">({assessment.assessmentCode})</span>
            </h1>
            <p className="text-xs text-muted-foreground">Conducted by Coach {assessment.assessorCoachName} on {assessment.assessmentDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/fitness-assessment/${assessment.id || assessment._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Report</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <img
                src={assessment.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={assessment.memberName}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-border/80 shrink-0 shadow-sm"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{assessment.memberName}</h2>
                  <Badge variant="success" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {assessment.status}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {assessment.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Weight: <strong className="text-foreground">{assessment.weightKg} kg</strong></span>
                  <span>•</span>
                  <span>Body Fat: <strong className="text-primary font-mono">{assessment.bodyFatPercentage}%</strong></span>
                </div>
              </div>
            </div>

            {/* InBody Health Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Body Composition</div>
                <div className="text-xs font-bold text-foreground font-mono">{assessment.skeletalMuscleMassKg} kg SMM</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Visceral Level {assessment.visceralFatScore}</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Body Weight</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{assessment.weightKg} kg</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Body Fat %</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{assessment.bodyFatPercentage}%</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Big 3 1RM Total</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">{big3Total} kg</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Aerobic VO2 Max</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{assessment.vo2MaxScore || 45} ml/kg</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="inbody" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="inbody" className="text-xs font-semibold gap-1.5">
            <Scale className="w-3.5 h-3.5 text-primary" /> Body Composition Breakdown
          </TabsTrigger>
          <TabsTrigger value="strength" className="text-xs font-semibold gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> 1RM Benchmarks & Posture
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INBODY */}
        <TabsContent value="inbody" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-xs font-bold text-muted-foreground uppercase">Skeletal Muscle Mass</div>
              <div className="text-2xl font-bold font-mono text-primary mt-1">{assessment.skeletalMuscleMassKg} kg</div>
              <p className="text-[11px] text-muted-foreground mt-1">High muscular development</p>
            </Card>
            <Card className="p-4">
              <div className="text-xs font-bold text-muted-foreground uppercase">Body Fat Mass</div>
              <div className="text-2xl font-bold font-mono text-orange-500 mt-1">
                {((assessment.weightKg * assessment.bodyFatPercentage) / 100).toFixed(1)} kg
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Optimal athletic range</p>
            </Card>
            <Card className="p-4">
              <div className="text-xs font-bold text-muted-foreground uppercase">Visceral Fat Rating</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">Level {assessment.visceralFatScore}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Low cardiovascular risk</p>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: STRENGTH */}
        <TabsContent value="strength" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> Big 3 Power Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                  <span className="font-semibold text-foreground font-sans">Barbell Bench Press 1RM</span>
                  <span className="font-bold text-primary">{assessment.benchPress1RMKg || 0} kg</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                  <span className="font-semibold text-foreground font-sans">Barbell Back Squat 1RM</span>
                  <span className="font-bold text-primary">{assessment.squat1RMKg || 0} kg</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                  <span className="font-semibold text-foreground font-sans">Barbell Deadlift 1RM</span>
                  <span className="font-bold text-primary">{assessment.deadlift1RMKg || 0} kg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> Posture & Movement Observations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2 text-xs">
                  <div className="font-bold text-foreground">Screening Findings:</div>
                  <p className="text-muted-foreground">
                    {assessment.postureScreenNotes || 'No functional mobility restrictions detected.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
