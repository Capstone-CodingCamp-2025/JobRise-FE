<template>
  <div class="px-6 py-2 md:py-8">
    <h1 class="font-bold text-2xl md:text-3xl mb-6">My Favorite Jobs</h1>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Icon
        icon="eos-icons:loading"
        width="50"
        height="50"
        class="text-blue-600"
      />
      <p class="ml-3 text-gray-700 text-lg">Loading your favorite jobs...</p>
    </div>

    <div
      v-else-if="error"
      class="text-center py-20 bg-red-50 rounded-md shadow-sm"
    >
      <p class="text-red-600 font-semibold text-xl">
        Failed to load favorite jobs.
      </p>
      <p class="text-gray-600 mt-2">
        {{ error.message || "An unknown error occurred." }}
      </p>
      <button
        @click="loadFavoriteJobs(1)"
        class="mt-6 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
      >
        Try Again
      </button>
    </div>

    <div
      v-else-if="!displayedFavoriteJobs || displayedFavoriteJobs.length === 0"
      class="text-center py-20 bg-yellow-50 rounded-md shadow-sm"
    >
      <Icon
        icon="mdi:bookmark-off-outline"
        width="60"
        height="60"
        class="text-yellow-600 mx-auto mb-3"
      />
      <p class="text-yellow-700 font-semibold text-xl">
        You haven't favorited any jobs yet.
      </p>
      <router-link
        :to="{ name: 'find-job' }"
        class="mt-4 inline-block text-blue-600 hover:underline"
      >
        Find jobs to favorite
      </router-link>
    </div>

    <div v-else>
      <div v-for="favJobItem in displayedFavoriteJobs" :key="favJobItem.id">
        <div
          class="flex flex-col md:flex-row justify-between md:items-center gap-x-4 md:gap-x-10 py-5"
        >
          <div class="flex gap-x-4 flex-grow min-w-0">
            <div
              class="md:w-22 md:h-22 w-14 h-14 rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="favJobItem.company_logo"
                :src="`${baseImageUrl}${favJobItem.company_logo}`"
                :alt="favJobItem.company_name || favJobItem.title"
                class="object-fill w-full h-full"
                @error="handleImageError($event, favJobItem.job_id)"
              />
            </div>
            <div class="flex">
              <div class="flex flex-col gap-y-2.5 flex-grow min-w-0">
                <router-link
                  :to="{
                    name: 'job-user-detail',
                    params: { id: favJobItem.job_id },
                  }"
                >
                  <p
                    class="font-bold text-sm md:text-lg hover:text-blue-700 transition-colors truncate"
                  >
                    {{ favJobItem.title }}
                  </p>
                </router-link>

                <div
                  class="flex items-center text-gray-600 text-[10px] md:text-xs font-medium"
                >
                  <Icon
                    icon="charm:map-pin"
                    width="14"
                    height="14"
                    class="mr-1 flex-shrink-0"
                    style="color: #718096"
                  />
                  <span class="truncate">{{
                    favJobItem.location || "N/A"
                  }}</span>
                </div>
                <p
                  class="text-slate-600 text-[10px] md:text-xs font-medium whitespace-nowrap"
                >
                  {{
                    formatSalary(favJobItem.salary_min, favJobItem.salary_max)
                  }}
                </p>
              </div>
              <div
                class="md:pt-1 flex flex-col gap-y-1 md:gap-y-2 ml-2 md:ml-4 flex-shrink-0 text-left md:text-left"
              >
                <p
                  v-if="favJobItem.job_type"
                  class="text-blue-800 font-bold text-[9px] md:text-xs px-1.5 py-0.5 rounded-md w-fit whitespace-nowrap"
                >
                  {{ favJobItem.job_type.toUpperCase() }}
                </p>
              </div>
            </div>
          </div>

          <div class="pt-4 md:pt-0 ">
            <div class="flex items-center gap-x-10 md:gap-x-4">
              <button
                @click="handleDeleteFavorite(favJobItem.job_id)"
                :disabled="
                  jobStore.isDeletingFavorite &&
                  jobStore.deletingFavoriteId === favJobItem.job_id
                "
                class="p-2 rounded-full hover:bg-red-100 active:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                title="Remove from Favorites"
              >
                <Icon
                  v-if="
                    jobStore.isDeletingFavorite &&
                    jobStore.deletingFavoriteId === favJobItem.job_id
                  "
                  icon="eos-icons:loading"
                  width="24"
                  height="24"
                  class="text-blue-500"
                />
                <Icon
                  v-else
                  icon="material-symbols:bookmark-rounded"
                  width="36"
                  height="36"
                  
                  class="text-blue-950"
                />
              </button>
              <router-link
                :to="{
                  name: 'job-user-detail',
                  params: { id: favJobItem.job_id },
                }"
                class="relative bg-blue-950/80 hover:bg-blue-800 text-white px-4 md:px-6 pr-8 md:pr-10 rounded-md py-2 text-xs md:text-sm flex items-center justify-center whitespace-nowrap h-9 md:h-10"
              >
                View Job
                <Icon
                  icon="pepicons-pencil:arrow-right"
                  width="18"
                  height="18"
                  md:width="20"
                  md:height="20"
                  style="color: #ffff"
                  class="absolute right-2 md:right-3 top-1/2 -translate-y-1/2"
                />
              </router-link>
            </div>
          </div>
        </div>
        <hr class="text-gray-200" />
      </div>

      <div
        v-if="!isLoading && !error && jobStore.totalFavoritePages > 1"
        class="flex justify-center items-center mt-8 space-x-2"
      >
        <button
          @click="loadFavoriteJobs(jobStore.currentFavoritePage - 1)"
          :disabled="
            jobStore.currentFavoritePage <= 1 ||
            jobStore.loadingUserFavoriteJobs
          "
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-700">
          Page {{ jobStore.currentFavoritePage }} of
          {{ jobStore.totalFavoritePages }}
        </span>
        <button
          @click="loadFavoriteJobs(jobStore.currentFavoritePage + 1)"
          :disabled="
            jobStore.currentFavoritePage >= jobStore.totalFavoritePages ||
            jobStore.loadingUserFavoriteJobs
          "
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useActiveJobRecommendationsStore } from "@/stores/jobs/userjob"; // Sesuaikan path
import { AuthUserStorage } from "@/stores/auth/userAuth"; // Sesuaikan path
import Swal from "sweetalert2";

