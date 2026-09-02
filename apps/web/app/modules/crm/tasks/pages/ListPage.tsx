import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, CheckSquare, Flame, Calendar, Clock, CheckCircle2, Eye, Edit, Trash2, ListChecks, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITask } from '../types';
import { toast } from 'sonner';

export const DEFAULT_TASKS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    loadTasks();
  }, [activeBranchId]);

  const loadTasks = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_tasks');
      const customList: ITask[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/tasks', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: ITask[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_TASKS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setTasks(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_tasks');
      const customList: ITask[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_TASKS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setTasks(combined);
    }
  };

  const handleToggleComplete = (id: string, currentStatus: string, title: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    const updated = tasks.map((t) => {
      if ((t.id || t._id) === id) {
        return {
          ...t,
          status: nextStatus as ITask['status'],
        };
      }
      return t;
    });
    setTasks(updated);

    const stored = localStorage.getItem('gymflow_custom_tasks');
    if (stored) {
      const customList: ITask[] = JSON.parse(stored);
      const updatedCustom = customList.map((t) => {
        if ((t.id || t._id) === id) {
          return {
            ...t,
            status: nextStatus as ITask['status'],
          };
        }
        return t;
      });
      localStorage.setItem('gymflow_custom_tasks', JSON.stringify(updatedCustom));
    }

    toast.success(`Task "${title}" marked ${nextStatus}!`);
  };

  const handleDelete = (id: string, title: string) => {
    const updated = tasks.filter((t) => (t.id || t._id) !== id);
    setTasks(updated);

    const stored = localStorage.getItem('gymflow_custom_tasks');
    if (stored) {
      const customList: ITask[] = JSON.parse(stored);
      const filtered = customList.filter((t) => (t.id || t._id) !== id);
      localStorage.setItem('gymflow_custom_tasks', JSON.stringify(filtered));
    }

    toast.success(`Task "${title}" deleted`);
  };

  // Telemetry
  const totalTasks = tasks.length;
  const urgentTasks = tasks.filter((t) => (t.priority === 'URGENT' || t.priority === 'HIGH') && t.status !== 'COMPLETED').length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const columns: ColumnDef<ITask>[] = [
    {
      accessorKey: 'title',
      header: 'Task Objective & Checklist',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const cl = row.original.checklist || [];
        const doneCount = cl.filter((c) => c.done).length;
        return (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(`/crm/tasks/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
            >
              {row.original.title}
            </button>
            {cl.length > 0 && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                <ListChecks className="h-3 w-3 text-primary shrink-0" />
                <span>{doneCount}/{cl.length} Sub-actions done</span>
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'taskType',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-semibold bg-muted/40 whitespace-nowrap">
          {row.original.taskType?.replace(/_/g, ' ') || 'TASK'}
        </Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const p = row.original.priority;
        return (
          <Badge
            className={
              p === 'URGENT'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-bold gap-1'
                : p === 'HIGH'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold gap-1'
                : 'bg-muted text-muted-foreground text-[10px]'
            }
          >
            {p === 'URGENT' && <Flame className="w-3 h-3" />}
            {p}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Deadline',
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-mono text-foreground font-medium block flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" /> {row.original.dueDate}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            {row.original.branchName || 'PD Vihar'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned Staff',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.assignedAvatar} alt={row.original.assignedTo} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.assignedTo.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground truncate">
            {row.original.assignedTo}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === 'COMPLETED'
                ? 'success'
                : s === 'IN_PROGRESS'
                ? 'default'
                : 'warning'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ') || 'PENDING'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const isCompleted = row.original.status === 'COMPLETED';
        return (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className={`h-7 px-2 text-[10px] gap-1 font-semibold ${
                isCompleted
                  ? 'text-muted-foreground hover:bg-muted'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30'
              }`}
              onClick={() => handleToggleComplete(id || '', row.original.status, row.original.title)}
              title={isCompleted ? 'Re-open Task' : 'Mark Task Completed'}
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>{isCompleted ? 'Undo' : 'Done'}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/tasks/${id}`)}
              title="View Task Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/tasks/${id}/edit`)}
              title="Edit Task Parameters"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.title)}
              title="Delete Task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="CRM Operational Tasks & Staff Actions"
        subtitle="Manage sales directives, member retention checkpoints, renewal follow-ups, and equipment audits."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Category,Priority,DueDate,AssignedTo,Status\n' + tasks.map((t) => `"${t.title}","${t.taskType}","${t.priority}","${t.dueDate}","${t.assignedTo}","${t.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `tasks-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Tasks exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/crm/tasks/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Create Task</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL CRM TASKS"
          value={`${totalTasks}`}
          change="+12 assigned this week"
          trend="up"
          timeframe="Staff Directives"
          icon={<CheckSquare className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="HIGH PRIORITY / URGENT"
          value={`${urgentTasks}`}
          change="Pending staff action"
          trend="up"
          timeframe="Immediate Focus"
          icon={<Flame className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="COMPLETED TASKS"
          value={`${completedTasks}`}
          change={`${completionRate}% overall rate`}
          trend="up"
          timeframe="Resolved Directives"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="OPERATIONAL EFFICIENCY"
          value={`${completionRate}%`}
          change="SLA on-schedule"
          trend="up"
          timeframe="Team Performance"
          icon={<UserCheck className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        searchPlaceholder="Search tasks by title, assigned staff, category, priority..."
      />
    </PageContainer>
  );
};
