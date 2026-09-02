import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Megaphone, Calendar, DollarSign, Building2, Tag, Percent, Image as ImageIcon, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ICampaign } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('SUMMER26');
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  const [channel, setChannel] = useState<ICampaign['channel']>('META_ADS');
  const [targetAudience, setTargetAudience] = useState('');
  const [budgetTotal, setBudgetTotal] = useState<number>(2500);
  const [spendToDate, setSpendToDate] = useState<number>(1120);
  const [leadsGenerated, setLeadsGenerated] = useState<number>(142);
  const [conversionsCount, setConversionsCount] = useState<number>(38);
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-09-01');
  const [status, setStatus] = useState<ICampaign['status']>('ACTIVE');
  const [discountOffer, setDiscountOffer] = useState('');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_campaigns');
      if (stored) {
        const customList: ICampaign[] = JSON.parse(stored);
        const match = customList.find((c) => (c.id || c._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/campaigns/${id}`, {
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
      id: id || 'CMP-501',
      _id: id || 'CMP-501',
      name: 'Summer Shred 2026 Promo',
      code: 'SUMMER26',
      bannerUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      channel: 'META_ADS',
      targetAudience: 'Fitness enthusiasts ages 20-40 seeking annual discounts',
      budgetTotal: 2500,
      spendToDate: 1120,
      startDate: '2026-08-01',
      endDate: '2026-09-01',
      leadsGenerated: 142,
      conversionsCount: 38,
      status: 'ACTIVE',
      branchName: 'Downtown Flagship',
      discountOffer: '20% Off 12-Month Gold Pass',
      notes: 'High conversion rate on Instagram story reels targeting 5-mile geo radius.',
      createdAt: '2026-08-01T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (campaign: ICampaign) => {
    setName(campaign.name || '');
    setCode(campaign.code || 'SUMMER26');
    setBannerUrl(campaign.bannerUrl);
    setChannel(campaign.channel || 'META_ADS');
    setTargetAudience(campaign.targetAudience || '');
    setBudgetTotal(campaign.budgetTotal || 2500);
    setSpendToDate(campaign.spendToDate || 0);
    setLeadsGenerated(campaign.leadsGenerated || 0);
    setConversionsCount(campaign.conversionsCount || 0);
    setStartDate(campaign.startDate || '2026-08-01');
    setEndDate(campaign.endDate || '2026-09-01');
    setStatus(campaign.status || 'ACTIVE');
    setDiscountOffer(campaign.discountOffer || '');
    if (campaign.branchId) setBranchId(campaign.branchId);
    setNotes(campaign.notes || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedCampaign: Partial<ICampaign> = {
      name,
      code,
      bannerUrl,
      channel,
      targetAudience,
      budgetTotal,
      spendToDate,
      leadsGenerated,
      conversionsCount,
      startDate,
      endDate,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      discountOffer,
      notes,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_campaigns');
      if (stored) {
        const customList: ICampaign[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedCampaign } as ICampaign;
          localStorage.setItem('gymflow_custom_campaigns', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'CMP-501', ...updatedCampaign } as ICampaign);
          localStorage.setItem('gymflow_custom_campaigns', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCampaign),
      }).catch(() => {});

      toast.success(`Marketing campaign "${name}" updated successfully!`);
      navigate('/crm/campaigns');
    } catch {
      toast.error('Failed to update campaign');
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
        title={`Edit Campaign: ${name}`}
        subtitle={`Modify targeting parameters, budget spend, and promotional vouchers`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/campaigns')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Campaigns</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Creative Banner & Visual Assets */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Campaign Visual Asset & Creative Banner
              </CardTitle>
              <CardDescription>
                Upload high-resolution marketing creative or promotional banner artwork.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={bannerUrl}
                onChange={(url) => setBannerUrl(url)}
                variant="banner"
                helperText="Upload campaign header banner (Recommended 16:9 ratio, max 5MB)"
              />
            </CardContent>
          </Card>

          {/* Card 2: Campaign Parameters & Scope */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-emerald-500" />
                Campaign Strategy & Budget Parameters
              </CardTitle>
              <CardDescription>
                Channel targeting, timeline schedules, and promotional discounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Campaign Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Summer Shred 2026 Promo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3 text-primary" /> Promo Voucher Code
                  </label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Marketing Medium</label>
                  <Select value={channel} onValueChange={(val) => setChannel(val as ICampaign['channel'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="META_ADS">📱 Meta / Instagram Ads</SelectItem>
                      <SelectItem value="GOOGLE_SEARCH">🔍 Google Search / PPC</SelectItem>
                      <SelectItem value="WHATSAPP_BROADCAST">💬 WhatsApp Broadcast</SelectItem>
                      <SelectItem value="EMAIL_NEWSLETTER">✉️ Email Newsletter</SelectItem>
                      <SelectItem value="IN_GYM_PROMO">🏋️ In-Gym Promo</SelectItem>
                      <SelectItem value="INFLUENCER_PARTNER">⭐ Influencer Sponsor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Campaign Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as ICampaign['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active</SelectItem>
                      <SelectItem value="PAUSED">🟡 Paused</SelectItem>
                      <SelectItem value="SCHEDULED">🔵 Scheduled</SelectItem>
                      <SelectItem value="COMPLETED">⚪ Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" /> Total Budget ($USD)
                  </label>
                  <Input
                    type="number"
                    value={budgetTotal}
                    onChange={(e) => setBudgetTotal(Number(e.target.value))}
                    min={0}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-primary" /> Spend to Date ($USD)
                  </label>
                  <Input
                    type="number"
                    value={spendToDate}
                    onChange={(e) => setSpendToDate(Number(e.target.value))}
                    min={0}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Users className="h-3 w-3 text-blue-500" /> Leads Generated
                  </label>
                  <Input
                    type="number"
                    value={leadsGenerated}
                    onChange={(e) => setLeadsGenerated(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Users className="h-3 w-3 text-emerald-500" /> Converted Members
                  </label>
                  <Input
                    type="number"
                    value={conversionsCount}
                    onChange={(e) => setConversionsCount(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" /> Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-rose-500" /> End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Location
                  </label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Percent className="h-3 w-3 text-primary" /> Promotional Discount & Value Proposition
                </label>
                <Input
                  placeholder="e.g. 20% Off 12-Month Gold Pass + Zero Initiation"
                  value={discountOffer}
                  onChange={(e) => setDiscountOffer(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Audience Demographic</label>
                <Input
                  placeholder="e.g. Adults 22-45 within 5 miles looking for premium strength training"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Campaign Objectives & Strategy Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe conversion targets, copywriting hooks, and landing page URLs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Campaign ID: <strong className="font-mono text-foreground">{id || 'CMP-501'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/campaigns')}>
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
