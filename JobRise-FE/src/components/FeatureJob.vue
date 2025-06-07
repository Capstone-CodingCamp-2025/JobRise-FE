<template>
  <div class="py-16 min-h-screen px-3 md:px-10 lg:px-32">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl md:text-3xl font-black">Featured Job</h1>
      <router-link
        :to="{ name: 'role-login' }"
        class="outline-1 outline-blue-800 py-1 rounded-sm px-5 flex items-center font-semibold text-base text-blue-900 hover:bg-blue-950 hover:text-white transition-colors"
      >
        <span>View all</span>
        <Icon
          icon="formkit:arrowright"
          width="25"
          height="18"
          class="mt-1"
          style="color: #1b00fb"
        />
      </router-link>
    </div>

    <div v-if="isLoadingFeatured" class="text-center py-20">
      <div class="flex items-center justify-center" role="status">
        <svg
          class="animate-spin h-10 w-10 text-blue-600"
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
        <span class="ml-3 text-lg text-gray-700">Loading featured jobs...</span>
      </div>
    </div>

    <div v-else-if="errorFeatured" class="text-center py-20">
      <p class="text-lg text-red-500">
        Failed to load jobs. Please try again later.
      </p>
    </div>

    <div v-else-if="featuredJobs.length > 0" class="grid md:grid-cols-2 gap-x-4 gap-y-8 lg:gap-x-10 xl:grid-cols-3">
      <router-link 
        v-for="job in featuredJobs" 
        :key="job.id" 
        :to="{ name: 'role-login' }"
        class="block"
      >
        <div class="px-5 py-4 rounded-lg bg-[#b8caecda] outline outline-blue-800 h-full hover:shadow-lg hover:outline-blue-900 transition-all">
          <div>
            <h1 class="font-bold text-2xl mb-2 truncate" :title="job.title">{{ job.title }}</h1>
            <div class="flex gap-x-4 mb-4 items-center">
              <p class="text-blue-800 text-xs font-bold bg-blue-200 px-2 py-1 rounded">{{ job.job_type }}</p>
              <p class="text-xs text-gray-600 font-bold truncate">
                Salary: {{ formatSalary(job.salary_min, job.salary_max) }}
              </p>
            </div>
            <div class="flex gap-x-6 items-center">
              <div class="flex-shrink-0 w-16 h-16 rounded-md bg-white flex items-center justify-center overflow-hidden">
                <img
                  v-if="job.company_logo"
                  :src="`${baseImageUrl}${job.company_logo}`"
                  :alt="job.company_name"
                  class="object-cover w-full h-full"
                />
                <span v-else class="text-xs text-gray-500">No Logo</span>
              </div>
              <p class="md:pt-4 lg:pt-5 pt-3 text-md text-blue-900 font-medium truncate" :title="job.company_name">
                {{ job.company_name }}
              </p>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    
    <div v-else class="text-center py-20">
        <p class="text-lg text-gray-500">No featured jobs available right now.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Icon } from "@iconify/vue";
import { jobNoAuth } from '@/stores/jobNoAuth'; // Import store pekerjaan
import { storeToRefs } from 'pinia'; // Import storeToRefs untuk menjaga reaktivitas

// Inisialisasi store
const jobStore = jobNoAuth();

// Gunakan storeToRefs agar state (featuredJobs, dll.) bisa digunakan di template dan tetap reaktif
const { featuredJobs, isLoadingFeatured, errorFeatured } = storeToRefs(jobStore);

// Base URL untuk gambar (sesuaikan dengan alamat backend Anda)
const baseImageUrl = 'https://jobrise.hotelmarisrangkas.com/public/'; 

// Panggil action untuk mengambil data saat komponen pertama kali dimuat
onMounted(() => {
  // Cek jika data belum ada di store sebelum memanggil API, untuk efisiensi
  if (featuredJobs.value.length === 0) {
    jobStore.fetchFeaturedJobs();
  }
});

// ▼▼▼ FUNGSI INI TELAH DIPERBARUI ▼▼▼
/**
 * Mengubah angka gaji menjadi format ringkas (jt) atau format Rupiah standar.
 * @param {string|number} min Gaji minimum.
 * @param {string|number} max Gaji maksimum.
 * @returns {string} String gaji yang sudah diformat.
 */
const formatSalary = (min, max) => {
  // Helper function untuk memformat satu angka
  const format = (num) => {
    if (num === null || num === undefined || num === '') return null;
    const numberValue = Number(num);
    if (isNaN(numberValue)) return null;

    // Jika 1 juta atau lebih, ubah ke format "jt"
    if (numberValue >= 1000000) {
      const valueInJt = (numberValue / 1000000).toFixed(1);
      // Ganti .0 menjadi "" (1.0 -> 1) dan . menjadi , (1.5 -> 1,5)
      return valueInJt.replace('.0', '').replace('.', ',') + ' jt';
    }

    // Jika di bawah 1 juta, gunakan format ribuan standar
    return new Intl.NumberFormat('id-ID').format(numberValue);
  };

  const formattedMin = format(min);
  const formattedMax = format(max);

  // Gabungkan hasilnya menjadi string akhir
  if (formattedMin && formattedMax) return `Rp ${formattedMin} - Rp ${formattedMax}`;
  if (formattedMin) return `Mulai dari Rp ${formattedMin}`;
  if (formattedMax) return `Hingga Rp ${formattedMax}`;
  return 'N/A'; // Fallback jika tidak ada data
};
</script>
