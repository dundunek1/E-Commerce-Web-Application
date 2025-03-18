<template>
  <form @submit.prevent="goToDelivery" class="checkout-form">
    <h2 class="subtitle">Personal Information</h2>

    <div class="field">
      <label class="label">Full Name</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="text"
          v-model="fullName"
          @input="validateField('name')"
          required
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
      <p v-if="errors.name" class="error">{{ errors.name }}</p>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="email"
          v-model="email"
          @input="validateField('email')"
          required
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
      <p v-if="errors.email" class="error">{{ errors.email }}</p>
    </div>

    <div class="field">
      <label class="label">Phone Number</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="tel"
          v-model="phoneNumber"
          @input="validateField('phone')"
          required
        />
        <span class="icon is-small is-left">
          <i class="fas fa-phone"></i>
        </span>
      </div>
      <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
    </div>

    <h2 class="subtitle">Shipping Address</h2>

    <div class="field">
      <label class="label">Street Address</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="text"
          v-model="invoiceAddress"
          @input="validateField('address')"
          required
        />
        <span class="icon is-small is-left">
          <i class="fas fa-map-marker-alt"></i>
        </span>
      </div>
      <p v-if="errors.address" class="error">{{ errors.address }}</p>
    </div>

    <div class="columns">
      <div class="column">
        <label class="label">City</label>
        <div class="control has-icons-left">
          <input class="input" type="text" v-model="city" @input="validateField('city')" required />
          <span class="icon is-small is-left">
            <i class="fas fa-city"></i>
          </span>
        </div>
        <p v-if="errors.city" class="error">{{ errors.city }}</p>
      </div>

      <div class="column">
        <label class="label">ZIP Code</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            v-model="zipCode"
            @input="validateField('zip')"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-mail-bulk"></i>
          </span>
        </div>
        <p v-if="errors.zip" class="error">{{ errors.zip }}</p>
      </div>
    </div>

    <div class="field">
      <label class="checkbox">
        <input type="checkbox" v-model="invoiceDifferent" />
        Invoice details different from personal details
      </label>
    </div>

    <div v-if="invoiceDifferent">
      <h2 class="subtitle">Invoice Details</h2>

      <div class="field">
        <label class="label">Company Name</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            v-model="invoice.companyName"
            @input="validateField('invoiceCompanyName')"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-building"></i>
          </span>
        </div>
        <p v-if="errors.invoiceCompanyName" class="error">{{ errors.invoiceCompanyName }}</p>
      </div>

      <div class="field">
        <label class="label">Tax ID</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            v-model="invoice.taxId"
            @input="validateField('invoiceTaxId')"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-id-card"></i>
          </span>
        </div>
        <p v-if="errors.invoiceTaxId" class="error">{{ errors.invoiceTaxId }}</p>
      </div>

      <div class="field">
        <label class="label">Invoice Address</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            v-model="invoice.address"
            @input="validateField('invoiceAddress')"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-map-marker-alt"></i>
          </span>
        </div>
        <p v-if="errors.invoiceAddress" class="error">{{ errors.invoiceAddress }}</p>
      </div>

      <div class="columns">
        <div class="column">
          <label class="label">City</label>
          <div class="control has-icons-left">
            <input
              class="input"
              type="text"
              v-model="invoice.city"
              @input="validateField('invoiceCity')"
              required
            />
            <span class="icon is-small is-left">
              <i class="fas fa-city"></i>
            </span>
          </div>
          <p v-if="errors.invoiceCity" class="error">{{ errors.invoiceCity }}</p>
        </div>

        <div class="column">
          <label class="label">ZIP Code</label>
          <div class="control has-icons-left">
            <input
              class="input"
              type="text"
              v-model="invoice.zip"
              @input="validateField('invoiceZip')"
              required
            />
            <span class="icon is-small is-left">
              <i class="fas fa-mail-bulk"></i>
            </span>
          </div>
          <p v-if="errors.invoiceZip" class="error">{{ errors.invoiceZip }}</p>
        </div>
      </div>
    </div>

    <button class="button is-primary is-right" :disabled="!isFormValid">Proceed to Delivery</button>
  </form>
</template>
<script setup lang="ts">
import { ref, computed, defineEmits, onMounted, watch, watchEffect } from 'vue'
import { getAuth } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { db, doc, getDoc } from '@/firebaseConfig'
import { useProductStore } from '@/stores/shopContent'
import { useOrderStore } from '@/stores/shopContent'

