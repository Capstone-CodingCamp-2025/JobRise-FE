<template>
  <div class="flex justify-between">
    <h1 class="font-bold text-2xl">Job List</h1>

    <form action="" class="relative">
      <input
        type="text"
        placeholder="Search Jobs"
        class="bg-slate-200 text-center rounded-sm py-1 outline outline-blue-900"
        v-model="searchQuery"
      />
      <Icon
        icon="prime:search"
        width="24"
        height="24"
        style="color: #000"
        class="absolute inset-y-1 inset-x-2"
      />
    </form>
  </div>
  <div class="relative my-5">
    <div class="overflow-auto">
      <table class="table-auto text-center w-full">
        <thead class="bg-slate-200 text-center">
          <tr>
            <th
              class="min-w-[200px] py-2 md:py-3 rounded-l-lg font-normal text-left pl-4 md:pl-20"
            >
              Jobs
            </th>
            <th class="min-w-[150px] py-2 md:py-3 font-normal">Applications</th>
            <th class="min-w-[150px] py-2 md:py-3 font-normal">Status</th>
            <th class="min-w-[180px] py-2 md:py-3 rounded-r-lg font-normal">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b border-gray-300"
            v-for="job in filteredJobs"
            :key="job.id"
          >
            <td class="py-4 pl-4 text-left">
              <div class="flex items-center">
                <img
                  src=""
                  class="object-cover w-10 h-10 rounded mr-2 md:w-12 md:h-12 md:mr-4"
                />
                <div>
                  <p class="font-semibold text-sm md:text-base">
                    {{ job.posisi }}
                  </p>
                  <div
                    class="flex items-center text-gray-600 text-xs md:text-sm font-medium"
                  >
                    <Icon
                      icon="charm:map-pin"
                      width="14"
                      height="14"
                      class="mr-1"
                      style="color: #718096"
                    />
                    Location
                  </div>
                  <p class="text-gray-700 text-xs md:text-sm mt-1 font-medium">
                    Rp. {{ job.salary }}
                  </p>
                </div>
              </div>
            </td>
            <td
              class="py-6 md:py-9 flex justify-center text-xs md:text-base font-semibold"
            >
              <Icon
                icon="healthicons:people-outline"
                width="20"
                height="20"
                class="mr-1"
                style="color: #606060"
              />
              xxx aplication
            </td>
            <td class="py-4 text-xs md:text-sm">
              <div class="flex items-center justify-center font-semibold">
                <template v-if="job.status === 'active'">
                  <Icon
                    icon="tabler:check"
                    width="16"
                    height="16"
                    style="color: #09ff19"
                    class="mr-1"
                  />
                  {{ job.status }}
                </template>
                <template v-else-if="job.status === 'inactive'">
                  <Icon
                    icon="tabler:x"
                    width="16"
                    height="16"
                    style="color: #ff3d00"
                    class="mr-1"
                  />
                  {{ job.status }}
                </template>
                <template v-else>
                  {{ job.status }}
                </template>
              </div>
            </td>
            <td class="py-4 text-xs md:text-sm">
              <router-link
                to=""
                class="font-base px-3 py-2 rounded-lg text-white bg-[#0c1f61d3] hover:bg-[#091a52]"
              >
                View Applications
              </router-link>
            </td>
          </tr>
          <tr v-if="filteredJobs.length === 0">
            <td colspan="4" class="py-4 text-gray-500">No jobs found.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="bg-gradient-to-l from-transparent via-gray-300/10 to-gray-300/30 w-5 md:w-20 h-full absolute left-0 bottom-0"
    ></div>
    <div
      class="bg-gradient-to-r from-transparent via-gray-300/10 to-gray-300/30 w-5 md:w-20 h-full absolute right-0 bottom-0"
    ></div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";

const jobs = ref([]);
const searchQuery = ref("");

const filteredJobs = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return jobs.value.filter((job) => job.posisi.toLowerCase().includes(query));
});

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

console.log(jobs);
</script>
