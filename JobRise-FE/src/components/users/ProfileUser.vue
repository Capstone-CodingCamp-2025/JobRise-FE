<template>
  <div v-if="loadingProfile" class="flex justify-center items-center h-64">
    <p class="text-xl font-semibold text-gray-600">Memuat profil...</p>
  </div>
  <form
    v-else
    @submit.prevent="handleSubmit"
    class="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-300/30 p-8 rounded-md shadow-md"
    enctype="multipart/form-data"
  >
    <div class="flex flex-col items-center gap-6 col-span-1">
      <div
        class="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative cursor-pointer"
        @click="isEditing && $refs.fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          class="absolute w-40 h-40 opacity-0 cursor-pointer z-10"
          @change="handleFileChange"
          accept="image/*"
          :disabled="!isEditing"
        />
        <span
          v-if="!imagePreview"
          class="text-3xl font-semibold text-gray-500 z-0"
        >
          <Icon
            icon="material-symbols-light:add-box-outline-sharp"
            width="32"
            height="32"
            style="color: #606060"
          />
        </span>
        <img
          v-if="imagePreview"
          :src="fullImageUrl"
          class="absolute w-full h-full object-cover"
          :alt="fullImageUrl"
        />
      </div>

      <div class="w-full">
        <div class="flex justify-between items-center pb-1">
          <label for="email" class="font-medium text-sm md:text-base">
            Email
            <span
              v-if="authUserStore.currentUser?.email_verified === 'yes'"
              class="text-xs md:text-sm font-normal text-green-600 ml-1"
            >
              Verified
            </span>
            <span
              v-else
              class="text-xs md:text-sm font-normal text-blue-900 ml-1"
            >
              Unverified
            </span>
          </label>
          <button
            v-if="authUserStore.currentUser?.email_verified !== 'yes'"
            @click.prevent="handleVerifyOtpRequest"
            class="bg-blue-950/90 text-white text-xs md:text-sm px-2 md:px-3 rounded-sm cursor-pointer h-6 md:h-auto"
          >
            Verifikasi
          </button>
        </div>
        <input
          id="email"
          type="text"
          class="bg-gray-100 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          :value="authUserStore.currentUser?.email"
          disabled
        />
      </div>

      <div class="w-full">
        <label for="linkedin" class="font-semibold text-lg">Linkedin</label>
        <input
          id="linkedin"
          v-model="profileForm.linkedin"
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div class="w-full">
        <label for="portofolio_url" class="font-semibold text-lg"
          >Portofolio</label
        >
        <input
          id="portofolio_url"
          v-model="profileForm.portofolio_url"
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="username" class="font-semibold text-lg">Username</label>
        <input
          id="username"
          v-model="profileForm.username"
          type="text"
          class="rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :class="{
            'bg-gray-100':
              authUserStore.userProfile && authUserStore.userProfile.username,
            'bg-gray-300': !(
              authUserStore.userProfile && authUserStore.userProfile.username
            ),
          }"
          :disabled="
            authUserStore.userProfile && authUserStore.userProfile.username
          "
        />
      </div>

      <div>
        <label for="full_name" class="font-semibold text-lg"
          >Nama Lengkap</label
        >
        <input
          id="full_name"
          v-model="profileForm.full_name"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="phone" class="font-semibold text-lg">Telepon</label>
        <input
          id="phone"
          v-model="profileForm.phone"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="age" class="font-semibold text-lg">Usia</label>
        <input
          id="age"
          v-model="profileForm.age"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="address" class="font-semibold text-lg">Alamat</label>
        <input
          id="address"
          v-model="profileForm.address"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="city" class="font-semibold text-lg">Kota</label>
        <input
          id="city"
          v-model="profileForm.city"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div class="md:col-span-2">
        <label for="bio" class="font-semibold text-lg">Bio</label>
        <textarea
          id="bio"
          v-model="profileForm.bio"
          rows="5"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 resize-none text-left"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <div class="w-full flex gap-x-3 justify-end md:col-span-2 pt-2">
        <button
          v-if="!userProfile"
          type="submit"
          class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md cursor-pointer"
        >
          Simpan Profil
        </button>

        <template v-else>
          <button
            v-if="!isEditing"
            type="button"
            class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md cursor-pointer"
            @click="isEditing = true"
          >
            Edit Profil
          </button>
          <button
            v-else
            type="submit"
            class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </template>
      </div>
    </div>
  </form>
  <div
    v-if="showOtpPopup"
    class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
  >
    <div
      class="rounded-md shadow bg-gray-300 py-6 md:py-10 px-6 md:px-8 w-98 sm:w-md"
    >
      <form @submit.prevent="handleVerifyOtp">
        <div class="flex flex-col gap-y-2">
          <label for="otp" class="font-medium text-sm md:text-base">
            Masukkan kode OTP <span class="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="otp"
            v-model="otpCode"
            class="bg-blue-400/30 outline outline-blue-900 rounded-sm h-7 md:h-8 text-center text-sm"
          />
        </div>

        <div
          class="flex flex-col sm:flex-row justify-center gap-2 mt-4 md:mt-6"
        >
          <button
            class="bg-gray-400 text-white w-full rounded-sm py-1 text-sm cursor-pointer"
            @click="showOtpPopup = false"
          >
            Batal
          </button>
          <button
            type="submit"
            class="bg-blue-950/90 text-white w-full rounded-sm py-1 text-sm cursor-pointer"
          >
            Verifikasi Kode OTP
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { ref, onMounted, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";

const authUserStore = AuthUserStorage();
const { userProfile } = storeToRefs(authUserStore);

const loadingProfile = ref(false);
const imagePreview = ref(null);
const profileForm = ref({
  username: "",
  full_name: "",
  phone: "",
  age: "",
  address: "",
  city: "",
  bio: "",
  linkedin: "",
  portofolio_url: "",
  profile_picture: null,
  image: null,
});
const isEditing = ref(false);
const showOtpPopup = ref(false);
const otpCode = ref("");

// --- Variabel URL untuk Gambar ---
const BASE_IMAGE_URL = "http://localhost:3888/public/";

// Computed property untuk URL gambar lengkap
const fullImageUrl = computed(() => {
  if (imagePreview.value) {
    // Cek apakah imagePreview sudah berupa URL objek (dari file yang baru dipilih)
    if (imagePreview.value.startsWith("blob:")) {
      return imagePreview.value;
    }
    // Jika tidak, tambahkan base URL dari backend
    return `${BASE_IMAGE_URL}${imagePreview.value}`;
  }
  return ""; // Return string kosong jika tidak ada gambar
});

onMounted(async () => {
  loadingProfile.value = true;
  try {
    await authUserStore.fetchUserProfile();
    isEditing.value = !userProfile.value;
    if (userProfile.value) {
      profileForm.value = { ...userProfile.value };
      if (userProfile.value.image) {
        imagePreview.value = userProfile.value.image;
      } else {
        imagePreview.value = null;
      }
    } else {
      imagePreview.value = null;
    }
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
    isEditing.value = true;
    profileForm.value = {
      username: "",
      full_name: "",
      phone: "",
      age: "",
      address: "",
      city: "",
      bio: "",
      linkedin: "",
      portofolio_url: "",
      profile_picture: null,
    };
    imagePreview.value = null;
  } finally {
    loadingProfile.value = false;
  }
});

watch(userProfile, (newProfile) => {
  if (newProfile) {
    profileForm.value = { ...newProfile };
    if (newProfile.image) {
      imagePreview.value = newProfile.image;
    } else {
      imagePreview.value = null;
    }
    isEditing.value = false;
  } else {
    profileForm.value = {
      username: "",
      full_name: "",
      phone: "",
      age: "",
      address: "",
      city: "",
      bio: "",
      linkedin: "",
      portofolio_url: "",
      profile_picture: null,
    };
    imagePreview.value = null;
    isEditing.value = true;
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
    profileForm.value.image = file;
  } else {
    profileForm.value.image = null;
    if (userProfile.value && userProfile.value.image) {
      imagePreview.value = userProfile.value.image;
    } else {
      imagePreview.value = null;
    }
  }
};

const handleSubmit = async () => {
  const isCreatingProfile = !userProfile.value;
  const isImageSelected = profileForm.value.image !== null;
  const hasExistingImage =
    imagePreview.value !== null &&
    typeof imagePreview.value === "string" &&
    !imagePreview.value.startsWith("blob:");

  if (
    (isCreatingProfile && !isImageSelected) ||
    (!isCreatingProfile &&
      isEditing.value &&
      !isImageSelected &&
      !hasExistingImage)
  ) {
    Swal.fire({
      icon: "warning",
      title: "Gambar Profil Dibutuhkan",
      text: "Mohon masukkan gambar profil Anda.",
      confirmButtonText: "Oke",
    });
    return;
  }

  const formData = new FormData();
  for (const key in profileForm.value) {
    if (key === "image") {
      if (profileForm.value.image instanceof File) {
        formData.append(key, profileForm.value[key]);
      }
    } else if (key === "email") {
      if (!authUserStore.userProfile) {
        if (
          profileForm.value[key] !== null &&
          profileForm.value[key] !== undefined
        ) {
          formData.append(key, profileForm.value[key]);
        }
      }
    } else if (key === "username") {
      if (!authUserStore.userProfile) {
        if (
          profileForm.value[key] !== null &&
          profileForm.value[key] !== undefined
        ) {
          formData.append(key, profileForm.value[key]);
        }
      }
    } else if (
      profileForm.value[key] !== null &&
      profileForm.value[key] !== undefined
    ) {
      formData.append(key, profileForm.value[key]);
    }
  }

  try {
    if (userProfile.value) {
      await authUserStore.updateProfileUser(formData);
    } else {
      await authUserStore.createProfile(formData);
    }
    isEditing.value = false;
    Swal.fire({
      // Add success alert here
      icon: "success",
      title: "Profil Berhasil Disimpan!",
      text: "Data profil Anda telah berhasil diperbarui.",
      confirmButtonText: "Oke",
    });
  } catch (error) {
    console.error("Gagal menyimpan profil:", error);

    // --- START: MODIFIKASI BAGIAN INI SESUAI RESPON BACKEND ANDA ---
    if (error.response) {
      // Contoh 1: Backend mengirim status 400 dan pesan spesifik di data.message
      if (
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.message === "Username is already taken"
      ) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: "Username sudah digunakan. Mohon pilih username lain.",
          confirmButtonText: "Oke",
        });
      }
      // Contoh 2: Backend mengirim status 409 dan pesan spesifik di data.error
      else if (
        error.response.status === 409 &&
        error.response.data &&
        error.response.data.error === "Duplicate username"
      ) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: "Username sudah digunakan. Mohon pilih username lain.",
          confirmButtonText: "Oke",
        });
      }
      // Contoh 3: Backend mengirim pesan spesifik di data.message, tanpa peduli status
      else if (
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes("username already exists")
      ) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: "Username sudah digunakan. Mohon pilih username lain.",
          confirmButtonText: "Oke",
        });
      }
      // Tambahkan kondisi lain jika ada skenario error spesifik lainnya dari backend Anda
      else {
        // Fallback untuk error lain yang tidak spesifik atau general error
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text:
            error.response.data.message ||
            "Terjadi kesalahan saat menyimpan profil. Harap periksa kembali data Anda.",
          confirmButtonText: "Oke",
        });
      }
    } else {
      // Jika tidak ada error.response (misal: masalah jaringan)
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Terjadi kesalahan jaringan atau server tidak merespons. Silakan coba lagi.",
        confirmButtonText: "Oke",
      });
    }
  }
};

const handleVerifyOtpRequest = async () => {
  try {
    await authUserStore.sendVerificationOTP();
    showOtpPopup.value = true;
  } catch (error) {
    console.error("Gagal mengirim OTP:", error);
  }
};

const handleVerifyOtp = async () => {
  try {
    await authUserStore.verifyEmailOTP(otpCode.value);
    showOtpPopup.value = false;
    otpCode.value = "";
  } catch (error) {
    console.error("Gagal memverifikasi OTP:", error);
  }
};
</script>
