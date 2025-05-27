<template>
  <form
    class="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-300/30 p-8 rounded-md shadow-md"
    @submit.prevent="handleSubmit"
    enctype="multipart/form-data"
  >
    <div class="flex flex-col items-center gap-6 col-span-1">
      <div
        class="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative cursor-pointer"
        @click="!isEditing && $refs.fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          class="absolute w-40 h-40 opacity-0 cursor-pointer z-10"
          @change="handleImageChange"
        />
        <span
          v-if="!isEditing && !profileForm.imageURL"
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
          v-if="profileForm.imageURL"
          :src="profileForm.imageURL"
          :key="profileForm.imageURL"
          class="absolute w-full h-full object-cover"
          alt="Profile Image"
        />
      </div>

      <div class="w-full">
        <label class="font-semibold text-lg">Email</label>
        <input
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          v-model="profileForm.email"
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
          @click="isEditing = true"
        >
          Edit
        </button>
        <button
          v-if="isEditing"
          type="button"
          class="text-gray-800 bg-gray-300 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
          @click="
            isEditing = false;
            fetchProfileData();
          "
        >
          Cancel
        </button>
        <button
          v-if="isEditing"
          type="submit"
          class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
        >
          Save
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";

const authStore = AuthUserStorage();
const profileForm = ref({
  username: "",
  email: "",
  full_name: "",
  age: "",
  address: "",
  image: null,
  imageURL: "",
  phone: "",
  bio: "",
  linkedin: "",
  portofolio_url: "",
  city: "",
});
const isEditing = ref(false);
const fileInput = ref(null);

const handleImageChange = (event) => {
  if (!isEditing.value) return;
  const file = event.target.files[0];
  if (file) {
    profileForm.value.image = file;
    profileForm.value.imageURL = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  if (isEditing.value) {
    try {
      const formData = new FormData();
      for (const key in profileForm.value) {
        if (key === "image") {
          formData.append("image", profileForm.value.image || null); // Kirim null jika tidak ada file baru
        } else if (
          key !== "imageURL" &&
          key !== "email" &&
          key !== "username"
        ) {
          formData.append(key, profileForm.value[key]);
        }
      }
      console.log(
        "FormData before sending:",
        Object.fromEntries(formData.entries())
      );

      const response = await authStore.updateProfile(formData);
      console.log("Profile successfully updated!", response);
      isEditing.value = false;
      await fetchProfileData();
      await authStore.getUserByAuth();
    } catch (error) {
      console.error("Failed to update profile:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Something went wrong.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }
};

const fetchProfileData = async () => {
  try {
    const profileData = await authStore.getProfile();
    console.log("Profile data fetched:", profileData);

    if (profileData) {
      for (const key in profileData) {
        if (profileForm.value.hasOwnProperty(key)) {
          profileForm.value[key] = profileData[key];
        }
      }
      if (profileData.image) {
        profileForm.value.imageURL = `/public/img_ProfileUser/${profileData.image}`;
      } else {
        profileForm.value.imageURL = "";
      }
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }

  if (authStore.currentUser && !profileForm.value.full_name) {
    profileForm.value.email = authStore.currentUser.email || "";
    profileForm.value.full_name = authStore.currentUser.full_name || "";
  }
};

onMounted(async () => {
  await fetchProfileData();
});
</script>
