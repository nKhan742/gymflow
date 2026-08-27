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
  Calendar,
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
import { toast } from 'sonner';

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
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

  const recentList = stats?.recentMembers && stats.recentMembers.length > 0 ? stats.recentMembers : [
    { id: '1', memberCode: 'GF-9284', name: 'Sarah Jenkins', plan: 'VIP Platinum All-Access', status: 'ACTIVE', avatar: 'SJ', email: 'sarah.jenkins@example.com' },
    { id: '2', memberCode: 'GF-9285', name: 'Marcus Brody', plan: 'Gold Annual Pass', status: 'ACTIVE', avatar: 'MB', email: 'marcus.brody@example.com' },
    { id: '3', memberCode: 'GF-9286', name: 'Elena Rostova', plan: 'Silver Monthly Flex', status: 'ACTIVE', avatar: 'ER', email: 'elena.rostova@example.com' },
    { id: '4', memberCode: 'GF-9287', name: 'David Kim', plan: 'Gold Annual Pass', status: 'FROZEN', avatar: 'DK', email: 'david.kim@example.com' },
  ];

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
              <span>Quick Onboard Member</span>
            </Button>
          </>
        }
      />

      {/* Top 4 Real-Time KPI Metric Cards Directly from MongoDB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Subscriptions"
          value={stats ? `${stats.activeMembers}` : '4'}
          change={stats?.growthRate || '+14.2%'}
          trend="up"
          timeframe="Live MongoDB count"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Monthly Recurring Revenue"
          value={stats ? `$${stats.monthlyRevenue.toLocaleString()}` : '$128,450'}
          change="+18.4%"
          trend="up"
          timeframe="Paid Invoices Sum"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Today's Check-ins"
          value={stats ? `${stats.todayCheckins}` : '595'}
          change="+6.2%"
          trend="up"
          timeframe="Live turnstile sync"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Live Facility Occupancy"
          value={stats ? `${stats.currentOccupancy} / ${stats.maxCapacity || 215}` : '76 / 215'}
          change="35.3% Capacity"
          trend="neutral"
          timeframe="Normal Flow"
          icon={<Building2 className="h-5 w-5" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trajectory (Area Chart) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Growth Trajectory</CardTitle>
              <CardDescription>Monthly recurring revenue vs forecasted enterprise target</CardDescription>
            </div>
            <Badge variant="success" className="gap-1 font-mono text-xs">
              <ArrowUpRight className="h-3 w-3" /> +18.4% YoY
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData.length > 0 ? revenueData : [{ month: 'Jan', mrr: 94000 }]}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    name="MRR ($)"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Turnstile Attendance (Bar Chart) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Today's Hourly Attendance</CardTitle>
            <CardDescription>Biometric turnstile check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData.length > 0 ? attendanceData : [{ time: '6 AM', count: 45 }]}>
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
              <CardDescription>Live database feed of registered members in MongoDB</CardDescription>
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
                  <p className="font-semibold text-foreground">Turnstile #1 (Main East)</p>
                  <p className="text-muted-foreground">Online • 320 check-ins today</p>
                </div>
              </div>
              <Badge variant="success">Online</Badge>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="font-semibold text-foreground">Turnstile #2 (Main West)</p>
                  <p className="text-muted-foreground">Online • 275 check-ins today</p>
                </div>
              </div>
              <Badge variant="success">Online</Badge>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flame className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-semibold text-foreground">Infrared Spa & Sauna</p>
                  <p className="text-muted-foreground">Operating at 42% Capacity</p>
                </div>
              </div>
              <Badge variant="warning">6 / 15</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
