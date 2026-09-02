import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Megaphone, Pin, Calendar, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAnnouncement } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [bannerImage, setBannerImage] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<IAnnouncement['category']>('EVENT');
  const [priority, setPriority] = useState<IAnnouncement['priority']>('PINNED_STICKY');
  const [status, setStatus] = useState<IAnnouncement['status']>('PUBLISHED');
  const [publishDate, setPublishDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  const loadAnnouncement = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_announcements');
      if (stored) {
        const customList: IAnnouncement[] = JSON.parse(stored);
        const match = customList.find((a) => (a.id || a._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/announcements/${id}`, {
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
      id: id || 'ANN-101',
      _id: id || 'ANN-101',
      title: 'Annual Summer Hybrid Games & Strongman Showcase',
      headline: 'Registration open for all members! Cash prizes, vendor booths & DJ sets.',
      content: 'Join us this Saturday for our annual Strongman and Cross-Training exhibition. Events include log press, farmer walks, sled drags, and assault bike sprints.',
      bannerImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      category: 'EVENT',
      priority: 'PINNED_STICKY',
      status: 'PUBLISHED',
      publishDate: '2026-08-25',
      expiryDate: '2026-09-10',
      authorName: 'Executive Management',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      branchName: 'Main Facility',
      viewsCount: 3840,
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (ann: IAnnouncement) => {
    setTitle(ann.title || '');
    setHeadline(ann.headline || '');
    setContent(ann.content || '');
    setBannerImage(ann.bannerImage);
    setCategory(ann.category || 'EVENT');
    setPriority(ann.priority || 'PINNED_STICKY');
    setStatus(ann.status || 'PUBLISHED');
    setPublishDate(ann.publishDate || '');
    setExpiryDate(ann.expiryDate || '');
    setAuthorName(ann.authorName || '');
    if (ann.branchId) setBranchId(ann.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedAnnouncement: Partial<IAnnouncement> = {
      title,
      headline,
      content,
      bannerImage,
      category,
      priority,
      status,
      publishDate,
      expiryDate,
      authorName,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_announcements');
      if (stored) {
        const customList: IAnnouncement[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedAnnouncement } as IAnnouncement;
          localStorage.setItem('gymflow_custom_announcements', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'ANN-101', ...updatedAnnouncement } as IAnnouncement);
          localStorage.setItem('gymflow_custom_announcements', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/announcements/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAnnouncement),
      }).catch(() => {});

      toast.success(`Announcement #${id} updated!`);
      navigate('/communication/announcements');
    } catch {
      toast.error('Failed to update announcement');
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
        title={`Edit Notice #${id || '101'}`}
        subtitle="Modify marquee headline, display dates, category, and digital banner artwork."
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
                Notice ID: <strong className="font-mono text-foreground">{id || 'ANN-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/announcements')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Notice</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
