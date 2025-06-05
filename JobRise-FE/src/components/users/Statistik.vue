<template>
  <div class="px-4 md:px-8 lg:px-12 text-left py-6">
    <h1 class="font-bold text-2xl md:text-3xl">
      Halo,
      <span v-if="user?.name">
        {{ user.name[0]?.toUpperCase() + user.name?.substring(1) }}
      </span>
      <span v-else>
        Pengguna
      </span>
    </h1>
    <p class="font-semibold text-gray-400 text-md py-3">
      Here is your daily activies and job alerts
    </p>
    <div class="grid grid-cols-3 gap-4 md:gap-6">
      <div
        class="bg-[#F1F4FA] outline outline-slate-300 w-full rounded-lg p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow"
      >
        <h2 class="font-bold text-2xl md:text-3xl mb-1">
          <span v-if="isLoadingStats">
            <Icon icon="eos-icons:loading" class="inline-block" />
          </span>
          <span v-else>{{ appliedJobsCount }}</span>
        </h2>
        <p class="text-sm md:text-md font-semibold text-slate-700">Applied Jobs</p>
      </div>
      <div
        class="bg-[#F1F4FA] outline outline-slate-300 w-full rounded-lg p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow"
      >
        <h2 class="font-bold text-2xl md:text-3xl mb-1">
          <span v-if="isLoadingStats">
            <Icon icon="eos-icons:loading" class="inline-block" />
          </span>
          <span v-else>{{ favoriteJobsCount }}</span>
        </h2>
        <p class="text-sm md:text-md font-semibold text-slate-700">Favorite Jobs</p>
      </div>
      <div
        class="bg-[#F1F4FA] outline outline-slate-300 w-full rounded-lg p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow"
      >
        <h2 class="font-bold text-2xl md:text-3xl mb-1">
          <span v-if="isLoadingStats">
            <Icon icon="eos-icons:loading" class="inline-block" />
          </span>
          <span v-else>{{ acceptedApplicationsCount }}</span>
        </h2>
        <p class="text-sm md:text-md font-semibold text-slate-700">Job Alerts</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { AuthUserStorage } from '@/stores/auth/userAuth'; // Sesuaikan path jika perlu
import { useActiveJobRecommendationsStore } from '@/stores/jobs/userjob'; // Sesuaikan path jika perlu
import { Icon } from "@iconify/vue"; // Import Iconify

// Initialize Stores
const authStore = AuthUserStorage();
const jobStore = useActiveJobRecommendationsStore();

// User data
const user = computed(() => authStore.currentUser);

// Loading state for stats
const isLoadingStats = ref(true);

// Computed properties for counts
const appliedJobsCount = computed(() => {
  // Asumsi jobStore.userAppliedJobs adalah array dari pekerjaan yang dilamar
  return jobStore.userAppliedJobs?.length || 0;
});

const favoriteJobsCount = computed(() => {
  // Asumsi jobStore.userFavoriteJobIds adalah Set atau Array dari ID pekerjaan favorit
  // Jika userFavoriteJobIds adalah Set:
  return jobStore.userFavoriteJobIds?.size || 0;
  // Jika userFavoriteJobIds adalah Array:
  // return jobStore.userFavoriteJobIds?.length || 0;
});

const acceptedApplicationsCount = computed(() => {
  // Asumsi jobStore.userAppliedJobs adalah array, dan setiap item memiliki properti status_lamaran
  // Ganti 'status_lamaran' dan 'diterima' sesuai dengan struktur data Anda
  const acceptedStatus = 'diterima'; // Status untuk lamaran yang diterima
  return jobStore.userAppliedJobs?.filter(
    (jobApplication) => jobApplication.status_lamaran?.toLowerCase() === acceptedStatus
  ).length || 0;
});

// Fetch data on component mount
onMounted(async () => {
  isLoadingStats.value = true;
  try {
    // Pastikan token pengguna tersedia sebelum melakukan fetch
    if (authStore.tokenUser) {
      // Panggil aksi dari store untuk mengambil data yang relevan
      // Aksi ini harus mempopulasikan jobStore.userAppliedJobs dan jobStore.userFavoriteJobIds
      await Promise.all([
        jobStore.fetchUserAppliedJobs(authStore.tokenUser), // Asumsi aksi ini ada
        jobStore.fetchUserFavoriteJobs(authStore.tokenUser, { page: 1, limit: 10000 }) // Asumsi aksi ini ada & mengambil semua ID favorit
      ]);
    } else {
      console.warn("User token not available. Stats might not be loaded.");
    }
  } catch (error) {
    console.error("Error fetching user job stats:", error);
    // Anda bisa menambahkan penanganan error di sini, misalnya menampilkan pesan ke pengguna
  } finally {
    isLoadingStats.value = false;
  }
});

// Logging untuk debugging
console.log('Current User from AuthStore:', user.value);

</script>

<style scoped>
/* Anda bisa menambahkan style tambahan di sini jika diperlukan */
.outline-slate-300 {
  outline-color: #cbd5e1; /* Warna outline yang lebih lembut dari slate-400 */
}
</style>
