<template>
  <div class="profile-avatar">
    <i class="fas fa-user profile-icon"></i>
  </div>

  <h2 class="title is-4">Personal Information</h2>
  <p><strong>User ID:</strong> {{ user?.uid }}</p>
  <p><strong>Email:</strong> {{ user?.email }}</p>

  <div v-if="!isEditing">
    <p><strong>First Name:</strong> {{ firstName || 'Not set' }}</p>
    <p><strong>Last Name:</strong> {{ lastName || 'Not set' }}</p>
    <p><strong>Phone Number:</strong> {{ phoneNumber || 'Not set' }}</p>
    <h2 class="title mt-4 is-4">Delivery Information</h2>
    <p><strong>Invoice Address:</strong> {{ invoiceAddress || 'Not set' }}</p>
    <p><strong>City:</strong> {{ city || 'Not set' }}</p>
    <p><strong>ZIP Code:</strong> {{ zipCode || 'Not set' }}</p>
    <button class="button is-link mt-3" @click="isEditing = true">Edit</button>
    <button class="button mt-3 ml-2" @click="openDeleteModal">Delete account</button>
  </div>

  <div v-else>
    <p><strong>First Name:</strong></p>
    <input class="input mt-2" type="text" v-model="firstName" placeholder="First Name" />
    <p v-if="errors.firstName" class="error">{{ errors.firstName }}</p>

    <p><strong>Last Name:</strong></p>
    <input class="input mt-2" type="text" v-model="lastName" placeholder="Last Name" />
    <p v-if="errors.lastName" class="error">{{ errors.lastName }}</p>

    <h2 class="title mt-4 is-4">Delivery Information</h2>

    <p><strong>Phone Number:</strong></p>
    <input class="input mt-2" type="text" v-model="phoneNumber" placeholder="Phone Number" />
    <p v-if="errors.phoneNumber" class="error">{{ errors.phoneNumber }}</p>

    <p><strong>Invoice Address:</strong></p>
    <input class="input mt-2" type="text" v-model="invoiceAddress" placeholder="Invoice Address" />
    <p v-if="errors.invoiceAddress" class="error">{{ errors.invoiceAddress }}</p>

    <p><strong>City:</strong></p>
    <input class="input mt-2" type="text" v-model="city" placeholder="City" />
    <p v-if="errors.city" class="error">{{ errors.city }}</p>

    <p><strong>ZIP Code:</strong></p>
    <input class="input mt-2" type="text" v-model="zipCode" placeholder="ZIP Code" />
    <p v-if="errors.zipCode" class="error">{{ errors.zipCode }}</p>

    <button class="button is-link mt-3" @click="validateAndSave">Save</button>
    <button class="button mt-3 ml-2" @click="cancelEdit">Cancel</button>
    <button class="button mt-3 ml-2" @click="clearData">Clear</button>
  </div>
  <div class="modal" :class="{ 'is-active': isModalActive }">
    <div class="modal-background" @click="closeDeleteModal"></div>
    <div class="modal-content">
      <div class="box">
        <h2 class="title">Confirm Account Deletion</h2>
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>

        <div class="field">
          <label class="label">Enter your password to confirm</label>
          <div class="control">
            <input
              class="input"
              type="password"
              v-model="password"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div class="buttons">
          <button class="button is-danger" @click="deleteUserAccount">Delete Account</button>
          <button class="button" @click="closeDeleteModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { db, doc, getDoc, setDoc } from '@/firebaseConfig'
import { toast } from 'vue-sonner'

const user = ref<User | null>(null)
const password = ref('')
const isModalActive = ref(false)
const firstName = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const invoiceAddress = ref('')
const city = ref('')
const zipCode = ref('')
const isEditing = ref(false)
const errors = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  invoiceAddress: '',
  city: '',
  zipCode: '',
})

const validateAndSave = async () => {
  errors.value = {
    firstName: validateName(firstName.value, 'First Name'),
    lastName: validateName(lastName.value, 'Last Name'),
    phoneNumber: validatePhone(phoneNumber.value),
    invoiceAddress: validateAddress(invoiceAddress.value),
    city: validateCity(city.value),
    zipCode: validateZip(zipCode.value),
  }

  if (Object.values(errors.value).every((error) => !error)) {
    await saveProfile()
  } else {
    toast.error('Please fix the validation errors.')
  }
}

const validateName = (value: string, fieldName: string) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{0,}$/.test(value)
    ? ''
    : `${fieldName} must contain only letters and be at least 2 characters long.`
}

const validatePhone = (value: string) => {
  return /^\d{9,15}$/.test(value) ? '' : 'Phone number must contain only digits (min 9, max 15).'
}

const validateAddress = (value: string) => {
  return value.length >= 0 ? '' : 'Address must be at least 5 characters long.'
}

const validateCity = (value: string) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{0,}$/.test(value)
    ? ''
    : 'City must contain only letters and be at least 2 characters long.'
}

const validateZip = (value: string) => {
  return /^\d{0,15}$/.test(value) ? '' : 'ZIP Code must be in the format XXXXX.'
}

const saveProfile = async () => {
  if (!user.value) return

  try {
    await setDoc(
      doc(db, 'users', user.value.uid),
      {
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        invoiceAddress: invoiceAddress.value,
        city: city.value,
        zipCode: zipCode.value,
      },
      { merge: true },
    )

    toast.success('Profile updated successfully!')
    isEditing.value = false
  } catch (error: any) {
    toast.error('Error updating profile: ' + error.message)
  }
}

const cancelEdit = () => {
  isEditing.value = false
}
const clearData = async () => {
  firstName.value = ''
  lastName.value = ''
  phoneNumber.value = ''
  invoiceAddress.value = ''
  city.value = ''
  zipCode.value = ''
  isEditing.value = false
  saveProfile()
  toast.success('Profile data cleared successfully!')
}
const loadProfile = async () => {
  const auth = getAuth()
  user.value = auth.currentUser

  if (user.value) {
    const userDoc = await getDoc(doc(db, 'users', user.value.uid))
    if (userDoc.exists()) {
      const data = userDoc.data()
      firstName.value = data.firstName || ''
      lastName.value = data.lastName || ''
      phoneNumber.value = data.phoneNumber || ''
      invoiceAddress.value = data.invoiceAddress || ''
      city.value = data.city || ''
      zipCode.value = data.zipCode || ''
    }
  }
}

const deleteUserAccount = async () => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  if (currentUser) {
    try {
      if (!password.value) {
        toast.error('Please enter your password to confirm.')
        return
      }

      const credential = EmailAuthProvider.credential(currentUser.email!, password.value)

      await reauthenticateWithCredential(currentUser, credential)

      await currentUser.delete()

      toast.success('Your account has been successfully deleted.')
      closeDeleteModal()
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error('You need to re-login to perform this action.')
      } else {
        toast.error('Error deleting account: ' + error.message)
      }
      closeDeleteModal()
    }
  } else {
    toast.error('No user is logged in.')
    closeDeleteModal()
  }
}
const openDeleteModal = () => {
  isModalActive.value = true
}

const closeDeleteModal = () => {
  isModalActive.value = false
}
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-avatar {
  width: 100px;
  height: 100px;
  border: 5px solid #555;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #555;
  margin: 0 auto 10px;
}

.profile-icon {
  font-size: 50px;
}
.modal {
  z-index: 99999999999999999999999;
}
.error {
  color: red;
  font-size: 0.9em;
  margin-top: 2px;
}
</style>
