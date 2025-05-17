<script setup>
import { reactive, ref } from 'vue';
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthCompanyStore();

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
  general: ""
});

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const props = defineProps({
  isRegisterCompany: {
    type: Boolean,
    default: true,
  },
});

// Toggle view password
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Toggle view confirm password
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const validateCompanyName = (name) => {
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
  Object.keys(errors).forEach(key => errors[key] = "");
  
  if (!props.isRegisterCompany) {
    if (!company.name.trim()) {
      errors.name = "Company name is required";
      isValid = false;
    } else if (!validateCompanyName(company.name)) {
      errors.name = "Company name should only contain letters";
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
  
  if (!props.isRegisterCompany) {
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

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  errors.general = "";
  
  try {
    console.log("Submitting:", company);
    
    if (props.isRegisterCompany) {
      await auth.LoginCompany({
        email: company.email,
        password: company.password
      });
      await auth.getCompanyByAuth();
    } else {
      await auth.RegisterCompany(company);
    }
    
    // Redirect after successful auth
    router.push({ name: 'dashboard-company' });
  } catch (error) {
    console.error("Authentication error:", error);
    errors.general = error.message || "Authentication failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-3 px-8 py-6 md:px-16 lg:px-24 lg:py-8 xl:py-12">
    <!-- Error message general -->
    <div v-if="errors.general" class="text-red-500 text-sm p-2 bg-red-50 rounded">
      {{ errors.general }}
    </div>
    
    <!-- Company Name Field -->
    <div class="flex flex-col gap-y-1" v-if="!props.isRegisterCompany">
      <label for="companyName" class="font-bold">Company Name*</label>
      <input
        id="companyName"
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        :class="{ 'border-red-500': errors.name }"
        type="text"
        placeholder="Your Company Name"
        required
        v-model="company.name"
        @input="validateForm"
        @blur="validateForm"
      />
      <span v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</span>
    </div>
    
    <!-- Email Field -->
    <div class="flex flex-col gap-y-1">
      <label for="companyEmail" class="font-bold">E-mail Company*</label>
      <input
        id="companyEmail"
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        :class="{ 'border-red-500': errors.email }"
        type="email"
        placeholder="Enter Email"
        required
        v-model="company.email"
        @blur="validateForm"
      />
      <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
    </div>
    
    <!-- Password Field -->
    <div class="flex flex-col gap-y-1">
      <label for="companyPassword" class="font-bold">Password*</label>
      <div class="relative">
        <input
          id="companyPassword"
          class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8 w-full"
          :class="{ 'border-red-500': errors.password }"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter Password"
          required
          v-model="company.password"
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
      <span v-if="errors.password" class="text-red-500 text-xs">{{ errors.password }}</span>
    </div>
    
    <!-- Confirm Password Field -->
    <div class="flex flex-col gap-y-1 mb-2" v-if="!props.isRegisterCompany">
      <label for="confirmPassword" class="font-bold">Confirm Password*</label>
      <div class="relative">
        <input
          id="confirmPassword"
          class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8 w-full"
          :class="{ 'border-red-500': errors.confirm_password }"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm Password"
          required
          v-model="company.confirm_password"
          @blur="validateForm"
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
      <span v-if="errors.confirm_password" class="text-red-500 text-xs">{{ errors.confirm_password }}</span>
    </div>
    
    <!-- Remember Me Checkbox -->
    <div v-show="props.isRegisterCompany" class="flex items-center gap-2">
      <input type="checkbox" id="saveHistory" />
      <label for="saveHistory" class="text-sm">Remember me</label>
    </div>
    
    <!-- Submit Button -->
    <div class="flex flex-col">
      <button
        type="submit"
        class="bg-blue-900 py-2 rounded-lg shadow-xl text-white font-black text-2xl mb-2 cursor-pointer hover:bg-blue-800 transition-colors"
        :disabled="isLoading"
        :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
      >
        <span v-if="!isLoading">
          {{ props.isRegisterCompany ? "Login" : "Create Account" }}
        </span>
        <span v-else>Processing...</span>
      </button>
      
      <p class="text-center font-bold">
        {{
          props.isRegisterCompany
            ? "Don't have an account?"
            : "Already have an account?"
        }}
        <router-link
          :to="props.isRegisterCompany ? { name: 'register-company' } : { name: 'login-company' }"
          class="text-blue-700 underline hover:text-blue-800"
        >
          {{ props.isRegisterCompany ? "Sign up" : "Login" }}
        </router-link>
      </p>
    </div>
  </form>
</template>