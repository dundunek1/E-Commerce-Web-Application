<template>
  <section class="section is-medium">
    <div class="container has-text-centered">
      <div class="box notification is-primary">
        <i class="fas fa-check-circle fa-3x mb-3"></i>
        <h2 class="title is-4">Thank you for purchasing in our store</h2>
        <p>We hope that all products meet your expectations.</p>
        <p class="mt-3">
          You will be redirected to the home page in <strong>{{ countdown }}</strong> seconds.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const countdown = ref(5)
const router = useRouter()

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      router.push('/')
    }
  }, 1000)
})
</script>

<style scoped>
.section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  max-width: 110vh;
}

.box {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notification {
  padding: 2rem;
  position: relative;
  background-color: #3273dc;
  color: white;
}

.notification i {
  color: white;
}

.notification .title {
  margin-top: 1rem;
  color: white;
}

.notification p {
  color: white;
}

.notification p strong {
  color: white;
}
</style>
