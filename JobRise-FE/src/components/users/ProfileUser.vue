<template>
  <div v-if="loadingProfile" class="flex justify-center items-center h-64">
    <Icon
        icon="eos-icons:loading"
        width="50"
        height="50"
        class="text-blue-600"
      />
  </div>
  <form
    v-else
    @submit.prevent="handleSubmit"
    class="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#F1F4FA] p-8 rounded-md shadow-md"
    enctype="multipart/form-data"
  >
    <div class="flex flex-col items-center gap-6 col-span-1">
      <div
        class="w-40 h-40 rounded-full bg-[#F1F4FA] outline flex items-center justify-center overflow-hidden relative cursor-pointer"
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
          :alt="profileForm.full_name || 'Profile Picture'"
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
            type="button"
          >
            Verifikasi
          </button>
        </div>
        <input
          id="email"
          type="text"
          class="bg-[#F1F4FA] w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
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
          class="z w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
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
          class="z w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
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
            'z': !(
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
          class="z rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="phone" class="font-semibold text-lg">Telepon</label>
        <input
          id="phone"
          v-model="profileForm.phone"
          type="text"
          class="z rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="age" class="font-semibold text-lg">Usia</label>
        <input
          id="age"
          v-model="profileForm.age"
          type="text"
          class="z rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="address" class="font-semibold text-lg">Alamat</label>
        <input
          id="address"
          v-model="profileForm.address"
          type="text"
          class="z rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="city" class="font-semibold text-lg">Kota</label>
        <input
          id="city"
          v-model="profileForm.city"
          type="text"
          class="z rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div class="md:col-span-2">
        <label for="bio" class="font-semibold text-lg">Bio</label>
        <textarea
          id="bio"
          v-model="profileForm.bio"
          rows="5"
          placeholder="isilah bio yang bagus untuk bagian cv anda juga"
          class="z w-full rounded-lg py-2 px-3 outline outline-blue-900 resize-none text-left"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <div class="w-full flex gap-x-3 justify-end md:col-span-2 pt-2">
        <button
          v-if="!userProfile"
          type="submit"
          class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md cursor-pointer"
        >
          Save
        </button>

        <template v-else>
          <button
            v-if="!isEditing"
            type="button"
            class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md cursor-pointer"
            @click="isEditing = true"
          >
            Edit 
          </button>
          <button
            v-else
            type="submit"
            class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md cursor-pointer"
          >
            Save
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
      class="rounded-md shadow z py-6 md:py-10 px-6 md:px-8 w-98 sm:w-md"
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
            required
          />
        </div>

        <div
          class="flex flex-col sm:flex-row justify-center gap-2 mt-4 md:mt-6"
        >
          <button
            type="button"
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
import { AuthUserStorage } from "@/stores/auth/userAuth"; // Pastikan path ini benar
import { ref, onMounted, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import Swal from "sweetalert2"; // Masih dibutuhkan untuk validasi & error di komponen
import { storeToRefs } from "pinia";

const authUserStore = AuthUserStorage();
const { userProfile, currentUser } = storeToRefs(authUserStore);
const isSubmitting = ref(false);
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
  image: null,
});
const isEditing = ref(false);
const showOtpPopup = ref(false);
const otpCode = ref("");

const BASE_IMAGE_URL = "http://localhost:3888/public/";

const fullImageUrl = computed(() => {
  if (imagePreview.value) {
    if (imagePreview.value.startsWith("blob:")) {
      return imagePreview.value;
    }
    return `${BASE_IMAGE_URL}${imagePreview.value}`;
  }
  return "";
});

const initializeProfileForm = (profileData) => {
  if (profileData) {
    profileForm.value = {
      username: profileData.username || (currentUser.value?.name || ""),
      full_name: profileData.full_name || "",
      phone: profileData.phone || "",
      age: profileData.age || "",
      address: profileData.address || "",
      city: profileData.city || "",
      bio: profileData.bio || "",
      linkedin: profileData.linkedin || "",
      portofolio_url: profileData.portofolio_url || "",
      image: profileData.image || null,
    };
    imagePreview.value = profileData.image || null;
    isEditing.value = false;
  } else {
    profileForm.value = {
      username: currentUser.value?.name || "",
      full_name: "",
      phone: "",
      age: "",
      address: "",
      city: "",
      bio: "",
      linkedin: "",
      portofolio_url: "",
      image: null,
    };
    imagePreview.value = null;
    isEditing.value = true;
  }
};

onMounted(async () => {
  loadingProfile.value = true;
  try {
    await authUserStore.fetchUserProfile();
    initializeProfileForm(userProfile.value);
  } catch (error) {
    console.error("Gagal mengambil profil di onMounted:", error);
    initializeProfileForm(null);
  } finally {
    loadingProfile.value = false;
  }
});

