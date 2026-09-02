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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  UserCheck,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Calendar,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWorkoutAssignment } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_WORKOUT_ASSIGNMENTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [assignments, setAssignments] = useState<IWorkoutAssignment[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_workout_assignments');
      const customList: IWorkoutAssignment[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_WORKOUT_ASSIGNMENTS.map((a) => a.id || a.assignmentCode));
      const newItems = customList.filter((a) => !defaultIds.has(a.id || a.assignmentCode));
      return [...newItems, ...DEFAULT_WORKOUT_ASSIGNMENTS];
    } catch {
      return DEFAULT_WORKOUT_ASSIGNMENTS;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [activeBranchId]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_workout_assignments');
      const customList: IWorkoutAssignment[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/workout-assignment', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const serverList = (json.success && Array.isArray(json.data) && json.data.length > 0)
          ? json.data
          : (json.data?.items?.length > 0 ? json.data.items : []);

        if (serverList.length > 0) {
          const map = new Map<string, IWorkoutAssignment>();
          DEFAULT_WORKOUT_ASSIGNMENTS.forEach((a) => map.set(a.id || a.assignmentCode, a));
          serverList.forEach((a: IWorkoutAssignment) => map.set(a.id || a.assignmentCode || (a._id as string), a));
          customList.forEach((a) => map.set(a.id || a.assignmentCode, a));
          setAssignments(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IWorkoutAssignment>();
      DEFAULT_WORKOUT_ASSIGNMENTS.forEach((a) => map.set(a.id || a.assignmentCode, a));
      customList.forEach((a) => map.set(a.id || a.assignmentCode, a));
      setAssignments(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_workout_assignments');
      const customList: IWorkoutAssignment[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IWorkoutAssignment>();
      DEFAULT_WORKOUT_ASSIGNMENTS.forEach((a) => map.set(a.id || a.assignmentCode, a));
      customList.forEach((a) => map.set(a.id || a.assignmentCode, a));
      setAssignments(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return a.branchId === 'ALL' || a.branchId === activeBranchId;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Badge variant="info" className="text-[10px] font-semibold">Active In-Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="success" className="text-[10px] font-semibold">Completed</Badge>;
      case 'PAUSED':
        return <Badge variant="secondary" className="text-[10px] font-semibold">Paused</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive" className="text-[10px] font-semibold">Overdue</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-semibold">{status}</Badge>;
    }
  };

  const columns: ColumnDef<IWorkoutAssignment>[] = [
    {
      accessorKey: 'assignmentCode',
      header: 'Assignment ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('assignmentCode')}
        </span>
      ),
    },
    {
      accessorKey: 'memberName',
      header: 'Member / Athlete',
      cell: ({ row }) => {
        const asg = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={asg.memberAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={asg.memberName}
              className="w-8 h-8 rounded-full object-cover border border-border/80 shrink-0 bg-muted"
            />
            <div>
              <div
                onClick={() => navigate(`/fitness/workout-assignment/${asg.id || asg._id}`)}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
              >
                {asg.memberName}
              </div>
              <div className="text-[11px] text-muted-foreground">{asg.memberEmail}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'programTitle',
      header: 'Assigned Workout Program',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-foreground">{row.original.programTitle}</div>
          <div className="text-[11px] text-muted-foreground">
            Coach: <strong className="text-foreground">{row.original.coachName}</strong>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'completedWorkouts',
      header: 'Progress Track',
      cell: ({ row }) => {
        const asg = row.original;
        const percent = Math.round(((asg.completedWorkouts || 0) / (asg.totalWorkouts || 1)) * 100);
        return (
          <div className="space-y-1 w-32">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-foreground">{asg.completedWorkouts}/{asg.totalWorkouts}</span>
              <span className="text-muted-foreground">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  percent >= 100 ? 'bg-emerald-500' : percent > 50 ? 'bg-primary' : 'bg-amber-500'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'complianceRate',
      header: 'Adherence',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <Activity className="w-3.5 h-3.5" />
          {row.original.complianceRate}% Adherence
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'branchName',
      header: 'Branch Scope',
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1 text-[11px] font-medium border-border/80">
          <Building2 className="w-3 h-3 text-muted-foreground" />
          {row.getValue('branchName') || 'All Locations'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const asgId = row.original.id || row.original._id;
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/workout-assignment/${asgId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Assignment Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/workout-assignment/${asgId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Assignment</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalAssignments = filteredAssignments.length;
  const activeTrainees = filteredAssignments.filter((a) => a.status === 'IN_PROGRESS').length;
  const avgCompliance = Math.round(
    filteredAssignments.reduce((acc, a) => acc + (a.complianceRate || 90), 0) / (totalAssignments || 1)
  );
  const overdueCount = filteredAssignments.filter((a) => a.status === 'OVERDUE').length;

  return (
    <PageContainer>
      <PageHeader
        title="Workout Assignment"
        subtitle="Assign structured workout plans and single-session routines to gym members with progress and compliance tracking."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchAssignments}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/workout-assignment/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Assign Workout</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Assignments"
          value={`${activeTrainees} Trainees`}
          change="Real-time Tracking"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<UserCheck className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Assigned"
          value={`${totalAssignments} Programs`}
          change="Curated by Coaches"
          trend="up"
          timeframe="All Enrollees"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Adherence"
          value={`${avgCompliance}% Compliance`}
          change="High Engagement"
          trend="up"
          timeframe="Session Turnout"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Attention Required"
          value={`${overdueCount} Overdue`}
          change="Follow-up Prompt"
          trend="down"
          timeframe="Missed Sessions"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredAssignments}
        searchKey="memberName"
        searchPlaceholder="Search member names, programs, coaches..."
      />
    </PageContainer>
  );
};
