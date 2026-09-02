import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Button } from '../../../../shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../../shared/components/ui/card';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  Users,
  DollarSign,
  Activity,
  Flame,
  Download,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { dashboardApi, IDashboardStats } from '../api/dashboardApi';
import { useCurrencyStore } from '../../../../core/store/currencyStore';
import { formatCurrency } from '../../../../core/helpers/formatters';
import { toast } from 'sonner';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currency } = useCurrencyStore();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setRefreshing(true);
    const [s, r, a] = await Promise.all([
      dashboardApi.getExecutiveStats(),
      dashboardApi.getRevenueAnalytics(),
      dashboardApi.getHourlyAttendance(),
    ]);
    setStats(s);
    setRevenueData(r);
    setAttendanceData(a);
    setRefreshing(false);
  };

  const handleRefresh = async () => {
    await loadDashboard();
    toast.success('Dashboard metrics synchronized with MongoDB!');
  };

  const recentList = stats?.recentMembers || [];

  return (
    <PageContainer>
      <PageHeader
        title="Executive Overview"
        subtitle="Live multi-tenant telemetry, MRR projections, and physical facility occupancy."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleRefresh}
              loading={refreshing}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Sync DB</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/member-management/members/create')}
            >
              <Plus className="h-4 w-4" />
              <span>New Member</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Active Members"
          value={stats?.activeMembers ?? 0}
          icon={<Users className="h-5 w-5 text-primary" />}
          timeframe="Total active enrolled athletes"
        />
        <MetricCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(stats?.monthlyRevenue ?? 0, currency)}
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          timeframe="Gross billed subscriptions"
        />
        <MetricCard
          title="Facility Occupancy"
          value={`${stats?.currentOccupancy ?? 0}%`}
          icon={<Flame className="h-5 w-5 text-amber-500" />}
          timeframe="Live check-in load"
        />
        <MetricCard
          title="Today's Check-ins"
          value={stats?.todayCheckins ?? 0}
          icon={<Activity className="h-5 w-5 text-purple-500" />}
          timeframe="Turnstile biometric scans"
        />
      </div>

      {/* Charts Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
              <CardDescription>Historical gross revenue analytics</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Live DB
            </Badge>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-xl border border-dashed border-border/80">
                <DollarSign className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <h4 className="text-sm font-semibold text-foreground">No Revenue Recorded Yet</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Your tenant workspace is fresh. When members enroll or invoices are generated, monthly recurring revenue will chart here in real time.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 gap-1.5"
                  onClick={() => navigate('/member-management/members/create')}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Register First Member</span>
                </Button>
              </div>
            ) : (
              <div className="h-[280px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Today's Hourly Attendance</CardTitle>
            <CardDescription>Biometric turnstile check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceData.length === 0 ? (
              <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-xl border border-dashed border-border/80">
                <Activity className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <h4 className="text-sm font-semibold text-foreground">Zero Check-ins Today</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Turnstiles are idle. Live biometric scans will populate here as athletes enter.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 text-xs"
                  onClick={() => navigate('/turnstile-access/attendance')}
                >
                  <span>Open Turnstile Terminal</span>
                </Button>
              </div>
            ) : (
              <div className="h-[280px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Bar dataKey="count" name="Check-ins" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity & Operational Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Member Enrollments from MongoDB */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Member Registrations</CardTitle>
              <CardDescription>Live database feed of registered members</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary"
              onClick={() => navigate('/member-management/members')}
            >
              View Directory
            </Button>
          </CardHeader>
          <CardContent>
            {recentList.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
                <p>No recent member registrations recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentList.map((member, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between first:pt-0 last:pb-0 cursor-pointer group"
                    onClick={() => navigate(`/member-management/members/${member.memberCode}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary/20 to-purple-500/20 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                        {member.avatar || 'M'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-xs text-primary font-semibold">
                        {member.memberCode}
                      </span>
                      <Badge
                        variant={
                          String(member.status).toUpperCase() === 'ACTIVE'
                            ? 'success'
                            : String(member.status).toUpperCase() === 'FROZEN'
                            ? 'warning'
                            : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Facility Health */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Facility Telemetry</CardTitle>
            <CardDescription>IoT biometric turnstiles & access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <div>
                  <div className="font-semibold text-foreground">Turnstile Gates</div>
                  <div className="text-[11px] text-muted-foreground">RFID & Biometric Scanner</div>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">
                Online
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">Capacity Load</div>
                  <div className="text-[11px] text-muted-foreground">
                    {stats?.currentOccupancy ?? 0} / {stats?.maxCapacity ?? 0} athletes
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-primary">
                {stats?.maxCapacity && stats.maxCapacity > 0
                  ? Math.round(((stats.currentOccupancy || 0) / stats.maxCapacity) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Database Latency
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                12ms (Direct)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
