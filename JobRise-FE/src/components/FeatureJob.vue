<template>
  <div class="py-16 min-h-screen px-3 md:px-10 lg:px-32">
    <div class="flex justify-between">
      <h1 class="text-xl md:text-3xl font-black">Featured Job</h1>

      <router-link
        :to="{ name: 'role-login' }"
        class="outline-1 outline-blue-800 py-1 mb-6 rounded-sm px-5 flex font-semibold text-base text-blue-900 hover:bg-blue-950 hover:text-white"
      >
        View all
        <Icon
          icon="formkit:arrowright"
          width="25"
          height="18"
          class="mt-1"
          style="color: #1b00fb"
        />
      </router-link>
    </div>
    <div class="grid md:grid-cols-2 gap-x-4 gap-y-8 lg:gap-x-10 xl:grid-cols-3">
      <div class="px-5 py-4 rounded-lg bg-[#b8caecda] outline outline-blue-800">
        <div>
          <h1 class="font-bold text-2xl mb-2">Posisi</h1>
          <div class="flex gap-x-4 mb-4">
            <p class="text-blue-800 text-xs font-bold">
              full
            </p>
            <p class="text-xs text-gray-500 font-bold">
              Salary : 1212
            </p>
          </div>
          <div class="flex gap-x-6">
            <div class="flex items-center justify-center">
              <img
                src=""
                alt=""
                class="object-cover w-14 h-14 md:w-16 md:h-16"
              />
            </div>

            <p class="md:pt-4 lg:pt-5 pt-3 text-md text-blue-900 font-medium">
              anbdul
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import axios from "axios";
import { onMounted } from "vue";
import { ref } from "vue";


</script>
