// File: src/stores/jobs/companyjob.js (atau path yang sesuai)

import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import router from "@/router"; // Pastikan router diimpor jika digunakan untuk navigasi
import { useAuthCompanyStore } from "../auth/companyAuth";

export const JobsCompany = defineStore("jobs", () => {
  // State untuk melacak status loading dan error
  const isLoading = ref(false);
  const error = ref(null);

  // State untuk menyimpan SEMUA data pekerjaan perusahaan yang diambil SEKALI
  const allCompanyJobs = ref([]);

  // State untuk menyimpan detail pekerjaan berdasarkan ID
  const jobDetail = ref(null);

  // Dapatkan instance dari store otentikasi
  const authStore = useAuthCompanyStore();

  /**
   * Fungsi untuk mengambil SEMUA posting pekerjaan perusahaan SEKALI.
   * Mengasumsikan backend dapat mengirim semua data, atau Anda perlu
   * menyesuaikan logika pengambilan data jika backend memberlakukan paginasi.
   */
  async function fetchAllCompanyJobsOnce() {
    isLoading.value = true;
    error.value = null;
    let allFetchedJobs = []; // Temporary array to accumulate jobs
    let currentPage = 1;
    let hasMorePages = true;
    const BATCH_SIZE = 10; // Sesuai dengan limit server Anda
  
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
            limit: BATCH_SIZE
          }
        };
  
        console.log(`Fetching page ${currentPage}...`); // Untuk debugging
        const response = await apiClient.get('/jobs', config);
  
        if (response.status === 200 && response.data.status === "success") {
          let fetchedData;
          // Sesuaikan cara Anda mengakses array pekerjaan dan info paginasi
          if (Array.isArray(response.data.data)) { // Jika data langsung array
              fetchedData = response.data.data;
              // Anda perlu cara untuk tahu apakah ini halaman terakhir dari backend
              // Misalnya, jika fetchedData.length < BATCH_SIZE, atau ada field totalPages
              if (!response.data.meta || !response.data.meta.totalPages) {
                   console.warn("Backend response doesn't include totalPages. Assuming last page if less than batch size.");
                   if (fetchedData.length < BATCH_SIZE) {
                      hasMorePages = false;
                   }
              } else {
                  if (currentPage >= response.data.meta.totalPages) {
                      hasMorePages = false;
                  }
              }
  
          } else if (response.data.data && Array.isArray(response.data.data.jobs)) { // Jika data dalam struktur { data: { jobs: [], ... }}
            fetchedData = response.data.data.jobs;
            allFetchedJobs = allFetchedJobs.concat(fetchedData);
  
            // Cek info paginasi dari backend
            const paginationInfo = response.data.data; // atau response.data.pagination, dll.
            if (paginationInfo.currentPage && paginationInfo.totalPages) {
              if (paginationInfo.currentPage >= paginationInfo.totalPages) {
                hasMorePages = false;
              }
            } else if (fetchedData.length < BATCH_SIZE) {
              // Jika tidak ada info totalPages, asumsikan halaman terakhir jika data yang diterima < limit
              hasMorePages = false;
            } else {
              // Jika tidak ada cara pasti untuk tahu, ini bisa jadi loop tak terbatas jika halaman terakhir pas berisi BATCH_SIZE item.
              // Perlu penanganan lebih cermat atau info dari backend.
              console.warn("Tidak dapat menentukan apakah ada halaman berikutnya dari respons API.");
              // Untuk mencegah loop tak terbatas, tambahkan batas maksimal halaman jika perlu
              // if (currentPage > 50) hasMorePages = false; // Contoh batas aman
            }
          } else {
            console.error("Struktur data pekerjaan tidak terduga di halaman:", currentPage, response.data);
            hasMorePages = false; // Hentikan jika format tidak dikenal
            throw new Error("Format data pekerjaan dari server tidak sesuai saat mengambil halaman " + currentPage);
          }
          
          if (fetchedData && fetchedData.length > 0) {
              allFetchedJobs.push(...fetchedData); // Gabungkan hasil
          }
  
  
          if (hasMorePages) {
            currentPage++;
          }
        } else {
          throw new Error(response.data.message || `Gagal mengambil halaman ${currentPage} pekerjaan.`);
        }
      } // Akhir while loop
  
      allCompanyJobs.value = allFetchedJobs; // Set state utama setelah semua data terkumpul
      if (allFetchedJobs.length === 0) {
          console.warn("Tidak ada pekerjaan yang berhasil diambil setelah mencoba semua halaman.");
      }
  
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Terjadi kesalahan yang tidak diketahui.";
      console.error("Error fetching all company jobs:", err);
      allCompanyJobs.value = []; // Pastikan data kosong jika gagal
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fungsi untuk membuat posting pekerjaan baru.
   * @param {Object} jobData - Objek yang berisi data posting pekerjaan.
   */
  async function createJobPost(jobData) {
    isLoading.value = true;
    error.value = null;

    try {
      const token = authStore.tokenCompany;
      if (!token) throw new Error("Token otentikasi tidak ditemukan.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await apiClient.post('/jobs', jobData, config);

      if (response.status === 201 && response.data.status === "success") {
        Swal.fire("Berhasil!", "Posting pekerjaan berhasil dibuat.", "success");
        // Optimal: tambahkan pekerjaan baru ke allCompanyJobs jika API mengembalikannya
        if (response.data.data && response.data.data.id) {
            allCompanyJobs.value.unshift(response.data.data); // Tambah di awal array
        } else {
            await fetchAllCompanyJobsOnce(); // Fallback: ambil semua data lagi
        }
        router.push('/job-list');
      } else {
        throw new Error(response.data.message || "Gagal membuat posting pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Kesalahan membuat pekerjaan.";
      Swal.fire("Gagal!", error.value, "error");
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fungsi untuk mengambil detail pekerjaan berdasarkan ID.
   * @param {string|number} id - ID pekerjaan.
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
   * Fungsi untuk memperbarui posting pekerjaan.
   * @param {string|number} id - ID pekerjaan.
   * @param {Object} jobData - Data pekerjaan yang akan diupdate.
   */
  async function updateJobPost(id, jobData) {
    isLoading.value = true;
    error.value = null;
    try {
      const token = authStore.tokenCompany;
      if (!token) throw new Error("Token otentikasi tidak ditemukan.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await apiClient.put(`/jobs/${id}`, jobData, config);

      if (response.status === 200 && response.data.status === "success") { // Biasanya update 200 OK
        Swal.fire("Berhasil!", "Posting pekerjaan berhasil diperbarui.", "success");
        // Optimal: update pekerjaan di allCompanyJobs jika API mengembalikannya
        if (response.data.data && response.data.data.id) {
            const index = allCompanyJobs.value.findIndex(job => job.id === response.data.data.id);
            if (index !== -1) {
                allCompanyJobs.value[index] = { ...allCompanyJobs.value[index], ...response.data.data };
            } else {
                await fetchAllCompanyJobsOnce(); // Fallback jika tidak ketemu (seharusnya tidak terjadi)
            }
            // Update jobDetail juga jika sedang dilihat
            if (jobDetail.value && jobDetail.value.id === response.data.data.id) {
                jobDetail.value = response.data.data;
            }
        } else {
            await fetchAllCompanyJobsOnce(); // Fallback
        }
        router.push({ name: 'job-detail', params: { id: id } });
      } else {
        throw new Error(response.data.message || "Gagal memperbarui posting pekerjaan.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Kesalahan memperbarui pekerjaan.";
      Swal.fire("Gagal!", error.value, "error");
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
    } finally {
      isLoading.value = false;
    }
  }


  /**
   * Fungsi untuk mengubah status pekerjaan (generik, bisa untuk activate/deactivate)
   * @param {string|number} id - ID pekerjaan.
   * @param {string} statusEndpoint - Bagian URL untuk status ('status-active' atau 'status-deactive').
   * @param {string} newStatus - Status baru ('active' atau 'deactive').
   * @param {string} actionText - Teks aksi untuk pesan (e.g., "mengaktifkan").
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
        Swal.fire("Berhasil!", response.data.message || `Pekerjaan berhasil di${actionText}.`, "success");
        const index = allCompanyJobs.value.findIndex((job) => job.id === id);
        if (index !== -1) {
          allCompanyJobs.value[index].is_active = newStatus;
        }
        if (jobDetail.value && jobDetail.value.id === id) {
          jobDetail.value.is_active = newStatus;
        }
      } else {
        throw new Error(response.data.message || `Gagal ${actionText} pekerjaan.`);
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || `Kesalahan saat ${actionText} pekerjaan.`;
      Swal.fire("Gagal!", error.value, "error");
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push('/login-company');
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function deactivateJob(id) {
    await changeJobStatus(id, 'status-deactive', 'deactive', 'nonaktifkan');
  }

  async function activateJob(id) {
    await changeJobStatus(id, 'status-active', 'active', 'aktifkan');
  }

  // Fungsi untuk menghapus pekerjaan (jika ada)
  async function deleteJobPost(id) {
    isLoading.value = true;
    error.value = null;
    try {
        const token = authStore.tokenCompany;
        if (!token) throw new Error("Token otentikasi tidak ditemukan.");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await apiClient.delete(`/jobs/${id}`, config); // Asumsi endpoint DELETE /jobs/:id

        if (response.status === 200 && response.data.status === "success") { // Atau 204 No Content
            Swal.fire("Berhasil!", "Pekerjaan berhasil dihapus.", "success");
            allCompanyJobs.value = allCompanyJobs.value.filter(job => job.id !== id);
            // Jika sedang di halaman detail pekerjaan yang dihapus, redirect atau bersihkan
            if (jobDetail.value && jobDetail.value.id === id) {
                jobDetail.value = null;
                router.push('/job-list'); // Atau halaman lain yang sesuai
            }
        } else {
            throw new Error(response.data.message || "Gagal menghapus pekerjaan.");
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || "Kesalahan menghapus pekerjaan.";
        Swal.fire("Gagal!", error.value, "error");
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
    allCompanyJobs, // Menyediakan semua pekerjaan untuk diolah di komponen
    jobDetail,

    fetchAllCompanyJobsOnce,
    createJobPost,
    fetchJobDetail,
    updateJobPost,
    deactivateJob,
    activateJob,
    deleteJobPost, // Tambahkan jika ada fungsi delete
  };
});