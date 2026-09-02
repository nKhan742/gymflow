import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Wrench, AlertTriangle, DollarSign, Calendar, Building2, User, Plus, Trash2, CheckSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IMaintenanceTicket, IMaintenanceChecklistItem } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  const prefill = (location.state as any)?.prefill || {};

  // Form State
  const [ticketNumber, setTicketNumber] = useState(`MNT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [equipmentId, setEquipmentId] = useState(prefill.equipmentId || 'EQ-103');
  const [equipmentName, setEquipmentName] = useState(prefill.equipmentName || 'Hammer Strength Iso-Lateral Leg Press');
  const [assetTag, setAssetTag] = useState(prefill.assetTag || 'EQ-STR-308');
  const [category, setCategory] = useState<IMaintenanceTicket['category']>(prefill.category || 'STRENGTH');
  const [zoneName, setZoneName] = useState(prefill.zoneName || 'Pin-Loaded Machine Alley');
  const [issueTitle, setIssueTitle] = useState('Linear bearing rattle & grease seal replacement on carriage track');
  const [maintenanceType, setMaintenanceType] = useState<IMaintenanceTicket['maintenanceType']>('PART_REPLACEMENT');
  const [priority, setPriority] = useState<IMaintenanceTicket['priority']>('HIGH');
  const [assignedTechnician, setAssignedTechnician] = useState('Apex Fitness Repair Tech (Tyler M.)');
  const [technicianAvatar, setTechnicianAvatar] = useState<string | undefined>(undefined);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [estimatedCost, setEstimatedCost] = useState(320);
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Checklist
  const [checklists, setChecklists] = useState<IMaintenanceChecklistItem[]>([
    { id: '1', text: 'Lock out machine and place OUT OF SERVICE safety notice tag', done: true },
    { id: '2', text: 'Inspect linear shaft rods for micro-scoring or metal wear', done: false },
    { id: '3', text: 'Replace dual linear ball bearings (Part #HS-BRG-4402)', done: false },
    { id: '4', text: 'Apply high-viscosity synthetic lithium grease and test load glide', done: false },
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    setChecklists([
      ...checklists,
      { id: Date.now().toString(), text: newChecklistText.trim(), done: false },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklists(checklists.filter((c) => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `MNT-${Math.floor(100 + Math.random() * 900)}`;

    const newTicket: IMaintenanceTicket = {
      id: newId,
      _id: newId,
      ticketNumber,
      equipmentId,
      equipmentName,
      assetTag,
      category,
      zoneName,
      photoUrl: prefill.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
      issueTitle,
      maintenanceType,
      priority,
      status: 'OPEN_SCHEDULED',
      assignedTechnician,
      technicianAvatar: technicianAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      scheduledDate,
      estimatedCost: Number(estimatedCost) || 0,
      checklist: checklists,
      resolutionNotes,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_maintenance');
      const customList: IMaintenanceTicket[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newTicket);
      localStorage.setItem('gymflow_custom_maintenance', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/equipment/maintenance', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      }).catch(() => {});

      toast.success(`Work order #${ticketNumber} created for "${equipmentName}"!`, {
        description: `Priority: ${priority} • Tech: ${assignedTechnician}`,
      });
      navigate('/equipment/maintenance');
    } catch {
      toast.error('Failed to create maintenance work order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Open Maintenance Work Order"
        subtitle="Schedule preventive equipment servicing, track parts replacement, and assign certified technicians."
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
                Specify the target gym machine and primary diagnostic symptom.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Equipment Asset Name <span className="text-rose-500">*</span>
                  </label>
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
                  placeholder="e.g. Squeaking cable pulley / motor belt slipping at high speeds"
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
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Branch
                  </label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Branch" />
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
            </CardContent>
          </Card>

          {/* Card 2: Technician Assignment & Schedule */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Technician Assignment & Budget Estimation
              </CardTitle>
              <CardDescription>
                Assign certified repair provider and set inspection window.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Technician Photo</label>
                  <ImageUpload
                    value={technicianAvatar}
                    onChange={(url) => setTechnicianAvatar(url)}
                    variant="avatar"
                    helperText="Upload technician ID badge"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Assigned Technician / Vendor</label>
                    <Input
                      placeholder="e.g. Apex Certified Fitness Technicians"
                      value={assignedTechnician}
                      onChange={(e) => setAssignedTechnician(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-blue-500" /> Scheduled Service Date
                      </label>
                      <Input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-emerald-500" /> Estimated Cost ($ USD)
                      </label>
                      <Input
                        type="number"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Dynamic Repair Inspection Checklist */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-500" />
                Service Protocol Checklist
              </CardTitle>
              <CardDescription>
                Sub-actions and testing steps required for technician sign-off.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add inspection or replacement step (e.g. Test emergency stop lanyard)..."
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
                    <span className="font-medium text-foreground">
                      {idx + 1}. {item.text}
                    </span>
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
                <label className="text-xs font-semibold text-foreground">Diagnostic Observations & Special Instructions</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Safety isolation requirements, OEM part numbers, technician access hours..."
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
                  <span>Issue Work Order</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
