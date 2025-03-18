<template>
  <div class="column product-item">
    <div class="card">
      <div class="card-image">
        <figure class="image is-3by4"><img :src="product.image" alt="Product Image" /></figure>
      </div>
      <div class="media-content">
        <!-- <h2>{{ product.title.split(" ").slice(0, 4).join(" ") }}</h2> -->
        <h2>{{ product.title.slice(0, 12) }}</h2>
        <div class="product-info">
          <p>${{ product.price }}</p>
          <div class="buttons-container">
            <button class="button is-small" @click="addToCart(product)">Add to Cart</button>
            <router-link :to="'/product/' + product.id" class="button is-small">
              <i class="fa-solid fa-info-circle"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/shopContent.ts'
const productStore = useProductStore()
defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const addToCart = (product: any) => {
  console.log('Added to cart:', product.title)
  productStore.addProductToCart(product)
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
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

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.buttons-container {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

button {
  margin-right: 10px;
}
</style>
