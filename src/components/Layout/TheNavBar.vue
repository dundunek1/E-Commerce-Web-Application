<template>
  <nav class="navbar" aria-label="main navigation" role="navigation">
    <aside class="column is-2 is-fullheight is-fixed-left">
      <div class="navbar-brand">
        <div class="navbar-item is-active brand-name">LOGO</div>

        <a
          @click.prevent="showMobileNav = !showMobileNav"
          class="navbar-burger"
          :class="{ 'is-active': showMobileNav }"
          aria-expanded="false"
          aria-label="menu"
          data-target="navbarBasicExample"
          role="button"
          ref="navbarBurgerRef"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="menu p-2 navbar-menu" :class="{ 'is-active': showMobileNav }" ref="navbarMenuRef">
        <div class="menu">
          <ul class="menu-list">
            <li>
              <button
                @click="setCategory('electronics')"
                :class="{ 'is-active': productStore.selectedCategory === 'electronics' }"
              >
                Electronics
              </button>
            </li>
            <li>
              <button
                @click="setCategory('jewelery')"
                :class="{ 'is-active': productStore.selectedCategory === 'jewelery' }"
              >
                Jewelery
              </button>
            </li>
            <li>
              <button
                @click="setCategory('men\'s clothing')"
                :class="{ 'is-active': productStore.selectedCategory === 'men\'s clothing' }"
              >
                Men's Clothing
              </button>
            </li>
            <li>
              <button
                @click="setCategory('women\'s clothing')"
                :class="{ 'is-active': productStore.selectedCategory === 'women\'s clothing' }"
              >
                Women's Clothing
              </button>
            </li>
          </ul>
          <ul class="menu-list mt-6">
            <li><RouterLink :to="{ path: '/', hash: '#contact' }">Contact</RouterLink></li>
            <li><RouterLink :to="{ path: '/', hash: '#subscribe' }">Subscribe</RouterLink></li>
          </ul>
        </div>
      </div>
    </aside>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap');
.navbar {
  position: fixed;
  left: 14%;
  height: 100vh;
  top: 0;
  z-index: 100;
  margin: 0;
}

.brand-name {
  font-family: 'Dancing Script', serif;
  font-size: 40px;
}
@media (max-width: 1600px) {
  .navbar {
    left: 7%;
  }
}
@media (max-width: 1600px) {
  .navbar {
    left: 3%;
  }
}
@media (max-width: 1600px) {
  .navbar {
    left: 0%;
  }
}

@media (max-width: 990px) {
  .navbar-menu {
    position: absolute;
    left: 0;
    width: 100%;
    height: auto;
  }
  .navbar {
    position: block;
    width: 100%;
    left: auto;
    height: auto;
    top: 0;
    z-index: 100;
  }
}
</style>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProductStore } from '@/stores/shopContent.ts'
import { useRouter, RouterLink } from 'vue-router'
const productStore = useProductStore()
const isModalActive = ref(false)
const showMobileNav = ref<Boolean>(false)

const navbarMenuRef = ref<String | null>(null)
const navbarBurgerRef = ref<String | null>(null)

const router = useRouter()
const setCategory = (category: string) => {
  console.log('Category has changed to ' + category)
  productStore.selectedCategory = category
  router.push('/')
}
// const openNewsletterModal = () => {
//   isModalActive.value = true
// }
// const closeNewsletterModal = () => {
//   isModalActive.value = false
// }
</script>
