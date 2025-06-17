<template>
  <div
    class="relative py-14 xl:py-20 flex flex-col-reverse md:flex-row md:justify-between md:gap-10 md:px-5"
  >
    <div class="md:w-84 lg:w-[500px] xl:w-[700px] xl:px-14 pt-78 md:pt-0">
      <div class="text-5xl font-black text-center">
        <h1>Find Your</h1>
        <h1>Dream Job</h1>
      </div>
      <div class="text-center px-1 pt-5 text-gray-600 lg:text-left">
        <p>
          Your future starts here. Find meaningful work, unlock your potential,
          and turn your dreams into reality. The career you've been waiting for
          is just a click away
        </p>
      </div>
      <div class="mt-10 px-3 lg:px-0 lg:w-full">
        <form action="/role-login" class=" rounded-lg lg:px-2 lg:outline outline-blue-900 relative">
          <div
            class="relative flex flex-col gap-2 md:gap-2 lg:flex-row lg:justify-between lg:gap-2 lg:py-2"
          >
            <div class="flex bg-blue-700/50 lg:bg-transparent rounded-lg outline lg:outline-none">
              <Icon
                icon="material-symbols:search"
                width="24"
                height="24"
                class="absolute inset-x-32 inset-y-2 md:inset-x-22 lg:inset-x-0 lg:inset-y-4 xl:inset-y-4"
                style="color: #150957"
              />
              <input
                type="text"
                class="text-blue-950 text-center  lg:pl-8 bg-white lg:text-left  h-10 xl:h-10 w-full  placeholder:text-blue-950 outline-none "
                placeholder="Job title"
              />
            </div>
            <div class="h-10 w-[1px] bg-blue-950 hidden lg:block xl:h-10 absolute lg:inset-x-38 xl:inset-x-46"></div>
            <div class="flex bg-blue-700/50 lg:bg-transparent rounded-lg outline lg:outline-none">
              <Icon
                icon="rivet-icons:map-pin"
                width="24"
                height="24"
                style="color: #150957"
                class="absolute inset-x-32 inset-y-14 md:inset-y-14 md:inset-x-22 lg:inset-x-44 lg:inset-y-4 xl:inset-x-54 xl:inset-y-4"
              />
              <input
                type="text"
                placeholder="City, State"
                class="text-blue-950 bg-white h-10 xl:h-10 w-full pl-2 text-center md:pl-2 lg:text-left xl:pl-2  outline-none placeholder:text-blue-950"
              />
            </div>

            <button
              class="text-white bg-blue-950/80 font-semibold h-10 lg:w-28 lg:rounded-lg xl:h-10 rounded-lg cursor-pointer"
            >
              Find Job
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="m-auto ">
      <div class="bg-[#D5DEEF] w-74 h-74 rounded-full md:mb-98 absolute right-10 top-16"></div>
      <img
        src="/src/assets/people.png"
        alt="people"
        class="w-max h-max absolute right-14 top-2"
      />
    </div>
    
  </div>
  <div>
    <RegisterNow/>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import RegisterNow from "./RegisterNow.vue";
</script>
