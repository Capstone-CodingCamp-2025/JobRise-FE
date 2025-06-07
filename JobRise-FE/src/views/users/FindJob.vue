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
          @keyup.enter="triggerClientSearch"
          placeholder="Job title, keyword"
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
          @keyup.enter="triggerClientSearch"
          placeholder="City, state or zip code"
          class="bg-[#D5DEEF] w-full py-3 rounded-lg md:rounded-r-lg md:rounded-l-none pl-12 font-medium outline-none"
        />
      </div>

      <div class="flex justify-between gap-x-2 mt-2 md:mt-0 md:ml-2">
        <button
          @click="openFilterPopup"
          class="relative flex items-center rounded-lg bg-gray-300 w-max px-2 py-3 font-semibold"
        >
          <Icon
            icon="mdi:filter-outline"
            width="24"
            height="24"
            style="color: #000"
            class="mr-1"
          />
          Filter
        </button>
        <button
          @click="triggerClientSearch"
          class="bg-blue-950/90 text-white font-bold w-max px-4 py-1 rounded-lg"
        >
          Find Job
        </button>
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:px-12 lg:px-10 gap-x-5 gap-y-10 py-6"
    >
      <!-- Loading state for initial data -->
      <div v-if="isLoadingInitialData" class="col-span-full text-center py-10">
        <button
          type="button"
          class="bg-transparent border-none rounded-lg"
          disabled
        >
          <Icon
            icon="eos-icons:loading"
            width="44"
            height="44"
            style="color: #5152ce"
          />
        </button>
      </div>
      <!-- Error state for job fetching -->
      <div
        v-else-if="isErrorJobs"
        class="col-span-full text-center py-10 text-red-600"
      >
        Terjadi kesalahan saat memuat rekomendasi pekerjaan:
        {{ isErrorJobs.message || "Unknown error" }}
      </div>
      <!-- Job list display -->
      <template
        v-else-if="
          paginatedAndFilteredJobs && paginatedAndFilteredJobs.length > 0
        "
      >
        <div
          v-for="job in paginatedAndFilteredJobs"
          :key="job.id"
          class="p-4 rounded-lg bg-[#F1F4FA] outline-1 outline-blue-800 shadow-md hover:shadow-lg transition-shadow duration-300 relative"
        >
          <router-link
            :to="{ name: 'job-user-detail', params: { id: job.id } }"
            class="block h-full"
            :class="{ 'pointer-events-none': processingFavoriteJobId === job.id }" >
          
            <h1
              class="font-bold text-lg md:text-xl text-center md:text-left mb-2 leading-tight truncate"
            >
              {{ job.title }}
            </h1>
            <div class="flex flex-wrap gap-x-4 mb-4">
              <p
                v-if="job.job_type"
                class="text-blue-800 text-[10px] md:text-xs font-bold whitespace-nowrap   py-0.5 rounded"
              >
                {{ job.job_type.toUpperCase() }}
              </p>
              <p
                class="text-[10px] md:text-xs text-gray-700 font-bold whitespace-nowrap"
              >
                Salary: {{ formatGajiRingkas(job.salary_min) }} - {{ formatGajiRingkas(job.salary_max) }}
              </p>
            </div>
            <div class="flex items-center gap-x-4">
              <div
                class="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white rounded flex justify-center items-center overflow-hidden"
              >
                <img
                  v-if="job.company_logo"
                  :src="
                    job.company_logo.startsWith('http')
                      ? job.company_logo
                      : `${baseImageUrl}${job.company_logo}`
                  "
                  :alt="job.company_name"
                  class="object-cover w-full h-full"
                  @error="($event) => ($event.target.style.display = 'none')"
                />
                <span v-else class="text-xs text-gray-500">No Logo</span>
              </div>
              <p
                class="text-sm md:text-base text-blue-900 font-medium truncate"
              >
                {{ job.company_name }}
              </p>
            </div>
            <div class="flex justify-end mt-3">
              <button
                @click.prevent="toggleFavorite(job)"
                :disabled="
                  jobStore.isCreatingFavorite || jobStore.isDeletingFavorite || processingFavoriteJobId !== null
                "
                class="p-1 rounded-full hover:bg-gray-200/50 active:bg-gray-300/50 transition-colors focus:outline-none"
                :title="
                  isJobFavorited(job.id)
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'
                "
              >
                <Icon
                  :icon="
                    isJobFavorited(job.id)
                      ? 'material-symbols:bookmark-rounded'
                      : 'material-symbols:bookmark-outline'
                  "
                  width="24"
                  height="24"
                  :style="{
                    color: isJobFavorited(job.id) ? '#0C1F61' : '#606060',
                  }"
                />
              </button>
            </div>
          </router-link>
          <div
            v-if="processingFavoriteJobId === job.id"
            class="absolute inset-0 bg-slate-300/60 flex justify-center items-center rounded-lg z-20"
            aria-hidden="true"
          >
            <Icon
              icon="eos-icons:loading"
              width="36"
              height="36"
              style="color: #0C1F61" />
          </div>
        </div>
      </template>
      <!-- No data message -->
      <div v-else class="col-span-full text-center py-10 text-gray-600">
        Tidak ada data pekerjaan
      </div>
    </div>

    <!-- Pagination -->
    <div
      class="flex justify-center items-center mt-4 space-x-1"
      v-if="
        totalPagesFromFilteredResults > 1 &&
        paginatedAndFilteredJobs &&
        paginatedAndFilteredJobs.length > 0
      "
    >
      <button
        :disabled="currentPage === 1"
        @click="prevPage"
        class="px-3 py-1 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <Icon
          icon="ri:arrow-left-s-line"
          width="24"
          height="24"
          style="color: #1526ea"
        />
      </button>

      <template v-if="totalPagesFromFilteredResults <= 7">
        <button
          v-for="page in totalPagesFromFilteredResults"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 border border-gray-300 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300',
            {
              'font-semibold bg-blue-600 text-white border-blue-600':
                currentPage === page,
              'bg-white text-gray-700': currentPage !== page,
            },
          ]"
        >
          {{ page }}
        </button>
      </template>
      <template v-else>
        <button
          @click="goToPage(1)"
          :class="[
            'px-3 py-1 border border-gray-300 hover:bg-blue-100',
            {
              'font-semibold bg-blue-600 text-white border-blue-600':
                currentPage === 1,
              'bg-white text-gray-700': currentPage !== 1,
            },
          ]"
        >
          1
        </button>

        <span v-if="currentPage > 4" class="px-3 py-1 text-gray-500">...</span>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 border border-gray-300 hover:bg-blue-100',
            {
              'font-semibold bg-blue-600 text-white border-blue-600':
                currentPage === page,
              'bg-white text-gray-700': currentPage !== page,
            },
          ]"
        >
          {{ page }}
        </button>

        <span
          v-if="currentPage < totalPagesFromFilteredResults - 3"
          class="px-3 py-1 text-gray-500"
          >...</span
        >

        <button
          v-if="totalPagesFromFilteredResults > 1"
          @click="goToPage(totalPagesFromFilteredResults)"
          :class="[
            'px-3 py-1 border border-gray-300 hover:bg-blue-100',
            {
              'font-semibold bg-blue-600 text-white border-blue-600':
                currentPage === totalPagesFromFilteredResults,
              'bg-white text-gray-700':
                currentPage !== totalPagesFromFilteredResults,
            },
          ]"
        >
          {{ totalPagesFromFilteredResults }}
        </button>
      </template>

      <button
        :disabled="currentPage === totalPagesFromFilteredResults"
        @click="nextPage"
        class="px-3 py-1 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <Icon
          icon="ri:arrow-right-s-line"
          width="24"
          height="24"
          style="color: #1526ea"
        />
      </button>
    </div>
  </div>

  <!-- Filter Popup -->
  <div
    v-if="isFilterPopupOpen"
    class="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-50 p-4"
    @click.self="closeFilterPopup"
  >
    <div class="bg-white p-6 rounded-md shadow-md w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Filter Jobs</h2>
      <form @submit.prevent="applyClientSideFilters">
        <div class="mb-4">
          <label
            for="position"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Position</label
          >
          <select
            v-model="filters.position"
            id="position"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">All Positions</option>
            <option
              v-for="position in dynamicAvailablePositions"
              :key="position"
              :value="position"
            >
              {{ position }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label
            for="jobType"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Job Type</label
          >
          <select
            v-model="filters.type"
            id="jobType"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">All Job Types</option>
            <option v-for="type in availableJobTypes" :key="type" :value="type">
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
            <option value="">Any Salary Range</option>
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
import { ref, computed, watch, onMounted, nextTick } from "vue"; 
import { AuthUserStorage } from "@/stores/auth/userAuth"; 
import { useActiveJobRecommendationsStore } from "@/stores/jobs/userjob"; 
import Swal from "sweetalert2"; 

const authStore = AuthUserStorage();
const jobStore = useActiveJobRecommendationsStore(); 
const baseImageUrl = ref("https://jobrise.hotelmarisrangkas.com/public/");

const allJobsFromStore = computed(() => jobStore.activeJobRecommendations);
const isErrorJobs = computed(() => jobStore.errorJobs); 
const isLoadingInitialData = ref(true); 
const processingFavoriteJobId = ref(null);
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
const visiblePageRange = 3;

const availableJobTypes = ref([
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
]);
const availableSalaryRanges = ref([
  "Di bawah Rp 3.000.000",
  "Rp 3.000.000 - Rp 5.000.000",
  "Rp 5.000.000 - Rp 7.000.000",
  "Rp 7.000.000 - Rp 10.000.000",
  "Rp 10.000.000 - Rp 15.000.000",
  "Di atas Rp 15.000.000",
]);

const dynamicAvailablePositions = computed(() => {
  if (!allJobsFromStore.value || allJobsFromStore.value.length === 0) return [];
  const positionFieldName = "title"; 
  const positions = allJobsFromStore.value
    .map((job) => job[positionFieldName])
    .filter(
      (position) =>
        position && typeof position === "string" && position.trim() !== ""
    );
  return [...new Set(positions)].sort();
});

// MODIFIED: initializePageAndFavoriteData to ensure nextTick is always called before hiding loader
const initializePageAndFavoriteData = async () => {
  isLoadingInitialData.value = true; // Pastikan spinner ditampilkan di awal

  if (authStore.tokenUser) {
    try {
      await Promise.all([
        jobStore.fetchActiveJobRecommendations(authStore.tokenUser),
        jobStore.fetchUserFavoriteJobs(authStore.tokenUser, {
          page: 1,
          limit: 1000, 
        }),
      ]);
      currentPage.value = 1; 
    } catch (error) {
      console.error("Error initializing page data:", error);
      // State error (isErrorJobs) akan diupdate oleh store dan direfleksikan di template
    }
  } else {
    console.warn("Token pengguna tidak tersedia. Data tidak dimuat.");
    // Opsional: atur error di store jika pengguna harus login
    // jobStore.errorJobs = { message: "Silakan login untuk melihat pekerjaan." };
  }

  // Selalu tunggu next tick untuk memungkinkan pembaruan reaktif (data atau state error) 
  // untuk disebarkan sebelum menyembunyikan loader.
  // Ini memastikan computed properties seperti 'isErrorJobs' atau 'paginatedAndFilteredJobs'
  // memiliki nilai terbaru yang direfleksikan.
  await nextTick();
  isLoadingInitialData.value = false; // Sembunyikan spinner setelah pembaruan reaktif
};


const parseSalaryFilter = (salaryFilterString) => {
  if (
    !salaryFilterString ||
    salaryFilterString === "Any Salary Range" ||
    salaryFilterString === ""
  ) {
    return { min: null, max: null };
  }
  const cleanedString = salaryFilterString.replace(/Rp|\.| /g, "");
  if (cleanedString.startsWith("Dibawah")) {
    const value = parseInt(cleanedString.replace("Dibawah", ""), 10);
    return { min: 0, max: value - 1 };
  } else if (cleanedString.startsWith("Diatas")) {
    const value = parseInt(cleanedString.replace("Diatas", ""), 10);
    return { min: value + 1, max: Infinity };
  } else if (cleanedString.includes("-")) {
    const parts = cleanedString.split("-");
    if (parts.length === 2)
      return { min: parseInt(parts[0], 10), max: parseInt(parts[1], 10) };
  }
  return { min: null, max: null };
};

const fullyFilteredJobs = computed(() => {
  if (!allJobsFromStore.value || !Array.isArray(allJobsFromStore.value))
    return [];
  let jobsToFilter = [...allJobsFromStore.value];

  const titleQuery = search.value.title.toLowerCase().trim();
  if (titleQuery) {
    jobsToFilter = jobsToFilter.filter(
      (job) => job.title && job.title.toLowerCase().includes(titleQuery)
    );
  }
  const locationQuery = search.value.location.toLowerCase().trim();
  if (locationQuery) {
    jobsToFilter = jobsToFilter.filter((job) => {
      const jobLocation = job.location ? job.location.toLowerCase() : "";
      return jobLocation.includes(locationQuery);
    });
  }
  const positionFilter = filters.value.position;
  if (positionFilter) {
    const positionFieldName = "title"; 
    jobsToFilter = jobsToFilter.filter(
      (job) =>
        job[positionFieldName] && job[positionFieldName] === positionFilter
    );
  }
  const jobTypeFilter = filters.value.type;
  if (jobTypeFilter) {
    jobsToFilter = jobsToFilter.filter(
      (job) =>
        job.job_type &&
        job.job_type.toLowerCase() === jobTypeFilter.toLowerCase()
    );
  }
  const salaryRangeFilter = parseSalaryFilter(filters.value.salary);
  if (salaryRangeFilter.min !== null || salaryRangeFilter.max !== null) {
    jobsToFilter = jobsToFilter.filter((job) => {
      const jobMinSalary = job.salary_min
        ? parseFloat(String(job.salary_min).replace(/[^\d.-]/g, ""))
        : 0;
      const jobMaxSalary = job.salary_max
        ? parseFloat(String(job.salary_max).replace(/[^\d.-]/g, ""))
        : jobMinSalary || 0; 
      
      if (isNaN(jobMinSalary) || isNaN(jobMaxSalary)) return false;

      let match = true;
      if (salaryRangeFilter.min !== null) {
        match = match && jobMaxSalary >= salaryRangeFilter.min; 
      }
      if (salaryRangeFilter.max !== null && salaryRangeFilter.max !== Infinity) {
        match = match && jobMinSalary <= salaryRangeFilter.max; 
      }
      return match;
    });
  }
  return jobsToFilter;
});


const formatGajiRingkas = (value) => {
  const numberValue = Number(value);

  if (isNaN(numberValue) || value === null || value === '') {
    return "N/A";
  }

  // Jika angka 1 Miliar atau lebih
  if (numberValue >= 1000000000) {
    const formatted = (numberValue / 1000000000).toFixed(1).replace(".0", "");
    return `Rp ${formatted.replace('.',',')} Miliar`;
  }

  // Jika angka 1 Juta atau lebih
  if (numberValue >= 1000000) {
    const formatted = (numberValue / 1000000).toFixed(1).replace(".0", "");
    return `Rp ${formatted.replace('.',',')} Juta`;
  }
 
  // Jika di bawah 1 Juta, gunakan format Rupiah biasa
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numberValue);
};

