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
const error = ref(null);
const isEditing = ref(false);
const isCreating = ref(false); // Tambahkan state untuk menandakan pembuatan profil baru
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
  isCreating.value = false;
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
  } else {
    // Jika tidak ada original data (saat mode create), reset ke form kosong
    Object.keys(profileForm.value).forEach(key => {
      if (key !== 'imagePreview') {
        profileForm.value[key] = "";
      } else {
        profileForm.value[key] = "";
      }
    });
  }
};

const submitProfile = async () => {
  try {
    const formData = new FormData();
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

    if (!profileData.value) {
      // Jika profileData belum ada, berarti ini pembuatan profil baru
      formData.append("username", profileForm.value.username); // Kirim username saat create
      console.log("formData username (create):", formData.get("username"));
      await authStore.createProfile(formData);
      isCreating.value = false;
    } else if (isEditing.value) {
      // Jika profileData sudah ada dan sedang dalam mode edit, lakukan update
      // JANGAN append username di sini
      console.log("formData (update):", Array.from(formData.entries())); // Log data yang dikirim saat update
      await authStore.updateProfileUser(formData);
      isEditing.value = false;
    }
    await fetchProfileData(); // Refresh data setelah create atau update
  } catch (error) {
    console.error("Failed to submit profile", error);
    // Tambahkan penanganan error jika diperlukan
  }
};

const fetchProfileData = async () => {
  
  error.value = null;
  try {
    const data = await authStore.getProfileUser();
    profileData.value = data;
    originalProfileData.value = data ? { ...data } : null;
    isCreating.value = !data; // Set isCreating jika data tidak ada
    isEditing.value = false; // Reset mode edit saat data baru di-fetch

    if (data) {
      // Isi form dengan data yang ada
      profileForm.value.username = data.username || "";
      profileForm.value.full_name = data.full_name || "";
      profileForm.value.age = data.age || "";
      profileForm.value.address = data.address || "";
      profileForm.value.phone = data.phone || "";
      profileForm.value.bio = data.bio || "";
      profileForm.value.linkedin = data.linkedin || "";
      profileForm.value.portofolio_url = data.portofolio_url || "";
      profileForm.value.city = data.city || "";
    } else {
      // Jika data tidak ada, biarkan form kosong dan set isCreating ke true
      Object.keys(profileForm.value).forEach(key => {
        if (key !== 'imagePreview') {
          profileForm.value[key] = "";
        } else {
          profileForm.value[key] = "";
        }
      });
      isCreating.value = true;
    }
  } catch (err) {
    console.error("Failed to fetch profile data", err);
    // Jika error adalah 404 (Not Found), set state untuk pembuatan profil baru tanpa menampilkan error
    if (err.message?.includes('404') || err.message === 'Request failed with status code 404' || err.message === 'User profile not found') {
      isCreating.value = true;
      profileData.value = null;
      originalProfileData.value = null;
      Object.keys(profileForm.value).forEach(key => {
        if (key !== 'imagePreview') {
          profileForm.value[key] = "";
        } else {
          profileForm.value[key] = "";
        }
      });
      error.value = null; // Penting: set error.value menjadi null agar pesan error tidak ditampilkan
    } else {
      // Jika error bukan 404, tampilkan pesan error
      error.value = err;
    }
  } 
};

const triggerFileInput = () => {
  fileInput.value.click();
};

onMounted(async () => {
  await fetchProfileData();
});
</script>

<template>
  <form
    v-if="!error"
    class="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-300/30 p-8 rounded-md shadow-md"
    enctype="multipart/form-data"
    @submit.prevent="submitProfile"
  >
    <div class="flex flex-col items-center gap-6 col-span-1">
      <div
        class="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative cursor-pointer"
        @click="triggerFileInput"
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
          :disabled="!isEditing && !isCreating"
        />
      </div>

      <div class="w-full">
        <label class="font-semibold text-lg">Portofolio</label>
        <input
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.portofolio_url"
          :disabled="!isEditing && !isCreating"
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
          :disabled="profileData ? true : (!isEditing && !isCreating)"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Fullname</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.full_name"
          :disabled="!isEditing && !isCreating"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Phone</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.phone"
          :disabled="!isEditing && !isCreating"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Age</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.age"
          :disabled="!isEditing && !isCreating"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Address</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.address"
          :disabled="!isEditing && !isCreating"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">City</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.city"
          :disabled="!isEditing && !isCreating"
        />
      </div>

      <div class="md:col-span-2">
        <label class="font-semibold text-lg">Bio</label>
        <textarea
          rows="5"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 resize-none text-left"
          v-model="profileForm.bio"
          :disabled="!isEditing && !isCreating"
        ></textarea>
      </div>

      <div class="w-full flex gap-x-3 justify-end md:col-span-2 pt-2">
        <template v-if="!profileData">
          <button
            type="submit"
            class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
          >
            Save
          </button>
        </template>
        <template v-else>
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
        </template>
      </div>
    </div>
  </form>
  <div v-if="error">
    Error loading profile: {{ error.message }}
  </div>
</template>