<template>
  <div class="">
    <div
      class="flex justify-between items-start sm:items-center pt-6 sm:pt-12 mb-6"
    >
      <p class="font-bold text-xl sm:text-lg mb-4 sm:mb-0">All Application</p>
      <button
        @click="handleDeleteCurrentJobApplications"
        :disabled="companyAppStore.isDeletingApplications"
        class="bg-blue-950/80 text-white px-2 py-1 md:px-5 md:py-2 rounded-md shadow-md hover:bg-red-800 transition-colors duration-300"
      >
        {{
          companyAppStore.isDeletingApplications ? "Deleting..." : "Delete Job"
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
        {{ companyAppStore.errorApplicants.message }}
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
                  class="appearance-none px-4 py-2 rounded-md font-medium text-sm focus:outline-none focus:border-transparent cursor-pointer w-full "
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
  <div
    class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
  >
    <div
      class="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10 flex-shrink-0"
    >
      <h3 class="text-xl font-bold">CV Preview</h3>
      <button
        @click="showCvModal = false"
        class="text-gray-500 hover:text-gray-800"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="overflow-y-auto">
      <div
        ref="cvContent"
        id="cv-content-area"
        class="p-6 md:p-8"
        v-if="cv"
      >
        <header class="text-center mb-8">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
            {{ cv.full_name }}
          </h1>
          <div class="mt-2 text-sm text-gray-600 flex justify-center items-center gap-x-3 md:gap-x-4 flex-wrap">
            <a v-if="cv.email" :href="`mailto:${cv.email}`" class="hover:underline">{{ cv.email }}</a>
            <span v-if="cv.email && cv.phone" class="hidden md:inline">|</span>
            <span v-if="cv.phone">{{ cv.phone }}</span>
            <span v-if="cv.phone && cv.city" class="hidden md:inline">|</span>
             <span v-if="cv.city" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="h-4 w-4"><path fill="currentColor" d="M12 12q.825 0 1.413-.588T14 10q0-.825-.588-1.413T12 8q-.825 0-1.413.588T10 10q0 .825.588 1.413T12 12m0 7.5q2.5-2.25 4.25-4.375T18 12.15q0-2.225-1.588-3.813T12 6.75q-2.825 0-4.413 1.588T6 12.15q0 1.925 1.75 4.05T12 19.5"/></svg>
                {{ cv.city }}
             </span>
            <span v-if="cv.city && (cv.linkedin || cv.portofolio_url)" class="hidden md:inline">|</span>
            <a v-if="cv.linkedin" :href="cv.linkedin" target="_blank" class="text-blue-600 hover:underline">LinkedIn</a>
            <span v-if="cv.linkedin && cv.portofolio_url" class="hidden md:inline">|</span>
            <a v-if="cv.portofolio_url" :href="cv.portofolio_url" target="_blank" class="text-blue-600 hover:underline">Portfolio</a>
          </div>
        </header>

        <main class="space-y-8">
          <section v-if="cv.bio">
            <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">
              PROFESSIONAL SUMMARY
            </h2>
            <p class="text-gray-700 leading-relaxed">{{ cv.bio }}</p>
          </section>

          <section v-if="cv.experiences && cv.experiences.length > 0">
            <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">
              WORK EXPERIENCE
            </h2>
            <div class="space-y-6">
              <div v-for="exp in cv.experiences" :key="exp.id">
                <div class="flex justify-between items-baseline flex-wrap">
                  <h3 class="text-md font-semibold text-gray-900">{{ exp.title }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(exp.start_date) }} - {{ exp.end_date ? formatDate(exp.end_date) : "Present" }}
                  </p>
                </div>
                <p class="text-md text-gray-600">{{ exp.company_name }}</p>
                <p class="mt-2 text-gray-700">{{ exp.description }}</p>
              </div>
            </div>
          </section>

          <section v-if="cv.educations && cv.educations.length > 0">
            <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">
              EDUCATION
            </h2>
            <div class="space-y-6">
              <div v-for="edu in cv.educations" :key="edu.id">
                <div class="flex justify-between items-baseline flex-wrap">
                  <h3 class="text-md font-semibold text-gray-900">{{ edu.name_school }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(edu.start_date) }} - {{ edu.end_date ? formatDate(edu.end_date) : "Present" }}
                  </p>
                </div>
                <p class="text-md text-gray-600">{{ edu.major }}</p>
                <p v-if="edu.gpa" class="text-sm text-gray-500 mt-1">GPA: {{ edu.gpa }}</p>
                <p v-if="edu.description" class="mt-2 text-gray-700">{{ edu.description }}</p>
              </div>
            </div>
          </section>

          <section v-if="cv.skills && cv.skills.length > 0">
            <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">
              SKILLS
            </h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in cv.skills" :key="skill.id" class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full">
                {{ skill.name }}
                <span v-if="skill.level" class="font-normal opacity-75"> ({{ skill.level }})</span>
              </span>
            </div>
          </section>
          
          <section v-if="cv.projects && cv.projects.length > 0">
            <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">
              PROJECTS
            </h2>
            <div class="space-y-6">
              <div v-for="project in cv.projects" :key="project.id">
                <div class="flex justify-between items-baseline flex-wrap">
                   <h3 class="text-md font-semibold text-gray-900">
                     <a v-if="project.link_url && project.link_url !== '...'" :href="project.link_url" target="_blank" class="text-blue-600 hover:underline">{{ project.title }}</a>
                     <span v-else>{{ project.title }}</span>
                  </h3>
                   <p class="text-sm text-gray-500">
                    {{ formatDate(project.start_date) }} - {{ project.end_date ? formatDate(project.end_date) : "Ongoing" }}
                  </p>
                </div>
                <p v-if="project.description" class="mt-2 text-gray-700">{{ project.description }}</p>
              </div>
            </div>
          </section>

          <section v-if="cv.certifications && cv.certifications.length > 0">
            <h2 class="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">
              CERTIFICATIONS
            </h2>
            <div class="space-y-6">
              <div v-for="cert in cv.certifications" :key="cert.id">
                <h3 class="text-md font-semibold text-gray-900">{{ cert.name }}</h3>
                <p class="text-md text-gray-600">{{ cert.issued_by }} - {{ cert.year }}</p>
                <p v-if="cert.id_credential_url" class="text-sm text-gray-500 mt-1">Credential ID: {{ cert.id_credential_url }}</p>
                <p v-if="cert.description" class="mt-2 text-gray-700">{{ cert.description }}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
