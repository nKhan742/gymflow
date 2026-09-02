import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, Users, CheckCircle2, Eye, Edit, Trash2, Calendar, Clock, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IAttendanceReport } from '../types';
import { toast } from 'sonner';

export const DEFAULT_ATTENDANCE_REPORTS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [reports, setReports] = useState<IAttendanceReport[]>([]);

  useEffect(() => {
    loadReports();
  }, [activeBranchId]);

  const loadReports = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_attendance_reports');
      const customList: IAttendanceReport[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/reports/attendance-reports', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IAttendanceReport[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_ATTENDANCE_REPORTS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_attendance_reports');
      const customList: IAttendanceReport[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_ATTENDANCE_REPORTS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setReports(combined);
    }
  };

  const handleDelete = (id: string, title: string) => {
    const updated = reports.filter((r) => (r.id || r._id) !== id);
    setReports(updated);

    const stored = localStorage.getItem('gymflow_custom_attendance_reports');
    if (stored) {
      const customList: IAttendanceReport[] = JSON.parse(stored);
      const filtered = customList.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem('gymflow_custom_attendance_reports', JSON.stringify(filtered));
    }

    toast.success(`Attendance report "${title}" removed`);
  };

  // Telemetry Metrics
  const totalScans = reports.reduce((acc, curr) => acc + (curr.totalCheckIns || 0), 0);
  const totalStudio = reports.reduce((acc, curr) => acc + (curr.groupClassAttendance || 0), 0);

  const columns: ColumnDef<IAttendanceReport>[] = [
    {
      accessorKey: 'reportTitle',
      header: 'Report Title & Period Scope',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="space-y-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => navigate(`/reports/attendance-reports/${id}`)}
              className="font-bold text-xs text-foreground block truncate hover:underline hover:text-emerald-500 text-left cursor-pointer"
            >
              {row.original.reportTitle}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Calendar className="h-3 w-3 text-primary" />
              <span>{row.original.startDate} &rarr; {row.original.endDate}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reportingPeriod',
      header: 'Cadence',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[9px] font-bold">
          {row.original.reportingPeriod}
        </Badge>
      ),
    },
    {
      accessorKey: 'totalCheckIns',
      header: 'Check-Ins & Unique',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground block">
            {row.original.totalCheckIns?.toLocaleString()} Scans
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            {row.original.uniqueMembers?.toLocaleString()} Unique Members
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'peakHour',
      header: 'Peak Rush Window',
      cell: ({ row }) => (
        <div className="space-y-0.5 max-w-[180px]">
          <span className="text-xs font-semibold text-foreground block truncate">
            {row.original.peakHour}
          </span>
          <span className="text-[9px] text-emerald-600 font-bold font-mono">
            🔥 {row.original.peakHeadcount} Concurrent Athletes
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'turnstileScanPassRate',
      header: 'Turnstile Pass %',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            {row.original.turnstileScanPassRate}%
          </span>
          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, row.original.turnstileScanPassRate)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'auditedBy',
      header: 'Operations Lead',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border shrink-0">
            <AvatarImage src={row.original.auditorAvatar} alt={row.original.auditedBy} />
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {row.original.auditedBy.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
            {row.original.auditedBy}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'VERIFIED' ? 'success' : 'secondary'} className="text-[9px] font-bold">
          {row.original.status}
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
              onClick={() => navigate(`/reports/attendance-reports/${id}`)}
              title="View Attendance Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/reports/attendance-reports/${id}/edit`)}
              title="Edit Report"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.reportTitle)}
              title="Delete Report"
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
        title="Turnstile Attendance & Footfall Analytics"
        subtitle="Analyze biometric RFID check-in throughput, peak gym rush windows, and studio class spot occupancies."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Title,Period,Start,End,CheckIns,UniqueMembers,PeakHour,Auditor,Status\n' + reports.map((r) => `"${r.reportTitle}","${r.reportingPeriod}","${r.startDate}","${r.endDate}","${r.totalCheckIns}","${r.uniqueMembers}","${r.peakHour}","${r.auditedBy}","${r.status}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `attendance-reports-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Attendance reports exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/reports/attendance-reports/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Generate Report</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL TURNSTILE SCANS"
          value={`${totalScans.toLocaleString()} Entries`}
          change="Across all turnstile gates"
          trend="up"
          timeframe="Campus Footfall"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="SCAN PASS RATE %"
          value="99.6%"
          change="Sub-second optical NFC/RFID"
          trend="up"
          timeframe="Biometric Gates"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="STUDIO CLASS SPOT FILL"
          value={`${totalStudio.toLocaleString()} Spots`}
          change="88.4% capacity utilization"
          trend="up"
          timeframe="Group Fitness"
          icon={<Activity className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="AVG WORKOUT TIME"
          value="66.2 Mins"
          change="Optimal floor rotation"
          trend="up"
          timeframe="Member Dwell"
          icon={<Clock className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={reports}
        searchPlaceholder="Search attendance reports by title, operations lead, cadence..."
      />
    </PageContainer>
  );
};
