<template>
  <main class="column">
    <theHeader />
    <div v-if="product" class="container">
      <div class="columns is-centered">
        <div class="column is-10-tablet is-8-desktop">
          <h2 class="title has-text-centered">{{ product.title }}</h2>
          <figure class="image is-4by3">
            <img :src="product.image" :alt="product.title" class="product-image" />
          </figure>
          <p class="description mt-4">{{ product.description }}</p>
          <p class="price has-text-weight-bold is-size-4 mt-4">${{ product.price.toFixed(2) }}</p>
          <div class="buttons is-centered mt-4">
            <RouterLink class="button is-link" :to="{ path: '/' }">Back to shop</RouterLink>
            <button class="button is-primary" @click="addToCart(product)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="has-text-centered">
      <p>Loading...</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/shopContent'
import TheHeader from '../Layout/TheHeader.vue'
const route = useRoute()
const productStore = useProductStore()

interface Product {
  id: number
  title: string
  price: number
  category: string
  image?: string
  description?: string
}

const product = ref<Product | null>(null)

onMounted(() => {
  const productId = route.params.id
  const foundProduct = productStore.products.find((product) => product.id.toString() === productId)
  if (foundProduct) {
    product.value = foundProduct
  }
})
const addToCart = (product: any) => {
  console.log('Added to cart:', product.title)
  productStore.addProductToCart(product)
}
</script>

<style scoped>
.title {
  font-size: 1.25rem;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: #4a4a4a;
}

.price {
  color: #ff6347;
  font-size: 1rem;
}

.buttons .button {
  width: 100%;
  max-width: 200px;
}

@media (max-width: 768px) {
  .description {
    font-size: 0.85rem;
  }
  .price {
    font-size: 0.85rem;
  }
}
</style>
