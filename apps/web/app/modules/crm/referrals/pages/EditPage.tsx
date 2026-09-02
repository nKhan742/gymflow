import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Gift, User, Phone, Mail, Award, Building2, Tag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IReferral } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Referrer state
  const [referrerName, setReferrerName] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [referrerAvatar, setReferrerAvatar] = useState<string | undefined>(undefined);

  // Prospect state
  const [referredProspectName, setReferredProspectName] = useState('');
  const [referredProspectEmail, setReferredProspectEmail] = useState('');
  const [referredProspectPhone, setReferredProspectPhone] = useState('');
  const [referredProspectAvatar, setReferredProspectAvatar] = useState<string | undefined>(undefined);

  // Referral details
  const [referralCode, setReferralCode] = useState('REF-9281');
  const [rewardType, setRewardType] = useState<IReferral['rewardType']>('FREE_MONTH');
  const [rewardValue, setRewardValue] = useState('1 Month Free Dues ($89 Value)');
  const [rewardStatus, setRewardStatus] = useState<IReferral['rewardStatus']>('APPROVED_ISSUED');
  const [status, setStatus] = useState<IReferral['status']>('CONVERTED_MEMBER');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadReferral();
  }, [id]);

  const loadReferral = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_referrals');
      if (stored) {
        const customList: IReferral[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/referrals/${id}`, {
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

    populateFields({
      id: id || 'REF-601',
      _id: id || 'REF-601',
      referrerName: 'Rachel Green',
      referrerEmail: 'rachel.g@example.com',
      referrerPhone: '+1 (555) 345-6789',
      referrerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      referredProspectName: 'Monica Geller',
      referredProspectEmail: 'monica.g@example.com',
      referredProspectPhone: '+1 (555) 789-0123',
      referredProspectAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      referralCode: 'REF-9281',
      rewardType: 'FREE_MONTH',
      rewardValue: '1 Month Free Dues ($89 Value)',
      rewardStatus: 'APPROVED_ISSUED',
      status: 'CONVERTED_MEMBER',
      branchName: 'Main Facility',
      notes: 'Enrolled in Gold 12-Month plan after touring with Rachel.',
      createdAt: '2026-08-20T08:00:00.000Z',
      updatedAt: '2026-08-29T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (referral: IReferral) => {
    setReferrerName(referral.referrerName || '');
    setReferrerEmail(referral.referrerEmail || '');
    setReferrerPhone(referral.referrerPhone || '');
    setReferrerAvatar(referral.referrerAvatar);
    setReferredProspectName(referral.referredProspectName || '');
    setReferredProspectEmail(referral.referredProspectEmail || '');
    setReferredProspectPhone(referral.referredProspectPhone || '');
    setReferredProspectAvatar(referral.referredProspectAvatar);
    setReferralCode(referral.referralCode || 'REF-9281');
    setRewardType(referral.rewardType || 'FREE_MONTH');
    setRewardValue(referral.rewardValue || '1 Month Free Dues');
    setRewardStatus(referral.rewardStatus || 'APPROVED_ISSUED');
    setStatus(referral.status || 'CONVERTED_MEMBER');
    if (referral.branchId) setBranchId(referral.branchId);
    setNotes(referral.notes || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedReferral: Partial<IReferral> = {
      referrerName,
      referrerEmail,
      referrerPhone,
      referrerAvatar,
      referredProspectName,
      referredProspectEmail,
      referredProspectPhone,
      referredProspectAvatar,
      referralCode,
      rewardType,
      rewardValue,
      rewardStatus,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      notes,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_referrals');
      if (stored) {
        const customList: IReferral[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedReferral } as IReferral;
          localStorage.setItem('gymflow_custom_referrals', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'REF-601', ...updatedReferral } as IReferral);
          localStorage.setItem('gymflow_custom_referrals', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/crm/referrals/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReferral),
      }).catch(() => {});

      toast.success(`Referral record updated successfully!`);
      navigate('/crm/referrals');
    } catch {
      toast.error('Failed to update referral');
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
        title={`Edit Referral: ${referrerName} → ${referredProspectName}`}
        subtitle={`Modify advocate parameters, friend contact, and reward payout qualification`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/referrals')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Referrals</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Existing Member Referrer */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-500" />
                Existing Member (The Referrer Advocate)
              </CardTitle>
              <CardDescription>
                Member who referred their friend or family member.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Member Avatar</label>
                  <ImageUpload
                    value={referrerAvatar}
                    onChange={(url) => setReferrerAvatar(url)}
                    variant="avatar"
                    helperText="Upload member photo"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Member Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Rachel Green"
                      value={referrerName}
                      onChange={(e) => setReferrerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-emerald-500" /> Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="+1 (555) 345-6789"
                        value={referrerPhone}
                        onChange={(e) => setReferrerPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3 text-primary" /> Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="rachel.g@example.com"
                        value={referrerEmail}
                        onChange={(e) => setReferrerEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Referred Prospect (The Friend) */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Referred Friend (The Prospect)
              </CardTitle>
              <CardDescription>
                Prospective member being introduced to GymFlow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Prospect Avatar</label>
                  <ImageUpload
                    value={referredProspectAvatar}
                    onChange={(url) => setReferredProspectAvatar(url)}
                    variant="avatar"
                    helperText="Upload prospect photo"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Prospect Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Monica Geller"
                      value={referredProspectName}
                      onChange={(e) => setReferredProspectName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-emerald-500" /> Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="+1 (555) 789-0123"
                        value={referredProspectPhone}
                        onChange={(e) => setReferredProspectPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3 text-primary" /> Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="monica.g@example.com"
                        value={referredProspectEmail}
                        onChange={(e) => setReferredProspectEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Reward Incentive & Code */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="h-4 w-4 text-purple-500" />
                Referral Reward Incentive & Code
              </CardTitle>
              <CardDescription>
                Incentive payout triggered when the friend successfully enrolls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reward Type</label>
                  <Select value={rewardType} onValueChange={(val) => setRewardType(val as IReferral['rewardType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Reward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE_MONTH">🎁 1 Month Free</SelectItem>
                      <SelectItem value="CASH_CREDIT">💵 Account Credit</SelectItem>
                      <SelectItem value="PT_SESSION_PACK">🏋️ PT Session Pack</SelectItem>
                      <SelectItem value="VIP_SWAG_BOX">📦 VIP Swag Kit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reward Status</label>
                  <Select value={rewardStatus} onValueChange={(val) => setRewardStatus(val as IReferral['rewardStatus'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING_QUALIFICATION">🟡 Pending</SelectItem>
                      <SelectItem value="APPROVED_ISSUED">🟢 Approved & Issued</SelectItem>
                      <SelectItem value="REDEEMED">🔵 Redeemed</SelectItem>
                      <SelectItem value="EXPIRED">🔴 Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Prospect Stage</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IReferral['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INVITED">✉️ Invited</SelectItem>
                      <SelectItem value="TOUR_BOOKED">📅 Tour Booked</SelectItem>
                      <SelectItem value="CONVERTED_MEMBER">🎉 Converted Member</SelectItem>
                      <SelectItem value="UNRESPONSIVE">⚪ Unresponsive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3 text-primary" /> Tracking Code
                  </label>
                  <Input
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reward Value Description</label>
                  <Input
                    value={rewardValue}
                    onChange={(e) => setRewardValue(e.target.value)}
                    placeholder="e.g. 1 Month Free Membership ($89 value)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Branch
                  </label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
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
                <label className="text-xs font-semibold text-foreground">Referral Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Notes on who made the introduction or preferred workout times..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Referral ID: <strong className="font-mono text-foreground">{id || 'REF-601'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/referrals')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Referral</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
