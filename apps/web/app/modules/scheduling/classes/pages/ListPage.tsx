import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, Calendar, Users, Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

interface IClassItem {
  id?: string;
  _id?: string;
  title: string;
  category: 'HIIT' | 'YOGA' | 'SPINNING' | 'BOXING' | 'CROSSFIT' | 'PILATES';
  trainerName: string;
  roomName: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  enrolledCount: number;
  colorHex: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<IClassItem[]>([]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/scheduling/classes', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          setClasses(json.data.items);
          return;
        }
      }
    } catch {}

    setClasses([
      {
        title: 'CrossFit High Intensity Bootcamp',
        category: 'CROSSFIT',
        trainerName: 'Coach Alex Vance',
        roomName: 'Studio A (Main Turf)',
        startTime: '07:00 AM - 08:00 AM',
        durationMinutes: 60,
        capacity: 25,
        enrolledCount: 22,
        colorHex: '#8b5cf6',
      },
      {
        title: 'Vinyasa Power Yoga Flow',
        category: 'YOGA',
        trainerName: 'Coach Elena Rostova',
        roomName: 'Studio B (Zen Room)',
        startTime: '09:00 AM - 10:00 AM',
        durationMinutes: 60,
        capacity: 20,
        enrolledCount: 18,
        colorHex: '#10b981',
      },
      {
        title: 'Spinning Studio Sprint Intervals',
        category: 'SPINNING',
        trainerName: 'Coach Marcus Brody',
        roomName: 'Cycle Studio #1',
        startTime: '06:00 PM - 06:45 PM',
        durationMinutes: 45,
        capacity: 30,
        enrolledCount: 28,
        colorHex: '#f59e0b',
      },
    ]);
  };

  const columns: ColumnDef<IClassItem>[] = [
    {
      accessorKey: 'title',
      header: 'Class & Category',
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div>
            <p className="font-semibold text-foreground text-sm">{c.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px]">
                {c.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{c.roomName}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'trainerName',
      header: 'Instructor',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-foreground">{row.getValue('trainerName')}</span>
      ),
    },
    {
      accessorKey: 'startTime',
      header: 'Schedule',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-primary" /> {row.getValue('startTime')} ({row.original.durationMinutes}m)
        </span>
      ),
    },
    {
      accessorKey: 'enrolledCount',
      header: 'Capacity & Attendance',
      cell: ({ row }) => {
        const c = row.original;
        const pct = Math.round((c.enrolledCount / c.capacity) * 100);
        return (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span>{c.enrolledCount} / {c.capacity}</span>
              <span className={pct > 80 ? 'text-amber-500' : 'text-emerald-500'}>{pct}%</span>
            </div>
            <div className="w-28 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${pct > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Class Schedules & Timetable"
        subtitle="Manage group fitness classes, trainer assignments, and live room bookings."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export Timetable</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/scheduling/classes/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Class</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Scheduled Classes"
          value={`${classes.length}`}
          change="+3 this week"
          trend="up"
          timeframe="CrossFit & Yoga"
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          title="Average Booking Rate"
          value="88.4%"
          change="+4.2%"
          trend="up"
          timeframe="Studio occupancy"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Peak Popularity"
          value="CrossFit Bootcamp"
          change="92% capacity"
          trend="up"
          timeframe="Morning slot"
          icon={<Flame className="h-5 w-5" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={classes}
        searchPlaceholder="Search classes by title, instructor, room..."
      />
    </PageContainer>
  );
};

