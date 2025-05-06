<template>
  <div class="relative pt-52 min-h-screen flex justify-between">
    <div>
      <div class="text-5xl font-black text-center">
        <h1>Find Your</h1>
        <h1>Dream Job</h1>
      </div>
      <div class="text-left pl-32 pt-5 text-gray-600">
        <p>Your future starts here. Find meaningful work, unlock</p>
        <p>your potential, and turn your dreams into reality. The</p>
        <p>career you've been waiting for is just a click away</p>
      </div>
      <div class="pt-5 pl-24">
        <form action="" class="bg-blue-300 w-max py-3 px-2 rounded-lg">
          <div class="relative">
            <input
              type="search"
              class="text-black placeholder:text-white outline-none pl-8"
              placeholder="Job title, keyword"
            />
            <Icon
              icon="material-symbols:search"
              width="24"
              height="24"
              class="absolute top-[4px]"
              style="color: #fff"
            />
            <input
              type="search"
              placeholder="Your location"
              class="text-white outline-none pl-4 placeholder:text-white"
            />
            <Icon
              icon="rivet-icons:map-pin"
              width="24"
              height="24"
              style="color: #fff"
              class="absolute right-66.5 top-1"
            />
            <div class="w-0.5 h-10 bg-white absolute left-46 -top-1"></div>
            <button
              class="text-white bg-blue-900/75 px-2 py-1 rounded-lg font-semibold"
            >
              Find Job
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class=" pr-64">
      <div class="bg-sky-400 w-60 h-60 rounded-full relative"></div>
      <img src="../../../public/people.png" alt="people" class="rounded-full w-[600px] h-[300px]  absolute inset-x-[670px] inset-y-48 " />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
