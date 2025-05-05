<template>
  <div class="px-24 pt-10 min-h-screen mb-16">
    <div class="flex justify-between">
      <h1 class="text-5xl font-bold">Feature Job</h1>

      <a href=""
        class="outline-2 outline-blue-700 mt-5 py-1 rounded-sm px-5 flex font-bold text-base text-blue-700"
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
    <div class="grid grid-cols-3 gap-x-10">
      <JobList />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import JobList from "./JobList.vue";
</script>
