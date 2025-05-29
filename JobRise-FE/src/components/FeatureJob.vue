<template>
  <div class="py-16 min-h-screen px-3 md:px-10 lg:px-32">
    <div class="flex justify-between">
      <h1 class="text-xl md:text-3xl font-bold">Feature Job</h1>

      <router-link
        :to="{name: 'role-login'}"
        class="outline-1 outline-blue-800 py-1 mb-6 rounded-sm px-5 flex font-semibold text-base text-blue-900 hover:bg-blue-950 hover:text-white"
      >
        View all
        <Icon
          icon="formkit:arrowright"
          width="25"
          height="18"
          class="mt-1"
          style="color: #1b00fb"
        />
      </router-link>
    </div>
    <div class="grid md:grid-cols-2 gap-x-4 gap-y-8 lg:gap-x-10 xl:grid-cols-3">
      <JobList v-for="(job, index) in jobs" :key="index" :job="job" />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import JobList from "@/components/Jobs.vue";
import axios from "axios";
import { onMounted } from "vue";
import { ref } from "vue";

const jobs = ref([]);

onMounted(async () => {
  jobs.value = await axios
    .get("http://localhost:3000/jobs")
    .then((ress) => ress.data);
});
</script>
