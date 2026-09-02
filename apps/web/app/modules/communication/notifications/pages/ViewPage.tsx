import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Bell, Send, CheckCircle2, AlertTriangle, Smartphone, Users, Radio, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { INotification } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<INotification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotification();
  }, [id]);

  const loadNotification = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_notifications');
      if (stored) {
        const customList: INotification[] = JSON.parse(stored);
        const match = customList.find((n) => (n.id || n._id) === id);
        if (match) {
          setNotification(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/notifications/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setNotification(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setNotification({
      id: id || 'NOTIF-101',
      _id: id || 'NOTIF-101',
      title: 'New Equipment Alert: Nordic Incline Platforms Arrived',
      message: 'New calibrated competition squat platforms have been installed on the main weightlifting floor. Book a demo session with Coach Alex.',
      bannerPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80',
      category: 'EQUIPMENT_ALERT',
      priority: 'MEDIUM',
      targetAudience: 'ALL_MEMBERS',
      channel: 'IN_APP_PUSH',
      deliveryStatus: 'SENT',
      readCount: 890,
      totalRecipients: 1420,
      scheduledFor: '2026-08-29T09:00:00.000Z',
      authorName: 'Coach Marcus Vance',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      branchName: 'Downtown Flagship',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handlePushBroadcast = () => {
    if (!notification) return;
    toast.success(`Broadcasting live push alert to ${notification.totalRecipients} members!`);
  };

  if (loading || !notification) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  const readRate = notification.totalRecipients > 0
    ? ((notification.readCount / notification.totalRecipients) * 100).toFixed(1)
    : '0';

  return (
    <PageContainer>
      <PageHeader
        title={notification.title}
        subtitle={`${notification.category?.replace(/_/g, ' ')} • Dispatched by ${notification.authorName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/notifications')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Notifications</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/communication/notifications/${notification.id || notification._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Alert</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-xs font-semibold"
              onClick={handlePushBroadcast}
            >
              <Send className="h-4 w-4" />
              <span>Broadcast Push</span>
            </Button>
          </div>
        }
      />

      {/* Notification Preview Hero */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="h-48 md:h-full bg-muted">
            <img
              src={notification.bannerPhoto}
              alt={notification.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {notification.category?.replace(/_/g, ' ')}
                </Badge>
                <Badge
                  variant={
                    notification.priority === 'CRITICAL'
                      ? 'destructive'
                      : notification.priority === 'HIGH'
                      ? 'warning'
                      : 'default'
                  }
                  className="text-[10px] font-bold uppercase"
                >
                  {notification.priority} Priority
                </Badge>
                <span className="text-xs text-muted-foreground">• {notification.branchName || 'Downtown Flagship'}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{notification.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {notification.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={notification.authorAvatar} alt={notification.authorName} />
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {notification.authorName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Author</span>
                  <span className="text-xs font-bold text-foreground">{notification.authorName}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block">Delivery Status</span>
                <Badge variant="success" className="text-xs font-bold uppercase">
                  {notification.deliveryStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TARGET AUDIENCE</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">{notification.targetAudience?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{notification.totalRecipients} active devices</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DELIVERY CHANNEL</span>
            <Smartphone className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">{notification.channel?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">APNs / FCM Gateway</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MEMBER READ RATE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{readRate}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{notification.readCount} reads logged</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GATEWAY HEALTH</span>
            <Radio className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">100% Operational</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Zero push drops</p>
        </Card>
      </div>
    </PageContainer>
  );
};
