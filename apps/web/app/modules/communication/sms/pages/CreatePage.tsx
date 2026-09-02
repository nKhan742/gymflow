import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ArrowLeft, Save, MessageSquare, Send, Smartphone, ShieldCheck, DollarSign, Users, Radio, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ISmsBlast } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [campaignTitle, setCampaignTitle] = useState('Weekend Sauna Upgrade & Cold Plunge Pass');
  const [smsText, setSmsText] = useState('GymFlow Alert: Our new Finnish dry sauna & cold plunge suite is open! Show this text at the front desk for a complimentary recovery smoothie. Reply STOP to opt out.');
  const [senderId, setSenderId] = useState('GYMFLOW');
  const [gatewayProvider, setGatewayProvider] = useState<ISmsBlast['gatewayProvider']>('TWILIO');
  const [targetAudience, setTargetAudience] = useState<ISmsBlast['targetAudience']>('ALL_MEMBERS');
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().slice(0, 16));
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');

  // Calculations
  const charLength = smsText.length;
  const segments = Math.max(1, Math.ceil(charLength / 160));
  const audienceCount = targetAudience === 'ALL_MEMBERS' ? 1420 : targetAudience === 'OVERDUE_PAYMENT' ? 42 : targetAudience === 'CLASS_REMINDER' ? 180 : 350;
  const costPerSms = 0.015;
  const estimatedCost = (segments * audienceCount * costPerSms).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `SMS-${Math.floor(100 + Math.random() * 900)}`;

    const newSms: ISmsBlast = {
      id: newId,
      _id: newId,
      campaignTitle,
      smsText,
      senderId,
      gatewayProvider,
      targetAudience,
      status: 'DELIVERED',
      recipientsCount: audienceCount,
      deliveredCount: audienceCount - 2,
      characterCount: charLength,
      smsSegments: segments,
      estimatedCost: parseFloat(estimatedCost),
      scheduledAt,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_sms');
      const customList: ISmsBlast[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newSms);
      localStorage.setItem('gymflow_custom_sms', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/communication/sms', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSms),
      }).catch(() => {});

      toast.success(`SMS Blast dispatched: "${campaignTitle}" to ${audienceCount} numbers!`);
      navigate('/communication/sms');
    } catch {
      toast.error('Failed to dispatch SMS blast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Compose & Dispatch SMS Gateway Blast"
        subtitle="Broadcast instant text alerts, automated payment reminders, and urgent facility updates with real-time GSM segment tracking."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/sms')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to SMS Gateway</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Blast Parameters */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                SMS Blast Configuration & Routing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Internal Campaign Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Weekend Flash Promo"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Sender Alphanumeric ID <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. GYMFLOW"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value.toUpperCase().slice(0, 11))}
                    maxLength={11}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Gateway Provider</label>
                  <Select value={gatewayProvider} onValueChange={(val) => setGatewayProvider(val as ISmsBlast['gatewayProvider'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TWILIO">⚡ Twilio Messaging</SelectItem>
                      <SelectItem value="AWS_SNS">☁️ AWS SNS Dedicated</SelectItem>
                      <SelectItem value="VONAGE">🌐 Vonage / Nexmo</SelectItem>
                      <SelectItem value="INFOBIP">📡 Infobip Global</SelectItem>
                      <SelectItem value="SINCH">🚀 Sinch SMS Engine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Recipient Audience</label>
                  <Select value={targetAudience} onValueChange={(val) => setTargetAudience(val as ISmsBlast['targetAudience'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_MEMBERS">👥 All Active Members (1,420)</SelectItem>
                      <SelectItem value="OVERDUE_PAYMENT">💳 Overdue Invoices / Dunning (42)</SelectItem>
                      <SelectItem value="CLASS_REMINDER">⏰ Class Bookings in Next 24h (180)</SelectItem>
                      <SelectItem value="VIP_TIER">⭐ VIP Black Card Holders (380)</SelectItem>
                      <SelectItem value="INACTIVE_30_DAYS">💤 Inactive Members (30+ Days) (210)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Dispatch Timestamp</label>
                  <Input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: SMS Copy & Live Segment Calculator */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  Text Payload & Live Segment Meter
                </span>
                <span className="text-xs font-mono text-muted-foreground font-normal">
                  {charLength} chars • <strong className="text-foreground font-bold">{segments} segment{segments > 1 ? 's' : ''}</strong>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  SMS Message Body (GSM-7 Encoding) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-input bg-background p-3 text-xs font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  required
                />
              </div>

              {/* Cost & Routing summary banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg border border-border text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Total Recipients</span>
                    <span className="font-bold text-foreground">{audienceCount} members</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Total SMS Dispatched</span>
                    <span className="font-bold text-foreground">{audienceCount * segments} units</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Estimated Carrier Cost</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">\${estimatedCost} USD</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Sender ID: <strong className="font-mono text-foreground">{senderId}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/sms')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Send className="h-4 w-4" />
                  <span>Blast SMS Now</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
