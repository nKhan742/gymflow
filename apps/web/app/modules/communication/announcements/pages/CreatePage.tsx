import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Megaphone, Pin, Calendar, Building2, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAnnouncement } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('Annual Summer Hybrid Games & Strongman Showcase');
  const [headline, setHeadline] = useState('Registration open for all members! Cash prizes, vendor booths & DJ sets.');
  const [content, setContent] = useState('Join us this Saturday for our annual Strongman and Cross-Training exhibition. Events include log press, farmer walks, sled drags, and assault bike sprints. Sign up at the front desk or mobile app.');
  const [bannerImage, setBannerImage] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<IAnnouncement['category']>('EVENT');
  const [priority, setPriority] = useState<IAnnouncement['priority']>('PINNED_STICKY');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
  const [authorName, setAuthorName] = useState('Executive Management');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `ANN-${Math.floor(100 + Math.random() * 900)}`;

    const newAnnouncement: IAnnouncement = {
      id: newId,
      _id: newId,
      title,
      headline,
      content,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      category,
      priority,
      status: 'PUBLISHED',
      publishDate,
      expiryDate,
      authorName,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_announcements');
      const customList: IAnnouncement[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newAnnouncement);
      localStorage.setItem('gymflow_custom_announcements', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/communication/announcements', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnnouncement),
      }).catch(() => {});

      toast.success(`Announcement posted: "${title}"!`);
      navigate('/communication/announcements');
    } catch {
      toast.error('Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Publish Campus Announcement & Digital Notice"
        subtitle="Display headline notices on member app feeds, turnstile tablets, and digital display signage."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/announcements')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Announcements</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Banner & Core Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" />
                Marquee Hero Banner & Announcement Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Marquee Hero Cover Image</label>
                <ImageUpload
                  value={bannerImage}
                  onChange={(url) => setBannerImage(url)}
                  variant="banner"
                  helperText="Upload wide 16:9 or panoramic banner for digital signage & mobile feeds"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Notice Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Annual Summer Games 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Headline Subtitle <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Registration open for all members"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Detailed Notice Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Categorization & Scheduling */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Noticeboard Category, Priority & Campus Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Category</label>
                  <Select value={category} onValueChange={(val) => setCategory(val as IAnnouncement['category'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EVENT">🎉 Event & Competition</SelectItem>
                      <SelectItem value="NEW_EQUIPMENT">🏋️ New Equipment Arrival</SelectItem>
                      <SelectItem value="FACILITY_UPGRADE">✨ Facility & Zone Upgrade</SelectItem>
                      <SelectItem value="MAINTENANCE">⚙️ Scheduled Maintenance</SelectItem>
                      <SelectItem value="HOLIDAY_HOURS">🏖️ Holiday Hours & Closures</SelectItem>
                      <SelectItem value="COMMUNITY">🤝 Member Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Pin Priority</label>
                  <Select value={priority} onValueChange={(val) => setPriority(val as IAnnouncement['priority'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PINNED_STICKY">📌 Pinned Sticky (Top of Feed)</SelectItem>
                      <SelectItem value="NORMAL">📄 Normal Feed Placement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Publish Date</label>
                  <Input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Expiry Date</label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Author / Issuing Body</label>
                  <Input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Branch Scope
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
                Priority: <strong className="text-foreground">{priority === 'PINNED_STICKY' ? '📌 Pinned Sticky' : 'Normal'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/announcements')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Publish Notice</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
