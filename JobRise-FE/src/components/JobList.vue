<template>
  <div
    class="shadow8-xl shadow-sky-100/90 text-white px-5 py-4 rounded-lg bg-blue-500"
  >
    <div >
      <h1 class="font-bold text-xl">{{ job.posisi }}</h1>
      <div class="flex justify-between py-6 lg:py-8">
        <p class="bg-[#B1C9EF] text-blue-800 font-bold px-2">{{ job.type }}</p>
        <p class="font-bold text-lg">Salary: {{ job.salary }}</p>
      </div>
      <div class="flex gap-9">
        <div class="rounded-lg flex items-center justify-center">
          <img
            :src="job.logo"
            :alt="job.company"
            class="object-cover w-18 h-18 md:w-20 md:h-20 rounded-lg"
          />
        </div>
        
          <p class="pt-3 text-xl font-bold">{{ job.company }}</p>
        
      </div>
      <div class="place-content-end flex pt-6">
        <Icon
          icon="lucide:bookmark"
          width="32"
          height="32"
          style="color: #000"
          class=""
        />
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
