<template>
  <header class="top-menu">
    <h1 class="title">{{ productStore.selectedCategory }}</h1>
    <div class="header-buttons">
      <!-- <button class="button mr-2">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button> -->
      <div class="has-tooltip" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
        <RouterLink to="/ShopCartService" class="button" @click="setCategory">
          <i class="fa-solid fa-cart-shopping"></i>
          <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
        </RouterLink>
        <div v-if="showTooltip" class="cart-preview">
          <h3 class="title is-6">Your Cart</h3>
          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Qty</th>
                <th>Product</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="productCart in productStore.shopCart" :key="productCart.product.id">
                <td>{{ productCart.quantity }}</td>
                <td>{{ productCart.product.title.split(" ").slice(0, 4).join(" ") }}</td>
                <td>${{ productCart.product.price }}</td>
                <td>
                  <button class="button is-small is-danger" @click="removeFromCart(productCart.product.id.toString())">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                  <router-link :to="'/product/' + productCart.product.id" class="button is-small mt-1"> <i class="fa-solid fa-info-circle"></i> </router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="buttons">
            <RouterLink to="/checkout" class="button is-primary is-small mt-2" v-if="productStore.shopCart.length > 0">Finalize Purchase</RouterLink>
            <RouterLink to="/ShopCartService" class="button is-light is-small mt-2">View Cart</RouterLink>
          </div>
        </div>
      </div>

      <div v-if="!userLoggedIn">
        <RouterLink to="/login" class="button">
          <i class="fa-solid fa-right-to-bracket"></i>
        </RouterLink>
      </div>
      <div v-else>
        <RouterLink to="/profile" class="button" @click="setCategory">
          <i class="fa-solid fa-user"></i>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useProductStore } from "@/stores/shopContent.ts";
import { RouterLink } from "vue-router";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ref, computed } from "vue";

const productStore = useProductStore();
const userLoggedIn = ref(false);
const showTooltip = ref(false);

onAuthStateChanged(auth, (user) => {
  userLoggedIn.value = !!user;
});

const setCategory = () => {
  productStore.selectedCategory = "";
};

const cartItemCount = computed(() => {
  return productStore.shopCart.reduce((total, item) => total + item.quantity, 0);
});

const removeFromCart = (productId: string) => {
  productStore.shopCart = productStore.shopCart.filter((item) => item.product.id.toString() !== productId);
};
</script>

<style scoped>
.title {
  text-align: center;
  margin: 0;
}
.top-menu {
  padding: 1rem 1rem 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-buttons {
  display: flex;
  gap: 5px;
}
.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 4px;
  font-size: 0.9rem;
}
.has-tooltip {
  position: relative;
}
.cart-preview {
  position: absolute;
  top: 100%;
  right: 0;
  margin-bottom: 5px;
  padding: 10px;
  background-color: #14161a;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.9rem;
  z-index: 10;
}
.cart-preview .table {
  margin-bottom: 10px;
}
table td {
  background-color: #14161a;
}
.buttons {
  display: flex;
  justify-content: space-between;
}
@media (max-width: 990px) {
  .top-menu {
    padding-top: 7rem;
  }
}
</style>
