<template>
  <nav class="bg-[#D5DEEF] flex justify-between px-5">
    <!-- logo and text -->

    <div class="flex gap-x-4">
      <div class="hidden">
        <Icon
          icon="material-symbols:menu-rounded"
          width="24"
          height="24"
          style="color: #1c00ff"
        />
      </div>
      <div>
        <router-link :to="{ name: 'home-page' }">
          <img src="../../public/jobrise.png" alt="jobrise" class="w-32" />
        </router-link>
      </div>

      <!-- guest -->
      <div class="mt-3.5 flex gap-x-6">
        <router-link to="" class="font-bold text-blue-800 text-lg">
          Dashboard
        </router-link>
        <router-link to="" class="font-bold text-blue-800 text-lg">
          Find Job
        </router-link>
        <router-link to="" class="font-bold text-blue-800 text-lg">
          Company
        </router-link>
      </div>
    </div>

    <!-- search -->
    <div class="relative py-3">
      <input
        type="text"
        placeholder="Search text"
        class="bg-[#ECE6F0] py-2 rounded-full text-center pr-4"
      />
      
    </div>

    <!-- auth -->
    <div class="py-4 flex gap-x-4">
      <router-link
        to=""
        class="font-bold text-lg text-blue-800 border rounded-full  px-6 "
        >Login</router-link
      >
      <router-link
        to=""
        class="font-bold text-lg text-white  px-6  bg-blue-950 rounded-full"
        >Register</router-link
      >
    </div>
  </nav>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