const jobStore = useActiveJobRecommendationsStore();
const authStore = AuthUserStorage();

const baseImageUrl = ref("http://localhost:3888/public/");
const logoErrors = ref({});

const displayedFavoriteJobs = computed(() => jobStore.userFavoriteJobs);
const isLoading = computed(() => jobStore.loadingUserFavoriteJobs);
const error = computed(() => jobStore.errorUserFavoriteJobs);

const handleImageError = (event, jobId) => {
  logoErrors.value[jobId] = true;
  // event.target.src = 'URL_PLACEHOLDER_JIKA_PERLU'; // Ganti dengan placeholder jika ada
};

const formatSalary = (min, max) => {
  const cleanMin = String(min || "").replace(/[^0-9.-]+/g, "");
  const cleanMax = String(max || "").replace(/[^0-9.-]+/g, "");
  const numericMin = parseFloat(cleanMin);
  const numericMax = parseFloat(cleanMax);

  if (!isNaN(numericMin) && !isNaN(numericMax)) {
    // Menggunakan toLocaleString untuk format Rupiah jika berupa angka
    return `Rp. ${numericMin.toLocaleString(
      "id-ID"
    )} - Rp. ${numericMax.toLocaleString("id-ID")}`;
  }
  if (!isNaN(numericMin))
    return `Mulai Rp ${numericMin.toLocaleString("id-ID")}`;
  if (!isNaN(numericMax))
    return `Hingga Rp ${numericMax.toLocaleString("id-ID")}`;

  // Fallback jika input asli (setelah dibersihkan dari null/undefined) adalah string non-numerik
  if (String(min || "").toLowerCase() !== "null" && String(min || "") !== "")
    return String(min);
  return "N/A";
};

const loadFavoriteJobs = async (page = 1) => {
  if (!authStore.tokenUser) {
    console.warn("User not authenticated. Cannot fetch favorite jobs.");
    jobStore.errorUserFavoriteJobs = {
      message: "Please login to see your favorite jobs.",
    };
    return;
  }
  logoErrors.value = {};
  try {
    await jobStore.fetchUserFavoriteJobs(authStore.tokenUser, {
      page: page,
      limit: 10,
    }); // Sesuaikan limit jika perlu
  } catch (e) {
    console.error("Failed to load favorite jobs in component:", e);
  }
};

const handleDeleteFavorite = async (jobIdToDelete) => {
  if (!authStore.tokenUser) {
    Swal.fire(
      "Login Required",
      "Please login to manage your favorites.",
      "warning"
    );
    return;
  }

  // Untuk loading per item (jika diimplementasikan di store dengan deletingFavoriteId)
  // jobStore.deletingFavoriteId = jobIdToDelete;

  Swal.fire({
    title: "Are you sure?",
    text: "This job will be removed from your favorites list.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, remove it!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await jobStore.deleteFavoriteJob(jobIdToDelete, authStore.tokenUser);
        // Store akan menampilkan Swal sukses dan memuat ulang daftar favorit.
        // Logika untuk memuat halaman sebelumnya jika halaman saat ini kosong setelah delete:
        if (
          displayedFavoriteJobs.value.length === 0 &&
          jobStore.currentFavoritePage > 1
        ) {
          loadFavoriteJobs(jobStore.currentFavoritePage - 1);
        } else if (
          displayedFavoriteJobs.value.length === 0 &&
          jobStore.currentFavoritePage === 1 &&
          jobStore.totalFavoritePages === 0
        ) {
          // Tidak perlu load page jika ini item terakhir dan tidak ada favorit sama sekali.
        }
      } catch (error) {
        console.error("Failed to delete favorite in component:", error);
      } finally {
        // jobStore.deletingFavoriteId = null;
      }
    }
  });
};

onMounted(() => {
  loadFavoriteJobs(1);
});
</script>

<style scoped>
.favorite-job-item:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}
img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
