import { create } from 'zustand'

export type ShowLoadingProps = {
  onlyOverlay?: boolean
}

export const useLoadingStore = create<{
  loading: boolean
  onlyOverlay: boolean
  showLoading: (props?: ShowLoadingProps) => void
  hideLoading: () => void
}>(set => {
  return {
    loading: false,
    onlyOverlay: false,
    showLoading: ({ onlyOverlay = false }: ShowLoadingProps = {}) => {
      set({ loading: true, onlyOverlay })
    },
    hideLoading: () => {
      set({ loading: false })
    }
  }
})
