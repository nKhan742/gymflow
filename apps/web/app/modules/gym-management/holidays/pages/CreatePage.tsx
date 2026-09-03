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
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  Bell,
  Sparkles,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { IHoliday } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

const CATEGORY_OPTIONS: ISelectOption[] = [
  { value: 'NATIONAL', label: '🎉 National / Public Holiday' },
  { value: 'MAINTENANCE', label: '🔧 Facility Maintenance / Renovation' },
  { value: 'SPECIAL_EVENT', label: '🏆 Athletic Competition / Private Event' },
  { value: 'EMERGENCY', label: '⚠️ Weather Emergency / Power Outage' },
];

const OPERATIONAL_MODE_OPTIONS: ISelectOption[] = [
  { value: 'CLOSED', label: '🚫 Full Facility Closed (Turnstiles Locked)' },
  { value: 'REDUCED_HOURS', label: '🕒 Reduced Holiday Operating Hours' },
  { value: 'SELF_SERVICE', label: '⚡ 24/7 Keycard / Self-Service Only (No Staff)' },
];

const CLASS_POLICY_OPTIONS: ISelectOption[] = [
  { value: 'AUTO_CANCEL', label: '❌ Auto-Cancel All Classes & Notify Members' },
  { value: 'RESCHEDULE', label: '🔄 Allow Coaches to Reschedule' },
  { value: 'KEEP_SCHEDULED', label: '✅ Keep Normal Class Schedule' },
];

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);

  // Section 1: Holiday Identity
  const [name, setName] = useState('');
  const [code, setCode] = useState(`HOL-${Math.floor(10 + Math.random() * 90)}`);
  const [category, setCategory] = useState<'NATIONAL' | 'MAINTENANCE' | 'SPECIAL_EVENT' | 'EMERGENCY'>('NATIONAL');
  const [startDate, setStartDate] = useState('2026-12-25');
  const [endDate, setEndDate] = useState('2026-12-25');

  // Section 2: Operational Mode
  const [operationalMode, setOperationalMode] = useState<'CLOSED' | 'REDUCED_HOURS' | 'SELF_SERVICE'>('CLOSED');
  const [reducedHoursSchedule, setReducedHoursSchedule] = useState('07:00 AM – 02:00 PM');
  const [description, setDescription] = useState('');

  // Section 3: Class & PT Policies
  const [classPolicy, setClassPolicy] = useState<'AUTO_CANCEL' | 'RESCHEDULE' | 'KEEP_SCHEDULED'>('AUTO_CANCEL');
  const [ptPolicy, setPtPolicy] = useState<'AUTO_CANCEL' | 'PERMITTED'>('AUTO_CANCEL');

  // Section 4: Facility Branch & Broadcast
  const [branchId, setBranchId] = useState('ALL');
  const [memberBroadcast, setMemberBroadcast] = useState('true');

  const branchOptions: ISelectOption[] = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) {
      toast.error('Please fill in holiday title and dates.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const payload: IHoliday = {
        id: `HOL-${Math.floor(100 + Math.random() * 900)}`,
        name,
        code,
        category,
        startDate,
        endDate,
        operationalMode,
        reducedHoursSchedule: operationalMode === 'REDUCED_HOURS' ? reducedHoursSchedule : undefined,
        classPolicy,
        ptPolicy,
        branchId,
        branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'All Locations',
        memberBroadcast: memberBroadcast === 'true',
        status: 'active',
        description: description || 'Facility holiday schedule exception.',
      };

      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/holidays', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Holiday / Closure "${name}" scheduled successfully!`);
      navigate('/gym-management/holidays');
    } catch {
      toast.error('Network error during holiday creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Holiday or Facility Closure"
        subtitle="Schedule facility closures, reduced holiday hours, automated class cancellations, and member announcement broadcasts."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/gym-management/holidays')}
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
              <span>{loading ? 'Creating...' : 'Save Holiday Schedule'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* CARD 1: IDENTITY & DATES */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                1. Holiday Identity & Date Range
              </CardTitle>
              <CardDescription className="text-xs">Specify event title, category, and active dates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Holiday / Closure Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Christmas Day 2026"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Event Code</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="HOL-XMAS-26"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Holiday Category</label>
                <SelectBox
                  options={CATEGORY_OPTIONS}
                  value={category}
                  onChange={(val) => setCategory(val as any)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Start Date *</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">End Date *</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: OPERATIONAL MODE */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                2. Facility Operational Mode
              </CardTitle>
              <CardDescription className="text-xs">Configure turnstile status and modified operating hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Club Access Mode</label>
                <SelectBox
                  options={OPERATIONAL_MODE_OPTIONS}
                  value={operationalMode}
                  onChange={(val) => setOperationalMode(val as any)}
                />
              </div>

              {operationalMode === 'REDUCED_HOURS' && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <label className="text-xs font-semibold text-foreground">Reduced Operating Hours</label>
                  <Input
                    value={reducedHoursSchedule}
                    onChange={(e) => setReducedHoursSchedule(e.target.value)}
                    placeholder="e.g. 07:00 AM – 02:00 PM"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Operational Description / Notes</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. All cardio and lifting bays open; pool and saunas closed for sanitization."
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: CLASS & PT POLICIES */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                3. Classes & Personal Training Policies
              </CardTitle>
              <CardDescription className="text-xs">Automate class cancellations and PT appointment booking permissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Group Fitness Classes Policy</label>
                <SelectBox
                  options={CLASS_POLICY_OPTIONS}
                  value={classPolicy}
                  onChange={(val) => setClassPolicy(val as any)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Personal Training Policy</label>
                <SelectBox
                  options={[
                    { value: 'AUTO_CANCEL', label: '🚫 Block & Reschedule All 1-on-1 PT Sessions' },
                    { value: 'PERMITTED', label: '✅ Allow PT Sessions if Coach & Member Agree' },
                  ]}
                  value={ptPolicy}
                  onChange={(val) => setPtPolicy(val as any)}
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: BRANCH & ANNOUNCEMENT */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-pink-500" />
                4. Facility Branch & Member Notices
              </CardTitle>
              <CardDescription className="text-xs">Location scope and automated notification dispatch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Facility Scope</label>
                <SelectBox
                  options={branchOptions}
                  value={branchId}
                  onChange={setBranchId}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Automated Member Announcement</label>
                <SelectBox
                  options={[
                    { value: 'true', label: '📢 Dispatch App Push Notification & Banner Notice' },
                    { value: 'false', label: '🤫 Silent (Internal Calendar Only)' },
                  ]}
                  value={memberBroadcast}
                  onChange={setMemberBroadcast}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/gym-management/holidays')}
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
            <span>{loading ? 'Creating...' : 'Save Holiday Schedule'}</span>
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
