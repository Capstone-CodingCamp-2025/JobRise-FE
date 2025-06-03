<script setup>
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";
import { ref, computed, reactive, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  isCompany: Boolean, // Prop untuk menentukan apakah ini untuk company
});

const authUserStore = AuthUserStorage();
const authCompanyStore = useAuthCompanyStore();
const router = useRouter();
const email = ref("");
const loading = ref(false);
const errors = reactive({
  email: "",
});

const loginRoute = computed(() => {
  const lastLogin = localStorage.getItem('lastLoginRoute');
  if (lastLogin && lastLogin !== '') {
    return lastLogin;
  }
  return props.isCompany ? "/login-company" : "/login";
});

const backToLoginText = computed(() => {
  const lastLogin = localStorage.getItem('lastLoginRoute');
  if (lastLogin && lastLogin.includes('company')) {
    return "Login Company";
  } else if (lastLogin && lastLogin.includes('login')) {
    return "Login";
  }
  return props.isCompany ? "Login Company" : "Login";
});

const validateEmail = () => {
  if (!email.value.trim()) {
    errors.email = "Email is required";
    return false;
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.value)) {
    errors.email = "Please enter a valid email address";
    return false;
  }
  errors.email = "";
  return true;
};

const handleForgotPassword = async () => {
  if (!validateEmail()) return;

  loading.value = true;
  try {
    if (props.isCompany) {
      await authCompanyStore.SendForgotPasswordCompany(email.value);
    } else {
      await authUserStore.SendForgotPassword(email.value);
    }
  } catch (error) {
    console.error("Gagal mengirim link reset password:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  console.log("Last Login Route:", localStorage.getItem("lastLoginRoute"));
});
</script>

<template>
  <div class="m-auto place-items-center min-h-[80dvh] flex justify-center">
    <div class="w-max bg-[#D5DEEF] p-16 rounded-md">
      <h2 class="text-2xl font-semibold mb-4">Lupa Kata Sandi</h2>
      <form
        @submit.prevent="handleForgotPassword"
        class="flex flex-col gap-y-4"
      >
        <div class="flex flex-col">
          <label for="email" class="font-medium"
            >E-mail <span class="text-red-600">*</span></label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            class="bg-gray-100 rounded-sm outline outline-blue-900 px-2 w-54 h-10 md:w-74"
            :class="{ 'border-red-500': errors.email }"
            required
            @input="validateEmail"
            @blur="validateEmail"
          />
          <span v-if="errors.email" class="text-red-500 text-xs">{{
            errors.email
          }}</span>
        </div>
        <div>
          <button
            type="submit"
            class="bg-blue-950/80 text-white py-2 rounded-md w-full font-semibold text-xl cursor-pointer"
          >
            <span v-if="loading">Sending...</span>
            <span v-else>Get Link</span>
          </button>
        </div>
      </form>
      <p class="mt-4 text-sm">
        Back to
        <router-link :to="loginRoute" class="text-blue-500">{{ backToLoginText }}</router-link>
      </p>
    </div>
  </div>
</template>