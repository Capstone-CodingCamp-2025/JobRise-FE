<template>
  <div class="bg-blue-200/50 text-center py-20">
    <h1 class="md:text-5xl text-4xl font-bold">How JobRise Work</h1>
    <div
      class="pt-14 md:px-9 flex flex-col gap-y-20 xl:px-32 md:flex-row justify-between relative"
    >
      <div class="flex flex-col">
        <div class="flex">
          <div
            class="bg-white w-20 h-20 m-auto place-content-center pl-5 rounded-full mb-4"
          >
            <Icon
              icon="lucide:user-plus"
              width="48"
              height="48"
              style="color: #1b00fb"
            />
          </div>

          <div
            class="hidden md:block absolute inset-x-32.5 inset-y-23.5 xl:w-62 xl:inset-x-55 w-29 lg:w-50 h-0.5 bg-gray-700"
          ></div>
          <Icon
            icon="weui:arrow-filled"
            width="12"
            height="24"
            style="color: #000"
            class="hidden md:block absolute inset-x-59 inset-y-21 lg:inset-x-80 xl:inset-x-[460px]"
          />
        </div>
        <p class="font-semibold">Create account</p>
      </div>
      <div class="h-20 w-0.5 bg-gray-700 m-auto relative md:hidden">
        <Icon
          icon="iconamoon:arrow-down-2-light"
          width="32"
          height="32"
          style="color: #000"
          class="md:hidden absolute -inset-x-4 inset-y-15"
        />
      </div>
      <div>
        <div
          class="bg-white w-20 h-20 m-auto place-content-center pl-4 rounded-full mb-4"
        >
          <Icon
            icon="mynaui:cloud-upload"
            width="48"
            height="48"
            style="color: #1b00fb"
          />
        </div>
        <div
          class="hidden md:block absolute inset-x-81.5 inset-y-23.5 w-30.5 xl:inset-x-[550px] xl:w-62.5 lg:w-52 lg:inset-x-[411px] bg-gray-200 h-0.5 dark:bg-gray-700"
        ></div>
        <Icon
          icon="weui:arrow-filled"
          width="12"
          height="24"
          style="color: #000"
          class="hidden md:block absolute inset-x-[440px] xl:inset-x-[790px] inset-y-21 lg:inset-x-[610px]"
        />

        <p class="font-semibold">Upload CV</p>
      </div>
      <div class="h-20 w-0.5 bg-gray-700 m-auto relative md:hidden">
        <Icon
          icon="iconamoon:arrow-down-2-light"
          width="32"
          height="32"
          style="color: #000"
          class="md:hidden absolute -inset-x-4 inset-y-15"
        />
      </div>
      <div>
        <div
          class="bg-white w-20 h-20 m-auto place-content-center pl-5 rounded-full mb-4"
        >
          <Icon
            icon="ri:search-line"
            width="2.5em"
            height="2.5em"
            style="color: #1b00fb"
          />
        </div>
        <div
          class="hidden md:block absolute inset-x-[529px] xl:inset-x-[880px] xl:w-63 inset-y-23.5 w-30.5 lg:w-52 lg:inset-x-[700px] bg-gray-200 h-0.5 dark:bg-gray-700"
        ></div>
        <Icon
          icon="weui:arrow-filled"
          width="12"
          height="24"
          style="color: #000"
          class="hidden md:block absolute inset-x-[641px] inset-y-21 lg:inset-x-[898px] xl:inset-x-[1122px]"
        />

        <p class="font-semibold">Find suitable job</p>
      </div>
      <div class="h-20 w-0.5 bg-gray-700 m-auto relative md:hidden">
        <Icon
          icon="iconamoon:arrow-down-2-light"
          width="32"
          height="32"
          style="color: #000"
          class="md:hidden absolute -inset-x-4 inset-y-15"
        />
      </div>
      <div>
        <div
          class="bg-white w-20 h-20 m-auto place-content-center pl-5 rounded-full mb-4"
        >
          <Icon
            icon="lucide:circle-check-big"
            width="2.5em"
            height="2.5em"
            style="color: #1b00fb"
          />
        </div>
        <p class="font-semibold">Apply job</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
