import React, { useEffect, useState, useMemo } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox } from '../../../../shared/components/ui/select';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ScanFace,
  CreditCard,
  QrCode,
  UserCheck,
  Flame,
  ShieldAlert,
  Building2,
  FileDown,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IAttendanceItem {
  id: string;
  _id?: string;
  code: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  checkInTime: string;
  checkOutTime?: string;
  durationMinutes: number;
  method: 'BIOMETRIC_FACE' | 'RFID_KEYCARD' | 'QR_MOBILE' | 'MANUAL_DESK';
  gateLocation: string;
  accessResult: 'GRANTED' | 'DENIED_EXPIRED' | 'DENIED_FROZEN' | 'DENIED_OFF_PEAK';
  turnstileCode: string;
  status: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<IAttendanceItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'GRANTED' | 'DENIED'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Available registered members for quick check-in
  const [availableMembers, setAvailableMembers] = useState<Array<{ value: string; label: string }>>([]);

  // Quick Check-In Terminal Form
  const [quickMemberCode, setQuickMemberCode] = useState('');
  const [quickGate, setQuickGate] = useState('Gate A - Main Turnstile #1');
  const [quickMethod, setQuickMethod] = useState<'BIOMETRIC_FACE' | 'RFID_KEYCARD' | 'QR_MOBILE' | 'MANUAL_DESK'>('BIOMETRIC_FACE');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAttendance();
    loadRegisteredMembers();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const localLogsRaw = localStorage.getItem('gymflow_custom_attendance_logs');
      const localLogs: IAttendanceItem[] = localLogsRaw ? JSON.parse(localLogsRaw) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/attendance', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const serverItems = Array.isArray(json.data) ? json.data : json.data?.items || [];
        setLogs([...localLogs, ...serverItems]);
      } else {
        setLogs(localLogs);
      }
    } catch {
      const localLogsRaw = localStorage.getItem('gymflow_custom_attendance_logs');
      setLogs(localLogsRaw ? JSON.parse(localLogsRaw) : []);
    } finally {
      setLoading(false);
    }
  };

  const loadRegisteredMembers = async () => {
    try {
      const localRaw = localStorage.getItem('gymflow_custom_members');
      const localMembers = localRaw ? JSON.parse(localRaw) : [];
      let members = localMembers;

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/members/members', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const serverItems = Array.isArray(json.data) ? json.data : json.data?.items || [];
        members = [...localMembers, ...serverItems];
      }

      if (members.length > 0) {
        setAvailableMembers(
          members.map((m: any) => ({
            value: m.code || m.memberCode || m.id || m._id,
            label: `${m.name || m.fullName || m.memberName} (#${m.code || m.memberCode || 'MEMBER'} • ${m.planTier || m.tier || 'ACTIVE'})`,
          }))
        );
        setQuickMemberCode(members[0].code || members[0].memberCode || members[0].id || '');
      } else {
        setAvailableMembers([]);
      }
    } catch {
      setAvailableMembers([]);
    }
  };

  // Filtered by Granted / Denied
  const filteredLogs = useMemo(() => {
    if (activeTab === 'ALL') return logs;
    if (activeTab === 'GRANTED') return logs.filter((l) => l.accessResult === 'GRANTED');
    return logs.filter((l) => l.accessResult !== 'GRANTED');
  }, [logs, activeTab]);

  // Dynamic Metrics
  const stats = useMemo(() => {
    const granted = logs.filter((l) => l.accessResult === 'GRANTED');
    const denied = logs.filter((l) => l.accessResult !== 'GRANTED');
    const liveOccupancy = logs.filter((l) => !l.checkOutTime && l.accessResult === 'GRANTED').length;
    return {
      total: logs.length,
      grantedCount: granted.length,
      deniedCount: denied.length,
      liveOccupancy,
    };
  }, [logs]);

  // Compute dynamic hourly footfall
  const hourlyData = useMemo(() => {
    const hours = ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
    const counts: Record<string, number> = {};
    hours.forEach((h) => (counts[h] = 0));

    logs.forEach((log) => {
      if (log.checkInTime) {
        const hour = new Date(log.checkInTime).getHours();
        if (hour >= 5 && hour < 7) counts['6 AM']++;
        else if (hour >= 7 && hour < 9) counts['8 AM']++;
        else if (hour >= 9 && hour < 11) counts['10 AM']++;
        else if (hour >= 11 && hour < 13) counts['12 PM']++;
        else if (hour >= 13 && hour < 15) counts['2 PM']++;
        else if (hour >= 15 && hour < 17) counts['4 PM']++;
        else if (hour >= 17 && hour < 19) counts['6 PM']++;
        else if (hour >= 19 && hour <= 23) counts['8 PM']++;
      }
    });

    return hours.map((hour) => ({ hour, count: counts[hour] }));
  }, [logs]);

  const handleQuickCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMemberCode) {
      toast.error('Please select or enter a Member Code');
      return;
    }

    setSubmitting(true);
    try {
      const selectedOption = availableMembers.find((m) => m.value === quickMemberCode);
      const name = selectedOption ? selectedOption.label.split(' (')[0] : `Member #${quickMemberCode}`;

      const newLog: IAttendanceItem = {
        id: `att_${Date.now()}`,
        code: `ATT-${Date.now().toString().slice(-4)}`,
        memberCode: quickMemberCode,
        memberName: name,
        planTier: 'STANDARD',
        checkInTime: new Date().toISOString(),
        durationMinutes: 0,
        method: quickMethod,
        gateLocation: quickGate,
        accessResult: 'GRANTED',
        turnstileCode: 'TRN-01',
        status: 'active',
      };

      const updated = [newLog, ...logs];
      setLogs(updated);
      localStorage.setItem('gymflow_custom_attendance_logs', JSON.stringify(updated));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/member-management/attendance', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLog),
      }).catch(() => {});

      toast.success(`Turnstile Unlocked: ${name}!`, {
        description: `Access Granted via ${quickMethod.replace('_', ' ')} at ${quickGate}`,
      });
    } catch {
      toast.error('Check-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<IAttendanceItem>[] = [
    {
      accessorKey: 'memberName',
      header: 'Member',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs shrink-0">
            {row.original.memberName ? row.original.memberName.charAt(0) : 'M'}
          </div>
          <div className="truncate">
            <span
              onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
              className="font-semibold text-xs text-foreground block truncate hover:underline hover:text-primary cursor-pointer"
            >
              {row.original.memberName}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              #{row.original.memberCode} • {row.original.planTier?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'checkInTime',
      header: 'Check-In Timestamp',
      cell: ({ row }) => {
        const d = new Date(row.original.checkInTime);
        return (
          <div>
            <span className="font-semibold text-xs text-foreground block">
              {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {d.toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'method',
      header: 'Access Method & Gate',
      cell: ({ row }) => {
        const m = row.original.method;
        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              {m === 'BIOMETRIC_FACE' && <ScanFace className="h-3.5 w-3.5 text-primary shrink-0" />}
              {m === 'RFID_KEYCARD' && <CreditCard className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
              {m === 'QR_MOBILE' && <QrCode className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
              {m === 'MANUAL_DESK' && <UserCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
              <span>{m?.replace(/_/g, ' ') || 'METHOD'}</span>
            </div>
            <span className="text-[10px] text-muted-foreground block truncate">
              {row.original.gateLocation}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'accessResult',
      header: 'Turnstile Result',
      cell: ({ row }) => {
        const res = row.original.accessResult;
        if (res === 'GRANTED') {
          return (
            <Badge variant="success" className="gap-1 text-[10px] font-semibold">
              <CheckCircle2 className="h-3 w-3" />
              <span>Access Granted</span>
            </Badge>
          );
        }
        return (
          <Badge variant="destructive" className="gap-1 text-[10px] font-semibold">
            <AlertTriangle className="h-3 w-3" />
            <span>{res?.replace(/_/g, ' ') || 'DENIED'}</span>
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/member-management/members/${row.original.memberCode}`)}
            className="h-7 px-2.5 text-xs font-semibold gap-1"
          >
            Profile
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Turnstile Access & Attendance Telemetry"
        subtitle="Live facial biometric turnstile scans, RFID wristband tap logs, live gym occupancy, and member workout streaks."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shadow-xs"
              onClick={() => toast.success('Exporting attendance report (CSV)...')}
            >
              <FileDown className="h-4 w-4" />
              <span>Export Logs</span>
            </Button>
          </div>
        }
      />

      {/* Live Facility KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Live Occupancy"
          value={`${stats.liveOccupancy} In Gym`}
          change={stats.liveOccupancy === 0 ? 'Quiet Facility' : 'Active Athletes'}
          trend="neutral"
          timeframe="Real-time head count"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Today's Check-Ins"
          value={`${stats.total} Total`}
          change={stats.total === 0 ? '0 Biometric Scans' : `${stats.grantedCount} Verified`}
          trend="up"
          timeframe="Total entries today"
          icon={<Sparkles className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Peak Traffic Time"
          value={stats.total > 0 ? '06:00 PM – 07:30 PM' : '-- : --'}
          change="Facility Flow"
          trend="neutral"
          timeframe="Staff alert"
          icon={<Flame className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Gate Security Denials"
          value={`${stats.deniedCount} Denials`}
          change={stats.deniedCount === 0 ? '0 Security Exceptions' : `${stats.deniedCount} Flagged`}
          trend={stats.deniedCount === 0 ? 'neutral' : 'down'}
          timeframe="Past 24 hours"
          icon={<ShieldAlert className="h-5 w-5 text-rose-500" />}
        />
      </div>

      {/* 2-Column Split: Quick Front Desk Terminal + Hourly Traffic Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Quick Front Desk Check-In Terminal */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ScanFace className="h-4 w-4 text-primary" />
              <span>Front Desk Quick Check-In Terminal</span>
            </CardTitle>
            <CardDescription>Instant manual or RFID verification for members</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleQuickCheckIn} className="space-y-3.5">
              {availableMembers.length > 0 ? (
                <SelectBox
                  label="Select Registered Member"
                  value={quickMemberCode}
                  onChange={setQuickMemberCode}
                  options={availableMembers}
                />
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Member Code / RFID Tag</label>
                  <Input
                    placeholder="Enter Member Code (e.g. GF-1001)..."
                    value={quickMemberCode}
                    onChange={(e) => setQuickMemberCode(e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectBox
                  label="Turnstile Gate"
                  value={quickGate}
                  onChange={setQuickGate}
                  options={[
                    { value: 'Gate A - Main Turnstile #1', label: 'Gate A (Turnstile #1)' },
                    { value: 'Gate B - Main Turnstile #2', label: 'Gate B (Turnstile #2)' },
                    { value: 'Gate C - Executive Locker Zone', label: 'Gate C (Locker Room)' },
                    { value: 'Gate D - Sauna & Spa Zone', label: 'Gate D (Spa & Sauna)' },
                  ]}
                />

                <SelectBox
                  label="Verification Method"
                  value={quickMethod}
                  onChange={(val) => setQuickMethod(val as any)}
                  options={[
                    { value: 'BIOMETRIC_FACE', label: '👤 Face Biometric' },
                    { value: 'RFID_KEYCARD', label: '💳 RFID Keycard / Band' },
                    { value: 'QR_MOBILE', label: '📱 Mobile QR Barcode' },
                    { value: 'MANUAL_DESK', label: '🖥️ Front Desk Override' },
                  ]}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full gap-2 shadow-md shadow-primary/25 font-bold mt-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? 'Verifying...' : '1-Tap Verify & Unlock Turnstile'}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right: Hourly Footfall Density Chart (2 Cols) */}
        <Card className="lg:col-span-2 border border-border/80 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Today's Hourly Footfall Density</span>
              </CardTitle>
              <CardDescription>Club occupancy distribution by hour</CardDescription>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono">
              Total Today: {stats.total} Check-ins
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'All Turnstile Scans', count: stats.total },
          { key: 'GRANTED', label: '🟢 Access Granted', count: stats.grantedCount },
          { key: 'DENIED', label: '🔴 Access Denials & Alerts', count: stats.deniedCount },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === t.key
                  ? 'bg-white/20 text-white'
                  : 'bg-background text-muted-foreground'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        loading={loading}
        searchPlaceholder="Search member name, code, gate location..."
      />
    </PageContainer>
  );
};
