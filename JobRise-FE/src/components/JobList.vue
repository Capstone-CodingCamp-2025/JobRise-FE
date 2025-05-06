<template>
  <div
    v-for="job in listJobs"
    :key="job.id"
    class="flex flex-col gap-4 mt-12 shadow-xl shadow-sky-100/90 text-white px-5 py-4 rounded-lg bg-linear-to-b from-blue-900/80 via-[#8AAEE0] to-[#D5DEEF] to-80%"
  >
    <h1 class="font-bold text-xl">{{ job.posisi }}</h1>
    <div class="flex gap-10">
      <p class="bg-[#B1C9EF] text-blue-800 font-bold px-2">{{ job.type }}</p>
      <p class="font-bold text-lg">Salary: {{ job.salary }}</p>
    </div>
    <div class="flex gap-9">
      <router-link
        to=""
        class="w-20 h-20 rounded-lg flex items-center justify-center p-1"
      >
        <img
          :src="job.logo"
          :alt="job.company"
          class="object-contain w-20 h-20"
        />
      </router-link>
      <router-link to="">
        <p class="pt-3 text-xl font-bold">{{ job.company }}</p>
      </router-link>
    </div>
    <router-link to="">
      <Icon
        icon="lucide:bookmark"
        width="32"
        height="32"
        style="color: #000"
        class="ml-72"
      />
    </router-link>
  </div>
</template>

<script setup>
import { jobs } from "@/stores/data";
import { Icon } from "@iconify/vue";

const listJobs = jobs.jobs.slice(0, 6);
console.log(listJobs);


</script>
