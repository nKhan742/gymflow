import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Wrench, AlertTriangle, DollarSign, Calendar, Building2, User, Plus, Trash2, CheckSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IMaintenanceTicket, IMaintenanceChecklistItem } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [ticketNumber, setTicketNumber] = useState('MNT-9021');
  const [equipmentId, setEquipmentId] = useState('EQ-103');
  const [equipmentName, setEquipmentName] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [category, setCategory] = useState<IMaintenanceTicket['category']>('STRENGTH');
  const [zoneName, setZoneName] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [issueTitle, setIssueTitle] = useState('');
  const [maintenanceType, setMaintenanceType] = useState<IMaintenanceTicket['maintenanceType']>('PART_REPLACEMENT');
  const [priority, setPriority] = useState<IMaintenanceTicket['priority']>('HIGH');
  const [status, setStatus] = useState<IMaintenanceTicket['status']>('IN_PROGRESS');
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [technicianAvatar, setTechnicianAvatar] = useState<string | undefined>(undefined);
  const [scheduledDate, setScheduledDate] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [actualCost, setActualCost] = useState(0);
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Checklist
  const [checklists, setChecklists] = useState<IMaintenanceChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_maintenance');
      if (stored) {
        const customList: IMaintenanceTicket[] = JSON.parse(stored);
        const match = customList.find((t) => (t.id || t._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/equipment/maintenance/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
      id: id || 'MNT-201',
      _id: id || 'MNT-201',
      ticketNumber: 'MNT-9021',
      equipmentId: 'EQ-103',
      equipmentName: 'Hammer Strength Iso-Lateral Leg Press',
      assetTag: 'EQ-STR-308',
      category: 'STRENGTH',
      zoneName: 'Pin-Loaded Machine Alley',
      photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
      issueTitle: 'Linear bearing rattle & grease seal replacement on carriage track',
      maintenanceType: 'PART_REPLACEMENT',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedTechnician: 'Apex Fitness Repair Tech (Tyler M.)',
      technicianAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      scheduledDate: '2026-08-30',
      estimatedCost: 320,
      actualCost: 285,
      checklist: [
        { id: '1', text: 'Lock out machine and place safety tags', done: true },
        { id: '2', text: 'Inspect linear shaft rods for micro-scoring', done: true },
        { id: '3', text: 'Replace dual linear ball bearings', done: false },
        { id: '4', text: 'Apply synthetic grease and test load glide', done: false },
      ],
      resolutionNotes: 'Bearings delivered; technician on-site Saturday 08:00 AM.',
      branchName: 'Downtown Flagship',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (ticket: IMaintenanceTicket) => {
    setTicketNumber(ticket.ticketNumber || 'MNT-9021');
    if (ticket.equipmentId) setEquipmentId(ticket.equipmentId);
    setEquipmentName(ticket.equipmentName || '');
    setAssetTag(ticket.assetTag || '');
    setCategory(ticket.category || 'STRENGTH');
    setZoneName(ticket.zoneName || '');
    setPhotoUrl(ticket.photoUrl);
    setIssueTitle(ticket.issueTitle || '');
    setMaintenanceType(ticket.maintenanceType || 'PART_REPLACEMENT');
    setPriority(ticket.priority || 'HIGH');
    setStatus(ticket.status || 'IN_PROGRESS');
    setAssignedTechnician(ticket.assignedTechnician || '');
    setTechnicianAvatar(ticket.technicianAvatar);
    setScheduledDate(ticket.scheduledDate || '');
    setEstimatedCost(ticket.estimatedCost || 0);
    setActualCost(ticket.actualCost || 0);
    if (ticket.branchId) setBranchId(ticket.branchId);
    setChecklists(ticket.checklist || []);
    setResolutionNotes(ticket.resolutionNotes || '');
  };

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    setChecklists([
      ...checklists,
      { id: Date.now().toString(), text: newChecklistText.trim(), done: false },
    ]);
    setNewChecklistText('');
  };

  const handleToggleChecklist = (itemIndex: number) => {
    const updated = [...checklists];
    updated[itemIndex] = { ...updated[itemIndex], done: !updated[itemIndex].done };
    setChecklists(updated);
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklists(checklists.filter((c) => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedTicket: Partial<IMaintenanceTicket> = {
      equipmentName,
      assetTag,
      category,
      zoneName,
      photoUrl,
      issueTitle,
      maintenanceType,
      priority,
      status,
      assignedTechnician,
      technicianAvatar,
      scheduledDate,
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      checklist: checklists,
      resolutionNotes,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_maintenance');
      if (stored) {
        const customList: IMaintenanceTicket[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedTicket } as IMaintenanceTicket;
          localStorage.setItem('gymflow_custom_maintenance', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'MNT-201', ticketNumber, ...updatedTicket } as IMaintenanceTicket);
          localStorage.setItem('gymflow_custom_maintenance', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/equipment/maintenance/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket),
      }).catch(() => {});

      toast.success(`Work order #${ticketNumber} updated successfully!`);
      navigate('/equipment/maintenance');
    } catch {
      toast.error('Failed to update maintenance work order');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Work Order: #${ticketNumber}`}
        subtitle={`Update technician logs, checklist verification, and repair expenditure`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/equipment/maintenance')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Work Orders</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Machine & Issue Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-500" />
                Equipment Asset & Diagnostic Issue
              </CardTitle>
              <CardDescription>
                Target gym machine, priority level, and workflow state.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Equipment Name</label>
                  <Input
                    value={equipmentName}
                    onChange={(e) => setEquipmentName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Asset Tag</label>
                  <Input
                    value={assetTag}
                    onChange={(e) => setAssetTag(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Floor Zone Placement</label>
                  <Input
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Diagnostic Problem / Work Directive <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Maintenance Type</label>
                  <Select value={maintenanceType} onValueChange={(val) => setMaintenanceType(val as IMaintenanceTicket['maintenanceType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREVENTIVE_INSPECTION">🛡️ Preventive Inspection</SelectItem>
                      <SelectItem value="EMERGENCY_REPAIR">🚨 Emergency Breakdown</SelectItem>
                      <SelectItem value="CALIBRATION">⚙️ Sensor & Load Calibration</SelectItem>
                      <SelectItem value="PART_REPLACEMENT">🔩 Component Replacement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Urgency Priority</label>
                  <Select value={priority} onValueChange={(val) => setPriority(val as IMaintenanceTicket['priority'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRITICAL">🔴 Critical (Immediate Lockout)</SelectItem>
                      <SelectItem value="HIGH">🟠 High (Next 24 Hours)</SelectItem>
                      <SelectItem value="MEDIUM">🟡 Medium (Next 7 Days)</SelectItem>
                      <SelectItem value="LOW">🔵 Low (Routine Service)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Ticket Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IMaintenanceTicket['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN_SCHEDULED">📅 Open Scheduled</SelectItem>
                      <SelectItem value="IN_PROGRESS">🟡 In Progress</SelectItem>
                      <SelectItem value="AWAITING_PARTS">🔴 Awaiting OEM Parts</SelectItem>
                      <SelectItem value="RESOLVED_TESTED">🟢 Resolved & Tested</SelectItem>
                      <SelectItem value="CANCELED">⚪ Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Technician & Costs */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Technician Assignment & Expenditure Ledger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Technician Photo</label>
                  <ImageUpload
                    value={technicianAvatar}
                    onChange={(url) => setTechnicianAvatar(url)}
                    variant="avatar"
                    helperText="Upload technician photo"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Assigned Technician</label>
                    <Input
                      value={assignedTechnician}
                      onChange={(e) => setAssignedTechnician(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Scheduled Date</label>
                      <Input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Estimated Cost ($)</label>
                      <Input
                        type="number"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(Number(e.target.value))}
                        min={0}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Actual Billed Cost ($)</label>
                      <Input
                        type="number"
                        value={actualCost}
                        onChange={(e) => setActualCost(Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Dynamic Checklist */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-500" />
                Service Protocol Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add diagnostic or testing step..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklist();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddChecklist} variant="outline" className="gap-1 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span>Add Step</span>
                </Button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {checklists.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-muted/30 text-xs"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleChecklist(idx)}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className={`font-medium ${item.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {idx + 1}. {item.text}
                      </span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-rose-500 hover:bg-rose-500/10"
                      onClick={() => handleRemoveChecklist(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Diagnostic Observations & Technician Sign-Off</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Work Order: <strong className="font-mono text-foreground">{ticketNumber}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/equipment/maintenance')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Work Order</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
