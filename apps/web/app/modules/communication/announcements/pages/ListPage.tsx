import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Megaphone, Pin, Eye, Edit, Trash2, Calendar, Sparkles, Building2, CheckCircle2, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAnnouncement } from '../types';
import { toast } from 'sonner';

export const DEFAULT_ANNOUNCEMENTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);

  useEffect(() => {
    loadAnnouncements();
  }, [activeBranchId]);

  const loadAnnouncements = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_announcements');
      const customList: IAnnouncement[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/communication/announcements', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IAnnouncement[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_ANNOUNCEMENTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setAnnouncements(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_announcements');
      const customList: IAnnouncement[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_ANNOUNCEMENTS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setAnnouncements(combined);
    }
  };

  const handleTogglePin = (id: string, currentPriority: IAnnouncement['priority']) => {
    const nextPriority: IAnnouncement['priority'] = currentPriority === 'PINNED_STICKY' ? 'NORMAL' : 'PINNED_STICKY';
    const updated: IAnnouncement[] = announcements.map((a) => {
      if ((a.id || a._id) === id) {
        return { ...a, priority: nextPriority };
      }
      return a;
    });
    setAnnouncements(updated);

    const stored = localStorage.getItem('gymflow_custom_announcements');
    if (stored) {
      const customList: IAnnouncement[] = JSON.parse(stored);
      const updatedCustom = customList.map((a) => {
        if ((a.id || a._id) === id) {
          return { ...a, priority: nextPriority };
        }
        return a;
      });
      localStorage.setItem('gymflow_custom_announcements', JSON.stringify(updatedCustom));
    }

    toast.success(nextPriority === 'PINNED_STICKY' ? 'Notice pinned to top of display board!' : 'Notice unpinned');
  };

  const handleDelete = (id: string, title: string) => {
    const updated = announcements.filter((a) => (a.id || a._id) !== id);
    setAnnouncements(updated);

    const stored = localStorage.getItem('gymflow_custom_announcements');
    if (stored) {
      const customList: IAnnouncement[] = JSON.parse(stored);
      const filtered = customList.filter((a) => (a.id || a._id) !== id);
      localStorage.setItem('gymflow_custom_announcements', JSON.stringify(filtered));
    }

    toast.success(`Announcement "${title}" removed`);
  };

  // Telemetry Metrics
  const totalAnnouncements = announcements.length;
  const pinnedCount = announcements.filter((a) => a.priority === 'PINNED_STICKY').length;
  const totalImpressions = announcements.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  const columns: ColumnDef<IAnnouncement>[] = [
    {
      accessorKey: 'title',
      header: 'Announcement & Marquee',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-16 rounded-md overflow-hidden bg-muted border border-border shrink-0">
              <img
                src={row.original.bannerImage}
                alt={row.original.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5 max-w-[250px]">
              <button
                type="button"
                onClick={() => navigate(`/communication/announcements/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.title}
              </button>
              <p className="text-[10px] text-muted-foreground truncate">{row.original.headline}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category & Campus',
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-[9px] font-bold">
            {row.original.category?.replace(/_/g, ' ')}
          </Badge>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {row.original.branchName || 'PD Vihar'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Notice Pin Status',
      cell: ({ row }) => (
        <Badge
          variant={row.original.priority === 'PINNED_STICKY' ? 'warning' : 'secondary'}
          className="text-[9px] font-bold uppercase gap-1"
        >
          {row.original.priority === 'PINNED_STICKY' && <Pin className="h-2.5 w-2.5" />}
          <span>{row.original.priority === 'PINNED_STICKY' ? 'Pinned Sticky' : 'Normal'}</span>
        </Badge>
      ),
    },
    {
      accessorKey: 'publishDate',
      header: 'Display Duration',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Calendar className="w-3 h-3 text-primary" />
            <span>{row.original.publishDate}</span>
          </div>
          <span className="text-[10px] text-muted-foreground block font-mono">
            Expires: {row.original.expiryDate}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'viewsCount',
      header: 'App Impressions',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {row.original.viewsCount?.toLocaleString()}
          </span>
          <span className="text-[9px] text-muted-foreground block">Member Views</span>
        </div>
      ),
    },
    {
      accessorKey: 'authorName',
      header: 'Author',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.authorAvatar} alt={row.original.authorName} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.authorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
            {row.original.authorName}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className={`h-7 w-7 ${row.original.priority === 'PINNED_STICKY' ? 'text-amber-500 border-amber-500/30' : ''}`}
              onClick={() => handleTogglePin(id || '', row.original.priority)}
              title={row.original.priority === 'PINNED_STICKY' ? 'Unpin Notice' : 'Pin to Top of Noticeboard'}
            >
              <Pin className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/communication/announcements/${id}`)}
              title="View Announcement Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/communication/announcements/${id}/edit`)}
              title="Edit Announcement"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.title)}
              title="Delete Announcement"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Campus Noticeboard & Digital Display Announcements"
        subtitle="Manage marquee headlines, event exhibitions, facility maintenance bulletins, and digital signage displays."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Headline,Category,Priority,PublishDate,ExpiryDate,Impressions,Author\n' + announcements.map((a) => `"${a.title}","${a.headline}","${a.category}","${a.priority}","${a.publishDate}","${a.expiryDate}","${a.viewsCount}","${a.authorName}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `announcements-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Announcements exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/communication/announcements/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Post Announcement</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ACTIVE ANNOUNCEMENTS"
          value={`${totalAnnouncements} Published`}
          change="Campus-wide broadcast"
          trend="up"
          timeframe="Display Feeds"
          icon={<Megaphone className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="PINNED NOTICES"
          value={`${pinnedCount} Top Pinned`}
          change="Highlighted on mobile hero"
          trend="up"
          timeframe="Sticky Placement"
          icon={<Pin className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="TOTAL IMPRESSIONS"
          value={`${totalImpressions.toLocaleString()}`}
          change="+18.2% member reach"
          trend="up"
          timeframe="Member App Views"
          icon={<Tv className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="DIGITAL SIGNAGE"
          value="100% Synced"
          change="Turnstiles & Lounge displays"
          trend="up"
          timeframe="Digital Displays"
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={announcements}
        searchPlaceholder="Search announcements by title, headline, category, author..."
      />
    </PageContainer>
  );
};
