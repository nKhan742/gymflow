import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, Dumbbell, Flame, Award, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

interface IWorkoutPlanItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  goal: 'HYPERTROPHY' | 'FAT_LOSS' | 'STRENGTH' | 'ENDURANCE' | 'ATHLETIC';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationWeeks: number;
  daysPerWeek: number;
  exercisesCount: number;
  trainerName?: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<IWorkoutPlanItem[]>([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('http://localhost:5000/api/v1/fitness/workout-plans', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          setPlans(json.data.items);
          return;
        }
      }
    } catch {}

    setPlans([
      {
        title: 'Upper/Lower Hypertrophy Split',
        description: '4-day progressive overload program designed for lean muscle growth and power output.',
        goal: 'HYPERTROPHY',
        level: 'INTERMEDIATE',
        durationWeeks: 8,
        daysPerWeek: 4,
        exercisesCount: 6,
        trainerName: 'Alex Vance',
      },
      {
        title: 'High-Intensity Athletic Conditioning',
        description: 'Full-body metabolic conditioning with kettlebells, rowing intervals, and plyometrics.',
        goal: 'ATHLETIC',
        level: 'ADVANCED',
        durationWeeks: 6,
        daysPerWeek: 5,
        exercisesCount: 8,
        trainerName: 'Marcus Brody',
      },
    ]);
  };

  const columns: ColumnDef<IWorkoutPlanItem>[] = [
    {
      accessorKey: 'title',
      header: 'Program Title & Goal',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground text-sm">{row.getValue('title')}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'goal',
      header: 'Goal Category',
      cell: ({ row }) => (
        <Badge variant="default" className="text-[10px]">
          {row.getValue('goal')}
        </Badge>
      ),
    },
    {
      accessorKey: 'level',
      header: 'Difficulty',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px]">
          {row.getValue('level')}
        </Badge>
      ),
    },
    {
      accessorKey: 'durationWeeks',
      header: 'Duration',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.durationWeeks} Weeks • {row.original.daysPerWeek} Days/wk
        </span>
      ),
    },
    {
      accessorKey: 'trainerName',
      header: 'Author / Coach',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground">{row.original.trainerName || 'Alex Vance'}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/fitness/workout-plans/${row.original._id || '1'}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Workout Plans & Protocols"
        subtitle="Manage progressive overload splits, hypertrophy routines, and athletic conditioning programs."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export Routines</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/workout-plans/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Create Workout Plan</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Workout Plans"
          value={`${plans.length}`}
          change="+4 this quarter"
          trend="up"
          timeframe="Hypertrophy & Strength"
          icon={<Dumbbell className="h-5 w-5" />}
        />
        <MetricCard
          title="Member Completion Rate"
          value="91.2%"
          change="+3.8%"
          trend="up"
          timeframe="8-week splits"
          icon={<Award className="h-5 w-5" />}
        />
        <MetricCard
          title="Most Popular Goal"
          value="Hypertrophy"
          change="64% of enrolled"
          trend="up"
          timeframe="Upper/Lower split"
          icon={<Flame className="h-5 w-5" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={plans}
        searchPlaceholder="Search workout routines by title, goal, difficulty..."
      />
    </PageContainer>
  );
};
