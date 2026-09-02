import dayjs from 'dayjs';
import { getStoredCurrency } from '../store/currencyStore';

export const formatCurrency = (value: number | string, currency?: string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';
  const targetCurrency = currency || getStoredCurrency() || 'USD';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: targetCurrency }).format(num);
  } catch {
    return `${targetCurrency} ${num.toFixed(2)}`;
  }
};

export const formatDate = (date: string | Date | null | undefined, formatStr = 'YYYY-MM-DD'): string => {
  if (!date) return '-';
  return dayjs(date).format(formatStr);
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};
