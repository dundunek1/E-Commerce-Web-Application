<template>
  <form @submit.prevent="submitPayment" class="payment-form">
    <h2 class="subtitle">Payment Method</h2>

    <div class="field">
      <label class="label">Select Payment Option</label>
      <div class="control">
        <div class="payment-option" :class="{ 'is-selected': paymentMethod === 'credit-card' }">
          <input type="radio" id="credit-card" value="credit-card" v-model="paymentMethod" class="radio-hidden" />
          <label for="credit-card" class="payment-label">
            <i class="payment-icon is-centered fa-solid fa-credit-card"></i>
            <div class="payment-info">
              <p class="payment-name">Credit Card</p>
            </div>
          </label>
        </div>
        <div class="payment-option" :class="{ 'is-selected': paymentMethod === 'blik' }">
          <input type="radio" id="blik" value="blik" v-model="paymentMethod" class="radio-hidden" />
          <label for="blik" class="payment-label">
            <i class="payment-icon is-centered fa-solid fa-mobile"></i>
            <div class="payment-info">
              <p class="payment-name">BLIK</p>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div v-if="paymentMethod === 'credit-card'">
      <h3 class="subtitle is-5">Credit Card Details</h3>

      <div class="field">
        <label class="label">Card Number</label>
        <div class="control has-icons-left">
          <input class="input" type="text" v-model="cardDetails.number" placeholder="1234 5678 9012 3456" @input="validateField('number')" required />
          <span class="icon is-small is-left">
            <i class="fas fa-credit-card"></i>
          </span>
        </div>
        <p v-if="errors.number" class="help is-danger">{{ errors.number }}</p>
      </div>

      <div class="columns">
        <div class="column">
          <label class="label">Expiry Date</label>
          <div class="control">
            <input class="input" type="text" v-model="cardDetails.expiry" placeholder="MM/YY" @input="validateField('expiry')" required />
          </div>
          <p v-if="errors.expiry" class="help is-danger">{{ errors.expiry }}</p>
        </div>

        <div class="column">
          <label class="label">CVV</label>
          <div class="control">
            <input class="input" type="text" v-model="cardDetails.cvv" placeholder="***" @input="validateField('cvv')" required />
          </div>
          <p v-if="errors.cvv" class="help is-danger">{{ errors.cvv }}</p>
        </div>
      </div>
    </div>

    <div v-if="paymentMethod === 'blik'">
      <h3 class="subtitle is-5">BLIK Payment</h3>
      <div class="field">
        <label class="label">BLIK Code</label>
        <div class="control">
          <input class="input" type="text" v-model="blikCode" placeholder="6-digit BLIK code" @input="validateField('blik')" required />
        </div>
        <p v-if="errors.blik" class="help is-danger">{{ errors.blik }}</p>
      </div>
    </div>

    <div class="button-container">
      <button class="button is-link" @click="goToDelivery">Back to Delivery</button>
      <button class="button is-success" :disabled="!isFormValid">Complete Payment</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { db } from "@/firebaseConfig";
import { useProductStore } from "@/stores/shopContent.ts";
import { useOrderStore } from "@/stores/shopContent";
import cardValidator from "card-validator";

const orderStore = useOrderStore();
const router = useRouter();
const paymentMethod = ref("credit-card");
const productStore = useProductStore();
const emit = defineEmits(["goToDelivery"]);
const cardDetails = ref({ number: "", expiry: "", cvv: "" });
const blikCode = ref("");
const errors = ref({ number: "", expiry: "", cvv: "", blik: "" });
const isLoading = ref(false);
const user = ref<User | null>(null);


const validateField = (field: string) => {
  if (field === "number") {
    const cardNumber = cardValidator.number(cardDetails.value.number);
    errors.value.number = cardNumber.isValid ? "" : "Invalid card number.";
  }
  if (field === "expiry") {
    const expiry = cardValidator.expirationDate(cardDetails.value.expiry);
    errors.value.expiry = expiry.isValid ? "" : "Invalid expiry date (MM/YY).";
  }
  if (field === "cvv") {
    errors.value.cvv = /^\d{3}$/.test(cardDetails.value.cvv) ? "" : "Invalid CVV (must be 3 digits).";
  }
  if (field === "blik") {
    errors.value.blik = /^\d{6}$/.test(blikCode.value) ? "" : "BLIK code must be 6 digits.";
  }
};

const isFormValid = computed(() => {
  if (paymentMethod.value === "credit-card") {
    return Object.values(errors.value).every((error) => error === "") && Object.values(cardDetails.value).every((value) => value !== "");
  } else if (paymentMethod.value === "blik") {
    return errors.value.blik === "" && blikCode.value !== "";
  }
  return false;
});

const handleAuthStateChange = (loggedInUser: User | null) => {
  if (loggedInUser) {
    user.value = loggedInUser;
  } else {
    toast.error("You must be logged in to place an order.");
    router.push("/login");
  }
};

const generateOrderNumber = (uid: string): string => {
  const now = new Date();
  const formattedDate = now
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
  const shortUid = uid.slice(0, 4).toUpperCase();
  return `${formattedDate}${shortUid}`;
};

const goToDelivery = () => {
  emit("goToDelivery");
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (loggedInUser) => {
    handleAuthStateChange(loggedInUser);
  });
});

const submitPayment = async () => {
  if (!user.value) {
    toast.error("Please log in to continue.");
    return;
  }

  if (!isFormValid.value) {
    toast.error("Please fill in all required fields correctly.");
    return;
  }

  isLoading.value = true;

  try {
    const orderData = {
      userId: user.value.uid,
      products: productStore.shopCart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: productStore.shopCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2),
      orderNumber: generateOrderNumber(user.value.uid),
      paymentMethod: paymentMethod.value,
      paymentDetails: paymentMethod.value === "credit-card" ? cardDetails.value : { blikCode: blikCode.value },
      date: new Date().toISOString(),
      customerName: orderStore.orderData.name,
      customerEmail: orderStore.orderData.email,
      customerPhone: orderStore.orderData.phone,
      customerAddress: orderStore.orderData.address,
      city: orderStore.orderData.city,
      zip: orderStore.orderData.zip,
      invoiceCompanyName: orderStore.orderData.invoiceCompanyName,
      invoiceTaxId: orderStore.orderData.invoiceTaxId,
      invoiceAddress: orderStore.orderData.invoiceAddress,
      invoiceCity: orderStore.orderData.invoiceCity,
      invoiceZip: orderStore.orderData.invoiceZip,
      deliveryMethod: orderStore.orderData.deliveryMethod,
    };

    if (productStore.isCheckOutDone) {
      await addDoc(collection(db, "orders"), orderData);
      productStore.shopCart = [];
      toast.success("Payment successful! Order placed.");
      router.push("/thankyou");
    } else {
      toast.error("Please go back and complete checkout process.");
    }
  } catch (error: any) {
    toast.error(`Error: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};
</script>


<style scoped>
.help.is-danger {
  font-size: 0.9rem;
}
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.field {
  margin-bottom: 1rem;
}

.label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.control {
  display: flex;
  flex-direction: column;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  margin-bottom: 0.5rem;
}

.payment-option:hover,
.is-selected {
  border-color: #3273dc;
}

.radio-hidden {
  display: none;
}

.payment-label {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.payment-icon {
  margin-right: 2rem;
}

.payment-info {
  flex-grow: 1;
}

.payment-name {
  font-weight: bold;
}
</style>
