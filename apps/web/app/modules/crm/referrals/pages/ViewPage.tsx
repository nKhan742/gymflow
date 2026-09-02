import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Gift, Users, Award, Phone, Mail, MessageSquare, Building2, Tag, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { IReferral } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [referral, setReferral] = useState<IReferral | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferral();
  }, [id]);

  const loadReferral = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_referrals');
      if (stored) {
        const customList: IReferral[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          setReferral(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/referrals/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setReferral(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setReferral({
      id: id || 'REF-601',
      _id: id || 'REF-601',
      referrerName: 'Rachel Green',
      referrerEmail: 'rachel.g@example.com',
      referrerPhone: '+1 (555) 345-6789',
      referrerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      referredProspectName: 'Monica Geller',
      referredProspectEmail: 'monica.g@example.com',
      referredProspectPhone: '+1 (555) 789-0123',
      referredProspectAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      referralCode: 'REF-9281',
      rewardType: 'FREE_MONTH',
      rewardValue: '1 Month Free Dues ($89 Value)',
      rewardStatus: 'APPROVED_ISSUED',
      status: 'CONVERTED_MEMBER',
      branchName: 'PD Vihar',
      notes: 'Enrolled in Gold 12-Month plan after touring with Rachel.',
      createdAt: '2026-08-20T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleApproveReward = () => {
    if (!referral) return;
    const updated = {
      ...referral,
      rewardStatus: 'APPROVED_ISSUED' as IReferral['rewardStatus'],
      status: 'CONVERTED_MEMBER' as IReferral['status'],
    };
    setReferral(updated);

    const stored = localStorage.getItem('gymflow_custom_referrals');
    if (stored) {
      const customList: IReferral[] = JSON.parse(stored);
      const listUpdated = customList.map((r) => ((r.id || r._id) === (referral.id || referral._id) ? updated : r));
      localStorage.setItem('gymflow_custom_referrals', JSON.stringify(listUpdated));
    }

    toast.success(`Reward approved for ${referral.referrerName}!`);
  };

  const handleConvertToMember = () => {
    if (!referral) return;
    toast.success(`Enrolling referred friend "${referral.referredProspectName}" as full member...`);
    navigate('/member-management/members/create', {
      state: {
        prefill: {
          fullName: referral.referredProspectName,
          email: referral.referredProspectEmail,
          phone: referral.referredProspectPhone,
          avatarUrl: referral.referredProspectAvatar,
        },
      },
    });
  };

  if (loading || !referral) {
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
        title={`${referral.referrerName} → ${referral.referredProspectName}`}
        subtitle={`Peer Referral Dossier • Tracking Code: ${referral.referralCode}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/referrals')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Referrals</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/crm/referrals/${referral.id || referral._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Record</span>
            </Button>
            {referral.rewardStatus === 'PENDING_QUALIFICATION' && (
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                onClick={handleApproveReward}
              >
                <Gift className="h-4 w-4" />
                <span>Approve Reward</span>
              </Button>
            )}
            <Button
              size="sm"
              className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
              onClick={handleConvertToMember}
            >
              <UserPlus className="h-4 w-4" />
              <span>Enroll Friend as Member</span>
            </Button>
          </div>
        }
      />

      {/* Dual Advocate & Friend Connection Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Member Referrer */}
            <div className="md:col-span-2 flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-emerald-500/20 shadow-md shrink-0">
                <AvatarImage src={referral.referrerAvatar} alt={referral.referrerName} />
                <AvatarFallback className="text-lg font-bold bg-emerald-500/10 text-emerald-600">
                  {referral.referrerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                  ★ ADVOCATE MEMBER
                </Badge>
                <h2 className="text-lg font-bold text-foreground">{referral.referrerName}</h2>
                <p className="text-xs text-muted-foreground">{referral.referrerPhone}</p>
                <p className="text-xs text-muted-foreground">{referral.referrerEmail}</p>
              </div>
            </div>

            {/* Connection Arrow & Code */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-3 rounded-xl bg-muted/40 border border-border">
              <ArrowRight className="w-6 h-6 text-primary mb-1" />
              <Badge variant="outline" className="font-mono text-[10px] font-bold">
                {referral.referralCode}
              </Badge>
              <span className="text-[10px] text-muted-foreground mt-1">Peer Referral</span>
            </div>

            {/* Referred Friend Prospect */}
            <div className="md:col-span-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md shrink-0">
                  <AvatarImage src={referral.referredProspectAvatar} alt={referral.referredProspectName} />
                  <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                    {referral.referredProspectName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] font-bold">
                    FRIEND PROSPECT
                  </Badge>
                  <h2 className="text-lg font-bold text-foreground">{referral.referredProspectName}</h2>
                  <p className="text-xs text-muted-foreground">{referral.referredProspectPhone}</p>
                  <p className="text-xs text-muted-foreground">{referral.referredProspectEmail}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 font-semibold"
                onClick={() => {
                  const cleanPhone = (referral.referredProspectPhone || '').replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(referral.referredProspectName)}%2C%20welcome%20to%20GymFlow!%20Your%20friend%20${encodeURIComponent(referral.referrerName)}%20referred%20you.`, '_blank');
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
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">REWARD INCENTIVE</span>
            <Gift className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1 truncate">{referral.rewardValue}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Type: {referral.rewardType?.replace(/_/g, ' ')}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">REWARD PAYOUT</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {referral.rewardStatus?.replace(/_/g, ' ')}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Advocate Benefit State</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PROSPECT STAGE</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1">{referral.status?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Funnel Milestone</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CAMPUS LOCATION</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1 truncate">{referral.branchName || 'PD Vihar'}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Primary Facility</p>
        </Card>
      </div>

      {/* Referral Context & Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            Referral Context & Discovery Notes
          </CardTitle>
          <CardDescription className="text-xs">
            Special notes recorded regarding workout goals and introduction context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {referral.notes || 'No special discovery notes recorded for this referral.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
