import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Mail, Send, Users, Calendar, Building2, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IEmailCampaign } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [campaignName, setCampaignName] = useState('September Peak Conditioning Newsletter & Hyrox Workshop');
  const [subjectLine, setSubjectLine] = useState('🔥 New Strength Equipment & Exclusive Hyrox Masterclass RSVP');
  const [previewText, setPreviewText] = useState('Unlock your full athletic potential this autumn with private coach consultations.');
  const [senderName, setSenderName] = useState('GymFlow Performance HQ');
  const [senderEmail, setSenderEmail] = useState('newsletter@gymflow-erp.com');
  const [bannerPhoto, setBannerPhoto] = useState<string | undefined>(undefined);
  const [segment, setSegment] = useState<IEmailCampaign['segment']>('ALL_ACTIVE_MEMBERS');
  const [templateType, setTemplateType] = useState<IEmailCampaign['templateType']>('NEWSLETTER');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [htmlBody, setHtmlBody] = useState(`Dear GymFlow Athlete,

We are thrilled to announce our official September Masterclass Series! 

Highlights for this month:
• Nordic Incline Platforms now operational in Free Weights Bay 2
• Hyrox Simulation Workshops every Saturday at 08:30 AM
• Complimentary InBody 770 composition scans for all Black Card members

Click below to reserve your workshop slot before registration caps.

Train with purpose,
GymFlow Coaching Staff`);
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `EML-${Math.floor(100 + Math.random() * 900)}`;

    const newCampaign: IEmailCampaign = {
      id: newId,
      _id: newId,
      campaignName,
      subjectLine,
      previewText,
      senderName,
      senderEmail,
      bannerPhoto: bannerPhoto || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
      segment,
      templateType,
      status: 'SENT',
      sentCount: segment === 'ALL_ACTIVE_MEMBERS' ? 1420 : segment === 'VIP_BLACK_CARD' ? 380 : 250,
      deliveredCount: segment === 'ALL_ACTIVE_MEMBERS' ? 1398 : segment === 'VIP_BLACK_CARD' ? 378 : 246,
      openRate: 48.5,
      clickRate: 19.2,
      scheduledDate,
      htmlBody,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_email');
      const customList: IEmailCampaign[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newCampaign);
      localStorage.setItem('gymflow_custom_email', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/communication/email', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCampaign),
      }).catch(() => {});

      toast.success(`Email broadcast dispatched: "${campaignName}"!`);
      navigate('/communication/email');
    } catch {
      toast.error('Failed to dispatch email campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Compose & Dispatch Email Broadcast"
        subtitle="Author responsive HTML email campaigns, member newsletters, retention win-backs, and event invitations."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/email')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Campaigns</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Header Artwork & Sender Setup */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email Header Banner & Sender Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Email Header Banner</label>
                  <ImageUpload
                    value={bannerPhoto}
                    onChange={(url) => setBannerPhoto(url)}
                    variant="card"
                    helperText="Upload newsletter top hero banner"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Campaign Internal Title <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. September Peak Newsletter"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Sender From Name</label>
                      <Input
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Sender Email Address</label>
                      <Input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Subject Line <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. 🔥 New Strength Equipment & Masterclass"
                      value={subjectLine}
                      onChange={(e) => setSubjectLine(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Inbox Preview Snippet (Preheader)</label>
                <Input
                  placeholder="e.g. Unlock your full athletic potential this autumn..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Segmentation & Body Copy */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Audience Segmentation & Email Body Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Recipient Segment</label>
                  <Select value={segment} onValueChange={(val) => setSegment(val as IEmailCampaign['segment'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_ACTIVE_MEMBERS">👥 All Active Members (1,420)</SelectItem>
                      <SelectItem value="VIP_BLACK_CARD">⭐ VIP Black Card Holders (380)</SelectItem>
                      <SelectItem value="PERSONAL_TRAINING_CLIENTS">🏋️ PT Package Holders (195)</SelectItem>
                      <SelectItem value="NEW_SIGNUPS_30_DAYS">✨ New Signups Last 30 Days (112)</SelectItem>
                      <SelectItem value="EXPIRED_CHURNED_LEADS">🔄 Churned Win-Back Leads (85)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Template Type</label>
                  <Select value={templateType} onValueChange={(val) => setTemplateType(val as IEmailCampaign['templateType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEWSLETTER">📰 Monthly Newsletter</SelectItem>
                      <SelectItem value="PROMOTIONAL_OFFER">🎁 Promotional Discount</SelectItem>
                      <SelectItem value="EVENT_INVITE">🏆 Event & Competition Invite</SelectItem>
                      <SelectItem value="MEMBERSHIP_RENEWAL">💳 Renewal Reminder</SelectItem>
                      <SelectItem value="WELCOME_SERIES">👋 Welcome Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" /> Dispatch Date
                  </label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">
                  Email Body Copy / Markdown Template <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  className="w-full rounded-md border border-input bg-background p-3 text-xs font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={htmlBody}
                  onChange={(e) => setHtmlBody(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Sender: <strong className="text-foreground">{senderEmail}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/email')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Send className="h-4 w-4" />
                  <span>Send Broadcast Campaign</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
