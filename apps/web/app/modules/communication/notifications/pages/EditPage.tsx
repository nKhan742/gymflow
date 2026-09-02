import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Bell, AlertTriangle, Users, Smartphone, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { INotification } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [bannerPhoto, setBannerPhoto] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<INotification['category']>('EQUIPMENT_ALERT');
  const [priority, setPriority] = useState<INotification['priority']>('MEDIUM');
  const [targetAudience, setTargetAudience] = useState<INotification['targetAudience']>('ALL_MEMBERS');
  const [channel, setChannel] = useState<INotification['channel']>('IN_APP_PUSH');
  const [deliveryStatus, setDeliveryStatus] = useState<INotification['deliveryStatus']>('SENT');
  const [authorName, setAuthorName] = useState('');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadNotification();
  }, [id]);

  const loadNotification = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_notifications');
      if (stored) {
        const customList: INotification[] = JSON.parse(stored);
        const match = customList.find((n) => (n.id || n._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
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
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
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
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (notif: INotification) => {
    setTitle(notif.title || '');
    setMessage(notif.message || '');
    setBannerPhoto(notif.bannerPhoto);
    setCategory(notif.category || 'EQUIPMENT_ALERT');
    setPriority(notif.priority || 'MEDIUM');
    setTargetAudience(notif.targetAudience || 'ALL_MEMBERS');
    setChannel(notif.channel || 'IN_APP_PUSH');
    setDeliveryStatus(notif.deliveryStatus || 'SENT');
    setAuthorName(notif.authorName || 'Operations Desk');
    if (notif.branchId) setBranchId(notif.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedNotif: Partial<INotification> = {
      title,
      message,
      bannerPhoto,
      category,
      priority,
      targetAudience,
      channel,
      deliveryStatus,
      authorName,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_notifications');
      if (stored) {
        const customList: INotification[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedNotif } as INotification;
          localStorage.setItem('gymflow_custom_notifications', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'NOTIF-101', ...updatedNotif } as INotification);
          localStorage.setItem('gymflow_custom_notifications', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/notifications/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNotif),
      }).catch(() => {});

      toast.success(`Notification #${id} updated!`);
      navigate('/communication/notifications');
    } catch {
      toast.error('Failed to update notification');
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
        title={`Edit Alert #${id || '101'}`}
        subtitle="Modify notification payload, priority, distribution channels, and target audience."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/notifications')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Notifications</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Content & Visual Banner */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Notification Payload & Visual Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Notification Icon / Banner</label>
                  <ImageUpload
                    value={bannerPhoto}
                    onChange={(url) => setBannerPhoto(url)}
                    variant="card"
                    helperText="Upload notification visual graphic"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Notification Title <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Category</label>
                      <Select value={category} onValueChange={(val) => setCategory(val as INotification['category'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EQUIPMENT_ALERT">⚙️ Equipment & Floor Alert</SelectItem>
                          <SelectItem value="BILLING">💳 Billing & Invoicing</SelectItem>
                          <SelectItem value="CLASS_REMINDER">⏰ Class & PT Reminder</SelectItem>
                          <SelectItem value="SECURITY_TURNSTILE">🚪 Security & Turnstile</SelectItem>
                          <SelectItem value="PROMOTION">🎁 Special Promotion</SelectItem>
                          <SelectItem value="SYSTEM">⚡ System Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Priority Level</label>
                      <Select value={priority} onValueChange={(val) => setPriority(val as INotification['priority'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CRITICAL">🔴 Critical (Immediate Chime)</SelectItem>
                          <SelectItem value="HIGH">🟠 High Priority</SelectItem>
                          <SelectItem value="MEDIUM">🟡 Medium Priority</SelectItem>
                          <SelectItem value="LOW">⚪ Low (Silent)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Author / Dispatched By</label>
                    <Input
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Message Body Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Distribution Audience & Delivery Channel */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Target Audience & Delivery Routing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Audience</label>
                  <Select value={targetAudience} onValueChange={(val) => setTargetAudience(val as INotification['targetAudience'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_MEMBERS">👥 All Active Members</SelectItem>
                      <SelectItem value="VIP_MEMBERS">⭐ VIP Black Card Holders</SelectItem>
                      <SelectItem value="TRAINERS_STAFF">🏋️ Trainers & Floor Staff</SelectItem>
                      <SelectItem value="OVERDUE_MEMBERS">⚠️ Overdue / Grace Period</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Delivery Channel</label>
                  <Select value={channel} onValueChange={(val) => setChannel(val as INotification['channel'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_APP_PUSH">📱 In-App Push</SelectItem>
                      <SelectItem value="MOBILE_POPUP">🔔 Modal Popup</SelectItem>
                      <SelectItem value="SOUND_CHIME">🔊 Sound Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <Select value={deliveryStatus} onValueChange={(val) => setDeliveryStatus(val as INotification['deliveryStatus'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SENT">🟢 Sent & Delivered</SelectItem>
                      <SelectItem value="SCHEDULED">📅 Scheduled</SelectItem>
                      <SelectItem value="DRAFT">⚪ Draft</SelectItem>
                      <SelectItem value="FAILED">🔴 Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Branch Scope
                  </label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Branch" />
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
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Alert ID: <strong className="font-mono text-foreground">{id || 'NOTIF-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/notifications')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Notification</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
