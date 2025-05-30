<template>
  <div class="p-4 md:p-10">
    <h1 class="text-xl md:text-3xl mb-4 text-center font-bold">Company Information</h1>
    <div class="bg-slate-300/30 p-4 md:p-10 rounded-md">
      <form action="" class="flex flex-col md:flex-row gap-y-6 md:gap-x-10">
        <div class="flex flex-col gap-y-4">
          <div
            class="w-32 h-32  md:w-40 md:h-40 rounded-md outline outline-blue-900 bg-blue-400/10 flex items-center justify-center m-auto md:m-0 overflow-hidden relative cursor-pointer"
          >
            <input
              ref="fileInput"
              type="file"
              class="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
            <span class="text-xl md:text-3xl font-semibold text-gray-500 z-0">
              <Icon
                icon="material-symbols-light:add-box-outline-sharp"
                width="24"
                height="24"
                md:width="32"
                md:height="32"
                style="color: #606060"
              />
            </span>
            <img src="" class="absolute w-full h-full object-cover" alt="" />
          </div>

          <div class="flex flex-col gap-y-2">
            <div class="flex justify-between items-center">
              <label for="" class="font-medium text-sm md:text-base">
                Email
                <span class="text-xs md:text-sm font-normal text-blue-900">Verify</span>
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
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 w-full md:w-52 text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-9 gap-y-3 w-full">
          <div class="flex flex-col gap-y-2">
            <label for="" class="font-medium text-sm md:text-base">Company Name</label>
            <input
              type="text"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="" class="font-medium text-sm md:text-base">Another Field</label>
            <input
              type="text"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="" class="font-medium text-sm md:text-base">Yet Another</label>
            <input
              type="text"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="" class="font-medium text-sm md:text-base">One More</label>
            <input
              type="text"
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-7 md:h-8 text-sm w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2 col-span-1 md:col-span-2">
            <label for="" class="font-medium text-sm md:text-base">Description</label>
            <textarea
              name=""
              id=""
              class="pl-2 md:pl-3 bg-blue-400/10 rounded-sm outline outline-blue-900 h-24 md:h-32 w-full text-sm"
            ></textarea>
          </div>
          <div class="flex gap-x-2 justify-end col-span-1 md:col-span-2">
            <button class="bg-blue-950/90 text-white px-3 md:px-5 rounded-md py-1 text-sm cursor-pointer">
              Edit
            </button>
            <button class="bg-blue-950/90 text-white px-3 md:px-5 rounded-md py-1 text-sm cursor-pointer">
              Save
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
    <div class="rounded-md shadow bg-gray-300 py-6 md:py-10 px-6 md:px-8 w-98 md:w-md">
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

        <div class="flex flex-col sm:flex-row justify-center gap-2 mt-4 md:mt-6">
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
import { ref } from 'vue';
import { Icon } from "@iconify/vue";

const showOtpPopup = ref(false);

const handleVerifyOtp = () => {
  // Add your OTP verification logic here
  console.log('Verifying OTP...');
  // After successful verification, you might want to hide the popup
  // showOtpPopup.value = false;
};
</script>