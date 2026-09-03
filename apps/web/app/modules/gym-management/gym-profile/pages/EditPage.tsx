import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Globe,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Layers,
  Upload,
  Camera,
  Trash2,
  Fingerprint,
  HeartPulse,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { IGymProfile } from '../types';

const CURRENCY_OPTIONS: ISelectOption[] = [
  { value: 'USD', label: 'USD ($) - US Dollar' },
  { value: 'EUR', label: 'EUR (€) - Euro' },
  { value: 'GBP', label: 'GBP (£) - British Pound' },
  { value: 'CAD', label: 'CAD ($) - Canadian Dollar' },
  { value: 'AUD', label: 'AUD ($) - Australian Dollar' },
  { value: 'INR', label: 'INR (₹) - Indian Rupee' },
  { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState(true);

  // Section 1: Core Brand Identity
  const [name, setName] = useState('GymFlow Flagship Performance Club');
  const [code, setCode] = useState('GF-FLAGSHIP-01');
  const [tagline, setTagline] = useState('Elite strength & conditioning, science-backed recovery, and premium coaching.');
  const [description, setDescription] = useState('World-class 35,000 sq ft athletic facility.');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&auto=format&fit=crop&q=80');
  const [foundedYear, setFoundedYear] = useState('2021');
  const [maxCapacity, setMaxCapacity] = useState('450');

  // Section 2: Address & Location
  const [street, setStreet] = useState('100 Performance Way, Suite 400');
  const [suite, setSuite] = useState('Main Campus & Bay 2');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94107');
  const [country, setCountry] = useState('United States');
  const [latitude, setLatitude] = useState('37.7749');
  const [longitude, setLongitude] = useState('-122.4194');

  // Section 3: Contact Lines
  const [phone, setPhone] = useState('+1 (415) 555-8900');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (415) 555-9110');
  const [email, setEmail] = useState('contact@gymflow.io');
  const [website, setWebsite] = useState('https://gymflow.io');

  // Section 4: Operating Hours
  const [weekdays, setWeekdays] = useState('05:00 AM – 11:00 PM');
  const [saturday, setSaturday] = useState('06:00 AM – 10:00 PM');
  const [sunday, setSunday] = useState('07:00 AM – 09:00 PM');
  const [holidayNotes, setHolidayNotes] = useState('Special Holiday Timings: 08:00 AM – 04:00 PM (Closed Christmas Day)');

  // Section 5: Billing & Tax
  const [currency, setCurrency] = useState('USD');
  const [defaultTaxRate, setDefaultTaxRate] = useState('8.25');
  const [taxId, setTaxId] = useState('US-EIN-98421940');
  const [businessLicense, setBusinessLicense] = useState('BL-CA-2026-89412');
  const [invoiceHeader, setInvoiceHeader] = useState('GymFlow Flagship Inc. • 100 Performance Way');
  const [invoiceFooter, setInvoiceFooter] = useState('Thank you for choosing GymFlow.');

  // Section 6: Amenities & Access Control
  const [amenitiesInput, setAmenitiesInput] = useState('Finnish Dry Sauna, Eucalyptus Steam Room, Cold Plunge Cryo Pool, Smoothie Bar, Executive Lockers');
  const [turnstileType, setTurnstileType] = useState('Biometric Facial Scan & RFID Turnstiles');
  const [gateCount, setGateCount] = useState('4');
  const [aedLocation, setAedLocation] = useState('Turnstile Entry & Level 2 Cardio Hub');

  useEffect(() => {
    loadGymData();
  }, [id]);

  const applyProfileData = (data: IGymProfile) => {
    if (!data) return;
    if (data.name) setName(data.name);
    if (data.code) setCode(data.code);
    if (data.tagline) setTagline(data.tagline);
    if (data.description) setDescription(data.description);
    if (data.logo) setLogo(data.logo);
    if (data.coverImage) setCoverImage(data.coverImage);
    if (data.foundedYear) setFoundedYear(data.foundedYear.toString());
    if (data.maxCapacity) setMaxCapacity(data.maxCapacity.toString());

    if (data.address) {
      if (data.address.street !== undefined) setStreet(data.address.street || '');
      if (data.address.suite !== undefined) setSuite(data.address.suite || '');
      if (data.address.city !== undefined) setCity(data.address.city || '');
      if (data.address.state !== undefined) setState(data.address.state || '');
      if (data.address.postalCode !== undefined) setPostalCode(data.address.postalCode || '');
      if (data.address.country !== undefined) setCountry(data.address.country || 'United States');
      if (data.address.latitude !== undefined) setLatitude(data.address.latitude.toString());
      if (data.address.longitude !== undefined) setLongitude(data.address.longitude.toString());
    }

    if (data.contacts) {
      if (data.contacts.phone !== undefined) setPhone(data.contacts.phone || '');
      if (data.contacts.emergencyPhone !== undefined) setEmergencyPhone(data.contacts.emergencyPhone || '');
      if (data.contacts.email !== undefined) setEmail(data.contacts.email || '');
      if (data.contacts.website !== undefined) setWebsite(data.contacts.website || '');
    }

    if (data.operatingHours) {
      if (data.operatingHours.weekdays !== undefined) setWeekdays(data.operatingHours.weekdays || '');
      if (data.operatingHours.saturday !== undefined) setSaturday(data.operatingHours.saturday || '');
      if (data.operatingHours.sunday !== undefined) setSunday(data.operatingHours.sunday || '');
      if (data.operatingHours.holidayNotes !== undefined) setHolidayNotes(data.operatingHours.holidayNotes || '');
    }

    if (data.currency) setCurrency(data.currency);
    if (data.defaultTaxRate !== undefined) setDefaultTaxRate(data.defaultTaxRate.toString());
    if (data.taxId !== undefined) setTaxId(data.taxId);
    if (data.businessLicense !== undefined) setBusinessLicense(data.businessLicense);
    if (data.invoiceHeader !== undefined) setInvoiceHeader(data.invoiceHeader);
    if (data.invoiceFooter !== undefined) setInvoiceFooter(data.invoiceFooter);

    if (data.amenities && Array.isArray(data.amenities)) {
      setAmenitiesInput(data.amenities.join(', '));
    }

    if (data.accessControl) {
      if (data.accessControl.turnstileType !== undefined) setTurnstileType(data.accessControl.turnstileType);
      if (data.accessControl.gateCount !== undefined) setGateCount(data.accessControl.gateCount.toString());
      if (data.accessControl.aedLocation !== undefined) setAedLocation(data.accessControl.aedLocation);
    }
  };

  const loadGymData = async () => {
    setFetching(true);
    try {
      const local = localStorage.getItem('gymflow_custom_gym_profile');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          applyProfileData(parsed);
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
          applyProfileData(data);
          localStorage.setItem('gymflow_custom_gym_profile', JSON.stringify(data));
        }
      }
    } catch {
      // Keep defaults
    } finally {
      setFetching(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        toast.success('Gym logo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        toast.success('Cover image updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: IGymProfile = {
        name,
        code,
        tagline,
        description,
        logo,
        coverImage,
        foundedYear: Number(foundedYear) || 2021,
        maxCapacity: Number(maxCapacity) || 450,
        address: {
          street,
          suite,
          city,
          state,
          postalCode,
          country,
          latitude: Number(latitude) || 37.7749,
          longitude: Number(longitude) || -122.4194,
        },
        contacts: {
          phone,
          emergencyPhone,
          email,
          website,
        },
        operatingHours: {
          weekdays,
          saturday,
          sunday,
          holidayNotes,
        },
        currency,
        defaultTaxRate: Number(defaultTaxRate) || 8.25,
        taxId,
        businessLicense,
        invoiceHeader,
        invoiceFooter,
        amenities: amenitiesInput.split(',').map((s) => s.trim()).filter(Boolean),
        accessControl: {
          turnstileType,
          gateCount: Number(gateCount) || 4,
          aedLocation,
          cctvActive: true,
        },
      };

      localStorage.setItem('gymflow_custom_gym_profile', JSON.stringify(payload));
      window.dispatchEvent(new Event('gymflow_profile_updated'));

      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/gym-profile', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success('Gym Profile updated successfully!');
      navigate('/gym-management/gym-profile');
    } catch {
      toast.error('Network error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Edit Gym & Facility Profile"
        subtitle="Configure physical club details, upload brand identity assets, set operating hours, and customize billing parameters."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/gym-management/gym-profile')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              disabled={loading}
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* 2-Cards per Row Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* CARD 1: CORE BRAND IDENTITY & PHOTO UPLOADS */}
          {/* ========================================================================= */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                1. Core Brand & Visual Identity
              </CardTitle>
              <CardDescription className="text-xs">Upload club logo, cover banner, and define brand motto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              {/* Photo Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload
                  label="Club Official Logo"
                  variant="avatar"
                  value={logo}
                  onChange={setLogo}
                  helperText="Square icon (PNG, JPG, WebP)"
                />

                <ImageUpload
                  label="Gym Facade & Hero Banner"
                  variant="thumbnail"
                  value={coverImage}
                  onChange={setCoverImage}
                  helperText="High-res club facade (PNG, JPG, WebP)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Gym / Facility Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. GymFlow Flagship"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Facility Code *</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="GF-FLAGSHIP-01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Founded Year</label>
                  <Input
                    type="number"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    placeholder="2021"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Max Member Capacity</label>
                  <Input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="450"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tagline & Motto</label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Elite strength & conditioning..."
                />
              </div>
            </CardContent>
          </Card>

          {/* ========================================================================= */}
          {/* CARD 2: PHYSICAL ADDRESS & CONTACTS */}
          {/* ========================================================================= */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                2. Location & Contact Endpoints
              </CardTitle>
              <CardDescription className="text-xs">Physical street address and customer communication lines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Street Address *</label>
                <Input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="100 Performance Way"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="San Francisco" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">State / Region</label>
                  <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="CA" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Postal Code</label>
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="94107" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Front Desk Phone *</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (415) 555-8900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Emergency Hotline</label>
                  <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="+1 (415) 555-9110" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">General Email *</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@gymflow.io" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Official Website</label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://gymflow.io" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ========================================================================= */}
          {/* CARD 3: OPERATING HOURS SCHEDULE */}
          {/* ========================================================================= */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                3. Operational Hours & Schedules
              </CardTitle>
              <CardDescription className="text-xs">Turnstile gate operational windows and weekend schedules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Weekdays (Mon – Fri) *</label>
                <Input value={weekdays} onChange={(e) => setWeekdays(e.target.value)} placeholder="05:00 AM – 11:00 PM" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="text-xs font-semibold text-foreground">Holiday Schedule Notes</label>
                <Input value={holidayNotes} onChange={(e) => setHolidayNotes(e.target.value)} placeholder="Closed Christmas Day..." />
              </div>
            </CardContent>
          </Card>

          {/* ========================================================================= */}
          {/* CARD 4: BILLING, CURRENCY & TAX CONFIG */}
          {/* ========================================================================= */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                4. Billing, Currency & Tax Settings
              </CardTitle>
              <CardDescription className="text-xs">Financial rates applied to member subscriptions and invoices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectBox
                  label="Base Currency *"
                  options={CURRENCY_OPTIONS}
                  value={currency}
                  onChange={(val) => setCurrency(val)}
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Default Sales Tax Rate (%) *</label>
                  <Input
                    type="number"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(e.target.value)}
                    placeholder="8.25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Tax Registration EIN</label>
                  <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="US-EIN-98421940" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Commercial License #</label>
                  <Input value={businessLicense} onChange={(e) => setBusinessLicense(e.target.value)} placeholder="BL-CA-2026-89412" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Invoice Header Note</label>
                <Input value={invoiceHeader} onChange={(e) => setInvoiceHeader(e.target.value)} placeholder="GymFlow Flagship Inc." />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* CARD 5: AMENITIES & ACCESS CONTROL (FULL WIDTH) */}
        {/* ========================================================================= */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
              5. Amenities, Biometrics & Life Safety
            </CardTitle>
            <CardDescription className="text-xs">Turnstile gate types, emergency AED hardware, and member amenities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Member Amenities (comma separated)</label>
              <Input
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                placeholder="Finnish Sauna, Eucalyptus Steam, Cold Plunge, Towel Service, Locker Rooms"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Turnstile Type</label>
                <Input value={turnstileType} onChange={(e) => setTurnstileType(e.target.value)} placeholder="Biometric & RFID Turnstiles" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Active Turnstile Lanes</label>
                <Input type="number" value={gateCount} onChange={(e) => setGateCount(e.target.value)} placeholder="4" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">AED Defibrillator Location</label>
                <Input value={aedLocation} onChange={(e) => setAedLocation(e.target.value)} placeholder="Turnstile Entry" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/gym-management/gym-profile')}
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
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  );
};
