<template>
  <div class="py-6 px-4 md:py-10 md:px-16 relative">
    <router-link :to="{ name: 'applied' }" class="absolute right-4 top-2 md:right-10 md:top-2 z-10">
      <Icon
        icon="material-symbols:close-rounded"
        width="28"
        height="28"
        style="color: #606060"
      />
    </router-link>

    <div v-if="isLoading" class="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <Icon icon="eos-icons:loading" width="60" height="60" class="text-blue-600" />
      <p class="mt-3 text-lg text-gray-700">Loading application details...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 min-h-[calc(100vh-200px)]">
      <Icon icon="material-symbols:error-outline" width="70" height="70" class="text-red-500 mx-auto mb-4"/>
      <p class="text-xl text-red-600 font-semibold">Failed to Load Application Details</p>
      <p class="text-gray-600 mt-2">{{ error.message || "An unknown error occurred." }}</p>
      <button @click="initializeApplicationPageData" class="mt-6 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">
        Try Again
      </button>
    </div>

    <div v-else-if="applicationDetail">
      <div class="flex flex-col md:flex-row justify-between w-full mb-4 md:mb-0">
        <div class="flex w-full gap-x-4 md:gap-x-10 mb-4 md:mb-0 justify-start items-center">
          <div class="w-16 h-16 md:w-28 md:h-28 bg-slate-200 rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              v-if="applicationDetail.company_logo"
              :src="`${baseImageUrl}${applicationDetail.company_logo}`"
              :alt="applicationDetail.company_name || 'Company Logo'"
              class="object-cover w-full h-full"
              @error="handleImageError"
            />
            <span v-if="isLogoError || !applicationDetail.company_logo" class="text-slate-500 text-sm">No Logo</span>
          </div>
          <div>
            <p class="font-bold text-base md:text-xl">{{ applicationDetail.title }}</p>
            <p class="font-medium text-gray-600 text-xs md:text-base">
              {{ applicationDetail.company_name || "Company Name N/A" }}
            </p>
          </div>
        </div>

        <div class="flex pt-2 md:pt-5 gap-x-2 md:gap-x-4 items-center">
          <button 
            @click="toggleFavoriteHandler" 
            :disabled="jobStore.isCreatingFavorite || jobStore.isDeletingFavorite || !applicationDetail.job_id"
            class="p-1.5 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :title="isCurrentJobFavorited ? 'Remove from Favorites' : 'Add to Favorites'"
          >
            <Icon
              :icon="isCurrentJobFavorited ? 'material-symbols:bookmark-rounded' : 'material-symbols:bookmark-outline'"
              width="30"
              height="30"
              md:width="36"
              md:height="36"
              :style="{ color: isCurrentJobFavorited ? '#0C4A6E' : '#606060' }" 
            />
          </button>
          <router-link
            :to="{ name: 'find-job' }" class="bg-blue-950/80 text-white w-36 md:w-44 py-1.5 md:pt-2 text-center h-8 md:h-10 relative rounded-md pr-4 md:pr-6 text-xs md:text-sm flex items-center justify-center"
          >
            Explore More Jobs
            <Icon
              icon="pepicons-pencil:arrow-right"
              width="18" height="18" md:width="24" md:height="24"
              style="color: #ffff"
              class="absolute inset-y-2 md:inset-y-2.5 right-1 md:right-2"
            />
          </router-link>
        </div>
      </div>

      <div class="">
        <div class="flex flex-col md:flex-row justify-around bg-blue-200/40 w-full text-center my-4 md:my-10 rounded-md overflow-hidden">
          <div class="px-4 py-3 md:px-10 md:py-8 w-full border-b md:border-b-0 md:border-r border-slate-300">
            <p class="font-semibold text-xl md:text-3xl">Salary</p>
            <p class="text-green-500 font-medium text-xs md:text-base">
              {{ formatSalary(applicationDetail.salary_min, applicationDetail.salary_max) }}
            </p>
          </div>
          <div class="px-4 py-3 md:px-10 md:py-8 w-full border-b md:border-b-0 md:border-r border-slate-300">
            <p class="font-semibold text-xl md:text-3xl">Location</p>
            <p class="text-gray-600 font-medium text-xs md:text-base">{{ applicationDetail.location || "N/A" }}</p>
          </div>
          <div class="px-4 py-3 md:px-10 md:py-8 w-full">
            <p class="font-semibold text-xl md:text-3xl">Type</p>
            <p class="text-gray-600 font-medium text-xs md:text-base">
              {{ applicationDetail.job_type || "N/A" }}
            </p>
          </div>
        </div>
      </div>

      <div class="my-6 md:my-0 ">
        <h2 class="font-bold text-lg md:text-xl pb-4 md:pb-10">
          Job Description
        </h2>
        <div
          v-if="applicationDetail.description"
          class="text-justify text-gray-500 text-xs md:text-base leading-relaxed prose max-w-none"
          v-html="applicationDetail.description"
        ></div>
        <p v-else class="text-justify text-gray-500 text-xs md:text-base leading-relaxed">
          Job description not provided.
        </p>
      </div>

      <div class="py-16 md:py-28">
        <div class="bg-blue-200/40 w-fit m-auto flex gap-x-4 md:gap-x-10 px-6 py-3 rounded-md items-center">
          <p class="text-blue-800 font-bold text-xl md:text-2xl">Status Apply</p>
          <span 
            :class="getStatusVisual(applicationDetail.status).bgClass + ' ' + getStatusVisual(applicationDetail.status).textClass"
            class="px-4 py-1.5 rounded-md text-sm md:text-base font-semibold flex items-center"
          >
            <Icon 
                v-if="getStatusVisual(applicationDetail.status).icon"
                :icon="getStatusVisual(applicationDetail.status).icon"
                width="20"
                height="20"
                class="mr-2"
            />
            {{ applicationDetail.status || "N/A" }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20 min-h-[calc(100vh-200px)]">
      <Icon icon="mdi:text-box-search-outline" width="70" height="70" class="text-gray-400 mx-auto mb-4"/>
      <p class="text-xl text-gray-500">Application details could not be found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router"; // useRouter tidak dipakai di sini, bisa dihapus jika tidak ada navigasi lain
import { Icon } from "@iconify/vue";
import { useActiveJobRecommendationsStore } from "@/stores/jobs/userjob"; 
import { AuthUserStorage } from "@/stores/auth/userAuth"; 
import Swal from "sweetalert2";

const route = useRoute();
const jobStore = useActiveJobRecommendationsStore();
const authStore = AuthUserStorage();

const baseImageUrl = ref("http://localhost:3888/public/"); 
const isLogoError = ref(false);

// Mengambil ID LAMARAN dari parameter route
const currentApplicationId = computed(() => route.params.id);

// Menggunakan state dari store untuk detail LAMARAN
const applicationDetail = computed(() => jobStore.currentApplicationDetail);
const isLoading = computed(() => jobStore.loadingApplicationDetail || jobStore.loadingUserFavoriteJobs); // Loading gabungan
const error = computed(() => jobStore.errorApplicationDetail || jobStore.errorUserFavoriteJobs); // Error gabungan

// Computed property untuk mengecek apakah pekerjaan terkait lamaran ini sudah difavoritkan
const isCurrentJobFavorited = computed(() => {
  if (!applicationDetail.value || !applicationDetail.value.job_id || !jobStore.userFavoriteJobIds) {
    return false;
  }
  return jobStore.userFavoriteJobIds.has(parseInt(applicationDetail.value.job_id));
});


const handleImageError = (event) => {
  event.target.style.display = 'none'; 
  isLogoError.value = true; 
};

const formatSalary = (min, max) => {
  if (min && max && String(min).toLowerCase() !== 'null' && String(max).toLowerCase() !== 'null' && min !== '' && max !== '') {
      return `Rp ${min} - ${max}`;
  }
  if (min && String(min).toLowerCase() !== 'null' && min !== '') return `Rp ${min}`;
  if (max && String(max).toLowerCase() !== 'null' && max !== '') return `Hingga Rp ${max}`;
  return "N/A";
};

const getStatusVisual = (status) => {
  if (!status) return { bgClass: 'bg-gray-100', textClass: 'text-gray-700', icon: 'heroicons:question-mark-circle-20-solid' };
  switch (status.toLowerCase()) {
    case "screening": return { bgClass: 'bg-orange-100', textClass: 'text-orange-700', icon: 'eos-icons:loading' };
    case "interview": return { bgClass: 'bg-blue-100', textClass: 'text-blue-700', icon: 'heroicons:chat-bubble-left-ellipsis-20-solid' };
    case "accepted": case "approved": return { bgClass: 'bg-green-100', textClass: 'text-green-700', icon: 'heroicons:check-circle-20-solid' };
    case "rejected": return { bgClass: 'bg-red-100', textClass: 'text-red-700', icon: 'heroicons:x-circle-20-solid' };
    default: return { bgClass: 'bg-gray-100', textClass: 'text-gray-700', icon: 'heroicons:information-circle-20-solid' };
  }
};

const initializeApplicationPageData = async () => {
  if (!currentApplicationId.value) {
    console.error("Application ID is missing from route params.");
    jobStore.errorApplicationDetail = { message: "Application ID is missing." };
    return;
  }
  if (!authStore.tokenUser) {
    console.warn("User not authenticated. Cannot fetch application details.");
    jobStore.errorApplicationDetail = { message: "Please login to view application details." };
    return;
  }
  try {
    // Ambil detail lamaran dan daftar favorit pengguna secara bersamaan
    await Promise.all([
        jobStore.fetchApplicationDetailById(currentApplicationId.value, authStore.tokenUser),
        // Ambil daftar favorit untuk mengetahui status bookmark
        // Cukup panggil sekali jika userFavoriteJobIds belum terisi, atau jika dirasa perlu refresh
        // Menggunakan limit besar untuk mencoba mendapatkan semua ID dalam satu panggilan
        jobStore.userFavoriteJobIds.size === 0 ? jobStore.fetchUserFavoriteJobs(authStore.tokenUser, { page: 1, limit: 1000 }) : Promise.resolve()
    ]);
  } catch (e) {
    console.error("Failed to load application page data in component:", e);
    // Error sudah ditangani oleh store
  }
};

const toggleFavoriteHandler = async () => {
  if (!authStore.tokenUser) {
    Swal.fire('Akses Ditolak', 'Silakan login untuk mengubah favorit.', 'warning');
    return;
  }
  if (!applicationDetail.value || !applicationDetail.value.job_id) {
    Swal.fire('Error', 'Informasi pekerjaan tidak ditemukan untuk difavoritkan.', 'error');
    return;
  }

  const jobIdToToggle = parseInt(applicationDetail.value.job_id);

  if (isCurrentJobFavorited.value) {
    try {
      await jobStore.deleteFavoriteJob(jobIdToToggle, authStore.tokenUser);
    } catch (error) {
      console.error("Gagal menghapus favorit di komponen:", error);
    }
  } else {
    try {
      await jobStore.createFavoriteJob(jobIdToToggle, authStore.tokenUser);
    } catch (error)
     {
      console.error("Gagal menambahkan favorit di komponen:", error);
       if (error.response && error.response.data && error.response.data.message === "Job already favorited") {
         if (!jobStore.userFavoriteJobIds.has(jobIdToToggle) && authStore.tokenUser) {
            await jobStore.fetchUserFavoriteJobs(authStore.tokenUser, { page: 1, limit: 1000 });
         }
      }
    }
  }
};


onMounted(() => {
  isLogoError.value = false; 
  initializeApplicationPageData();
});
</script>

<style scoped>
/* Untuk render HTML dari v-html (deskripsi pekerjaan) agar memiliki styling dasar */
.prose :deep(ul), .prose :deep(ol) {
  list-style-position: inside;
  padding-left: 1.5em;
}
.prose :deep(li) {
  margin-bottom: 0.5em;
}
.prose :deep(p) {
  margin-bottom: 1em;
}
.prose :deep(h1), .prose :deep(h2), .prose :deep(h3), .prose :deep(h4), .prose :deep(h5), .prose :deep(h6) {
  margin-bottom: 0.5em;
  font-weight: bold;
}
</style>