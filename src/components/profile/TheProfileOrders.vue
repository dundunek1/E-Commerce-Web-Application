<template>
  <div class="columns is-multiline">
    <div class="column is-6" v-for="order in orders" :key="order.orderNumber">
      <div class="card-content">
        <p class="title is-5 mb-0">Order Number: {{ order.orderNumber }}</p>
        <p class="title is-6 mt-0">
          Date:
          {{ order.date.substring(0, order.date.length - 14) }}
        </p>
        <p class="subtitle is-6">Total: ${{ order.totalAmount }}</p>

        <button class="button" @click="order.showDetails = !order.showDetails">
          <i class="fa-solid fa-info-circle"></i>
          {{ order.showDetails ? 'Hide Details' : 'View Details' }}
        </button>

        <div v-if="order.showDetails" class="order-details">
          <h3 class="title is-6">Order Details</h3>

          <p><strong>Payment Method:</strong> {{ order.paymentMethod }}</p>
          <p><strong>Total Amount:</strong> ${{ order.totalAmount }}</p>

          <div v-if="order.products">
            <table class="table is-fullwidth">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in order.products" :key="product.productId">
                  <td>
                    <router-link :to="'/product/' + product.productId" class="link">
                      {{ getProductName(product.productId) }}
                    </router-link>
                  </td>

                  <td>{{ product.quantity }}</td>
                  <td>${{ product.price }}</td>
                  <td>${{ (product.quantity * product.price).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="shipping-details">
            <h3 class="title is-6">Shipping Details</h3>
            <p><strong>Full Name: </strong>{{ order.customerName }}</p>
            <p><strong>Delivery Method: </strong> {{ order.deliveryMethod }}</p>
            <p><strong>Address: </strong> {{ order.customerAddress }}</p>
            <p><strong>City: </strong> {{ order.city }}</p>
            <p><strong>Zip Code </strong> {{ order.zip }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db, collection, query, where, getDocs } from '@/firebaseConfig'
import { getAuth } from 'firebase/auth'
import { toast } from 'vue-sonner'
import { useProductStore } from '@/stores/shopContent.ts'

const orders = ref<any[]>([])

const productStore = useProductStore()
const products = ref(productStore.products)

const getProductName = (productId: string | number) => {
  const product = products.value.find((p) => Number(p.id) === Number(productId))
  return product ? product.title : 'Unknown Product'
}

const loadOrders = async () => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid))
    const querySnapshot = await getDocs(ordersQuery)
    orders.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      showDetails: false,
    }))
  } else {
    toast.error('User not logged in.')
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.order-details {
  margin-top: 20px;
}

.column {
  width: 100%;
}
.shipping-details {
  border: 1px solid #ddd;

  padding: 20px;
}
</style>
