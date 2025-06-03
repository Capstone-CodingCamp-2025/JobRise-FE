<template>
  <div class="px-4 pb-10 sm:px-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-bold text-2xl">Job List</h1>

      <form @submit.prevent class="relative">
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
          class="absolute inset-y-1 left-2"
        />
      </form>
    </div>

    <div
      v-if="jobsStore.isLoading"
      class="text-center py-8 bg-blue-50 rounded-md shadow-sm"
    >
      <p class="text-blue-800 font-semibold text-lg">
        Memuat daftar pekerjaan...
      </p>
      <svg
        class="animate-spin h-8 w-8 text-blue-600 mx-auto mt-4"
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
    </div>

    <div
      v-else-if="jobsStore.error"
      class="text-center py-8 bg-red-50 rounded-md shadow-sm"
    >
      <p class="text-red-600 font-semibold text-lg">
        Terjadi kesalahan saat memuat pekerjaan:
      </p>
      <p class="text-red-500 mt-2">{{ jobsStore.error }}</p>
    </div>

    <div
      v-else-if="displayedJobs.length === 0"
      class="text-center py-8 bg-yellow-50 rounded-md shadow-sm"
    >
      <p class="text-yellow-700 font-semibold text-lg">
        {{
          searchQuery
            ? "Tidak ada pekerjaan yang cocok dengan pencarian Anda."
            : "Belum ada pekerjaan yang diposting."
        }}
      </p>
      <p v-if="!searchQuery" class="text-yellow-600 mt-2">
        Mulai posting pekerjaan pertama Anda!
      </p>
    </div>

    <div v-else class="relative my-5">
      <div class="overflow-x-auto">
        <table class="table-auto text-center w-full md:px-10 min-w-[600px]">
          <thead class="bg-slate-200 text-center">
            <tr>
              <th
                class="min-w-[200px] py-2 md:py-3 rounded-l-lg font-bold text-gray-600 text-left pl-4 md:pl-20"
              >
                Jobs
              </th>
              <th class="min-w-[150px] py-2 md:py-3 font-bold text-gray-600">
                Applications
              </th>
              <th class="min-w-[150px] py-2 md:py-3 font-bold text-gray-600">
                Status
              </th>
              <th
                class="min-w-[180px] py-2 md:py-3 rounded-r-lg font-bold text-gray-600"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border-b border-gray-300"
              v-for="job in displayedJobs"
              :key="job.id"
            >
              <td class="py-4 pl-4 text-left">
                <div class="flex items-center">
                  {{ console.log(job)
                   }}
                  <img
                    :src="
                      job.company_logo
                        ? `http://localhost:3888/public/${job.company_logo}`
                        : 'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D'
                    "
                    :alt="job.company_name"
                    class="object-cover w-10 h-10 rounded mr-2 md:w-12 md:h-12 md:mr-4"
                  />
                  <div>
                    <p class="font-semibold text-sm md:text-base">
                      {{ job.title }}
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
                      {{ job.location }}
                    </div>
                    <p
                      class="text-gray-700 text-xs md:text-sm mt-1 font-medium"
                    >
                      Rp. {{ job.salary_min }} - {{ job.salary_max }}
                    </p>
                  </div>
                </div>
              </td>
              <td
                class="py-6 md:py-9 flex justify-center text-xs md:text-sm text-slate-600 md:font-semibold"
              >
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
                <div class="flex items-center justify-center font-semibold">
                  <template v-if="job.is_active === 'active'">
                    <Icon
                      icon="tabler:check"
                      width="16"
                      height="16"
                      style="color: #09ff19"
                      class="mr-1"
                    />
                    <p class="text-green-500 font-bold text-md">
                      {{ job.is_active }}
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
                    <p class="text-red-500 font-bold text-md">
                      {{ job.is_active }}
                    </p>
                  </template>
                  <template v-else>
                    {{ job.is_active }}
                  </template>
                </div>
              </td>
              <td class="py-4 text-xs md:text-sm">
                <router-link
                  :to="{ name: 'job-detail', params: { id: job.id } }"
                  class="font-base px-3 py-2 rounded-lg text-white bg-[#0c1f61d3] hover:bg-[#091a52]"
                >
                  View Applications
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

    <div
      class="flex justify-center mt-4"
      v-if="jobsStore.totalCompanyPages > 1"
    >
      <button
        :disabled="jobsStore.currentCompanyPage === 1 || jobsStore.isLoading"
        @click="
          jobsStore.fetchCompanyJobs(
            jobsStore.currentCompanyPage - 1,
            10,
            searchQuery
          )
        "
        class="px-3 py-1 rounded-l-md disabled:opacity-50"
      >
        <Icon
          icon="ri:arrow-left-line"
          width="24"
          height="24"
          style="color: #1526ea"
        />
      </button>

      <template v-if="jobsStore.totalCompanyPages <= 5">
        <button
          v-for="page in jobsStore.totalCompanyPages"
          :key="page"
          @click="jobsStore.fetchCompanyJobs(page, 10, searchQuery)"
          :class="[
            'px-3 py-1',
            {
              'font-semibold bg-blue-200 rounded-md':
                jobsStore.currentCompanyPage === page,
            },
          ]"
        >
          {{ page }}
        </button>
      </template>
      <template v-else>
        <button
          @click="jobsStore.fetchCompanyJobs(1, 10, searchQuery)"
          :class="[
            'px-3 py-1',
            {
              'font-semibold bg-blue-200 rounded-md':
                jobsStore.currentCompanyPage === 1,
            },
          ]"
        >
          1
        </button>
        <span v-if="jobsStore.currentCompanyPage > 3" class="px-1 py-1"
          >...</span
        >
        <button
          v-for="page in visiblePageNumbers"
          :key="page"
          @click="jobsStore.fetchCompanyJobs(page, 10, searchQuery)"
          :class="[
            'px-3 py-1',
            {
              'font-semibold bg-blue-200 rounded-md':
                jobsStore.currentCompanyPage === page,
            },
          ]"
        >
          {{ page }}
        </button>
        <span
          v-if="jobsStore.currentCompanyPage < jobsStore.totalCompanyPages - 2"
          class="px-1 py-1"
          >...</span
        >
        <button
          @click="
            jobsStore.fetchCompanyJobs(
              jobsStore.totalCompanyPages,
              10,
              searchQuery
            )
          "
          :class="[
            'px-3 py-1',
            {
              'font-semibold bg-blue-200 rounded-md':
                jobsStore.currentCompanyPage === jobsStore.totalCompanyPages,
            },
          ]"
        >
          {{ jobsStore.totalCompanyPages }}
        </button>
      </template>

      <button
        :disabled="
          jobsStore.currentCompanyPage === jobsStore.totalCompanyPages ||
          jobsStore.isLoading
        "
        @click="
          jobsStore.fetchCompanyJobs(
            jobsStore.currentCompanyPage + 1,
            10,
            searchQuery
          )
        "
        class="px-3 py-1 rounded-r-md disabled:opacity-50"
      >
        <Icon
          icon="ri:arrow-right-line"
          width="24"
          height="24"
          style="color: #1526ea"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { JobsCompany } from "@/stores/jobs/companyjob"; // Sesuaikan path ini

