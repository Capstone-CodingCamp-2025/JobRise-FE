// File: src/stores/company/applicationManagementStore.js
import { apiClient } from "@/config/axios"; // Pastikan path ini sesuai dengan konfigurasi Anda
import { ref } from "vue";
import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useCompanyApplicationStore = defineStore(
  "companyApplications",
  () => {
    // State untuk daftar pelamar per pekerjaan
    const jobApplicants = ref([]);
    const isLoadingApplicants = ref(false);
    const errorApplicants = ref(null);
    const currentJobIdForApplicants = ref(null);

    // State untuk detail aplikasi yang statusnya diupdate
    const updatedApplicationDetail = ref(null);
    const isUpdatingStatus = ref(false);
    const errorUpdatingStatus = ref(null);

    // State untuk hasil penghapusan semua aplikasi per pekerjaan
    const deletionResult = ref(null);
    const isDeletingApplications = ref(false);
    const errorDeletingApplications = ref(null);

    // --- State BARU untuk CV Preview ---
    const currentCvPreview = ref(null);
    const isLoadingCvPreview = ref(false);
    const errorCvPreview = ref(null);
    // --- Akhir State BARU untuk CV Preview ---

    /**
     * Mengambil daftar pengguna yang melamar berdasarkan Job ID (untuk Perusahaan).
     * GET /application/jobs/:id
     */
    const fetchApplicantsByJobId = async (jobId, token) => {
      isLoadingApplicants.value = true;
      errorApplicants.value = null;
      jobApplicants.value = [];
      currentJobIdForApplicants.value = jobId;

      try {
        const response = await apiClient.get(`/application/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
          jobApplicants.value = response.data.data;
        } else if (response.data && response.data.status === "success" && response.data.data.length === 0) {
          jobApplicants.value = [];
        } else {
          const errorMessage = response.data?.message || "Failed Load Data Applicants.";
          errorApplicants.value = new Error(errorMessage);
          jobApplicants.value = [];
        }
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed Load List Applicant.";
        errorApplicants.value = error;
        jobApplicants.value = [];
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 3000,
        });
        throw error;
      } finally {
        isLoadingApplicants.value = false;
      }
    };

    /**
     * Memperbarui status lamaran pengguna (untuk Perusahaan).
     * PUT /application/:id/status
     */
    const updateApplicantStatus = async (applicationId, status, token) => {
      isUpdatingStatus.value = true;
      errorUpdatingStatus.value = null;
      updatedApplicationDetail.value = null;

      const validStatuses = ["Accepted", "Screening", "Rejected"];
      if (!validStatuses.includes(status)) {
        const validationError = "Status Not Valid, Like As: Accepted, Screening, Rejected.";
        errorUpdatingStatus.value = new Error(validationError);
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: validationError, showConfirmButton: false, timer: 3000 });
        isUpdatingStatus.value = false;
        throw errorUpdatingStatus.value;
      }

      try {
        const response = await apiClient.put(
          `/application/${applicationId}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.status === "success" && response.data.data) {
          updatedApplicationDetail.value = response.data.data;
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `Status Applicant Success Change ${response.data.data.status}`,
            showConfirmButton: false,
            timer: 2000,
          });
          const index = jobApplicants.value.findIndex(app => app.id === applicationId);
          if (index !== -1) {
            jobApplicants.value[index].status = response.data.data.status;
          }
        } else {
          const errorMessage = response.data?.message || "Failed Update Status Applicant.";
          errorUpdatingStatus.value = new Error(errorMessage);
          Swal.fire({ toast: true, position: "top-end", icon: "error", title: errorMessage, showConfirmButton: false, timer: 3000 });
          throw errorUpdatingStatus.value;
        }
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed Update At Status.";
        errorUpdatingStatus.value = error;
         Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 3000,
        });
        throw error;
      } finally {
        isUpdatingStatus.value = false;
      }
    };

    /**
     * Menghapus semua lamaran pengguna berdasarkan Job ID (untuk Perusahaan).
     * DELETE /application/jobs/:id
     */
    const deleteAllApplicationsByJobId = async (jobId, token) => {
      isDeletingApplications.value = true;
      errorDeletingApplications.value = null;
      deletionResult.value = null;

      try {
        const response = await apiClient.delete(`/application/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.status === "success") {
          deletionResult.value = response.data;
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: response.data.message || `${response.data.data.count} Applicant Deleted Successfully .`,
            showConfirmButton: false,
            timer: 2500,
          });
          if (currentJobIdForApplicants.value === jobId) {
            jobApplicants.value = [];
          }
        } else if (response.data && response.data.status === "error" && response.status === 404) {
          const errorMessage = response.data.message || `Not Found ${jobId}.`;
          deletionResult.value = response.data;
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: errorMessage,
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          const errorMessage = response.data?.message || "Failed Deleted Applicants.";
          errorDeletingApplications.value = new Error(errorMessage);
           Swal.fire({ toast: true, position: "top-end", icon: "error", title: errorMessage, showConfirmButton: false, timer: 3000 });
          throw errorDeletingApplications.value;
        }
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.status === "error") {
            deletionResult.value = error.response.data;
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "info",
                title: error.response.data.message || "There are no applications to delete.",
                showConfirmButton: false,
                timer: 3000,
            });
        } else {
            const errorMessage = error.response?.data?.message || "An error occurred while deleting the application.";
            errorDeletingApplications.value = error;
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: errorMessage,
                showConfirmButton: false,
                timer: 3000,
            });
        }
        throw error;
      } finally {
        isDeletingApplications.value = false;
      }
    };

    // --- Action BARU untuk CV Preview ---
    /**
     * Mengambil data CV Preview berdasarkan ID Lamaran (Application ID).
     * GET /cv/application/:id
     * :id di sini adalah ID lamaran (application.id)
     */
    const fetchCvPreviewByApplicationId = async (applicationId, token) => {
      isLoadingCvPreview.value = true;
      errorCvPreview.value = null;
      currentCvPreview.value = null;

      try {
        const response = await apiClient.get(`/cv/application/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.status === "success" && response.data.data) {
          currentCvPreview.value = response.data.data;
        } else if (response.data && response.data.status === "error" && response.status === 404) {
          // Backend mengembalikan 404 jika aplikasi atau CV tidak ditemukan
          const errorMessage = response.data.message || "CV data or application not found.";
          errorCvPreview.value = new Error(errorMessage);
          // Swal.fire({ toast: true, position: "top-end", icon: "info", title: errorMessage, showConfirmButton: false, timer: 3000 });
        }
         else {
          const errorMessage = response.data?.message || "Failed to load CV data.";
          errorCvPreview.value = new Error(errorMessage);
          // Swal.fire({ toast: true, position: "top-end", icon: "error", title: errorMessage, showConfirmButton: false, timer: 3000 });
        }
        return response.data; // Selalu kembalikan respons data dari API
      } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while loading the CV..";
        errorCvPreview.value = error; // Simpan objek error lengkap
        currentCvPreview.value = null;
        if (error.response && error.response.status === 404) {
             Swal.fire({
                toast: true,
                position: "top-end",
                icon: "info", // Mungkin lebih baik 'info' atau 'warning' untuk 404
                title: errorMessage,
                showConfirmButton: false,
                timer: 3000,
            });
        } else {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: errorMessage,
                showConfirmButton: false,
                timer: 3000,
            });
        }
        throw error;
      } finally {
        isLoadingCvPreview.value = false;
      }
    };
    // --- Akhir Action BARU untuk CV Preview ---

    return {
      jobApplicants,
      isLoadingApplicants,
      errorApplicants,
      currentJobIdForApplicants,
      fetchApplicantsByJobId,

      updatedApplicationDetail,
      isUpdatingStatus,
      errorUpdatingStatus,
      updateApplicantStatus,

      deletionResult,
      isDeletingApplications,
      errorDeletingApplications,
      deleteAllApplicationsByJobId,

      // --- State dan Action BARU di-return ---
      currentCvPreview,
      isLoadingCvPreview,
      errorCvPreview,
      fetchCvPreviewByApplicationId,
      // --- Akhir State dan Action BARU di-return ---
    };
  }
);