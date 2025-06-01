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
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { AuthUserStorage } from "@/stores/auth/userAuth";

const authStore = AuthUserStorage();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errors = reactive({
  password: "",
  confirm_password: "",
});

const props = defineProps({
  token: String,
});

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
    if (props.token) {
      await authStore.ResetPassword(
        props.token,
        password.value,
        confirmPassword.value
      );
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Token tidak ditemukan, coba lagi!",
        showConfirmButton: false,
        timer: 3000,
      });
      router.push("/forget-password");
    }
  } catch (error) {
    console.error("Gagal reset password:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  console.log("Token dari query:", props.token);

  if (props.token) {
    try {
      const response = await authStore.VerifyResetToken(props.token);
      console.log("Verifikasi token berhasil:", response);
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
      router.push("/forget-password");
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
    router.push("/forget-password");
  }
});
</script>