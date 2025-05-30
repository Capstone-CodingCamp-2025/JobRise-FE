<script setup>
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const showOtpPopup = ref(false);

const handleVerifyOtp = () => {
  // Add your OTP verification logic here
  console.log("Verifying OTP...");
  // After successful verification, you might want to hide the popup
  // showOtpPopup.value = false;
};
</script>

<template>
  <form
    class="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-300/30 p-8 rounded-md shadow-md"
    enctype="multipart/form-data"
  >
    <div class="flex flex-col items-center gap-6 col-span-1">
      <div
        class="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative cursor-pointer"
      >
        <input
          ref="fileInput"
          type="file"
          class="absolute w-40 h-40 opacity-0 cursor-pointer z-10"
        />
        <span class="text-3xl font-semibold text-gray-500 z-0">
          <Icon
            icon="material-symbols-light:add-box-outline-sharp"
            width="32"
            height="32"
            style="color: #606060"
          />
        </span>
        <img
          class="absolute w-full h-full object-cover"
          alt="Profile Image Preview"
        />
        <!-- <img
          v-if="profileData?.image && !profileForm.imagePreview"
          :src="`http://localhost:3888/public/${profileData.image}`"
          class="absolute w-full h-full object-cover"
          alt="Profile Image"
        /> -->
      </div>

      <div class="w-full">
        <div class="flex justify-between items-center pb-1">
          <label for="" class="font-medium text-sm md:text-base">
            Email
            <span class="text-xs md:text-sm font-normal text-blue-900"
              >Verify</span
            >
          </label>
          <button
            @click.prevent="showOtpPopup = true"
            class="bg-blue-950/90 text-white text-xs md:text-sm px-2 md:px-3 rounded-sm cursor-pointer h-6 md:h-auto"
          >
            Verify
          </button>
        </div>
        <input
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
          disabled
        />
      </div>

      <div class="w-full">
        <label class="font-semibold text-lg">Linkedin</label>
        <input
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
        />
      </div>

      <div class="w-full">
        <label class="font-semibold text-lg">Portofolio</label>
        <input
          type="text"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 text-center"
        />
      </div>
    </div>

    <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="font-semibold text-lg">Username</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Fullname</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Phone</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Age</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">Address</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
        />
      </div>

      <div>
        <label class="font-semibold text-lg">City</label>
        <input
          type="text"
          class="bg-gray-300 rounded-lg w-full py-2 px-3 outline outline-blue-900 text-center"
        />
      </div>

      <div class="md:col-span-2">
        <label class="font-semibold text-lg">Bio</label>
        <textarea
          rows="5"
          class="bg-gray-300 w-full rounded-lg py-2 px-3 outline outline-blue-900 resize-none text-left"
        ></textarea>
      </div>

      <div class="w-full flex gap-x-3 justify-end md:col-span-2 pt-2">
        <!-- <template > -->
        <!-- <button
            type="submit"
            class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
          >
            Save
          </button> -->
        <!-- </template> -->
        <!-- <template > -->
        <button
          type="button"
          class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
        >
          Edit
        </button>
        <!-- <template > -->
        <!-- <button
              type="button"
              class="text-gray-700 bg-gray-300 font-semibold text-lg px-6 py-2 rounded-lg shadow-md mr-2"
            >
              Cancel
            </button> -->
        <button
          type="submit"
          class="text-white bg-blue-950/80 font-semibold text-lg px-6 py-2 rounded-lg shadow-md"
        >
          Save
        </button>
        <!-- </template> -->
        <!-- </template> -->
      </div>
    </div>
  </form>
  <!-- <div v-if="error">
    Error loading profile: {{ error.message }}
  </div> -->

  <div
    v-if="showOtpPopup"
    class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
  >
    <div
      class="rounded-md shadow bg-gray-300 py-6 md:py-10 px-6 md:px-8 w-full sm:w-md"
    >
      <form @submit.prevent="handleVerifyOtp">
        <div class="flex flex-col gap-y-2">
          <label for="otp" class="font-medium text-sm md:text-base">
            Enter the OTP code <span class="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="otp"
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
