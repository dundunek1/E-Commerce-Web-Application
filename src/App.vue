<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from '@/components/Layout/TheNavBar.vue'
import { useProductStore } from '@/stores/shopContent.ts'
import { Toaster, toast } from 'vue-sonner'

const productStore = useProductStore()
productStore.fetchProducts()
</script>

<template>
  <Toaster
    theme="dark"
    richColors
    closeButton
    position="top-center"
    :toastOptions="{
      style: { padding: '15px 30px' },
      class: 'my-toast',
      descriptionClass: 'my-toast-description',
    }"
  />
  <main class="columns in-gapless main-view">
    <NavBar v-if="!$route.meta.hideNav" />
    <RouterView />
  </main>
</template>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css';

.main-view {
  margin-left: auto;
  margin-right: auto;
  max-width: 110vh;
}
</style>
