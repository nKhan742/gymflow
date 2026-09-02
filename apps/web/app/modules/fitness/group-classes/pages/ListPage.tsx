import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Users,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Clock,
  Flame,
  Zap,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IGroupClass } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_GROUP_CLASSES: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [classes, setClasses] = useState<IGroupClass[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_group_classes');
      const customList: IGroupClass[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_GROUP_CLASSES.map((c) => c.id || c.classCode));
      const newItems = customList.filter((c) => !defaultIds.has(c.id || c.classCode));
      return [...newItems, ...DEFAULT_GROUP_CLASSES];
    } catch {
      return DEFAULT_GROUP_CLASSES;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, [activeBranchId]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_group_classes');
      const customList: IGroupClass[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/group-classes', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const serverList = (json.success && Array.isArray(json.data) && json.data.length > 0)
          ? json.data
          : (json.data?.items?.length > 0 ? json.data.items : []);

        if (serverList.length > 0) {
          const map = new Map<string, IGroupClass>();
          DEFAULT_GROUP_CLASSES.forEach((c) => map.set(c.id || c.classCode, c));
          serverList.forEach((c: IGroupClass) => map.set(c.id || c.classCode || (c._id as string), c));
          customList.forEach((c) => map.set(c.id || c.classCode, c));
          setClasses(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IGroupClass>();
      DEFAULT_GROUP_CLASSES.forEach((c) => map.set(c.id || c.classCode, c));
      customList.forEach((c) => map.set(c.id || c.classCode, c));
      setClasses(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_group_classes');
      const customList: IGroupClass[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IGroupClass>();
      DEFAULT_GROUP_CLASSES.forEach((c) => map.set(c.id || c.classCode, c));
      customList.forEach((c) => map.set(c.id || c.classCode, c));
      setClasses(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter((c) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return c.branchId === 'ALL' || c.branchId === activeBranchId;
  });

  const getIntensityBadge = (level: string) => {
    switch (level) {
      case 'LOW':
        return <Badge variant="secondary" className="text-[10px]">Low Impact</Badge>;
      case 'MEDIUM':
        return <Badge variant="info" className="text-[10px]">Moderate</Badge>;
      case 'HIGH':
        return <Badge variant="warning" className="text-[10px]">High Intensity</Badge>;
      case 'EXTREME':
        return <Badge variant="destructive" className="text-[10px]">Extreme Burn</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{level}</Badge>;
    }
  };

  const columns: ColumnDef<IGroupClass>[] = [
    {
      accessorKey: 'classCode',
      header: 'Class ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('classCode')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Studio Class Title',
      cell: ({ row }) => {
        const cls = row.original;
        return (
          <div className="space-y-0.5">
            <div
              onClick={() => navigate(`/fitness/group-classes/${cls.id || cls._id}`)}
              className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs"
            >
              {cls.name}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-rose-500" />
              <span>{cls.studioRoom}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'instructorName',
      header: 'Lead Instructor',
      cell: ({ row }) => {
        const cls = row.original;
        return (
          <div className="flex items-center gap-2">
            <img
              src={cls.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={cls.instructorName}
              className="w-7 h-7 rounded-full object-cover border border-border/80 shrink-0 bg-muted"
            />
            <span className="text-xs font-semibold text-foreground">{cls.instructorName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'scheduleTime',
      header: 'Weekly Schedule',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary" />
          {row.original.scheduleTime} ({row.original.durationMins}m)
        </div>
      ),
    },
    {
      accessorKey: 'currentBookedCount',
      header: 'Capacity & Bookings',
      cell: ({ row }) => {
        const cls = row.original;
        const percent = Math.round(((cls.currentBookedCount || 0) / (cls.maxCapacity || 1)) * 100);
        return (
          <div className="space-y-1 w-32">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-foreground">{cls.currentBookedCount}/{cls.maxCapacity} Spots</span>
              <span className="text-muted-foreground">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  percent >= 100 ? 'bg-rose-500' : percent > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'intensityLevel',
      header: 'Intensity',
      cell: ({ row }) => getIntensityBadge(row.original.intensityLevel),
    },
    {
      accessorKey: 'branchName',
      header: 'Branch Scope',
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1 text-[11px] font-medium border-border/80">
          <Building2 className="w-3 h-3 text-muted-foreground" />
          {row.getValue('branchName') || 'All Locations'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={status === 'active' ? 'success' : 'secondary'} className="capitalize text-[11px]">
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const clsId = row.original.id || row.original._id;
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/group-classes/${clsId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Studio Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/fitness/group-classes/${clsId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Class</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalClasses = filteredClasses.length;
  const totalCapacity = filteredClasses.reduce((acc, c) => acc + (c.maxCapacity || 0), 0);
  const totalBooked = filteredClasses.reduce((acc, c) => acc + (c.currentBookedCount || 0), 0);
  const fillRate = Math.round((totalBooked / (totalCapacity || 1)) * 100);

  return (
    <PageContainer>
      <PageHeader
        title="Group Classes & Studio Programming"
        subtitle="Schedule and orchestrate HIIT blitzes, spin theater classes, power yoga, and boxing bootcamps with live spot capacities."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={fetchClasses}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/fitness/group-classes/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Add Class</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Studio Classes"
          value={`${totalClasses} Master Formats`}
          change="Live Timetable"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'All Facilities'}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Weekly Capacity"
          value={`${totalCapacity} Spots`}
          change="High Demand"
          trend="up"
          timeframe="Across Studios"
          icon={<Building2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Studio Fill Rate"
          value={`${fillRate}% Booked`}
          change="92% Target Met"
          trend="up"
          timeframe="Live Attendance"
          icon={<Flame className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Calorie Burn"
          value="570 kcal"
          change="Per 50m Session"
          trend="neutral"
          timeframe="MyZone Verified"
          icon={<Zap className="h-5 w-5" />}
        />
      </div>

      {/* Clean DataTable */}
      <DataTable
        columns={columns}
        data={filteredClasses}
        searchKey="name"
        searchPlaceholder="Search classes, instructors, studio rooms..."
      />
    </PageContainer>
  );
};
