import dayjs from 'dayjs';

export const formatCurrency = (value: number | string, currency = 'USD'): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
};

export const formatDate = (date: string | Date | null | undefined, formatStr = 'YYYY-MM-DD'): string => {
  if (!date) return '-';
  return dayjs(date).format(formatStr);
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};
