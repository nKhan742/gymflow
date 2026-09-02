import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Building2,
  Edit2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Layers,
  ArrowLeft,
  RefreshCw,
  Flame,
  CheckCircle2,
  User,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IBranch } from '../types';
import { useBranchStore, DEFAULT_BRANCHES } from '../../../../core/store/branchStore';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setActiveBranchId, activeBranchId } = useBranchStore();
  const [branch, setBranch] = useState<IBranch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBranchData();
  }, [id]);

  const loadBranchData = async () => {
    setLoading(true);
    try {
      const localRaw = localStorage.getItem('gymflow_custom_gym_branches');
      const localCustom: IBranch[] = localRaw ? JSON.parse(localRaw) : [];
      const localMatch = localCustom.find((b) => b.id === id || b.code === id || (b as any)._id === id);

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/branches/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setBranch(json.data);
          setLoading(false);
          return;
        }
      }
      setBranch(localMatch || null);
    } catch {
      const localRaw = localStorage.getItem('gymflow_custom_gym_branches');
      const localCustom: IBranch[] = localRaw ? JSON.parse(localRaw) : [];
      const localMatch = localCustom.find((b) => b.id === id || b.code === id || (b as any)._id === id);
      setBranch(localMatch || null);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !branch) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading Branch Telemetry...</div>
        </div>
      </PageContainer>
    );
  }

  const occupancyPercent = Math.round(((branch.currentOccupancy || 0) / (branch.capacity || 100)) * 100);
  const isCurrentActive = activeBranchId === branch.id || activeBranchId === branch._id;

  return (
    <PageContainer>
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gym-management/branches')}
            className="gap-1.5 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Gym Locations</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {branch.name}
              <span className="text-xs font-mono text-muted-foreground font-normal">({branch.code})</span>
            </h1>
            <p className="text-xs text-muted-foreground">Branch 360° Facility Telemetry, Local Staff, and Member Allocation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isCurrentActive ? 'outline' : 'default'}
            size="sm"
            onClick={() => {
              setActiveBranchId(branch.id || (branch._id as string));
              toast.success(`Active gym context set to ${branch.name}`);
            }}
            className={`gap-1.5 h-9 font-semibold ${
              isCurrentActive ? 'border-primary/40 text-primary hover:bg-primary/10' : 'shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCurrentActive ? 'Active Workspace Location' : 'Set as Active Location'}</span>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/gym-management/branches/${branch.id || branch._id}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Facility</span>
          </Button>
        </div>
      </div>

      {/* Hero Cover Banner Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-xs">
        <div className="h-36 sm:h-44 md:h-52 relative bg-muted overflow-hidden">
          <img
            src={branch.image || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&auto=format&fit=crop&q=80'}
            alt="Gym Facility Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        </div>

        <CardContent className="p-4 sm:p-5 md:p-6 relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-10 sm:-mt-14 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-card shadow-lg bg-card shrink-0">
                <img
                  src={branch.image || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&auto=format&fit=crop&q=80'}
                  alt="Branch Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{branch.name}</h2>
                  <Badge variant="success" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    {branch.address?.street}, {branch.address?.city}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> GM: {branch.manager?.name || 'Assigned Lead'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Capacity Gauge */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 text-left md:text-right shrink-0 self-start md:self-auto">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold flex items-center md:justify-end gap-1">
                <Flame className="w-3 h-3 text-orange-500" /> Live Branch Occupancy
              </div>
              <div className="text-base sm:text-lg font-bold text-foreground font-mono">
                {branch.currentOccupancy || 0} <span className="text-xs font-normal text-muted-foreground">/ {branch.capacity} cap</span>
              </div>
              <div className="w-28 sm:w-36 h-2 bg-muted rounded-full overflow-hidden mt-1 md:ml-auto">
                <div
                  className={`h-full rounded-full ${
                    occupancyPercent > 80 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Floor Space</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{branch.sqFt?.toLocaleString()} sq ft</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Assigned Members</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">{branch.memberCount?.toLocaleString()} Active</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Staff & Coaches</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{branch.staffCount} On Roster</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Monthly Revenue</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
                ${branch.monthlyRevenue?.toLocaleString()}/mo
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-semibold gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> Facility Overview & Amenities
          </TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs font-semibold gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location & Management
          </TabsTrigger>
          <TabsTrigger value="hours" className="text-xs font-semibold gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Operating Schedule
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW & AMENITIES */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Included Facility Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {branch.amenities?.map((amenity, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center gap-2.5 shadow-2xs"
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: LOCATION & CONTACTS */}
        <TabsContent value="contacts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> Physical Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="font-semibold text-foreground text-sm">{branch.address?.street}</div>
                  <div className="text-muted-foreground">{branch.address?.suite}</div>
                  <div className="text-foreground pt-1">{branch.address?.city}, {branch.address?.state} {branch.address?.postalCode}</div>
                  <div className="text-muted-foreground">{branch.address?.country}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" /> Local Branch Leadership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2">
                  <div className="font-bold text-foreground text-sm">{branch.manager?.name}</div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> {branch.manager?.email}
                  </div>
                  <div className="text-foreground flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> {branch.manager?.phone}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: OPERATING SCHEDULE */}
        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Turnstile & Facility Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Weekdays (Mon – Fri)</span>
                  <div className="text-lg font-bold text-foreground font-mono">{branch.operatingHours?.weekdays}</div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Saturday</span>
                  <div className="text-lg font-bold text-foreground font-mono">{branch.operatingHours?.saturday}</div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Sunday</span>
                  <div className="text-lg font-bold text-foreground font-mono">{branch.operatingHours?.sunday}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
