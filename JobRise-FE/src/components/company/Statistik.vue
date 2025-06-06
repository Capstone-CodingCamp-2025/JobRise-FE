<template>
  <div class="px-4 md:px-8 lg:px-12 py-4">
    <p class="font-semibold text-gray-400 text-md py-3">Your Candidate Overview</p>
    <div v-if="isLoadingData" class="flex justify-center items-center py-10">
        <svg
          class="animate-spin h-8 w-8 text-blue-600"
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
        <p class="ml-3 text-slate-700">Loading data...</p>
    </div>
    <div v-else class="flex flex-wrap gap-x-2 gap-y-4">
      <div
        class="bg-[#F1F4FA] w-full sm:w-auto sm:max-w-xs flex-grow rounded-lg outline outline-slate-400 px-6 py-4 sm:px-10 md:px-16 text-center"
      >
        <h2 class="font-bold text-2xl md:text-3xl">{{ totalOpenJobs }}</h2>
        <p class="text-md font-semibold text-slate-700 mt-1">Open Jobs</p>
      </div>
      <div
        class="bg-[#F1F4FA] w-full sm:w-auto sm:max-w-xs flex-grow rounded-lg outline outline-slate-400 px-6 py-4 sm:px-10 md:px-16 text-center"
      >
        <h2 class="font-bold text-2xl md:text-3xl">{{ totalCandidates }}</h2> <p class="text-md font-semibold text-slate-700 mt-1">Candidates</p>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { JobsCompany } from '@/stores/jobs/companyjob'; // Pastikan path ini benar
import { ref, computed, onMounted } from 'vue';
import { useCompanyApplicationStore } from '@/stores/jobs/companyaplication';

const jobsStore = JobsCompany();
const isLoadingData = ref(true);
const candidates = useCompanyApplicationStore()

const totalCandidates = computed(() => {
  if(!candidates.jobApplicants) {
    return 0;
  }

  return candidates.jobApplicants.length
})
// Computed property untuk total pekerjaan yang berstatus "active" (Open Jobs)
const totalOpenJobs = computed(() => {
  if (!jobsStore.allCompanyJobs) {
    return 0;
  }
  return jobsStore.allCompanyJobs.filter(job => job.is_active === 'active').length;
});

// Jika Anda juga ingin menampilkan total semua pekerjaan yang pernah dibuat:
// const totalCreatedJobs = computed(() => {
//   if (!jobsStore.allCompanyJobs) return 0;
//   return jobsStore.allCompanyJobs.length;
// });

onMounted(async () => {
  isLoadingData.value = true;
  try {
    // Hanya fetch jika data di store kosong dan tidak sedang dalam proses loading dari store
    if (jobsStore.allCompanyJobs.length === 0 && !jobsStore.isLoading) {
      await jobsStore.fetchAllCompanyJobsOnce();
    }
  } catch (error) {
    console.error("Error fetching jobs for dashboard:", error);
  } finally {
    isLoadingData.value = false;
  }
});
</script>

<style scoped>
/* Styling tambahan jika diperlukan */
.sm\:w-auto {
    width: auto;
}
.sm\:max-w-xs { 
    max-width: 20rem; 
}
.flex-grow {
    flex-grow: 1;
}
</style>