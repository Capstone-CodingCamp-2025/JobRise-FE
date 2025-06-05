<template>
  <div class="">
    <div
      class="flex justify-between items-start sm:items-center pt-6 sm:pt-12 mb-6"
    >
      <p class="font-bold text-xl sm:text-lg mb-4 sm:mb-0">
        All Applications
      </p>
      <button
        @click="handleDeleteCurrentJobApplications"
        :disabled="companyAppStore.isDeletingApplications"
        class="bg-blue-950/80 text-white px-2 py-1 md:px-5 md:py-2 rounded-md shadow-md hover:bg-red-800 transition-colors duration-300"
      >
        {{
          companyAppStore.isDeletingApplications
            ? "Deleting..."
            : "Delete Aplications" 
        }}
      </button>
    </div>

    <div v-if="companyAppStore.isLoadingApplicants" class="text-center py-10">
      <p>Loading applications...</p>
    </div>
    <div
      v-else-if="companyAppStore.errorApplicants"
      class="text-center py-10 text-red-500"
    >
      <p>
        Error loading applications:
        {{
          companyAppStore.errorApplicants.message ||
          JSON.stringify(companyAppStore.errorApplicants)
        }}
      </p>
    </div>
    <div
      v-else-if="companyAppStore.jobApplicants.length === 0"
      class="text-center py-10 text-gray-500"
    >
      <p>No applications found for this job.</p>
    </div>
    <div v-else class="overflow-x-auto rounded-lg shadow-sm">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr class="text-center">
            <th
              class="px-4 py-3 rounded-tl-lg font-medium text-sm text-gray-600"
            >
              Name
            </th>
            <th class="px-4 py-3 font-medium text-sm text-gray-600">
              Date Applied
            </th>
            <th class="px-4 py-3 font-medium text-sm text-gray-600">CV</th>
            <th
              class="px-4 py-3 rounded-tr-lg font-medium text-sm text-gray-600"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="applicant in companyAppStore.jobApplicants"
            :key="applicant.id"
            class="text-center"
          >
            <td class="px-4 py-5 font-bold text-md text-gray-800">
              {{ applicant.name_user }}
            </td>
            <td class="px-4 py-5 text-gray-600 text-sm font-semibold">
              {{ formatDisplayDate(applicant.createdAt) }}
            </td>
            <td class="px-4 py-5">
              <button
                @click="handleViewCv(applicant.id)"
                :disabled="
                  companyAppStore.isLoadingCvPreview &&
                  companyAppStore.currentlyFetchingCvForAppId === applicant.id
                "
                class="bg-blue-950/80 text-white px-5 py-1.5 rounded-md shadow-sm hover:bg-blue-800 transition-colors duration-300 text-sm"
              >
                {{
                  companyAppStore.isLoadingCvPreview &&
                  companyAppStore.currentlyFetchingCvForAppId === applicant.id
                    ? "Loading..."
                    : "View CV"
                }}
              </button>
            </td>
            <td class="px-4 py-5 relative">
              <div class="relative w-full">
                <select
                  :value="applicant.status"
                  @change="handleStatusChange(applicant, $event.target.value)"
                  :disabled="
                    companyAppStore.isUpdatingStatus &&
                    companyAppStore.currentlyUpdatingAppId === applicant.id
                  "
                  :class="getStatusColorClass(applicant.status)"
                  class="appearance-none px-4 py-2 rounded-md font-medium text-sm focus:outline-none focus:border-transparent cursor-pointer w-full pr-10"
                >
                  <option value="Screening">Screening</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <Icon
                    icon="raphael:arrowdown"
                    width="16"
                    height="16"
                    :style="{ color: getStatusIconColor(applicant.status) }"
                  />
                </div>
              </div>

              <p
                v-if="
                  companyAppStore.isUpdatingStatus &&
                  companyAppStore.currentlyUpdatingAppId === applicant.id
                "
                class="text-xs text-gray-500 mt-1"
              >
                Updating...
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div
      v-if="showCvModal && companyAppStore.currentCvPreview"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">
          CV Preview: {{ companyAppStore.currentCvPreview.full_name }}
        </h3>
        <pre class="text-sm whitespace-pre-wrap bg-gray-100 p-4 rounded">{{
          JSON.stringify(companyAppStore.currentCvPreview, null, 2)
        }}</pre>
        <button @click="showCvModal = false" class="mt-4 bg-blue-950/80 text-white px-4 py-2 rounded-md hover:bg-blue-800">
          Close
        </button>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import Swal from "sweetalert2";
