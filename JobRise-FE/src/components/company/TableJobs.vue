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
            v-for="job in paginatedJobs"
            :key="job.id"
          >
            <td class="py-4 pl-4 text-left">
              <div class="flex items-center">
                <img
                  :src="job.logo"
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
                :to="{name: 'job-detail', params: {id: job.id}}"
                class="font-base px-3 py-2 rounded-lg text-white bg-[#0c1f61d3] hover:bg-[#091a52]"
              >
                View Applications
              </router-link>
            </td>
          </tr>
          <tr v-if="paginatedJobs.length === 0 && filteredJobs.length > 0">
            <td colspan="4" class="py-4 text-gray-500">No jobs found matching your search.</td>
          </tr>
          <tr v-else-if="allJobs.length === 0">
            <td colspan="4" class="py-4 text-gray-500">Loading jobs...</td>
          </tr>
          <tr v-else-if="paginatedJobs.length === 0 && filteredJobs.length === 0 && searchQuery.value === ''">
            <td colspan="4" class="py-4 text-gray-500">No jobs available.</td>
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
  <div class="flex justify-center mt-4" v-if="pageCount > 1">
    <button
      :disabled="currentPage === 1"
      @click="currentPage--"
      class="px-3 py-1 rounded-l-md disabled:opacity-50"
    >
      <Icon icon="ri:arrow-left-line" width="24" height="24" style="color: #1526ea" />
    </button>

    <template v-if="pageCount <= 5">
      <button
        v-for="page in pageCount"
        :key="page"
        @click="currentPage = page"
        :class="['px-3 py-1', {'font-semibold': currentPage === page}]"
      >
        {{ page }}
      </button>
    </template>
    <template v-else>
      <button
        @click="currentPage = 1"
        :class="['px-3 py-1', {'font-semibold': currentPage === 1}]"
      >
        1
      </button>
      <template v-if="currentPage > 3">
        <span>...</span>
      </template>
      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page > 1 && page < pageCount"
          @click="currentPage = page"
          :class="['px-3 py-1', {'font-semibold': currentPage === page}]"
        >
          {{ page }}
        </button>
      </template>
      <template v-if="currentPage < pageCount - 2">
        <span>...</span>
      </template>
      <button
        v-if="pageCount > 1"
        @click="currentPage = pageCount"
        :class="['px-3 py-1', {'font-semibold': currentPage === pageCount}]"
      >
        {{ pageCount }}
      </button>
    </template>

    <button
      :disabled="currentPage === pageCount"
      @click="currentPage++"
      class="px-3 py-1 rounded-r-md disabled:opacity-50"
    >
      <Icon icon="ri:arrow-right-line" width="24" height="24" style="color: #1526ea" />
    </button>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";

const jobs = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const allJobs = ref([]);
const totalJobs = ref(0);

const filteredJobs = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return allJobs.value.filter((job) => job.posisi.toLowerCase().includes(query));
});

const paginatedJobs = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredJobs.value.slice(startIndex, endIndex);
});

const pageCount = computed(() => {
  return Math.ceil(filteredJobs.value.length / itemsPerPage.value);
});

const visiblePages = computed(() => {
  const totalPages = pageCount.value;
  const currentPageNum = currentPage.value;
  const visibleRange = 2; // Number of pages to show on each side of the current page

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPageNum <= visibleRange + 1) {
    return [2, 3, 4];
  } else if (currentPageNum >= totalPages - visibleRange) {
    return [totalPages - 3, totalPages - 2, totalPages - 1];
  } else {
    return [currentPageNum - 1, currentPageNum, currentPageNum + 1];
  }
});

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3000/jobs");
    allJobs.value = response.data;
    totalJobs.value = allJobs.value.length;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
});
</script>