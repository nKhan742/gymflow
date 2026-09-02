import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, User, Phone, Mail, DollarSign, Target, Sparkles, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ILead } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [source, setSource] = useState<ILead['source']>('INSTAGRAM');
  const [stage, setStage] = useState<ILead['stage']>('NEW_INQUIRY');
  const [priority, setPriority] = useState<ILead['priority']>('HOT');
  const [fitnessGoal, setFitnessGoal] = useState<ILead['fitnessGoal']>('WEIGHT_LOSS');
  const [targetBudgetMonthly, setTargetBudgetMonthly] = useState('149');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<ILead['preferredTimeSlot']>('EVENING_PEAK');
  const [assignedAgent, setAssignedAgent] = useState('Alex Vance');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newId = `LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
    const budgetNum = Number(targetBudgetMonthly) || 149;
    const estLtv = budgetNum * 12;

    const newLead: ILead = {
      id: newId,
      _id: newId,
      name,
      email,
      phone,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      source,
      stage,
      priority,
      fitnessGoal,
      targetBudgetMonthly: budgetNum,
      estimatedLtv: estLtv,
      preferredTimeSlot,
      assignedAgent,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'PD Vihar',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Save to local storage cache for instant update
      const stored = localStorage.getItem('gymflow_custom_leads');
      const customList: ILead[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((item) => item.id !== newId && item._id !== newId);
      filtered.unshift(newLead);
      localStorage.setItem('gymflow_custom_leads', JSON.stringify(filtered));

      // 2. Fallback attempt to API
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/leads', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLead),
      }).catch(() => {});

      toast.success(`Prospect Lead "${name}" created successfully!`, {
        description: `Stage: ${stage.replace(/_/g, ' ')} • Assigned to: ${assignedAgent}`,
      });
      navigate('/crm/leads');
    } catch {
      toast.error('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Prospect Lead"
        subtitle="Intake new prospect with fitness goals, source attribution, and assigned sales representative."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/crm/leads')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Pipeline</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Identity & Photo */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Prospect Identity & Contact Dossier
              </CardTitle>
              <CardDescription>
                Essential demographic and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Profile Photo</label>
                  <ImageUpload
                    value={avatarUrl}
                    onChange={(url) => setAvatarUrl(url)}
                    variant="avatar"
                    helperText="Upload lead headshot (max 3MB)"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Marcus Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-emerald-500" /> Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="+1 (555) 302-8819"
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
                        placeholder="marcus.vance@example.com"
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

          {/* Card 2: Sales Pipeline & Qualification */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                Pipeline Stage & Qualification Telemetry
              </CardTitle>
              <CardDescription>
                Acquisition channel, intent scoring, and sales representative assignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Acquisition Source</label>
                  <Select value={source} onValueChange={(val) => setSource(val as ILead['source'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INSTAGRAM">📸 Instagram Campaign</SelectItem>
                      <SelectItem value="FACEBOOK_META">📱 Meta Ads</SelectItem>
                      <SelectItem value="GOOGLE_ADS">🔍 Google Search Ads</SelectItem>
                      <SelectItem value="WALK_IN">🚶 Front Desk Walk-In</SelectItem>
                      <SelectItem value="MEMBER_REFERRAL">🎁 Member Referral</SelectItem>
                      <SelectItem value="WEBSITE">🌐 Website Landing Page</SelectItem>
                      <SelectItem value="TIKTOK_EVENT">⚡ Event / TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Pipeline Stage</label>
                  <Select value={stage} onValueChange={(val) => setStage(val as ILead['stage'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW_INQUIRY">🆕 New Inquiry</SelectItem>
                      <SelectItem value="CONTACTED">📞 Contacted</SelectItem>
                      <SelectItem value="TOUR_SCHEDULED">🏛️ Tour Scheduled</SelectItem>
                      <SelectItem value="VIP_TRIAL_ACTIVE">🎟️ VIP Trial Active</SelectItem>
                      <SelectItem value="NEGOTIATION">💬 Negotiation</SelectItem>
                      <SelectItem value="WON_MEMBER">🎉 Won Member</SelectItem>
                      <SelectItem value="LOST_CLOSED">❌ Lost / Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Intent Priority</label>
                  <Select value={priority} onValueChange={(val) => setPriority(val as ILead['priority'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOT">🔥 Hot (Ready to Buy)</SelectItem>
                      <SelectItem value="WARM">⚡ Warm (Considering)</SelectItem>
                      <SelectItem value="COLD">❄️ Cold (Browsing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Primary Fitness Goal</label>
                  <Select value={fitnessGoal} onValueChange={(val) => setFitnessGoal(val as ILead['fitnessGoal'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEIGHT_LOSS">🔥 Weight Loss & Lean Body</SelectItem>
                      <SelectItem value="HYPERTROPHY_BULKING">💪 Hypertrophy & Muscle Growth</SelectItem>
                      <SelectItem value="POWERLIFTING">🏋️ Strength & Powerlifting</SelectItem>
                      <SelectItem value="CARDIO_ENDURANCE">🏃 Cardio & Endurance</SelectItem>
                      <SelectItem value="REHAB_POSTURE">🧘 Mobility & Posture Rehab</SelectItem>
                      <SelectItem value="GENERAL_WELLNESS">✨ General Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" /> Target Budget ($/mo)
                  </label>
                  <Input
                    type="number"
                    value={targetBudgetMonthly}
                    onChange={(e) => setTargetBudgetMonthly(e.target.value)}
                    placeholder="149"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Preferred Workout Slot</label>
                  <Select value={preferredTimeSlot} onValueChange={(val) => setPreferredTimeSlot(val as ILead['preferredTimeSlot'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EARLY_MORNING">🌅 Early Morning (06:00 - 09:00)</SelectItem>
                      <SelectItem value="MID_DAY">☀️ Mid-Day (11:00 - 14:00)</SelectItem>
                      <SelectItem value="EVENING_PEAK">🌆 Evening Rush (17:00 - 20:30)</SelectItem>
                      <SelectItem value="NIGHT_OWL">🌙 Night Owl (21:00+)</SelectItem>
                      <SelectItem value="WEEKENDS_ONLY">📅 Weekends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assigned Sales Rep</label>
                  <Select value={assignedAgent} onValueChange={setAssignedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rep" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alex Vance">Alex Vance (Senior Membership Advisor)</SelectItem>
                      <SelectItem value="Sarah Jenkins">Sarah Jenkins (Tour Coordinator)</SelectItem>
                      <SelectItem value="Marcus Kane">Marcus Kane (Elite Sales Lead)</SelectItem>
                      <SelectItem value="Elena Rostova">Elena Rostova (VIP Client Director)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Location
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
                <label className="text-xs font-semibold text-foreground">Discovery & Objection Notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Record member motivations, previous fitness history, or specific questions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Est. Annual LTV: <strong className="text-emerald-600 font-mono">${(Number(targetBudgetMonthly) || 149) * 12} USD</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/crm/leads')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Create Prospect Lead</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
