import { create } from 'zustand'

const INITIALLY_RESERVED = new Set([
  'polySurface17_Sep_12005',
  'polySurface17_Sep_12009',
  'polySurface17_Sep_12014',
  'polySurface17_Sep_12018',
  'polySurface17_Sep_12022',
])

interface ReservationStore {
  reservedChairs: Set<string>
  selectedChair: string | null
  hoveredChair: string | null
  setSelectedChair: (name: string | null) => void
  setHoveredChair: (name: string | null) => void
  reserveChair: (name: string) => void
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservedChairs: INITIALLY_RESERVED,
  selectedChair: null,
  hoveredChair: null,
  setSelectedChair: (name) => set({ selectedChair: name }),
  setHoveredChair: (name) => set({ hoveredChair: name }),
  reserveChair: (name) =>
    set((state) => ({
      reservedChairs: new Set([...state.reservedChairs, name]),
      selectedChair: null,
      hoveredChair: state.hoveredChair === name ? null : state.hoveredChair,
    })),
}))
