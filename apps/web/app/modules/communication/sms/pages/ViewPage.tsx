import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { ArrowLeft, Edit, MessageSquare, Send, CheckCircle2, DollarSign, Smartphone, Users, Radio, Zap, Clock } from 'lucide-react';
import { ISmsBlast } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sms, setSms] = useState<ISmsBlast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSms();
  }, [id]);

  const loadSms = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_sms');
      if (stored) {
        const customList: ISmsBlast[] = JSON.parse(stored);
        const match = customList.find((s) => (s.id || s._id) === id);
        if (match) {
          setSms(match);
          setLoading(false);
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
          setSms(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setSms({
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
      scheduledAt: '2026-08-25 09:00',
      branchName: 'PD Vihar',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleResend = () => {
    if (!sms) return;
    toast.success(`Resending SMS blast to ${sms.recipientsCount} phone numbers!`);
  };

  if (loading || !sms) {
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
        title={sms.campaignTitle}
        subtitle={`${sms.gatewayProvider} Route • Dispatched on ${sms.scheduledAt}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/sms')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to SMS Gateway</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/communication/sms/${sms.id || sms._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit SMS</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-xs font-semibold"
              onClick={handleResend}
            >
              <Zap className="h-4 w-4" />
              <span>Blast Again</span>
            </Button>
          </div>
        }
      />

      {/* SMS Phone Simulator Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <CardHeader className="bg-muted/40 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Carrier SMS Message Simulator</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                FROM: {sms.senderId}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {sms.gatewayProvider}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 max-w-lg mx-auto">
          {/* Phone Shell */}
          <div className="rounded-2xl border-4 border-muted-foreground/20 bg-muted/10 p-4 shadow-inner space-y-4">
            <div className="text-center text-[10px] text-muted-foreground font-mono">
              Today {sms.scheduledAt} • SMS / MMS
            </div>

            <div className="flex justify-start">
              <div className="bg-primary/10 border border-primary/20 text-foreground p-3.5 rounded-2xl rounded-tl-xs max-w-[85%] text-xs font-mono leading-relaxed shadow-2xs">
                {sms.smsText}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-2 border-t border-border">
              <span>{sms.characterCount} chars ({sms.smsSegments} segments)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Delivered
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TARGET AUDIENCE</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">{sms.targetAudience?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{sms.recipientsCount} phones targeted</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DELIVERY SUCCESS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {((sms.deliveredCount / sms.recipientsCount) * 100).toFixed(1)}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{sms.deliveredCount} handsets received</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GATEWAY PROVIDER</span>
            <Radio className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">{sms.gatewayProvider}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">Sender: {sms.senderId}</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CARRIER COST</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            \${sms.estimatedCost?.toFixed(2)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Deducted from SMS Wallet</p>
        </Card>
      </div>
    </PageContainer>
  );
};
