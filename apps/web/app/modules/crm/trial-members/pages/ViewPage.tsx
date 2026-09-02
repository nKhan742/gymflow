import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Phone, Mail, MessageSquare, Sparkles, QrCode, CheckCircle2, UserCheck, Calendar, Building2, ShieldCheck, Clock } from 'lucide-react';
import { ITrialMember } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trial, setTrial] = useState<ITrialMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrial();
  }, [id]);

  const loadTrial = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trial_members');
      if (stored) {
        const customList: ITrialMember[] = JSON.parse(stored);
        const match = customList.find((t) => (t.id || t._id) === id);
        if (match) {
          setTrial(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/trial-members/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTrial(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback default
    setTrial({
      id: id || 'TRL-101',
      _id: id || 'TRL-101',
      guestName: 'Jordan Hayes',
      email: 'jordan.h@example.com',
      phone: '+1 (555) 621-9988',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      passCode: 'VIP-4921',
      passType: '3_DAY_TRIAL',
      startDate: '2026-08-27',
      endDate: '2026-08-30',
      maxAllowedCheckIns: 3,
      checkInCount: 2,
      sponsorTrainer: 'Coach Alex Vance',
      branchName: 'Downtown Flagship',
      status: 'ACTIVE',
      amenitiesIncluded: ['Gym Floor', 'Locker Room', 'Group Studio', 'Recovery Lounge'],
      notes: 'Interested in sauna, pool, and hypertrophy weights. Attending coach intro today.',
      createdAt: '2026-08-27T08:00:00.000Z',
      updatedAt: '2026-08-27T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleIncrementCheckIn = () => {
    if (!trial) return;
    if (trial.checkInCount >= trial.maxAllowedCheckIns) {
      toast.error(`Entry quota exhausted (${trial.maxAllowedCheckIns}/${trial.maxAllowedCheckIns} entries used)!`);
      return;
    }

    const updated = {
      ...trial,
      checkInCount: trial.checkInCount + 1,
      status: (trial.checkInCount + 1 >= trial.maxAllowedCheckIns ? 'EXPIRED' : trial.status) as ITrialMember['status'],
    };
    setTrial(updated);

    const stored = localStorage.getItem('gymflow_custom_trial_members');
    if (stored) {
      const customList: ITrialMember[] = JSON.parse(stored);
      const listUpdated = customList.map((t) => ((t.id || t._id) === (trial.id || trial._id) ? updated : t));
      localStorage.setItem('gymflow_custom_trial_members', JSON.stringify(listUpdated));
    }

    toast.success(`Turnstile access granted for ${trial.guestName}!`, {
      description: `Check-in recorded (${trial.checkInCount + 1}/${trial.maxAllowedCheckIns} entries used).`,
    });
  };

  const handleConvertToMember = () => {
    if (!trial) return;
    toast.success(`Converting "${trial.guestName}" to Full Member...`);
    navigate('/member-management/members/create', {
      state: {
        prefill: {
          fullName: trial.guestName,
          email: trial.email,
          phone: trial.phone,
          avatarUrl: trial.avatarUrl,
        },
      },
    });
  };

  if (loading || !trial) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  const usagePct = Math.min((trial.checkInCount / trial.maxAllowedCheckIns) * 100, 100);

  return (
    <PageContainer>
      <PageHeader
        title={trial.guestName}
        subtitle={`VIP Trial Passport Dossier • #${trial.passCode}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/trial-members')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Passports</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/crm/trial-members/${trial.id || trial._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Pass</span>
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
              <Avatar className="h-16 w-16 border-2 border-purple-500/20 shadow-md">
                <AvatarImage src={trial.avatarUrl} alt={trial.guestName} />
                <AvatarFallback className="text-lg font-bold bg-purple-500/10 text-purple-600">
                  {trial.guestName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{trial.guestName}</h2>
                  <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-bold gap-1">
                    <Sparkles className="w-3 h-3" />
                    {trial.passType?.replace(/_/g, ' ') || 'TRIAL'}
                  </Badge>
                  <Badge
                    variant={
                      trial.status === 'ACTIVE'
                        ? 'success'
                        : trial.status === 'CONVERTED'
                        ? 'default'
                        : 'warning'
                    }
                    className="text-xs font-semibold uppercase"
                  >
                    {trial.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {trial.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> {trial.phone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" /> {trial.branchName || 'Downtown Flagship'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-primary hover:bg-primary/10 border-primary/30 font-semibold"
                onClick={handleIncrementCheckIn}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>+1 Turnstile Entry</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
                onClick={() => {
                  const cleanPhone = (trial.phone || '').replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(trial.guestName)}%2C%20welcome%20to%20GymFlow!`, '_blank');
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
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TURNSTILE USAGE</span>
            <QrCode className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground mt-1">
            {trial.checkInCount} / {trial.maxAllowedCheckIns} <span className="text-xs text-muted-foreground font-normal">Entries</span>
          </p>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all ${
                usagePct >= 100 ? 'bg-rose-500' : usagePct >= 50 ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACCESS CODE</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-mono font-bold text-foreground mt-1 tracking-wider">{trial.passCode}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">NFC / Turnstile QR Enabled</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SPONSOR COACH</span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{trial.sponsorTrainer}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{trial.branchName || 'Downtown Flagship'}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">VALIDITY WINDOW</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xs font-mono font-bold text-foreground mt-1">{trial.startDate} → {trial.endDate}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">Active Experience</p>
        </Card>
      </div>

      {/* Access Amenities & Staff Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              Included Amenities & Access Zones
            </CardTitle>
            <CardDescription className="text-xs">
              Facilities permitted for this trial passport category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(trial.amenitiesIncluded || ['Gym Floor', 'Locker Room', 'Group Studio']).map((am, i) => (
                <Badge key={i} variant="outline" className="text-xs py-1 px-2.5 bg-muted/30">
                  ✨ {am}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Staff Notes & Observations
            </CardTitle>
            <CardDescription className="text-xs">
              Discovery information logged by host coach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-medium text-foreground leading-relaxed bg-muted/40 p-3 rounded-lg border border-border/60">
              {trial.notes || 'No staff observations logged yet. Edit pass to add notes.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
