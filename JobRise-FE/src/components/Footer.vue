<template>
  <footer class="bg-[#638ECB] p-8 border-t-1">
    <router-link :to="{ name: 'home-page' }">
      <p class="text-white font-black text-4xl">JobRise</p>
    </router-link>
    <div class="flex flex-col md:flex-row justify-between mt-10">
      <div class="md:w-98 lg:w-[600px]">
        <p class="text-justify font-medium text-white">
          JobRise is a modern job portal designed to empower job seekers in
          every step of their career journey. Whether you're crafting the
          perfect resume or navigating the emotional toll of job hunting,
          JobRise is here to help you rise to the occasion.
        </p>
      </div>
      <div class=" justify-between gap-x-8 mt-10 md:mt-6 ">
        <p class="font-semibold text-xl text-center text-white">CC25-CF097</p>
        <div class="flex justify-center gap-x-3 md:gap-x-4">
          <p class="text-white text-xl">Reach Us</p>
          <a href="https://github.com/Capstone-CodingCamp-2025" class="bg-white text-blue-900 px-7 py-1 rounded-md">
            Github
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
