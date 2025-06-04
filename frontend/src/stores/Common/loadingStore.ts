import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loadingCount: 0,
  }),
  actions: {
    startLoading() {
      this.loadingCount++
    },
    finishLoading() {
      if (this.loadingCount > 0) {
        this.loadingCount--
      }
    },
  },
  getters: {
    isLoading: (state) => state.loadingCount > 0,
  },
})
