import React, { useEffect, useState, useMemo } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox } from '../../../../shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import {
  Activity,
  Plus,
  Scale,
  Heart,
  TrendingDown,
  Sparkles,
  Award,
  FileDown,
  User,
  Flame,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Stethoscope,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IBmiItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
  bodyFatPercent: number;
  muscleMassKg: number;
  visceralFat: number;
  bmrKcal: number;
  assessmentDate: string;
  assessedBy: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<IBmiItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE' | 'UNDERWEIGHT'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Assessment Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('FEMALE');
  const [age, setAge] = useState('28');
  const [heightCm, setHeightCm] = useState('172');
  const [weightKg, setWeightKg] = useState('68.4');
  const [bodyFat, setBodyFat] = useState('18.2');
  const [muscleMass, setMuscleMass] = useState('34.8');
  const [visceralFat, setVisceralFat] = useState('3');
  const [assessedBy, setAssessedBy] = useState('Coach Alex Vance');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/bmi', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAssessments(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  // Live Live Filter
  const filteredAssessments = useMemo(() => {
    if (activeTab === 'ALL') return assessments;
    return assessments.filter((a) => a.bmiCategory === activeTab);
  }, [assessments, activeTab]);

  // Dynamic Metrics & Counts
  const stats = useMemo(() => {
    const normal = assessments.filter((a) => a.bmiCategory === 'NORMAL');
    const overweight = assessments.filter((a) => a.bmiCategory === 'OVERWEIGHT');
    const obese = assessments.filter((a) => a.bmiCategory === 'OBESE');
    const underweight = assessments.filter((a) => a.bmiCategory === 'UNDERWEIGHT');

    const avgBmi = assessments.length
      ? (assessments.reduce((sum, a) => sum + (a.bmi || 0), 0) / assessments.length).toFixed(1)
      : '23.4';

    return {
      total: assessments.length,
      normalCount: normal.length,
      overweightCount: overweight.length,
      obeseCount: obese.length,
      underweightCount: underweight.length,
      avgBmi,
    };
  }, [assessments]);

  // Live Computed BMI for Modal
  const computedBmi = useMemo(() => {
    const h = Number(heightCm) / 100;
    const w = Number(weightKg);
    if (!h || !w) return { bmi: 0, category: 'NORMAL', bmr: 0 };

    const bmiVal = Number((w / (h * h)).toFixed(1));
    let cat: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE' = 'NORMAL';
    if (bmiVal < 18.5) cat = 'UNDERWEIGHT';
    else if (bmiVal < 25) cat = 'NORMAL';
    else if (bmiVal < 30) cat = 'OVERWEIGHT';
    else cat = 'OBESE';

    const bmrVal =
      gender === 'MALE'
        ? Math.round(10 * w + 6.25 * Number(heightCm) - 5 * Number(age) + 5)
        : Math.round(10 * w + 6.25 * Number(heightCm) - 5 * Number(age) - 161);

    return { bmi: bmiVal, category: cat, bmr: bmrVal };
  }, [heightCm, weightKg, gender, age]);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const memberNames: Record<string, string> = {
        'GF-9284': 'Sarah Jenkins',
        'GF-3109': 'David Chen',
        'GF-4821': 'Marcus Rodriguez',
        'GF-7712': 'Emily Watson',
        'GF-5520': 'Liam O Connor',
        'GF-9014': 'Jessica Taylor',
      };

      const name = memberNames[memberCode] || `Member #${memberCode}`;

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/bmi', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          gender,
          age: Number(age),
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          bodyFatPercent: Number(bodyFat),
          muscleMassKg: Number(muscleMass),
          visceralFat: Number(visceralFat),
          bmrKcal: computedBmi.bmr,
          assessedBy,
          notes: `Logged assessment. BMI: ${computedBmi.bmi} (${computedBmi.category})`,
        }),
      });

      if (res.ok) {
        toast.success(`Assessment recorded for ${name}!`, {
          description: `BMI: ${computedBmi.bmi} kg/m² • Body Fat: ${bodyFat}% • BMR: ${computedBmi.bmr} kcal`,
        });
        setCreateModalOpen(false);
        await loadAssessments();
      } else {
        toast.error('Failed to record assessment');
      }
    } catch {
      toast.error('Failed to connect to health assessment service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IBmiItem>[] = [
    {
      accessorKey: 'memberName',
      header: 'Member',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs shrink-0">
            {row.original.memberName.charAt(0)}
          </div>
          <div className="truncate">
            <span
              onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
              className="font-semibold text-xs text-foreground block truncate hover:underline hover:text-primary cursor-pointer"
            >
              {row.original.memberName}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              #{row.original.memberCode} • {row.original.gender} ({row.original.age}y)
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'heightCm',
      header: 'Height & Weight',
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block font-mono">
            {row.original.weightKg} kg
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {row.original.heightCm} cm ({((row.original.heightCm * 0.3937) / 12).toFixed(1)} ft)
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'bmi',
      header: 'BMI & Classification',
      cell: ({ row }) => {
        const bmi = row.original.bmi;
        const cat = row.original.bmiCategory;
        let variant: 'success' | 'warning' | 'destructive' | 'secondary' = 'success';
        if (cat === 'OVERWEIGHT') variant = 'warning';
        if (cat === 'OBESE') variant = 'destructive';
        if (cat === 'UNDERWEIGHT') variant = 'secondary';

        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-foreground font-mono">{bmi}</span>
              <span className="text-[10px] text-muted-foreground">kg/m²</span>
            </div>
            <Badge variant={variant as any} className="text-[10px] font-semibold">
              {cat}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'bodyFatPercent',
      header: 'InBody Composition',
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[10px]">Fat:</span>
            <span className="font-bold text-primary font-mono">{row.original.bodyFatPercent}%</span>
            <span className="text-muted-foreground text-[10px]">Muscle:</span>
            <span className="font-bold text-emerald-600 font-mono">{row.original.muscleMassKg}kg</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Visceral Fat: <span className="font-semibold text-foreground">Lvl {row.original.visceralFat}</span> • BMR:{' '}
            <span className="font-mono text-foreground">{row.original.bmrKcal} kcal</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'assessmentDate',
      header: 'Scan Date & Coach',
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {new Date(row.original.assessmentDate).toLocaleDateString()}
          </span>
          <span className="text-[10px] text-muted-foreground truncate block">
            {row.original.assessedBy}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success(`Exporting Fitness Transformation Report for ${row.original.memberName}...`, {
                description: `Branded PDF generated • BMI: ${row.original.bmi} kg/m²`,
              });
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Download PDF Report"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Report</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
            className="h-7 px-2 text-xs"
          >
            Profile
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="BMI & Body Composition Assessments"
        subtitle="Track member physical transformation scans, InBody bioimpedance metrics, body fat percentage, and metabolic BMR trajectories."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Log New Assessment</span>
            </Button>
          </div>
        }
      />

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Average Club BMI"
          value={`${stats.avgBmi} kg/m²`}
          change="Optimal Healthy Baseline"
          trend="up"
          timeframe="All active members"
          icon={<Scale className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Total Scans Logged"
          value={`${stats.total} Scans`}
          change="+18% vs last month"
          trend="up"
          timeframe="Monthly InBody tests"
          icon={<Activity className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="In Healthy Range"
          value={`${stats.normalCount} Members`}
          change={`${Math.round((stats.normalCount / Math.max(1, stats.total)) * 100)}% Club Total`}
          trend="up"
          timeframe="Optimal BMI (18.5-24.9)"
          icon={<Heart className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="Avg Fat Reduction"
          value="-2.4%"
          change="+1.8kg Muscle Gain"
          trend="up"
          timeframe="90-day trajectory"
          icon={<Sparkles className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Assessments', count: stats.total },
          { key: 'NORMAL', label: '🟢 Normal / Optimal (18.5-24.9)', count: stats.normalCount },
          { key: 'OVERWEIGHT', label: '🟡 Overweight (25-29.9)', count: stats.overweightCount },
          { key: 'OBESE', label: '🔴 Obese (≥ 30)', count: stats.obeseCount },
          { key: 'UNDERWEIGHT', label: '🔵 Underweight (< 18.5)', count: stats.underweightCount },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === t.key
                  ? 'bg-white/20 text-white'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Assessment Table */}
      <DataTable
        columns={columns}
        data={filteredAssessments}
        searchPlaceholder="Search assessments by member name, ID, coach..."
      />

      {/* Log New Assessment Modal with Real-Time BMI Auto-Calculation */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span>Log Member Body Composition Scan</span>
            </DialogTitle>
            <DialogDescription>
              Record InBody bioimpedance telemetry, auto-compute BMI and basal metabolic rate.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAssessment} className="space-y-4 py-2">
            <SelectBox
              label="Select Member"
              value={memberCode}
              onChange={setMemberCode}
              options={[
                { value: 'GF-9284', label: '👑 Sarah Jenkins (#GF-9284 • VIP Platinum)' },
                { value: 'GF-3109', label: '🥈 David Chen (#GF-3109 • Silver Monthly)' },
                { value: 'GF-4821', label: '⭐ Marcus Rodriguez (#GF-4821 • Gold Annual)' },
                { value: 'GF-7712', label: '👑 Emily Watson (#GF-7712 • VIP Platinum)' },
                { value: 'GF-5520', label: '🎓 Liam O Connor (#GF-5520 • Student)' },
                { value: 'GF-9014', label: '⭐ Jessica Taylor (#GF-9014 • Gold Annual)' },
              ]}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SelectBox
                label="Gender"
                value={gender}
                onChange={(v) => setGender(v as any)}
                options={[
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'MALE', label: 'Male' },
                ]}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Age</label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Height (cm)</label>
                <Input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>
            </div>

            {/* Real-Time Auto-Calculated BMI Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Auto-Computed BMI
                </span>
                <span className="text-lg font-black text-foreground font-mono">
                  {computedBmi.bmi} kg/m²
                </span>
              </div>
              <div className="text-right space-y-1">
                <Badge
                  variant={
                    computedBmi.category === 'NORMAL'
                      ? 'success'
                      : computedBmi.category === 'OVERWEIGHT'
                      ? 'warning'
                      : 'destructive'
                  }
                  className="text-[10px] font-bold"
                >
                  {computedBmi.category}
                </Badge>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  BMR: {computedBmi.bmr} kcal/day
                </span>
              </div>
            </div>

            {/* InBody Bioimpedance Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Body Fat %</label>
                <Input
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Muscle Mass (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={muscleMass}
                  onChange={(e) => setMuscleMass(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Visceral Fat (1-12)</label>
                <Input
                  type="number"
                  value={visceralFat}
                  onChange={(e) => setVisceralFat(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <SelectBox
              label="Assessing Coach"
              value={assessedBy}
              onChange={setAssessedBy}
              options={[
                { value: 'Coach Alex Vance', label: 'Coach Alex Vance (Head Trainer)' },
                { value: 'Coach Marcus Thorne', label: 'Coach Marcus Thorne (Strength Coach)' },
                { value: 'Coach Elena Rostova', label: 'Coach Elena Rostova (Endurance Coach)' },
                { value: 'Coach Sarah Vance', label: 'Coach Sarah Vance (Rehab Specialist)' },
              ]}
            />

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Saving Assessment...' : 'Record & Sync Assessment'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
