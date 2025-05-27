<template>
  <div class="px-5 py-4 rounded-lg bg-[#b8caecda] outline outline-blue-800 ">
    <div>
      <h1 class="font-bold text-2xl mb-2">{{ job.posisi }}</h1>
      <div class="flex gap-x-4 mb-4">
        <p class="text-blue-800 text-xs font-bold">
          {{ job.type.toUpperCase() }}
        </p>
        <p class="text-xs text-gray-700 font-medium">Salary : {{ job.salary }}</p>
      </div>
      <div class="flex gap-x-6">
        <div class=" flex items-center justify-center">
          <img
            :src="job.logo"
            :alt="job.company"
            class="object-cover w-14 h-14 md:w-16 md:h-16 "
          />
        </div>

        <p class="md:pt-4 lg:pt-5 pt-3 text-md text-blue-900 font-medium">{{ job.company }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { jobs } from "@/stores/data.json";
import { Icon } from "@iconify/vue";

// const listJobs = jobs.jobs.slice(0, 6);
// console.log(listJobs);

const { job } = defineProps({
  job: Object,
});
</script>
