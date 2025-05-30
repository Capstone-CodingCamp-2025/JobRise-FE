<template>
  <div class="px-2 md:px-5 py-1 md:py-4 rounded-lg bg-[#b8caecda] outline outline-blue-800">
    <router-link :to="{name: 'job-user-detail', params: {id: job.id}}">
      <h1 class="font-bold text-md md:text-2xl text-center md:text-left mb-2">{{ job.posisi }}</h1>
      <div class="flex gap-x-4 mb-4 px-2 md:px-0">
        <p class="text-blue-800 text-[10px] md:text-xs font-bold">
          {{ job.type.toUpperCase() }}
        </p>
        <p class="text-[10px] md:text-xs text-gray-700 font-medium">
          Salary : {{ job.salary }}
        </p>
      </div>
      <div class="flex gap-x-6">
        <div class="flex items-center justify-center pl-2">
          <img
            :src="job.logo"
            :alt="job.company"
            class="object-cover w-18 h-12 md:w-16 md:h-16"
          />
        </div>

        <p class="md:pt-4 lg:pt-5 pt-1 text-xs md:text-md text-blue-900 font-medium">
          {{ job.company }}
        </p>
      </div>
      <div class="flex justify-end">
        <Icon
          icon="material-symbols:bookmark-outline"
          width="24"
          height="24"
          style="color: #606060"
        />
      </div>
    </router-link>
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
// console.log(job);

</script>
