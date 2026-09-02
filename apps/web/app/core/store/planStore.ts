import { create } from 'zustand';
import {
  PlanTier,
  BillingCycle,
  PLAN_DEFINITIONS,
  FEATURE_TIER_REQUIREMENTS,
  TIER_WEIGHT,
  IPlanDefinition,
} from '../config/planFeaturesConfig';
import { toast } from 'sonner';

interface IPlanState {
  currentPlan: PlanTier;
  billingCycle: BillingCycle;
  whatsAppMsgsUsed: number;
  isUpgradeModalOpen: boolean;
  upgradePromptFeature: string | null;

  // Actions
  setPlan: (plan: PlanTier, cycle?: BillingCycle) => void;
  setBillingCycle: (cycle: BillingCycle) => void;
  incrementWhatsAppUsage: (count?: number) => void;
  hasAccess: (modulePath: string) => boolean;
  getRequiredPlan: (modulePath: string) => PlanTier;
  getPlanDefinition: (plan?: PlanTier) => IPlanDefinition;
  openUpgradeModal: (featureName?: string) => void;
  closeUpgradeModal: () => void;
}

const STORAGE_PLAN_KEY = 'gymflow_software_plan_tier';
const STORAGE_CYCLE_KEY = 'gymflow_software_billing_cycle';
const STORAGE_WA_USAGE_KEY = 'gymflow_wa_usage_count';

const getInitialPlan = (): PlanTier => {
  const saved = localStorage.getItem(STORAGE_PLAN_KEY);
  if (saved && (saved === 'ESSENTIAL' || saved === 'PROFESSIONAL' || saved === 'ENTERPRISE')) {
    return saved as PlanTier;
  }
  return 'PROFESSIONAL'; // Default to Professional for smooth demo
};

const getInitialCycle = (): BillingCycle => {
  const saved = localStorage.getItem(STORAGE_CYCLE_KEY);
  return saved === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
};

const getInitialWAUsage = (): number => {
  const saved = localStorage.getItem(STORAGE_WA_USAGE_KEY);
  return saved ? parseInt(saved, 10) || 42 : 42;
};

export const usePlanStore = create<IPlanState>((set, get) => ({
  currentPlan: getInitialPlan(),
  billingCycle: getInitialCycle(),
  whatsAppMsgsUsed: getInitialWAUsage(),
  isUpgradeModalOpen: false,
  upgradePromptFeature: null,

  setPlan: (plan: PlanTier, cycle?: BillingCycle) => {
    localStorage.setItem(STORAGE_PLAN_KEY, plan);
    if (cycle) {
      localStorage.setItem(STORAGE_CYCLE_KEY, cycle);
    }
    set((state) => ({
      currentPlan: plan,
      billingCycle: cycle || state.billingCycle,
    }));
    toast.success(`Plan updated to ${plan}!`);
  },

  setBillingCycle: (cycle: BillingCycle) => {
    localStorage.setItem(STORAGE_CYCLE_KEY, cycle);
    set({ billingCycle: cycle });
  },

  incrementWhatsAppUsage: (count = 1) => {
    const current = get().whatsAppMsgsUsed + count;
    localStorage.setItem(STORAGE_WA_USAGE_KEY, current.toString());
    set({ whatsAppMsgsUsed: current });
  },

  hasAccess: (modulePath: string): boolean => {
    const cleanPath = modulePath.replace(/^\//, '');
    const requiredTier = FEATURE_TIER_REQUIREMENTS[cleanPath] || 'ESSENTIAL';
    const userTier = get().currentPlan;
    return TIER_WEIGHT[userTier] >= TIER_WEIGHT[requiredTier];
  },

  getRequiredPlan: (modulePath: string): PlanTier => {
    const cleanPath = modulePath.replace(/^\//, '');
    return FEATURE_TIER_REQUIREMENTS[cleanPath] || 'ESSENTIAL';
  },

  getPlanDefinition: (plan?: PlanTier): IPlanDefinition => {
    const tier = plan || get().currentPlan;
    return PLAN_DEFINITIONS[tier];
  },

  openUpgradeModal: (featureName?: string) => {
    set({
      isUpgradeModalOpen: true,
      upgradePromptFeature: featureName || null,
    });
  },

  closeUpgradeModal: () => {
    set({
      isUpgradeModalOpen: false,
      upgradePromptFeature: null,
    });
  },
}));
