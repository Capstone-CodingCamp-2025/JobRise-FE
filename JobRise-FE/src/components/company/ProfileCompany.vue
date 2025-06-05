<template>
  <div
    v-if="isLoading"
    class="fixed top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center z-50"
  >
    <div
      class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-900"
    ></div>
  </div>

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
            class="w-32 h-32 md:w-40 md:h-40 rounded-md outline outline-blue-900 bg-blue-400/10 flex items-center justify-center m-auto md:m-0 overflow-hidden relative"
            :class="{
              'cursor-pointer': isEditing,
              'cursor-not-allowed bg-gray-200/50': !isEditing,
            }"
            @click="isEditing ? fileInput.click() : null"
          >
            <input
              ref="fileInput"
              type="file"
              class="absolute w-full h-full opacity-0 cursor-pointer z-10"
              accept="image/jpeg, image/png, image/jpg"
              @change="handleLogoUpload"
              :disabled="!isEditing"
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
                <span
                  v-else
                  class="text-xs md:text-sm font-normal text-blue-900"
                  >Unverified</span
                >
              </label>
              <button
                @click.prevent="sendOTPVerification"
                :disabled="currentCompany.data?.email_verified === 'yes'"
                class="bg-blue-950/90 text-white text-xs md:text-sm px-2 md:px-3 rounded-sm cursor-pointer h-6 md:h-auto disabled:bg-gray-400"
              >
                Verify
              </button>
            </div>
            <input
              type="text"
              id="companyEmail"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 w-full md:w-52 text-sm disabled:bg-gray-200/50"
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
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full disabled:bg-gray-200/50 disabled:cursor-not-allowed"
              :disabled="!isEditing"
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
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full disabled:bg-gray-200/50 disabled:cursor-not-allowed"
              :disabled="!isEditing"
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
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full disabled:bg-gray-200/50 disabled:cursor-not-allowed"
              :disabled="!isEditing"
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
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full disabled:bg-gray-200/50 disabled:cursor-not-allowed"
              :disabled="!isEditing"
            />
          </div>
          <div class="flex flex-col gap-y-2 col-span-1 md:col-span-2">
            <label for="description" class="font-medium text-sm md:text-base"
              >Description</label
            >
            <textarea
              id="description"
              v-model="profileData.description"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-24 md:h-32 w-full text-sm disabled:bg-gray-200/50 disabled:cursor-not-allowed"
              :disabled="!isEditing"
            ></textarea>
          </div>
          <div class="flex gap-x-2 justify-end col-span-1 md:col-span-2">
            <button
              v-if="!isEditing && companyProfile?.id"
              type="button"
              @click="enterEditMode"
              class="bg-blue-950/90 text-white px-3 md:px-5 rounded-md py-1 text-sm cursor-pointer"
            >
              Edit
            </button>
            <button
              v-if="isEditing && companyProfile?.id"
              type="button"
              @click="cancelEditMode"
              class="bg-gray-500 text-white px-3 md:px-5 rounded-md py-1 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-950/90 text-white px-3 md:px-5 rounded-md py-1 text-sm cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="!isEditing"
            >
              {{
                isEditing && companyProfile?.id ? "Save Changes" : "Save"
              }}
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

const isLoading = ref(true);
const isEditing = ref(false); // Default to false
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
    // This logic can be simplified, assuming the path is consistent
    return new URL(companyProfile.value.logo, baseURL).href;
  }
  return null;
});

const profileData = ref({
  company_name: "",
  address: "",
  website: "",
  industry: "",
  description: "",
});

const fillProfileData = (profile) => {
  if (profile) {
    profileData.value.company_name = profile.company_name || "";
    profileData.value.address = profile.address || "";
    profileData.value.website = profile.website || "";
    profileData.value.industry = profile.industry || "";
    profileData.value.description = profile.description || "";
  } else {
    profileData.value = {
      company_name: "",
      address: "",
      website: "",
      industry: "",
      description: "",
    };
  }
};

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    logoFile.value = file;
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
    // Update existing profile
    if (companyProfile.value?.id && isEditing.value) {
      await authCompanyStore.updateProfileCompany(formData);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile updated successfully!",
        timer: 3000,
        showConfirmButton: false,
      });
      isEditing.value = false; // Back to read-only mode
    }
    // Create new profile
    else if (!companyProfile.value?.id) {
      if (!logoFile.value && !companyProfile.value?.logo) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please upload a company logo.",
        });
        return;
      }
      await authCompanyStore.createProfileCompany(formData);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile saved successfully!",
        timer: 3000,
        showConfirmButton: false,
      });
      isEditing.value = false; // Switch to read-only after creation
    }
    // Refresh data from server
    await authCompanyStore.fetchProfileCompany();
    await authCompanyStore.getCompanyByAuth();
    fillProfileData(companyProfile.value); // Re-fill form with new data
  } catch (error) {
    console.error("Failed to save/update profile", error);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Failed to save/update profile!",
      text: error.message || "An error occurred.",
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
  // Reset form data to its original state from the store
  fillProfileData(companyProfile.value);
  // Reset logo file input if user selected a new one but cancelled
  logoFile.value = null;
  fileInput.value.value = ""; // Clear file input
};

const sendOTPVerification = async () => {
  try {
    await authCompanyStore.sendVerificationOTP();
    showOtpPopup.value = true;
  } catch (error) {
    // Error is handled in the store
  }
};

const handleVerifyOtpSubmit = async () => {
  try {
    await authCompanyStore.verifyEmailOTP(otpCode.value);
    showOtpPopup.value = false;
    otpCode.value = "";
    await authCompanyStore.getCompanyByAuth(); // Refresh company data
  } catch (error) {
    // Error is handled in the store, just ensure popup closes
    showOtpPopup.value = false;
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      authCompanyStore.fetchProfileCompany(),
      authCompanyStore.getCompanyByAuth(),
    ]);

    fillProfileData(companyProfile.value);

    // If there is NO profile, enter edit mode immediately.
    // Otherwise, stay in read-only mode.
    if (!companyProfile.value?.id) {
      isEditing.value = true;
    }
  } catch (error) {
    console.error("Failed to load company data:", error);
    // Even on error, allow user to create a profile
    isEditing.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>