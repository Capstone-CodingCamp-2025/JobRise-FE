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
                  v-if="currentCompany.data?.email_verified == 'yes'"
                  class="text-xs md:text-sm font-normal text-green-700"
                  >Verified</span
                >
                <span v-else class="text-xs md:text-sm font-normal text-blue-900"
                  >Unverified</span
                >
              </label>
              {{ console.log("curennrrr", currentCompany) }}
              {{ console.log("curennrrr", companyProfile) }}
              <button
                @click.prevent="sendOTPVerification"
                :disabled="currentCompany.data?.email_verified === 'yes'"
                class="bg-blue-950/90 text-white text-xs md:text-sm px-2 md:px-3 rounded-sm cursor-pointer h-6 md:h-auto"
              >
                Verify
              </button>
            </div>
            <input
              type="text"
              id="companyEmail"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 w-full md:w-52 text-sm"
              :value="currentCompany.data?.email"
              readonly
            />
          </div>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-9 gap-y-3 w-full"
        >
          <div class="flex flex-col gap-y-2">
            <label for="companyName" class="font-medium text-sm md:text-base"
              >Company Name</label
            >
            <input
              type="text"
              id="companyName"
              v-model="profileData.company_name"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="website" class="font-medium text-sm md:text-base"
              >Website</label
            >
            <input
              type="text"
              id="website"
              v-model="profileData.website"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="industry" class="font-medium text-sm md:text-base"
              >Industry</label
            >
            <input
              type="text"
              id="industry"
              v-model="profileData.industry"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="address" class="font-medium text-sm md:text-base"
              >Address</label
            >
            <input
              type="text"
              id="address"
              v-model="profileData.address"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2 col-span-1 md:col-span-2">
            <label for="description" class="font-medium text-sm md:text-base"
              >Description</label
            >
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
              {{ isEditing ? "Save Changes" : "Save" }}
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
import { ref, onMounted, computed } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";
import { storeToRefs } from "pinia";

const authCompanyStore = useAuthCompanyStore();
const router = useRouter();

const { companyProfile, currentCompany } = storeToRefs(authCompanyStore);

console.log("companyprofile", companyProfile);

const fileInput = ref(null);
const showOtpPopup = ref(false);
const otpCode = ref("");
const logoFile = ref(null);
const logoPreview = computed(() => {
  if (logoFile.value) {
    return URL.createObjectURL(logoFile.value);
  }
  if (companyProfile.value?.logo) {
    const baseURL = "http://localhost:3888/public/";
    const path1 = `${companyProfile.value.logo}`;
    const path2 = `${companyProfile.value.logo}`;

    const url1 = new URL(path1, baseURL).href;
    const url2 = new URL(path2, baseURL).href;

    if (!companyProfile.value.logo.includes("/")) {
      return url2;
    }
    return url1;
  }
  return null;
});
const isEditing = ref(false);
const profileData = ref({
  company_name: "",
  address: "",
  website: "",
  industry: "",
  description: "",
});

const fillProfileData = (profileDataInput, companyData) => {
  if (profileDataInput) {
    profileData.value.company_name = profileDataInput.company_name || "";
    profileData.value.address = profileDataInput.address || "";
    profileData.value.website = profileDataInput.website || "";
    profileData.value.industry = profileDataInput.industry || "";
    profileData.value.description = profileDataInput.description || "";
  } else {
    profileData.value = {
      company_name: "",
      address: "",
      website: "",
      industry: "",
      description: "",
    };
  }
  // Logo preview tetap dihandle oleh computed property
};

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  logoFile.value = file;
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
    if (companyProfile.value?.id && isEditing.value) {
      await authCompanyStore.updateProfileCompany(formData);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profil perusahaan berhasil diperbarui!",
        timer: 3000,
        showConfirmButton: false,
      });
      isEditing.value = false;
    } else if (!companyProfile.value?.id) {
      if (!logoFile.value && !companyProfile.value?.logo) {
        Swal.fire({
          icon: "warning",
          title: "Peringatan",
          text: "Harap masukkan logo perusahaan.",
        });
        return;
      }
      await authCompanyStore.createProfileCompany(formData);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profil perusahaan berhasil disimpan!",
        timer: 3000,
        showConfirmButton: false,
      });
    }
    await authCompanyStore.fetchProfileCompany();
    await authCompanyStore.getCompanyByAuth(); // Refresh data company juga
  } catch (error) {
    console.error("Gagal menyimpan/memperbarui profil perusahaan", error);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Gagal menyimpan/memperbarui profil perusahaan!",
      text: error.message || "Terjadi kesalahan.",
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
  Promise.all([
    authCompanyStore.fetchProfileCompany(),
    authCompanyStore.getCompanyByAuth(),
  ])
    .then(([profileDataResult, companyDataResult]) => {
      fillProfileData(profileDataResult, companyDataResult);
    })
    .catch((error) => console.error("Gagal memuat ulang data:", error));
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
    await authCompanyStore.fetchProfileCompany();
    await authCompanyStore.getCompanyByAuth();
    console.log(
      "Data currentCompany setelah verifikasi:",
      currentCompany.value
    );
  } catch (error) {
    await authCompanyStore.fetchProfileCompany();
    await authCompanyStore.getCompanyByAuth();
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      authCompanyStore.fetchProfileCompany(),
      authCompanyStore.getCompanyByAuth(),
    ]);
    console.log("currentCompany onMounted:", currentCompany.value);
    fillProfileData(companyProfile.value);
  } catch (error) {
    console.error("Gagal memuat data perusahaan:", error);
  }
});
</script>
