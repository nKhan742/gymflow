import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { memberApi } from '../api/memberApi';
import { toast } from 'sonner';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState<'VIP_PLATINUM' | 'GOLD_ANNUAL' | 'SILVER_MONTHLY' | 'STANDARD'>('GOLD_ANNUAL');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [lockerNumber, setLockerNumber] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const newMember = await memberApi.createMember({
        firstName,
        lastName,
        email,
        phone,
        lockerNumber: lockerNumber || undefined,
        emergencyContact: {
          name: emergencyName || 'Family Contact',
          relationship: 'Primary Guardian',
          phone: emergencyPhone || phone,
        },
        membership: {
          planId: tier === 'VIP_PLATINUM' ? 'plan_vip' : 'plan_gold',
          planName: tier === 'VIP_PLATINUM' ? 'VIP Platinum All-Access' : 'Gold Annual Pass',
          tier,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          price: tier === 'VIP_PLATINUM' ? 1499 : 899,
          status: 'ACTIVE',
          autoRenew: true,
        },
      });

      toast.success(`Member Onboarding Complete!`, {
        description: `Generated Member ID: ${newMember.memberCode} for ${firstName} ${lastName}`,
      });
      navigate('/member-management/members');
    } catch (err: any) {
      toast.error('Failed to create member', {
        description: err.message || 'Please check the form and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Member Onboarding"
        subtitle="Enroll new gym member with digital waivers, membership plan, and biometric access."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate('/member-management/members')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
        }
      />

      {/* 3-Step Visual Progress Stepper */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <span className="text-xs font-semibold text-foreground">Personal Details</span>
          </div>

          <div className="h-px bg-border flex-1 mx-4" />

          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <span className="text-xs font-semibold text-foreground">Plan & Access</span>
          </div>

          <div className="h-px bg-border flex-1 mx-4" />

          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              3
            </div>
            <span className="text-xs font-semibold text-foreground">Review & Confirm</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleNext}>
          <Card className="border border-border/80 shadow-lg">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>1. Personal Information</CardTitle>
                  <CardDescription>Enter contact details and identity credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">First Name *</label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Sarah"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Last Name *</label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Jenkins"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Email Address *</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah.jenkins@example.com"
                      icon={<Mail className="h-4 w-4" />}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Phone Number *</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 392-4820"
                      icon={<Phone className="h-4 w-4" />}
                      required
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Plan & Access */}
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>2. Membership Tier & Facility Access</CardTitle>
                  <CardDescription>Select access tier and optional amenities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Membership Package</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'VIP_PLATINUM', name: 'VIP Platinum', price: '$1,499/yr', desc: 'All clubs, sauna, personal trainer' },
                        { id: 'GOLD_ANNUAL', name: 'Gold Annual', price: '$899/yr', desc: 'Single club, group classes included' },
                        { id: 'SILVER_MONTHLY', name: 'Silver Monthly', price: '$89/mo', desc: 'Flexible monthly access' },
                      ].map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setTier(p.id as any)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            tier === p.id
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : 'border-border hover:border-border/80 bg-muted/20'
                          }`}
                        >
                          <p className="font-bold text-sm text-foreground">{p.name}</p>
                          <p className="text-xs font-bold text-primary mt-1">{p.price}</p>
                          <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Emergency Contact Name</label>
                      <Input
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="e.g. Robert Jenkins"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Emergency Phone</label>
                      <Input
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="+1 (555) 839-2041"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Assign Locker Number (Optional)</label>
                    <Input
                      value={lockerNumber}
                      onChange={(e) => setLockerNumber(e.target.value)}
                      placeholder="e.g. L-104"
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>3. Review & Issue Digital Pass</CardTitle>
                  <CardDescription>Confirm enrollment details before generating member credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border">
                      <span className="text-muted-foreground">Full Name:</span>
                      <span className="font-bold text-foreground">{firstName} {lastName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-semibold text-foreground">{email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border">
                      <span className="text-muted-foreground">Selected Tier:</span>
                      <Badge variant="default">{tier.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border">
                      <span className="text-muted-foreground">Emergency Contact:</span>
                      <span className="font-semibold text-foreground">{emergencyName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Assigned Locker:</span>
                      <span className="font-mono font-semibold text-foreground">{lockerNumber || 'Unassigned'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>Digital liability waiver & PAR-Q questionnaire marked as completed.</span>
                  </div>
                </CardContent>
              </>
            )}

            {/* Navigation Footer */}
            <CardFooter className="flex justify-between border-t border-border pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(step - 1)}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              ) : (
                <div />
              )}

              <Button
                type="submit"
                size="sm"
                className="gap-1.5 shadow-md shadow-primary/25"
                loading={loading}
              >
                <span>{step === 3 ? 'Complete Onboarding' : 'Continue'}</span>
                {step < 3 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
