import { create } from 'zustand';

interface ILoadingState {
  activeRequests: number;
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<ILoadingState>((set) => ({
  activeRequests: 0,
  isLoading: false,
  startLoading: () =>
    set((state) => {
      const next = state.activeRequests + 1;
      return { activeRequests: next, isLoading: true };
    }),
  stopLoading: () =>
    set((state) => {
      const next = Math.max(0, state.activeRequests - 1);
      return { activeRequests: next, isLoading: next > 0 };
    }),
}));
