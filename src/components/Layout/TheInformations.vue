<template>
  <section class="column" id="contact">
    <div class="box newsletter-content" id="subscribe">
      <div class="field field-contact column is-full-mobile is-half-tablet is-one-third-desktop">
        <form class="field" @submit.prevent="sendSubscribe">
          <p class="title">Contact</p>
          <p class="subtitle">Questions? Go ahead.</p>
          <div class="control">
            <input class="input" type="text" v-model="name" placeholder="Name" />
          </div>
          <div class="control">
            <input class="input" type="email" v-model="email" placeholder="Email" />
          </div>
          <div class="control">
            <input class="input" type="text" v-model="subject" placeholder="Subject" />
          </div>
          <div class="control">
            <input class="input" type="text" v-model="message" placeholder="Message" />
          </div>
          <div class="control has-text-left">
            <button class="button is-link">Submit</button>
          </div>
        </form>
      </div>

      <div class="field field-about column is-full-mobile is-half-tablet is-one-third-desktop">
        <p class="title">About</p>
        <ul class="list list-underline">
          <li>About us</li>
          <li>We're hiring</li>
          <li>Support</li>
          <li>Find Store</li>
          <li>Shipment</li>
          <li>Payment</li>
          <li>Gift card</li>
          <li>Return</li>
          <li>Help</li>
        </ul>
      </div>

      <div class="field column is-full-mobile is-half-tablet is-one-third-desktop">
        <p class="title">Store</p>
        <ul class="list">
          <li><i class="fa-solid fa-location-dot mr-3"></i>Company Name</li>
          <li><i class="fa-solid fa-phone mr-3"></i>0044123123</li>
          <li><i class="fa-solid fa-envelope mr-3"></i>ex@mail.com</li>
        </ul>
        <p>We accept</p>
        <ul class="list mb-4">
          <li><i class="fa-solid fa-credit-card mr-3"></i>Amex</li>
          <li><i class="fa-brands fa-cc-visa mr-3"></i>Credit Card</li>
        </ul>

        <div>
          <i class="fa-brands fa-facebook-f mr-2"></i>
          <i class="fa-brands fa-instagram mr-2"></i>
          <i class="fa-brands fa-snapchat mr-2"></i>
          <i class="fa-brands fa-x-twitter mr-2"></i>
          <i class="fa-brands fa-linkedin-in mr-2"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')

const sendSubscribe = () => {
  if (!name.value || !email.value || !subject.value || !message.value) {
    toast.error('All fields must be filled!')
    return
  }

  if (!validateEmail(email.value)) {
    toast.error('Invalid email address!')
    return
  }

  const promise = new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2 ? resolve() : reject()
    }, 2000)
  })

  toast.promise(promise, {
    loading: 'Sending form...',
    success: () => {
      name.value = ''
      email.value = ''
      subject.value = ''
      message.value = ''
      return 'Form has been successfully sent!'
    },
    error: () => 'Form submission failed. Please try again!',
  })
}

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
</script>

<style scoped>
.newsletter-content {
  padding: 3.5rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.title {
  font-size: 20px;
}

.subtitle {
  font-size: 14px;
}

.control {
  margin-top: 3%;
}

.list li {
  font-size: 12px;
  margin-top: 3%;
}

.list-underline {
  text-decoration: underline;
}

.field-about,
.field-contact {
  text-align: center;
}

.field-contact {
  display: flex;
  flex-direction: column;
}

input.input {
  width: 100%;
}

@media (max-width: 768px) {
  .field-about,
  .field-contact {
    text-align: left;
  }

  #subscribe {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .field {
    flex: 1 1 100%;
    padding: 0;
  }
}
</style>
