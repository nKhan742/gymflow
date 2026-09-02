import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, Sparkles, Shield, Zap, Building2, ArrowRight } from 'lucide-react';
import { usePlanStore } from '../../../core/store/planStore';
import { PLAN_DEFINITIONS, PlanTier, BillingCycle } from '../../../core/config/planFeaturesConfig';

export const PlanUpgradeModal: React.FC = () => {
  const {
    isUpgradeModalOpen,
    closeUpgradeModal,
    currentPlan,
    billingCycle: storeCycle,
    setPlan,
    upgradePromptFeature,
  } = usePlanStore();

  const [cycle, setCycle] = useState<BillingCycle>(storeCycle);

  if (!isUpgradeModalOpen) return null;

  const handleSelectPlan = (tier: PlanTier) => {
    setPlan(tier, cycle);
    closeUpgradeModal();
  };

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={closeUpgradeModal}>
      <DialogContent className="max-w-4xl p-6 rounded-2xl bg-card border border-border shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            {upgradePromptFeature
              ? `Upgrade to Unlock ${upgradePromptFeature}`
              : 'Choose the Right GymFlow Plan for Your Facility'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground max-w-lg mx-auto">
            Scale your gym with enterprise attendance, digital nutrition, POS billing, and automated multi-floor hardware access.
          </DialogDescription>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center pt-3">
            <div className="inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border">
              <button
                type="button"
                onClick={() => setCycle('MONTHLY')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  cycle === 'MONTHLY'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setCycle('ANNUAL')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  cycle === 'ANNUAL'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-bold">
                  Save up to ₹6,000
                </span>
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {(['ESSENTIAL', 'PROFESSIONAL', 'ENTERPRISE'] as PlanTier[]).map((tier) => {
            const plan = PLAN_DEFINITIONS[tier];
            const isCurrent = currentPlan === tier;
            const priceDisplay =
              cycle === 'MONTHLY'
                ? `₹${plan.pricing.monthlyINR.toLocaleString('en-IN')}`
                : `₹${plan.pricing.annualINR.toLocaleString('en-IN')}`;
            const periodLabel = cycle === 'MONTHLY' ? '/month' : '/year';

            return (
              <div
                key={tier}
                className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'border-primary ring-2 ring-primary/40 bg-primary/5 shadow-md'
                    : plan.recommended
                    ? 'border-indigo-500/80 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md'
                    : 'border-border bg-card hover:border-border/80'
                }`}
              >
                {/* Popular or Current Badge */}
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    Current Active Plan
                  </span>
                )}
                {!isCurrent && plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    ⭐ Recommended
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base text-foreground">{plan.name}</h3>
                    {tier === 'ENTERPRISE' && <Building2 className="h-4 w-4 text-primary" />}
                    {tier === 'PROFESSIONAL' && <Zap className="h-4 w-4 text-indigo-500" />}
                    {tier === 'ESSENTIAL' && <Shield className="h-4 w-4 text-emerald-500" />}
                  </div>

                  <p className="text-xs text-muted-foreground min-h-[32px] mb-3">{plan.bestFor}</p>

                  <div className="mb-4 p-3 rounded-xl bg-muted/40 border border-border/50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-foreground tracking-tight">
                        {priceDisplay}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">{periodLabel}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-0.5">
                      <span>{plan.pricing.taxNote}</span>
                      {cycle === 'ANNUAL' && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Save ₹{plan.pricing.annualSavingsINR.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 mb-5">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Includes:
                    </p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {plan.features.flatMap((f) => f.items).slice(0, 6).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectPlan(tier)}
                  variant={isCurrent ? 'outline' : plan.recommended ? 'default' : 'secondary'}
                  className="w-full font-semibold rounded-xl text-xs gap-1.5"
                  disabled={isCurrent}
                >
                  {isCurrent ? (
                    'Current Plan'
                  ) : (
                    <>
                      <span>Switch to {plan.name}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Instant activation • Cancel or switch plans anytime • GST invoices provided</span>
          </div>
          <Button variant="ghost" size="sm" onClick={closeUpgradeModal} className="text-xs">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
