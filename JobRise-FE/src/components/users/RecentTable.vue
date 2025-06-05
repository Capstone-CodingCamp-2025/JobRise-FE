<template>
  <div class="relative my-5">
    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <Icon
        icon="eos-icons:loading"
        width="40"
        height="40"
        class="text-blue-600"
      />
      <p class="ml-3 text-gray-700">Loading your applications...</p>
    </div>

    <div
      v-else-if="error"
      class="text-center py-10 bg-red-50 rounded-md shadow-sm"
    >
      <p class="text-red-600 font-semibold">Failed to load applications.</p>
      <p class="text-gray-600 mt-1">
        {{ error.message || "An unknown error occurred." }}
      </p>
      <button
        @click="loadAppliedJobs(1)"
        class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>

    <div
      v-else-if="!displayedAppliedJobs || displayedAppliedJobs.length === 0"
      class="text-center py-10 bg-yellow-50 rounded-md shadow-sm"
    >
      <p class="text-yellow-700 font-semibold">
        You haven't applied to any jobs yet.
      </p>
    </div>

    <div v-else class="overflow-auto">
      <table class="table-auto text-center w-full">
        <thead class="bg-slate-200 text-center">
          <tr>
            <th
              class="min-w-[200px] py-2 md:py-3 rounded-l-lg font-bold text-gray-600 text-left pl-4 md:pl-20"
            >
              Jobs
            </th>
            <th class="min-w-[150px] py-2 md:py-3 font-bold text-gray-600">
              Date Applied
            </th>
            <th class="min-w-[150px] py-2 md:py-3 font-bold text-gray-600">
              Status Apply
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
            v-for="application in displayedAppliedJobs"
            :key="application.id"
            class="border-b border-gray-300"
          >
            <td class="py-4 pl-4 text-left">
              <div class="flex items-center">
                <img
                  :src="
                    application.company_logo
                      ? `${baseImageUrl}${application.company_logo}`
                      : ''
                  "
                  :alt="application.title || 'Company Logo'"
                  class="object-cover w-10 h-10 rounded-md mr-2 md:w-14 md:h-14 md:mr-4 flex-shrink-0"
                />
                <div>
                  <p class="font-semibold text-sm md:text-base">
                    {{ application.title }}
                  </p>
                  <div
                    class="flex items-center text-gray-600 text-xs md:text-sm mt-1"
                  >
                    <Icon
                      icon="charm:map-pin"
                      width="14"
                      height="14"
                      class="mr-1 flex-shrink-0"
                      style="color: #718096"
                    />
                    <span>{{ application.location || "N/A" }}</span>
                  </div>
                  <p class="text-gray-700 text-xs md:text-sm mt-1">
                    {{
                      formatSalary(
                        application.salary_min,
                        application.salary_max
                      )
                    }}
                  </p>
                </div>
              </div>
            </td>
            <td class="py-4 text-xs md:text-sm text-gray-700">
              {{ formatDate(application.createdAt) }}
            </td>
            <td class="py-4 text-xs md:text-sm">
              <div
                :class="getStatusTextClass(application.status)"
                class="flex items-center justify-center px-2 py-1 rounded-full font-semibold text-xs"
              >
                <Icon
                  v-if="
                    application.status &&
                    application.status.toLowerCase() === 'screening'
                  "
                  icon="eos-icons:loading"
                  width="16"
                  height="16"
                  class="mr-1.5"
                />
                <Icon
                  v-else-if="
                    application.status &&
                    (application.status.toLowerCase() === 'accepted' ||
                      application.status.toLowerCase() === 'approved')
                  "
                  icon="heroicons:check-circle-20-solid"
                  width="18"
                  height="18"
                  class="mr-1.5"
                />
                <Icon
                  v-else-if="
                    application.status &&
                    application.status.toLowerCase() === 'rejected'
                  "
                  icon="heroicons:x-circle-20-solid"
                  width="18"
                  height="18"
                  class="mr-1.5"
                />
                <Icon
                  v-else-if="
                    application.status &&
                    application.status.toLowerCase() === 'interview'
                  "
                  icon="heroicons:chat-bubble-left-ellipsis-20-solid"
                  width="18"
                  height="18"
                  class="mr-1.5"
                />
                <span>{{ application.status || "N/A" }}</span>
              </div>
            </td>
            <td class="py-4 text-xs md:text-sm">
              <router-link
                :to="{ name: 'applied-detail', params: { id: application.id } }"
                class="font-base px-3 py-2 rounded-lg text-white bg-[#0c1f61d3] hover:bg-[#091a52]"
              >
                View Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="!isLoading && !error && jobStore.totalUserAppliedPages > 1"
      class="flex justify-center items-center mt-6 space-x-2"
    >
      <button
        @click="loadAppliedJobs(jobStore.currentUserAppliedPage - 1)"
        :disabled="
          jobStore.currentUserAppliedPage <= 1 ||
          jobStore.loadingUserAppliedJobs
        "
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <span class="text-sm text-gray-700">
        Page {{ jobStore.currentUserAppliedPage }} of
        {{ jobStore.totalUserAppliedPages }}
      </span>
      <button
        @click="loadAppliedJobs(jobStore.currentUserAppliedPage + 1)"
        :disabled="
          jobStore.currentUserAppliedPage >= jobStore.totalUserAppliedPages ||
          jobStore.loadingUserAppliedJobs
        "
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <div
      class="bg-gradient-to-l from-transparent via-gray-300/10 to-gray-300/30 w-5 md:w-20 h-full absolute left-0 bottom-0 pointer-events-none"
    ></div>
    <div
      class="bg-gradient-to-r from-transparent via-gray-300/10 to-gray-300/30 w-5 md:w-20 h-full absolute right-0 bottom-0 pointer-events-none"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useActiveJobRecommendationsStore } from "@/stores/jobs/userjob"; // Sesuaikan path jika perlu
