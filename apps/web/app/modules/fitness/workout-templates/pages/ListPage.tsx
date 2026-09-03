import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  Layers,
  Plus,
  RefreshCw,
  Edit2,
  Eye,
  Clock,
  Dumbbell,
  Trophy,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWorkoutTemplate } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_WORKOUT_TEMPLATES: IWorkoutTemplate[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [templates, setTemplates] = useState<IWorkoutTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTemplates();
  }, [activeBranchId]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-templates', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const localCustomRaw = localStorage.getItem('gymflow_custom_workout_templates');
      const localCustomItems: IWorkoutTemplate[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];

      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setTemplates([...localCustomItems, ...items]);
      } else {
        setTemplates(localCustomItems);
      }
    } catch {
      const localCustomRaw = localStorage.getItem('gymflow_custom_workout_templates');
      const localCustomItems: IWorkoutTemplate[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];
      setTemplates(localCustomItems);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<IWorkoutTemplate>[] = [
    {
      accessorKey: 'name',
      header: 'Workout Template',
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Dumbbell className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm hover:text-primary cursor-pointer" onClick={() => navigate(`/fitness/workout-templates/${t.id}`)}>
                {t.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{t.code}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'targetGoal',
      header: 'Goal & Focus',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {row.original.targetGoal?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => (
        <Badge variant={row.original.difficulty === 'ADVANCED' ? 'warning' : 'default'} className="text-[10px]">
          {row.original.difficulty}
        </Badge>
      ),
    },
    {
      accessorKey: 'estimatedDurationMins',
      header: 'Duration',
      cell: ({ row }) => (
        <span className="text-xs font-mono font-medium text-foreground">
          {row.original.estimatedDurationMins || 60} mins
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/fitness/workout-templates/${t.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/fitness/workout-templates/${t.id}/edit`)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredTemplates = templates;
  const totalTemplates = filteredTemplates.length;
  const hypertrophySplits = filteredTemplates.filter((t) => t.targetGoal === 'HYPERTROPHY').length;
  const strengthSplits = filteredTemplates.filter((t) => t.targetGoal === 'MAX_STRENGTH').length;
  const avgDuration = Math.round(
    filteredTemplates.reduce((acc, t) => acc + (t.estimatedDurationMins || 60), 0) / (totalTemplates || 1)
  );

  return (
    <PageContainer>
      <PageHeader
        title="Workout Templates"
        subtitle="Pre-built training routines, volume periodization blueprints, and single-session workout programs."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchTemplates}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/workout-templates/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add Template</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Workout Templates"
          value={`${totalTemplates} Routines`}
          change="Available"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Layers className="h-5 w-5" />}
        />
        <MetricCard
          title="Hypertrophy Splits"
          value={`${hypertrophySplits} Muscle Splits`}
          change="Volume Focus"
          trend="up"
          timeframe="PPL / Upper Lower"
          icon={<Dumbbell className="h-5 w-5" />}
        />
        <MetricCard
          title="Strength Benchmarks"
          value={`${strengthSplits} Programs`}
          change="Power Programs"
          trend="neutral"
          timeframe="Periodized"
          icon={<Trophy className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Session Duration"
          value={`${avgDuration} Minutes`}
          change="Optimal Density"
          trend="neutral"
          timeframe="Per Workout"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredTemplates}
        loading={loading}
        searchPlaceholder="Search workout templates, split types, or goals..."
      />
    </PageContainer>
  );
};
