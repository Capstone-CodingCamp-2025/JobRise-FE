import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import router from "@/router";
import { useAuthCompanyStore } from "../auth/companyAuth";

export const JobsCompany = defineStore("jobs", () => {
  const isLoading = ref(false);
  const error = ref(null);
  const allCompanyJobs = ref([]);
  const jobDetail = ref(null);
  const authStore = useAuthCompanyStore();

  /**
   * Mengambil semua pekerjaan yang dimiliki perusahaan dengan paginasi.
   */
  async function fetchAllCompanyJobsOnce() {
    isLoading.value = true;
    error.value = null;
    let allFetchedJobs = [];
    let currentPage = 1;
    let hasMorePages = true;
    const BATCH_SIZE = 10;

    try {
      const token = authStore.tokenCompany;
      if (!token) {
        throw new Error("Token otentikasi tidak ditemukan. Harap login kembali.");
      }

      while (hasMorePages) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage,
            limit: BATCH_SIZE,
          },
        };

        const response = await apiClient.get("/jobs", config);

        let fetchedData;

        if (response.status === 200 && response.data.status === "success") {
          if (Array.isArray(response.data.data)) {
            fetchedData = response.data.data;
            if (!response.data.meta || !response.data.meta.totalPages) {
              if (fetchedData.length < BATCH_SIZE) {
                hasMorePages = false;
              }
            } else {
              if (currentPage >= response.data.meta.totalPages) {
                hasMorePages = false;
              }
            }
          } else if (response.data.data && Array.isArray(response.data.data.jobs)) {
            fetchedData = response.data.data.jobs;
            const paginationInfo = response.data.data;
            if (paginationInfo.currentPage && paginationInfo.totalPages) {
              if (paginationInfo.currentPage >= paginationInfo.totalPages) {
                hasMorePages = false;
              }
            } else if (fetchedData.length < BATCH_SIZE) {
              hasMorePages = false;
            }
          } else {
            hasMorePages = false;
            throw new Error("Format data pekerjaan dari server tidak sesuai.");
          }

          if (fetchedData && fetchedData.length > 0) {
            allFetchedJobs.push(...fetchedData);
          }

          if (hasMorePages) {
            currentPage++;
          }
        } else {
          throw new Error(response.data.message || `Gagal mengambil halaman ${currentPage} pekerjaan.`);
        }
      }

      allCompanyJobs.value = allFetchedJobs;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Terjadi kesalahan yang tidak diketahui.";
      allCompanyJobs.value = [];
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push("/login-company");
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Membuat posting pekerjaan baru.
   * @param {Object} jobData Data pekerjaan dari form.
   */
  async function createJobPost(jobData) {
    isLoading.value = true;
    error.value = null;

    try {
      const token = authStore.tokenCompany;
      if (!token) throw new Error("Token otentikasi tidak ditemukan.");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // ▼▼▼ MODIFIKASI DILAKUKAN DI SINI ▼▼▼
      // Buat payload baru dan konversi nilai gaji menjadi String
      // untuk dicocokkan dengan skema database di backend.
      const payload = {
        ...jobData, // Salin semua data dari form
        salary_min: String(jobData.salary_min), // Konversi salary_min ke String
        salary_max: String(jobData.salary_max), // Konversi salary_max ke String
      };
      // ▲▲▲ AKHIR MODIFIKASI ▲▲▲
      
      // Kirim 'payload' yang sudah dikonversi ke API, bukan 'jobData' asli
      const response = await apiClient.post("/jobs", payload, config);

      if (response.status === 201 && response.data.status === "success") {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Berhasil Membuat job",
          showConfirmButton: false,
          timer: 3000,
        });
        if (response.data.data && response.data.data.id) {
          allCompanyJobs.value.unshift(response.data.data);
        } else {
          await fetchAllCompanyJobsOnce();
        }
        router.push("/job-list");
      } else {
        throw new Error(response.data.message || "Gagal membuat posting pekerjaan.");
      }
    } catch (err) {
      // Cek secara spesifik untuk error 'Profil Belum Lengkap' (status 404)
      if (err.response && err.response.status === 404) {
        error.value = "Anda harus melengkapi profil perusahaan terlebih dahulu.";
        Swal.fire({
          icon: "warning",
          title: "Profil Belum Lengkap",
          text: "Anda harus melengkapi profil perusahaan untuk dapat memposting pekerjaan.",
          confirmButtonText: "Lengkapi Profil",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push({ name: "profile-company" });
          }
        });
      } else {
        // Jika bukan error 404, jalankan logika error umum yang sudah ada
        error.value = err.response?.data?.message || err.message || "Kesalahan membuat pekerjaan.";
        Swal.fire("Gagal!", error.value, "error");

        // Cek untuk error 401 (Unauthorized) untuk logout
        if (err.response && err.response.status === 401) {
          authStore.logout();
          router.push("/login-company");
        }
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Mengambil detail satu pekerjaan berdasarkan ID.
   * @param {string|number} id ID pekerjaan.
   */
  async function fetchJobDetail(id) {
    isLoading.value = true;
    error.value = null;
    jobDetail.value = null;
    try {
      const token = authStore.tokenCompany;
      if (!token) throw new Error("Token otentikasi tidak ditemukan.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await apiClient.get(`/jobs/${id}`, config);

      if (response.status === 200 && response.data.status === "success") {
        jobDetail.value = response.data.data;
      } else {
        throw new Error(response.data.message || "Gagal mengambil detail pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Kesalahan mengambil detail.";
      if (err.response && err.response.status === 404) {
        error.value = `Pekerjaan dengan ID ${id} tidak ditemukan.`;
      }
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push("/login-company");
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Memperbarui posting pekerjaan.
   * @param {string|number} id ID pekerjaan.
   * @param {Object} jobData Data pekerjaan yang akan diupdate.
   */
  async function updateJobPost(id, jobData) {
    isLoading.value = true;
    error.value = null;
    try {
      const token = authStore.tokenCompany;
      if (!token) throw new Error("Token otentikasi tidak ditemukan.");
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        ...jobData,
        salary_min: String(jobData.salary_min),
        salary_max: String(jobData.salary_max),
      };
      
      const response = await apiClient.put(`/jobs/${id}`, payload, config);

      if (response.status === 200 || response.status === 201) { // Menerima 200 OK atau 201 Created
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Job Updating Successfully",
          showConfirmButton: false,
          timer: 3000,
        });
        if (response.data.data && response.data.data.id) {
          const index = allCompanyJobs.value.findIndex((job) => job.id === response.data.data.id);
          if (index !== -1) {
            allCompanyJobs.value[index] = { ...allCompanyJobs.value[index], ...response.data.data };
          }
          if (jobDetail.value && jobDetail.value.id === response.data.data.id) {
            jobDetail.value = response.data.data;
          }
        } else {
          await fetchAllCompanyJobsOnce();
        }
        return true;
      } else {
        throw new Error(response.data.message || "Gagal memperbarui posting pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Kesalahan memperbarui pekerjaan.";
      Swal.fire("Gagal!", error.value, "error");
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push("/login-company");
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fungsi helper untuk mengubah status pekerjaan (aktif/nonaktif).
   */
  async function changeJobStatus(id, statusEndpoint, newStatus, actionText) {
    isLoading.value = true;
    error.value = null;
    try {
      const token = authStore.tokenCompany;
      if (!token) throw new Error("Token otentikasi tidak ditemukan.");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await apiClient.put(`/jobs/${id}/${statusEndpoint}`, {}, config);

      if (response.status === 200 && response.data.status === "success") {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Pekerjaan Berhasil Di${actionText}`,
          showConfirmButton: false,
          timer: 3000,
        });

        const index = allCompanyJobs.value.findIndex((job) => job.id === id);
        if (index !== -1) {
          allCompanyJobs.value[index].is_active = newStatus === "active";
        }
        if (jobDetail.value && jobDetail.value.id === id) {
          jobDetail.value.is_active = newStatus === "active";
        }
      } else {
        throw new Error(response.data.message || `Gagal ${actionText} pekerjaan.`);
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || `Kesalahan saat ${actionText} pekerjaan.`;
      Swal.fire("Gagal!", error.value, "error");

      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push("/login-company");
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function deactivateJob(id) {
    await changeJobStatus(id, "status-deactive", "deactive", "nonaktifkan");
  }

  async function activateJob(id) {
    await changeJobStatus(id, "status-active", "active", "aktifkan");
  }

  /**
   * Menghapus posting pekerjaan.
   * @param {string|number} id ID pekerjaan yang akan dihapus.
   */
  async function deleteJobPost(id) {
    isLoading.value = true;
    error.value = null;
    try {
      const token = authStore.tokenCompany;
      if (!token) throw new Error("Token otentikasi tidak ditemukan.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await apiClient.delete(`/jobs/${id}`, config);

      if (response.status === 200 && response.data.status === "success") {
        Swal.fire("Berhasil!", "Pekerjaan berhasil dihapus.", "success");
        allCompanyJobs.value = allCompanyJobs.value.filter((job) => job.id !== id);
        if (jobDetail.value && jobDetail.value.id === id) {
          jobDetail.value = null;
          router.push("/job-list");
        }
      } else {
        throw new Error(response.data.message || "Gagal menghapus pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Kesalahan menghapus pekerjaan.";
      Swal.fire("Gagal!", error.value, "error");
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push("/login-company");
      }
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    allCompanyJobs,
    jobDetail,
    fetchAllCompanyJobsOnce,
    createJobPost,
    fetchJobDetail,
    updateJobPost,
    deactivateJob,
    activateJob,
    deleteJobPost,
  };
});
