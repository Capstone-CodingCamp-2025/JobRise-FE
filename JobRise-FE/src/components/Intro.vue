<template>
  <div
    class="relative py-20 flex flex-col-reverse md:flex-row md:justify-between md:gap-10 md:px-5"
  >
    <div class="md:w-84 lg:w-[500px] xl:w-[700px] xl:px-14 pt-74 md:pt-0">
      <div class="text-5xl font-black text-center">
        <h1>Find Your</h1>
        <h1>Dream Job</h1>
      </div>
      <div class="text-center px-1 pt-5 text-gray-600 lg:text-center">
        <p>
          Your future starts here. Find meaningful work, unlock your potential,
          and turn your dreams into reality. The career you've been waiting for
          is just a click away
        </p>
      </div>
      <div class="mt-10 px-3 lg:px-0 lg:w-full">
        <form action="" class="lg:bg-blue-700/50 rounded-lg lg:px-2">
          <div
            class="relative flex flex-col gap-0.5 md:gap-2 lg:flex-row lg:justify-between lg:gap-2 lg:py-2"
          >
            <div class="flex bg-blue-700/50 lg:bg-transparent rounded-lg">
              <Icon
                icon="material-symbols:search"
                width="24"
                height="24"
                class="absolute inset-x-20 inset-y-2 md:inset-x-16 lg:inset-x-0 lg:inset-y-4 xl:inset-y-4"
                style="color: #fff"
              />
              <input
                type="text"
                class="text-black text-center h-10 xl:h-10 w-full placeholder:text-white outline-none lg:placeholder:pl-2"
                placeholder="Job title, keyword"
              />
            </div>
            <div class="h-10 w-0.5 bg-white hidden lg:block xl:h-10"></div>
            <div class="flex bg-blue-700/50 lg:bg-transparent rounded-lg">
              <Icon
                icon="rivet-icons:map-pin"
                width="24"
                height="24"
                style="color: #fff"
                class="absolute inset-x-20 inset-y-12.5 md:inset-y-14 md:inset-x-16 lg:inset-x-50 lg:inset-y-4 xl:inset-x-64 xl:inset-y-4"
              />
              <input
                type="text"
                placeholder="Your location"
                class="text-black h-10 xl:h-10 w-full text-center outline-none placeholder:text-white"
              />
            </div>

            <button
              class="text-white bg-blue-900/75 font-semibold h-10 lg:w-28 lg:rounded-lg xl:h-10"
            >
              Find Job
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="m-auto ">
      <div class="bg-sky-400 w-74 h-74 rounded-full md:mb-98 absolute right-10 top-16"></div>
      <img
        src="../../../public/people.png"
        alt="people"
        class="w-max h-max absolute right-14 top-4"
      />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
