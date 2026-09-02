import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import {
  ArrowLeft,
  Save,
  Droplets,
  Zap,
  ShieldCheck,
  Plus,
  Trash2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IWaterIntakeLog, HydrationStatus, IHourlyFluidLog } from '../types';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('MEM-8801');
  const [logDate, setLogDate] = useState('Today, 2026-08-29');
  const [targetVolumeMl, setTargetVolumeMl] = useState('4000');
  const [consumedVolumeMl, setConsumedVolumeMl] = useState('3800');
  const [hydrationStatus, setHydrationStatus] = useState<HydrationStatus>('OPTIMAL_PEAK');
  const [electrolyteScorePercent, setElectrolyteScorePercent] = useState('98');
  const [sweatLossReplenishedMl, setSweatLossReplenishedMl] = useState('1500');
  const [sodiumMg, setSodiumMg] = useState('1100');
  const [potassiumMg, setPotassiumMg] = useState('700');
  const [magnesiumMg, setMagnesiumMg] = useState('350');
  const [branchId, setBranchId] = useState('ALL');
  const [notes, setNotes] = useState('');

  // Hourly Fluid Logs
  const [hourlyLogs, setHourlyLogs] = useState<IHourlyFluidLog[]>([
    { timeSlot: '07:30 AM', amountMl: 750, fluidType: 'ELECTROLYTE_MATRIX', loggedTimestamp: '07:35 AM' },
    { timeSlot: '11:00 AM', amountMl: 1000, fluidType: 'FILTERED_WATER', loggedTimestamp: '11:10 AM' },
    { timeSlot: '02:30 PM', amountMl: 1250, fluidType: 'BCAA_HYDRATION', loggedTimestamp: '02:40 PM' },
    { timeSlot: '06:00 PM', amountMl: 800, fluidType: 'FILTERED_WATER', loggedTimestamp: '06:15 PM' },
  ]);

  const branchOptions = [
    { value: 'ALL', label: '🌐 All Gym Locations' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleAddLog = () => {
    setHourlyLogs([
      ...hourlyLogs,
      {
        timeSlot: '08:00 PM',
        amountMl: 500,
        fluidType: 'FILTERED_WATER',
        loggedTimestamp: '08:05 PM',
      },
    ]);
  };

  const handleRemoveLog = (index: number) => {
    setHourlyLogs(hourlyLogs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `WTR-${memberId.replace('MEM-', '')}-${Math.floor(100 + Math.random() * 900)}`;
    const payload: IWaterIntakeLog = {
      id: newId,
      _id: newId,
      code: newId,
      memberName: memberName || 'Alex Mercer',
      memberId,
      memberEmail: `${(memberName || 'athlete').toLowerCase().replace(/\s+/g, '.')}@gymflow.io`,
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      logDate,
      targetVolumeMl: Number(targetVolumeMl) || 3500,
      consumedVolumeMl: Number(consumedVolumeMl) || 3200,
      hourlyLogs,
      electrolyteScorePercent: Number(electrolyteScorePercent) || 95,
      hydrationStatus,
      sweatLossReplenishedMl: Number(sweatLossReplenishedMl) || 1200,
      sodiumMg: Number(sodiumMg) || 1000,
      potassiumMg: Number(potassiumMg) || 600,
      magnesiumMg: Number(magnesiumMg) || 300,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '')?.replace('🌐 ', '') || 'Downtown Flagship',
      status: 'active',
      notes: notes || 'Target fluid intake achieved with high electrolyte retention.',
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_water_logs');
      const customList: IWaterIntakeLog[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((l) => l.id !== newId && l.code !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_water_logs', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/water-intake', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Hydration diary for "${memberName || 'Athlete'}" saved!`);
      navigate(`/nutrition/water-intake/${newId}`);
    } catch {
      toast.error('Error recording water intake log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Log Fluid Intake & Electrolytes"
        subtitle="Monitor member daily hydration volume, sweat loss replenishment, and intracellular electrolyte balance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/nutrition/water-intake')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={loading || !memberName.trim()}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{loading ? 'Recording...' : 'Save Fluid Log'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Identity & Target Volumes */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="h-4 w-4 text-cyan-500" />
              Hydration Identity & Target Volumetrics
            </CardTitle>
            <CardDescription className="text-xs">
              Athlete selection, daily target volume, and hydration status indicator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Athlete / Member Name *</label>
                <Input
                  placeholder="e.g. Alex Mercer"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Member ID / RFID Code</label>
                <Input
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Log Date</label>
                <Input
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Hydration Status Assessment</label>
                <select
                  value={hydrationStatus}
                  onChange={(e) => setHydrationStatus(e.target.value as HydrationStatus)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="OPTIMAL_PEAK">🟢 Optimal (100% Target Met)</option>
                  <option value="ADEQUATE">🔵 Adequate Fluid Level</option>
                  <option value="MILD_DEFICIT">🟡 Mild Hydration Deficit</option>
                  <option value="SEVERE_DEHYDRATION">🔴 Severe Dehydration Alert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 p-3 rounded-lg border border-border/60">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Daily Fluid (ml)</label>
                <Input
                  type="number"
                  value={targetVolumeMl}
                  onChange={(e) => setTargetVolumeMl(e.target.value)}
                  className="font-mono font-bold text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Actual Consumed (ml)</label>
                <Input
                  type="number"
                  value={consumedVolumeMl}
                  onChange={(e) => setConsumedVolumeMl(e.target.value)}
                  className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Electrolyte Metrics */}
            <div className="space-y-2 pt-2 border-t border-border/80">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Electrolyte & Mineral Telemetry (mg)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground block">Sodium (Na+)</label>
                  <Input
                    type="number"
                    value={sodiumMg}
                    onChange={(e) => setSodiumMg(e.target.value)}
                    className="h-7 text-xs font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground block">Potassium (K+)</label>
                  <Input
                    type="number"
                    value={potassiumMg}
                    onChange={(e) => setPotassiumMg(e.target.value)}
                    className="h-7 text-xs font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground block">Magnesium (Mg2+)</label>
                  <Input
                    type="number"
                    value={magnesiumMg}
                    onChange={(e) => setMagnesiumMg(e.target.value)}
                    className="h-7 text-xs font-mono text-center"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Hydration Notes & Observations</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log workout sweat rate, electrolyte sensation, or fluid replenishment timing..."
                rows={2}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Hourly Fluid Timeline Builder */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Hourly Fluid Timeline ({hourlyLogs.length} Entries)
            </CardTitle>
            <CardDescription className="text-xs">
              Chronological fluid intake timestamps and beverage matrix composition.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Logged Intervals</span>
              <Button type="button" variant="outline" size="sm" onClick={handleAddLog} className="h-7 text-xs gap-1">
                <Plus className="h-3 w-3" /> Add Time Slot
              </Button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {hourlyLogs.map((item, idx) => (
                <div key={idx} className="bg-muted/30 p-2.5 rounded-md border border-border/60 flex items-center gap-2">
                  <Input
                    value={item.timeSlot}
                    onChange={(e) => {
                      const copy = [...hourlyLogs];
                      copy[idx].timeSlot = e.target.value;
                      setHourlyLogs(copy);
                    }}
                    className="h-7 text-xs w-24 font-mono"
                    placeholder="08:00 AM"
                  />
                  <Input
                    type="number"
                    value={item.amountMl}
                    onChange={(e) => {
                      const copy = [...hourlyLogs];
                      copy[idx].amountMl = Number(e.target.value);
                      setHourlyLogs(copy);
                    }}
                    className="h-7 text-xs w-24 font-mono font-bold text-cyan-600 dark:text-cyan-400"
                    placeholder="ml"
                  />
                  <select
                    value={item.fluidType}
                    onChange={(e) => {
                      const copy = [...hourlyLogs];
                      copy[idx].fluidType = e.target.value as any;
                      setHourlyLogs(copy);
                    }}
                    className="h-7 rounded-md border border-input bg-background px-2 text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="FILTERED_WATER">💧 Filtered Water</option>
                    <option value="ELECTROLYTE_MATRIX">⚡ Electrolyte Matrix</option>
                    <option value="BCAA_HYDRATION">💪 BCAA / Amino Hydro</option>
                    <option value="COCONUT_WATER">🥥 Organic Coconut Water</option>
                    <option value="MINERAL_WATER">🏔️ Alpine Mineral Water</option>
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLog(idx)}
                    disabled={hourlyLogs.length <= 1}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
};