// Menggunakan store Pinia
const jobsStore = JobsCompany();

// State lokal untuk pencarian
const searchQuery = ref("");

// Computed property untuk memfilter pekerjaan yang ditampilkan.
const displayedJobs = computed(() => {
  if (!searchQuery.value) {
    return jobsStore.companyJobs;
  }
  const query = searchQuery.value.toLowerCase();
  return jobsStore.companyJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    // Anda bisa menambahkan pencarian berdasarkan kriteria lain di sini
  );
});

// Computed property untuk menentukan halaman yang terlihat di pagination
const visiblePageNumbers = computed(() => {
  const totalPages = jobsStore.totalCompanyPages;
  const currentPageNum = jobsStore.currentCompanyPage;
  const visibleRange = 1; // Jumlah halaman yang akan ditampilkan di setiap sisi halaman saat ini

  let pages = [];

  if (totalPages <= 5) {
    // Tampilkan semua halaman jika totalnya 5 atau kurang
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Logika untuk menampilkan halaman dengan elipsis
    if (currentPageNum <= visibleRange + 1) {
      // Dekat awal: 1 2 3 ... Last
      for (let i = 1; i <= 3; i++) {
        pages.push(i);
      }
    } else if (currentPageNum >= totalPages - visibleRange) {
      // Dekat akhir: 1 ... Last-2 Last-1 Last
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Di tengah: 1 ... Current-1 Current Current+1 ... Last
      for (
        let i = currentPageNum - visibleRange;
        i <= currentPageNum + visibleRange;
        i++
      ) {
        pages.push(i);
      }
    }
  }
  // Filter out 1 and totalPages if they are already handled by explicit buttons
  return pages.filter((page) => page > 1 && page < totalPages);
});

// Panggil fungsi untuk mengambil daftar pekerjaan saat komponen dimuat
onMounted(() => {
  jobsStore.fetchCompanyJobs(); // Tidak perlu parameter pencarian awal di sini
});

// Watcher untuk melakukan pencarian setiap kali searchQuery berubah
watch(searchQuery, (newQuery) => {
  // Jika Anda ingin melakukan pencarian di backend setiap kali ada perubahan,
  // Anda bisa memanggil jobsStore.fetchCompanyJobs di sini.
  // Namun, karena permintaan adalah untuk pencarian dengan data yang ada,
  // kita tidak perlu memanggil fetch lagi.
});
</script>
