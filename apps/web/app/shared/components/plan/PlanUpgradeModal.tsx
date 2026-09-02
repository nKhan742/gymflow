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
      <DialogContent className="max-w-6xl w-full p-6 md:p-8 rounded-3xl bg-card border border-border shadow-2xl overflow-y-auto max-h-[92vh]">
        <DialogHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            {upgradePromptFeature
              ? `Upgrade to Unlock ${upgradePromptFeature}`
              : 'Select Your GymFlow ERP Subscription Tier'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground max-w-xl mx-auto">
            Choose the best plan for your gym facility. Switch, pause, or upgrade anytime with immediate feature activation.
          </DialogDescription>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center pt-2">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-muted/80 border border-border shadow-inner">
              <button
                type="button"
                onClick={() => setCycle('MONTHLY')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  cycle === 'MONTHLY'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setCycle('ANNUAL')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  cycle === 'ANNUAL'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                  Save up to ₹6,000
                </span>
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Plan Cards Grid - Wide 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
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
                className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                  isCurrent
                    ? 'border-primary ring-2 ring-primary/40 bg-primary/5 shadow-lg'
                    : plan.recommended
                    ? 'border-indigo-500 bg-gradient-to-b from-indigo-50/40 via-card to-card dark:from-indigo-950/30 dark:via-card dark:to-card shadow-lg hover:shadow-xl'
                    : 'border-border bg-card hover:border-border/90 hover:shadow-md'
                }`}
              >
                {/* Popular or Current Badge */}
                {isCurrent && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-md">
                    Active Subscription
                  </span>
                )}
                {!isCurrent && plan.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    ⭐ Recommended Choice
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-extrabold text-lg text-foreground">{plan.name}</h3>
                    {tier === 'ENTERPRISE' && (
                      <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Building2 className="h-5 w-5" />
                      </span>
                    )}
                    {tier === 'PROFESSIONAL' && (
                      <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Zap className="h-5 w-5" />
                      </span>
                    )}
                    {tier === 'ESSENTIAL' && (
                      <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Shield className="h-5 w-5" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground min-h-[36px] mb-4 leading-relaxed">
                    {plan.bestFor}
                  </p>

                  <div className="mb-5 p-4 rounded-xl bg-muted/40 border border-border/60">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-foreground tracking-tight">
                        {priceDisplay}
                      </span>
                      <span className="text-xs text-muted-foreground font-semibold">{periodLabel}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1 font-medium">
                      <span>{plan.pricing.taxNote}</span>
                      {cycle === 'ANNUAL' && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          Save ₹{plan.pricing.annualSavingsINR.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feature Breakdown */}
                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Included Capabilities:
                    </p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {plan.features.flatMap((f) => f.items).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-tight text-foreground/90 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectPlan(tier)}
                  variant={isCurrent ? 'outline' : plan.recommended ? 'default' : 'secondary'}
                  size="lg"
                  className="w-full font-bold rounded-xl text-xs gap-2 shadow-xs transition-all cursor-pointer"
                  disabled={isCurrent}
                >
                  {isCurrent ? (
                    'Current Active Plan'
                  ) : (
                    <>
                      <span>Switch to {plan.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>Instant workspace activation • GST compliant invoices provided • Seamless upgrade</span>
          </div>
          <Button variant="ghost" size="sm" onClick={closeUpgradeModal} className="text-xs cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