const orderStore = useOrderStore()
const productStore = useProductStore()
const emit = defineEmits(['goToDelivery'])

const user = ref<User | null>(null)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const invoiceAddress = ref('')
const city = ref('')
const zipCode = ref('')

const invoiceDifferent = ref(false)
const invoice = ref({
  companyName: '',
  taxId: '',
  address: '',
  city: '',
  zip: '',
})

const errors = ref<Record<string, string>>({})

const fullName = computed(() => `${firstName.value} ${lastName.value}`)

const customer = computed(() => ({
  name: fullName.value,
  email: email.value,
  phone: phoneNumber.value,
  address: invoiceAddress.value,
  city: city.value,
  zip: zipCode.value,
}))

const loadData = async () => {
  const auth = getAuth()
  user.value = auth.currentUser

  if (user.value) {
    const userDoc = await getDoc(doc(db, 'users', user.value.uid))
    if (userDoc.exists()) {
      const data = userDoc.data()
      console.log('User data:', data)

      firstName.value = data.firstName || ''
      lastName.value = data.lastName || ''
      email.value = data.email || ''
      phoneNumber.value = data.phoneNumber || ''
      invoiceAddress.value = data.invoiceAddress || ''
      city.value = data.city || ''
      zipCode.value = data.zipCode || ''

      validateAllFields()
    }
  }
}

const validateField = (field: string) => {
  if (field.startsWith('invoice')) {
    const key = field.replace('invoice', '').toLowerCase() as keyof typeof invoice.value
    const value = invoice.value[key]

    if (key === 'companyName') {
      errors.value.invoiceCompanyName = value.length >= 3 ? '' : 'Must be at least 3 characters.'
    }
    if (key === 'taxId') {
      errors.value.invoiceTaxId = /^[0-9]{10}$/.test(value) ? '' : 'Invalid Tax ID (10 digits).'
    }
    if (key === 'address') {
      errors.value.invoiceAddress = value.length >= 5 ? '' : 'Must be at least 5 characters.'
    }
    if (key === 'city') {
      errors.value.invoiceCity = value.length >= 2 ? '' : 'Must be at least 2 characters.'
    }
    if (key === 'zip') {
      errors.value.invoiceZip = /^[0-9]{5}$/.test(value) ? '' : 'ZIP Code must be 5 digits.'
    }
  } else {
    const key = field as keyof typeof customer.value
    const value = customer.value[key]

    if (key === 'name') {
      errors.value.name = value.length >= 3 ? '' : 'Name must be at least 3 characters.'
    }
    if (key === 'email') {
      errors.value.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address.'
    }
    if (key === 'phone') {
      errors.value.phone = /^[0-9]{9,15}$/.test(value) ? '' : 'Invalid phone number (9-15 digits).'
    }
    if (key === 'address') {
      errors.value.address = value.length >= 5 ? '' : 'Must be at least 5 characters.'
    }
    if (key === 'city') {
      errors.value.city = value.length >= 2 ? '' : 'Must be at least 2 characters.'
    }
    if (key === 'zip') {
      errors.value.zip = /^[0-9]{5}$/.test(value) ? '' : 'ZIP Code must be 5 digits.'
    }
  }
}

const validateAllFields = () => {
  Object.keys(errors.value).forEach((field) => validateField(field))
}

const isFormValid = computed(() => {
  const allErrorsEmpty = Object.values(errors.value).every((error) => error === '')
  const allCustomerFilled = Object.values(customer.value).every((value) => value.trim() !== '')
  const allInvoiceFilled = invoiceDifferent.value
    ? Object.values(invoice.value).every((value) => value.trim() !== '')
    : true

  return allErrorsEmpty && allCustomerFilled && allInvoiceFilled
})

const copyShippingToInvoice = () => {
  invoice.value.address = customer.value.address
  invoice.value.city = customer.value.city
  invoice.value.zip = customer.value.zip
}

watch(invoiceDifferent, (newValue) => {
  if (!newValue) {
    invoice.value = { companyName: '', taxId: '', address: '', city: '', zip: '' }
  }
})

const goToDelivery = () => {
  validateAllFields()
  if (isFormValid.value) {
    productStore.isCheckOutDone = true
    orderStore.setOrderData(customer.value)
    emit('goToDelivery')
  }
}

onMounted(() => {
  loadData()
})
</script>
