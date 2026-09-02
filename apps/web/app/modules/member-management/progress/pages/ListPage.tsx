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
  TrendingUp,
  Award,
  Target,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trophy,
  Flame,
  FileDown,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IProgressItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  primaryGoal: 'FAT_LOSS' | 'STRENGTH_HYPERTROPHY' | 'ENDURANCE' | 'REHAB_MOBILITY' | 'GENERAL_FITNESS';
  goalTitle: string;
  targetDate: string;
  progressPercent: number;
  milestonesCompleted: number;
  totalMilestones: number;
  benchPressKg: number;
  squatKg: number;
  deadliftKg: number;
  adherencePercent: number;
  progressStatus: 'ON_TRACK' | 'ATTENTION_NEEDED' | 'GOAL_ACHIEVED';
  assignedCoach: string;
  coachFeedback?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [progressList, setProgressList] = useState<IProgressItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ON_TRACK' | 'ATTENTION_NEEDED' | 'GOAL_ACHIEVED'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New Progress Review Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [memberCode, setMemberCode] = useState('GF-9284');
  const [primaryGoal, setPrimaryGoal] = useState<'FAT_LOSS' | 'STRENGTH_HYPERTROPHY' | 'ENDURANCE' | 'REHAB_MOBILITY' | 'GENERAL_FITNESS'>('STRENGTH_HYPERTROPHY');
  const [goalTitle, setGoalTitle] = useState('12-Week Lean Hypertrophy & Pull-Up Mastery');
  const [progressPercent, setProgressPercent] = useState('80');
  const [milestonesDone, setMilestonesDone] = useState('4');
  const [totalMilestones, setTotalMilestones] = useState('5');
  const [benchKg, setBenchKg] = useState('75');
  const [squatKg, setSquatKg] = useState('110');
  const [deadliftKg, setDeadliftKg] = useState('135');
  const [adherence, setAdherence] = useState('92');
  const [status, setStatus] = useState<'ON_TRACK' | 'ATTENTION_NEEDED' | 'GOAL_ACHIEVED'>('ON_TRACK');
  const [coachName, setCoachName] = useState('Coach Alex Vance');
  const [feedback, setFeedback] = useState('Superb consistency. Ready for advanced strength block.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/progress', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProgressList(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    if (activeTab === 'ALL') return progressList;
    return progressList.filter((p) => p.progressStatus === activeTab);
  }, [progressList, activeTab]);

  const stats = useMemo(() => {
    const onTrack = progressList.filter((p) => p.progressStatus === 'ON_TRACK');
    const attention = progressList.filter((p) => p.progressStatus === 'ATTENTION_NEEDED');
    const achieved = progressList.filter((p) => p.progressStatus === 'GOAL_ACHIEVED');

    const avgProgress = progressList.length
      ? Math.round(progressList.reduce((sum, p) => sum + (p.progressPercent || 0), 0) / progressList.length)
      : 74;

    const avgAdherence = progressList.length
      ? Math.round(progressList.reduce((sum, p) => sum + (p.adherencePercent || 0), 0) / progressList.length)
      : 88;

    return {
      total: progressList.length,
      onTrackCount: onTrack.length,
      attentionCount: attention.length,
      achievedCount: achieved.length,
      avgProgress,
      avgAdherence,
    };
  }, [progressList]);

  const handleCreateProgress = async (e: React.FormEvent) => {
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

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/progress', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          primaryGoal,
          goalTitle,
          progressPercent: Number(progressPercent),
          milestonesCompleted: Number(milestonesDone),
          totalMilestones: Number(totalMilestones),
          benchPressKg: Number(benchKg),
          squatKg: Number(squatKg),
          deadliftKg: Number(deadliftKg),
          adherencePercent: Number(adherence),
          progressStatus: status,
          assignedCoach: coachName,
          coachFeedback: feedback,
        }),
      });

      if (res.ok) {
        toast.success(`Progress milestone saved for ${name}!`, {
          description: `Goal: ${goalTitle} • Progress: ${progressPercent}% • Status: ${status}`,
        });
        setCreateModalOpen(false);
        await loadProgress();
      } else {
        toast.error('Failed to save progress review');
      }
    } catch {
      toast.error('Failed to connect to client progress service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IProgressItem>[] = [
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
      accessorKey: 'goalTitle',
      header: 'Active Goal & Deadline',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-xs text-foreground block truncate">
            {row.original.goalTitle}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Badge variant="outline" className="text-[9px] px-1 py-0 font-semibold">
              {row.original.primaryGoal?.replace(/_/g, ' ') || 'GENERAL FITNESS'}
            </Badge>
            <span>Target: {new Date(row.original.targetDate).toLocaleDateString()}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'progressPercent',
      header: 'Progress & Milestones',
      cell: ({ row }) => {
        const pct = row.original.progressPercent;
        return (
          <div className="space-y-1 w-36">
            <div className="flex justify-between text-[10px]">
              <span className="font-bold text-foreground font-mono">{pct}%</span>
              <span className="text-muted-foreground">
                {row.original.milestonesCompleted}/{row.original.totalMilestones} Milestones
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'benchPressKg',
      header: 'Strength Records (PRs)',
      cell: ({ row }) => (
        <div className="text-xs space-y-0.5 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[10px]">Bench:</span>
            <span className="font-bold text-foreground">{row.original.benchPressKg}kg</span>
            <span className="text-muted-foreground text-[10px]">Squat:</span>
            <span className="font-bold text-foreground">{row.original.squatKg}kg</span>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px]">Deadlift: </span>
            <span className="font-bold text-primary">{row.original.deadliftKg}kg</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'progressStatus',
      header: 'Status & Adherence',
      cell: ({ row }) => {
        const st = row.original.progressStatus;
        if (st === 'GOAL_ACHIEVED') {
          return (
            <div className="space-y-0.5">
              <Badge variant="success" className="gap-1 text-[10px] font-semibold bg-emerald-600">
                <Trophy className="h-3 w-3" />
                <span>Goal Achieved</span>
              </Badge>
              <span className="text-[10px] text-muted-foreground block font-mono">
                {row.original.adherencePercent}% Adherence
              </span>
            </div>
          );
        }
        if (st === 'ATTENTION_NEEDED') {
          return (
            <div className="space-y-0.5">
              <Badge variant="warning" className="gap-1 text-[10px] font-semibold">
                <AlertCircle className="h-3 w-3" />
                <span>Plateau / Attention</span>
              </Badge>
              <span className="text-[10px] text-rose-500 font-semibold block font-mono">
                {row.original.adherencePercent}% Adherence
              </span>
            </div>
          );
        }
        return (
          <div className="space-y-0.5">
            <Badge variant="default" className="gap-1 text-[10px] font-semibold">
              <CheckCircle2 className="h-3 w-3" />
              <span>On Track</span>
            </Badge>
            <span className="text-[10px] text-emerald-600 font-semibold block font-mono">
              {row.original.adherencePercent}% Adherence
            </span>
          </div>
        );
      },
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
              toast.success(`Generated Milestone Progress Certificate for ${row.original.memberName}!`, {
                description: `Goal: ${row.original.goalTitle} • Progress: ${row.original.progressPercent}%`,
              });
            }}
            className="h-7 px-2 text-xs gap-1 shadow-xs"
            title="Download Certificate"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Award</span>
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
        title="Client Progress & Fitness Milestones"
        subtitle="Track member goal progress trajectories, strength PR progressions, workout adherence, and personal trainer reviews."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Log Progress Review</span>
            </Button>
          </div>
        }
      />

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Goal Completion"
          value={`${stats.avgProgress}%`}
          change="Across all active clients"
          trend="up"
          timeframe="Program completion"
          icon={<Target className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="On-Track Ratio"
          value={`${stats.onTrackCount} Clients`}
          change={`${Math.round((stats.onTrackCount / Math.max(1, stats.total)) * 100)}% On Schedule`}
          trend="up"
          timeframe="Milestones met"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Workout Adherence"
          value={`${stats.avgAdherence}%`}
          change="High consistency index"
          trend="up"
          timeframe="Scheduled sessions"
          icon={<Flame className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Goals Achieved"
          value={`${stats.achievedCount} Graduates`}
          change="Completed 90-day block"
          trend="up"
          timeframe="This quarter"
          icon={<Trophy className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Client Journeys', count: stats.total },
          { key: 'ON_TRACK', label: '🟢 On Track', count: stats.onTrackCount },
          { key: 'ATTENTION_NEEDED', label: '🟡 Attention / Plateau', count: stats.attentionCount },
          { key: 'GOAL_ACHIEVED', label: '🏆 Goal Achieved', count: stats.achievedCount },
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

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredList}
        searchPlaceholder="Search client progress by member name, ID, goal..."
      />

      {/* Log Progress Review Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Log Client Progress & Milestone Review</span>
            </DialogTitle>
            <DialogDescription>
              Record fitness milestone advancements, personal records (PRs), and trainer feedback.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProgress} className="space-y-4 py-2">
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
                label="Primary Goal Focus"
                value={primaryGoal}
                onChange={(v) => setPrimaryGoal(v as any)}
                options={[
                  { value: 'STRENGTH_HYPERTROPHY', label: '🏋️ Strength & Hypertrophy' },
                  { value: 'FAT_LOSS', label: '🔥 Fat Loss & Definition' },
                  { value: 'ENDURANCE', label: '🏃 Endurance & Cardio' },
                  { value: 'REHAB_MOBILITY', label: '🩺 Rehab & Mobility' },
                  { value: 'GENERAL_FITNESS', label: '⭐ General Functional Fitness' },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Goal Title / Program Milestone</label>
              <Input
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. 12-Week Lean Muscle Block"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">Progress %</label>
                <Input type="number" min="0" max="100" value={progressPercent} onChange={(e) => setProgressPercent(e.target.value)} className="h-8 text-xs font-mono" required />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">Milestones Done</label>
                <Input type="number" value={milestonesDone} onChange={(e) => setMilestonesDone(e.target.value)} className="h-8 text-xs font-mono" required />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">Total Milestones</label>
                <Input type="number" value={totalMilestones} onChange={(e) => setTotalMilestones(e.target.value)} className="h-8 text-xs font-mono" required />
              </div>
            </div>

            {/* Strength PRs */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-2">Strength Personal Bests (PRs) (kg)</span>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Bench Press</label>
                  <Input type="number" step="0.5" value={benchKg} onChange={(e) => setBenchKg(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Back Squat</label>
                  <Input type="number" step="0.5" value={squatKg} onChange={(e) => setSquatKg(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Deadlift</label>
                  <Input type="number" step="0.5" value={deadliftKg} onChange={(e) => setDeadliftKg(e.target.value)} className="h-8 text-xs font-mono" required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBox
                label="Journey Status"
                value={status}
                onChange={(v) => setStatus(v as any)}
                options={[
                  { value: 'ON_TRACK', label: '🟢 On Track' },
                  { value: 'ATTENTION_NEEDED', label: '🟡 Plateau / Attention Needed' },
                  { value: 'GOAL_ACHIEVED', label: '🏆 Goal Achieved' },
                ]}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Workout Adherence %</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={adherence}
                  onChange={(e) => setAdherence(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Coach Review Notes</label>
              <Input
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="h-9 text-xs"
                placeholder="Coach observations & next phase prescription..."
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5 font-bold shadow-md shadow-primary/25">
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Saving Progress...' : 'Record Progress Milestone'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
