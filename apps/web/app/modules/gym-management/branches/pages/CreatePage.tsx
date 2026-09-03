import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox, ISelectOption } from '../../../../shared/components/ui/select';
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
  ShieldCheck,
  Upload,
  Camera,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { IBranch } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Section 1: Basic Info & Image
  const [name, setName] = useState('');
  const [code, setCode] = useState(`GF-BR-${Math.floor(10 + Math.random() * 90)}`);
  const [tagline, setTagline] = useState('Premier athletic conditioning and functional training center.');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80');

  // Section 2: Address & Location
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94103');
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
  const [amenitiesInput, setAmenitiesInput] = useState('Olympic Lifting Platforms, Sprint Turf, Sauna, Executive Lockers');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast.success('Gym facade photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !street.trim()) {
      toast.error('Please enter gym branch name, code, and street address.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: IBranch = {
        id: `BR-${Math.floor(100 + Math.random() * 900)}`,
        name,
        code,
        tagline,
        image,
        phone: branchPhone || '+1 (415) 555-0000',
        email: branchEmail || `${code.toLowerCase()}@gymflow.io`,
        sqFt: Number(sqFt) || 20000,
        capacity: Number(capacity) || 300,
        currentOccupancy: 0,
        memberCount: 0,
        staffCount: 0,
        turnstileCount: Number(turnstileCount) || 2,
        monthlyRevenue: Number(monthlyRevenue) || 75000,
        address: {
          street,
          suite,
          city,
          state,
          postalCode,
          country,
        },
        manager: {
          name: managerName || 'Unassigned Lead',
          email: managerEmail || 'manager@gymflow.io',
          phone: managerPhone || branchPhone,
        },
        operatingHours: {
          weekdays,
          saturday,
          sunday,
        },
        amenities: amenitiesInput.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'active',
      };

      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/branches', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        useBranchStore.getState().loadBranches();
        toast.success(`Gym Branch "${name}" onboarded successfully!`);
        navigate('/gym-management/branches');
      } else {
        toast.error('Failed to create branch record');
      }
    } catch {
      toast.error('Network error during onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Onboard New Gym Branch"
        subtitle="Register a new physical gym location into your brand network with address, manager assignments, and operational capacity."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/gym-management/branches')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              disabled={loading}
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Onboarding...' : 'Save & Onboard Branch'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2-Cards per Row Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* CARD 1: BRANCH IDENTITY & PHOTO */}
          {/* ========================================================================= */}
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
                    placeholder="e.g. South Bay Performance Club"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="GF-SB-05"
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

          {/* ========================================================================= */}
          {/* CARD 2: PHYSICAL ADDRESS */}
          {/* ========================================================================= */}
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
                  placeholder="700 Mission Street"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Suite / Building Bay</label>
                <Input
                  value={suite}
                  onChange={(e) => setSuite(e.target.value)}
                  placeholder="Building 3, Ground Floor"
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
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="94103" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ========================================================================= */}
          {/* CARD 3: MANAGEMENT & CONTACTS */}
          {/* ========================================================================= */}
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
                    placeholder="e.g. Jason Myers"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Manager Email</label>
                  <Input
                    type="email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="j.myers@gymflow.io"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reception Phone</label>
                  <Input
                    value={branchPhone}
                    onChange={(e) => setBranchPhone(e.target.value)}
                    placeholder="+1 (415) 555-0105"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Email</label>
                  <Input
                    type="email"
                    value={branchEmail}
                    onChange={(e) => setBranchEmail(e.target.value)}
                    placeholder="southbay@gymflow.io"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ========================================================================= */}
          {/* CARD 4: SPECIFICATIONS & CAPACITY */}
          {/* ========================================================================= */}
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
                    placeholder="20000"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Max Member Capacity *</label>
                  <Input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="300"
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
                  <label className="text-xs font-semibold text-foreground">Est. Monthly Revenue ($/mo)</label>
                  <Input
                    type="number"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                    placeholder="80000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* CARD 5: SCHEDULE & AMENITIES (FULL WIDTH) */}
        {/* ========================================================================= */}
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
                <Input value={weekdays} onChange={(e) => setWeekdays(e.target.value)} placeholder="05:00 AM – 11:00 PM" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Saturday</label>
                <Input value={saturday} onChange={(e) => setSaturday(e.target.value)} placeholder="06:00 AM – 10:00 PM" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Sunday</label>
                <Input value={sunday} onChange={(e) => setSunday(e.target.value)} placeholder="07:00 AM – 09:00 PM" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Featured Amenities (comma separated)</label>
              <Input
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                placeholder="Olympic Lifting Platforms, Sprint Turf, Sauna, Executive Lockers, Cold Plunge"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/gym-management/branches')}
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
              <span>{loading ? 'Onboarding...' : 'Save & Onboard Branch'}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  );
};
