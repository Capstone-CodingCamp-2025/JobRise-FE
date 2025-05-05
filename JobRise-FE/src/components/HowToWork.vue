<template>
  <div class="bg-blue-200/50 text-center py-40">
    <h1 class="text-5xl font-bold">How JobRise Work</h1>
    <div class="px-72 pt-16 flex justify-between ">
      <div>
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
            class="hidden  absolute left-[384px] top-[970px] sm:flex w-34 bg-gray-200 h-0.5 dark:bg-gray-700"
          >
        </div>
        <Icon icon="weui:arrow-filled" width="12" height="24"  style="color: #000" class="absolute top-[959px] left-[512px]" />
        </div>
        <p class="font-semibold">Create account</p>
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
            class="hidden  absolute left-[604px] top-[970px] sm:flex w-[140px] bg-gray-200 h-0.5 dark:bg-gray-700"
          >
        </div>
        <Icon icon="weui:arrow-filled" width="12" height="24"  style="color: #000" class="absolute top-[959px] left-[736px]" />
        
        <p class="font-semibold">Upload CV</p>
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
            class="hidden  absolute left-[829px] top-[970px] sm:flex w-36 bg-gray-200 h-0.5 dark:bg-gray-700"
          >
        </div>
        <Icon icon="weui:arrow-filled" width="12" height="24"  style="color: #000" class="absolute top-[959px] left-[963px]" />
        
        <p class="font-semibold">Find suitable job</p>
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

