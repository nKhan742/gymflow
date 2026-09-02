import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { ArrowLeft, Edit, Megaphone, DollarSign, Calendar, Users, Building2, Tag, Percent, TrendingUp, CheckCircle2, Share2 } from 'lucide-react';
import { ICampaign } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_campaigns');
      if (stored) {
        const customList: ICampaign[] = JSON.parse(stored);
        const match = customList.find((c) => (c.id || c._id) === id);
        if (match) {
          setCampaign(match);
          setLoading(false);
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
          setCampaign(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setCampaign({
      id: id || 'CMP-501',
      _id: id || 'CMP-501',
      name: 'Summer Shred 2026 Promo',
      code: 'SUMMER26',
      bannerUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
      channel: 'META_ADS',
      targetAudience: 'Fitness enthusiasts ages 20-40 seeking annual discounts within 5 miles',
      budgetTotal: 2500,
      spendToDate: 1120,
      startDate: '2026-08-01',
      endDate: '2026-09-01',
      leadsGenerated: 142,
      conversionsCount: 38,
      status: 'ACTIVE',
      branchName: 'Downtown Flagship',
      discountOffer: '20% Off 12-Month Gold Pass + Zero Initiation',
      notes: 'High conversion rate on Instagram reels targeting 5-mile geo radius. Top acquisition channel this quarter.',
      createdAt: '2026-08-01T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleToggleStatus = () => {
    if (!campaign) return;
    const nextStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const updated = { ...campaign, status: nextStatus as ICampaign['status'] };
    setCampaign(updated);

    const stored = localStorage.getItem('gymflow_custom_campaigns');
    if (stored) {
      const customList: ICampaign[] = JSON.parse(stored);
      const listUpdated = customList.map((c) => ((c.id || c._id) === (campaign.id || campaign._id) ? updated : c));
      localStorage.setItem('gymflow_custom_campaigns', JSON.stringify(listUpdated));
    }

    toast.success(`Campaign status changed to ${nextStatus}!`);
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

  const spendPercent = campaign.budgetTotal > 0 ? Math.round((campaign.spendToDate / campaign.budgetTotal) * 100) : 0;
  const conversionRate = campaign.leadsGenerated > 0 ? ((campaign.conversionsCount / campaign.leadsGenerated) * 100).toFixed(1) : '0.0';
  const cpl = campaign.leadsGenerated > 0 ? (campaign.spendToDate / campaign.leadsGenerated).toFixed(2) : '0.00';

  return (
    <PageContainer>
      <PageHeader
        title={campaign.name}
        subtitle={`Campaign Performance Dossier • Code: ${campaign.code}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/campaigns')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Campaigns</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/crm/campaigns/${campaign.id || campaign._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Campaign</span>
            </Button>
            <Button
              size="sm"
              className={`gap-1.5 font-semibold shadow-xs ${
                campaign.status === 'ACTIVE'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              onClick={handleToggleStatus}
            >
              <TrendingUp className="h-4 w-4" />
              <span>{campaign.status === 'ACTIVE' ? 'Pause Ads' : 'Activate Campaign'}</span>
            </Button>
          </div>
        }
      />

      {/* Campaign Banner Header */}
      {campaign.bannerUrl && (
        <div className="relative rounded-2xl overflow-hidden mb-6 h-56 md:h-72 border border-border shadow-md">
          <img src={campaign.bannerUrl} alt={campaign.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground font-mono text-xs font-bold">
                PROMO: {campaign.code}
              </Badge>
              <Badge
                variant={
                  campaign.status === 'ACTIVE'
                    ? 'success'
                    : campaign.status === 'COMPLETED'
                    ? 'secondary'
                    : 'warning'
                }
                className="text-xs font-semibold uppercase"
              >
                {campaign.status}
              </Badge>
              <Badge variant="outline" className="bg-black/40 text-white border-white/30 text-xs">
                {campaign.channel?.replace(/_/g, ' ')}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">{campaign.name}</h1>
            <p className="text-sm text-zinc-200 mt-1">{campaign.discountOffer || 'Special membership incentive'}</p>
          </div>
        </div>
      )}

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">BUDGET & SPEND</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">
            ${campaign.spendToDate.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ ${campaign.budgetTotal.toLocaleString()}</span>
          </p>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(spendPercent, 100)}%` }} />
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LEADS GENERATED</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">{campaign.leadsGenerated} Inquiries</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Cost per lead: ${cpl}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CONVERTED MEMBERS</span>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-base font-bold text-purple-600 dark:text-purple-400 mt-1">
            {campaign.conversionsCount} Enrolled
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{conversionRate}% Conversion Rate</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FLIGHT DATES</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs font-mono font-bold text-foreground mt-1 truncate">{campaign.startDate} to {campaign.endDate}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{campaign.branchName || 'Downtown Flagship'}</p>
        </Card>
      </div>

      {/* Campaign Targeting & Strategy Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-primary" />
              Target Demographic & Value Proposition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-muted-foreground block mb-1">Target Audience Profile:</span>
              <p className="text-xs font-medium text-foreground bg-muted/40 p-3 rounded-lg border border-border/60">
                {campaign.targetAudience || 'General public in local branch radius.'}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground block mb-1">Promotional Discount Hook:</span>
              <p className="text-xs font-medium text-foreground bg-muted/40 p-3 rounded-lg border border-border/60">
                {campaign.discountOffer || 'No discount hook specified.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Campaign Performance Strategy & Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 min-h-[140px]">
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {campaign.notes || 'No performance observation notes logged for this campaign flight.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
