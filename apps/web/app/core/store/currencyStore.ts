import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/storageKeys';

export interface ICurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rateVsUSD: number;
}

export const SUPPORTED_CURRENCIES: Record<string, ICurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateVsUSD: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateVsUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateVsUSD: 0.79 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateVsUSD: 80 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateVsUSD: 1.35 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateVsUSD: 1.50 },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rateVsUSD: 3.67 },
  SAR: { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal', rateVsUSD: 3.75 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateVsUSD: 1.35 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateVsUSD: 150 },
};

export const getStoredCurrency = (): string => {
  const customProfile = localStorage.getItem('gymflow_custom_gym_profile');
  if (customProfile) {
    try {
      const parsed = JSON.parse(customProfile);
      if (parsed.currency) return parsed.currency;
    } catch {}
  }
  return localStorage.getItem(STORAGE_KEYS.APP_CURRENCY) || 'USD';
};

interface ICurrencyState {
  currency: string;
  setCurrency: (currency: string) => void;
  getCurrencyInfo: () => ICurrencyInfo;
}

export const useCurrencyStore = create<ICurrencyState>((set, get) => ({
  currency: getStoredCurrency(),
  setCurrency: (currency: string) => {
    localStorage.setItem(STORAGE_KEYS.APP_CURRENCY, currency);
    const customProfile = localStorage.getItem('gymflow_custom_gym_profile');
    if (customProfile) {
      try {
        const parsed = JSON.parse(customProfile);
        parsed.currency = currency;
        localStorage.setItem('gymflow_custom_gym_profile', JSON.stringify(parsed));
      } catch {}
    }
    set({ currency });
    window.dispatchEvent(new Event('gymflow_currency_changed'));
  },
  getCurrencyInfo: () => {
    const cur = get().currency;
    return SUPPORTED_CURRENCIES[cur] || SUPPORTED_CURRENCIES.USD;
  },
}));

