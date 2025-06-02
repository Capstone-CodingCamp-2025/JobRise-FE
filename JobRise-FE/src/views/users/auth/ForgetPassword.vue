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
            @submit.prevent="handleForgotPassword"
            class="bg-blue-950/80 text-white py-2 rounded-md w-full font-semibold text-xl cursor-pointer"
          >
            <span v-if="loading">Sending...</span>
            <span v-else>Get Link</span>
          </button>
        </div>
      </form>
      <p class="mt-4 text-sm">
        Back to
        <router-link :to="loginRoute" class="text-blue-500">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute } from "vue-router";

const authStore = AuthUserStorage();
const route = useRoute();
const email = ref("");
const loading = ref(false);
const loginRoute = computed(
  () => localStorage.getItem("lastLoginRoute") || "/login"
);
const errors = reactive({
  email: "",
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
    await authStore.SendForgotPassword(email.value);
    // Jika berhasil, notifikasi sukses akan muncul dari store
    // Anda bisa menambahkan logika tambahan di sini jika diperlukan,
    // misalnya menampilkan pesan sukses spesifik di komponen.
  } catch (error) {
    // Penanganan error sudah dilakukan di dalam store (Swal.fire)
    console.error("Gagal mengirim link reset password:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  console.log("Last Login Route:", localStorage.getItem("lastLoginRoute"));
  // Opsi: localStorage.removeItem('lastLoginRoute');
});
</script>
