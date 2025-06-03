import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import router from "@/router";
import { useAuthCompanyStore } from "../auth/companyAuth";

export const JobsCompany = defineStore("jobs", () => {
  // State untuk melacak status loading dan error
  const isLoading = ref(false);
  const error = ref(null);

  // State untuk menyimpan data pekerjaan perusahaan yang diambil
  const companyJobs = ref([]);
  const totalCompanyJobs = ref(0);
  const totalCompanyPages = ref(1);
  const currentCompanyPage = ref(1);

  // State untuk menyimpan detail pekerjaan berdasarkan ID
  const jobDetail = ref(null);

  // State untuk menandakan jika daftar pekerjaan kosong
  const isJobsEmpty = ref(false);

  // Dapatkan instance dari store otentikasi
  const authStore = useAuthCompanyStore();

  /**
   * Fungsi untuk membuat posting pekerjaan baru.
   * @param {Object} jobData - Objek yang berisi data posting pekerjaan.
   * @param {string} jobData.title - Judul pekerjaan.
   * @param {string} jobData.description - Deskripsi pekerjaan.
   * @param {string} jobData.salary_min - Gaji minimum.
   * @param {string} jobData.salary_max - Gaji maksimum.
   * @param {string} jobData.location - Lokasi pekerjaan.
   * @param {string} jobData.job_type - Tipe pekerjaan (misalnya, Full-Time, Part-Time).
   */
  async function createJobPost(jobData) {
    isLoading.value = true; // Set loading menjadi true saat memulai permintaan
    error.value = null; // Reset error sebelumnya

    try {
      // --- PENANGANAN TOKEN OTENTIKASI ---
      // Ambil token dari store useAuthCompanyStore
      const token = authStore.tokenCompany;
      if (!token) {
        throw new Error("Token otentikasi tidak ditemukan. Harap login kembali.");
      }
      // Set header Authorization untuk permintaan ini
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // --- PERHATIAN: UBAH PATH API SESUAI BASEURL ANDA ---
      // Jika apiClient.baseURL sudah 'http://localhost:3000/api', gunakan '/jobs'
      // Jika apiClient.baseURL hanya 'http://localhost:3000', gunakan '/api/jobs'
      const response = await apiClient.post('/jobs', jobData, config); // CONTOH: Menggunakan '/jobs'

      // Periksa apakah respons berhasil
      if (response.status === 201 && response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Posting pekerjaan berhasil dibuat.",
          showConfirmButton: false,
          timer: 1500
        });
        // Opsional: Redirect ke halaman daftar pekerjaan perusahaan atau detail pekerjaan yang baru dibuat
        router.push('/job-list'); // Sesuaikan rute ini jika perlu
      } else {
        // Tangani kasus di mana status bukan 201 atau status di data bukan 'success'
        throw new Error(response.data.message || "Gagal membuat posting pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Terjadi kesalahan yang tidak diketahui.";
      console.error("Error creating job post:", err);

      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.value,
      });

      // Jika error adalah Unauthorized (misalnya 401), mungkin perlu redirect ke halaman login dan logout
      if (err.response && err.response.status === 401) {
        authStore.logout(); // Panggil fungsi logout dari store otentikasi
        router.push('/login-company'); // Sesuaikan rute login company Anda
      }

    } finally {
      isLoading.value = false; // Set loading menjadi false setelah permintaan selesai
    }
  }

  /**
   * Fungsi untuk mengambil daftar pekerjaan yang diposting oleh perusahaan yang sedang login.
   * @param {number} page - Nomor halaman yang ingin diambil (default: 1).
   * @param {number} limit - Jumlah pekerjaan per halaman (default: 10).
   */
  async function fetchCompanyJobs(page = 1, limit = 10) {
    isLoading.value = true;
    error.value = null;
    companyJobs.value = []; // Bersihkan data sebelumnya
    isJobsEmpty.value = false; // Reset status kekosongan

    try {
      const token = authStore.tokenCompany;
      if (!token) {
        throw new Error("Token otentikasi tidak ditemukan. Harap login kembali.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { // Parameter query untuk pagination
          page,
          limit
        }
      };

      // URL: /api/jobs (sesuai dengan backend Anda)
      // Ingat untuk menyesuaikan path jika apiClient.baseURL sudah menyertakan '/api'
      const response = await apiClient.get('/jobs', config); // Menggunakan '/api/jobs' sesuai rute backend

      if (response.status === 200 && response.data.status === "success") {
        const data = response.data.data;
        companyJobs.value = data.jobs;
        totalCompanyJobs.value = data.totalJobs;
        totalCompanyPages.value = data.totalPages;
        currentCompanyPage.value = data.currentPage;
        isJobsEmpty.value = data.totalJobs === 0;
      } else {
        throw new Error(response.data.message || "Gagal mengambil daftar pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Terjadi kesalahan saat mengambil pekerjaan.";
      console.error("Error fetching company jobs:", err);

      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
      // Khusus untuk 404 (No jobs found), set state isJobsEmpty menjadi true dan array menjadi kosong
      if (err.response && err.response.status === 404) {
        companyJobs.value = [];
        totalCompanyJobs.value = 0;
        totalCompanyPages.value = 1;
        currentCompanyPage.value = 1;
        isJobsEmpty.value = true;
        error.value = null; // Reset error karena ini adalah kondisi yang diharapkan
      }

    } finally {
      isLoading.value = false;
    }
  }



  /**
   * Fungsi untuk mengambil detail pekerjaan berdasarkan ID.
   * @param {number} id - ID pekerjaan yang ingin diambil detailnya.
   */
  async function fetchJobDetail(id) {
    isLoading.value = true;
    error.value = null;
    jobDetail.value = null;

    try {
      const token = authStore.tokenCompany;
      if (!token) {
        throw new Error("Token otentikasi tidak ditemukan. Harap login kembali.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await apiClient.get(`/jobs/${id}`, config);

      if (response.status === 200 && response.data.status === "success") {
        jobDetail.value = response.data.data;
      } else if (response.status === 404) {
        error.value = `Pekerjaan dengan ID ${id} tidak ditemukan.`;
      } else {
        throw new Error(response.data.message || "Gagal mengambil detail pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Terjadi kesalahan saat mengambil detail pekerjaan.";
      console.error(`Error fetching job detail for ID ${id}:`, err);

      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fungsi untuk menonaktifkan status pekerjaan berdasarkan ID.
   * @param {number}
   * * id - ID pekerjaan yang ingin dinonaktifkan.
   */
  async function deactivateJob(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const token = authStore.tokenCompany;
      if (!token) {
        throw new Error("Token otentikasi tidak ditemukan. Harap login kembali.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await apiClient.put(`/jobs/${id}/status-deactive`, {}, config);

      if (response.status === 200 && response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        // Perbarui status pekerjaan di companyJobs jika ada
        const index = companyJobs.value.findIndex((job) => job.id === id);
        if (index !== -1) {
          companyJobs.value[index].is_active = "deactive";
        }
        if (jobDetail.value && jobDetail.value.id === id) {
          jobDetail.value.is_active = "deactive";
        }
      } else if (response.status === 404) {
        error.value = response.data.message;
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.value,
        });
      } else {
        throw new Error(response.data.message || "Gagal menonaktifkan pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Terjadi kesalahan saat menonaktifkan pekerjaan.";
      console.error(`Error deactivating job with ID ${id}:`, err);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.value,
      });
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fungsi untuk mengaktifkan status pekerjaan berdasarkan ID.
   * @param {number} id - ID pekerjaan yang ingin diaktifkan.
   */
  async function activateJob(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const token = authStore.tokenCompany;
      if (!token) {
        throw new Error("Token otentikasi tidak ditemukan. Harap login kembali.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await apiClient.put(`/jobs/${id}/status-active`, {}, config);

      if (response.status === 200 && response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        // Perbarui status pekerjaan di companyJobs jika ada
        const index = companyJobs.value.findIndex((job) => job.id === id);
        if (index !== -1) {
          companyJobs.value[index].is_active = "active";
        }
        if (jobDetail.value && jobDetail.value.id === id) {
          jobDetail.value.is_active = "active";
        }
      } else if (response.status === 404) {
        error.value = response.data.message;
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.value,
        });
      } else {
        throw new Error(response.data.message || "Gagal mengaktifkan pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Terjadi kesalahan saat mengaktifkan pekerjaan.";
      console.error(`Error activating job with ID ${id}:`, err);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.value,
      });
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
    } finally {
      isLoading.value = false;
    }
  }
  async function updateJobPost(id, jobData) {
    isLoading.value = true;
    error.value = null;

    try {
      const token = authStore.tokenCompany;
      if (!token) {
        throw new Error("Token otentikasi tidak ditemukan. Harap login kembali.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await apiClient.put(`/jobs/${id}`, jobData, config);

      if (response.status === 201 && response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Posting pekerjaan berhasil diperbarui.",
          showConfirmButton: false,
          timer: 1500
        });
        // Perbarui jobDetail di store jika pekerjaan yang diupdate adalah yang sedang dilihat
        if (jobDetail.value && jobDetail.value.id === id) {
          jobDetail.value = response.data.data;
        }
        // Opsional: Perbarui juga di companyJobs jika pekerjaan ada di daftar
        const index = companyJobs.value.findIndex(job => job.id === id);
        if (index !== -1) {
          companyJobs.value[index] = { ...companyJobs.value[index], ...response.data.data };
        }
        router.push({ name: 'job-detail', params: { id: id } }); // Redirect ke detail pekerjaan yang diperbarui
      } else if (response.status === 404) {
        error.value = response.data.message;
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.value,
        });
      } else if (response.status === 400) { // Menangani error "Harus di update oleh company yang sama"
        error.value = response.data.message;
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.value,
        });
      } else {
        throw new Error(response.data.message || "Gagal memperbarui posting pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Terjadi kesalahan saat memperbarui posting pekerjaan.";
      console.error(`Error updating job post with ID ${id}:`, err);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.value,
      });
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    companyJobs,
    totalCompanyJobs,
    totalCompanyPages,
    currentCompanyPage,
    jobDetail,
    isJobsEmpty, // Tambahkan isJobsEmpty ke return
    createJobPost,
    fetchCompanyJobs,
    fetchJobDetail,
    deactivateJob, // Tambahkan fungsi deactivateJob
    activateJob, // Tambahkan fungsi activateJob
    updateJobPost,
  };
});