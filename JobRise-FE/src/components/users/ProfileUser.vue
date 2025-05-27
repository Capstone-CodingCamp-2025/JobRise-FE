<template>
  <form
    class="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-300/30 p-8 rounded-md shadow-md"
    enctype="multipart/form-data"
    @submit.prevent="submitProfile"
  >
    <div class="flex flex-col items-center gap-6 col-span-1">
      <div
        class="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative cursor-pointer"
        @click="fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          class="absolute w-40 h-40 opacity-0 cursor-pointer z-10"
          @change="handleImageChange"
        />
        <span
          v-if="!profileForm.imagePreview && !profileData?.image"
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
          v-if="profileForm.imagePreview"
          :src="profileForm.imagePreview"
          class="absolute w-full h-full object-cover"
          alt="Profile Image Preview"
        />
        <img
          v-if="profileData?.image && !profileForm.imagePreview"
          :src="`http://localhost:3888/public/${profileData.image}`"
          class="absolute w-full h-full object-cover"
          alt="Profile Image"
        />
      </div>

      <div class="w-full">
        <label class="font-semibold text-lg">Email</label>
        <input
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          :value="authStore.currentUser?.email"
          disabled
        />
      </div>

      <div class="w-full">
        <label class="font-semibold text-lg">Linkedin</label>
        <input
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.linkedin"
          :disabled="!isEditing"
        />
      </div>

      <div class="w-full">
        <label class="font-semibold text-lg">Portofolio</label>
        <input
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.portofolio_url"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="font-semibold text-lg">Username</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.username"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Fullname</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.full_name"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Phone</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.phone"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Age</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.age"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Address</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.address"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">City</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.city"
          :disabled="!isEditing"
        />
      </div>

      <div class="md:col-span-2">
        <label class="font-semibold text-lg">Bio</label>
        <textarea
          rows="5"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 resize-none text-left"
          v-model="profileForm.bio"
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
    </div>
  </form>
</template>

<script setup>
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";

const authStore = AuthUserStorage();
const fileInput = ref(null);
const profileForm = ref({
  username: "",
  full_name: "",
  age: "",
  address: "",
  image: null,
  imagePreview: "",
  phone: "",
  bio: "",
  linkedin: "",
  portofolio_url: "",
  city: "",
});
const profileData = ref(null);
const loading = ref(false);
const error = ref(null);
const isEditing = ref(false);
const originalProfileData = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileForm.value.image = file;
    profileForm.value.imagePreview = URL.createObjectURL(file);
    console.log("File object:", file);
  }
};

const enableEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  // Reset form data to the original values
  if (originalProfileData.value) {
    profileForm.value.username = originalProfileData.value.username || "";
    profileForm.value.full_name = originalProfileData.value.full_name || "";
    profileForm.value.age = originalProfileData.value.age || "";
    profileForm.value.address = originalProfileData.value.address || "";
    profileForm.value.phone = originalProfileData.value.phone || "";
    profileForm.value.bio = originalProfileData.value.bio || "";
    profileForm.value.linkedin = originalProfileData.value.linkedin || "";
    profileForm.value.portofolio_url = originalProfileData.value.portofolio_url || "";
    profileForm.value.city = originalProfileData.value.city || "";
    profileForm.value.image = null;
    profileForm.value.imagePreview = "";
  }
};

const submitProfile = async () => {
  if (isEditing.value) {
    try {
      const formData = new FormData();
      // formData.append("username", profileForm.value.username);
      formData.append("full_name", profileForm.value.full_name);
      formData.append("age", profileForm.value.age);
      formData.append("address", profileForm.value.address);
      formData.append("city", profileForm.value.city);
      formData.append("phone", profileForm.value.phone);
      formData.append("bio", profileForm.value.bio);
      formData.append("linkedin", profileForm.value.linkedin);
      formData.append("portofolio_url", profileForm.value.portofolio_url);

      if (profileForm.value.image) {
        formData.append(
          "image",
          profileForm.value.image,
          profileForm.value.image.name
        );
      }
      console.log("formData image:", formData.get("image"));
      console.log("formData username:", formData.get("username"));
      console.log("formData email:", formData.get("email"));

      await authStore.updateProfileUser(formData);
      console.log("Profile updated successfully!");
      await fetchProfileData();
      isEditing.value = false; // Keluar dari mode edit setelah berhasil menyimpan
    } catch (error) {
      console.error("Failed to update profile", error);
      // Tambahkan penanganan error jika diperlukan, misalnya menampilkan pesan ke pengguna
    }
  }
};

const fetchProfileData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await authStore.getProfileUser();
    profileData.value = data;
    originalProfileData.value = { ...data }; // Simpan data awal untuk fitur cancel
    profileForm.value.username = data?.username || "";
    profileForm.value.full_name = data?.full_name || "";
    profileForm.value.age = data?.age || "";
    profileForm.value.address = data?.address || "";
    profileForm.value.phone = data?.phone || "";
    profileForm.value.bio = data?.bio || "";
    profileForm.value.linkedin = data?.linkedin || "";
    profileForm.value.portofolio_url = data?.portofolio_url || "";
    profileForm.value.city = data?.city || "";
  } catch (err) {
    error.value = err;
    console.error("Failed to fetch profile data", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchProfileData();
});
</script>