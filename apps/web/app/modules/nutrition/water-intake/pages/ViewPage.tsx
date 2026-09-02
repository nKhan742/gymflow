import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  ArrowLeft,
  Edit2,
  Droplets,
  Zap,
  ShieldCheck,
  Clock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Printer,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWaterIntakeLog } from '../types';
import { DEFAULT_WATER_LOGS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<IWaterIntakeLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'electrolytes' | 'diagnostics'>('timeline');

  useEffect(() => {
    fetchLogDetails();
  }, [id]);

  const fetchLogDetails = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_water_logs');
      if (stored) {
        const list: IWaterIntakeLog[] = JSON.parse(stored);
        const match = list.find((l) => l.id === id || l._id === id || l.code === id);
        if (match) {
          setLog(match);
          setLoading(false);
          return;
        }
      }

      const defaultMatch = DEFAULT_WATER_LOGS.find((l) => l.id === id || l.code === id);
      if (defaultMatch) {
        setLog(defaultMatch);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/water-intake/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setLog(json.data);
          setLoading(false);
          return;
        }
      }

      const fallback: IWaterIntakeLog = {
        id: id || 'WTR-CUSTOM-01',
        code: id || 'WTR-CUSTOM-01',
        memberName: 'Alex Mercer',
        memberId: 'MEM-8801',
        memberEmail: 'alex.mercer@gymflow.io',
        memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        logDate: 'Today, 2026-08-29',
        targetVolumeMl: 4500,
        consumedVolumeMl: 4400,
        hourlyLogs: [
          { timeSlot: '07:00 AM', amountMl: 750, fluidType: 'ELECTROLYTE_MATRIX', loggedTimestamp: '07:05 AM' },
          { timeSlot: '10:30 AM', amountMl: 1000, fluidType: 'FILTERED_WATER', loggedTimestamp: '10:35 AM' },
          { timeSlot: '01:30 PM', amountMl: 1250, fluidType: 'BCAA_HYDRATION', loggedTimestamp: '01:45 PM' },
          { timeSlot: '05:00 PM', amountMl: 800, fluidType: 'FILTERED_WATER', loggedTimestamp: '05:10 PM' },
          { timeSlot: '08:30 PM', amountMl: 600, fluidType: 'MINERAL_WATER', loggedTimestamp: '08:40 PM' },
        ],
        electrolyteScorePercent: 98,
        hydrationStatus: 'OPTIMAL_PEAK',
        sweatLossReplenishedMl: 1800,
        sodiumMg: 1200,
        potassiumMg: 750,
        magnesiumMg: 350,
        branchId: 'ALL',
        branchName: 'PD Vihar',
        status: 'active',
        notes: 'Optimal fluid turnover with zero cellular cramping reported.',
      };
      setLog(fallback);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading || !log) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-muted-foreground text-sm">
          Loading 360° Hydration Hub...
        </div>
      </PageContainer>
    );
  }

  const percent = Math.min(100, Math.round(((log.consumedVolumeMl || 0) / (log.targetVolumeMl || 1)) * 100));
  const cLiters = ((log.consumedVolumeMl || 0) / 1000).toFixed(1);
  const tLiters = ((log.targetVolumeMl || 1) / 1000).toFixed(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL_PEAK':
        return <Badge variant="success" className="gap-1 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Optimal (100% Target)</Badge>;
      case 'ADEQUATE':
        return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-xs font-bold">Adequate Fluid</Badge>;
      case 'MILD_DEFICIT':
        return <Badge variant="secondary" className="text-amber-600 dark:text-amber-400 gap-1 text-xs font-bold"><AlertTriangle className="w-3.5 h-3.5" /> Mild Deficit</Badge>;
      case 'SEVERE_DEHYDRATION':
        return <Badge variant="destructive" className="gap-1 text-xs font-bold"><AlertTriangle className="w-3.5 h-3.5" /> Severe Dehydration</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-bold">{status ? String(status).replace(/_/g, ' ') : 'Tracked'}</Badge>;
    }
  };

  const getFluidLabel = (type: string) => {
    switch (type) {
      case 'ELECTROLYTE_MATRIX':
        return '⚡ Electrolyte Matrix';
      case 'BCAA_HYDRATION':
        return '💪 BCAA / Amino Hydro';
      case 'COCONUT_WATER':
        return '🥥 Organic Coconut Water';
      case 'MINERAL_WATER':
        return '🏔️ Alpine Mineral Water';
      default:
        return '💧 Filtered Water';
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Hydration Hub: ${log.memberName}`}
        subtitle={`${log.logDate} • Intake: ${cLiters}L / ${tLiters}L (${percent}%) • Electrolyte Balance: ${log.electrolyteScorePercent}%`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/nutrition/water-intake')}
              className="gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Logs</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Hydration Sheet</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/nutrition/water-intake/${log.id || log._id}/edit`)}
              className="gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Log</span>
            </Button>
          </div>
        }
      />

      {/* Hero Presentation Card */}
      <Card className="mb-6 border-border/80 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={log.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={log.memberName}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/30"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10">
                    {log.memberId}
                  </span>
                  {getStatusBadge(log.hydrationStatus)}
                </div>
                <h2 className="text-xl font-bold text-foreground">{log.memberName}</h2>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> {log.logDate}
                  <span>•</span>
                  <Building2 className="w-3.5 h-3.5" /> {log.branchName || 'PD Vihar'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 md:pt-0 md:border-l md:border-border/80 md:pl-6">
              <div>
                <span className="text-[11px] text-muted-foreground block">Fluid Replenishment</span>
                <span className="font-bold text-xl sm:text-2xl text-cyan-600 dark:text-cyan-400 font-mono">
                  {cLiters} / {tLiters} <span className="text-xs font-normal">L</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Electrolyte Status</span>
                <span className="font-bold text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400 font-mono">
                  {log.electrolyteScorePercent}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/80 shadow-sm bg-cyan-500/5 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">TOTAL FLUID VOLUME</span>
              <Droplets className="h-4 w-4 text-cyan-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              {log.consumedVolumeMl} <span className="text-xs font-normal text-muted-foreground">ml</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">SODIUM (NA+) INTAKE</span>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {log.sodiumMg || 1100} <span className="text-xs font-normal text-muted-foreground">mg</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Cellular Pump Stable</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">POTASSIUM (K+)</span>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-primary">
              {log.potassiumMg || 750} <span className="text-xs font-normal text-muted-foreground">mg</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Anti-Cramping Buffer</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">SWEAT LOSS RECOVERED</span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {log.sweatLossReplenishedMl || 1500} <span className="text-xs font-normal text-muted-foreground">ml</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">100% Sweat Deficit Restored</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-6 overflow-x-auto">
        <Button
          variant={activeTab === 'timeline' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('timeline')}
          className="gap-2 text-xs"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Hourly Fluid Timeline ({log.hourlyLogs?.length || 0} Slots)</span>
        </Button>
        <Button
          variant={activeTab === 'electrolytes' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('electrolytes')}
          className="gap-2 text-xs"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Electrolyte Index</span>
        </Button>
        <Button
          variant={activeTab === 'diagnostics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('diagnostics')}
          className="gap-2 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Hydration Diagnostics & Guidance</span>
        </Button>
      </div>

      {/* Tab 1: Hourly Fluid Timeline */}
      {activeTab === 'timeline' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Chronological Fluid Ingestion Timeline
            </CardTitle>
            <CardDescription className="text-xs">
              Itemized fluid pacing across workout windows and recovery phases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {log.hourlyLogs?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-muted/30 border border-border/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          <Clock className="w-3 h-3 mr-1" /> {item.timeSlot}
                        </Badge>
                        <span className="text-xs font-bold text-foreground">{getFluidLabel(item.fluidType)}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Recorded at {item.loggedTimestamp || item.timeSlot}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400 text-sm bg-background px-3 py-1.5 rounded-md border border-border/80">
                      +{item.amountMl} ml
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Electrolyte Breakdown */}
      {activeTab === 'electrolytes' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Cellular Osmolarity & Mineral Balance
            </CardTitle>
            <CardDescription className="text-xs">
              Essential electrolyte concentrations required for maximum muscular contraction and ATP recovery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Sodium (Na+) Concentration</span>
                <div className="text-2xl font-bold font-mono text-foreground">{log.sodiumMg || 1100} mg</div>
                <p className="text-[11px] text-muted-foreground">Maintains blood plasma volume during intense perspiration.</p>
              </div>

              <div className="p-4 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Potassium (K+) Intracellular</span>
                <div className="text-2xl font-bold font-mono text-primary">{log.potassiumMg || 750} mg</div>
                <p className="text-[11px] text-muted-foreground">Regulates neuromuscular impulses and prevents severe cramping.</p>
              </div>

              <div className="p-4 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Magnesium (Mg2+) Chelated</span>
                <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">{log.magnesiumMg || 350} mg</div>
                <p className="text-[11px] text-muted-foreground">Facilitates deep mitochondrial ATP recharge and cellular relaxation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Diagnostics */}
      {activeTab === 'diagnostics' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Hydration Assessment & Coaching Notes
            </CardTitle>
            <CardDescription className="text-xs">
              Clinical observations on athlete fluid turnover, training sweat rate, and thermal regulation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Coaching & Bio-Hydration Log</span>
                <Badge variant="success" className="text-[10px] font-bold">100% Compliant</Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                "{log.notes || 'Target fluid intake achieved with high electrolyte retention. Keep electrolyte intake consistent across rest and training days.'}"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
};

