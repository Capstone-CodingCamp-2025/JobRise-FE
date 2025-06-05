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
      v-if="jobsStore.isLoading && !jobsStore.allCompanyJobs.length"
      class="text-center py-8 rounded-md shadow-sm"
    >
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
      <p class="text-blue-800 font-semibold text-lg mt-2">
        Memuat daftar pekerjaan...
      </p>
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
      v-else-if="!jobsStore.allCompanyJobs || jobsStore.allCompanyJobs.length === 0"
      class="text-center py-8 bg-yellow-50 rounded-md shadow-sm"
    >
      <p class="text-yellow-700 font-semibold text-lg">
        Belum ada pekerjaan yang diposting.
      </p>
      <p v-if="!searchQuery" class="text-yellow-600 mt-2">
        Mulai posting pekerjaan pertama Anda!
      </p>
    </div>

    <div
      v-else-if="searchQuery && displayedJobs.length === 0"
      class="text-center py-8 bg-yellow-50 rounded-md shadow-sm"
    >
      <p class="text-yellow-700 font-semibold text-lg">
        Tidak ada pekerjaan yang cocok dengan pencarian Anda.
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
                  <img
                    :src="
                      job.company_logo
                        ? `http://localhost:3888/public/${job.company_logo}` 
                        : 'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D'
                    "
                    :alt="job.company_name || 'Company Logo'"
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
      class="flex justify-center items-center mt-4"
      v-if="totalPagesForPagination > 1 && !jobsStore.isLoading"
    >
      <button
        :disabled="currentPageForPagination === 1"
        @click="changePage(currentPageForPagination - 1)"
        class="px-3 py-1 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon
          icon="ri:arrow-left-line"
          width="24"
          height="24"
          style="color: #1526ea"
        />
      </button>

      <template v-if="totalPagesForPagination <= 5">
        <button
          v-for="page in totalPagesForPagination"
          :key="`page-${page}`"
          @click="changePage(page)"
          :class="[
            'px-3 py-1',
            {
              'font-semibold bg-blue-200 rounded-md':
                currentPageForPagination === page,
            },
          ]"
        >
          {{ page }}
        </button>
      </template>
      <template v-else>
        <button
          @click="changePage(1)"
          :class="[
            'px-3 py-1',
            {
              'font-semibold bg-blue-200 rounded-md': currentPageForPagination === 1,
            },
          ]"
        >
          1
        </button>

        <span v-if="currentPageForPagination > 3" class="px-1 py-1 self-center">...</span>

        <button
          v-for="page in visiblePageNumbers"
          :key="`visible-${page}`"
          @click="changePage(page)"
          :class="[
            'px-3 py-1',
            {
              'font-semibold bg-blue-200 rounded-md':
                currentPageForPagination === page,
            },
          ]"
        >
          {{ page }}
        </button>

        <span v-if="currentPageForPagination < totalPagesForPagination - 2" class="px-1 py-1 self-center">...</span>

        <button
          v-if="totalPagesForPagination > 1" 
          @click="changePage(totalPagesForPagination)"
          :class="[
            'px-3 py-1',
            {
              'font-semibold bg-blue-200 rounded-md': currentPageForPagination === totalPagesForPagination,
            },
          ]"
        >
          {{ totalPagesForPagination }}
        </button>
      </template>

      <button
        :disabled="currentPageForPagination === totalPagesForPagination"
        @click="changePage(currentPageForPagination + 1)"
        class="px-3 py-1 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
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

const jobsStore = JobsCompany();
const searchQuery = ref("");

// State untuk paginasi client-side
const currentPageForPagination = ref(1);
const itemsPerPageForPagination = ref(10); // Atur jumlah item per halaman

// 1. Data yang sudah difilter berdasarkan searchQuery dari semua data di store
const filteredJobs = computed(() => {
  if (!jobsStore.allCompanyJobs) return [];
  if (!searchQuery.value) {
    return jobsStore.allCompanyJobs;
  }
  const query = searchQuery.value.toLowerCase();
  return jobsStore.allCompanyJobs.filter(
    (job) =>
      (job.title && job.title.toLowerCase().includes(query)) ||
      (job.location && job.location.toLowerCase().includes(query))
  );
});

// 2. Total halaman berdasarkan data yang sudah difilter
const totalPagesForPagination = computed(() => {
  if (!filteredJobs.value) return 0;
  return Math.ceil(filteredJobs.value.length / itemsPerPageForPagination.value);
});