// (Seluruh bagian <script setup> Anda sudah benar dan tidak perlu diubah)
import { ref, onMounted, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import Swal from "sweetalert2";
import { useCompanyApplicationStore } from "@/stores/jobs/companyaplication";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { nextTick } from "vue";

const cvContent = ref(null);
const isGeneratingPdf = ref(false);
const companyAppStore = useCompanyApplicationStore();
const authCompanyStore = useAuthCompanyStore();
const currentJobId = ref(1);
const authToken = computed(() => authCompanyStore.tokenCompany);
const showCvModal = ref(false);
const cv = computed(() => companyAppStore.currentCvPreview);

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
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short" };
  return date.toLocaleDateString("en-US", options);
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const getStatusColorClass = (currentStatus) => {
  switch (currentStatus) {
    case "Accepted":
      return "bg-green-200 text-green-800";
    case "Rejected":
      return "bg-red-200 text-red-800";
    case "Screening":
      return "bg-orange-200 text-orange-800";
    default:
      return "bg-blue-200 text-blue-800";
  }
};

const getStatusIconColor = (currentStatus) => {
  switch (currentStatus) {
    case "Accepted":
      return "#166534";
    case "Rejected":
      return "#991B1B";
    case "Screening":
      return "#9A3412";
    default:
      return "#1E40AF";
  }
};

const handleStatusChange = async (applicant, newStatus) => {
  if (!authToken.value) {
    Swal.fire("Error", "Authentication token is missing.", "error");
    return;
  }
  companyAppStore.currentlyUpdatingAppId = applicant.id;
  try {
    await companyAppStore.updateApplicantStatus(
      applicant.id,
      newStatus,
      authToken.value
    );
  } catch (error) {
    console.error(
      `Failed to update status for application ${applicant.id}:`,
      error
    );
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
    await companyAppStore.fetchCvPreviewByApplicationId(
      applicationId,
      authToken.value
    );
  } catch (error) {
    console.error(
      `Failed to fetch CV for application ${applicationId}:`,
      error
    );
  } finally {
    companyAppStore.currentlyFetchingCvForAppId = null;
  }
};



const handleDeleteCurrentJobApplications = async () => {
  if (!authToken.value) {
    Swal.fire("Error", "Authentication token is missing.", "error");
    return;
  }
  Swal.fire({
    title: "Are You Sure?",
    text: `You will delete all applications. This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete all applications.!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
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

// Ganti fungsi handleDownloadPdf Anda dengan versi ini

// Ganti dengan fungsi versi DEBUGGING ini
const handleDownloadPdf = async () => {
  if (!cvContent.value) return;

  console.log("--- Memulai Proses Debugging PDF ---");

  // Fungsi untuk mengecek elemen secara rekursif
  const findProblematicElement = (element) => {
    const style = window.getComputedStyle(element);
    const color = style.getPropertyValue("color");
    const bgColor = style.getPropertyValue("background-color");

    // Jika ditemukan oklch, log elemen ini ke konsol
    if (color.includes("oklch") || bgColor.includes("oklch")) {
      console.error("!!! DITEMUKAN ELEMEN BERMASALAH:", element);
      console.log("Gaya Warna:", color);
      console.log("Gaya Latar:", bgColor);
    }

    // Cek semua anak elemennya
    element.childNodes.forEach((child) => {
      if (child.nodeType === 1) {
        // Hanya cek jika ini adalah element node
        findProblematicElement(child);
      }
    });
  };

  // Jalankan detektif pada elemen CV asli
  findProblematicElement(cvContent.value);

  console.log("--- Selesai Melakukan Debugging ---");
  console.log(
    "Silakan cek konsol di atas untuk 'DITEMUKAN ELEMEN BERMASALAH'. Jika tidak ada, masalahnya mungkin lebih dalam."
  );

  // Untuk sementara, kita hentikan proses pembuatan PDF agar tidak error
  Swal.fire(
    "Debugging Selesai",
    "Silakan periksa konsol browser Anda (F12) untuk menemukan elemen penyebab masalah.",
    "info"
  );

  // Baris di bawah ini bisa diaktifkan kembali setelah masalah ditemukan
  // isGeneratingPdf.value = true;
  // try { ... }
};
</script>