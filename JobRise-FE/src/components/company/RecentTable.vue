<template>
  <!-- Tampilkan spinner saat data pertama kali dimuat -->
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
    <p class="mt-2 text-gray-600">Memuat pekerjaan terbaru...</p>
  </div>

  <!-- Tampilkan pesan error jika terjadi kegagalan fetch -->
  <div v-else-if="jobsStore.error" class="text-center py-8 bg-red-50 rounded-md shadow-sm">
    <p class="text-red-600 font-semibold text-lg">
      Gagal memuat data
    </p>
    <p class="text-red-500 mt-2">{{ jobsStore.error }}</p>
  </div>

  <!-- Tampilkan jika tidak ada data pekerjaan sama sekali -->
  <div v-else-if="!displayedJobs.length" class="text-center py-8 bg-yellow-50 rounded-md shadow-sm">
    <p class="text-yellow-700 font-semibold text-lg">
      Belum ada pekerjaan yang diposting.
    </p>
  </div>

  <!-- Tampilkan tabel jika ada data -->
  <div v-else class="relative my-5">
    <div class="overflow-auto">
      <table class="table-auto text-center w-full">
        <thead class="bg-slate-200 text-center">
          <tr>
            <th
              class="min-w-[200px] py-2 md:py-3 rounded-l-lg font-bold text-gray-600 text-left pl-4 md:pl-20"
            >
              Pekerjaan
            </th>
            <th class="min-w-[150px] py-2 md:py-3 font-bold text-gray-600">Lamaran</th>
            <th class="min-w-[150px] py-2 md:py-3 font-bold text-gray-600">Status</th>
            <th class="min-w-[180px] py-2 md:py-3 rounded-r-lg font-bold text-gray-600">
              Aksi
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
                  :alt="job.company_name || 'Logo Perusahaan'"
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
                    {{ formatGajiRingkas(job.salary_min) }} - {{ formatGajiRingkas(job.salary_max) }}
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
              {{ job.total_apply || 0 }} lamaran
            </td>
            <td class="py-4 text-xs md:text-sm">
              <div class="flex items-center justify-center">
                <template v-if="job.is_active === 'active'" >
                  <Icon
                    icon="tabler:check"
                    width="16"
                    height="16"
                    style="color: #22c55e"
                    class="mr-1"
                  />
                  <p class="text-green-500 font-bold text-md">
                    Aktif
                  </p>
                </template>
                <template v-else>
                  <Icon
                    icon="tabler:x"
                    width="16"
                    height="16"
                    style="color: #ef4444"
                    class="mr-1"
                  />
                  <p class="text-red-500 font-bold text-md">
                    Tidak Aktif
                  </p>
                </template>
              </div>
            </td>
            <td class="py-4 text-xs md:text-sm">
              <router-link
                :to="{ name: 'job-detail', params: { id: job.id } }" class="font-base px-3 py-1 rounded-lg text-white bg-[#0c1f61d3] hover:bg-[#091a52]"
              >
                Lihat Detail
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
import { JobsCompany } from "@/stores/jobs/companyjob";

const jobsStore = JobsCompany();
const isLoadingInitialData = ref(true);

const displayedJobs = computed(() => {
  if (!jobsStore.allCompanyJobs) {
    return [];
  }
  // Tampilkan 4 pekerjaan terbaru (asumsi data dari API sudah urut)
  return jobsStore.allCompanyJobs.slice(0, 4);
});

const formatGajiRingkas = (value) => {
  const numberValue = Number(value);
  if (isNaN(numberValue) || value === null || value === '') return "N/A";
  if (numberValue >= 1000000000) return `Rp ${(numberValue / 1000000000).toFixed(1).replace(".0", "").replace('.',',')} Miliar`;
  if (numberValue >= 1000000) return `Rp ${(numberValue / 1000000).toFixed(1).replace(".0", "").replace('.',',')} Juta`;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(numberValue);
};

// Panggil fungsi untuk mengambil SEMUA daftar pekerjaan saat komponen dimuat
onMounted(async () => {
  isLoadingInitialData.value = true;
  try {
    // SELALU panggil fetchAllCompanyJobsOnce untuk mendapatkan data terbaru.
    // Ini adalah kunci perbaikannya.
    await jobsStore.fetchAllCompanyJobsOnce();
  } catch (e) {
    console.error("Gagal mengambil data pekerjaan untuk dashboard:", e);
  } finally {
    isLoadingInitialData.value = false;
  }
});
</script>