// 3. Data yang akan ditampilkan di halaman saat ini (hasil paginasi client-side)
const displayedJobs = computed(() => {
  if (!filteredJobs.value) return [];
  const start = (currentPageForPagination.value - 1) * itemsPerPageForPagination.value;
  const end = start + itemsPerPageForPagination.value;
  return filteredJobs.value.slice(start, end);
});

// 4. Logika untuk nomor halaman yang terlihat di paginasi (dengan elipsis)
const visiblePageNumbers = computed(() => {
  const total = totalPagesForPagination.value;
  const current = currentPageForPagination.value;
  const pageRange = 1; // Jumlah halaman di setiap sisi halaman saat ini (misal: C-1, C, C+1)
  let pages = [];

  if (total <= 1) return []; // Jika hanya 1 halaman atau tidak ada, tidak ada nomor halaman 'tengah'

  // Jika total halaman sedikit, tombol paginasi sudah ditangani oleh template v-if="totalPagesForPagination <= 5"
  // Jadi, visiblePageNumbers akan berisi halaman antara 1 dan total jika tidak ada elipsis.
  // Untuk kasus elipsis (total > 5):
  let start = current - pageRange;
  let end = current + pageRange;

  // Pastikan start dan end tidak melewati batas halaman 1 dan total
  // dan tidak tumpang tindih dengan tombol halaman 1 atau terakhir yang sudah eksplisit
  if (start <= 1) start = 2;
  if (end >= total) end = total - 1;
  
  // Jika karena penyesuaian start jadi lebih besar dari end (misal saat current = 1 atau current = total)
  // atau tidak ada halaman di antara 1 dan total, kosongkan pages.
  if (start > end) return [];

  for (let i = start; i <= end; i++) {
    // Hanya tambahkan jika halaman tersebut bukan halaman pertama atau terakhir KARENA
    // halaman 1 dan totalPagesForPagination sudah ditampilkan secara eksplisit di template elipsis
    if (i > 1 && i < total) {
       pages.push(i);
    }
  }
  
  // Penyesuaian khusus agar lebih banyak nomor ditampilkan jika dekat tepi dan ada elipsis
  // Misal, jika current page = 2 dan total > 5, kita ingin [2, 3] (jika pageRange=1)
  // Jika current page = 3 dan total > 5, kita ingin [2, 3, 4]
  if (total > 5) {
    pages = []; // Reset untuk logika elipsis
    if (current <= 3) { // Dekat awal: tampilkan 2, 3, mungkin 4
        for(let i = 2; i <= Math.min(4, total - 1); i++) pages.push(i);
    } else if (current >= total - 2) { // Dekat akhir: tampilkan total-3, total-2, total-1
        for(let i = Math.max(2, total - 3); i <= total - 1; i++) pages.push(i);
    } else { // Di tengah: tampilkan current-1, current, current+1
        for(let i = current - pageRange; i <= current + pageRange; i++) {
            if (i > 1 && i < total) pages.push(i);
        }
    }
  }
  return pages;
});

// Fungsi untuk mengubah halaman
function changePage(page) {
  if (page >= 1 && page <= totalPagesForPagination.value) {
    currentPageForPagination.value = page;
    window.scrollTo(0, 0); // Opsional: scroll ke atas halaman
  }
}

// Panggil fungsi untuk mengambil SEMUA daftar pekerjaan saat komponen dimuat
onMounted(() => {
  jobsStore.fetchAllCompanyJobsOnce();
});

// Watcher untuk searchQuery: reset ke halaman 1 jika query pencarian berubah
watch(searchQuery, () => {
  currentPageForPagination.value = 1;
});

// Watcher untuk total data (allCompanyJobs): reset ke halaman 1 jika data master berubah
watch(() => jobsStore.allCompanyJobs.length, () => {
  if (currentPageForPagination.value > totalPagesForPagination.value && totalPagesForPagination.value > 0) {
    currentPageForPagination.value = totalPagesForPagination.value;
  } else if (totalPagesForPagination.value === 0) {
    currentPageForPagination.value = 1;
  } else if (totalPagesForPagination.value === 1 && currentPageForPagination.value !== 1) {
     currentPageForPagination.value = 1;
  }
}, { immediate: false });

</script>