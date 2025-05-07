<template>
  <div class=" py-16 min-h-screen px-3 md:px-10">
    <div class="flex justify-between">
      <h1 class="text-xl font-bold">Feature Job</h1>

      <a href=""
        class="outline-2 outline-blue-700  py-1 rounded-sm px-5 flex font-bold text-base text-blue-700"
      >
        View all
        <Icon
          icon="formkit:arrowright"
          width="25"
          height="18"
          class="mt-1"
          style="color: #1b00fb"
        />
      </a>
    </div>
    <div class="grid md:grid-cols-2 gap-x-4 lg:gap-x-10 xl:grid-cols-3 ">
      <JobList />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import JobList from "./JobList.vue";
</script>
