import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Bell, AlertTriangle, Users, Smartphone, Building2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { INotification } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [title, setTitle] = useState('New Equipment Alert: Nordic Incline Platforms Arrived');
  const [message, setMessage] = useState('New calibrated competition squat platforms have been installed on the main weightlifting floor. Book a demo session with Coach Alex.');
  const [bannerPhoto, setBannerPhoto] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<INotification['category']>('EQUIPMENT_ALERT');
  const [priority, setPriority] = useState<INotification['priority']>('MEDIUM');
  const [targetAudience, setTargetAudience] = useState<INotification['targetAudience']>('ALL_MEMBERS');
  const [channel, setChannel] = useState<INotification['channel']>('IN_APP_PUSH');
  const [scheduledFor, setScheduledFor] = useState(new Date().toISOString().slice(0, 16));
  const [authorName, setAuthorName] = useState('General Operations Desk');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `NOTIF-${Math.floor(100 + Math.random() * 900)}`;

    const newNotification: INotification = {
      id: newId,
      _id: newId,
      title,
      message,
      bannerPhoto: bannerPhoto || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80',
      category,
      priority,
      targetAudience,
      channel,
      deliveryStatus: 'SENT',
      readCount: 0,
      totalRecipients: targetAudience === 'ALL_MEMBERS' ? 1420 : targetAudience === 'VIP_MEMBERS' ? 380 : 85,
      scheduledFor,
      authorName,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_notifications');
      const customList: INotification[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newNotification);
      localStorage.setItem('gymflow_custom_notifications', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/communication/notifications', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotification),
      }).catch(() => {});

      toast.success(`Notification broadcast dispatched: "${title}"!`);
      navigate('/communication/notifications');
    } catch {
      toast.error('Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Broadcast In-App Push Notification"
        subtitle="Send real-time alerts, turnstile updates, payment reminders, and class cancellations to members."
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
                      placeholder="e.g. Turnstile Maintenance Notice"
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Audience</label>
                  <Select value={targetAudience} onValueChange={(val) => setTargetAudience(val as INotification['targetAudience'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_MEMBERS">👥 All Active Members (1,420)</SelectItem>
                      <SelectItem value="VIP_MEMBERS">⭐ VIP Black Card Holders (380)</SelectItem>
                      <SelectItem value="TRAINERS_STAFF">🏋️ Trainers & Floor Staff (48)</SelectItem>
                      <SelectItem value="OVERDUE_MEMBERS">⚠️ Overdue / Grace Period (35)</SelectItem>
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
                      <SelectItem value="IN_APP_PUSH">📱 In-App Push Notification</SelectItem>
                      <SelectItem value="MOBILE_POPUP">🔔 Instant Modal Popup</SelectItem>
                      <SelectItem value="SOUND_CHIME">🔊 Push with Sound Alert</SelectItem>
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
                Channel: <strong className="text-foreground">{channel.replace(/_/g, ' ')}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/notifications')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Send className="h-4 w-4" />
                  <span>Dispatch Notification</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
