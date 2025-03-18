<template>
  <main class="column">
    <section class="banner">
      <figure class="image">
        <img :key="currentImage" :src="currentImage" class="banner-photo" alt="Image" />
      </figure>
      <div class="banner-text">
        <h1 class="title-banner">New products!</h1>
        <h1 class="des-banner">Only here!</h1>
        <RouterLink class="button" :to="{ path: '/', hash: '#products' }">Let's check</RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '@/stores/shopContent.ts'
import electronicsImg from '@/assets/electronics-banner.jpg'
import jeweleryImg from '@/assets/jewelery-banner.jpg'
import menClothingImg from '@/assets/men-clothing-banner.jpg'
import womenClothingImg from '@/assets/women-clothing-banner.jpg'
import defaultImg from '@/assets/electronics-banner.jpg'

const productStore = useProductStore()

const images: Record<string, string> = {
  electronics: electronicsImg,
  jewelery: jeweleryImg,
  "men's clothing": menClothingImg,
  "women's clothing": womenClothingImg,
  default: defaultImg,
}

const currentImage = computed(() => {
  return images[productStore.selectedCategory] || images.default
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Dancing+Script:wght@400..700&display=swap');

.banner {
  position: relative;
  width: 100%;
}

.banner-photo {
  width: 100%;
  height: auto;
  transition: opacity 0.1s ease-in-out;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.1s ease-in-out,
    opacity 0.1s ease-in-out;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(50%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave {
  transform: translateX(0);
  opacity: 1;
}

.banner-text {
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  text-align: left;
  color: white;
  max-width: 50%;
}

.title-banner {
  font-family: 'Anton', serif;
  font-size: 6vw;
  font-weight: bold;
}

.des-banner {
  font-family: 'Anton', serif;
  font-size: 4vw;
  margin-top: 16px;
  font-weight: normal;
}

.button {
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 1.2rem;
  border: none;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .title-banner {
    font-size: 10vw;
  }

  .des-banner {
    font-size: 6vw;
  }
}

@media (max-width: 480px) {
  .title-banner {
    font-size: 10vw;
  }

  .des-banner {
    font-size: 5vw;
  }
  .button {
    font-size: 4vw;
  }
}
</style>
