import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Layers,
  DollarSign,
  Upload,
  Camera,
  Trash2,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { IBranch } from '../types';
import { useBranchStore, DEFAULT_BRANCHES } from '../../../../core/store/branchStore';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Section 1: Basic Info & Image
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [tagline, setTagline] = useState('');
  const [image, setImage] = useState('');

  // Section 2: Address & Location
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Section 3: Management & Contacts
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchEmail, setBranchEmail] = useState('');

  // Section 4: Specifications & Capacity
  const [sqFt, setSqFt] = useState('20000');
  const [capacity, setCapacity] = useState('300');
  const [turnstileCount, setTurnstileCount] = useState('2');
  const [monthlyRevenue, setMonthlyRevenue] = useState('80000');

  // Section 5: Schedule & Amenities
  const [weekdays, setWeekdays] = useState('05:00 AM – 11:00 PM');
  const [saturday, setSaturday] = useState('06:00 AM – 10:00 PM');
  const [sunday, setSunday] = useState('07:00 AM – 09:00 PM');
  const [amenitiesInput, setAmenitiesInput] = useState('');

  useEffect(() => {
    loadBranch();
  }, [id]);

  const loadBranch = async () => {
    setFetching(true);
    try {
      const cached = localStorage.getItem('gymflow_live_branches');
      const liveList: IBranch[] = cached ? JSON.parse(cached) : DEFAULT_BRANCHES;
      const localMatch = liveList.find((b) => b.id === id || b.code === id || (b as any)._id === id) || liveList[0];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/branches/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IBranch = localMatch || ({} as IBranch);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setName(data.name || '');
      setCode(data.code || '');
      setTagline(data.tagline || '');
      setImage(data.image || '');

      if (data.address) {
        setStreet(data.address.street || '');
        setSuite(data.address.suite || '');
        setCity(data.address.city || '');
        setState(data.address.state || '');
        setPostalCode(data.address.postalCode || '');
        setCountry(data.address.country || 'United States');
      }

      if (data.manager) {
        setManagerName(data.manager.name || '');
        setManagerEmail(data.manager.email || '');
        setManagerPhone(data.manager.phone || '');
      }

      setBranchPhone(data.phone || '');
      setBranchEmail(data.email || '');
      setSqFt(data.sqFt?.toString() || '20000');
      setCapacity(data.capacity?.toString() || '300');
      setTurnstileCount(data.turnstileCount?.toString() || '2');
      setMonthlyRevenue(data.monthlyRevenue?.toString() || '80000');

      if (data.operatingHours) {
        setWeekdays(data.operatingHours.weekdays || '05:00 AM – 11:00 PM');
        setSaturday(data.operatingHours.saturday || '06:00 AM – 10:00 PM');
        setSunday(data.operatingHours.sunday || '07:00 AM – 09:00 PM');
      }

      if (data.amenities) {
        setAmenitiesInput(data.amenities.join(', '));
      }
    } catch {
      // Use fallback
    } finally {
      setFetching(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast.success('Gym facade photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IBranch> = {
        name,
        code,
        tagline,
        image,
        phone: branchPhone,
        email: branchEmail,
        sqFt: Number(sqFt) || 20000,
        capacity: Number(capacity) || 300,
        turnstileCount: Number(turnstileCount) || 2,
        monthlyRevenue: Number(monthlyRevenue) || 80000,
        address: {
          street,
          suite,
          city,
          state,
          postalCode,
          country,
        },
        manager: {
          name: managerName,
          email: managerEmail,
          phone: managerPhone,
        },
        operatingHours: {
          weekdays,
          saturday,
          sunday,
        },
        amenities: amenitiesInput.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/gym/branches/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      useBranchStore.getState().loadBranches();
      toast.success(`Gym Branch "${name}" updated successfully!`);
      navigate(`/gym-management/branches/${id}`);
    } catch {
      toast.error('Network error during update');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <div className="text-muted-foreground text-sm font-medium">Loading Branch Records...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Gym Branch: ${name || 'Facility'}`}
        subtitle="Update physical location details, capacity limits, management assignments, and operating schedules."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/gym-management/branches/${id}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              disabled={loading}
              onClick={handleUpdate}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: BRANCH IDENTITY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                1. Branch Identity & Photo
              </CardTitle>
              <CardDescription className="text-xs">Upload facility cover photo, name, and unique branch code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              {/* Photo Uploader */}
              <ImageUpload
                label="Facility Facade & Interior Cover Photo"
                variant="thumbnail"
                value={image}
                onChange={setImage}
                helperText="Upload branch photo (PNG, JPG, WebP up to 10MB)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Westside Performance Club"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="GF-WEST-02"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tagline / Motto</label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Premier conditioning & recovery center..."
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: PHYSICAL ADDRESS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                2. Physical Location Address
              </CardTitle>
              <CardDescription className="text-xs">Street address, suite/bay, and city for geofencing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Street Address *</label>
                <Input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="450 Ocean Avenue"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Suite / Building Bay</label>
                <Input
                  value={suite}
                  onChange={(e) => setSuite(e.target.value)}
                  placeholder="Building B, Floor 1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="San Francisco" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">State</label>
                  <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="CA" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Postal Code</label>
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="94112" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: MANAGEMENT & CONTACTS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                3. General Manager & Branch Contact
              </CardTitle>
              <CardDescription className="text-xs">Assigned local leadership and front desk phone numbers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">General Manager Name</label>
                  <Input
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Elena Rostova"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Manager Email</label>
                  <Input
                    type="email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="e.rostova@gymflow.io"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reception Phone</label>
                  <Input
                    value={branchPhone}
                    onChange={(e) => setBranchPhone(e.target.value)}
                    placeholder="+1 (415) 555-8902"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Email</label>
                  <Input
                    type="email"
                    value={branchEmail}
                    onChange={(e) => setBranchEmail(e.target.value)}
                    placeholder="westside@gymflow.io"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: SPECIFICATIONS & CAPACITY */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                4. Floor Space, Capacity & Revenue
              </CardTitle>
              <CardDescription className="text-xs">Physical square footage, turnstiles, and financial run-rate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Floor Area (Sq Ft) *</label>
                  <Input
                    type="number"
                    value={sqFt}
                    onChange={(e) => setSqFt(e.target.value)}
                    placeholder="22000"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Max Member Capacity *</label>
                  <Input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="280"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Turnstile Gates</label>
                  <Input
                    type="number"
                    value={turnstileCount}
                    onChange={(e) => setTurnstileCount(e.target.value)}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Monthly Revenue ($/mo)</label>
                  <Input
                    type="number"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                    placeholder="98000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CARD 5: SCHEDULE & AMENITIES */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              5. Operational Schedule & Amenities
            </CardTitle>
            <CardDescription className="text-xs">Operating hours and equipment/recovery amenities available at this location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Weekdays (Mon – Fri)</label>
                <Input value={weekdays} onChange={(e) => setWeekdays(e.target.value)} placeholder="05:30 AM – 10:30 PM" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Saturday</label>
                <Input value={saturday} onChange={(e) => setSaturday(e.target.value)} placeholder="07:00 AM – 09:00 PM" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Sunday</label>
                <Input value={sunday} onChange={(e) => setSunday(e.target.value)} placeholder="08:00 AM – 08:00 PM" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Featured Amenities (comma separated)</label>
              <Input
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                placeholder="Sprint Turf, Eleiko Power Racks, Steam Room, Hydro-Massage Lounge"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(`/gym-management/branches/${id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="gap-1.5 shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  );
};
