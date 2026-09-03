import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../shared/components/ui/tabs';
import {
  Building2,
  Edit2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ShieldCheck,
  Dumbbell,
  Sparkles,
  DollarSign,
  Users,
  Layers,
  Fingerprint,
  HeartPulse,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IGymProfile } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const DEFAULT_BLANK_PROFILE: IGymProfile = {
  id: 'default',
  name: 'My Fitness Organization',
  code: 'GF-MAIN',
  tagline: 'Premier Athletic Club & Wellness Center',
  description: 'Welcome to your gym management profile. Customize your organization branding, operating hours, and turnstile hardware details.',
  logo: '',
  coverImage: '',
  taxId: '',
  businessLicense: '',
  foundedYear: new Date().getFullYear(),
  currency: 'USD',
  defaultTaxRate: 0,
  invoiceHeader: 'My Fitness Organization',
  invoiceFooter: 'Thank you for choosing our fitness club.',
  is24x7: false,
  maxCapacity: 100,
  currentOccupancy: 0,
  address: {
    street: 'Enter address',
    city: 'City',
    state: 'State',
    postalCode: '00000',
    country: 'Country',
  },
  contacts: {
    phone: '',
    email: '',
    website: '',
  },
  amenities: [],
  zones: [],
  status: 'active',
};

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();

  const [gym, setGym] = useState<IGymProfile>(() => {
    const saved = localStorage.getItem('gymflow_custom_gym_profile');
    return saved ? JSON.parse(saved) : DEFAULT_BLANK_PROFILE;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const loadProfile = async () => {
    try {
      const saved = localStorage.getItem('gymflow_custom_gym_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name) {
            setGym(parsed);
          }
        } catch {}
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/gym-profile', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const data: IGymProfile = Array.isArray(json.data) ? json.data[0] : json.data?.items?.[0] || json.data;
        if (data && data.name) {
          setGym(data);
          localStorage.setItem('gymflow_custom_gym_profile', JSON.stringify(data));
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadProfile();

    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener('gymflow_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('gymflow_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, [id, activeBranchId]);

  const occupancyPercent = gym.maxCapacity && gym.maxCapacity > 0 ? Math.round(((gym.currentOccupancy || 0) / gym.maxCapacity) * 100) : 0;

  return (
    <PageContainer>
      {/* Top Navigation & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {gym.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Active Gym Profile • {gym.address?.city || 'Primary City'}, {gym.address?.state || 'State'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/gym-management/gym-profile/${gym.id || 'default'}/edit`)}
            className="gap-1.5 shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Gym Profile</span>
          </Button>
        </div>
      </div>

      {/* Hero Cover Banner Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-xs">
        <div className="h-36 sm:h-44 md:h-56 relative bg-muted overflow-hidden">
          <img
            src={gym.coverImage || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&auto=format&fit=crop&q=80'}
            alt="Gym Facility Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        </div>

        <CardContent className="p-4 sm:p-5 md:p-6 relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-10 sm:-mt-16 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <img
                  src={gym.logo || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80'}
                  alt="Gym Logo"
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-card shadow-lg bg-card"
                />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ring-2 ring-card bg-emerald-500" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">{gym.name}</h2>
                  <Badge variant="success" className="text-[10px] sm:text-[11px] font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Facility
                  </Badge>
                  <span className="text-[10px] sm:text-xs font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted shrink-0">
                    {gym.code || 'GF-HQ-01'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground max-w-2xl line-clamp-2 sm:line-clamp-none">{gym.tagline}</p>
              </div>
            </div>

            {/* Live Capacity Gauge */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border/80 text-left md:text-right shrink-0 self-start md:self-auto">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold flex items-center md:justify-end gap-1">
                <Flame className="w-3 h-3 text-orange-500" /> Live Facility Occupancy
              </div>
              <div className="text-base sm:text-lg font-bold text-foreground font-mono">
                {gym.currentOccupancy || 0} <span className="text-xs font-normal text-muted-foreground">/ {gym.maxCapacity || 100} cap</span>
              </div>
              <div className="w-28 sm:w-36 h-2 bg-muted rounded-full overflow-hidden mt-1 md:ml-auto">
                <div
                  className={`h-full rounded-full ${
                    occupancyPercent > 80 ? 'bg-rose-500' : occupancyPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 border-t border-border/80 text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Total Square Footage</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">
                {gym.zones?.reduce((acc, z) => acc + (z.sqFt || 0), 0) || 18000} sq ft
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Max Capacity</div>
              <div className="text-sm sm:text-base font-bold text-primary font-mono truncate">
                {gym.maxCapacity || 100} Athlete Cap
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Turnstile Gates</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
                {gym.accessControl?.gateCount || 2} Active Lanes
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">Founded Year</div>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{gym.foundedYear || 2026}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="facilities" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="facilities" className="text-xs font-semibold gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-primary" /> Training Zones & Amenities
          </TabsTrigger>
          <TabsTrigger value="location" className="text-xs font-semibold gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location & Contact Endpoints
          </TabsTrigger>
          <TabsTrigger value="hours" className="text-xs font-semibold gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Operational Hours
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-xs font-semibold gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Billing & Tax Configuration
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-semibold gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Access Control & Safety
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ZONES & AMENITIES */}
        <TabsContent value="facilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Facility Training Zones Breakdown
              </CardTitle>
              <CardDescription className="text-xs">Dedicated training areas and capacity limits for {gym.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gym.zones?.map((zone, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-muted/30 border border-border/80 hover:border-primary/40 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground text-xs group-hover:text-primary transition-colors">
                        {zone.name}
                      </h4>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {zone.sqFt.toLocaleString()} sq ft
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{zone.description}</p>
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Max Zone Capacity:</span>
                      <span className="font-semibold text-foreground">{zone.capacity} persons</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Member Amenities & Features
              </CardTitle>
              <CardDescription className="text-xs">Available features at {gym.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {gym.amenities?.map((amenity, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2.5 shadow-2xs"
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-foreground leading-tight">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: LOCATION & CONTACT */}
        <TabsContent value="location" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> Physical Location & Coordinates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Street Address</div>
                  <div className="font-semibold text-foreground text-sm">{gym.address?.street}</div>
                  <div className="text-muted-foreground">{gym.address?.suite}</div>
                  <div className="text-foreground pt-1">{gym.address?.city}, {gym.address?.state} {gym.address?.postalCode}</div>
                  <div className="text-muted-foreground">{gym.address?.country}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">GPS Geofence Coordinates</div>
                    <div className="font-mono text-foreground font-semibold pt-0.5">
                      {gym.address?.latitude}° N, {gym.address?.longitude}° W
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Mobile Auto Check-in</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" /> Contact Lines & Social Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Front Desk Reception
                  </span>
                  <span className="font-semibold text-foreground">{gym.contacts?.phone}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rose-500" /> Emergency Hotline
                  </span>
                  <span className="font-semibold text-foreground">{gym.contacts?.emergencyPhone}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" /> General Email
                  </span>
                  <span className="font-semibold text-foreground">{gym.contacts?.email}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-500" /> Official Website
                  </span>
                  <a href={gym.contacts?.website} target="_blank" rel="noreferrer" className="font-semibold text-primary flex items-center gap-1">
                    {gym.contacts?.website} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: OPERATING HOURS */}
        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Operational Facility Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Monday – Friday (Weekdays)</span>
                  <div className="text-lg font-bold text-foreground font-mono">{gym.operatingHours?.weekdays}</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Full Staff On Duty</span>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Saturday</span>
                  <div className="text-lg font-bold text-foreground font-mono">{gym.operatingHours?.saturday}</div>
                  <span className="text-[10px] text-muted-foreground">Weekend Classes Active</span>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Sunday</span>
                  <div className="text-lg font-bold text-foreground font-mono">{gym.operatingHours?.sunday}</div>
                  <span className="text-[10px] text-muted-foreground">Recovery & Open Gym</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Holiday Schedule Notes:</span>
                <span className="font-semibold text-foreground">{gym.operatingHours?.holidayNotes}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: BILLING & TAX */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Billing, Currency & Invoicing Configurations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Base Currency</span>
                  <div className="text-2xl font-bold font-mono text-foreground">{gym.currency || 'USD'} ($)</div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Sales Tax Rate</span>
                  <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{gym.defaultTaxRate}%</div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <span className="text-xs text-muted-foreground">Tax Registration EIN</span>
                  <div className="text-base font-bold font-mono text-foreground">{gym.taxId}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: ACCESS CONTROL & SAFETY */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Biometrics, Turnstiles & Emergency Systems
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Fingerprint className="w-4 h-4" /> Turnstile Scanner Type
                  </div>
                  <div className="font-semibold text-foreground text-sm pt-1">{gym.accessControl?.turnstileType}</div>
                  <span className="text-[10px] text-muted-foreground">Total Active Lanes: {gym.accessControl?.gateCount}</span>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
                  <div className="flex items-center gap-2 text-rose-500 font-semibold">
                    <HeartPulse className="w-4 h-4" /> AED Defibrillator Location
                  </div>
                  <div className="font-semibold text-foreground text-sm pt-1">{gym.accessControl?.aedLocation}</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Inspected & Battery Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
