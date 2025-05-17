<template>
  <div class="bg-blue-200/50 text-center py-20">
    <h1 class="md:text-5xl text-4xl font-bold">How JobRise Work</h1>
    <div
      class="pt-14 md:px-9 flex flex-col gap-y-20 xl:px-32 md:flex-row justify-center relative"
    >
      <!-- Item 1 -->
      <div class="flex flex-col">
        <div class="flex">
          <div
            class="bg-white w-20 h-20 m-auto place-content-center rounded-full mb-4 relative"
          >
            <Icon
              icon="lucide:user-plus"
              width="48"
              height="48"
              style="color: #1b00fb"
              class="absolute inset-y-4 inset-x-4.5"
            />
            <!-- Garis horizontal (desktop) -->
            <div
              class="hidden md:block absolute md:inset-x-20 md:inset-y-10 xl:w-44 xl:inset-x-24 w-29 lg:w-44 h-0.5 bg-gray-700"
            ></div>
            <!-- Panah horizontal (desktop) -->
            <Icon
              icon="weui:arrow-filled"
              width="12"
              height="24"
              style="color: #000"
              class="hidden md:block absolute md:inset-x-47 md:inset-y-7 lg:inset-x-62 xl:inset-x-[265px]"
            />
            <!-- Garis vertikal (mobile) -->
            <div
              class="md:hidden absolute inset-x-10 inset-y-32 w-0.5 h-16 bg-gray-700"
            ></div>
            <!-- Panah vertikal (mobile) -->
            <Icon
              icon="weui:arrow-filled"
              width="24"
              height="24"
              style="color: #000"
              class="md:hidden absolute inset-x-7 inset-y-44 rotate-90"
            />
          </div>
        </div>
        <p class="font-semibold">Create account</p>
      </div>

      <!-- Item 2 -->
      <div class="flex flex-col md:ml-32 lg:ml-44 xl:ml-48">
        <div class="flex">
          <div
            class="bg-white w-20 h-20 m-auto place-content-center rounded-full mb-4 relative"
          >
            <Icon
              icon="mynaui:cloud-upload"
              width="48"
              height="48"
              style="color: #1b00fb"
              class="absolute inset-y-4 inset-x-4.5"
            />
            <!-- Garis horizontal (desktop) -->
            <div
              class="hidden md:block absolute md:inset-x-20 md:inset-y-10 xl:w-44 xl:inset-x-24 w-29 lg:w-44 h-0.5 bg-gray-700"
            ></div>
            <!-- Panah horizontal (desktop) -->
            <Icon
              icon="weui:arrow-filled"
              width="12"
              height="24"
              style="color: #000"
              class="hidden md:block absolute md:inset-x-47 md:inset-y-7 lg:inset-x-62 xl:inset-x-[262px]"
            />
            <!-- Garis vertikal (mobile) -->
            <div
              class="md:hidden absolute inset-x-10 inset-y-32 w-0.5 h-16 bg-gray-700"
            ></div>
            <!-- Panah vertikal (mobile) -->
            <Icon
              icon="weui:arrow-filled"
              width="24"
              height="24"
              style="color: #000"
              class="md:hidden absolute inset-x-7 inset-y-44 rotate-90"
            />
          </div>
        </div>
        <p class="font-semibold">Upload CV</p>
      </div>

      <!-- Item 3 -->
      <div class="flex flex-col md:ml-32 lg:ml-44 xl:ml-48">
        <div class="flex">
          <div
            class="bg-white w-20 h-20 m-auto place-content-center rounded-full mb-4 relative"
          >
            <Icon
              icon="iconamoon:search"
              width="48"
              height="48"
              style="color: #1b00fb"
              class="absolute inset-y-4 inset-x-4.5"
            />
            <!-- Garis horizontal (desktop) -->
            <div
              class="hidden md:block absolute md:inset-x-20 md:inset-y-10  xl:inset-x-24 w-29 lg:w-42 h-0.5 bg-gray-700"
            ></div>
            <!-- Panah horizontal (desktop) -->
            <Icon
              icon="weui:arrow-filled"
              width="12"
              height="24"
              style="color: #000"
              class="hidden md:block absolute md:inset-x-47 md:inset-y-7 lg:inset-x-60 xl:inset-x-[253px]"
            />
            <!-- Garis vertikal (mobile) -->
            <div
              class="md:hidden absolute inset-x-10 inset-y-32 w-0.5 h-16 bg-gray-700"
            ></div>
            <!-- Panah vertikal (mobile) -->
            <Icon
              icon="weui:arrow-filled"
              width="24"
              height="24"
              style="color: #000"
              class="md:hidden absolute inset-x-7 inset-y-44 rotate-90"
            />
          </div>
        </div>
        <p class="font-semibold">Find suitable job</p>
      </div>

      <!-- Item 4 (tanpa garis/panah) -->
      <div class="flex flex-col md:ml-32 lg:ml-44 xl:ml-48">
        <div class="flex">
          <div
            class="bg-white w-20 h-20 m-auto place-content-center rounded-full mb-4 relative"
          >
            <Icon
              icon="prime:check-circle"
              width="48"
              height="48"
              style="color: #1b00fb"
              class="absolute inset-y-4 inset-x-4.5"
            />
          </div>
        </div>
        <p class="font-semibold">Apply job</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>