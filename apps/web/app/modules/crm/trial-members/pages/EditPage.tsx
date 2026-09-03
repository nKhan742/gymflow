import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Sparkles, User, Phone, Mail, Calendar, Building2, QrCode } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ITrialMember } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [passCode, setPassCode] = useState('VIP-4921');
  const [passType, setPassType] = useState<ITrialMember['passType']>('3_DAY_TRIAL');
  const [startDate, setStartDate] = useState('2026-08-27');
  const [endDate, setEndDate] = useState('2026-08-30');
  const [maxAllowedCheckIns, setMaxAllowedCheckIns] = useState('3');
  const [checkInCount, setCheckInCount] = useState('0');
  const [sponsorTrainer, setSponsorTrainer] = useState('Coach Alex Vance');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [status, setStatus] = useState<ITrialMember['status']>('ACTIVE');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadTrial();
  }, [id]);

  const loadTrial = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_trial_members');
      if (stored) {
        const customList: ITrialMember[] = JSON.parse(stored);
        const match = customList.find((t) => (t.id || t._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/trial-members/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    // Fallback default
    populateFields({
      id: id || 'TRL-101',
      _id: id || 'TRL-101',
      guestName: 'Jordan Hayes',
      email: 'jordan.h@example.com',
      phone: '+1 (555) 621-9988',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      passCode: 'VIP-4921',
      passType: '3_DAY_TRIAL',
      startDate: '2026-08-27',
      endDate: '2026-08-30',
      maxAllowedCheckIns: 3,
      checkInCount: 2,
      sponsorTrainer: 'Coach Alex Vance',
      branchName: 'Main Facility',
      status: 'ACTIVE',
      amenitiesIncluded: ['Gym Floor', 'Locker Room', 'Group Studio'],
      notes: 'Interested in sauna and hypertrophy weights.',
      createdAt: '2026-08-27T08:00:00.000Z',
      updatedAt: '2026-08-27T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (trial: ITrialMember) => {
    setGuestName(trial.guestName || '');
    setEmail(trial.email || '');
    setPhone(trial.phone || '');
    setAvatarUrl(trial.avatarUrl);
    setPassCode(trial.passCode || 'VIP-4921');
    setPassType(trial.passType || '3_DAY_TRIAL');
    setStartDate(trial.startDate || '2026-08-27');
    setEndDate(trial.endDate || '2026-08-30');
    setMaxAllowedCheckIns(String(trial.maxAllowedCheckIns || 3));
    setCheckInCount(String(trial.checkInCount || 0));
    setSponsorTrainer(trial.sponsorTrainer || 'Coach Alex Vance');
    if (trial.branchId) setBranchId(trial.branchId);
    setStatus(trial.status || 'ACTIVE');
    setNotes(trial.notes || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedTrial: Partial<ITrialMember> = {
      guestName,
      email,
      phone,
      avatarUrl,
      passCode,
      passType,
      startDate,
      endDate,
      maxAllowedCheckIns: Number(maxAllowedCheckIns) || 3,
      checkInCount: Number(checkInCount) || 0,
      sponsorTrainer,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      status,
      notes,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_trial_members');
      if (stored) {
        const customList: ITrialMember[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedTrial } as ITrialMember;
          localStorage.setItem('gymflow_custom_trial_members', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'TRL-101', ...updatedTrial } as ITrialMember);
          localStorage.setItem('gymflow_custom_trial_members', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/trial-members/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTrial),
      }).catch(() => {});

      toast.success(`VIP Trial Pass "${passCode}" updated successfully!`);
      navigate('/crm/trial-members');
    } catch {
      toast.error('Failed to update trial pass');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit VIP Trial Pass: ${guestName}`}
        subtitle={`Modify pass parameters and turnstile quotas for #${passCode}`}
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
                Trial Pass Parameters & Status
              </CardTitle>
              <CardDescription>
                Adjust validity window, check-in count, and pass status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">VIP Pass Package</label>
                  <Select value={passType} onValueChange={(val) => setPassType(val as ITrialMember['passType'])}>
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

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-primary" /> Used Entries
                  </label>
                  <Input
                    type="number"
                    value={checkInCount}
                    onChange={(e) => setCheckInCount(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Max Allowed Entries</label>
                  <Input
                    type="number"
                    value={maxAllowedCheckIns}
                    onChange={(e) => setMaxAllowedCheckIns(e.target.value)}
                    placeholder="3"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Passport Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as ITrialMember['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active</SelectItem>
                      <SelectItem value="EXPIRED">🟡 Expired</SelectItem>
                      <SelectItem value="CONVERTED">🎉 Converted to Member</SelectItem>
                      <SelectItem value="CANCELLED">🔴 Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Sponsoring Coach</label>
                  <Select value={sponsorTrainer} onValueChange={setSponsorTrainer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sponsor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Coach Alex Vance">Coach Alex Vance</SelectItem>
                      <SelectItem value="Sarah Jenkins">Sarah Jenkins</SelectItem>
                      <SelectItem value="Marcus Brody">Marcus Brody</SelectItem>
                      <SelectItem value="Elena Rostova">Elena Rostova</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Pass Conditions & Staff Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Record guest workout interests, feedback, or follow-up milestones..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Pass Code: <strong className="font-mono text-foreground">{passCode}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/trial-members')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Trial Pass</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
