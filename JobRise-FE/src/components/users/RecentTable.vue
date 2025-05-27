<template>
  <div class="relative my-5">
    <div class="overflow-auto">
      <table class="table-auto text-center w-full">
        <thead class="bg-slate-200 text-center ">
          <tr>
            <th class="min-w-max py-2 md:py-3 rounded-l-lg font-normal text-left pl-20">
              Jobs
            </th>
            <th class="min-w-max py-2 md:py-3 font-normal">Date Applied</th>
            <th class="min-w-max py-2 md:py-3 font-normal">Status Apply</th>
            <th class="min-w-max py-2 md:py-3 rounded-r-lg font-normal">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in jobs.slice(0, 4)"
            :key="job.id"
            class="border-b border-gray-300"
          >
          <td class="py-4 pl-4 text-left">
              <div class="flex items-center">
                <img
                  :src="job.logo"
                  :alt="job.company"
                  class="object-cover w-12 h-12 rounded mr-4"
                />
                <div>
                  <p class="font-semibold">{{ job.posisi }}</p>
                  <div class="flex items-center text-gray-600 text-sm">
                    <Icon
                      icon="charm:map-pin"
                      width="16"
                      height="16"
                      class="mr-1"
                      style="color: #718096;"
                    />
                    Location
                  </div>
                  <p class="text-gray-700 text-sm mt-1">Rp. {{ job.salary }}</p>
                </div>
              </div>
            </td>
            <td class="py-4">March 20, 2025, 10:10</td>
            <td class="py-4">
              <div class="flex items-center justify-center">
                <Icon
                  icon="tabler:check"
                  width="20"
                  height="20"
                  style="color: #09ff19"
                  class="mr-1"
                />

                Approved
              </div>
            </td>
            <td class="py-4">
              <router-link
                to=""
                class="font-base px-4 py-2 rounded-lg text-white bg-[#0c1f61d3] hover:bg-[#091a52]"
              >
                View Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="bg-gradient-to-l from-transparent via-gray-300/10 to-gray-300/30 w-20 h-full absolute left-0 bottom-0"
    ></div>
    <div
      class="bg-gradient-to-r from-transparent via-gray-300/10 to-gray-300/30 w-20 h-full absolute right-0 bottom-0"
    ></div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { onMounted } from "vue";
import { Icon } from "@iconify/vue";

const jobs = ref([]);



onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3000/jobs");
    jobs.value = response.data;
    // Assuming your job objects have a 'status' and 'applied_date' property
    // Adjust accordingly if your data structure is different
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
});
</script>
