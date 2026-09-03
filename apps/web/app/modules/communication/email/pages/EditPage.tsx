import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Mail, Send, Users, Calendar, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IEmailCampaign } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [campaignName, setCampaignName] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [bannerPhoto, setBannerPhoto] = useState<string | undefined>(undefined);
  const [segment, setSegment] = useState<IEmailCampaign['segment']>('ALL_ACTIVE_MEMBERS');
  const [templateType, setTemplateType] = useState<IEmailCampaign['templateType']>('NEWSLETTER');
  const [status, setStatus] = useState<IEmailCampaign['status']>('SENT');
  const [scheduledDate, setScheduledDate] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_email');
      if (stored) {
        const customList: IEmailCampaign[] = JSON.parse(stored);
        const match = customList.find((c) => (c.id || c._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
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
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
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
      htmlBody: `Dear GymFlow Athlete,\n\nWe are thrilled to announce our official September Masterclass Series!`,
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (camp: IEmailCampaign) => {
    setCampaignName(camp.campaignName || '');
    setSubjectLine(camp.subjectLine || '');
    setPreviewText(camp.previewText || '');
    setSenderName(camp.senderName || '');
    setSenderEmail(camp.senderEmail || '');
    setBannerPhoto(camp.bannerPhoto);
    setSegment(camp.segment || 'ALL_ACTIVE_MEMBERS');
    setTemplateType(camp.templateType || 'NEWSLETTER');
    setStatus(camp.status || 'SENT');
    setScheduledDate(camp.scheduledDate || '');
    setHtmlBody(camp.htmlBody || '');
    if (camp.branchId) setBranchId(camp.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedCampaign: Partial<IEmailCampaign> = {
      campaignName,
      subjectLine,
      previewText,
      senderName,
      senderEmail,
      bannerPhoto,
      segment,
      templateType,
      status,
      scheduledDate,
      htmlBody,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_email');
      if (stored) {
        const customList: IEmailCampaign[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedCampaign } as IEmailCampaign;
          localStorage.setItem('gymflow_custom_email', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'EML-101', ...updatedCampaign } as IEmailCampaign);
          localStorage.setItem('gymflow_custom_email', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/email/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCampaign),
      }).catch(() => {});

      toast.success(`Campaign #${id} updated!`);
      navigate('/communication/email');
    } catch {
      toast.error('Failed to update email campaign');
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
        title={`Edit Campaign #${id || '101'}`}
        subtitle="Modify email sender parameters, subject line, recipient targeting, and HTML body."
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Segment</label>
                  <Select value={segment} onValueChange={(val) => setSegment(val as IEmailCampaign['segment'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_ACTIVE_MEMBERS">👥 All Active Members</SelectItem>
                      <SelectItem value="VIP_BLACK_CARD">⭐ VIP Black Card Holders</SelectItem>
                      <SelectItem value="PERSONAL_TRAINING_CLIENTS">🏋️ PT Package Holders</SelectItem>
                      <SelectItem value="NEW_SIGNUPS_30_DAYS">✨ New Signups Last 30 Days</SelectItem>
                      <SelectItem value="EXPIRED_CHURNED_LEADS">🔄 Churned Win-Back Leads</SelectItem>
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
                      <SelectItem value="EVENT_INVITE">🏆 Event & Competition</SelectItem>
                      <SelectItem value="MEMBERSHIP_RENEWAL">💳 Renewal Reminder</SelectItem>
                      <SelectItem value="WELCOME_SERIES">👋 Welcome Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IEmailCampaign['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SENT">🟢 Sent & Broadcasted</SelectItem>
                      <SelectItem value="SCHEDULED">📅 Scheduled</SelectItem>
                      <SelectItem value="DRAFT">⚪ Draft</SelectItem>
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
                Campaign ID: <strong className="font-mono text-foreground">{id || 'EML-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/email')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Campaign</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