const openFilterPopup = () => (isFilterPopupOpen.value = true);
const closeFilterPopup = () => (isFilterPopupOpen.value = false);

const applyClientSideFilters = () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  closeFilterPopup();
};
const triggerClientSearch = () => {
  if (currentPage.value !== 1) currentPage.value = 1;
};

const totalPagesFromFilteredResults = computed(() => {
  if (!fullyFilteredJobs.value || fullyFilteredJobs.value.length === 0)
    return 0;
  return Math.ceil(fullyFilteredJobs.value.length / jobsPerPage);
});

const paginatedAndFilteredJobs = computed(() => {
  if (!fullyFilteredJobs.value || !Array.isArray(fullyFilteredJobs.value))
    return [];
  const startIndex = (currentPage.value - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  return fullyFilteredJobs.value.slice(startIndex, endIndex);
});

const nextPage = () => {
  if (currentPage.value < totalPagesFromFilteredResults.value)
    currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const goToPage = (page) => (currentPage.value = page);

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPagesFromFilteredResults.value;
  if (total <= 7) { 
    for (let i = 2; i < total; i++) pages.push(i);
    return pages;
  }

  let start = Math.max(
    2, 
    currentPage.value - Math.floor((visiblePageRange - 1) / 2)
  );
  let end = Math.min(
    total - 1, 
    currentPage.value + Math.ceil((visiblePageRange - 1) / 2)
  );

  if (currentPage.value <= 4) { 
    start = 2;
    end = Math.min(total - 1, visiblePageRange + 1); 
  } else if (currentPage.value >= total - 3) { 
    start = Math.max(2, total - visiblePageRange); 
    end = total - 1;
  }
  
  for (let i = start; i <= end; i++) {
    if (i > 1 && i < total) pages.push(i); 
  }
  return pages;
});




