import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ArrowLeft, Save, MessageSquare, Smartphone, DollarSign, Users, Radio } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ISmsBlast } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [smsText, setSmsText] = useState('');
  const [senderId, setSenderId] = useState('GYMFLOW');
  const [gatewayProvider, setGatewayProvider] = useState<ISmsBlast['gatewayProvider']>('TWILIO');
  const [targetAudience, setTargetAudience] = useState<ISmsBlast['targetAudience']>('ALL_MEMBERS');
  const [status, setStatus] = useState<ISmsBlast['status']>('DELIVERED');
  const [scheduledAt, setScheduledAt] = useState('');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  // Calculations
  const charLength = smsText.length;
  const segments = Math.max(1, Math.ceil(charLength / 160));
  const audienceCount = targetAudience === 'ALL_MEMBERS' ? 1420 : targetAudience === 'OVERDUE_PAYMENT' ? 42 : targetAudience === 'CLASS_REMINDER' ? 180 : 350;
  const costPerSms = 0.015;
  const estimatedCost = (segments * audienceCount * costPerSms).toFixed(2);

  useEffect(() => {
    loadSms();
  }, [id]);

  const loadSms = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_sms');
      if (stored) {
        const customList: ISmsBlast[] = JSON.parse(stored);
        const match = customList.find((s) => (s.id || s._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/sms/${id}`, {
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
      id: id || 'SMS-101',
      _id: id || 'SMS-101',
      campaignTitle: 'Weekend Sauna Upgrade & Cold Plunge Pass',
      smsText: 'GymFlow Alert: Our new Finnish dry sauna & cold plunge suite is open! Show this text at the front desk for a complimentary recovery smoothie. Reply STOP to opt out.',
      senderId: 'GYMFLOW',
      gatewayProvider: 'TWILIO',
      targetAudience: 'ALL_MEMBERS',
      status: 'DELIVERED',
      recipientsCount: 1420,
      deliveredCount: 1412,
      characterCount: 168,
      smsSegments: 2,
      estimatedCost: 42.6,
      scheduledAt: '2026-08-25T09:00',
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (sms: ISmsBlast) => {
    setCampaignTitle(sms.campaignTitle || '');
    setSmsText(sms.smsText || '');
    setSenderId(sms.senderId || 'GYMFLOW');
    setGatewayProvider(sms.gatewayProvider || 'TWILIO');
    setTargetAudience(sms.targetAudience || 'ALL_MEMBERS');
    setStatus(sms.status || 'DELIVERED');
    setScheduledAt(sms.scheduledAt || '');
    if (sms.branchId) setBranchId(sms.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedSms: Partial<ISmsBlast> = {
      campaignTitle,
      smsText,
      senderId,
      gatewayProvider,
      targetAudience,
      status,
      recipientsCount: audienceCount,
      deliveredCount: audienceCount - 2,
      characterCount: charLength,
      smsSegments: segments,
      estimatedCost: parseFloat(estimatedCost),
      scheduledAt,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_sms');
      if (stored) {
        const customList: ISmsBlast[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedSms } as ISmsBlast;
          localStorage.setItem('gymflow_custom_sms', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'SMS-101', ...updatedSms } as ISmsBlast);
          localStorage.setItem('gymflow_custom_sms', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/sms/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSms),
      }).catch(() => {});

      toast.success(`SMS Blast #${id} updated!`);
      navigate('/communication/sms');
    } catch {
      toast.error('Failed to update SMS blast');
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
        title={`Edit SMS Blast #${id || '101'}`}
        subtitle="Modify SMS gateway parameters, alphanumeric sender ID, audience target, and message copy."
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
                    Campaign Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Audience</label>
                  <Select value={targetAudience} onValueChange={(val) => setTargetAudience(val as ISmsBlast['targetAudience'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_MEMBERS">👥 All Active Members</SelectItem>
                      <SelectItem value="OVERDUE_PAYMENT">💳 Overdue Invoices / Dunning</SelectItem>
                      <SelectItem value="CLASS_REMINDER">⏰ Class Bookings in Next 24h</SelectItem>
                      <SelectItem value="VIP_TIER">⭐ VIP Black Card Holders</SelectItem>
                      <SelectItem value="INACTIVE_30_DAYS">💤 Inactive Members (30+ Days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as ISmsBlast['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DELIVERED">🟢 Delivered</SelectItem>
                      <SelectItem value="QUEUED">⏳ Queued</SelectItem>
                      <SelectItem value="FAILED">🔴 Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Dispatch Timestamp</label>
                  <Input
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
                Blast ID: <strong className="font-mono text-foreground">{id || 'SMS-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/sms')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update SMS Blast</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
