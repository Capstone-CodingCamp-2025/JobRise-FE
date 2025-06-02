<template>
  <div class="p-4 md:p-10">
    <h1 class="text-xl md:text-3xl mb-4 text-center font-bold">
      Company Information
    </h1>
    <div class="bg-slate-300/30 p-4 md:p-10 rounded-md">
      <form
        @submit.prevent="saveProfile"
        class="flex flex-col md:flex-row gap-y-6 md:gap-x-10"
      >
        <div class="flex flex-col gap-y-4">
          <div
            class="w-32 h-32 md:w-40 md:h-40 rounded-md outline outline-blue-900 bg-blue-400/10 flex items-center justify-center m-auto md:m-0 overflow-hidden relative cursor-pointer"
            @click="fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              class="absolute w-full h-full opacity-0 cursor-pointer z-10"
              accept="image/jpeg, image/png, image/jpg"
              @change="handleLogoUpload"
            />
            <span
              v-if="!logoPreview"
              class="text-xl md:text-3xl font-semibold text-gray-500 z-0"
            >
              <Icon
                icon="material-symbols-light:add-box-outline-sharp"
                width="24"
                height="24"
                md:width="32"
                md:height="32"
                style="color: #606060"
              />
            </span>
            <img
              v-if="logoPreview"
              :src="logoPreview"
              class="absolute w-full h-full object-cover"
              alt="Company Logo"
            />
          </div>

          <div class="flex flex-col gap-y-2">
            <div class="flex justify-between items-center">
              <label
                for="companyEmail"
                class="font-medium text-sm md:text-base"
              >
                Email
                <span
                  v-if="companyProfile?.email_verified === 'yes'"
                  class="text-xs md:text-sm font-normal text-green-700"
                  >Verified</span
                >
                <span
                  v-else
                  class="text-xs md:text-sm font-normal text-red-700"
                  >Not Verified</span
                >
              </label>
              <button
                @click.prevent="sendOTPVerification"
                :disabled="companyProfile?.email_verified === 'yes'"
                class="bg-blue-950/90 text-white text-xs md:text-sm px-2 md:px-3 rounded-sm cursor-pointer h-6 md:h-auto"
              >
                Verify
              </button>
            </div>
            <input
              type="text"
              id="companyEmail"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 w-full md:w-52 text-sm"
              :value="currentCompany?.email"
              readonly
            />
          </div>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-9 gap-y-3 w-full"
        >
          <div class="flex flex-col gap-y-2">
            <label for="companyName" class="font-medium text-sm md:text-base">Company Name</label>
            <input
              type="text"
              id="companyName"
              v-model="profileData.company_name"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="website" class="font-medium text-sm md:text-base">Website</label>
            <input
              type="text"
              id="website"
              v-model="profileData.website"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="industry" class="font-medium text-sm md:text-base">Industry</label>
            <input
              type="text"
              id="industry"
              v-model="profileData.industry"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="address" class="font-medium text-sm md:text-base">Address</label>
            <input
              type="text"
              id="address"
              v-model="profileData.address"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2 col-span-1 md:col-span-2">
            <label for="description" class="font-medium text-sm md:text-base">Description</label>
            <textarea
              id="description"
              v-model="profileData.description"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-24 md:h-32 w-full text-sm"
            ></textarea>
          </div>
          <div class="flex gap-x-2 justify-end col-span-1 md:col-span-2">
            <button
              v-if="!isEditing"
              type="button"
              @click="enterEditMode"
              class="bg-blue-950/90 text-white px-3 md:px-5 rounded-md py-1 text-sm cursor-pointer"
            >
              Edit
            </button>
            <button
              v-if="isEditing"
              type="button"
              @click="cancelEditMode"
              class="bg-gray-500 text-white px-3 md:px-5 rounded-md py-1 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-950/90 text-white px-3 md:px-5 rounded-md py-1 text-sm cursor-pointer"
            >
              {{ isEditing ? 'Save Changes' : 'Save' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div
    v-if="showOtpPopup"
    class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
  >
    <div
      class="rounded-md shadow bg-gray-300 py-6 md:py-10 px-6 md:px-8 w-98 md:w-md"
    >
      <form @submit.prevent="handleVerifyOtpSubmit">
        <div class="flex flex-col gap-y-2">
          <label for="otp" class="font-medium text-sm md:text-base">
            Enter the OTP code <span class="text-red-600">*</span>
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
            type="button"
            @click="showOtpPopup = false; otpCode = ''"
            class="bg-gray-400 text-white w-full rounded-sm py-1 text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-950/90 text-white w-full rounded-sm py-1 text-sm cursor-pointer"
          >
            Verify OTP Code
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";
import { storeToRefs } from "pinia"; // Import storeToRefs

const authCompanyStore = useAuthCompanyStore();
const router = useRouter();

// Destructure reactive properties from the store using storeToRefs
const { companyProfile, currentCompany } = storeToRefs(authCompanyStore);

// Local State
const fileInput = ref(null);
const showOtpPopup = ref(false);
const otpCode = ref("");
const logoFile = ref(null);
const logoPreview = ref(null);
const isEditing = ref(false);

// Form data
const profileData = ref({
  company_name: "",
  address: "",
  website: "",
  industry: "",
  description: "",
});

// Fungsi untuk mengisi form dengan data profil yang sudah ada
const fillProfileData = (data) => {
  if (data) {
    profileData.value.company_name = data.company_name || "";
    profileData.value.address = data.address || "";
    profileData.value.website = data.website || "";
    profileData.value.industry = data.industry || "";
    profileData.value.description = data.description || "";
    if (data.logo) {
      logoPreview.value = `http://localhost:3888/public/${data.logo}`; // Sesuaikan path jika berbeda
    } else {
      logoPreview.value = null;
    }
  } else {
    // Reset form jika tidak ada data
    profileData.value = {
      company_name: "",
      address: "",
      website: "",
      industry: "",
      description: "",
    };
    logoPreview.value = null;
  }
};

onMounted(async () => {
  try {
    await authCompanyStore.fetchProfileCompany();
    // Setelah data profil berhasil diambil, isi form
    fillProfileData(companyProfile.value); // Gunakan companyProfile yang sudah di-destructure
    console.log("Status email saat onMounted:", companyProfile.value?.email_verified);
  } catch (error) {
    console.error("Gagal memuat profil perusahaan:", error);
    // Handle error jika gagal mengambil profil, misalnya menampilkan pesan ke pengguna
  }
});

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  logoFile.value = file;
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      logoPreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    // Jika batal memilih file saat edit, pertahankan preview saat ini
    if (!isEditing) {
      logoPreview.value = companyProfile.value?.logo
        ? `http://localhost:3888/public/${companyProfile.value.logo}`
        : null;
    }
    logoFile.value = null;
  }
};

