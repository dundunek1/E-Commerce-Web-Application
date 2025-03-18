<template>
  <section class="column" id="subscribe">
    <form class="card" id="newsletter" @submit.prevent="sendSubscribe">
      <p>Subscribe</p>
      <div class="field">
        <label class="label">To get special offers and VIP treatment:</label>
        <div class="control">
          <input class="input" type="text" placeholder="Enter e-mail" v-model="email" />
        </div>
        <button class="button">Subscribe</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";

const email = ref("");

const sendSubscribe = () => {
  if (!validateEmail(email.value)) {
    toast.error("Invalid email address! Please enter a valid email.");
    return;
  }

  const promise = new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2 ? resolve() : reject();
    }, 2000);
  });

  toast.promise(promise, {
    loading: "Processing...",
    success: () => {
      email.value = "";
      return "You have successfully subscribed! 🎉";
    },
    error: () => "Subscription failed. Try again!",
  });
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
</script>

<style scoped>
.card {
  padding: 3.5rem 1.5rem;
  p {
    font-size: 36px;
    margin-bottom: 1rem;
  }
  label {
    font-size: 15px;
    font-weight: 100;
  }
  label,
  input,
  button {
    margin-top: 1%;
  }
}
</style>
