// File: src/stores/jobs/userjob.js (atau path yang sesuai)
import { apiClient } from "@/config/axios";
import { ref } from "vue";
import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useActiveJobRecommendationsStore = defineStore(
  "activeJobs",
  () => {
    // State untuk rekomendasi pekerjaan aktif
    const activeJobRecommendations = ref([]);
    const loadingJobs = ref(false);
    const errorJobs = ref(null);

    // State untuk detail pekerjaan (dari /jobs-active/:id)
    const currentJobDetail = ref(null);
    const loadingJobDetail = ref(false);
    const errorJobDetail = ref(null);

    // State untuk aksi melamar pekerjaan
    const isApplyingToJob = ref(false);
    const applyJobError = ref(null);

    // State untuk daftar pekerjaan yang dilamar pengguna
    const userAppliedJobs = ref([]);
    const loadingUserAppliedJobs = ref(false);
    const errorUserAppliedJobs = ref(null);
    const totalUserApplications = ref(0);
    const totalUserAppliedPages = ref(1);
    const currentUserAppliedPage = ref(1);

    // State untuk detail lamaran pekerjaan
    const currentApplicationDetail = ref(null);
    const loadingApplicationDetail = ref(false);
    const errorApplicationDetail = ref(null);

    // State untuk aksi favorit
    const isCreatingFavorite = ref(false);
    const createFavoriteError = ref(null);
    const isDeletingFavorite = ref(false);
    const deleteFavoriteError = ref(null);

    // State untuk daftar pekerjaan favorit pengguna
    const userFavoriteJobs = ref([]); // Daftar objek favorit lengkap (dari API)
    const userFavoriteJobIds = ref(new Set()); // Set berisi jobId untuk pengecekan cepat
    const loadingUserFavoriteJobs = ref(false);
    const errorUserFavoriteJobs = ref(null);
    const totalUserFavorites = ref(0);
    const totalFavoritePages = ref(1);
    const currentFavoritePage = ref(1);

    const fetchActiveJobRecommendations = async (token, params = {}) => {
      loadingJobs.value = true;
      errorJobs.value = null;
      activeJobRecommendations.value = [];
      const queryParams = {};
      if (params.position) queryParams.position = params.position;
      if (params.type) queryParams.job_type = params.type;
      if (params.salary && params.salary !== "Any" && params.salary) {
        if (params.salary.includes("-")) {
          const parts = params.salary
            .replace(/\$/g, "")
            .replace(/k/g, "000")
            .split(" - ");
          if (parts.length === 2) {
            queryParams.min_salary = parseInt(parts[0], 10);
            queryParams.max_salary = parseInt(parts[1], 10);
          }
        } else if (params.salary.includes("+")) {
          queryParams.min_salary = parseInt(
            params.salary
              .replace(/\$/g, "")
              .replace(/k/g, "000")
              .replace("+", ""),
            10
          );
        }
      }
      try {
        const { data: responseData } = await apiClient.get("/jobs-active", {
          headers: { Authorization: `Bearer ${token}` },
          params: queryParams,
        });
        if (
          responseData &&
          responseData.data &&
          Array.isArray(responseData.data)
        ) {
          activeJobRecommendations.value = responseData.data;
        } else {
          activeJobRecommendations.value = [];
        }
        return responseData;
      } catch (error) {
        errorJobs.value = error;
        activeJobRecommendations.value = [];
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Gagal memuat daftar pekerjaan",
          showConfirmButton: false,
          timer: 3000,
        });
        throw error;
      } finally {
        loadingJobs.value = false;
      }
    };

    const fetchJobDetailById = async (jobId, token) => {
      loadingJobDetail.value = true;
      errorJobDetail.value = null;
      currentJobDetail.value = null;
      try {
        const { data: responseData } = await apiClient.get(
          `/jobs-active/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (responseData.status === "success" && responseData.data) {
          currentJobDetail.value = responseData.data;
        } else {
          errorJobDetail.value = new Error(
            responseData.message || "Gagal mengambil detail pekerjaan."
          );
          // Swal.fire({ toast: true, position: "top-end", icon: "error", title: responseData.message || "Gagal mengambil detail pekerjaan", showConfirmButton: false, timer: 3000 });
        }
        return responseData;
      } catch (error) {
        errorJobDetail.value = error;
        // Swal.fire({ toast: true, position: "top-end", icon: "error", title: `Gagal mengambil detail pekerjaan: ${error.message || 'Server Error'}`, showConfirmButton: false, timer: 3000 });
        throw error;
      } finally {
        loadingJobDetail.value = false;
      }
    };

    const applyToJob = async (jobId, token, applicationData = {}) => {
      isApplyingToJob.value = true;
      applyJobError.value = null;
      try {
        const requestBody =
          Object.keys(applicationData).length > 0 ? applicationData : {};
        const response = await apiClient.post(
          `/jobs-active/${jobId}/apply`,
          requestBody,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data && response.data.status === "success") {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: response.data.message || "Lamaran berhasil dikirim!",
            showConfirmButton: false,
            timer: 2000,
          });
          return response.data;
        } else {
          const errorMessage =
            response.data.message || "Gagal mengirim lamaran.";
          applyJobError.value = new Error(errorMessage);
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: errorMessage,
            showConfirmButton: false,
            timer: 3000,
          });
          throw applyJobError.value;
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat mengirim lamaran.";
        applyJobError.value = error;
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
        isApplyingToJob.value = false;
      }
    };

    const fetchUserAppliedJobs = async (
      token,
      params = { page: 1, limit: 10 }
    ) => {
      loadingUserAppliedJobs.value = true;
      errorUserAppliedJobs.value = null;
      try {
        const response = await apiClient.get("/application", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: params.page, limit: params.limit },
        });
        if (
          response.data &&
          response.data.status === "success" &&
          response.data.data
        ) {
          const responseData = response.data.data;
          if (params.page === 1) {
            userAppliedJobs.value = responseData.applications || [];
          } else {
            userAppliedJobs.value = userAppliedJobs.value.concat(
              responseData.applications || []
            );
          }
          totalUserApplications.value = responseData.totalApplications || 0;
          totalUserAppliedPages.value = responseData.totalPages || 1;
          currentUserAppliedPage.value =
            responseData.currentPage || params.page;
        } else if (
          response.status === 404 &&
          response.data.status === "error"
        ) {
          userAppliedJobs.value = [];
          totalUserApplications.value = 0;
          totalUserAppliedPages.value = 1;
          currentUserAppliedPage.value = 1;
        } else {
          const errorMessage =
            response.data.message || "Gagal memuat daftar lamaran pekerjaan.";
          errorUserAppliedJobs.value = new Error(errorMessage);
          userAppliedJobs.value = [];
          // Swal.fire({ toast: true, position: "top-end", icon: "error", title: errorMessage, showConfirmButton: false, timer: 3000 });
        }
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          userAppliedJobs.value = [];
          totalUserApplications.value = 0;
          totalUserAppliedPages.value = 1;
          currentUserAppliedPage.value = 1;
        } else {
          errorUserAppliedJobs.value = error;
          userAppliedJobs.value = [];
          // Swal.fire({ toast: true, position: "top-end", icon: "error", title: error.response?.data?.message || "Gagal memuat daftar lamaran.", showConfirmButton: false, timer: 3000 });
        }
        throw error;
      } finally {
        loadingUserAppliedJobs.value = false;
      }
    };

    const fetchApplicationDetailById = async (applicationId, token) => {
      loadingApplicationDetail.value = true;
      errorApplicationDetail.value = null;
      currentApplicationDetail.value = null;
      try {
        const response = await apiClient.get(`/application/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          response.data &&
          response.data.status === "success" &&
          response.data.data
        ) {
          currentApplicationDetail.value = response.data.data;
        } else {
          const errorMessage =
            response.data.message ||
            "Gagal mengambil detail lamaran pekerjaan.";
          errorApplicationDetail.value = new Error(errorMessage);
          // Swal.fire({ toast: true, position: "top-end", icon: "error", title: errorMessage, showConfirmButton: false, timer: 3000 });
        }
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          `Gagal mengambil detail lamaran: ${error.message || "Server Error"}`;
        errorApplicationDetail.value = error;
        // Swal.fire({ toast: true, position: "top-end", icon: "error", title: errorMessage, showConfirmButton: false, timer: 3000 });
        throw error;
      } finally {
        loadingApplicationDetail.value = false;
      }
    };

    const createFavoriteJob = async (jobId, token) => {
      isCreatingFavorite.value = true;
      createFavoriteError.value = null;
      const numericJobId = parseInt(jobId); // Konsistensi tipe data
  
      console.log(`STORE: Adding job ID ${numericJobId} to favorites.`);
  
      try {
        const response = await apiClient.post(
          `/favorite/jobs/${numericJobId}`,
          null, // Backend tidak memerlukan body untuk request ini
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log(`STORE: Respons API setelah createFavoriteJob untuk job ID ${numericJobId}:`, JSON.parse(JSON.stringify(response.data)));
  
        if (response.data && response.data.status === "success") { // Biasanya 201 Created
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: response.data.message || "Pekerjaan ditambahkan ke favorit!",
            showConfirmButton: false,
            timer: 2000,
          });
          
          const newFavorite = response.data.data; // Berisi { id, userId, jobId, createdAt }
          if (newFavorite && newFavorite.jobId) {
            userFavoriteJobIds.value.add(newFavorite.jobId);
          } else {
            userFavoriteJobIds.value.add(numericJobId); // Fallback jika jobId tidak ada di respons data favorit
          }
          // Untuk konsistensi daftar favorit lengkap (jika ditampilkan di UI lain)
          // Mungkin panggil fetchUserFavoriteJobs lagi jika perlu update array userFavoriteJobs
          // await fetchUserFavoriteJobs(token, { page: currentFavoritePage.value, limit: 10 });
          return response.data;
        } else {
          // Kasus jika status HTTP sukses (2xx) tapi payload berisi error
          const errorMessage = response.data.message || "Gagal menambahkan ke favorit.";
          createFavoriteError.value = new Error(errorMessage);
  
          if (errorMessage === "Job already favorited") {
            userFavoriteJobIds.value.add(numericJobId); // Sinkronkan state jika belum
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: 'success', // Ganti ikon menjadi success/ceklist
              title: "Pekerjaan ini sudah ada di favorit Anda.", // Pesan yang lebih sesuai
              showConfirmButton: false,
              timer: 2500,
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
          throw createFavoriteError.value;
        }
      } catch (error) {
        console.error(`STORE: Error saat createFavoriteJob untuk ID ${numericJobId}:`, error.response ? error.response.data : error.message);
        const errorMessage = error.response?.data?.message || error.message || "Gagal menambahkan ke favorit.";
        createFavoriteError.value = error;
  
        if (errorMessage === "Job already favorited") {
          userFavoriteJobIds.value.add(numericJobId); // Sinkronkan state jika belum
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: 'success', // GANTI IKON MENJADI CEKLIS/SUCCESS
            title: "Pekerjaan ini sudah ada di favorit Anda.", // Pesan yang lebih sesuai
            showConfirmButton: false,
            timer: 2500, 
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
        isCreatingFavorite.value = false;
      }
    };

    const fetchUserFavoriteJobs = async (token, params = { page: 1, limit: 10 }) => {
      loadingUserFavoriteJobs.value = true;
      errorUserFavoriteJobs.value = null;
      
      console.log(`STORE: Fetching user favorite jobs, page: ${params.page}, limit: ${params.limit}`);
    
      try {
        const response = await apiClient.get("/favorite/jobs", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: params.page, limit: params.limit },
        });
    
        console.log("STORE: Respons API untuk user favorite jobs:", JSON.parse(JSON.stringify(response.data)));
    
        if (response.data && response.data.status === "success" && response.data.data) {
          const responseData = response.data.data;
          // SELALU GANTI array dengan data halaman yang baru diambil untuk paginasi standar
          userFavoriteJobs.value = responseData.favorites || []; 
          
          // Update Set ID favorit jika ini adalah panggilan untuk menyegarkan semua ID
          // (misalnya, saat initial load atau jika ada parameter khusus)
          if (params.isFullRefreshOfFavoriteIds || (params.limit && params.limit >= 1000) ) { 
            userFavoriteJobIds.value = new Set((responseData.favorites || []).map(fav => fav.job_id));
          }
          // Jika tidak, userFavoriteJobIds akan dimanage oleh create/delete action
    
          totalUserFavorites.value = responseData.totalFavorites || 0;
          totalFavoritePages.value = responseData.totalPages || 1;
          currentFavoritePage.value = responseData.currentPage || params.page; // Update halaman saat ini dari respons
        } else if ((response.data && response.data.status === "error" && response.data.message && response.data.message.toLowerCase().includes("no favorite job found")) || (response.status === 404 && response.data.status === "error") ) {
          // Kasus 404 atau tidak ada favorit
          userFavoriteJobs.value = [];
          if (params.isFullRefreshOfFavoriteIds || (params.limit && params.limit >= 1000) || params.page === 1) { // Hanya reset Set jika konteksnya sesuai
            userFavoriteJobIds.value = new Set();
          }
          totalUserFavorites.value = 0;
          totalFavoritePages.value = 1;
          currentFavoritePage.value = 1;
          console.log("STORE: No favorite jobs found for the user.");
        } else {
          const errorMessage = response.data.message || "Gagal memuat daftar pekerjaan favorit.";
          errorUserFavoriteJobs.value = new Error(errorMessage);
          userFavoriteJobs.value = []; 
          Swal.fire({ toast: true, position: "top-end", icon: "error", title: errorMessage, showConfirmButton: false, timer: 3000 });
        }
        return response.data; 
      } catch (error) {
        console.error("STORE: Error saat fetchUserFavoriteJobs:", error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 404) {
          userFavoriteJobs.value = [];
          if (params.isFullRefreshOfFavoriteIds || (params.limit && params.limit >= 1000) || params.page === 1) {
            userFavoriteJobIds.value = new Set();
          }
          totalUserFavorites.value = 0;
          totalFavoritePages.value = 1;
          currentFavoritePage.value = 1;
        } else {
          errorUserFavoriteJobs.value = error;
          userFavoriteJobs.value = [];
          userFavoriteJobIds.value = new Set(); // Kosongkan juga jika ada error lain yang signifikan
          Swal.fire({ toast: true, position: "top-end", icon: "error", title: error.response?.data?.message || "Gagal memuat daftar favorit.", showConfirmButton: false, timer: 3000 });
        }
        throw error;
      } finally {
        loadingUserFavoriteJobs.value = false;
      }
    };

    const deleteFavoriteJob = async (favoriteEntryId, token) => { // Parameter diubah dari jobId menjadi favoriteEntryId
      isDeletingFavorite.value = true;
      deleteFavoriteError.value = null;
      const numericFavoriteEntryId = parseInt(favoriteEntryId); // Ini adalah ID dari tabel favorites
    
      console.log(`STORE: Attempting to delete favorite entry ID ${numericFavoriteEntryId}.`);
    
      try {
        // URL endpoint tetap sama, tapi 'id' di URL sekarang adalah ID entri favorit
        const response = await apiClient.delete(
          `/favorite/jobs/${numericFavoriteEntryId}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (response.data && response.data.status === "success") {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: response.data.message || "Pekerjaan dihapus dari favorit!",
            showConfirmButton: false,
            timer: 2000,
          });
    
          // Setelah berhasil, kita perlu menghapus item ini dari userFavoriteJobs
          // DAN juga menghapus job_id terkait dari userFavoriteJobIds
          // Kita butuh job_id untuk mengupdate userFavoriteJobIds.
          // Kita bisa menemukannya dari userFavoriteJobs sebelum menghapusnya.
          let deletedJobId = null;
          userFavoriteJobs.value = userFavoriteJobs.value.filter(fav => {
            if (fav.id === numericFavoriteEntryId) {
              deletedJobId = fav.job_id; // Ambil job_id sebelum dihapus dari array
              return false; // Hapus item ini dari array
            }
            return true;
          });
    
          if (deletedJobId !== null) {
            userFavoriteJobIds.value.delete(parseInt(deletedJobId));
          }
          
          totalUserFavorites.value = Math.max(0, totalUserFavorites.value - 1);
          // Perlu hitung ulang totalFavoritePages jika totalUserFavorites berubah signifikan
          // atau lebih baik, panggil ulang fetchUserFavoriteJobs untuk halaman saat ini.
          
          // Untuk konsistensi penuh, lebih baik memuat ulang halaman saat ini:
          // Ini akan menangani paginasi dan juga Set userFavoriteJobIds jika fetchUserFavoriteJobs mengelolanya.
          await fetchUserFavoriteJobs(token, { page: currentFavoritePage.value, limit: 10 });
    
          return response.data;
        } else {
          const errorMessage = response.data.message || "Gagal menghapus dari favorit.";
          deleteFavoriteError.value = new Error(errorMessage);
          Swal.fire({ /* ... error Swal ... */ });
          // Jika backend secara spesifik mengatakan "Favorite not found" (yang tidak akan terjadi jika findUnique menggunakan ID favorit)
          // tidak perlu sinkronisasi userFavoriteJobIds karena ID yang dikirim adalah ID favorit itu sendiri.
          throw deleteFavoriteError.value;
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Gagal menghapus dari favorit.";
        deleteFavoriteError.value = error;
        // Jika error 404 "Favorite not found" dari backend, berarti ID favoritnya salah
        if (errorMessage === "Favorite not found" || (error.response && error.response.status === 404)) {
          
        } else {
          Swal.fire({ /* ... generic error Swal ... */ });
        }
        throw error;
      } finally {
        isDeletingFavorite.value = false;
      }
    };

    return {
      activeJobRecommendations,
      loadingJobs,
      errorJobs,
      fetchActiveJobRecommendations,
      currentJobDetail,
      loadingJobDetail,
      errorJobDetail,
      fetchJobDetailById,
      isApplyingToJob,
      applyJobError,
      applyToJob,
      userAppliedJobs,
      loadingUserAppliedJobs,
      errorUserAppliedJobs,
      totalUserApplications,
      totalUserAppliedPages,
      currentUserAppliedPage,
      fetchUserAppliedJobs,
      currentApplicationDetail,
      loadingApplicationDetail,
      errorApplicationDetail,
      fetchApplicationDetailById,
      isCreatingFavorite,
      createFavoriteError,
      createFavoriteJob,
      isDeletingFavorite,
      deleteFavoriteError,
      deleteFavoriteJob,
      userFavoriteJobs,
      userFavoriteJobIds,
      loadingUserFavoriteJobs,
      errorUserFavoriteJobs,
      totalUserFavorites,
      totalFavoritePages,
      currentFavoritePage,
      fetchUserFavoriteJobs,
    };
  }
);