import { AuthUserStorage } from "@/stores/auth/userAuth"; // Sesuaikan path jika perlu

const jobStore = useActiveJobRecommendationsStore();
const authStore = AuthUserStorage();

const baseImageUrl = ref("http://localhost:3888/public/"); // Sesuaikan jika URL API Anda berbeda

// Menggunakan state dari store untuk data, loading, dan error
const displayedAppliedJobs = computed(() => jobStore.userAppliedJobs);
const isLoading = computed(() => jobStore.loadingUserAppliedJobs);
const error = computed(() => jobStore.errorUserAppliedJobs);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options); // Menggunakan id-ID untuk format Indonesia
};

const formatSalary = (min, max) => {
  if (min && max) return `Rp. ${min} - Rp. ${max}`;
  if (min) return `Rp. ${min}`;
  if (max) return `Hingga Rp. ${max}`;
  return "N/A";
};

const getStatusTextClass = (status) => {
  if (!status) return "bg-gray-200 text-gray-700";
  switch (status.toLowerCase()) {
    case "screening":
      return "text-orange-400 ";
    case "interview":
      return "text-yellow-700";
    case "accepted": // Asumsi 'approved' dari template sebelumnya adalah 'accepted'
    case "approved":
      return "text-green-700";
    case "rejected":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

const loadAppliedJobs = async (page = 1) => {
  if (!authStore.tokenUser) {
    console.warn("User not authenticated. Cannot fetch applied jobs.");
    // Anda mungkin ingin menampilkan pesan error atau mengarahkan ke login
    // jobStore.errorUserAppliedJobs = { message: "Please login to see your applications." };
    return;
  }
  try {
    // Menggunakan limit 10 per halaman, sesuaikan jika perlu
    await jobStore.fetchUserAppliedJobs(authStore.tokenUser, {
      page: page,
      limit: 10,
    });
  } catch (e) {
    console.error("Failed to load applied jobs in component:", e);
    // Error sudah ditangani di store, tapi bisa ditambahkan logika UI di sini
  }
};

onMounted(() => {
  // Ambil halaman pertama saat komponen dimuat
  loadAppliedJobs(1);
});
</script>

<style scoped>
/* Gaya spesifik untuk komponen ini jika ada */
/* Pastikan gambar tidak meluap jika terlalu besar */
.table-auto img {
  max-width: 100%;
  height: auto;
}
</style>
