<template>
  <main class="column">
    <section class="register-section">
      <div class="register-form-container">
        <h2 class="title">Register</h2>
        <form @submit.prevent="register">
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" v-model="email" placeholder="Enter your email" required />
            </div>
          </div>
          <div class="field">
            <label class="label">First Name</label>
            <div class="control">
              <input class="input" v-model="firstName" placeholder="Your First Name" />
            </div>
          </div>
          <div class="field">
            <label class="label">Last Name</label>
            <div class="control">
              <input class="input" v-model="lastName" placeholder="Your Last Name" />
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input class="input" type="password" v-model="password" placeholder="Enter your password" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Confirm Password</label>
            <div class="control">
              <input class="input" type="password" v-model="confirmPassword" placeholder="Confirm your password" required />
            </div>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <div class="field">
            <div class="control">
              <button class="button is-link is-fullwidth" type="submit">Register</button>
            </div>
          </div>
        </form>
        <div class="login-link">
          <p>Already have an account? <router-link to="/login">Login here</router-link></p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";
import { useRouter } from "vue-router";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import type { User } from "firebase/auth";
import { db, doc, getDoc, setDoc } from "@/firebaseConfig";

const email = ref("");
const firstName = ref("");
const lastName = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const router = useRouter();

const register = async () => {
  errorMessage.value = "";
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    const userData: any = {};
    userData.email = email.value;
    if (firstName.value.trim()) {
      userData.firstName = firstName.value;
    }

    if (lastName.value.trim()) {
      userData.lastName = lastName.value;
    }

    if (Object.keys(userData).length > 0) {
      await setDoc(doc(db, "users", user.uid), userData, { merge: true });
    }

    router.push("/");
  } catch (error: any) {
    console.error("Registration error:", error);

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage.value = "Email is already in use.";
        break;
      case "auth/invalid-email":
        errorMessage.value = "Invalid email address.";
        break;
      case "auth/weak-password":
        errorMessage.value = "Password is too weak.";
        break;
      default:
        errorMessage.value = "Registration failed. Please try again.";
        break;
    }
  }
};
</script>

<style scoped>
.register-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.register-form-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.field {
  margin-bottom: 15px;
}

.input {
  width: 100%;
}

.button {
  width: 100%;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: center;
}

@media (max-width: 768px) {
  .register-form-container {
    width: 100%;
    padding: 15px;
  }
}
</style>
