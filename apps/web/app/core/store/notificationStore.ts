import { create } from 'zustand';

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

export interface IToastNotification {
  id: string;
  message: string;
  severity: AlertSeverity;
  duration?: number;
}

interface INotificationState {
  toasts: IToastNotification[];
  showToast: (message: string, severity?: AlertSeverity, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<INotificationState>((set) => ({
  toasts: [],
  showToast: (message, severity = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, severity, duration }],
    }));
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
