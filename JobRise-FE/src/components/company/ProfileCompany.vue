<template>
  <div
    class="flex flex-col lg:flex-row px-8 lg:justify-between pb-10 mb-14 mx-8 lg:px-28"
  >
    <div class="w-max flex m-auto lg:m-0 bg-slate-300/30 h-max p-10">
      <div
        class="w-40 h-40 rounded-lg bg-gray-300 flex items-center justify-center overflow-hidden relative cursor-pointer"
        @click="fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          class="absolute w-40 h-40 opacity-0 cursor-pointer z-10"
          @change="handleImageChange"
          :disabled="!isEditing"
          accept="image/*"
        />
        <span
          v-if="!companyForm.logoPreview && !companyData?.logo"
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
          v-if="companyForm.logoPreview"
          :src="companyForm.logoPreview"
          class="absolute w-full h-full object-cover"
          alt="Company Logo Preview"
        />
        <img
          v-if="companyData?.logo && !companyForm.logoPreview"
          :src="`http://localhost:3888/public/${companyData.logo}`"
          class="absolute w-full h-full object-cover"
          alt="Company Logo"
        />
      </div>
    </div>
    <div class="bg-slate-300/30 p-8">
      <form @submit.prevent="submitCompanyInfo">
        <div class="grid md:grid-cols-2 md:gap-x-20 lg:gap-x-14 gap-y-6">
          <div class="flex flex-col gap-y-2">
            <label for="companyName" class="font-bold text-lg">Company Name</label>
            <input
              type="text"
              id="companyName"
              class="bg-gray-300 rounded-lg outline-none text-md text-center shadow-lg py-2 lg:w-74 w-full"
              v-model="companyForm.companyName"
              :disabled="!isEditing"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="industry" class="font-bold text-lg">Industry</label>
            <input
              type="text"
              id="industry"
              class="bg-gray-300 rounded-lg outline-none text-md text-center shadow-lg py-2 lg:w-74 w-full"
              v-model="companyForm.industry"
              :disabled="!isEditing"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="address" class="font-bold text-lg">Address</label>
            <input
              type="text"
              id="address"
              class="bg-gray-300 rounded-lg outline-none text-md text-center shadow-lg py-2 lg:w-74 w-full"
              v-model="companyForm.address"
              :disabled="!isEditing"
            />
          </div>
          <div class="flex flex-col">
            <label for="website" class="font-bold text-lg">Website</label>
            <span class="pl-2 text-sm text-gray-500">Format :</span>
            <input
              type="text"
              id="website"
              class="bg-gray-300 rounded-lg outline-none text-md text-center shadow-lg py-2 lg:w-74 w-full"
              v-model="companyForm.website"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="pt-4">
          <label for="bio" class="font-bold text-lg">Bio</label>
          <textarea
            id="bio"
            rows="5"
            class="w-full bg-gray-300 rounded-lg outline-none text-md text-left pl-2 shadow-lg resize-none"
            v-model="companyForm.bio"
            :disabled="!isEditing"
          ></textarea>
        </div>
        <div class="w-full flex gap-x-3 justify-end md:col-span-2 pt-2">
          <button
            v-if="!isEditing"
            type="button"
            class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
            @click="enableEdit"
          >
            Edit
          </button>
          <template v-if="isEditing">
            <button
              type="button"
              class="text-gray-700 bg-gray-300 font-semibold text-lg px-6 py-2 rounded-lg shadow-md mr-2"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
            >
              Save
            </button>
          </template>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth"; // Pastikan path ini benar

const authCompanyStore = useAuthCompanyStore();

const fileInput = ref(null);
const companyForm = ref({
  companyName: "",
  industry: "",
  address: "",
  website: "",
  bio: "",
  logo: null,
  logoPreview: "",
});
const companyData = ref(null);
const isEditing = ref(false);
const originalCompanyData = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    companyForm.value.logo = file;
    companyForm.value.logoPreview = URL.createObjectURL(file);
  }
};

const enableEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  if (originalCompanyData.value) {
    companyForm.value.companyName = originalCompanyData.value.companyName || "";
    companyForm.value.industry = originalCompanyData.value.industry || "";
    companyForm.value.address = originalCompanyData.value.address || "";
    companyForm.value.website = originalCompanyData.value.website || "";
    companyForm.value.bio = originalCompanyData.value.bio || "";
    companyForm.value.logo = null;
    companyForm.value.logoPreview = "";
  }
};

const submitCompanyInfo = async () => {
  if (isEditing.value) {
    try {
      const formData = new FormData();
      formData.append("company_name", companyForm.value.companyName);
      formData.append("industry", companyForm.value.industry);
      formData.append("address", companyForm.value.address);
      formData.append("website", companyForm.value.website);
      formData.append("description", companyForm.value.bio);
      if (companyForm.value.logo) {
        formData.append(
          "logo",
          companyForm.value.logo,
          companyForm.value.logo.name
        );
      }

      await authCompanyStore.updateProfileCompany(formData); // Use updateProfileCompany
      await fetchCompanyData(); // Refresh data
      isEditing.value = false;
    } catch (error) {
      console.error("Failed to update company info", error);
      // Handle error
    }
  }
};

const fetchCompanyData = async () => {
  try {
    const data = await authCompanyStore.getProfileCompany(); // Menggunakan fungsi getProfileCompany
    companyData.value = data;
    originalCompanyData.value = { ...data };
    companyForm.value.companyName = data?.company_name || "";
    companyForm.value.industry = data?.industry || "";
    companyForm.value.address = data?.address || "";
    companyForm.value.website = data?.website || "";
    companyForm.value.bio = data?.description || "";
    if (data?.logo) {
      // Set logo preview jika ada logo dari server
      companyForm.value.logoPreview = `http://localhost:3888/public/${data.logo}`;
    }
  } catch (error) {
    console.error("Failed to fetch company data", error);
    // Handle error (mungkin redirect ke halaman error atau menampilkan pesan)
  }
};

onMounted(async () => {
  await fetchCompanyData();
});
</script>