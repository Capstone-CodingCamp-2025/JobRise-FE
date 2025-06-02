<template>
  <div v-if="loadingProfile" class="flex justify-center items-center h-64">
    <p class="text-xl font-semibold text-gray-600">Loading profile...</p>
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
        @click="$refs.fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          class="absolute w-40 h-40 opacity-0 cursor-pointer z-10"
          @change="handleFileChange"
          accept="image/*"
        />
        <span v-if="!imagePreview" class="text-3xl font-semibold text-gray-500 z-0">
          <Icon
            icon="material-symbols-light:add-box-outline-sharp"
            width="32"
            height="32"
            style="color: #606060"
          />
        </span>
        <img
          v-if="imagePreview"
          :src="imagePreview"
          class="absolute w-full h-full object-cover"
          alt="Profile Image Preview"
        />
      </div>

      <div class="w-full">
        <div class="flex justify-between items-center pb-1">
          <label for="email" class="font-medium text-sm md:text-base">
            Email
            <span
              v-if="currentUser?.email_verified === 'yes'"
              class="text-xs md:text-sm font-normal text-green-600 ml-1"
            >
              (Verified)
            </span>
            <span
              v-else
              class="text-xs md:text-sm font-normal text-red-600 ml-1"
            >
              (Not Verified)
            </span>
          </label>
          <button
            v-if="currentUser?.email_verified !== 'yes'"
            @click.prevent="handleVerifyOtpRequest"
            class="bg-blue-950/90 text-white text-xs md:text-sm px-2 md:px-3 rounded-sm cursor-pointer h-6 md:h-auto"
          >
            Verify
          </button>
        </div>
        <input
          id="email"
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          :value="currentUser?.email"
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
        <label for="portofolio_url" class="font-semibold text-lg">Portofolio</label>
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
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="userProfile !== null || !isEditing"
        />
      </div>

      <div>
        <label for="full_name" class="font-semibold text-lg">Fullname</label>
        <input
          id="full_name"
          v-model="profileForm.full_name"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="phone" class="font-semibold text-lg">Phone</label>
        <input
          id="phone"
          v-model="profileForm.phone"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="age" class="font-semibold text-lg">Age</label>
        <input
          id="age"
          v-model="profileForm.age"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="address" class="font-semibold text-lg">Address</label>
        <input
          id="address"
          v-model="profileForm.address"
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <label for="city" class="font-semibold text-lg">City</label>
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
          class="text-gray-700 bg-gray-300 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
          @click="cancelEdit"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
        >
          {{ isEditing ? 'Save Changes' : 'Save' }}
        </button>
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
            class="bg-gray-400 text-white w-full rounded-sm py-1 text-sm cursor-pointer"
            @click="showOtpPopup = false"
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
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";

const authUserStore = AuthUserStorage();
const { userProfile, currentUser, tokenUser } = storeToRefs(authUserStore);
const showOtpPopup = ref(false);
const otpCode = ref("");
const fileInput = ref(null);
const imagePreview = ref(null);
const profileForm = ref({
  username: "",
  full_name: "",
  age: "",
  address: "",
  city: "",
  phone: "",
  bio: "",
  linkedin: "",
  portofolio_url: "",
  image: null,
});
const loadingProfile = ref(true);
const isEditing = ref(false);

watch(userProfile, (newProfile) => {
  if (newProfile) {
    for (const key in profileForm.value) {
      if (newProfile.hasOwnProperty(key)) {
        profileForm.value[key] = newProfile[key];
      }
    }
    imagePreview.value = newProfile.image ? `http://localhost:3888/public/${newProfile.image}` : null;
  } else {
    Object.keys(profileForm.value).forEach(key => {
      if (key !== 'image') {
        profileForm.value[key] = '';
      }
    });
    profileForm.value.image = null;
    imagePreview.value = null;
  }
  isEditing.value = false;
}, { immediate: true });

const fetchProfile = async () => {
  loadingProfile.value = true;
  try {
    if (tokenUser.value) {
      await authUserStore.fetchUserProfile();
    } else {
      console.warn("No token found, skipping profile fetch.");
      userProfile.value = null;
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    if (error.response?.status === 404) {
      Swal.fire({
        icon: 'info',
        title: 'No Profile Found',
        text: 'Please fill in your profile details to create one.',
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error Fetching Profile',
        text: error.message || 'Something went wrong while fetching your profile.',
      });
    }
  } finally {
    loadingProfile.value = false;
  }
};

onMounted(fetchProfile);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileForm.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  } else {
    profileForm.value.image = null;
    imagePreview.value = userProfile.value?.image ? `http://localhost:3888/public/${userProfile.value.image}` : null;
  }
};

const handleSubmit = async () => {
  try {
    const formData = new FormData();
    for (const key in profileForm.value) {
      if (key !== 'image' && key !== 'username' && key !== 'email') {
        formData.append(key, profileForm.value[key]);
      }
    }

    if (profileForm.value.image instanceof File) {
      formData.append('image', profileForm.value.image, profileForm.value.image.name);
    } else if (!userProfile.value && !profileForm.value.image) {
      const emptyFile = new File([''], 'no_image.jpg', { type: 'image/jpeg' });
      formData.append('image', emptyFile, emptyFile.name);
    }

    if (userProfile.value && userProfile.value.id) {
      await authUserStore.updateProfileUser(formData);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profile updated successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      formData.append('username', profileForm.value.username);
      await authUserStore.createProfile(formData);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profile created successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
    }
    await fetchProfile();
    isEditing.value = false;
  } catch (error) {
    console.error("Failed to create/update profile:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to save profile.',
    });
  }
};

const handleVerifyOtpRequest = async () => {
  try {
    await authUserStore.sendVerificationOTP();
    showOtpPopup.value = true;
  } catch (error) {
    console.error("Failed to send OTP request:", error);
  }
};

const handleVerifyOtp = async () => {
  try {
    const response = await authUserStore.verifyEmailOTP(otpCode.value);
    showOtpPopup.value = false;
    otpCode.value = "";
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: response.message || 'Email verified successfully!',
      timer: 3000,
      showConfirmButton: false,
    });
    await fetchProfile();
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: error.response?.data?.message || "Failed to verify OTP.",
      timer: 3000,
      showConfirmButton: false,
    });
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  if (userProfile.value) {
    for (const key in profileForm.value) {
      if (userProfile.value.hasOwnProperty(key)) {
        profileForm.value[key] = userProfile.value[key];
      }
    }
    imagePreview.value = userProfile.value.image ? `http://localhost:3888/public/${userProfile.value.image}` : null;
  } else {
    Object.keys(profileForm.value).forEach(key => {
      if (key !== 'image') {
        profileForm.value[key] = '';
      }
    });
    profileForm.value.image = null;
    imagePreview.value = null;
  }
};
</script>