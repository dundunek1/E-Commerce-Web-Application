<template>
  <main class="column">
    <theHeader />
    <theBanner />
    <theProductsList />
    <TheNewsletter />
    <TheInformations />
    <theFooter />
  </main>
</template>

<script setup lang="ts">
import TheHeader from './Layout/TheHeader.vue'
import theBanner from './Layout/TheBanner.vue'
import TheProductsList from './shop/TheProductsList.vue'
import TheNewsletter from './Layout/TheNewsletter.vue'
import TheInformations from './Layout/TheInformations.vue'
import theFooter from './Layout/TheFooter.vue'
</script>

<style scoped></style>
