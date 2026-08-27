import React, { useEffect, useState, useMemo } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox } from '../../../../shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import {
  Sparkles,
  Trophy,
  Award,
  TrendingDown,
  Flame,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  ArrowRight,
  FileDown,
  Dumbbell,
  CheckCircle2,
  Star,
  Quote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface ITransformationItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  category: 'FAT_LOSS_SHRED' | 'MUSCLE_BUILDING' | 'LIFESTYLE_REHAB' | 'BRIDE_GROOM_PREP';
  title: string;
  durationMonths: number;
  beforeWeightKg: number;
  afterWeightKg: number;
  weightChangeKg: number;
  beforeBodyFat: number;
  afterBodyFat: number;
  bodyFatChange: number;
  waistChangeCm: number;
  story: string;
  coachName: string;
  isFeatured: boolean;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [transformations, setTransformations] = useState<ITransformationItem[]>([]);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  const [activeTab, setActiveTab] = useState<'ALL' | 'FAT_LOSS_SHRED' | 'MUSCLE_BUILDING' | 'LIFESTYLE_REHAB'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Transformation Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [category, setCategory] = useState<'FAT_LOSS_SHRED' | 'MUSCLE_BUILDING' | 'LIFESTYLE_REHAB'>('FAT_LOSS_SHRED');
  const [title, setTitle] = useState("14kg Fat Loss & Pull-Up Mastery");
  const [durationMonths, setDurationMonths] = useState('6');
  const [beforeWeight, setBeforeWeight] = useState('82.5');
  const [afterWeight, setAfterWeight] = useState('68.4');
  const [beforeBF, setBeforeBF] = useState('26.5');
  const [afterBF, setAfterBF] = useState('18.2');
  const [waistChange, setWaistChange] = useState('-11.5');
  const [story, setStory] = useState('Consistent nutrition and high-intensity resistance training with Coach Alex.');
  const [coachName, setCoachName] = useState('Coach Alex Vance');
  const [isFeatured, setIsFeatured] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTransformations();
  }, []);

  const loadTransformations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('http://localhost:5000/api/v1/member-management/transformation', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTransformations(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return transformations;
    return transformations.filter((t) => t.category === activeTab);
  }, [transformations, activeTab]);

  const stats = useMemo(() => {
    const fatLoss = transformations.filter((t) => t.category === 'FAT_LOSS_SHRED');
    const muscle = transformations.filter((t) => t.category === 'MUSCLE_BUILDING');
    const rehab = transformations.filter((t) => t.category === 'LIFESTYLE_REHAB');
    const featured = transformations.filter((t) => t.isFeatured);

    const totalWeightTransformed = transformations.reduce(
      (sum, t) => sum + Math.abs(t.weightChangeKg || 0),
      0
    ).toFixed(1);

    return {
      total: transformations.length,
      fatLossCount: fatLoss.length,
      muscleCount: muscle.length,
      rehabCount: rehab.length,
      featuredCount: featured.length,
      totalWeightTransformed,
    };
  }, [transformations]);

  const handleCreateTransformation = async (e: React.FormEvent) => {
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

      const res = await fetch('http://localhost:5000/api/v1/member-management/transformation', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          category,
          title,
          durationMonths: Number(durationMonths),
          beforeWeightKg: Number(beforeWeight),
          afterWeightKg: Number(afterWeight),
          beforeBodyFat: Number(beforeBF),
          afterBodyFat: Number(afterBF),
          waistChangeCm: Number(waistChange),
          story,
          coachName,
          isFeatured,
        }),
      });

      if (res.ok) {
        toast.success(`Transformation showcase published for ${name}!`, {
          description: `Title: ${title} • Weight delta: ${(Number(afterWeight) - Number(beforeWeight)).toFixed(1)}kg`,
        });
        setCreateModalOpen(false);
        await loadTransformations();
      } else {
        toast.error('Failed to create transformation showcase');
      }
    } catch {
      toast.error('Failed to connect to transformation service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<ITransformationItem>[] = [
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
      accessorKey: 'title',
      header: 'Transformation Story',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-bold text-xs text-foreground block truncate">
            {row.original.title}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Badge variant="outline" className="text-[9px] px-1 py-0 font-semibold">
              {row.original.category.replace(/_/g, ' ')}
            </Badge>
            <span>{row.original.durationMonths} Months Duration</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'weightChangeKg',
      header: 'Weight & Body Fat Delta',
      cell: ({ row }) => {
        const wt = row.original.weightChangeKg;
        const isLoss = wt < 0;
        return (
          <div className="space-y-0.5 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className={`font-black ${isLoss ? 'text-rose-500' : 'text-emerald-500'}`}>
                {wt > 0 ? `+${wt}` : wt} kg
              </span>
              <span className="text-[10px] text-muted-foreground">
                ({row.original.beforeWeightKg}kg → {row.original.afterWeightKg}kg)
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              Body Fat: <span className="font-bold text-foreground">{row.original.bodyFatChange}%</span> • Waist:{' '}
              <span className="font-bold text-foreground">{row.original.waistChangeCm}cm</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'coachName',
      header: 'Coach & Spotlight',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-semibold text-xs text-foreground block">
            {row.original.coachName}
          </span>
          {row.original.isFeatured && (
            <Badge variant="success" className="gap-1 text-[9px] px-1 py-0 font-bold bg-amber-500/15 text-amber-600 border-amber-500/30">
              <Star className="h-2.5 w-2.5 fill-amber-500" />
              <span>Hall of Fame</span>
            </Badge>
          )}
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
              toast.success(`Exporting Transformation Showcase Card for ${row.original.memberName}!`, {
                description: `${row.original.title} • Weight Delta: ${row.original.weightChangeKg}kg`,
              });
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Download Showcase Card"
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
        title="Member Transformation Showcases"
        subtitle="Hall of Fame member physical transformations, before-and-after fat loss trajectories, and inspirational client success stories."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setViewMode('CARDS')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'CARDS'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'TABLE'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Table View"
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
            </div>

            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Submit Transformation</span>
            </Button>
          </div>
        }
      />

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Weight Transformed"
          value={`${stats.totalWeightTransformed} kg`}
          change="Club fat loss aggregate"
          trend="up"
          timeframe="Total body mass delta"
          icon={<TrendingDown className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="Hall of Fame Showcases"
          value={`${stats.total} Stories`}
          change="Member testimonials"
          trend="up"
          timeframe="Success spotlight"
          icon={<Trophy className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Avg Fat Loss"
          value="-6.8%"
          change="Body fat percentage"
          trend="up"
          timeframe="Per client program"
          icon={<Flame className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Featured in Marketing"
          value={`${stats.featuredCount} Members`}
          change="Live on lobby screens"
          trend="up"
          timeframe="Hall of Fame display"
          icon={<Sparkles className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Transformations', count: stats.total },
          { key: 'FAT_LOSS_SHRED', label: '🔥 Fat Loss & Definition', count: stats.fatLossCount },
          { key: 'MUSCLE_BUILDING', label: '🏋️ Muscle Building & Hypertrophy', count: stats.muscleCount },
          { key: 'LIFESTYLE_REHAB', label: '🩺 Rehab & Mobility', count: stats.rehabCount },
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

      {/* Main Content: Dual View */}
      {viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredList.map((item) => (
            <Card key={item.id || item.code} className="border border-border/80 shadow-xs flex flex-col justify-between overflow-hidden relative group hover:border-primary/50 transition-all">
              {item.isFeatured && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="success" className="gap-1 text-[10px] font-bold bg-amber-500 text-white border-0 shadow-sm">
                    <Star className="h-3 w-3 fill-white" />
                    <span>Featured Hall of Fame</span>
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-primary/25">
                    {item.memberName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                      <span>{item.memberName}</span>
                      <span className="text-muted-foreground font-mono text-[11px] font-normal">#{item.memberCode}</span>
                    </h3>
                    <p className="text-xs text-primary font-semibold truncate">{item.title}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 text-xs">
                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Weight Delta</span>
                    <span className="text-sm font-black text-rose-500 font-mono block mt-0.5">
                      {item.weightChangeKg > 0 ? `+${item.weightChangeKg}` : item.weightChangeKg} kg
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">{item.beforeWeightKg}k → {item.afterWeightKg}k</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Body Fat</span>
                    <span className="text-sm font-black text-primary font-mono block mt-0.5">
                      {item.bodyFatChange}%
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">{item.beforeBodyFat}% → {item.afterBodyFat}%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Waist Trim</span>
                    <span className="text-sm font-black text-emerald-500 font-mono block mt-0.5">
                      {item.waistChangeCm} cm
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">{item.durationMonths} Months</span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 relative text-muted-foreground italic leading-relaxed text-xs">
                  <Quote className="h-3.5 w-3.5 text-primary absolute top-2.5 right-2.5 opacity-40" />
                  "{item.story}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>Coached by: <strong className="text-foreground">{item.coachName}</strong></span>
                  <Badge variant="outline" className="text-[9px] font-semibold">{item.category.replace(/_/g, ' ')}</Badge>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/60 pt-3 flex items-center justify-between gap-2 bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success(`Exporting Showcase Card for ${item.memberName}!`, {
                      description: `${item.title} • Weight Delta: ${item.weightChangeKg}kg`,
                    });
                  }}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  <span>Download Card</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => navigate(`/member-management/members/${item.memberCode}`)}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <span>Member Profile</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredList}
          searchPlaceholder="Search transformations by member name, ID, coach..."
        />
      )}

      {/* Submit New Transformation Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>Publish Member Transformation Showcase</span>
            </DialogTitle>
            <DialogDescription>
              Record member success stories, before-and-after physical metrics, and Hall of Fame spotlights.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTransformation} className="space-y-4 py-2">
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
                label="Transformation Focus"
                value={category}
                onChange={(v) => setCategory(v as any)}
                options={[
                  { value: 'FAT_LOSS_SHRED', label: '🔥 Fat Loss & Definition' },
                  { value: 'MUSCLE_BUILDING', label: '🏋️ Muscle Building & Hypertrophy' },
                  { value: 'LIFESTYLE_REHAB', label: '🩺 Rehab & Mobility Recovery' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Showcase Headline</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. 14kg Fat Loss & Pull-Up Mastery"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Duration (Months)</label>
                <Input
                  type="number"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">Before Weight</label>
                <Input type="number" step="0.1" value={beforeWeight} onChange={(e) => setBeforeWeight(e.target.value)} className="h-8 text-xs font-mono" required />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">After Weight</label>
                <Input type="number" step="0.1" value={afterWeight} onChange={(e) => setAfterWeight(e.target.value)} className="h-8 text-xs font-mono" required />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">Before Fat %</label>
                <Input type="number" step="0.1" value={beforeBF} onChange={(e) => setBeforeBF(e.target.value)} className="h-8 text-xs font-mono" required />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">After Fat %</label>
                <Input type="number" step="0.1" value={afterBF} onChange={(e) => setAfterBF(e.target.value)} className="h-8 text-xs font-mono" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Member Story & Testimonial</label>
              <Input
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="h-9 text-xs"
                placeholder="Transformation story, workout routine, and nutrition highlights..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Lead Coach"
                value={coachName}
                onChange={setCoachName}
                options={[
                  { value: 'Coach Alex Vance', label: 'Coach Alex Vance' },
                  { value: 'Coach Marcus Thorne', label: 'Coach Marcus Thorne' },
                  { value: 'Coach Elena Rostova', label: 'Coach Elena Rostova' },
                  { value: 'Coach Sarah Vance', label: 'Coach Sarah Vance' },
                ]}
              />

              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs mt-1">
                <div>
                  <p className="font-semibold text-foreground">Hall of Fame Spotlight</p>
                  <p className="text-muted-foreground">Feature on lobby screens</p>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <Trophy className="h-4 w-4" />
                <span>{submitting ? 'Publishing Showcase...' : 'Publish Transformation'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
