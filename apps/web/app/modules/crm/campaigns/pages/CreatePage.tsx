import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Megaphone, Calendar, DollarSign, Building2, Tag, Percent, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ICampaign } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState(`CAMP-${Math.floor(100 + Math.random() * 900)}`);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  const [channel, setChannel] = useState<ICampaign['channel']>('META_ADS');
  const [targetAudience, setTargetAudience] = useState('Adults 22-45 within 5 miles looking for premium strength training');
  const [budgetTotal, setBudgetTotal] = useState<number>(1500);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [discountOffer, setDiscountOffer] = useState('20% Off 12-Month Gold Pass + Zero Initiation');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `CMP-${Math.floor(100 + Math.random() * 900)}`;

    const newCampaign: ICampaign = {
      id: newId,
      _id: newId,
      name,
      code,
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      channel,
      targetAudience,
      budgetTotal,
      spendToDate: 0,
      startDate,
      endDate,
      leadsGenerated: 0,
      conversionsCount: 0,
      status: 'ACTIVE',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      discountOffer,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_campaigns');
      const customList: ICampaign[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newCampaign);
      localStorage.setItem('gymflow_custom_campaigns', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/campaigns', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCampaign),
      }).catch(() => {});

      toast.success(`Marketing Campaign "${name}" launched successfully!`, {
        description: `Channel: ${channel.replace(/_/g, ' ')} • Budget: $${budgetTotal.toLocaleString()}`,
      });
      navigate('/crm/campaigns');
    } catch {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Launch Marketing Campaign"
        subtitle="Configure omni-channel acquisition campaigns, promo vouchers, and lead generation tracking."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
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
                    <Tag className="h-3 w-3 text-primary" /> Promo Voucher Code <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="SUMMER26"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      <SelectItem value="IN_GYM_PROMO">🏋️ In-Gym Banner Promo</SelectItem>
                      <SelectItem value="INFLUENCER_PARTNER">⭐ Influencer Sponsor</SelectItem>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Channel: <strong className="text-foreground">{channel.replace(/_/g, ' ')}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/campaigns')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Launch Campaign</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
