<template>
  <div class="column">
    <theHeader />
    <div class="container">
      <section class="section">
        <h1 class="title has-text-centered">Your Profile</h1>

        <div class="tabs">
          <ul>
            <li :class="{ 'is-active': currentTab === 'info' }" @click="currentTab = 'info'">
              <a>Personal Information</a>
            </li>
            <li :class="{ 'is-active': currentTab === 'orders' }" @click="currentTab = 'orders'">
              <a>Your Orders</a>
            </li>
          </ul>
        </div>

        <KeepAlive><TheProfileInfo v-if="currentTab === 'info'" /></KeepAlive>
        <KeepAlive><TheProfileOrders v-if="currentTab === 'orders'" /></KeepAlive>

        <div class="buttons mt-5">
          <button class="button is-danger is-medium" @click="logout">Log Out</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.section {
  max-width: 900px;
  margin: 0 auto;
}

.tabs {
  margin-bottom: 20px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from '../Layout/TheHeader.vue'
import TheProfileInfo from '@/components/profile/TheProfileInfo.vue'
import TheProfileOrders from '@/components/profile/TheProfileOrders.vue'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const currentTab = ref<'info' | 'orders'>('info')

const logout = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
    toast.success('You have been logged out.')
    router.push('/login')
  } catch (error: any) {
    toast.error('Error logging out: ' + error.message)
  }
}
</script>
