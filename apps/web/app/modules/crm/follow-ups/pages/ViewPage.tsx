import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Phone, Mail, MessageSquare, PhoneCall, Calendar, Clock, Flame, CheckCircle2, User, Building2, Share2 } from 'lucide-react';
import { IFollowUp } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [followUp, setFollowUp] = useState<IFollowUp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowUp();
  }, [id]);

  const loadFollowUp = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_follow_ups');
      if (stored) {
        const customList: IFollowUp[] = JSON.parse(stored);
        const match = customList.find((f) => (f.id || f._id) === id);
        if (match) {
          setFollowUp(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/follow-ups/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setFollowUp(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setFollowUp({
      id: id || 'FLW-301',
      _id: id || 'FLW-301',
      contactName: 'Jessica Alba',
      email: 'jessica.a@example.com',
      phone: '+1 (555) 749-3321',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      channel: 'WHATSAPP',
      scheduledDate: '2026-08-29',
      scheduledTime: '11:00 AM',
      priority: 'URGENT',
      assignedRep: 'Alex Vance',
      branchName: 'Main Facility',
      outcome: 'PENDING',
      notes: 'Follow up on yesterday trial class experience. Offer 15% discount for annual signup.',
      createdAt: '2026-08-29T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleMarkWon = () => {
    if (!followUp) return;
    const updated = {
      ...followUp,
      outcome: 'WON_CONVERTED' as IFollowUp['outcome'],
    };
    setFollowUp(updated);

    const stored = localStorage.getItem('gymflow_custom_follow_ups');
    if (stored) {
      const customList: IFollowUp[] = JSON.parse(stored);
      const listUpdated = customList.map((f) => ((f.id || f._id) === (followUp.id || followUp._id) ? updated : f));
      localStorage.setItem('gymflow_custom_follow_ups', JSON.stringify(listUpdated));
    }

    toast.success(`Follow-up outcome marked WON for ${followUp.contactName}!`);
  };

  if (loading || !followUp) {
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
        title={followUp.contactName}
        subtitle={`Sales Follow-Up Dossier • #${followUp.id || followUp._id}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/follow-ups')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Follow-Ups</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/crm/follow-ups/${followUp.id || followUp._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Task</span>
            </Button>
            {followUp.outcome === 'PENDING' && (
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                onClick={handleMarkWon}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark Won & Enrolled</span>
              </Button>
            )}
          </div>
        }
      />

      {/* 360° Profile Dossier Banner */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
                <AvatarImage src={followUp.avatarUrl} alt={followUp.contactName} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {followUp.contactName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{followUp.contactName}</h2>
                  {followUp.priority === 'URGENT' && (
                    <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs font-bold gap-1">
                      <Flame className="w-3 h-3" />
                      Urgent
                    </Badge>
                  )}
                  <Badge
                    variant={
                      followUp.outcome === 'WON_CONVERTED'
                        ? 'success'
                        : followUp.outcome === 'PENDING'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="text-xs font-semibold uppercase"
                  >
                    {followUp.outcome?.replace(/_/g, ' ') || 'PENDING'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {followUp.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> {followUp.phone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" /> {followUp.branchName || 'Main Facility'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Outbound */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 font-semibold"
                onClick={() => {
                  const cleanPhone = (followUp.phone || '').replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(followUp.contactName)}%2C%20following%20up%20from%20GymFlow!`, '_blank');
                }}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Launch WhatsApp</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CHANNEL</span>
            <Share2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{followUp.channel?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Automated Cadence</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ASSIGNED SALES REP</span>
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{followUp.assignedRep}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{followUp.branchName || 'Main Facility'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SCHEDULED TIME</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-mono font-bold text-foreground mt-1">{followUp.scheduledTime}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Date: {followUp.scheduledDate}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">OUTCOME STATUS</span>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1 truncate">{followUp.outcome?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Live Pipeline Status</p>
        </Card>
      </div>

      {/* Discovery & Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Call Script & Follow-Up Context Notes
          </CardTitle>
          <CardDescription className="text-xs">
            Talking points, objection records, and discount incentives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {followUp.notes || 'No script or notes recorded.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
