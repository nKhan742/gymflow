import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePlanStore } from '../../../core/store/planStore';
import { PLAN_DEFINITIONS, PlanTier } from '../../../core/config/planFeaturesConfig';
import { Button } from '../ui/button';
import { Lock, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface IPlanGateGuardProps {
  children: React.ReactNode;
  featureKey?: string;
  featureTitle?: string;
  requiredTier?: PlanTier;
}

export const PlanGateGuard: React.FC<IPlanGateGuardProps> = ({
  children,
  featureKey,
  featureTitle,
  requiredTier: explicitRequiredTier,
}) => {
  const location = useLocation();
  const { hasAccess, getRequiredPlan, openUpgradeModal, currentPlan } = usePlanStore();

  const activePath = featureKey || location.pathname;
  const isAllowed = hasAccess(activePath);

  if (isAllowed) {
    return <>{children}</>;
  }

  const requiredTier = explicitRequiredTier || getRequiredPlan(activePath);
  const targetPlan = PLAN_DEFINITIONS[requiredTier];
  const title = featureTitle || activePath.split('/').pop()?.replace(/-/g, ' ').toUpperCase() || 'Feature';

  return (
    <div className="p-6 md:p-12 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-xl w-full text-center p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="relative mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-primary/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
          <Lock className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Requires {targetPlan.name}</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Unlock {title}
          </h2>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            This feature is exclusive to the{' '}
            <strong className="text-foreground">{targetPlan.name}</strong>. Your current tier is{' '}
            <strong className="text-primary">{PLAN_DEFINITIONS[currentPlan].name}</strong>.
          </p>
        </div>

        {/* Value Props */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-left space-y-2.5">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider">
            What you unlock with {targetPlan.name}:
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {targetPlan.features.flatMap((f) => f.items).slice(0, 4).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => openUpgradeModal(title)}
            size="lg"
            className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-lg shadow-primary/25 rounded-xl"
          >
            <span>Upgrade to {targetPlan.name}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Starting at only ₹{targetPlan.pricing.monthlyINR.toLocaleString('en-IN')}/month + GST</span>
        </div>
      </div>
    </div>
  );
};