const formatCurrency = (value) => {
  if (value === null || isNaN(parseFloat(value))) return "N/A";
  const numericValue = parseFloat(value);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const isJobFavorited = (jobId) => {
  if (!jobId || !jobStore.userFavoriteJobIds) return false;
  return jobStore.userFavoriteJobIds.has(parseInt(jobId)); 
};

const toggleFavorite = async (job) => {
  if (!authStore.tokenUser) {
    Swal.fire(
      "Login Required",
      "Please login to manage your favorites.",
      "warning"
    );
    return;
  }
  if (!job || !job.id) {
    console.error("Job object or job ID is undefined in toggleFavorite");
    Swal.fire("Error", "Cannot process favorite for an undefined job.", "error");
    return;
  }

  const jobIdToToggle = parseInt(job.id); 
  processingFavoriteJobId.value = jobIdToToggle;
  try {
    if (isJobFavorited(jobIdToToggle)) {
      await jobStore.deleteFavoriteJob(jobIdToToggle, authStore.tokenUser);
    } else {
      await jobStore.createFavoriteJob(jobIdToToggle, authStore.tokenUser);
    }
  } catch (error) {
    console.error("Failed to toggle favorite in component:", error);
  } finally {
    processingFavoriteJobId.value = null; // Clear loading for this specific job item
  }
};


onMounted(() => {
  initializePageAndFavoriteData();
});

watch(
  [
    () => search.value.title,
    () => search.value.location,
    () => filters.value.position,
    () => filters.value.type,
    () => filters.value.salary,
  ],
  () => {
    if (currentPage.value !== 1) currentPage.value = 1; 
  }
);
</script>

<style scoped>
.font-semibold {
  font-weight: 600;
}
</style>
