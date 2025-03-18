<template>
  <main class="column">
    <section class="login-section">
      <div class="login-form-container">
        <h2 class="title">Login</h2>
        <form @submit.prevent="login">
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" v-model="email" placeholder="Enter your email" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input class="input" type="password" v-model="password" placeholder="Enter your password" required />
            </div>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <div class="field">
            <div class="control">
              <button class="button is-link is-fullwidth" type="submit">Login</button>
            </div>
          </div>
        </form>

        <div class="signup-link">
          <p>Don't have an account? <router-link to="/register">Sign up here</router-link></p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  errorMessage.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/");
  } catch (error: any) {
    console.error("Error logging in:", error);

    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Invalid email address.";
        break;
      case "auth/user-not-found":
        errorMessage.value = "No user found with this email.";
        break;
      case "auth/wrong-password":
        errorMessage.value = "Incorrect password.";
        break;
      case "auth/too-many-requests":
        errorMessage.value = "Too many failed attempts. Try again later.";
        break;
      default:
        errorMessage.value = "Login failed. Please try again.";
        break;
    }
  }
};
</script>

<style scoped>
.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.login-form-container {
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

.signup-link {
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
  .login-form-container {
    width: 100%;
    padding: 15px;
  }
}
</style>
