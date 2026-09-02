import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Megaphone, Pin, Calendar, Building2, Eye, Sparkles, CheckCircle2, Tv } from 'lucide-react';
import { IAnnouncement } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<IAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  const loadAnnouncement = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_announcements');
      if (stored) {
        const customList: IAnnouncement[] = JSON.parse(stored);
        const match = customList.find((a) => (a.id || a._id) === id);
        if (match) {
          setAnnouncement(match);
          setLoading(false);
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
          setAnnouncement(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setAnnouncement({
      id: id || 'ANN-101',
      _id: id || 'ANN-101',
      title: 'Annual Summer Hybrid Games & Strongman Showcase',
      headline: 'Registration open for all members! Cash prizes, vendor booths & DJ sets.',
      content: 'Join us this Saturday for our annual Strongman and Cross-Training exhibition. Events include log press, farmer walks, sled drags, and assault bike sprints. Sign up at the front desk or mobile app.',
      bannerImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      category: 'EVENT',
      priority: 'PINNED_STICKY',
      status: 'PUBLISHED',
      publishDate: '2026-08-25',
      expiryDate: '2026-09-10',
      authorName: 'Executive Management',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      branchName: 'PD Vihar',
      viewsCount: 3840,
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handleTogglePin = () => {
    if (!announcement) return;
    const nextPriority: IAnnouncement['priority'] = announcement.priority === 'PINNED_STICKY' ? 'NORMAL' : 'PINNED_STICKY';
    const updated = { ...announcement, priority: nextPriority };
    setAnnouncement(updated);

    const stored = localStorage.getItem('gymflow_custom_announcements');
    if (stored) {
      const customList: IAnnouncement[] = JSON.parse(stored);
      const listUpdated = customList.map((a) => ((a.id || a._id) === (announcement.id || announcement._id) ? updated : a));
      localStorage.setItem('gymflow_custom_announcements', JSON.stringify(listUpdated));
    }

    toast.success(nextPriority === 'PINNED_STICKY' ? 'Notice pinned to top of display board!' : 'Notice unpinned');
  };

  if (loading || !announcement) {
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
        title={announcement.title}
        subtitle={`${announcement.category?.replace(/_/g, ' ')} • Published on ${announcement.publishDate}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/announcements')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Announcements</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/communication/announcements/${announcement.id || announcement._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Notice</span>
            </Button>
            <Button
              size="sm"
              variant={announcement.priority === 'PINNED_STICKY' ? 'outline' : 'default'}
              className="gap-1.5 shadow-xs font-semibold"
              onClick={handleTogglePin}
            >
              <Pin className="h-4 w-4" />
              <span>{announcement.priority === 'PINNED_STICKY' ? 'Unpin Notice' : 'Pin to Top'}</span>
            </Button>
          </div>
        }
      />

      {/* Marquee Cover Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-2xs">
        <div className="relative h-64 w-full bg-muted">
          <img
            src={announcement.bannerImage}
            alt={announcement.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[10px] font-bold bg-background/80 backdrop-blur-sm text-foreground">
                {announcement.category?.replace(/_/g, ' ')}
              </Badge>
              {announcement.priority === 'PINNED_STICKY' && (
                <Badge variant="warning" className="text-[10px] font-bold uppercase gap-1">
                  <Pin className="h-3 w-3" /> Pinned Sticky
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{announcement.title}</h1>
            <p className="text-sm font-medium text-white/90 mt-1">{announcement.headline}</p>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Notice Details</h3>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {announcement.content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={announcement.authorAvatar} alt={announcement.authorName} />
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                  {announcement.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="text-[11px] text-muted-foreground block">Issued By</span>
                <span className="text-xs font-bold text-foreground">{announcement.authorName}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-muted-foreground block">Display Range</span>
              <span className="text-xs font-mono font-bold text-foreground">
                {announcement.publishDate} &rarr; {announcement.expiryDate}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CAMPUS SCOPE</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground mt-1 truncate">{announcement.branchName || 'PD Vihar'}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Target Location</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PIN PLACEMENT</span>
            <Pin className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-base font-bold text-foreground mt-1">
            {announcement.priority === 'PINNED_STICKY' ? 'Pinned Sticky' : 'Normal Feed'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Noticeboard Hierarchy</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MEMBER VIEWS</span>
            <Tv className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{announcement.viewsCount?.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">App & Display Impressions</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">NOTICE STATUS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">{announcement.status}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Live Broadcast Active</p>
        </Card>
      </div>
    </PageContainer>
  );
};
