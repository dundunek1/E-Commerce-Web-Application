<template>
  <div>
    <h2 class="subtitle">Select Delivery Method</h2>
    <div>
      <div v-for="method in deliveryMethods" :key="method.id" class="delivery-option" :class="{ 'is-selected': selectedMethod === method.id }" @click="selectMethod(method.id)">
        <input type="radio" :id="method.id" :value="method.id" v-model="selectedMethod" class="radio-hidden" />
        <label :for="method.id" class="delivery-label">
          <i class="delivery-icon is-centered" :class="method.icon"></i>
          <div class="delivery-info">
            <p class="delivery-name">{{ method.name }}</p>
            <p class="delivery-time">{{ method.time }}</p>
          </div>
          <p class="delivery-price" :class="{ 'is-free': method.price === 'for free' }">
            {{ method.price }}
          </p>
        </label>
      </div>
    </div>
    <div class="button-container">
      <button class="button is-link" @click="moveTo('goToForm')">Return to Form</button>
      <button class="button is-primary" @click="completeDeliveryForm" :disabled="!selectedMethod">Proceed to Payment</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useOrderStore } from "@/stores/shopContent";
const orderStore = useOrderStore();
const selectedMethod = ref<string | null>(null);
const emit = defineEmits(["deliverySelected", "goToForm", "goToPayment"]);

const deliveryMethods = [
  {
    id: "pickup",
    name: "Pickup in Store",
    time: "2 - 5 business days",
    price: "Free",
    icon: "fa-solid fa-store",
  },
  {
    id: "inpost_courier_online",
    name: "InPost Courier - online payment",
    time: "2 - 5 business days",
    price: "$3.00",
    icon: "fa-solid fa-truck-fast",
  },
  {
    id: "dhl_courier_online",
    name: "DHL Courier - online payment",
    time: "2 - 5 business days",
    price: "$3.00",
    icon: "fa-solid fa-truck-fast",
  },
];

const selectMethod = (id: string) => {
  selectedMethod.value = id;
};

const completeDeliveryForm = () => {
  const selectedDeliveryMethod = deliveryMethods.find((method) => method.id === selectedMethod.value);

  const deliveryData = {
    deliveryMethod: selectedMethod.value,
    deliveryPrice: selectedDeliveryMethod ? (selectedDeliveryMethod.price === "Free" ? 0 : parseFloat(selectedDeliveryMethod.price.replace("$", ""))) : null,
  };

  orderStore.setOrderData(deliveryData);
  moveTo("goToPayment");
};

type SectionPage = "deliverySelected" | "goToForm" | "goToPayment";

const moveTo = (sectionPage: SectionPage) => {
  emit(sectionPage);
};
</script>

<style scoped>
.delivery-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  margin-bottom: 0.5rem;
}

.delivery-option:hover,
.is-selected {
  border-color: #3273dc;
}

.radio-hidden {
  display: none;
}

.delivery-label {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.delivery-icon {
  margin-right: 2rem;
}

.delivery-info {
  flex-grow: 1;
}

.delivery-name {
  font-weight: bold;
}

.delivery-time {
  font-size: 0.9rem;
  color: #666;
}

.delivery-price {
  font-weight: bold;
}

.is-free {
  color: green;
}
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
</style>
