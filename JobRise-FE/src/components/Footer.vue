<template>
  <footer class="bg-radial from-gray-200 from-10% to-white p-8">
    <router-link :to="{ name: 'home-page' }">
      <img src="../../public/jobrise.png" alt="" />
    </router-link>
    <div class="flex justify-between">
      <div class="w-[640px]">
        <p class="text-justify font-medium text-gray-700">
          JobRise is a modern job portal designed to empower job seekers in
          every step of their career journey. Whether you're crafting the
          perfect resume or navigating the emotional toll of job hunting,
          JobRise is here to help you rise to the occasion.
        </p>
      </div>
      <div class="flex gap-10 mt-10">
        <p class="font-bold text-2xl text-gray-700">CC25-CF097</p>

        <a href="https://github.com/Capstone-CodingCamp-2025">
          <Icon icon="skill-icons:github-dark" width="36" height="36" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