watch(userProfile, (newProfileData) => {
  initializeProfileForm(newProfileData);
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
    profileForm.value.image = file;
  } else {
    if (userProfile.value && userProfile.value.image) {
      imagePreview.value = userProfile.value.image;
      profileForm.value.image = userProfile.value.image;
    } else {
      imagePreview.value = null;
      profileForm.value.image = null;
    }
  }
};

const handleSubmit = async () => {
  const isCreatingProfile = !userProfile.value;
  const isNewImageSelected = profileForm.value.image instanceof File;
  const hasPreviouslySavedImage = userProfile.value && userProfile.value.image && typeof userProfile.value.image === 'string';

  if (isCreatingProfile && !isNewImageSelected) {
    Swal.fire({
      icon: "warning",
      title: "Gambar Profil Dibutuhkan",
      text: "Mohon unggah gambar profil Anda untuk membuat profil.",
      confirmButtonText: "Oke",
    });
    return;
  }

  if (!isCreatingProfile && isEditing.value && !isNewImageSelected && !hasPreviouslySavedImage) {
    Swal.fire({
      icon: "warning",
      title: "Gambar Profil Dibutuhkan",
      text: "Mohon unggah gambar profil Anda.",
      confirmButtonText: "Oke",
    });
    return;
  }
  isSubmitting.value = true;
  const formData = new FormData();
  for (const key in profileForm.value) {
    if (profileForm.value.hasOwnProperty(key)) {
      if (key === "image") {
        if (profileForm.value.image instanceof File) {
          formData.append("image", profileForm.value.image);
        }
      } else if (key === "username") {
        if (!userProfile.value || !authUserStore.userProfile?.username) {
          if (profileForm.value.username) {
            formData.append(key, profileForm.value[key]);
          }
        }
      } else if (profileForm.value[key] !== null && profileForm.value[key] !== undefined) {
        formData.append(key, profileForm.value[key]);
      }
    }
  }

  try {
    // Panggil action store. Store akan menampilkan notifikasi sukses (toast).
    if (userProfile.value) {
      await authUserStore.updateProfileUser(formData);
    } else {
      await authUserStore.createProfile(formData);
    }

    // Setelah sukses (store sudah menampilkan alert-nya), lakukan fetch ulang dan ubah state editing.
    await authUserStore.fetchUserProfile();
    isEditing.value = false;

    // ----- Swal.fire UNTUK SUKSES DIHAPUS DARI SINI -----
    // Notifikasi sukses sekarang sepenuhnya ditangani oleh store.
    // Swal.fire({
    //   icon: "success",
    //   title: successMessage, // successMessage juga sudah tidak relevan di sini
    //   text: "Data profil Anda telah berhasil disimpan.",
    //   confirmButtonText: "Oke",
    // });

  } catch (error) {
    // Penanganan error di komponen tetap ada, untuk menampilkan alert yang lebih menonjol jika diperlukan
    // atau untuk menangani error yang mungkin tidak dilempar ulang oleh store dengan cara tertentu.
    console.error("Gagal menyimpan profil (dari komponen):", error);
    let errorMessage = "Terjadi kesalahan saat menyimpan profil.";
    if (error.response && error.response.data) {
        if (typeof error.response.data.message === 'string') {
            errorMessage = error.response.data.message;
        } else if (typeof error.response.data.error === 'string') {
            errorMessage = error.response.data.error;
        }
        const lowerCaseError = errorMessage.toLowerCase();
        if (lowerCaseError.includes("username") && (lowerCaseError.includes("taken") || lowerCaseError.includes("exists") || lowerCaseError.includes("sudah ada") || lowerCaseError.includes("digunakan"))) {
            errorMessage = "Username sudah digunakan. Mohon pilih username lain.";
        }
    } else if (error.message && !error.response) { // Error dari store yang mungkin tidak punya error.response
      errorMessage = error.message;
    }


    Swal.fire({
      icon: "error",
      title: "Gagal Menyimpan",
      text: errorMessage,
      confirmButtonText: "Oke",
    });
  }finally {
    isSubmitting.value = false
  }
};

const handleVerifyOtpRequest = async () => {
  try {
    await authUserStore.sendVerificationOTP();
    showOtpPopup.value = true;
  } catch (error) {
    console.error("Gagal mengirim OTP:", error);
    // Asumsi store sudah menangani alert errornya
  }
};

const handleVerifyOtp = async () => {
  if (!otpCode.value) {
    Swal.fire({
      icon: "warning",
      title: "OTP Diperlukan",
      text: "Mohon masukkan kode OTP.",
      confirmButtonText: "Oke",
    });
    return;
  }
  try {
    await authUserStore.verifyEmailOTP(otpCode.value);
    showOtpPopup.value = false;
    otpCode.value = "";
     // Asumsi store sudah menangani alert suksesnya dan update currentUser
  } catch (error) {
    console.error("Gagal memverifikasi OTP:", error);
    // Asumsi store sudah menangani alert errornya
  }
};
</script>