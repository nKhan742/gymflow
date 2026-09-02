import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, CheckSquare, User, Calendar, Clock, Building2, Flame, Plus, Trash2, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITask } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState<ITask['taskType']>('LEAD_OUTREACH');
  const [assignedTo, setAssignedTo] = useState('Alex Vance');
  const [assignedAvatar, setAssignedAvatar] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<ITask['priority']>('HIGH');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueTime] = useState('17:00 PM');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');
  const [notes, setNotes] = useState('');

  // Dynamic Checklist
  const [checklist, setChecklist] = useState<Array<{ id: string; text: string; done: boolean }>>([
    { id: '1', text: 'Call lead and review membership inquiry form', done: false },
    { id: '2', text: 'Send VIP pass invitation via WhatsApp', done: false },
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      { id: String(Date.now()), text: newChecklistText.trim(), done: false },
    ]);
    setNewChecklistText('');
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `TSK-${Math.floor(100 + Math.random() * 900)}`;

    const newTask: ITask = {
      id: newId,
      _id: newId,
      title,
      taskType,
      assignedTo,
      assignedAvatar: assignedAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority,
      dueDate,
      dueTime,
      status: 'PENDING',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      checklist,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_tasks');
      const customList: ITask[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newTask);
      localStorage.setItem('gymflow_custom_tasks', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/tasks', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      }).catch(() => {});

      toast.success(`Task "${title}" created successfully!`, {
        description: `Assigned to: ${assignedTo} • Due: ${dueDate}`,
      });
      navigate('/crm/tasks');
    } catch {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Operational CRM Task"
        subtitle="Assign sales outreach, retention checkpoints, tour follow-ups, and equipment audits to staff."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/tasks')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Task Board</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Task Core Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                Task Objective & Priority Level
              </CardTitle>
              <CardDescription>
                Define operational scope and deadline metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Conduct VIP tour for corporate group lead"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Task Category</label>
                  <Select value={taskType} onValueChange={(val) => setTaskType(val as ITask['taskType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEAD_OUTREACH">🎯 Sales & Lead Outreach</SelectItem>
                      <SelectItem value="MEMBER_RETENTION">❤️ Member Retention & Check-In</SelectItem>
                      <SelectItem value="CONTRACT_RENEWAL">📝 Contract & Membership Renewal</SelectItem>
                      <SelectItem value="VIP_CONCIERGE">✨ VIP Guest Concierge</SelectItem>
                      <SelectItem value="EQUIPMENT_AUDIT">🔧 Equipment & Safety Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Flame className="h-3 w-3 text-rose-500" /> Priority Level
                  </label>
                  <Select value={priority} onValueChange={(val) => setPriority(val as ITask['priority'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="URGENT">🔥 Urgent (Immediate)</SelectItem>
                      <SelectItem value="HIGH">⚡ High Priority</SelectItem>
                      <SelectItem value="MEDIUM">🟢 Medium Priority</SelectItem>
                      <SelectItem value="LOW">⚪ Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" /> Due Date
                  </label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Staff Assignment & Action Checklist */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500" />
                Staff Assignment & Action Checklist
              </CardTitle>
              <CardDescription>
                Assign staff member and specify operational sub-steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Assignee Photo</label>
                  <ImageUpload
                    value={assignedAvatar}
                    onChange={(url) => setAssignedAvatar(url)}
                    variant="avatar"
                    helperText="Upload assignee headshot"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Assigned Staff Member</label>
                      <Select value={assignedTo} onValueChange={setAssignedTo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Staff" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alex Vance">Alex Vance (Senior Advisor)</SelectItem>
                          <SelectItem value="Sarah Jenkins">Sarah Jenkins (Tour Coordinator)</SelectItem>
                          <SelectItem value="Marcus Kane">Marcus Kane (PT Director)</SelectItem>
                          <SelectItem value="Elena Rostova">Elena Rostova (Member Concierge)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-blue-500" /> Campus Location
                      </label>
                      <Select value={branchId} onValueChange={setBranchId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                          {branchOptions.map((b) => (
                            <SelectItem key={b.value} value={b.value}>
                              {b.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Checklist Manager */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <ListChecks className="h-3.5 w-3.5 text-primary" />
                      Task Sub-Action Checklist ({checklist.length} items)
                    </label>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add specific action step..."
                        value={newChecklistText}
                        onChange={(e) => setNewChecklistText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addChecklistItem();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addChecklistItem}
                        className="gap-1 shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {checklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50 text-xs"
                        >
                          <span className="text-foreground">{item.text}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-rose-500 hover:bg-rose-500/10"
                            onClick={() => removeChecklistItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Operational Instructions & Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Provide background context or compliance instructions for the assignee..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Priority: <strong className="text-rose-500 font-semibold">{priority}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/tasks')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Create Operational Task</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
