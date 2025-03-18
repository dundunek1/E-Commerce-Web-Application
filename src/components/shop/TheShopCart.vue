<template>
  <main class="column">
    <theHeader />
    <section class="shop-cart">
      <div class="cart-list">
        <CartItem
          v-for="productCart in productStore.shopCart"
          :key="productCart.product.id"
          :productCart="productCart"
        />
      </div>

      <div v-if="productStore.shopCart.length > 0" class="cart-summary">
        <div class="cart-total">
          <p class="title is-4">Total:</p>
          <p class="total-amount">{{ totalAmount }} $</p>
        </div>
        <div class="buttons">
          <RouterLink to="/checkout" class="button is-primary"> Finalize Purchase </RouterLink>
          <button class="button is-light" @click="clearCart">Clear Cart</button>
        </div>
      </div>
      <div v-else class="box empty-cart">
        <p>Your cart is empty</p>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/shopContent.ts'
import CartItem from './TheCartItem.vue'
import TheHeader from '../Layout/TheHeader.vue'

const productStore = useProductStore()

const totalAmount = computed(() => {
  return productStore.shopCart
    .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    .toFixed(2)
})

const clearCart = () => {
  productStore.shopCart = []
}
</script>
<style scoped>
.shop-cart {
  padding: 20px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-summary {
  margin-top: 30px;
  border-top: 2px solid #ddd;
  padding-top: 20px;
  border-radius: 8px;
  padding: 20px;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
}

.total-amount {
  font-size: 1.5rem;
  color: #ff6347;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button {
  width: 48%;
}

.empty-cart {
  text-align: center;
  padding: 20px;

  border-radius: 8px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .buttons {
    flex-direction: column;
  }

  .button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
