<script setup>
import { reactive } from 'vue';
import {AuthCompanyStorage} from "@/stores/auth/companyAuth"

const company = reactive({
  name: "",
  email: "",
  password: "",
  confirm_password: "",
})

const auth = AuthCompanyStorage()


const handleSubmit = () => {
  if (props.isRegisterCompany) {
    auth.LoginCompany(company);
  } else {
    auth.RegisterCompany(company);
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
    <div class="flex flex-col gap-y-1" v-if="props.isRegisterCompany === false">
      <label for="" class="font-bold" >Company Name*</label>
      <input
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="text"
        placeholder="Your Full Name"
        required
        v-model="name"
      />
    </div>
    <div class="flex flex-col gap-y-1">
      <label for="" class="font-bold" >E-mail Company*</label>
      <input
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="email"
        placeholder="Enter Email"
        required
        v-model="email"
      />
    </div>
    <div class="flex flex-col gap-y-1">
      <label for="" class="font-bold">Password*</label>
      <input
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="password"
        placeholder="Enter Password"
        required
        v-model="password"
      />
    </div>
    <div class="flex flex-col gap-y-1 mb-2" v-if="props.isRegisterCompany === false">
      <label for="" class="font-bold">Confirm Password*</label>
      <input
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="password"
        placeholder="Confirm Password"
        required
        v-model="confirm_password"
      />
    </div>
    <div v-show="props.isRegisterCompany">
      <input type="checkbox" />
      <span> Save history </span>
    </div>
    <div class="flex flex-col">
      <button
        class="bg-blue-900 py-2 rounded-lg shadow-xl text-white font-black text-2xl mb-2"
      >
        {{ props.isRegisterCompany ? "Login" : "Create" }}
      </button>
      <p class="text-center font-bold">
        {{
          props.isRegisterCompany
            ? "Don`t have any account?"
            : "Already have any account?"
        }}
        <router-link
          :to="props.isRegisterCompany ? { name: 'register-company' } : { name: 'login-company' }"
          class="text-blue-700 underline"
        >
          {{ props.isRegisterCompany ? "Sign up" : "login" }}
        </router-link>
      </p>
    </div>
  </form>
</template>
