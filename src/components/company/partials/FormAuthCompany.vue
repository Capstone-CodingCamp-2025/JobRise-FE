<script setup>
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  isRegisterCompany: {
    type: Boolean,
    default: true, // Jika default true, maka komponen ini defaultnya untuk login
  },
});

const company = reactive({
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
  general: "", // Tambahkan untuk pesan error umum
});

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const auth = useAuthCompanyStore();

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateForm = () => {
  let isValid = true;

  Object.keys(errors).forEach((key) => (errors[key] = ""));

  // Logika validasi untuk register (jika isRegisterCompany false)
  if (!props.isRegisterCompany) { // Jika ini adalah form register
    if (!company.name.trim()) {
      errors.name = "Company name is required";
      isValid = false;
    } else if (company.name.trim().length < 3) {
      errors.name = "Name should be at least 3 characters";
      isValid = false;
    }
  }

  if (!company.email) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!validateEmail(company.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  if (!company.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (!validatePassword(company.password)) {
    errors.password = "Password must be at least 8 characters";
    isValid = false;
  }

  // Logika validasi untuk register (jika isRegisterCompany false)
  if (!props.isRegisterCompany) { // Jika ini adalah form register
    if (!company.confirm_password) {
      errors.confirm_password = "Please confirm your password";
      isValid = false;
    } else if (company.password !== company.confirm_password) {
      errors.confirm_password = "Passwords do not match";
      isValid = false;
    }
  }

  return isValid;
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errors.general = ""; // Reset pesan error umum
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  try {
    if (props.isRegisterCompany) { // Jika ini adalah form LOGIN
      await auth.LoginCompany({
        email: company.email,
        password: company.password,
      });
      // Navigasi sudah ditangani di dalam store
    } else { // Jika ini adalah form REGISTER
      await auth.RegisterCompany(company);
      // Navigasi sudah ditangani di dalam store
    }
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.response) {
      errors.general = error.response.data?.message || "Authentication failed. Please try again.";
      if (props.isRegisterCompany) { // Error Login
        if (error.response.status === 401) {
          errors.password = "Invalid email or password.";
        }
      } else { // Error Register
        if (error.response.status === 400) {
          if (error.response.data?.errors?.email) {
            errors.email = error.response.data.errors.email[0];
          }
        }
      }
    } else {
      errors.general = "Network error. Please try again.";
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
    <div v-if="errors.general" class="text-red-500 text-sm p-2 bg-red-50 rounded">
      {{ errors.general }}
    </div>

    <div class="flex flex-col gap-y-1" v-if="!props.isRegisterCompany">
      <label for="companyName" class="font-medium"
        >Company Name <span class="text-red-600">*</span></label
      >
      <input
        id="companyName"
        class="bg-gray-100 rounded-sm text-center outline px-2 outline-blue-900 h-8"
        :class="{ 'border-red-500': errors.name }"
        type="text"
        placeholder="Your Company Name"
        required
        v-model="company.name"
      />
      <span v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</span>
    </div>

    <div class="flex flex-col gap-y-1">
      <label for="companyEmail" class="font-medium"
        >E-mail Company <span class="text-red-600">*</span></label
      >
      <input
        id="companyEmail"
        class="bg-gray-100 rounded-sm text-center outline px-2 outline-blue-900 h-8"
        :class="{ 'border-red-500': errors.email }"
        type="email"
        placeholder="Enter Email"
        required
        v-model="company.email"
        @input="validateForm"
        @blur="validateForm"
      />
      <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
    </div>

    <div class="flex flex-col gap-y-1">
      <label for="companyPassword" class="font-medium"
        >Password <span class="text-red-600">*</span></label
      >
      <div class="relative">
        <input
          id="companyPassword"
          class="bg-gray-100 rounded-sm text-center outline px-6 outline-blue-900 h-8 w-full"
          :class="{ 'border-red-500': errors.password }"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter Password"
          required
          v-model="company.password"
          @input="validateForm"
          @blur="validateForm"
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
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.4477 0-8.268-2.943-9.542-7z"
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

    <div class="flex flex-col gap-y-1 mb-2" v-if="!props.isRegisterCompany">
      <label for="confirmPassword" class="font-medium"
        >Confirm Password <span class="text-red-600">*</span></label
      >
      <div class="relative">
        <input
          id="confirmPassword"
          class="bg-gray-100 rounded-sm text-center outline px-6 outline-blue-900 h-8 w-full"
          :class="{ 'border-red-500': errors.confirm_password }"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm Password"
          required
          v-model="company.confirm_password"
          @blur="validateForm"
          @input="validateForm"
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

    <div v-show="props.isRegisterCompany" class="flex justify-between gap-2">
      <div>
        <input type="checkbox" id="saveHistory" />
        <label for="saveHistory" class="text-sm">Remember me</label>
      </div>
      <router-link :to="{ name: 'forget-password' }" class="text-blue-800 text-xs font-medium">
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
          isLoading
            ? "Processing..."
            : props.isRegisterCompany
            ? "Login"
            : "Create"
        }}
      </button>

      <p class="text-center">
        {{
          props.isRegisterCompany
            ? "Don't have an account?"
            : "Already have an account?"
        }}
        <router-link
          :to="
            props.isRegisterCompany
              ? { name: 'register-company' }
              : { name: 'login-company' }
          "
          class="text-blue-900 hover:text-blue-800"
        >
          {{ props.isRegisterCompany ? "Sign up" : "Login" }}
        </router-link>
      </p>
    </div>
  </form>
</template>