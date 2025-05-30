<template>
  <div class="px-6 py-2 md:py-8">
    <h1 class="font-bold text-3xl">Find Job</h1>
    <div class="flex flex-col md:flex-row w-full pt-6 gap-y-2 md:gap-y-0">
      <div class="relative w-full">
        <Icon
          icon="material-symbols:search-rounded"
          width="24"
          height="24"
          style="color: #000"
          class="absolute inset-y-3 inset-x-3"
        />
        <input
          type="text"
          v-model="search.title"
          placeholder="Job tittle, keyword"
          class="bg-[#D5DEEF] w-full py-3 pl-12 rounded-lg md:rounded-l-lg md:rounded-r-none font-medium outline-none"
        />
      </div>
      <div class="relative w-full md:ml-0.5">
        <Icon
          icon="charm:map-pin"
          width="24"
          height="24"
          style="color: #000"
          class="absolute inset-y-3 inset-x-3"
        />
        <input
          type="text"
          v-model="search.location"
          placeholder="City, state or zip code"
          class="bg-[#D5DEEF] w-full py-3 rounded-lg md:rounded-r-lg md:rounded-l-none pl-12 font-medium outline-none"
        />
      </div>

      <div class="flex justify-between gap-x-2 mt-2 md:mt-0 md:ml-2">
        <button
          @click="openFilterPopup"
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
          @click="applySearch"
          class="bg-blue-950/90 text-white font-bold w-max px-2 py-1 rounded-lg"
        >
          Find Job
        </button>
      </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 md:px-10 py-6">
      <JobList
        v-for="(job, index) in paginatedJobs"
        :key="index"
        :job="job"
      />
    </div>

    <div class="flex justify-center mt-4" v-if="totalPages > 1">
      <button
        :disabled="currentPage === 1"
        @click="prevPage"
        class="px-3 py-1 rounded-l-md disabled:opacity-50"
      >
        <Icon icon="ri:arrow-left-line" width="24" height="24" style="color: #1526ea" />
      </button>

      <template v-if="totalPages <= 5">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="['px-3 py-1', {'font-semibold': currentPage === page}]"
        >
          {{ page }}
        </button>
      </template>
      <template v-else>
        <button
          @click="goToPage(1)"
          :class="['px-3 py-1', {'font-semibold': currentPage === 1}]"
        >
          1
        </button>
        <template v-if="currentPage > 3">
          <span>...</span>
        </template>
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page > 1 && page < totalPages"
            @click="goToPage(page)"
            :class="['px-3 py-1', {'font-semibold': currentPage === page}]"
          >
            {{ page }}
          </button>
        </template>
        <template v-if="currentPage < totalPages - 2">
          <span>...</span>
        </template>
        <button
          v-if="totalPages > 1"
          @click="goToPage(totalPages)"
          :class="['px-3 py-1', {'font-semibold': currentPage === totalPages}]"
        >
          {{ totalPages }}
        </button>
      </template>

      <button
        :disabled="currentPage === totalPages"
        @click="nextPage"
        class="px-3 py-1 rounded-r-md disabled:opacity-50"
      >
        <Icon icon="ri:arrow-right-line" width="24" height="24" style="color: #1526ea" />
      </button>
    </div>
  </div>

  <div
    v-if="isFilterPopupOpen"
    class="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-md shadow-md w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Filter Jobs</h2>
      <form @submit.prevent="applyFilters">
        <div class="mb-4">
          <label for="position" class="block text-gray-700 text-sm font-bold mb-2"
            >Position</label
          >
          <select
            v-model="filters.position"
            id="position"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select your position</option>
            <option
              v-for="position in availablePositions"
              :key="position"
              :value="position"
            >
              {{ position }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="jobType" class="block text-gray-700 text-sm font-bold mb-2"
            >Job Type</label
          >
          <select
            v-model="filters.type"
            id="jobType"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select job type</option>
            <option
              v-for="type in availableJobTypes"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="salary" class="block text-gray-700 text-sm font-bold mb-2"
            >Salary</label
          >
          <select
            v-model="filters.salary"
            id="salary"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select range salary</option>
            <option
              v-for="salaryRange in availableSalaryRanges"
              :key="salaryRange"
              :value="salaryRange"
            >
              {{ salaryRange }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-x-2">
          <button
            type="button"
            @click="closeFilterPopup"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-950/80 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Filter Job
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import JobList from "@/components/JobList.vue";
import { ref, computed, watch } from "vue";
import { onMounted } from "vue";
import axios from "axios";

const jobs = ref([]);
const isFilterPopupOpen = ref(false);
const filters = ref({
  position: "",
  type: "",
  salary: "",
});
const search = ref({
  title: "",
  location: "",
});

const currentPage = ref(1);
const jobsPerPage = 12;
const visiblePageRange = 3; // Number of visible pages around the current page

// Dummy data for filter options
const availablePositions = ref(["Frontend Developer", "Backend Developer", "UI/UX Designer", "Project Manager"]);
const availableJobTypes = ref(["Full-time", "Part-time", "Contract", "Internship"]);
const availableSalaryRanges = ref(["$40k - $60k", "$60k - $80k", "$80k+", "Any"]);

const openFilterPopup = () => {
  isFilterPopupOpen.value = true;
};

const closeFilterPopup = () => {
  isFilterPopupOpen.value = false;
};

const applyFilters = () => {
  console.log("Applying filters:", filters.value);
  currentPage.value = 1;
  isFilterPopupOpen.value = false;
};

const applySearch = () => {
  console.log("Applying search:", search.value);
  currentPage.value = 1;
};

const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
    const titleMatch = !search.value.title || job.company.toLowerCase().includes(search.value.title.toLowerCase());
    const locationMatch = !search.value.location || job.location.toLowerCase().includes(search.value.location.toLowerCase());
    const positionMatch = !filters.value.position || job.posisi.toLowerCase().includes(filters.value.position.toLowerCase());
    const typeMatch = !filters.value.type || job.type === filters.value.type;
    const salaryMatch = true; // Placeholder for salary filtering

    return titleMatch && locationMatch && positionMatch && typeMatch && salaryMatch;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredJobs.value.length / jobsPerPage);
});

const paginatedJobs = computed(() => {
  const startIndex = (currentPage.value - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  return filteredJobs.value.slice(startIndex, endIndex);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

const visiblePages = computed(() => {
  const pages = [];
  if (totalPages.value <= 5) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(2, currentPage.value - visiblePageRange);
    let end = Math.min(totalPages.value - 1, currentPage.value + visiblePageRange);

    if (currentPage <= visiblePageRange + 1) {
      end = Math.min(totalPages.value - 1, visiblePageRange * 2);
    }

    if (currentPage >= totalPages.value - visiblePageRange) {
      start = Math.max(2, totalPages.value - 1 - visiblePageRange * 2 + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  return pages;
});

// Fetch jobs on component mount
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3000/jobs");
    jobs.value = response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
});

// Reset current page when the filtered jobs change
watch(filteredJobs, () => {
  currentPage.value = 1;
});

console.log(jobs);
</script>

<style scoped>
/* Add any specific styles for the popup if needed */
.font-semibold {
  font-weight: 600;
}
</style>

