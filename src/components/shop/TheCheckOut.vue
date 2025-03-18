<template>
  <div class="checkout-container">
    <h1 class="title">Finalize Your Order</h1>

    <div v-if="cart.length > 0" class="order-summary">
      <h2 class="subtitle">Order Summary</h2>
      <ul>
        <li v-for="item in cart" :key="item.product.id">
          <strong>{{ item.product.title }}</strong> – {{ item.quantity }} x ${{
            item.product.price.toFixed(2)
          }}
        </li>
      </ul>

      <p class="total-price"><i class="fa-solid fa-money-bill-1"></i> = ${{ shopAmount }}</p>

      <p class="total-price">
        <i class="fa-solid fa-money-bill-1"></i><i class="fa-solid fa-plus"></i
        ><i class="fa-solid fa-truck-fast"></i> = ${{ totalAmount }}
      </p>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>

    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': currentTab === 'checkout' }">
          <a>Personal Information</a>
        </li>

        <li :class="{ 'is-active': currentTab === 'delivery' }">
          <a>Delivery</a>
        </li>

        <li :class="{ 'is-active': currentTab === 'payment' }">
          <a>Payment</a>
        </li>
      </ul>
    </div>

    <KeepAlive
      ><CheckoutForm v-if="currentTab === 'checkout'" @goToDelivery="currentTab = 'delivery'"
    /></KeepAlive>
    <KeepAlive
      ><DeliveryForm
        v-if="currentTab === 'delivery'"
        @goToPayment="currentTab = 'payment'"
        @goToForm="currentTab = 'checkout'"
    /></KeepAlive>
    <KeepAlive
      ><PaymentForm v-if="currentTab === 'payment'" @goToDelivery="currentTab = 'delivery'"
    /></KeepAlive>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/shopContent.ts'
import { useOrderStore } from '@/stores/shopContent'

import CheckoutForm from '@/components/shop/CheckoutForm.vue'
import PaymentForm from '@/components/shop/PaymentForm.vue'
import DeliveryForm from '@/components/shop/TheDeliveryForm.vue'
const orderStore = useOrderStore()
const productStore = useProductStore()
const cart = computed(() => productStore.shopCart)

const shopAmount = computed(() => {
  const total = productStore.shopCart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  )
  return total.toFixed(2)
})

const deliveryPrice = computed(() => {
  const price = orderStore.orderData.deliveryPrice || 0
  return price
})

const totalAmount = computed(() => {
  const shopTotal = parseFloat(shopAmount.value)
  const deliveryTotal = deliveryPrice.value
  return (shopTotal + deliveryTotal).toFixed(2)
})

const currentTab = ref('checkout')
</script>

<style scoped>
.checkout-container {
  width: 50%;
  height: 50%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.order-summary {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
a {
  cursor: default;
}

.total-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6347;
  margin-top: 10px;
}

.tabs {
  margin-bottom: 20px;
}
@media (max-width: 1030px) {
  .checkout-container {
    width: auto;
    height: auto;
  }
}
</style>
