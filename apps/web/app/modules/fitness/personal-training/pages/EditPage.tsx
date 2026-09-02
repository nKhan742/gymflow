import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  RefreshCw,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IPersonalTrainingPackage } from '../types';
import { DEFAULT_PT_PACKAGES } from './ListPage';
import { useBranchStore } from '../../../../core/store/branchStore';

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

const STATUS_OPTIONS: ISelectOption[] = [
  { value: 'ACTIVE', label: '🟢 Active & In-Use' },
  { value: 'EXHAUSTED', label: '⚪ Exhausted (All Credits Used)' },
  { value: 'EXPIRED', label: '🔴 Expired' },
  { value: 'FROZEN', label: '❄️ Frozen / Medical Hold' },
];

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Client & Coach
  const [memberName, setMemberName] = useState('');
  const [coachId, setCoachId] = useState('STF-001');
  const [packageTier, setPackageTier] = useState<any>('TIER_20_SESSIONS');

  // Section 2: Pricing & Sessions
  const [totalSessionsPurchased, setTotalSessionsPurchased] = useState(20);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [commissionPercentage, setCommissionPercentage] = useState(60);

  // Section 3: Dates & Notes
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [branchId, setBranchId] = useState('ALL');
  const [status, setStatus] = useState<'ACTIVE' | 'EXHAUSTED' | 'EXPIRED' | 'FROZEN'>('ACTIVE');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const totalPackagePrice = totalSessionsPurchased * hourlyRate;
  const sessionsRemaining = Math.max(0, totalSessionsPurchased - sessionsCompleted);

  useEffect(() => {
    loadPackageData();
  }, [id]);

  const loadPackageData = async () => {
    setLoading(true);
    try {
      const fallback = DEFAULT_PT_PACKAGES.find((p) => p.id === id || p.packageCode === id) || DEFAULT_PT_PACKAGES[0];
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/personal-training/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let data: IPersonalTrainingPackage = fallback;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          data = json.data;
        }
      }

      setMemberName(data.memberName);
      setCoachId(data.coachId || 'STF-001');
      setPackageTier(data.packageTier);
      setTotalSessionsPurchased(data.totalSessionsPurchased || 20);
      setSessionsCompleted(data.sessionsCompleted || 0);
      setHourlyRate(data.hourlyRate || 85);
      setCommissionPercentage(data.commissionPercentage || 60);
      setStartDate(data.startDate || '');
      setExpiryDate(data.expiryDate || '');
      setNotes(data.notes || '');
      setBranchId(data.branchId || 'ALL');
      setStatus(data.status || 'ACTIVE');
    } catch {
      // Use fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const selectedCoach = COACH_OPTIONS.find((c) => c.value === coachId)?.label?.split(' (')[0]?.replace('🏋️ ', '')?.replace('✨ ', '')?.replace('💪 ', '')?.replace('🥊 ', '') || 'Coach';

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: Partial<IPersonalTrainingPackage> = {
        coachId,
        coachName: selectedCoach,
        packageTier,
        totalSessionsPurchased: Number(totalSessionsPurchased),
        sessionsCompleted: Number(sessionsCompleted),
        sessionsRemaining,
        hourlyRate: Number(hourlyRate),
        totalPackagePrice,
        commissionPercentage: Number(commissionPercentage),
        startDate,
        expiryDate,
        status,
        notes,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
      };

      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/fitness/personal-training/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`PT Package for ${memberName} updated!`);
      navigate(`/fitness/personal-training/${id}`);
    } catch {
      toast.error('Network error updating package');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
          <div className="text-muted-foreground text-sm font-medium">Loading PT Package Data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit PT Package • ${memberName}`}
        subtitle="Modify session counts, hourly billing rates, and expiry dates."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/fitness/personal-training/${id}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              disabled={saving}
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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
                <label className="text-xs font-semibold text-foreground">Member</label>
                <Input value={memberName} disabled className="bg-muted" />
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
                    onChange={(val) => setPackageTier(val as any)}
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
              <CardDescription className="text-xs">Hourly rates, sessions completed, and commissions.</CardDescription>
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
                  <label className="text-xs font-semibold text-foreground">Sessions Rendered</label>
                  <Input
                    type="number"
                    value={sessionsCompleted}
                    onChange={(e) => setSessionsCompleted(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Hourly Rate ($)</label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Price</label>
                  <div className="h-10 px-3 py-2 rounded-md bg-muted font-mono font-bold text-xs text-foreground flex items-center">
                    ${totalPackagePrice.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Commission (%)</label>
                  <Input
                    type="number"
                    value={commissionPercentage}
                    onChange={(e) => setCommissionPercentage(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: VALIDITY WINDOWS & STATUS */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                3. Validity & System Status
              </CardTitle>
              <CardDescription className="text-xs">Expiry period and contract status.</CardDescription>
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
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <SelectBox
                    options={STATUS_OPTIONS}
                    value={status}
                    onChange={(val) => setStatus(val as any)}
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
            onClick={() => navigate(`/fitness/personal-training/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={saving}
            className="gap-1.5 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
