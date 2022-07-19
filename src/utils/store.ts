import React from 'react';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ToastStore {
  toasts: React.ReactElement[];
  add: (component: React.ReactElement) => void;
  remove: () => void;
}

const useStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (component: React.ReactElement) =>
    set((t) => ({ toasts: [...t.toasts, component] })),
  remove: () =>
    set((t) => ({
      toasts: t.toasts.filter((_, dex) => dex != 0),
    })),
}));

export default useStore;
