import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Phone, Mail, MessageSquare, Clock, UserCheck, ShieldCheck, Tag, Building2, UserPlus, CheckCircle2 } from 'lucide-react';
import { IVisitor } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState<IVisitor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisitor();
  }, [id]);

  const loadVisitor = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_visitors');
      if (stored) {
        const customList: IVisitor[] = JSON.parse(stored);
        const match = customList.find((v) => (v.id || v._id) === id);
        if (match) {
          setVisitor(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/visitors/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setVisitor(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setVisitor({
      id: id || 'VIS-201',
      _id: id || 'VIS-201',
      visitorName: 'David Vance',
      email: 'david.v@example.com',
      phone: '+1 (555) 880-1234',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      badgeNumber: 'GUEST-42',
      visitDate: '2026-08-29',
      checkInTime: '09:45 AM',
      purpose: 'CAMPUS_TOUR',
      hostStaff: 'Sarah Jenkins',
      branchName: 'Main Facility',
      waiverSigned: true,
      status: 'CHECKED_IN',
      notes: 'Touring free weights and functional turf zone. Inquired about guest passes for family.',
      createdAt: '2026-08-29T09:45:00.000Z',
      updatedAt: '2026-08-29T09:45:00.000Z',
    });
    setLoading(false);
  };

  const handleCompleteTour = () => {
    if (!visitor) return;
    const updated = {
      ...visitor,
      status: 'COMPLETED' as IVisitor['status'],
      checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setVisitor(updated);

    const stored = localStorage.getItem('gymflow_custom_visitors');
    if (stored) {
      const customList: IVisitor[] = JSON.parse(stored);
      const listUpdated = customList.map((v) => ((v.id || v._id) === (visitor.id || visitor._id) ? updated : v));
      localStorage.setItem('gymflow_custom_visitors', JSON.stringify(listUpdated));
    }

    toast.success(`Campus visit completed for ${visitor.visitorName}!`);
  };

  const handleConvertToLead = () => {
    if (!visitor) return;
    toast.success(`Enrolling visitor "${visitor.visitorName}" into Sales Pipeline...`);
    navigate('/crm/leads/create', {
      state: {
        prefill: {
          name: visitor.visitorName,
          email: visitor.email,
          phone: visitor.phone,
          avatarUrl: visitor.avatarUrl,
          source: 'WALK_IN',
        },
      },
    });
  };

  if (loading || !visitor) {
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
        title={visitor.visitorName}
        subtitle={`Visitor Entry Dossier • Badge #${visitor.badgeNumber}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/visitors')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Visitor Log</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/crm/visitors/${visitor.id || visitor._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Entry</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
              onClick={handleConvertToLead}
            >
              <UserPlus className="h-4 w-4" />
              <span>Add to Pipeline</span>
            </Button>
          </div>
        }
      />

      {/* 360° Profile Dossier Banner */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-emerald-500/20 shadow-md">
                <AvatarImage src={visitor.avatarUrl} alt={visitor.visitorName} />
                <AvatarFallback className="text-lg font-bold bg-emerald-500/10 text-emerald-600">
                  {visitor.visitorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{visitor.visitorName}</h2>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold gap-1">
                    Badge #{visitor.badgeNumber}
                  </Badge>
                  <Badge
                    variant={
                      visitor.status === 'CHECKED_IN'
                        ? 'success'
                        : visitor.status === 'COMPLETED'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="text-xs font-semibold uppercase"
                  >
                    {visitor.status?.replace(/_/g, ' ') || 'ACTIVE'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {visitor.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> {visitor.phone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" /> {visitor.branchName || 'Main Facility'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              {visitor.status === 'CHECKED_IN' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 border-blue-500/30 font-semibold"
                  onClick={handleCompleteTour}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
                onClick={() => {
                  const cleanPhone = (visitor.phone || '').replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(visitor.visitorName)}%2C%20welcome%20to%20GymFlow!`, '_blank');
                }}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">VISIT PURPOSE</span>
            <Tag className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1 truncate">
            {visitor.purpose?.replace(/_/g, ' ') || 'CAMPUS TOUR'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Facility Orientation</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HOST REPRESENTATIVE</span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{visitor.hostStaff}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{visitor.branchName || 'Main Facility'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CHECK-IN TIME</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-mono font-bold text-foreground mt-1">{visitor.checkInTime}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Date: {visitor.visitDate}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SAFETY WAIVER</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {visitor.waiverSigned ? '✓ Digital Verified' : 'Pending Signature'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Physical liability signed</p>
        </Card>
      </div>

      {/* Discovery & Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Visitor Special Requests & Tour Notes
          </CardTitle>
          <CardDescription className="text-xs">
            Observations logged during front-desk intake and facility tour.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {visitor.notes || 'No special requests or observations recorded.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
