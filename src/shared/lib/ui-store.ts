import { create } from 'zustand'

interface UiState {
  filtersDrawerOpen: boolean
  setFiltersDrawerOpen: (open: boolean) => void
  toggleFiltersDrawer: () => void
}

export const useUiStore = create<UiState>((set) => ({
  filtersDrawerOpen: false,
  setFiltersDrawerOpen: (open) => set({ filtersDrawerOpen: open }),
  toggleFiltersDrawer: () => set((state) => ({ filtersDrawerOpen: !state.filtersDrawerOpen })),
}))
