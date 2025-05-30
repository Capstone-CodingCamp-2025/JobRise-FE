<script setup>
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { Icon } from "@iconify/vue";

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
        <span
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
        <label class="font-semibold text-lg">Email</label>
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
</template>