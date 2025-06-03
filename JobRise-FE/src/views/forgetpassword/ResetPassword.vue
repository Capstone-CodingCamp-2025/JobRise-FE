<template>
  <div class="m-auto place-items-center min-h-[80dvh] flex justify-center">
    <div class="w-max bg-[#D5DEEF] p-16 rounded-md">
      <h2 class="text-2xl font-semibold mb-4">Reset Kata Sandi</h2>
      <form @submit.prevent="handleResetPassword" class="flex flex-col gap-y-4">
        <div class="flex flex-col">
          <label for="password" class="font-medium">
            Password Baru <span class="text-red-600">*</span>
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="bg-gray-100 rounded-sm outline outline-blue-900 w-54 px-2 h-10 md:w-74"
            :class="{ 'border-red-500': errors.password }"
            required
            @input="validatePassword"
            @blur="validatePassword"
          />
          <span v-if="errors.password" class="text-red-500 text-xs">{{
            errors.password
          }}</span>
        </div>
        <div class="flex flex-col">
          <label for="confirm_password" class="font-medium">
            Konfirmasi Password <span class="text-red-600">*</span>
          </label>
          <input
            type="password"
            id="confirm_password"
            v-model="confirmPassword"
            class="bg-gray-100 rounded-sm outline outline-blue-900 w-54 px-2 h-10 md:w-74"
            :class="{ 'border-red-500': errors.confirm_password }"
            required
            @input="validateConfirmPassword"
            @blur="validateConfirmPassword"
          />
          <span v-if="errors.confirm_password" class="text-red-500 text-xs">{{
            errors.confirm_password
          }}</span>
        </div>
        <div>
          <button
            type="submit"
            :disabled="loading || errors.password || errors.confirm_password || password !== confirmPassword"
            class="bg-blue-950/80 text-white py-2 rounded-md w-full font-semibold text-xl"
          >
            <span v-if="loading">Menyimpan...</span>
            <span v-else>Simpan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";

const props = defineProps({
  isCompany: Boolean, // Prop untuk menentukan apakah ini untuk company (masih digunakan)
});

const authUserStore = AuthUserStorage();
const authCompanyStore = useAuthCompanyStore();
const router = useRouter();
const route = useRoute();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errors = reactive({
  password: "",
  confirm_password: "",
});

const token = ref(route.query.token);

// Tambahkan ref untuk menyimpan informasi jenis pengguna (jika bisa dideteksi dari URL sebelumnya)
const isLikelyCompany = ref(route.fullPath.includes('company')); // Contoh deteksi berdasarkan URL

const validatePassword = () => {
  if (!password.value.trim()) {
    errors.password = "Password is required";
    return false;
  }
  if (password.value.length < 8) {
    errors.password = "Password must be at least 8 characters";
    return false;
  }
  errors.password = "";
  return true;
};

const validateConfirmPassword = () => {
  if (!confirmPassword.value.trim()) {
    errors.confirm_password = "Please confirm your password";
    return false;
  }
  if (password.value !== confirmPassword.value) {
    errors.confirm_password = "Passwords do not match";
    return false;
  }
  errors.confirm_password = "";
  return true;
};

const handleResetPassword = async () => {
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();

  if (!isPasswordValid || !isConfirmPasswordValid || password.value !== confirmPassword.value) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: "Please ensure passwords are valid and match!",
      showConfirmButton: false,
      timer: 3000,
    });
    return;
  }

  loading.value = true;
  try {
    let resetSuccess = false;
    if (props.isCompany || isLikelyCompany.value) {
      await authCompanyStore.ResetPasswordCompany(
        token.value,
        password.value,
        confirmPassword.value,
        router
      );
      resetSuccess = true;
      router.push("/login-company");
    } else {
      await authUserStore.ResetPassword(
        token.value,
        password.value,
        confirmPassword.value,
        router
      );
      resetSuccess = true;
      router.push("/login");
    }

    if (!resetSuccess) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Gagal mengatur ulang kata sandi.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  } catch (error) {
    console.error("Gagal reset password:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (token.value) {
    try {
      const verificationFunction = props.isCompany || isLikelyCompany.value
        ? authCompanyStore.VerifyResetTokenCompany
        : authUserStore.VerifyResetToken;
      await verificationFunction(token.value);
      console.log("Token valid.");
    } catch (error) {
      console.error("Token tidak valid:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Token tidak valid atau kadaluarsa!",
        showConfirmButton: false,
        timer: 3000,
      });
      const redirectToForget = props.isCompany || isLikelyCompany.value
        ? "/forget-password-company"
        : "/forget-password";
      router.push(redirectToForget);
    }
  } else {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: "Token reset tidak ditemukan!",
      showConfirmButton: false,
      timer: 3000,
    });
    const redirectToForget = props.isCompany || isLikelyCompany.value
      ? "/forget-password-company"
      : "/forget-password";
    router.push(redirectToForget);
  }
});
</script>