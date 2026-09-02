import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Gift, User, Phone, Mail, Award, Building2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IReferral } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Referrer state (Existing Member)
  const [referrerName, setReferrerName] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [referrerAvatar, setReferrerAvatar] = useState<string | undefined>(undefined);

  // Prospect state (Referred Friend)
  const [referredProspectName, setReferredProspectName] = useState('');
  const [referredProspectEmail, setReferredProspectEmail] = useState('');
  const [referredProspectPhone, setReferredProspectPhone] = useState('');
  const [referredProspectAvatar, setReferredProspectAvatar] = useState<string | undefined>(undefined);

  // Reward and details
  const [referralCode, setReferralCode] = useState(`REF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [rewardType, setRewardType] = useState<IReferral['rewardType']>('FREE_MONTH');
  const [rewardValue, setRewardValue] = useState('1 Month Free Membership ($89 value)');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `REF-${Math.floor(100 + Math.random() * 900)}`;

    const newReferral: IReferral = {
      id: newId,
      _id: newId,
      referrerName,
      referrerEmail,
      referrerPhone,
      referrerAvatar: referrerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      referredProspectName,
      referredProspectEmail,
      referredProspectPhone,
      referredProspectAvatar: referredProspectAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      referralCode,
      rewardType,
      rewardValue,
      rewardStatus: 'PENDING_QUALIFICATION',
      status: 'INVITED',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_referrals');
      const customList: IReferral[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newReferral);
      localStorage.setItem('gymflow_custom_referrals', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/referrals', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReferral),
      }).catch(() => {});

      toast.success(`Referral logged: ${referrerName} → ${referredProspectName}!`, {
        description: `Reward: ${rewardValue} • Code: ${referralCode}`,
      });
      navigate('/crm/referrals');
    } catch {
      toast.error('Failed to log referral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Log Member Referral"
        subtitle="Track peer-to-peer advocate referrals, rewards qualification, and friend guest enrollment."
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reward Incentive Type</label>
                  <Select value={rewardType} onValueChange={(val) => setRewardType(val as IReferral['rewardType'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Reward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE_MONTH">🎁 1 Month Free Dues</SelectItem>
                      <SelectItem value="CASH_CREDIT">💵 $50 Account Credit</SelectItem>
                      <SelectItem value="PT_SESSION_PACK">🏋️ Free 1-on-1 PT Session</SelectItem>
                      <SelectItem value="VIP_SWAG_BOX">📦 Premium GymFlow Swag Kit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3 text-primary" /> Tracking Referral Code
                  </label>
                  <Input
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    required
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
                <label className="text-xs font-semibold text-foreground">Reward Value Description</label>
                <Input
                  value={rewardValue}
                  onChange={(e) => setRewardValue(e.target.value)}
                  placeholder="e.g. 1 Month Free Membership ($89 value)"
                />
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
                Incentive: <strong className="text-purple-600 font-semibold">{rewardValue}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/referrals')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Log Referral</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
