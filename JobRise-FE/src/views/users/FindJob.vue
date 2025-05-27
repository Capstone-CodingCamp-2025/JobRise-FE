<template>
  <div class="px-6 py-10">
    <h1 class="font-bold text-3xl">Find Job</h1>
    <div class="flex w-full pt-6">
      <div class="relative w-full">
        <Icon
          icon="material-symbols:search-rounded"
          width="28"
          height="28"
          style="color: #000"
          class="absolute inset-y-2 inset-x-3"
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="Job tittle, keyword"
          class="bg-[#D5DEEF] w-full py-2 pl-12 rounded-l-lg font-medium outline-none"
        />
      </div>
      <div class="relative w-full ml-0.5">
        <Icon
          icon="charm:map-pin"
          width="28"
          height="28"
          style="color: #000"
          class="absolute inset-y-2 inset-x-3"
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="City, state or zip code"
          class="bg-[#D5DEEF] w-full py-2 rounded-r-lg pl-12 font-medium outline-none"
        />
      </div>

      <div class="flex gap-x-2 ml-2">
        <button
          class="relative flex rounded-lg bg-gray-300 w-max px-2 py-2 font-semibold"
        >
          <Icon
            icon="mdi:filter-outline"
            width="24"
            height="24"
            style="color: #000"
          />
          Filter
        </button>
        <button
          class="bg-blue-800 text-white font-bold w-max px-2 py-1 rounded-lg"
        >
          Find Job
        </button>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-x-5 gap-y-10 px-10 py-6">
      <JobList v-for="(job, index) in jobs" :key="index" :job="job" />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import JobList from "@/components/JobList.vue";
import { ref } from "vue";
import { onMounted } from "vue";
import axios from "axios";

const jobs = ref([]);

onMounted(async () => {
  jobs.value = await axios
    .get("http://localhost:3000/jobs")
    .then((ress) => ress.data);
});
</script>
