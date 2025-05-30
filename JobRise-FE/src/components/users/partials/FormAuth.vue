<script setup>
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // Import SweetAlert2

const router = useRouter();
const props = defineProps({
  isRegister: {
    type: Boolean,
    default: true,
  },
});

const user = reactive({
  name: "",
  email: "",
  password: "",
  confirm_password: "",
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  general: "",
});

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const auth = AuthUserStorage();

// Add these toggle functions
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const validateName = (name) => {
  const re = /^[a-zA-Z\s]*$/;
  return re.test(name);
};

// Validasi email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validasi password
const validatePassword = (password) => {
  return password.length >= 8;
};

// Validasi form
const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  if (!props.isRegister) {
    if (!user.name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    } else if (!validateName(user.name)) {
      errors.name =
        "Name should only contain letters (no numbers or special characters)";
      isValid = false;
    } else if (user.name.trim().length < 3) {
      errors.name = "Name should be at least 3 characters";
      isValid = false;
    }
  }

  if (!user.email) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!validateEmail(user.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  if (!user.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (!validatePassword(user.password)) {
    errors.password = "Password must be at least 8 characters";
    isValid = false;
  }

  if (!props.isRegister) {
    if (!user.confirm_password) {
      errors.confirm_password = "Please confirm your password";
      isValid = false;
    } else if (user.password !== user.confirm_password) {
      errors.confirm_password = "Passwords do not match";
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errors.general = "";

  try {
    if (props.isRegister) {
      // Login - logika redirect dan penolakan role company ada di store
      const loginSuccess = await auth.LoginUser({
        email: user.email,
        password: user.password,
      });

      // Hanya redirect ke dashboard jika login berhasil dan bukan role company
      if (loginSuccess === true) {
        router.push({ name: "dashboard" });
      }
      // Jika login ditolak (kembali false dari store), tidak ada redirect ke dashboard
      // karena redirect ke login sudah ditangani di store.
    } else {
      // Register
      await auth.RegisterUser(user);
      router.push({ name: "login" });
    }
  } catch (error) {
    console.error("Authentication error:", error);

    // Handle error spesifik untuk login
    if (props.isRegister) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.message?.toLowerCase() || "";
        if (errorMessage.includes("email") || errorMessage.includes("user")) {
          errors.general = "Unregistered or invalid email";
        } else if (errorMessage.includes("password")) {
          errors.general = "Password is wrong!";
        } else {
          errors.general = "Invalid e-mail or password";
        }
      } else {
        errors.general = error.message || "Login failed. Please try again.";
      }
    } else {
      // Handle error untuk registrasi
      if (error.response && error.response.status === 400) {
        errors.general = "Email already registered or invalid data";
      } else {
        errors.general =
          error.message || "Registration failed. Please try again.";
      }
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-y-3 px-8 py-6 md:px-16 lg:px-24 lg:py-6 xl:py-8"
  >
    <div
      v-if="errors.general"
      class="text-red-500 text-sm p-2 bg-red-50 rounded"
    >
      {{ errors.general }}
    </div>

    <div class="flex flex-col gap-y-1" v-if="!props.isRegister">
      <label for="fullName" class="font-medium"
        >Full Name <span class="text-red-600">*</span></label
      >
      <input
        id="fullName"
        class="bg-gray-100 rounded-sm text-center outline outline-blue-800 h-8"
        :class="{ 'border-red-500': errors.name }"
        type="text"
        placeholder="Your Full Name"
        v-model="user.name"
        @input="validateForm"
        @blur="validateForm"
        required
      />
      <span v-if="errors.name" class="text-red-500 text-xs">{{
        errors.name
      }}</span>
    </div>

    <div class="flex flex-col gap-y-1">
      <label for="email" class="font-medium"
        >E-mail <span class="text-red-600">*</span></label
      >
      <input
        id="email"
        class="bg-gray-100 rounded-sm text-center outline outline-blue-900 h-8"
        :class="{ 'border-red-500': errors.email }"
        type="email"
        placeholder="Enter Email"
        v-model="user.email"
        @input="validateForm"
        @blur="validateForm"
        required
      />
      <span v-if="errors.email" class="text-red-500 text-xs">{{
        errors.email
      }}</span>
    </div>

    <div class="flex flex-col gap-y-1">
      <label for="password" class="font-medium"
        >Password <span class="text-red-600">*</span></label
      >
      <div class="relative">
        <input
          id="password"
          class="bg-gray-100 rounded-sm text-center outline outline-blue-900 h-8 w-full"
          :class="{ 'border-red-500': errors.password }"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter Password"
          v-model="user.password"
          @input="validateForm"
          @blur="validateForm"
          required
        />
        <button
          type="button"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          @click="togglePasswordVisibility"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              v-if="!showPassword"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              v-else
            />
          </svg>
        </button>
      </div>
      <span v-if="errors.password" class="text-red-500 text-xs">{{
        errors.password
      }}</span>
    </div>

    <div class="flex flex-col gap-y-1 mb-2" v-if="!props.isRegister">
      <label for="confirmPassword" class="font-medium"
        >Confirm Password <span class="text-red-600">*</span></label
      >
      <div class="relative">
        <input
          id="confirmPassword"
          class="bg-gray-100 rounded-sm text-center outline outline-blue-900 h-8 w-full"
          :class="{ 'border-red-500': errors.confirm_password }"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm Password"
          v-model="user.confirm_password"
          @input="validateForm"
          @blur="validateForm"
          required
        />
        <button
          type="button"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          @click="toggleConfirmPasswordVisibility"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              v-if="!showConfirmPassword"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              v-else
            />
          </svg>
        </button>
      </div>
      <span v-if="errors.confirm_password" class="text-red-500 text-xs">{{
        errors.confirm_password
      }}</span>
    </div>

    <div class="flex justify-between">
      <div>
        <input type="checkbox" id="saveHistory" />
        <label for="saveHistory" class="text-sm">Remember me</label>
      </div>
      <router-link :to="{name: 'forget-password'}" class="text-blue-800 text-xs font-medium">
      Forget Password?</router-link
      >
    </div>

    <div class="flex flex-col">
      <button
        type="submit"
        class="bg-[#0c1f61d3] py-1 pb-2 rounded-lg text-white text-2xl mb-2"
        :class="{
          'hover:bg-sky-700 cursor-pointer': !isLoading,
          'opacity-50 cursor-not-allowed': isLoading,
        }"
        :disabled="isLoading"
      >
        {{
          isLoading ? "Processing..." : props.isRegister ? "Login" : "Create"
        }}
      </button>
      <p class="text-center">
        {{
          props.isRegister
            ? "Don't have any account?"
            : "Already have any account?"
        }}
        <router-link
          :to="props.isRegister ? { name: 'register' } : { name: 'login' }"
          class="text-blue-900 hover:text-blue-800"
        >
          {{ props.isRegister ? "Sign up" : "Login" }}
        </router-link>
      </p>
    </div>
  </form>
</template>
