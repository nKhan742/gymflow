import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Clock,
  Edit2,
  Building2,
  ArrowLeft,
  RefreshCw,
  Zap,
  Flame,
  Wrench,
  Dumbbell,
  Sparkles,
  Waves,
  Coffee,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IWorkingHourZone } from '../types';
import { DEFAULT_ZONES } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [zone, setZone] = useState<IWorkingHourZone | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadZoneData();
  }, [id]);

  const loadZoneData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_ZONES.find((z: IWorkingHourZone) => z.id === id || z.code === id) || null;
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/working-hours/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setZone(json.data);
          setLoading(false);
          return;
        }
      }
      setZone(fallback);
    } catch {
      const fallback = DEFAULT_ZONES.find((z: IWorkingHourZone) => z.id === id || z.code === id) || null;
      setZone(fallback);
    } finally {
      setLoading(false);
    }
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'MAIN_GYM':
        return <Dumbbell className="w-8 h-8" />;
      case 'SPA_RECOVERY':
        return <Sparkles className="w-8 h-8" />;
      case 'SWIMMING_POOL':
        return <Waves className="w-8 h-8" />;
      case 'SMOOTHIE_BAR':
        return <Coffee className="w-8 h-8" />;
      default:
        return <Clock className="w-8 h-8" />;
    }
  };

  if (loading || !zone) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Zone Telemetry...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gym-management/working-hours')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Facility Zones</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {zone.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({zone.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">{zone.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/gym-management/working-hours/${zone.id || zone._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Schedule</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                {getZoneIcon(zone.zoneType)}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{zone.name}</h2>
                  {zone.is24x7 ? (
                    <Badge variant="success" className="gap-1 text-[10px] sm:text-[11px] font-bold shrink-0">
                      <Zap className="w-3 h-3 fill-emerald-500" /> 24/7 Access
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] font-bold shrink-0">
                      <Clock className="w-3 h-3" /> Timetable Operating
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {zone.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Type: <strong className="text-foreground">{zone.zoneType}</strong></span>
                  <span>•</span>
                  <span>Peak Hours: <strong className="text-amber-600 dark:text-amber-400 font-mono">{zone.peakHoursStart} – {zone.peakHoursEnd}</strong></span>
                  <span>•</span>
                  <span>Max Capacity: <strong className="text-foreground">{zone.maxCapacity || 150} Members</strong></span>
                </div>
              </div>
            </div>

            {/* Live Status Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Live Area Telemetry</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">OPEN NOW</div>
                <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate">Turnstile Gates Unlocked</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Access Privilege</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{zone.is24x7 ? '24/7 Keycard' : 'Active Hours'}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Peak Rush Window</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{zone.peakHoursStart} – {zone.peakHoursEnd}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Max Occupancy</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{zone.maxCapacity} Members</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Maintenance</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate font-mono pt-0.5">
                {zone.maintenanceWindow || 'Nightly'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="schedule" className="text-xs font-semibold gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" /> 7-Day Timetable Grid
          </TabsTrigger>
          <TabsTrigger value="capacity" className="text-xs font-semibold gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Peak Hours & Capacity Telemetry
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs font-semibold gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-blue-500" /> Sanitization & Maintenance
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: 7-DAY SCHEDULE */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Master Weekly Operating Timetable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                {zone.weeklySchedule?.map((d) => (
                  <div
                    key={d.day}
                    className="p-4 rounded-xl bg-card border border-border/80 text-center space-y-2 hover:border-primary/40 transition-colors shadow-2xs"
                  >
                    <div className="text-xs font-bold uppercase text-foreground">{d.day}</div>
                    <div className="font-mono text-xs font-semibold text-primary">
                      {zone.is24x7 ? '24 Hours' : `${d.openTime} – ${d.closeTime}`}
                    </div>
                    <Badge variant={d.isOpen ? 'success' : 'secondary'} className="text-[10px] px-2 py-0">
                      {d.isOpen ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CAPACITY */}
        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" /> Live Area Capacity & Surge Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Current Occupancy</span>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">42 / {zone.maxCapacity}</div>
                  <span className="text-[10px] text-muted-foreground">28% Occupancy Level</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Peak Rush Window</span>
                  <div className="text-2xl font-bold text-foreground font-mono">{zone.peakHoursStart} – {zone.peakHoursEnd}</div>
                  <span className="text-[10px] text-amber-500 font-medium">Automatic turnstile metering enabled</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">RFID Gate Status</span>
                  <div className="text-2xl font-bold text-primary font-mono">Unrestricted</div>
                  <span className="text-[10px] text-muted-foreground">All active member tiers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: MAINTENANCE */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-500" /> Sanitization & Equipment Servicing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-foreground">Scheduled Maintenance Window</div>
                  <Badge variant="outline" className="text-xs font-mono">{zone.maintenanceWindow || 'Nightly'}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  During maintenance hours, facility janitorial and technical staff conduct equipment sanitization, weight plate re-racking, and HVAC filtration checks.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
