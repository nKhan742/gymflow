import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Plus, Download, Calendar, Clock, Users, CheckCircle2, Eye, Edit, Trash2, Tag, MapPin, Grid, List, Activity, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ICalendarEvent } from '../types';
import { toast } from 'sonner';

export const DEFAULT_CALENDAR_EVENTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    loadEvents();
  }, [activeBranchId]);

  const loadEvents = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_calendar');
      const customList: ICalendarEvent[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/calendar', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: ICalendarEvent[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_CALENDAR_EVENTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setEvents(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_calendar');
      const customList: ICalendarEvent[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_CALENDAR_EVENTS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setEvents(combined);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: ICalendarEvent['status']) => {
    const nextStatus: ICalendarEvent['status'] =
      currentStatus === 'SCHEDULED'
        ? 'IN_PROGRESS'
        : currentStatus === 'IN_PROGRESS'
        ? 'COMPLETED'
        : 'SCHEDULED';

    const updated = events.map((e) => {
      if ((e.id || e._id) === id) {
        return { ...e, status: nextStatus };
      }
      return e;
    });
    setEvents(updated);

    const stored = localStorage.getItem('gymflow_custom_calendar');
    if (stored) {
      const customList: ICalendarEvent[] = JSON.parse(stored);
      const updatedCustom = customList.map((e) => {
        if ((e.id || e._id) === id) {
          return { ...e, status: nextStatus };
        }
        return e;
      });
      localStorage.setItem('gymflow_custom_calendar', JSON.stringify(updatedCustom));
    }

    toast.success(`Session status updated to ${nextStatus}!`);
  };

  const handleDelete = (id: string, title: string) => {
    const updated = events.filter((e) => (e.id || e._id) !== id);
    setEvents(updated);

    const stored = localStorage.getItem('gymflow_custom_calendar');
    if (stored) {
      const customList: ICalendarEvent[] = JSON.parse(stored);
      const filtered = customList.filter((e) => (e.id || e._id) !== id);
      localStorage.setItem('gymflow_custom_calendar', JSON.stringify(filtered));
    }

    toast.success(`Event "${title}" removed from schedule`);
  };

  // Telemetry Metrics
  const totalEvents = events.length;
  const ptCount = events.filter((e) => e.eventType === 'PT_SESSION').length;
  const totalCapacity = events.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const totalBooked = events.reduce((acc, curr) => acc + (curr.bookedCount || 0), 0);
  const occupancyPercent = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 88;

  const columns: ColumnDef<ICalendarEvent>[] = [
    {
      accessorKey: 'eventTitle',
      header: 'Session & Title',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[240px]">
            <button
              type="button"
              onClick={() => navigate(`/scheduling/calendar/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
            >
              {row.original.eventTitle}
            </button>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[9px] font-semibold">
                {row.original.eventType?.replace(/_/g, ' ')}
              </Badge>
              <span className="text-[10px] text-muted-foreground truncate">{row.original.durationMinutes} min</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'instructorName',
      header: 'Instructor / Host',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border shrink-0">
            <AvatarImage src={row.original.instructorAvatar} alt={row.original.instructorName} />
            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
              {row.original.instructorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.instructorName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Time Window',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs font-bold text-foreground">
            <Clock className="w-3 h-3 text-primary" />
            <span>{row.original.startTime} - {row.original.endTime}</span>
          </div>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {row.original.date}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'zoneName',
      header: 'Zone / Studio',
      cell: ({ row }) => (
        <div className="space-y-0.5 max-w-[180px]">
          <div className="flex items-center gap-1 text-xs font-medium text-foreground truncate">
            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
            <span className="truncate">{row.original.zoneName}</span>
          </div>
          <span className="text-[10px] text-muted-foreground block truncate">
            {row.original.branchName || 'Downtown Flagship'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'bookedCount',
      header: 'Spot Capacity',
      cell: ({ row }) => {
        const booked = row.original.bookedCount || 0;
        const cap = row.original.capacity || 1;
        const percent = Math.min(100, Math.round((booked / cap) * 100));
        return (
          <div className="space-y-1 min-w-[110px]">
            <div className="flex justify-between text-[11px] font-mono font-semibold">
              <span>{booked}/{cap} Spots</span>
              <span className={percent >= 90 ? 'text-rose-500 font-bold' : 'text-muted-foreground'}>{percent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${percent >= 90 ? 'bg-rose-500' : 'bg-primary'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === 'COMPLETED'
                ? 'success'
                : s === 'IN_PROGRESS'
                ? 'warning'
                : 'default'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ')}
          </Badge>
        );
      },
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
              size="sm"
              className="h-7 px-1.5 text-[10px] text-primary hover:bg-primary/10 border-primary/30 font-semibold"
              onClick={() => handleToggleStatus(id || '', row.original.status)}
              title="Progress Session Status"
            >
              <Activity className="h-3 w-3 mr-0.5" />
              <span>Status</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/scheduling/calendar/${id}`)}
              title="View 360° Session Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/scheduling/calendar/${id}/edit`)}
              title="Edit Event"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.eventTitle)}
              title="Delete Event"
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
        title="Master Facility Scheduling Calendar"
        subtitle="Manage unified multi-track timetables: group studio classes, 1-on-1 PT blocks, biometric assessments, and zone reservations."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/40 mr-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2.5 text-xs gap-1"
                onClick={() => setViewMode('table')}
              >
                <List className="h-3.5 w-3.5" />
                <span>Table</span>
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2.5 text-xs gap-1"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Weekly Grid</span>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Type,Instructor,Date,StartTime,EndTime,Zone,Capacity,Booked,Status\n' + events.map((e) => `"${e.eventTitle}","${e.eventType}","${e.instructorName}","${e.date}","${e.startTime}","${e.endTime}","${e.zoneName}","${e.capacity}","${e.bookedCount}","${e.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `facility-calendar-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Calendar timetable exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/scheduling/calendar/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Schedule Session</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="SCHEDULED SESSIONS"
          value={`${totalEvents} Classes`}
          change="+4 added today"
          trend="up"
          timeframe="Campus Timetable"
          icon={<Calendar className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ACTIVE PT SLOTS"
          value={`${ptCount} Blocks`}
          change="100% booked capacity"
          trend="up"
          timeframe="1-on-1 Coaching"
          icon={<Clock className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="STUDIO OCCUPANCY RATE"
          value={`${occupancyPercent}%`}
          change={`${totalBooked}/${totalCapacity} total spots filled`}
          trend="up"
          timeframe="Floor Capacity"
          icon={<Users className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="CANCELLATION RATE"
          value="1.8%"
          change="Industry benchmark < 5%"
          trend="up"
          timeframe="Attendance Reliability"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={events}
          searchPlaceholder="Search calendar by session title, instructor, zone, time, status..."
        />
      ) : (
        /* Visual Weekly Calendar Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {events.map((event) => {
            const id = event.id || event._id;
            return (
              <Card key={id} className="border border-border shadow-xs hover:border-primary transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[9px] font-bold font-mono">
                      {event.startTime} - {event.endTime}
                    </Badge>
                    <Badge
                      variant={
                        event.eventType === 'GROUP_CLASS'
                          ? 'default'
                          : event.eventType === 'PT_SESSION'
                          ? 'success'
                          : 'secondary'
                      }
                      className="text-[9px] font-bold"
                    >
                      {event.eventType?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-2 line-clamp-1">
                    {event.eventTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-border">
                      <AvatarImage src={event.instructorAvatar} alt={event.instructorName} />
                      <AvatarFallback className="text-[9px]">{event.instructorName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">{event.instructorName}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate">{event.zoneName}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {event.bookedCount}/{event.capacity} Booked
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-[10px]"
                      onClick={() => navigate(`/scheduling/calendar/${id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};
