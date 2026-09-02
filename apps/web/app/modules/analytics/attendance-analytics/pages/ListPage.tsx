import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, DoorClosed, CheckCircle2, Eye, Edit, Trash2, Calendar, TrendingUp, Flame, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAttendanceAnalyticsModel } from '../types';
import { toast } from 'sonner';

export const DEFAULT_ATTENDANCE_MODELS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [analyses, setAnalyses] = useState<IAttendanceAnalyticsModel[]>([]);

  useEffect(() => {
    loadAnalyses();
  }, [activeBranchId]);

  const loadAnalyses = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_attendance_analytics');
      const customList: IAttendanceAnalyticsModel[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/analytics/attendance-analytics', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IAttendanceAnalyticsModel[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_ATTENDANCE_MODELS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setAnalyses(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_attendance_analytics');
      const customList: IAttendanceAnalyticsModel[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_ATTENDANCE_MODELS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setAnalyses(combined);
    }
  };

  const handleDelete = (id: string, title: string) => {
    const updated = analyses.filter((a) => (a.id || a._id) !== id);
    setAnalyses(updated);

    const stored = localStorage.getItem('gymflow_custom_attendance_analytics');
    if (stored) {
      const customList: IAttendanceAnalyticsModel[] = JSON.parse(stored);
      const filtered = customList.filter((a) => (a.id || a._id) !== id);
      localStorage.setItem('gymflow_custom_attendance_analytics', JSON.stringify(filtered));
    }

    toast.success(`Attendance analysis "${title}" removed`);
  };

  // Telemetry Metrics
  const totalScans = analyses.reduce((acc, curr) => acc + (curr.totalTurnstileThroughput || 0), 0);
  const maxHeadcount = analyses.length > 0 ? Math.max(...analyses.map((a) => a.peakFloorHeadcount || 0)) : 0;
  const avgDwell = analyses.length > 0 ? `${Math.round(analyses.reduce((acc, a) => acc + (a.avgWorkoutDurationMinutes || 0), 0) / analyses.length)} Mins` : '0 Mins';
  const studioUtil = analyses.length > 0 ? `${Math.round(analyses.reduce((acc, a) => acc + (a.studioClassCapacityUtilization || 0), 0) / analyses.length)}%` : '0%';

  const columns: ColumnDef<IAttendanceAnalyticsModel>[] = [
    {
      accessorKey: 'analysisTitle',
      header: 'Analysis Title & Peak Window',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => navigate(`/analytics/attendance-analytics/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
            >
              {row.original.analysisTitle}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Clock className="h-3 w-3 text-primary" />
              <span>{row.original.peakRushHourWindow}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'analysisPeriod',
      header: 'Cadence',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-bold">
          {row.original.analysisPeriod}
        </Badge>
      ),
    },
    {
      accessorKey: 'totalTurnstileThroughput',
      header: 'Turnstile Scans & NFC %',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.totalTurnstileThroughput?.toLocaleString()} Scans
          </span>
          <span className="text-[9px] text-emerald-600 font-mono font-bold">
            {row.original.biometricNfcScanSuccessRate}% Gate Pass Rate
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'peakFloorHeadcount',
      header: 'Peak Load & Dwell Time',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 block">
            {row.original.peakFloorHeadcount} Max Athletes
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            {row.original.avgWorkoutDurationMinutes} mins average dwell
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'studioClassCapacityUtilization',
      header: 'Studio Class Fill',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block">
            {row.original.studioClassCapacityUtilization}%
          </span>
          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${Math.min(100, row.original.studioClassCapacityUtilization)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'operationsAnalyst',
      header: 'Operations Analyst',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.analystAvatar} alt={row.original.operationsAnalyst} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.operationsAnalyst.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.operationsAnalyst}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Traffic Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'PEAK_SURGE' ? 'destructive' : 'success'} className="text-[9px] font-bold">
          {row.original.status === 'PEAK_SURGE' ? '🔥 SURGE' : 'NORMAL'}
        </Badge>
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
              className="h-7 w-7"
              onClick={() => navigate(`/analytics/attendance-analytics/${id}`)}
              title="View Footfall Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/analytics/attendance-analytics/${id}/edit`)}
              title="Edit Analysis"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.analysisTitle)}
              title="Delete Analysis"
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
        title="Attendance, Footfall & Turnstile Analytics"
        subtitle="Monitor optical turnstile access throughput, peak rush heatmaps, average member workout dwell, and studio occupancy."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Cadence,Date,Throughput,PeakWindow,PeakHeadcount,AvgDuration,StudioUtil,NFCPassRate,Analyst,Status\n' + analyses.map((a) => `"${a.analysisTitle}","${a.analysisPeriod}","${a.analysisDate}","${a.totalTurnstileThroughput}","${a.peakRushHourWindow}","${a.peakFloorHeadcount}","${a.avgWorkoutDurationMinutes}","${a.studioClassCapacityUtilization}","${a.biometricNfcScanSuccessRate}","${a.operationsAnalyst}","${a.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `attendance-analytics-traffic-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Attendance traffic analytics exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/analytics/attendance-analytics/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Publish Analysis</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL TURNSTILE SCANS"
          value={totalScans.toLocaleString()}
          change="Optical gate scan events"
          trend="up"
          timeframe="Total Access Logs"
          icon={<DoorClosed className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="PEAK CONCURRENT LOAD"
          value={`${maxHeadcount} Athletes`}
          change="17:30 - 19:30 Rush Hour"
          trend="up"
          timeframe="Capacity Spike"
          icon={<Flame className="h-5 w-5 text-rose-500" />}
        />
        <MetricCard
          title="AVG WORKOUT DWELL"
          value={avgDwell}
          change="Across weights & cardio"
          trend="up"
          timeframe="Floor Duration"
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="STUDIO CLASS UTILIZATION"
          value={studioUtil}
          change="+4.2% booked class spots"
          trend="up"
          timeframe="Studio Fill"
          icon={<Users className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={analyses}
        searchPlaceholder="Search attendance analytics by title, analyst, cadence..."
      />
    </PageContainer>
  );
};
