import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox } from '../../../../shared/components/ui/select';
import { DatePicker } from '../../../../shared/components/ui/datepicker';
import {
  ArrowLeft,
  Save,
  Mail,
  Phone,
  User,
  CreditCard,
  HeartPulse,
  Dumbbell,
  Crown,
  Sparkles,
  Shield,
} from 'lucide-react';
import { memberApi, IMemberItem } from '../api/memberApi';
import { toast } from 'sonner';
import { ImageUpload } from '../../../../shared/components/image-upload';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [member, setMember] = useState<IMemberItem | null>(null);

  // Section 1: Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'>('FEMALE');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Section 2: Membership Details
  const [tier, setTier] = useState<string>('VIP_PLATINUM');
  const [memberStatus, setMemberStatus] = useState<'ACTIVE' | 'FROZEN' | 'EXPIRED' | 'CANCELLED'>('ACTIVE');
  const [autoRenew, setAutoRenew] = useState<boolean>(true);

  // Section 3: Facility & Trainer
  const [trainerName, setTrainerName] = useState('Alex Vance');
  const [lockerNumber, setLockerNumber] = useState('L-104');
  const [rfidTag, setRfidTag] = useState('');

  // Section 4: Emergency Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    setFetching(true);
    try {
      const data = await memberApi.getMemberById(id || 'GF-9284');
      setMember(data);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setGender(data.gender || 'FEMALE');
      setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '1995-04-12');

      setTier(data.membership?.tier || 'VIP_PLATINUM');
      setMemberStatus(data.memberStatus || 'ACTIVE');
      setAutoRenew(data.membership?.autoRenew !== false);

      setTrainerName(data.assignedTrainer?.name || 'Alex Vance');
      setLockerNumber(data.lockerNumber || 'L-104');
      setRfidTag(data.rfidTag || `RFID-${Math.floor(10000 + Math.random() * 90000)}`);

      setEmergencyName(data.emergencyContact?.name || 'Robert Jenkins');
      setEmergencyRelation(data.emergencyContact?.relationship || 'Spouse');
      setEmergencyPhone(data.emergencyContact?.phone || '+1 (555) 839-2041');
    } catch {
      toast.error('Failed to load member profile');
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const priceMap: Record<string, number> = {
      VIP_PLATINUM: 1499,
      GOLD_ANNUAL: 899,
      SILVER_MONTHLY: 89,
      STUDENT_CORPORATE: 59,
      OFF_PEAK: 45,
      CLASS_PACK: 180,
    };

    const payload: Partial<IMemberItem> = {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      memberStatus,
      membership: {
        tier,
        planName: tier.replace(/_/g, ' '),
        price: priceMap[tier] || 899,
        autoRenew,
      },
      assignedTrainer: {
        name: trainerName,
        email: `${trainerName.toLowerCase().replace(/\s+/g, '.')}@gymflow.io`,
      },
      lockerNumber,
      rfidTag,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelation,
        phone: emergencyPhone,
      },
    };

    try {
      await memberApi.updateMember(id || member?.memberCode || 'GF-9284', payload);
      toast.success(`Member profile #${member?.memberCode || id} updated successfully!`, {
        description: `Plan: ${tier.replace(/_/g, ' ')} • Status: ${memberStatus}`,
      });
      navigate(`/member-management/members/${id || member?.memberCode || 'GF-9284'}`);
    } catch (err: any) {
      toast.error('Update failed', {
        description: err.message || 'Could not save changes to MongoDB',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !member) {
    return (
      <PageContainer>
        <div className="py-20 text-center text-muted-foreground text-sm">
          Loading member profile data...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Member: ${member.firstName} ${member.lastName}`}
        subtitle={`Update complete profile, subscription plan, assigned coach, and facility access for ID #${member.memberCode}`}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate(`/member-management/members/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Card 1: Personal & Contact Information */}
          <Card className="border border-border/80 shadow-md">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Personal & Contact Information</span>
              </CardTitle>
              <CardDescription>
                Primary identification and communication coordinates
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <ImageUpload
                label="Member Profile Photo"
                variant="avatar"
                value={avatar}
                onChange={setAvatar}
                helperText="Upload member profile portrait (PNG, JPG, WebP)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phone Number</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="h-4 w-4" />}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectBox
                  label="Gender"
                  value={gender}
                  onChange={(val) => setGender(val as any)}
                  options={[
                    { value: 'FEMALE', label: 'Female' },
                    { value: 'MALE', label: 'Male' },
                    { value: 'OTHER', label: 'Other' },
                    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
                  ]}
                />

                <DatePicker
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={(val) => setDateOfBirth(val)}
                  placeholder="Select birth date..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Membership Plan & Subscription Settings */}
          <Card className="border border-border/80 shadow-md">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-500" />
                <span>Membership Plan & Subscription Tier</span>
              </CardTitle>
              <CardDescription>
                Configure subscription tier, auto-renewal, and member status
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectBox
                  label="Membership Plan Tier"
                  value={tier}
                  onChange={(val) => setTier(val)}
                  options={[
                    { value: 'VIP_PLATINUM', label: 'VIP Platinum All-Access', badge: '$1,499 / yr' },
                    { value: 'GOLD_ANNUAL', label: 'Gold Annual All-Access', badge: '$899 / yr' },
                    { value: 'SILVER_MONTHLY', label: 'Silver Monthly Recurring', badge: '$89 / mo' },
                    { value: 'STUDENT_CORPORATE', label: 'Student & Corporate Pass', badge: '$59 / mo' },
                    { value: 'OFF_PEAK', label: 'Off-Peak Early Bird Pass', badge: '$45 / mo' },
                    { value: 'CLASS_PACK', label: '10-Class Fitness Pack', badge: '$180 pack' },
                  ]}
                />

                <SelectBox
                  label="Membership Status"
                  value={memberStatus}
                  onChange={(val) => setMemberStatus(val as any)}
                  options={[
                    { value: 'ACTIVE', label: '🟢 ACTIVE (Full Gym & Turnstile Access)' },
                    { value: 'FROZEN', label: '🟡 FROZEN (Temporary Pass Hold)' },
                    { value: 'EXPIRED', label: '🔴 EXPIRED (Renewal Required)' },
                    { value: 'CANCELLED', label: '⚪ CANCELLED (Contract Terminated)' },
                  ]}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Automatic Annual/Monthly Renewal</p>
                  <p className="text-[11px] text-muted-foreground">
                    Automatically bill on-file credit card upon pass expiration
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRenew(!autoRenew)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoRenew ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      autoRenew ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Trainer & Gym Facility Allocations */}
          <Card className="border border-border/80 shadow-md">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-purple-500" />
                <span>Coach Allocation & Facility Access</span>
              </CardTitle>
              <CardDescription>
                Assign dedicated coach, smart locker, and turnstile biometric RFID
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectBox
                  label="Assigned Trainer"
                  value={trainerName}
                  onChange={(val) => setTrainerName(val)}
                  options={[
                    { value: 'Alex Vance', label: 'Alex Vance (Master Coach)' },
                    { value: 'Sarah Vance', label: 'Sarah Vance (HIIT Coach)' },
                    { value: 'Marcus Thorne', label: 'Marcus Thorne (CrossFit)' },
                    { value: 'Elena Rostova', label: 'Elena Rostova (Yoga & Pilates)' },
                    { value: 'Unassigned', label: 'Unassigned' },
                  ]}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Smart Locker Assignment</label>
                  <Input
                    value={lockerNumber}
                    onChange={(e) => setLockerNumber(e.target.value)}
                    placeholder="e.g. L-104"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">RFID Card / Access Tag</label>
                  <Input
                    value={rfidTag}
                    onChange={(e) => setRfidTag(e.target.value)}
                    placeholder="e.g. RFID-98214"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Emergency Contacts */}
          <Card className="border border-border/80 shadow-md">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-rose-500" />
                <span>Emergency Contact Coordinates</span>
              </CardTitle>
              <CardDescription>
                Next-of-kin emergency notification contacts
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Contact Full Name</label>
                  <Input
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. Robert Jenkins"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Relationship</label>
                  <Input
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="e.g. Spouse / Parent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Emergency Phone</label>
                  <Input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 border-t border-border pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(`/member-management/members/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 shadow-md shadow-primary/25 bg-primary text-primary-foreground font-semibold"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving to Database...' : 'Save Member Changes'}</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
