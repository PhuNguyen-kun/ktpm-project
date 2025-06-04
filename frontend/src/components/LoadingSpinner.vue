<template>
  <div v-if="loadingStore.isLoading" class="global-loading">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/Common/loadingStore'

const loadingStore = useLoadingStore()
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0);
  border-top: 4px solid var(--theme-color);
  border-radius: 50%;
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
