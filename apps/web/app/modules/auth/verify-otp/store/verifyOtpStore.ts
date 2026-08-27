import { create } from 'zustand';

interface IVerifyOtpState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useVerifyOtpStore = create<IVerifyOtpState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
