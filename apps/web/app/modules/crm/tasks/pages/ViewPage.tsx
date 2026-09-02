import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, CheckSquare, Calendar, Clock, Flame, CheckCircle2, User, Building2, ListChecks, Tag } from 'lucide-react';
import { ITask } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_tasks');
      if (stored) {
        const customList: ITask[] = JSON.parse(stored);
        const match = customList.find((t) => (t.id || t._id) === id);
        if (match) {
          setTask(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/tasks/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTask(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setTask({
      id: id || 'TSK-401',
      _id: id || 'TSK-401',
      title: 'VIP Tour for Corporate Group Lead',
      taskType: 'LEAD_OUTREACH',
      assignedTo: 'Alex Vance',
      assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'URGENT',
      dueDate: '2026-08-29',
      dueTime: '14:00 PM',
      status: 'IN_PROGRESS',
      branchName: 'Downtown Flagship',
      checklist: [
        { id: '1', text: 'Prepare corporate membership proposal deck', done: true },
        { id: '2', text: 'Reserve private conference room for presentation', done: true },
        { id: '3', text: 'Conduct facility walkthrough & equipment trial', done: false },
      ],
      notes: 'Meeting representative from TechCorp for 25+ employee annual plan.',
      createdAt: '2026-08-29T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleToggleChecklistItem = (itemId: string) => {
    if (!task) return;
    const updatedChecklist = (task.checklist || []).map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    const updated = { ...task, checklist: updatedChecklist };
    setTask(updated);

    const stored = localStorage.getItem('gymflow_custom_tasks');
    if (stored) {
      const customList: ITask[] = JSON.parse(stored);
      const listUpdated = customList.map((t) => ((t.id || t._id) === (task.id || task._id) ? updated : t));
      localStorage.setItem('gymflow_custom_tasks', JSON.stringify(listUpdated));
    }
  };

  const handleToggleDone = () => {
    if (!task) return;
    const nextStatus = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    const updated = { ...task, status: nextStatus as ITask['status'] };
    setTask(updated);

    const stored = localStorage.getItem('gymflow_custom_tasks');
    if (stored) {
      const customList: ITask[] = JSON.parse(stored);
      const listUpdated = customList.map((t) => ((t.id || t._id) === (task.id || task._id) ? updated : t));
      localStorage.setItem('gymflow_custom_tasks', JSON.stringify(listUpdated));
    }

    toast.success(`Task status updated to ${nextStatus}!`);
  };

  if (loading || !task) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  const checklistItems = task.checklist || [];
  const completedChecklistCount = checklistItems.filter((c) => c.done).length;

  return (
    <PageContainer>
      <PageHeader
        title={task.title}
        subtitle={`Task Directive Dossier • #${task.id || task._id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/tasks')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Task Board</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/crm/tasks/${task.id || task._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Task</span>
            </Button>
            <Button
              size="sm"
              className={`gap-1.5 font-semibold shadow-xs ${
                task.status === 'COMPLETED'
                  ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              onClick={handleToggleDone}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{task.status === 'COMPLETED' ? 'Reopen Task' : 'Mark Completed'}</span>
            </Button>
          </div>
        }
      />

      {/* 360° Task Dossier Banner */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
                <AvatarImage src={task.assignedAvatar} alt={task.assignedTo} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {task.assignedTo.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{task.title}</h2>
                  {task.priority === 'URGENT' && (
                    <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs font-bold gap-1">
                      <Flame className="w-3 h-3" />
                      Urgent
                    </Badge>
                  )}
                  <Badge
                    variant={
                      task.status === 'COMPLETED'
                        ? 'success'
                        : task.status === 'IN_PROGRESS'
                        ? 'default'
                        : 'warning'
                    }
                    className="text-xs font-semibold uppercase"
                  >
                    {task.status?.replace(/_/g, ' ') || 'PENDING'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <User className="w-3.5 h-3.5 text-primary" /> Assignee: {task.assignedTo}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> Due: {task.dueDate} @ {task.dueTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" /> {task.branchName || 'Downtown Flagship'}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist progress badge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <ListChecks className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs font-bold text-foreground">
                  {completedChecklistCount} of {checklistItems.length} Actions Done
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {checklistItems.length > 0
                    ? `${Math.round((completedChecklistCount / checklistItems.length) * 100)}% Complete`
                    : 'No checklist items'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CATEGORY</span>
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{task.taskType?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Operational Scope</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ASSIGNED STAFF</span>
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{task.assignedTo}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{task.branchName || 'Downtown Flagship'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DUE DEADLINE</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-mono font-bold text-foreground mt-1">{task.dueTime}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Date: {task.dueDate}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">EXECUTION STATUS</span>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{task.status?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Live Directive State</p>
        </Card>
      </div>

      {/* Interactive Sub-Action Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-primary" />
              Sub-Action Checkpoints ({completedChecklistCount}/{checklistItems.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Click checkboxes to toggle real-time completion status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {checklistItems.length === 0 ? (
              <p className="text-xs text-muted-foreground">No specific sub-action checkpoints added.</p>
            ) : (
              <div className="space-y-2">
                {checklistItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/60 text-xs cursor-pointer hover:bg-muted/70 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleChecklistItem(item.id)}
                      className="rounded border-input text-primary cursor-pointer h-4 w-4"
                    />
                    <span className={item.done ? 'line-through text-muted-foreground font-medium' : 'text-foreground font-medium'}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Operational Context & Compliance Notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-primary" />
              Operational Instructions & Scope Notes
            </CardTitle>
            <CardDescription className="text-xs">
              Compliance mandates and background context for assignee.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 min-h-[140px]">
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {task.notes || 'No special operational instructions recorded.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
