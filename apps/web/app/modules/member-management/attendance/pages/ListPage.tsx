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
  Clock,
  ScanFace,
  CreditCard,
  QrCode,
  UserCheck,
  Flame,
  ArrowRight,
  ShieldCheck,
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

const HOURLY_FOOTFALL = [
  { hour: '6 AM', count: 45 },
  { hour: '8 AM', count: 78 },
  { hour: '10 AM', count: 52 },
  { hour: '12 PM', count: 64 },
  { hour: '2 PM', count: 48 },
  { hour: '4 PM', count: 82 },
  { hour: '6 PM', count: 110 },
  { hour: '8 PM', count: 75 },
];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<IAttendanceItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'GRANTED' | 'DENIED'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Quick Check-In Terminal Form
  const [quickMemberCode, setQuickMemberCode] = useState('GF-9284');
  const [quickGate, setQuickGate] = useState('Gate A - Main Turnstile #1');
  const [quickMethod, setQuickMethod] = useState<'BIOMETRIC_FACE' | 'RFID_KEYCARD' | 'QR_MOBILE' | 'MANUAL_DESK'>('BIOMETRIC_FACE');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('http://localhost:5000/api/v1/member-management/attendance', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setLogs(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
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
    return {
      total: logs.length,
      grantedCount: granted.length,
      deniedCount: denied.length,
    };
  }, [logs]);

  const handleQuickCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMemberCode) {
      toast.error('Please enter or select a Member Code / Name');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const memberNames: Record<string, string> = {
        'GF-9284': 'Sarah Jenkins',
        'GF-3109': 'David Chen',
        'GF-4821': 'Marcus Rodriguez',
        'GF-7712': 'Emily Watson',
        'GF-5520': 'Liam O Connor',
        'GF-9014': 'Jessica Taylor',
      };

      const name = memberNames[quickMemberCode] || `Member #${quickMemberCode}`;

      const res = await fetch('http://localhost:5000/api/v1/member-management/attendance', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberCode: quickMemberCode,
          memberName: name,
          planTier: 'VIP_PLATINUM',
          gateLocation: quickGate,
          method: quickMethod,
          accessResult: 'GRANTED',
          turnstileCode: 'TRN-01',
          durationMinutes: 0,
        }),
      });

      if (res.ok) {
        toast.success(`Turnstile Unlocked: ${name}!`, {
          description: `Access Granted via ${quickMethod.replace('_', ' ')} at ${quickGate}`,
        });
        await loadAttendance();
      } else {
        toast.error('Check-in failed');
      }
    } catch {
      toast.error('Failed to connect to turnstile controller');
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
            {row.original.memberName.charAt(0)}
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
              <span>{m.replace(/_/g, ' ')}</span>
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
            <span>{res.replace(/_/g, ' ')}</span>
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
              onClick={() => toast.success('Exporting verified attendance report (CSV)...')}
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
          value="142 In Gym"
          change="48% Capacity (300 Max)"
          trend="up"
          timeframe="Real-time head count"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Today's Check-Ins"
          value="384 Total"
          change="+12% vs last Thursday"
          trend="up"
          timeframe="Total entries today"
          icon={<Sparkles className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="Peak Traffic Time"
          value="6:00 PM - 7:30 PM"
          change="Evening rush expected"
          trend="neutral"
          timeframe="Staff alert"
          icon={<Flame className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Gate Security Denials"
          value={`${stats.deniedCount} Denials`}
          change="Expired passes flagged"
          trend="down"
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
              <SelectBox
                label="Select Member (or Scan Tag)"
                value={quickMemberCode}
                onChange={setQuickMemberCode}
                options={[
                  { value: 'GF-9284', label: '👑 Sarah Jenkins (#GF-9284 • VIP)' },
                  { value: 'GF-3109', label: '🥈 David Chen (#GF-3109 • Silver)' },
                  { value: 'GF-4821', label: '⭐ Marcus Rodriguez (#GF-4821 • Gold)' },
                  { value: 'GF-7712', label: '👑 Emily Watson (#GF-7712 • VIP)' },
                  { value: 'GF-5520', label: '🎓 Liam O Connor (#GF-5520 • Student)' },
                  { value: 'GF-9014', label: '⭐ Jessica Taylor (#GF-9014 • Gold)' },
                ]}
              />

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
                <span>{submitting ? 'Verifying with Turnstile...' : '1-Tap Verify & Unlock Turnstile'}</span>
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
              Peak: 110 Check-ins (6 PM)
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOURLY_FOOTFALL}>
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
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
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Attendance Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        searchPlaceholder="Search check-ins by member name, ID, gate, method..."
      />
    </PageContainer>
  );
};
