<template>
  <div class="flex justify-between w-full text-center  bg-blue-300 p-1">
    <!-- menu dan Icon -->
    <div class="flex gap-x-2">
      <div class="flex">

        <Icon
        icon="material-symbols:menu-rounded"
        width="32"
        height="32"
        style="color: #fff"
        class="mt-2"
        />
      <router-link to="">
        <img src="/src/assets/jobrise.png" class="w-28" alt="" />
      </router-link>
    </div>
      <!-- end -->
      
      <!-- User -->
      <div class="flex gap-x-8 pt-3">
        <router-link to="">Dashboard</router-link>
        <router-link to="">CV</router-link>
        <router-link to="">Find Job</router-link>
        <router-link to="">Applied</router-link>
        <router-link to="">Favorite Job</router-link>
        <router-link to="">Company</router-link>
      </div>
    </div>
    <!-- end -->

    <!-- search -->
    <div class="relative pt-2">
      <input type="text" placeholder="Search text" class="bg-[#ECE6F0] outline-none py-2 rounded-full text-center w-max" />
      <Icon
        icon="material-symbols:search"
        width="24"
        height="24"
        style="#fff"
        class="absolute inset-x-36 inset-y-4.5"
      />
    </div>
    <!-- end -->

    <!-- isRegister -->
    <div class="text-white">
      <router-link to="">Sign in</router-link>
      <router-link to="">Register</router-link>
    </div>
    <!-- end -->
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
