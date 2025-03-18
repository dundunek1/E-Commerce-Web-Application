import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import TheShop from '@/components/TheShop.vue'
import TheShopCart from '@/components/shop/TheShopCart.vue'
import TheProductDetails from '@/components/shop/TheProductDetails.vue'
import TheCheckPage from '@/components/shop/TheCheckOut.vue'
import TheLogin from '@/components/auth/TheLogin.vue'
import TheRegister from '@/components/auth/TheRegister.vue'
import TheProfile from '@/components/profile/TheProfile.vue'
import TheThanks from '@/components/Layout/TheThanks.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: TheShop,
  },
  {
    path: '/ShopCartService',
    name: 'ShopCart',
    component: TheShopCart,
    meta: { requiresAuth: true },
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: TheProductDetails,
    props: true,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: TheCheckPage,
    meta: { hideNav: true, requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: TheLogin,
    meta: { hideNav: true },
  },
  {
    path: '/register',
    name: 'register',
    component: TheRegister,
    meta: { hideNav: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: TheProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/thankyou',
    name: 'Thanks',
    component: TheThanks,
    meta: { hideNav: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return savedPosition || { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const auth = getAuth()

  const user = await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => resolve(user))
  })

  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