const saveProfile = async () => {
  const formData = new FormData();
  formData.append("company_name", profileData.value.company_name);
  formData.append("address", profileData.value.address);
  formData.append("website", profileData.value.website);
  formData.append("industry", profileData.value.industry);
  formData.append("description", profileData.value.description);

  if (logoFile.value) {
    formData.append("logo", logoFile.value);
  }

  try {
    if (companyProfile.value?.id && isEditing.value) { // Gunakan companyProfile yang sudah di-destructure
      // Update existing profile
      await authCompanyStore.updateProfileCompany(formData);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profil perusahaan berhasil diperbarui!',
        timer: 3000,
        showConfirmButton: false,
      });
      isEditing.value = false; // Keluar dari mode edit setelah berhasil menyimpan
    } else if (!companyProfile.value?.id) { // Gunakan companyProfile yang sudah di-destructure
      // Create new profile
      if (!logoFile.value && !companyProfile.value?.logo) { // Gunakan companyProfile yang sudah di-destructure
        Swal.fire({
          icon: 'warning',
          title: 'Peringatan',
          text: 'Harap masukkan logo perusahaan.',
        });
        return;
      }
      await authCompanyStore.createProfileCompany(formData);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profil perusahaan berhasil disimpan!',
        timer: 3000,
        showConfirmButton: false,
      });
    }
    await authCompanyStore.fetchProfileCompany(); // Refresh data setelah berhasil
  } catch (error) {
    console.error("Gagal menyimpan/memperbarui profil perusahaan", error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Gagal menyimpan/memperbarui profil perusahaan!',
      text: error.message || 'Terjadi kesalahan.',
      timer: 3000,
      showConfirmButton: false,
    });
  }
};

const enterEditMode = () => {
  isEditing.value = true;
};

const cancelEditMode = () => {
  isEditing.value = false;
  // Re-fetch profile data to revert changes
  authCompanyStore.fetchProfileCompany().then(data => {
    fillProfileData(data);
  }).catch(error => {
    console.error("Gagal memuat ulang profil:", error);
  });
};

const sendOTPVerification = async () => {
  try {
    await authCompanyStore.sendVerificationOTP();
    showOtpPopup.value = true;
  } catch (error) {
    // Error sudah ditangani di store
  }
};

const handleVerifyOtpSubmit = async () => {
  try {
    await authCompanyStore.verifyEmailOTP(otpCode.value);
    showOtpPopup.value = false;
    otpCode.value = "";
    // PENTING: Refresh data profil setelah verifikasi berhasil
    await authCompanyStore.fetchProfileCompany();
    console.log("Status email setelah verifikasi OTP dan fetch ulang:", companyProfile.value?.email_verified);
  } catch (error) {
    // Error sudah ditangani di store
  }
};
</script>
