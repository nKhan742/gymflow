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
  Ruler,
  Plus,
  Heart,
  TrendingDown,
  Sparkles,
  FileDown,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IBodyMeasurementItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  measurementDate: string;
  unit: 'CM' | 'INCHES';
  chest: number;
  shoulders: number;
  leftArm: number;
  rightArm: number;
  waist: number;
  hips: number;
  leftThigh: number;
  rightThigh: number;
  calves: number;
  waistToHipRatio: number;
  whrCategory: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  measuredBy: string;
  notes?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<IBodyMeasurementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Measurement Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [unit, setUnit] = useState<'CM' | 'INCHES'>('CM');
  const [chest, setChest] = useState('94.0');
  const [shoulders, setShoulders] = useState('108.0');
  const [leftArm, setLeftArm] = useState('32.5');
  const [rightArm, setRightArm] = useState('32.8');
  const [waist, setWaist] = useState('71.5');
  const [hips, setHips] = useState('95.0');
  const [leftThigh, setLeftThigh] = useState('53.5');
  const [rightThigh, setRightThigh] = useState('53.8');
  const [calves, setCalves] = useState('35.5');
  const [measuredBy, setMeasuredBy] = useState('Coach Alex Vance');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/body-measurements', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setMeasurements(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  // Live WHR calculation for modal
  const computedWhr = useMemo(() => {
    const w = Number(waist);
    const h = Number(hips);
    if (!w || !h || h === 0) return { ratio: 0.78, category: 'LOW_RISK' };
    const ratio = Number((w / h).toFixed(2));
    let category: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' = 'LOW_RISK';
    if (ratio > 0.95) category = 'HIGH_RISK';
    else if (ratio > 0.85) category = 'MODERATE_RISK';
    return { ratio, category };
  }, [waist, hips]);

  const handleCreateMeasurement = async (e: React.FormEvent) => {
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

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/body-measurements', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          unit,
          chest: Number(chest),
          shoulders: Number(shoulders),
          leftArm: Number(leftArm),
          rightArm: Number(rightArm),
          waist: Number(waist),
          hips: Number(hips),
          leftThigh: Number(leftThigh),
          rightThigh: Number(rightThigh),
          calves: Number(calves),
          waistToHipRatio: computedWhr.ratio,
          whrCategory: computedWhr.category,
          measuredBy,
          notes: `Recorded tape measurements. WHR: ${computedWhr.ratio}`,
        }),
      });

      if (res.ok) {
        toast.success(`Body measurements saved for ${name}!`, {
          description: `Waist: ${waist} cm • Hips: ${hips} cm • WHR: ${computedWhr.ratio}`,
        });
        setCreateModalOpen(false);
        await loadMeasurements();
      } else {
        toast.error('Failed to log measurements');
      }
    } catch {
      toast.error('Failed to connect to measurement service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IBodyMeasurementItem>[] = [
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
              #{row.original.memberCode} • {row.original.planTier?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'chest',
      header: 'Upper Body (Chest & Arms)',
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <div>
            <span className="text-muted-foreground text-[10px]">Chest: </span>
            <span className="font-bold text-foreground font-mono">{row.original.chest} cm</span>
            <span className="text-muted-foreground text-[10px] ml-2">Shoulders: </span>
            <span className="font-mono text-foreground">{row.original.shoulders} cm</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Arms: <span className="font-mono text-primary font-bold">{row.original.leftArm}L / {row.original.rightArm}R cm</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'waist',
      header: 'Core & WHR Ratio',
      cell: ({ row }) => {
        const whr = row.original.waistToHipRatio;
        const cat = row.original.whrCategory;
        return (
          <div className="space-y-0.5 text-xs">
            <div>
              <span className="text-muted-foreground text-[10px]">Waist: </span>
              <span className="font-bold text-foreground font-mono">{row.original.waist} cm</span>
              <span className="text-muted-foreground text-[10px] ml-2">Hips: </span>
              <span className="font-mono text-foreground">{row.original.hips} cm</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono font-bold text-foreground">WHR: {whr}</span>
              <Badge
                variant={cat === 'LOW_RISK' ? 'success' : cat === 'MODERATE_RISK' ? 'warning' : 'destructive'}
                className="text-[9px] px-1 py-0"
              >
                {cat === 'LOW_RISK' ? 'Low Risk' : cat === 'MODERATE_RISK' ? 'Moderate' : 'High Risk'}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'leftThigh',
      header: 'Lower Body (Thighs & Calves)',
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <div>
            <span className="text-muted-foreground text-[10px]">Thighs: </span>
            <span className="font-mono text-foreground font-bold">{row.original.leftThigh}L / {row.original.rightThigh}R cm</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Calves: <span className="font-mono text-foreground">{row.original.calves} cm</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'measurementDate',
      header: 'Date & Coach',
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {new Date(row.original.measurementDate).toLocaleDateString()}
          </span>
          <span className="text-[10px] text-muted-foreground truncate block">
            {row.original.measuredBy}
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
              toast.success(`Exporting Body Measurement Card for ${row.original.memberName}...`, {
                description: `Branded Anthropometric Card generated • Waist: ${row.original.waist}cm`,
              });
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Download Card"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Card</span>
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
        title="Body Measurements & Anthropometry"
        subtitle="Track exact tape measurements across chest, waist, hips, biceps, and thighs with automated Waist-to-Hip health ratio calculation."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Log Tape Measurements</span>
            </Button>
          </div>
        }
      />

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Waist-to-Hip (WHR)"
          value="0.78"
          change="🟢 Low Cardiovascular Risk"
          trend="up"
          timeframe="All active members"
          icon={<Heart className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Total Measurement Logs"
          value={`${measurements.length} Scans`}
          change="+14% this quarter"
          trend="up"
          timeframe="Quarterly progress"
          icon={<Ruler className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Avg Waist Trim"
          value="-4.8 cm"
          change="Average inches lost"
          trend="up"
          timeframe="90-day progress"
          icon={<TrendingDown className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="Avg Bicep Growth"
          value="+2.4 cm"
          change="Hypertrophy gain"
          trend="up"
          timeframe="Muscle definition"
          icon={<Dumbbell className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={measurements}
        searchPlaceholder="Search measurements by member name, ID, coach..."
      />

      {/* Log Measurements Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              <span>Log Anthropometric Tape Measurements</span>
            </DialogTitle>
            <DialogDescription>
              Record precise body circumference measurements and calculate health risk indices.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMeasurement} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Select Member"
                value={memberCode}
                onChange={setMemberCode}
                options={[
                  { value: 'GF-9284', label: '👑 Sarah Jenkins (#GF-9284 • VIP)' },
                  { value: 'GF-3109', label: '🥈 David Chen (#GF-3109 • Silver)' },
                  { value: 'GF-4821', label: '⭐ Marcus Rodriguez (#GF-4821 • Gold)' },
                  { value: 'GF-7712', label: '👑 Emily Watson (#GF-7712 • VIP)' },
                  { value: 'GF-5520', label: '🎓 Liam O Connor (#GF-5520 • Student)' },
                  { value: 'GF-9014', label: '⭐ Jessica Taylor (#GF-9014 • Gold)' },
                ]}
              />

              <SelectBox
                label="Measurement Unit"
                value={unit}
                onChange={(v) => setUnit(v as any)}
                options={[
                  { value: 'CM', label: 'Centimeters (cm)' },
                  { value: 'INCHES', label: 'Inches (in)' },
                ]}
              />
            </div>

            {/* Upper Body */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-2">Upper Body (cm)</span>
              <div className="grid grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Chest</label>
                  <Input type="number" step="0.1" value={chest} onChange={(e) => setChest(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Shoulders</label>
                  <Input type="number" step="0.1" value={shoulders} onChange={(e) => setShoulders(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Left Arm</label>
                  <Input type="number" step="0.1" value={leftArm} onChange={(e) => setLeftArm(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Right Arm</label>
                  <Input type="number" step="0.1" value={rightArm} onChange={(e) => setRightArm(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
              </div>
            </div>

            {/* Core & Waist */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-2">Core & Midsection (cm)</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Waist (Narrowest)</label>
                  <Input type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Hips (Widest Gluteal)</label>
                  <Input type="number" step="0.1" value={hips} onChange={(e) => setHips(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
              </div>
            </div>

            {/* Auto WHR banner */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Waist-to-Hip Ratio (WHR)</span>
                <span className="text-base font-black text-foreground font-mono">{computedWhr.ratio}</span>
              </div>
              <Badge variant={computedWhr.category === 'LOW_RISK' ? 'success' : 'warning'} className="text-[10px] font-bold">
                {computedWhr.category === 'LOW_RISK' ? '🟢 Low Health Risk' : '🟡 Elevated Risk'}
              </Badge>
            </div>

            {/* Lower Body */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-2">Lower Body (cm)</span>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Left Thigh</label>
                  <Input type="number" step="0.1" value={leftThigh} onChange={(e) => setLeftThigh(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Right Thigh</label>
                  <Input type="number" step="0.1" value={rightThigh} onChange={(e) => setRightThigh(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Calves</label>
                  <Input type="number" step="0.1" value={calves} onChange={(e) => setCalves(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
              </div>
            </div>

            <SelectBox
              label="Assessing Coach"
              value={measuredBy}
              onChange={setMeasuredBy}
              options={[
                { value: 'Coach Alex Vance', label: 'Coach Alex Vance' },
                { value: 'Coach Marcus Thorne', label: 'Coach Marcus Thorne' },
                { value: 'Coach Elena Rostova', label: 'Coach Elena Rostova' },
                { value: 'Coach Sarah Vance', label: 'Coach Sarah Vance' },
              ]}
            />

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Saving Measurements...' : 'Record Measurements'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
