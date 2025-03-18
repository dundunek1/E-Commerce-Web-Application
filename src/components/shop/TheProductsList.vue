<template>
  <section class="products" id="products">
    <p>{{ productStore.filteredProducts.length }} items</p>
    <div class="columns is-multiline is-mobile">
      <div
        v-for="product in productStore.filteredProducts"
        :key="product.id"
        class="column is-3-desktop is-4-tablet is-6-mobile"
      >
        <ProductItem :product="product" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/shopContent.ts'
import ProductItem from '@/components/shop/TheProductItem.vue'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-image img {
  max-height: 100%;
  object-fit: cover;
}

.media-content {
  flex-grow: 0;
  padding: 1rem;
  text-align: center;
}

h2 {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
