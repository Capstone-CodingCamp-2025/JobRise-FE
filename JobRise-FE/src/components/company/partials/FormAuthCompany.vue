
<script setup>
import { reactive } from 'vue';
import { useAuthCompanyStore } from "@/stores/auth/companyAuth"; // Updated import
import { useRouter } from 'vue-router';

const router = useRouter();
const company = reactive({
  name: "",
  email: "",
  password: "",
  confirm_password: "",
});

const auth = useAuthCompanyStore(); // Changed to use the new store name

const handleSubmit = async () => { // Made async
  try {
    console.log("Submitting:", company);
    
    if (props.isRegisterCompany) {
      await auth.LoginCompany({ // Pass only needed fields
        email: company.email,
        password: company.password
      });
      await auth.getCompanyByAuth()
    } else {
      // Validate password match before registering
      if (company.password !== company.confirm_password) {
        throw new Error("Passwords don't match");
      }
      await auth.RegisterCompany(company);
    }
  } catch (error) {
    console.error("Authentication error:", error);
    alert(error.message || "Authentication failed");
  }
};

const props = defineProps({
  isRegisterCompany: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-3 px-8 py-6 md:px-16 lg:px-24">
    <div class="flex flex-col gap-y-1" v-if="!props.isRegisterCompany">
      <label for="companyName" class="font-bold">Company Name*</label>
      <input
        id="companyName"
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="text"
        placeholder="Your Company Name"
        required
        v-model="company.name"
      />
    </div>
    <div class="flex flex-col gap-y-1">
      <label for="companyEmail" class="font-bold">E-mail Company*</label>
      <input
        id="companyEmail"
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="email"
        placeholder="Enter Email"
        required
        v-model="company.email"
      />
    </div>
    <div class="flex flex-col gap-y-1">
      <label for="companyPassword" class="font-bold">Password*</label>
      <input
        id="companyPassword"
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="password"
        placeholder="Enter Password"
        required
        v-model="company.password"
      />
    </div>
    <div class="flex flex-col gap-y-1 mb-2" v-if="!props.isRegisterCompany">
      <label for="confirmPassword" class="font-bold">Confirm Password*</label>
      <input
        id="confirmPassword"
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="password"
        placeholder="Confirm Password"
        required
        v-model="company.confirm_password"
      />
    </div>
    <div v-show="props.isRegisterCompany">
      <input type="checkbox" id="saveHistory" />
      <label for="saveHistory"> Save history</label>
    </div>
    <div class="flex flex-col">
      <button
        type="submit"
        class="bg-blue-900 py-2 rounded-lg shadow-xl text-white font-black text-2xl mb-2 cursor-pointer hover:bg-blue-800 transition-colors"
      >
        {{ props.isRegisterCompany ? "Login" : "Create Account" }}
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