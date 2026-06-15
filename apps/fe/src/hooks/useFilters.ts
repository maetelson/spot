import { create } from 'zustand';
import type { CategoryTab } from '@/lib/categories';

// UI filter state (Zustand) — PRD §2.1 decision order: category → condition.
// Switching the category tab resets active conditions (§9.1).

interface FilterState {
  activeCategory: CategoryTab;
  conditions: Set<string>;
  setCategory: (category: CategoryTab) => void;
  toggleCondition: (key: string) => void;
  reset: () => void;
}

export const useFilters = create<FilterState>((set) => ({
  activeCategory: 'all',
  conditions: new Set<string>(),
  setCategory: (category) =>
    set({ activeCategory: category, conditions: new Set<string>() }),
  toggleCondition: (key) =>
    set((state) => {
      const next = new Set(state.conditions);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { conditions: next };
    }),
  reset: () => set({ conditions: new Set<string>() }),
}));
