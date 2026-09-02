import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Phone, Mail, MessageSquare, Calendar, Sparkles, DollarSign, Target, User, Building2, CheckCircle2, Clock, Share2 } from 'lucide-react';
import { ILead } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<ILead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_leads');
      if (stored) {
        const customList: ILead[] = JSON.parse(stored);
        const match = customList.find((l) => (l.id || l._id) === id);
        if (match) {
          setLead(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/leads/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setLead(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback default
    setLead({
      id: id || 'LEAD-901',
      _id: id || 'LEAD-901',
      name: 'Marcus Vance',
      email: 'm.vance@example.com',
      phone: '+1 (555) 302-8819',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      source: 'INSTAGRAM',
      stage: 'VIP_TRIAL_ACTIVE',
      priority: 'HOT',
      fitnessGoal: 'HYPERTROPHY_BULKING',
      targetBudgetMonthly: 199,
      estimatedLtv: 2388,
      preferredTimeSlot: 'EVENING_PEAK',
      assignedAgent: 'Alex Vance',
      branchName: 'Downtown Flagship',
      notes: 'Interested in VIP Platinum membership with 1-on-1 personal training. Attended 2 free trial classes.',
      createdAt: '2026-08-27T10:00:00.000Z',
      updatedAt: '2026-08-27T10:00:00.000Z',
    });
    setLoading(false);
  };

  const handleConvertToMember = () => {
    if (!lead) return;
    toast.success(`Converting "${lead.name}" to Full Member...`);
    navigate('/member-management/members/create', {
      state: {
        prefill: {
          fullName: lead.name,
          email: lead.email,
          phone: lead.phone,
          avatarUrl: lead.avatarUrl,
          leadId: lead.id || lead._id,
        },
      },
    });
  };

  if (loading || !lead) {
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
        title={lead.name}
        subtitle={`Prospect Lead Dossier • #${lead.id || lead._id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/leads')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Pipeline</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/crm/leads/${lead.id || lead._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Lead</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
              onClick={handleConvertToMember}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Convert to Member</span>
            </Button>
          </div>
        }
      />

      {/* 360° Profile Dossier Banner */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
                <AvatarImage src={lead.avatarUrl} alt={lead.name} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {lead.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{lead.name}</h2>
                  {lead.priority === 'HOT' && (
                    <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs font-bold gap-1">
                      🔥 Hot Lead
                    </Badge>
                  )}
                  <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-semibold">
                    {lead.stage?.replace(/_/g, ' ') || 'LEAD'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {lead.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> {lead.phone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" /> {lead.branchName || 'Downtown Flagship'}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Communication Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
                onClick={() => {
                  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(lead.name)}%2C%20welcome%20to%20GymFlow!`, '_blank');
                }}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 border-blue-500/30"
                onClick={() => {
                  toast.success(`Booking tour for ${lead.name}...`);
                  navigate('/crm/visitors/create');
                }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Tour</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 border-purple-500/30"
                onClick={() => {
                  toast.success(`Provisioning VIP Guest Pass for ${lead.name}...`);
                  navigate('/crm/trial-members/create');
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Issue Trial Pass</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MONTHLY BUDGET</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-foreground mt-1">${lead.targetBudgetMonthly} / mo</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Est. 12-Mo LTV: ${lead.estimatedLtv}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FITNESS GOAL</span>
            <Target className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1 truncate">
            {lead.fitnessGoal?.replace(/_/g, ' ') || 'FITNESS'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">High motivation level</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SALES REP</span>
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{lead.assignedAgent}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{lead.branchName || 'Downtown Flagship'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SOURCE CHANNEL</span>
            <Share2 className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{lead.source?.replace(/_/g, ' ') || 'WEBSITE'}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Intake: {new Date(lead.createdAt || Date.now()).toLocaleDateString()}</p>
        </Card>
      </div>

      {/* Discovery & Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Lead Background & Sales Discovery Notes
          </CardTitle>
          <CardDescription className="text-xs">
            Qualification information gathered during initial outreach.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {lead.notes || 'No discovery notes recorded yet. Use Edit Lead to document conversation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card">
              <span className="text-muted-foreground block text-[11px]">Preferred Time Window</span>
              <span className="font-bold text-foreground mt-0.5 block">
                {lead.preferredTimeSlot?.replace(/_/g, ' ') || 'EVENING PEAK'}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card">
              <span className="text-muted-foreground block text-[11px]">Assigned Campus</span>
              <span className="font-bold text-foreground mt-0.5 block">
                {lead.branchName || 'Downtown Flagship'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
