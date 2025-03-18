<template>
  <div class="cart-container">
    <div class="box">
      <article class="media">
        <div class="media-left">
          <figure class="image">
            <img :src="productCart.product.image" alt="Product Image" class="product-image" />
          </figure>
        </div>

        <div class="media-content">
          <div class="content">
            <h2 class="title is-5">{{ productCart.product.title }}</h2>
            <p class="quantity">Quantity: {{ productCart.quantity }}</p>
            <p class="price">Price: ${{ (productCart.product.price * productCart.quantity).toFixed(2) }}</p>
          </div>
          <div class="buttons-container">
            <button class="level-item" @click="productStore.removeProductFromCart(productCart.product)"><i class="fa-solid fa-minus-circle"></i> Remove</button>
            <button class="level-item" @click="productStore.addProductToCart(productCart.product)"><i class="fa-solid fa-plus-circle"></i> Add More</button>

            <router-link :to="'/product/' + productCart.product.id" class="button is-small"> <i class="fa-solid fa-info-circle"></i> View Details </router-link>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from "@/stores/shopContent.ts";
const productStore = useProductStore();
defineProps({
  productCart: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.cart-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.box {
  display: flex;
  flex-direction: column;
  padding: 15px;
  width: 100%;
}

.media {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.media-left {
  flex-shrink: 0;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.media-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

h2 {
  font-size: 1rem;
  margin-bottom: 8px;
  white-space: normal;
  word-wrap: break-word;
}

.quantity,
.price {
  font-size: 0.9rem;
  margin: 4px 0;
}

.quantity {
  font-weight: bold;
}

.price {
  color: #ff6347;
  font-weight: bold;
}

.buttons-container {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: auto;
}

button {
  background-color: transparent;
  border: none;
  font-size: 0.9rem;
  color: #3273dc;
  cursor: pointer;
}

button i {
  margin-right: 5px;
}

button:hover {
  color: #ff6347;
}

.level-item {
  cursor: pointer;
}

@media (max-width: 768px) {
  .media {
    flex-direction: column;
  }

  .buttons-container {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
  }
}
</style>
