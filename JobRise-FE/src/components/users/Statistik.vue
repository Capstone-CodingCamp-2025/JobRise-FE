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
import { AuthUserStorage } from '@/stores/auth/userAuth';
import { useActiveJobRecommendationsStore } from '@/stores/jobs/userjob';
import { Icon } from "@iconify/vue";

// Initialize Stores
const authStore = AuthUserStorage();
const jobStore = useActiveJobRecommendationsStore();

// User data
const user = computed(() => authStore.currentUser);

// Loading state for stats
const isLoadingStats = ref(true);

// Computed properties for counts
const appliedJobsCount = computed(() => {
  return jobStore.userAppliedJobs?.length || 0;
});

const favoriteJobsCount = computed(() => {
  return jobStore.userFavoriteJobIds?.size || 0;
});


// ==========================================================
// KODE PERUBAHAN ADA DI BAGIAN INI
// ==========================================================
const acceptedApplicationsCount = computed(() => {
  // Pastikan jobStore.userAppliedJobs adalah sebuah array
  if (!Array.isArray(jobStore.userAppliedJobs)) {
    return 0;
  }
  
  // Memfilter lamaran dengan `status` 'accepted' atau 'approved'
  return jobStore.userAppliedJobs.filter(application => {
    // Menggunakan properti 'status', bukan 'status_lamaran'
    const status = application.status?.toLowerCase();
    // Memeriksa nilai 'accepted' atau 'approved'
    return status === 'accepted' || status === 'approved';
  }).length;
});
// ==========================================================


// Fetch data on component mount
onMounted(async () => {
  isLoadingStats.value = true;
  try {
    if (authStore.tokenUser) {
      // Memanggil data yang diperlukan untuk statistik
      await Promise.all([
        jobStore.fetchUserAppliedJobs(authStore.tokenUser, { page: 1, limit: 10000 }), // Ambil semua data lamaran untuk perhitungan akurat
        jobStore.fetchUserFavoriteJobs(authStore.tokenUser, { page: 1, limit: 10000, isFullRefreshOfFavoriteIds: true })
      ]);
    } else {
      console.warn("User token not available. Stats might not be loaded.");
    }
  } catch (error) {
    console.error("Error fetching user job stats:", error);
  } finally {
    isLoadingStats.value = false;
  }
});

</script>

<style scoped>
.outline-slate-300 {
  outline-color: #cbd5e1;
}
</style>