import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { Toaster, toast } from "vue-sonner";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import type { User } from "firebase/auth";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}
interface CartProduct {
  product: Product;
  quantity: number;
}
interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  invoiceCompanyName?: string;
  invoiceTaxId?: string;
  invoiceAddress?: string;
  invoiceCity?: string;
  invoiceZip?: string;
  deliveryMethod?: string | null;
  deliveryPrice?: number | null;
}

export const useProductStore = defineStore("productStore", () => {
  const selectedCategory = ref<string>("electronics");
  const products = ref<Product[]>([]);
  const allCategories = ref<string[]>([]);
  const shopCart = ref<CartProduct[]>([]);
  const isCheckOutDone = ref<boolean>(false);
  const addProductToCart = (product: Product): void => {
    const existingProduct = shopCart.value.find((item) => item.product.id === product.id);
    const userFirstName = ref<string>("");
    const userLastName = ref<string>("");
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      shopCart.value.push({ product, quantity: 1 });
    }
    toast.success("Product was added");
  };
  const removeProductFromCart = (product: Product): void => {
    const index = shopCart.value.findIndex((item) => item.product.id === product.id);
    if (index !== -1) {
      const item = shopCart.value[index];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        shopCart.value.splice(index, 1);
      }
      toast.success("Product was removed");
    }
  };
  const setCheckoutStatus = (): void => {
    isCheckOutDone.value = !isCheckOutDone.value;
  };

  const fetchProducts = async (): Promise<void> => {
    const response = await fetch("https://fakestoreapi.com/products");
    const data: Product[] = await response.json();
    console.log(data);
    products.value = data;

    const categories = [...new Set(data.map((product) => product.category))];
    allCategories.value = categories;
  };

  const filteredProducts = computed(() => products.value.filter((product) => product.category === selectedCategory.value));
  return { selectedCategory, products, isCheckOutDone, setCheckoutStatus, filteredProducts, fetchProducts, allCategories, shopCart, addProductToCart, removeProductFromCart };
});
export const useOrderStore = defineStore("orderStore", () => {
  const orderData = ref<OrderData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    invoiceCompanyName: "",
    invoiceTaxId: "",
    invoiceAddress: "",
    invoiceCity: "",
    invoiceZip: "",
    deliveryMethod: "",
    deliveryPrice: 0,
  });

  const setOrderData = (data: Partial<OrderData>) => {
    orderData.value = { ...orderData.value, ...data };
  };

  const resetOrderData = () => {
    orderData.value = {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zip: "",
      invoiceCompanyName: "",
      invoiceTaxId: "",
      invoiceAddress: "",
      invoiceCity: "",
      invoiceZip: "",
      deliveryMethod: "",
      deliveryPrice: 0,
    };
  };

  return { orderData, setOrderData, resetOrderData };
});
export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    user.value = userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    user.value = null;
  };

  return { user, register, login, logout };
});
