import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Users,
  Edit2,
  Building2,
  ArrowLeft,
  RefreshCw,
  Clock,
  Flame,
  Zap,
  MapPin,
  CheckCircle2,
  User,
  Calendar,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IGroupClass } from '../types';
import { DEFAULT_GROUP_CLASSES } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cls, setCls] = useState<IGroupClass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassData();
  }, [id]);

  const loadClassData = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_group_classes');
      const customList: IGroupClass[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find(
        (c) => c.id === id || c.classCode === id || c._id === id || c.id?.toLowerCase() === id?.toLowerCase() || c.classCode?.toLowerCase() === id?.toLowerCase()
      );

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/group-classes/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCls(json.data);
          setLoading(false);
          return;
        }
      }

      if (customMatch) {
        setCls(customMatch);
        setLoading(false);
        return;
      }

      const fallback = DEFAULT_GROUP_CLASSES.find(
        (c) => c.id === id || c.classCode === id || c.id?.toLowerCase() === id?.toLowerCase() || c.classCode?.toLowerCase() === id?.toLowerCase()
      );

      if (fallback) {
        setCls(fallback);
      } else {
        setCls({
          id: id || 'CLS-CUSTOM',
          classCode: id || 'CLS-CUSTOM',
          name: id?.replace('CLS-', '').replace(/-/g, ' ') || 'Group Studio Fitness Class',
          category: 'HIIT_CIRCUIT',
          instructorId: 'STF-001',
          instructorName: 'Lead Studio Coach',
          studioRoom: 'Main Group Studio A',
          durationMins: 45,
          maxCapacity: 24,
          currentBookedCount: 12,
          caloriesBurnEstimate: 550,
          intensityLevel: 'HIGH',
          scheduleTime: 'Daily • 06:00 PM',
          branchId: 'ALL',
          branchName: 'All Locations',
          status: 'active',
          description: 'High-intensity group fitness session with energetic music and team atmosphere.',
        });
      }
    } catch {
      const stored = localStorage.getItem('gymflow_custom_group_classes');
      const customList: IGroupClass[] = stored ? JSON.parse(stored) : [];
      const customMatch = customList.find((c) => c.id === id || c.classCode === id);
      const fallback = customMatch || DEFAULT_GROUP_CLASSES.find((c) => c.id === id || c.classCode === id) || DEFAULT_GROUP_CLASSES[0];
      setCls(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !cls) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Studio Class...</div>
        </div>
      </PageContainer>
    );
  }

  const fillPercent = Math.round(((cls.currentBookedCount || 0) / (cls.maxCapacity || 1)) * 100);

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/group-classes')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Group Classes</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {cls.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({cls.classCode})</span>
            </h1>
            <p className="text-xs text-muted-foreground">{cls.studioRoom} • {cls.scheduleTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/fitness/group-classes/${cls.id || cls._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Class</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="mb-6 border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{cls.name}</h2>
                  <Badge variant="default" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {cls.category ? String(cls.category).replace(/_/g, ' ') : 'Studio Class'}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-[11px] shrink-0">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    {cls.branchName || 'All Locations'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span>Instructor: <strong className="text-foreground">{cls.instructorName}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-primary font-mono">{cls.durationMins} Minutes</strong></span>
                </div>
              </div>
            </div>

            {/* Capacity Pill */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Studio Occupancy</div>
                <div className="text-xs font-bold text-foreground font-mono">{cls.currentBookedCount} / {cls.maxCapacity} Booked</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{fillPercent}% Capacity Filled</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Class Duration</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{cls.durationMins} Minutes</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Calorie Burn</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">~{cls.caloriesBurnEstimate} kcal</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Intensity Level</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">{cls.intensityLevel}</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Studio Room</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{cls.studioRoom}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="roster" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="roster" className="text-xs font-semibold gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" /> Booked Member Roster ({cls.currentBookedCount})
          </TabsTrigger>
          <TabsTrigger value="details" className="text-xs font-semibold gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Instructor & Class Details
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ROSTER */}
        <TabsContent value="roster" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Registered Participants ({cls.currentBookedCount} / {cls.maxCapacity})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Member"
                    className="w-8 h-8 rounded-full object-cover border border-border/80"
                  />
                  <div>
                    <div className="text-xs font-bold text-foreground">Sophia Sterling</div>
                    <div className="text-[10px] text-muted-foreground">Reserved Spot #04 • Check-In Ready</div>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">Confirmed</Badge>
              </div>
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Member"
                    className="w-8 h-8 rounded-full object-cover border border-border/80"
                  />
                  <div>
                    <div className="text-xs font-bold text-foreground">Alexander Wright</div>
                    <div className="text-[10px] text-muted-foreground">Reserved Spot #05 • Check-In Ready</div>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">Confirmed</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: DETAILS */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Instructor Profile & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
                <div className="font-bold text-foreground">Format Guidelines:</div>
                <p className="text-muted-foreground">
                  {cls.description || 'Arrive 10 minutes prior for equipment calibration and heart rate monitor synchronization.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