import { useCompanyApplicationStore } from "@/stores/jobs/companyaplication";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";

// 2. Import yang tidak perlu (jobStore dan router) dihapus
const companyAppStore = useCompanyApplicationStore();
const authCompanyStore = useAuthCompanyStore();

const currentJobId = ref(1); 
const authToken = computed(() => authCompanyStore.tokenCompany);
const showCvModal = ref(false);

onMounted(() => {
  if (currentJobId.value && authToken.value) {
    loadJobApplications();
  } else if (!authToken.value) {
    console.warn("Authentication token is missing.");
    Swal.fire({
      icon: "warning",
      title: "Not Authenticated",
      text: "You may need to log in to view this information.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3500,
    });
  }
});

watch(currentJobId, (newJobId) => {
  if (newJobId && authToken.value) {
    loadJobApplications();
  }
});

watch(authToken, (newToken) => {
  if (currentJobId.value && newToken) {
    loadJobApplications();
  }
});

const loadJobApplications = async () => {
  if (!authToken.value) {
    console.error("Cannot fetch applications: Auth token is missing.");
    return;
  }
  try {
    await companyAppStore.fetchApplicantsByJobId(
      currentJobId.value,
      authToken.value
    );
  } catch (error) {
    console.error("Failed to load job applications in component:", error);
  }
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const getStatusColorClass = (currentStatus) => {
  switch (currentStatus) {
    case "Accepted": return "bg-green-200 text-green-800";
    case "Rejected": return "bg-red-200 text-red-800";
    case "Screening": return "bg-orange-200 text-orange-800";
    default: return "bg-blue-200 text-blue-800";
  }
};

const getStatusIconColor = (currentStatus) => {
  switch (currentStatus) {
    case "Accepted": return "#166534";
    case "Rejected": return "#991B1B";
    case "Screening": return "#9A3412";
    default: return "#1E40AF";
  }
};

const handleStatusChange = async (applicant, newStatus) => {
  if (!authToken.value) {
    Swal.fire("Error", "Authentication token is missing.", "error");
    return;
  }
  companyAppStore.currentlyUpdatingAppId = applicant.id;
  try {
    await companyAppStore.updateApplicantStatus(applicant.id, newStatus, authToken.value);
  } catch (error) {
    console.error(`Failed to update status for application ${applicant.id}:`, error);
  } finally {
    companyAppStore.currentlyUpdatingAppId = null;
  }
};

const handleViewCv = async (applicationId) => {
  if (!authToken.value) {
    Swal.fire("Error", "Authentication token is missing.", "error");
    return;
  }
  showCvModal.value = true;
  companyAppStore.currentlyFetchingCvForAppId = applicationId;
  try {
    await companyAppStore.fetchCvPreviewByApplicationId(applicationId, authToken.value);
  } catch (error) {
    console.error(`Failed to fetch CV for application ${applicationId}:`, error);
  } finally {
    companyAppStore.currentlyFetchingCvForAppId = null;
  }
};

// 3. Fungsi delete dikembalikan ke versi semula
const handleDeleteCurrentJobApplications = async () => {
  if (!authToken.value) {
    Swal.fire("Error", "Authentication token is missing.", "error");
    return;
  }
  // 4. Konfirmasi dialog disesuaikan kembali untuk menghapus lamaran
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: `Anda akan menghapus semua lamaran untuk Job ID ${currentJobId.value}. Tindakan ini tidak dapat dibatalkan.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus semua lamaran!",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // 5. Memanggil aksi yang benar dari application store
        await companyAppStore.deleteAllApplicationsByJobId(
          currentJobId.value,
          authToken.value
        );
      } catch (error) {
        console.error(
          `Failed to delete applications for job ${currentJobId.value}:`,
          error
        );
      }
    }
  });
};
</script>