<template>
  <div v-if="isLoadingInitialData" class="text-center py-8">
    <svg
      class="animate-spin h-8 w-8 text-blue-600 mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p class="mt-2 text-gray-600">Loading jobs...</p>
  </div>
  <div v-else-if="jobsStore.error" class="text-center py-8 bg-red-50 rounded-md shadow-sm">
    <p class="text-red-600 font-semibold text-lg">
      Gagal memuat data pekerjaan:
    </p>
    <p class="text-red-500 mt-2">{{ jobsStore.error }}</p>
  </div>
  <div v-else-if="!displayedJobs.length" class="text-center py-8 bg-yellow-50 rounded-md shadow-sm">
    <p class="text-yellow-700 font-semibold text-lg">
      Belum ada pekerjaan untuk ditampilkan.
    </p>
  </div>

  <div v-else class="relative my-5">
    <div class="overflow-auto">
      <table class="table-auto text-center w-full">
        <thead class="bg-slate-200 text-center">
          <tr>
            <th
              class="min-w-[200px] py-2 md:py-3 rounded-l-lg font-bold text-gray-600 text-left pl-4 md:pl-20"
            >
              Jobs
            </th>
            <th class="min-w-[150px] py-2 md:py-3 font-bold text-gray-600">Applications</th>
            <th class="min-w-[150px] py-2 md:py-3 font-bold text-gray-600">Status</th>
            <th class="min-w-[180px] py-2 md:py-3 rounded-r-lg font-bold text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in displayedJobs"
            :key="job.id"
            class="border-b border-gray-300"
          >
            <td class="py-4 pl-4 text-left">
              <div class="flex items-center">
                <img
                  :src="job.company_logo ? `http://localhost:3888/public/${job.company_logo}` : 'https://placehold.co/48x48/cccccc/000000?text=Logo'"
                  :alt="job.company_name || 'Company Logo'"
                  class="object-cover w-10 h-10 rounded mr-2 md:w-12 md:h-12 md:mr-4"
                />
                <div>
                  <p class="font-semibold text-sm md:text-base">
                    {{ job.title }}
                  </p>
                  <div
                    class="flex items-center text-gray-600 text-xs md:text-sm font-semibold"
                  >
                    <Icon
                      icon="charm:map-pin"
                      width="14"
                      height="14"
                      class="mr-1"
                      style="color: #718096"
                    />
                    {{ job.location }}
                  </div>
                  <p class="text-gray-700 text-xs md:text-sm font-semibold mt-1">
                    Rp. {{ job.salary_min }} - {{ job.salary_max }}
                  </p>
                </div>
              </div>
            </td>
            <td class="py-6 md:py-9 flex justify-center text-xs md:text-sm font-bold text-slate-500">
              <Icon
                icon="healthicons:people-outline"
                width="20"
                height="20"
                class="mr-1"
                style="color: #606060"
              />
              {{ job.total_apply || 0 }} applications
            </td>
            <td class="py-4 text-xs md:text-sm">
              <div class="flex items-center justify-center">
                <template v-if="job.is_active === 'active'" >
                  <Icon
                    icon="tabler:check"
                    width="16"
                    height="16"
                    style="color: #09ff19"
                    class="mr-1"
                  />
                  <p class="text-green-400 font-bold text-md">
                    Active
                  </p>
                </template>
                <template v-else-if="job.is_active === 'deactive'">
                  <Icon
                    icon="tabler:x"
                    width="16"
                    height="16"
                    style="color: #ff3d00"
                    class="mr-1"
                  />
                  <p class="text-red-400 font-bold text-md">
                    Inactive
                  </p>
                </template>
                <template v-else> {{ job.is_active }}
                </template>
              </div>
            </td>
            <td class="py-4 text-xs md:text-sm">
              <router-link
                :to="{ name: 'job-detail', params: { id: job.id } }" class="font-base px-3 py-1 rounded-lg text-white bg-[#0c1f61d3] hover:bg-[#091a52]"
              >
                View Details
              </router-link>
            </td>
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
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { JobsCompany } from "@/stores/jobs/companyjob"; // Sesuaikan path jika perlu

const jobsStore = JobsCompany();
const isLoadingInitialData = ref(true); // State untuk loading data awal komponen ini

// Computed property untuk mengambil 4 data pekerjaan teratas dari store
const displayedJobs = computed(() => {
  if (!jobsStore.allCompanyJobs) {
    return []; // Kembalikan array kosong jika data belum ada
  }
  return jobsStore.allCompanyJobs.slice(0, 4); // Ambil 4 item pertama
});

// Panggil fungsi untuk mengambil SEMUA daftar pekerjaan saat komponen dimuat
// hanya jika data di store masih kosong.
onMounted(async () => {
  isLoadingInitialData.value = true;
  try {
    // Cek apakah data sudah ada di store untuk menghindari fetch berulang jika tidak perlu
    if (jobsStore.allCompanyJobs.length === 0) {
      await jobsStore.fetchAllCompanyJobsOnce();
    }
  } catch (e) {
    // Error sudah ditangani di store, tapi bisa ditangani lagi di sini jika perlu
    console.error("Failed to fetch initial jobs for dashboard:", e);
  } finally {
    isLoadingInitialData.value = false;
  }
});
</script>

<style scoped>
/* Gaya spesifik untuk komponen ini jika ada */
</style>