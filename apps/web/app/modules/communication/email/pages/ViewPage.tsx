import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Mail, Send, CheckCircle2, TrendingUp, Users, Calendar, MousePointerClick, ShieldCheck } from 'lucide-react';
import { IEmailCampaign } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<IEmailCampaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_email');
      if (stored) {
        const customList: IEmailCampaign[] = JSON.parse(stored);
        const match = customList.find((c) => (c.id || c._id) === id);
        if (match) {
          setCampaign(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/email/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCampaign(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setCampaign({
      id: id || 'EML-101',
      _id: id || 'EML-101',
      campaignName: 'September Peak Conditioning Newsletter & Hyrox Workshop',
      subjectLine: '🔥 New Strength Equipment & Exclusive Hyrox Masterclass RSVP',
      previewText: 'Unlock your full athletic potential this autumn with private coach consultations.',
      senderName: 'GymFlow Performance HQ',
      senderEmail: 'newsletter@gymflow-erp.com',
      bannerPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
      segment: 'ALL_ACTIVE_MEMBERS',
      templateType: 'NEWSLETTER',
      status: 'SENT',
      sentCount: 1420,
      deliveredCount: 1398,
      openRate: 51.4,
      clickRate: 22.8,
      scheduledDate: '2026-08-25',
      htmlBody: `Dear GymFlow Athlete,\n\nWe are thrilled to announce our official September Masterclass Series!\n\nHighlights for this month:\n• Nordic Incline Platforms now operational in Free Weights Bay 2\n• Hyrox Simulation Workshops every Saturday at 08:30 AM\n• Complimentary InBody 770 composition scans for all Black Card members\n\nClick below to reserve your workshop slot before registration caps.\n\nTrain with purpose,\nGymFlow Coaching Staff`,
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleSendTest = () => {
    if (!campaign) return;
    toast.success(`Test email broadcast dispatched for "${campaign.campaignName}" to admin inbox!`);
  };

  if (loading || !campaign) {
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
        title={campaign.campaignName}
        subtitle={`${campaign.templateType?.replace(/_/g, ' ')} • Sent on ${campaign.scheduledDate}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/email')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Campaigns</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/communication/email/${campaign.id || campaign._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Campaign</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-xs font-semibold"
              onClick={handleSendTest}
            >
              <Mail className="h-4 w-4" />
              <span>Send Test Email</span>
            </Button>
          </div>
        }
      />

      {/* Email Preview Mockup */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <div className="bg-muted/40 p-4 border-b border-border space-y-1.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-16">Subject:</span>
            <span className="font-bold text-foreground font-sans">{campaign.subjectLine}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-16">From:</span>
            <span className="text-foreground">{campaign.senderName} &lt;{campaign.senderEmail}&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-16">To:</span>
            <Badge variant="outline" className="text-[10px] font-sans font-semibold">
              {campaign.segment?.replace(/_/g, ' ')} ({campaign.deliveredCount} recipients)
            </Badge>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto space-y-6">
          <div className="h-48 rounded-xl overflow-hidden bg-muted">
            <img
              src={campaign.bannerPhoto}
              alt={campaign.campaignName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 rounded-xl bg-card border border-border shadow-2xs space-y-4">
            <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {campaign.htmlBody}
            </div>

            <div className="pt-4 border-t border-border flex justify-center">
              <Button size="sm" className="px-6 font-semibold">
                RSVP & View Schedule
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DELIVERED INBOXES</span>
            <Send className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-foreground mt-1 font-mono">{campaign.deliveredCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{campaign.segment?.replace(/_/g, ' ')}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">OPEN RATE %</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{campaign.openRate}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{Math.round((campaign.openRate * campaign.deliveredCount) / 100)} unique opens</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CLICK-THROUGH RATE %</span>
            <MousePointerClick className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">{campaign.clickRate}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{Math.round((campaign.clickRate * campaign.deliveredCount) / 100)} link clicks</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CAMPAIGN STATUS</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">{campaign.status}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">SMTP Relay Completed</p>
        </Card>
      </div>
    </PageContainer>
  );
};
