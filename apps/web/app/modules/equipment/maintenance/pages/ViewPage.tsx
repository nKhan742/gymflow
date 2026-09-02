import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Wrench, AlertTriangle, DollarSign, Calendar, CheckSquare, CheckCircle2, User, Building2, Tag, ShieldCheck } from 'lucide-react';
import { IMaintenanceTicket } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<IMaintenanceTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_maintenance');
      if (stored) {
        const customList: IMaintenanceTicket[] = JSON.parse(stored);
        const match = customList.find((t) => (t.id || t._id) === id);
        if (match) {
          setTicket(match);
          setLoading(false);
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
          setTicket(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setTicket({
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
        { id: '1', text: 'Lock out machine and place OUT OF SERVICE safety notice tag', done: true },
        { id: '2', text: 'Inspect linear shaft rods for micro-scoring or metal wear', done: true },
        { id: '3', text: 'Replace dual linear ball bearings (Part #HS-BRG-4402)', done: false },
        { id: '4', text: 'Apply high-viscosity synthetic lithium grease and test load glide', done: false },
      ],
      resolutionNotes: 'Bearings delivered; technician on-site Saturday 08:00 AM. Requires 200kg load test before clearing.',
      branchName: 'Downtown Flagship',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleToggleChecklist = (itemIndex: number) => {
    if (!ticket) return;
    const updatedChecklist = [...ticket.checklist];
    updatedChecklist[itemIndex] = { ...updatedChecklist[itemIndex], done: !updatedChecklist[itemIndex].done };
    const updated = { ...ticket, checklist: updatedChecklist };
    setTicket(updated);

    const stored = localStorage.getItem('gymflow_custom_maintenance');
    if (stored) {
      const customList: IMaintenanceTicket[] = JSON.parse(stored);
      const listUpdated = customList.map((t) => ((t.id || t._id) === (ticket.id || ticket._id) ? updated : t));
      localStorage.setItem('gymflow_custom_maintenance', JSON.stringify(listUpdated));
    }
  };

  const handleResolveTicket = () => {
    if (!ticket) return;
    const updated = {
      ...ticket,
      status: 'RESOLVED_TESTED' as IMaintenanceTicket['status'],
      checklist: ticket.checklist.map((c) => ({ ...c, done: true })),
    };
    setTicket(updated);

    const stored = localStorage.getItem('gymflow_custom_maintenance');
    if (stored) {
      const customList: IMaintenanceTicket[] = JSON.parse(stored);
      const listUpdated = customList.map((t) => ((t.id || t._id) === (ticket.id || ticket._id) ? updated : t));
      localStorage.setItem('gymflow_custom_maintenance', JSON.stringify(listUpdated));
    }

    toast.success(`Work order #${ticket.ticketNumber} marked as RESOLVED & TESTED!`);
  };

  if (loading || !ticket) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  const completedSteps = ticket.checklist.filter((c) => c.done).length;
  const progressPercent = ticket.checklist.length > 0 ? Math.round((completedSteps / ticket.checklist.length) * 100) : 0;

  return (
    <PageContainer>
      <PageHeader
        title={`Work Order #${ticket.ticketNumber}`}
        subtitle={`${ticket.equipmentName} • Tag: ${ticket.assetTag}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/equipment/maintenance')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Work Orders</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/equipment/maintenance/${ticket.id || ticket._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Work Order</span>
            </Button>
            {ticket.status !== 'RESOLVED_TESTED' && (
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                onClick={handleResolveTicket}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark Resolved & Tested</span>
              </Button>
            )}
          </div>
        }
      />

      {/* Target Equipment Banner Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-20 rounded-xl overflow-hidden border border-border shrink-0 bg-muted/40">
                <img
                  src={ticket.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80'}
                  alt={ticket.equipmentName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs font-bold">
                    TAG: {ticket.assetTag}
                  </Badge>
                  <Badge
                    variant={
                      ticket.priority === 'CRITICAL'
                        ? 'destructive'
                        : ticket.priority === 'HIGH'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="text-[10px] font-bold uppercase"
                  >
                    {ticket.priority} PRIORITY
                  </Badge>
                  <Badge
                    variant={
                      ticket.status === 'RESOLVED_TESTED'
                        ? 'success'
                        : ticket.status === 'IN_PROGRESS'
                        ? 'warning'
                        : 'default'
                    }
                    className="text-[10px] font-semibold uppercase"
                  >
                    {ticket.status?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-foreground">{ticket.equipmentName}</h2>
                <p className="text-xs text-muted-foreground">{ticket.issueTitle}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
              onClick={() => navigate(`/equipment/equipment-list/${ticket.equipmentId || 'EQ-103'}`)}
            >
              <Wrench className="w-3.5 h-3.5 text-primary" />
              <span>View Machine Specs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MAINTENANCE TYPE</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1 truncate">{ticket.maintenanceType?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Floor Diagnostic Directive</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SCHEDULED WINDOW</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{ticket.scheduledDate}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{ticket.branchName || 'Downtown Flagship'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">REPAIR EXPENDITURE</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ${ticket.actualCost || ticket.estimatedCost} <span className="text-xs font-normal text-muted-foreground">/ ${ticket.estimatedCost} est.</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Parts & Service Invoiced</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ASSIGNED TECHNICIAN</span>
            <User className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xs font-bold text-foreground mt-1 truncate">{ticket.assignedTechnician}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Certified OEM Partner</p>
        </Card>
      </div>

      {/* Interactive Service Protocol Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                Service Protocol Testing Checklist
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[10px]">
                {completedSteps}/{ticket.checklist.length} Completed ({progressPercent}%)
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Check off testing checkpoints directly to verify compliance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="w-full bg-muted rounded-full h-1.5 mb-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="space-y-2">
              {ticket.checklist.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(idx)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => {}}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 shrink-0"
                  />
                  <span className={`text-xs font-medium ${item.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Technician Observations & Safety Sign-Off
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 min-h-[160px]">
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {ticket.resolutionNotes || 'No special technician observations logged yet for this work order.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
