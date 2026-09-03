import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { SelectBox, ISelectOption } from '../../../../shared/components/ui/select';
import {
  ArrowLeft,
  Save,
  Handshake,
  DollarSign,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IPersonalTrainingPackage } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const MEMBER_OPTIONS: ISelectOption[] = [
  { value: 'MEM-001', label: '👤 Sophia Sterling (MEM-001)' },
  { value: 'MEM-002', label: '👤 Alexander Wright (MEM-002)' },
  { value: 'MEM-003', label: '👤 Isabella Rodriguez (MEM-003)' },
  { value: 'MEM-004', label: '👤 Liam O’Connor (MEM-004)' },
  { value: 'MEM-005', label: '👤 David Kim (MEM-005)' },
];

const COACH_OPTIONS: ISelectOption[] = [
  { value: 'STF-001', label: '🏋️ Marcus Aurelius Vance (Head PT)' },
  { value: 'STF-002', label: '✨ Elena Rostova (Group Studio Lead)' },
  { value: 'STF-003', label: '💪 Damon Walker (Strength Coach)' },
  { value: 'STF-004', label: '🥊 Gabriel Santos (Boxing Specialist)' },
];

const TIER_OPTIONS: ISelectOption[] = [
  { value: 'TIER_10_SESSIONS', label: '🔟 10-Session Starter Pack' },
  { value: 'TIER_20_SESSIONS', label: '🥈 20-Session Transformation Pack' },
  { value: 'TIER_50_SESSIONS', label: '🥇 50-Session Athlete Master Pack' },
  { value: 'VIP_UNLIMITED', label: '👑 VIP Unlimited Monthly Private PT' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);

  // Section 1: Client & Coach
  const [memberId, setMemberId] = useState('MEM-001');
  const [coachId, setCoachId] = useState('STF-001');
  const [packageTier, setPackageTier] = useState<any>('TIER_20_SESSIONS');

  // Section 2: Pricing
  const [totalSessionsPurchased, setTotalSessionsPurchased] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [commissionPercentage, setCommissionPercentage] = useState(60);

  // Section 3: Dates & Notes
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [branchId, setBranchId] = useState('ALL');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const totalPackagePrice = totalSessionsPurchased * hourlyRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedMember = MEMBER_OPTIONS.find((m) => m.value === memberId)?.label?.replace('👤 ', '') || 'Member';
    const selectedCoach = COACH_OPTIONS.find((c) => c.value === coachId)?.label?.split(' (')[0]?.replace('🏋️ ', '')?.replace('✨ ', '')?.replace('💪 ', '')?.replace('🥊 ', '') || 'Coach';

    const newId = `PT-PKG-${Math.floor(100 + Math.random() * 900)}`;
    const payload: IPersonalTrainingPackage = {
      id: newId,
      _id: newId,
      packageCode: newId,
      memberId,
      memberName: selectedMember.split(' (')[0],
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      memberEmail: `${memberId.toLowerCase()}@example.com`,
      coachId,
      coachName: selectedCoach,
      packageTier,
      totalSessionsPurchased: Number(totalSessionsPurchased),
      sessionsCompleted: 0,
      sessionsRemaining: Number(totalSessionsPurchased),
      hourlyRate: Number(hourlyRate),
      totalPackagePrice,
      commissionPercentage: Number(commissionPercentage),
      startDate,
      expiryDate,
      status: 'ACTIVE',
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      notes,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_personal_training');
      const customList: IPersonalTrainingPackage[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((p) => p.id !== newId && p.packageCode !== newId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_personal_training', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/fitness/personal-training', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`PT Package created for ${selectedMember.split(' (')[0]}!`);
      navigate(`/fitness/personal-training/${newId}`);
    } catch {
      toast.error('Error saving PT package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Enroll Personal Training Package"
        subtitle="Provision a 1-on-1 private coaching package, calculate trainer commissions, and establish session validity windows."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/personal-training')}
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
              <span>{loading ? 'Creating...' : 'Enroll Package'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: CLIENT & COACH MATCH */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Handshake className="h-4 w-4 text-primary" />
                1. Client & Supervising Coach Match
              </CardTitle>
              <CardDescription className="text-xs">Trainee and trainer pairing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select Gym Member</label>
                <SelectBox
                  options={MEMBER_OPTIONS}
                  value={memberId}
                  onChange={setMemberId}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assigned Personal Trainer</label>
                  <SelectBox
                    options={COACH_OPTIONS}
                    value={coachId}
                    onChange={setCoachId}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Package Tier</label>
                  <SelectBox
                    options={TIER_OPTIONS}
                    value={packageTier}
                    onChange={(val) => {
                      setPackageTier(val as any);
                      if (val === 'TIER_10_SESSIONS') setTotalSessionsPurchased(10);
                      if (val === 'TIER_20_SESSIONS') setTotalSessionsPurchased(20);
                      if (val === 'TIER_50_SESSIONS') setTotalSessionsPurchased(50);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: FINANCIALS & SESSIONS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                2. Session Bank & Financials
              </CardTitle>
              <CardDescription className="text-xs">Hourly rates and commissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Sessions Bank</label>
                  <Input
                    type="number"
                    value={totalSessionsPurchased}
                    onChange={(e) => setTotalSessionsPurchased(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Hourly Rate ($ / hr)</label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Package Value</label>
                  <div className="h-10 px-3 py-2 rounded-md bg-muted font-mono font-bold text-sm text-foreground flex items-center">
                    ${totalPackagePrice.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Coach Commission (%)</label>
                  <Input
                    type="number"
                    value={commissionPercentage}
                    onChange={(e) => setCommissionPercentage(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: VALIDITY WINDOWS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                3. Validity & Branch Scope
              </CardTitle>
              <CardDescription className="text-xs">Expiry period and location context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Expiry Date</label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Branch Scope</label>
                  <SelectBox
                    options={branchOptions}
                    value={branchId}
                    onChange={setBranchId}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Client Contract Notes</label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. 3 sessions/wk on Mon/Wed/Fri"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/fitness/personal-training')}
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
            <span>{loading ? 'Creating...' : 'Enroll Package'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
