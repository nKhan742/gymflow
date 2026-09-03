import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Sparkles, User, Phone, Mail, Calendar, Building2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrialMember } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [passType, setPassType] = useState<ITrialMember['passType']>('3_DAY_TRIAL');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [maxAllowedCheckIns, setMaxAllowedCheckIns] = useState('3');
  const [sponsorTrainer, setSponsorTrainer] = useState('Coach Alex Vance');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('');

  const handlePassTypeChange = (type: ITrialMember['passType']) => {
    setPassType(type);
    const now = Date.now();
    if (type === '1_DAY_PASS') {
      setEndDate(new Date(now + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
      setMaxAllowedCheckIns('1');
    } else if (type === '3_DAY_TRIAL') {
      setEndDate(new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
      setMaxAllowedCheckIns('3');
    } else if (type === '7_DAY_EXPERIENCE') {
      setEndDate(new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
      setMaxAllowedCheckIns('7');
    } else if (type === 'WEEKEND_WARRIOR') {
      setEndDate(new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
      setMaxAllowedCheckIns('2');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `TRL-${Math.floor(100 + Math.random() * 900)}`;
    const passCode = `VIP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTrial: ITrialMember = {
      id: newId,
      _id: newId,
      guestName,
      email,
      phone,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      passCode,
      passType,
      startDate,
      endDate,
      maxAllowedCheckIns: Number(maxAllowedCheckIns) || 3,
      checkInCount: 0,
      sponsorTrainer,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      status: 'ACTIVE',
      amenitiesIncluded: ['Gym Floor', 'Locker Room', 'Group Studio', 'Recovery Lounge'],
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Local storage cache for instant reactivity
      const stored = localStorage.getItem('gymflow_custom_trial_members');
      const customList: ITrialMember[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newTrial);
      localStorage.setItem('gymflow_custom_trial_members', JSON.stringify(filtered));

      // 2. Fallback to API
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/trial-members', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrial),
      }).catch(() => {});

      toast.success(`VIP Trial Pass "${passCode}" issued for ${guestName}!`, {
        description: `Pass Type: ${passType.replace(/_/g, ' ')} • Max Entries: ${maxAllowedCheckIns}`,
      });
      navigate('/crm/trial-members');
    } catch {
      toast.error('Failed to issue trial pass');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Issue VIP Trial Pass"
        subtitle="Provision temporary gym access passport with turnstile entry limits and coach assignment."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/trial-members')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Passports</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Guest Identity & Photo */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Guest Identity & Contact Details
              </CardTitle>
              <CardDescription>
                Essential information for turnstile identification and liability logging.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Guest Photo</label>
                  <ImageUpload
                    value={avatarUrl}
                    onChange={(url) => setAvatarUrl(url)}
                    variant="avatar"
                    helperText="Upload guest avatar for turnstile scan"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Guest Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Jordan Hayes"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-emerald-500" /> Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="+1 (555) 621-9988"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3 text-primary" /> Email Address <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="jordan.h@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Passport Parameters & Duration */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Trial Pass Parameters & Access Window
              </CardTitle>
              <CardDescription>
                Define validity timeline, turnstile entry quotas, and sponsoring representative.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">VIP Pass Package</label>
                  <Select value={passType} onValueChange={(val) => handlePassTypeChange(val as ITrialMember['passType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Pass Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_DAY_PASS">🎟️ 1-Day Guest Pass</SelectItem>
                      <SelectItem value="3_DAY_TRIAL">✨ 3-Day Experience Trial</SelectItem>
                      <SelectItem value="7_DAY_EXPERIENCE">🔥 7-Day All-Access Passport</SelectItem>
                      <SelectItem value="WEEKEND_WARRIOR">⚡ Weekend Warrior (Sat-Sun)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-emerald-500" /> Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-rose-500" /> Expiration Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-primary" /> Turnstile Check-In Quota
                  </label>
                  <Input
                    type="number"
                    value={maxAllowedCheckIns}
                    onChange={(e) => setMaxAllowedCheckIns(e.target.value)}
                    placeholder="3"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Sponsoring Coach / Rep</label>
                  <Select value={sponsorTrainer} onValueChange={setSponsorTrainer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sponsor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Coach Alex Vance">Coach Alex Vance (Head PT)</SelectItem>
                      <SelectItem value="Sarah Jenkins">Sarah Jenkins (Tour Coordinator)</SelectItem>
                      <SelectItem value="Marcus Brody">Marcus Brody (Strength Coach)</SelectItem>
                      <SelectItem value="Elena Rostova">Elena Rostova (VIP Director)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Assigned Club Location
                  </label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Pass Conditions & Staff Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. Free locker padlock issued. Interested in sauna and lap pool..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Turnstile Code: <strong className="font-mono text-primary font-bold">Auto-generated upon save</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/trial-members')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Issue VIP Trial Pass</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
