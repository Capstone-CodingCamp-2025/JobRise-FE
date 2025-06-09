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
  const totalApplicantCompnay = ref(0);
  const jobDetail = ref(null);
  const authStore = useAuthCompanyStore();

  // count all applicant
  async function fetchTotalApplications() {
    let totalApplications = 0;
    const token = authStore.tokenCompany;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: 1,
        limit: 25,
      },
    };

    try {
      // Ambil halaman pertama untuk mendapatkan data dan total halaman
      const firstResponse = await apiClient.get("/jobs", config);
      const { jobs, totalPages } = firstResponse.data.data;

      // Jumlahkan total_apply pada halaman pertama
      totalApplications += jobs.reduce((sum, job) => sum + job.total_apply, 0);

      // Jika ada lebih dari 1 halaman, lakukan loop untuk mengambil tiap halaman
      for (let page = 2; page <= totalPages; page++) {
        config.params.page = page;
        const response = await apiClient.get(`/jobs`, { config });
        const { jobs } = response.data.data;

        // Akumulasikan total_apply dari setiap job di halaman tersebut
        totalApplications += jobs.reduce(
          (sum, job) => sum + job.total_apply,
          0
        );
      }

      console.log("Count Applications:", totalApplications);
      totalApplicantCompnay.value = totalApplications;
    } catch (error) {
      console.error("An Error Occured When Retrieving Jobs Data", error);
    }
  }

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
        throw new Error(
          "Authentication token not found. Please login again."
        );
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
          } else if (
            response.data.data &&
            Array.isArray(response.data.data.jobs)
          ) {
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
            throw new Error("The format of job data from the server does not match.");
          }

          if (fetchedData && fetchedData.length > 0) {
            allFetchedJobs.push(...fetchedData);
          }

          if (hasMorePages) {
            currentPage++;
          }
        } else {
          throw new Error(
            response.data.message ||
              `failed To Retrieve Page ${currentPage} Jobs.`
          );
        }
      }

      allCompanyJobs.value = allFetchedJobs;
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Unknow Error Occurred";
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
      if (!token) throw new Error("Token Otentification Not Found.");
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
          title: "Success Created Job",
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
        throw new Error(
          response.data.message || "Failed Create Job"
        );
      }
    } catch (err) {
      // Cek secara spesifik untuk error 'Profil Belum Lengkap' (status 404)
      if (err.response && err.response.status === 404) {
        error.value =
          "You Must First Complete A Company Profile";
        Swal.fire({
          icon: "warning",
          title: "Incomplete Profile",
          text: "You must complete a company profile to be able to post jobs.",
          confirmButtonText: "Complete Profile",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push({ name: "profile-company" });
          }
        });
      } else {
        // Jika bukan error 404, jalankan logika error umum yang sudah ada
        error.value =
          err.response?.data?.message ||
          err.message ||
          "Mistake Make Work";
        Swal.fire("Failed!", error.value, "error");

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
      if (!token) throw new Error("Token Otentification Not Found.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await apiClient.get(`/jobs/${id}`, config);

      if (response.status === 200 && response.data.status === "success") {
        jobDetail.value = response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed To Take Work Details."
        );
      }
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Mistake Taking Details";
      if (err.response && err.response.status === 404) {
        error.value = `Job With ID ${id} Not Found.`;
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
  // Di dalam file store Pinia Anda (misalnya: companyjob.js)

  // Di dalam file store Pinia Anda (misalnya: companyjob.js)

async function updateJobPost(id, jobData) {
  isLoading.value = true;
  error.value = null;

  try {
    const token = authStore.tokenCompany;
    if (!token) {
      throw new Error("Authentication Token Not Found.");
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // LANGKAH 1: Simpan status asli sebelum kita melakukan apa pun.
    // jobData dari komponen sudah berisi status yang benar.
    const originalStatus = jobData.is_active; 
    console.log(`Status asli pekerjaan adalah: '${originalStatus}'`);

    // LANGKAH 2: Siapkan payload HANYA untuk update konten.
    // Kita tetap tidak mengirim 'is_active' di sini untuk menghindari konflik.
    const contentPayload = {
      title: jobData.title,
      description: jobData.description,
      salary_min: String(jobData.salary_min),
      salary_max: String(jobData.salary_max),
      location: jobData.location,
      job_type: jobData.job_type,
    };

    // LANGKAH 3: Lakukan update konten. 
    // Pada titik ini, backend akan memperbarui konten DAN me-reset status ke 'active'.
    console.log("Mengirim pembaruan konten...", contentPayload);
    await apiClient.put(`/jobs/${id}`, contentPayload, config);
    console.log("Pembaruan konten berhasil. Status di server mungkin sekarang 'active'.");

    // LANGKAH 4 (WORKAROUND): "Perbaiki" statusnya kembali ke nilai asli.
    // Jika status aslinya 'deactive', kita panggil endpoint deactive.
    if (originalStatus === 'deactive') {
      console.log("Status asli adalah 'deactive', mengirim perintah untuk menonaktifkan kembali...");
      // Panggil endpoint yang sudah ada untuk menonaktifkan.
      await apiClient.put(`/jobs/${id}/status-deactive`, {}, config);
      console.log("Status berhasil dikembalikan ke 'deactive'.");
    } 
    // Jika status aslinya 'active', kita tidak perlu melakukan apa-apa,
    // karena backend sudah me-resetnya ke 'active'.

    // Proses berhasil, tampilkan notifikasi dan navigasi.
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Job updated successfully!",
      showConfirmButton: false,
      timer: 2000,
    });
    
    // Navigasi ke halaman detail
    router.push({ name: 'job-detail', params: { id: id } });

    // Muat ulang data di background
    await fetchAllCompanyJobsOnce();

    return true;

  } catch (err) {
    // ... (error handling tidak berubah)
    error.value = err.response?.data?.message || err.message || "An error occurred during the update process.";
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: error.value,
    });
    if (err.response && err.response.status === 401) {
      authStore.logout();
      router.push("/login-company");
    }
    return false;

  } finally {
    isLoading.value = false;
  }
}

 
  async function changeJobStatus(id, statusEndpoint, newStatus, actionText) {
    isLoading.value = true;
    error.value = null;
    try {
      const token = authStore.tokenCompany;
      if (!token) throw new Error("Token Otentification Not Found.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      const response = await apiClient.put(
        `/jobs/${id}/${statusEndpoint}`,
        {},
        config
      );
  
      if (response.status === 200 && response.data.status === "success") {
        
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Job Successfully ${actionText}`,
          showConfirmButton: false,
          timer: 3000,
        });
  
        const index = allCompanyJobs.value.findIndex((job) => job.id === id);
        if (index !== -1) {
          allCompanyJobs.value[index].is_active = newStatus; // Simpan string "active" atau "deactive"
        }
        if (jobDetail.value && jobDetail.value.id === id) {
          jobDetail.value.is_active = newStatus; // Simpan string "active" atau "deactive"
        }
      } else {
        throw new Error(
          response.data.message || `failed ${actionText} job.`
        );
      }
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        `Failed ${actionText} Job.`;
      Swal.fire("Faild!", error.value, "error");
  
      if (err.response && err.response.status === 401) {
        authStore.logout();
        router.push("/login-company");
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function deactivateJob(id) {
    await changeJobStatus(id, "status-deactive", "deactive", "Deactivated");
  }

  async function activateJob(id) {
    await changeJobStatus(id, "status-active", "active", "Activated");
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
      if (!token) throw new Error("Token Otentification Not Found.");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await apiClient.delete(`/jobs/${id}`, config);

      if (response.status === 200 && response.data.status === "success") {
        Swal.fire("Success!", "Job Deleted Successfully.", "success");
        allCompanyJobs.value = allCompanyJobs.value.filter(
          (job) => job.id !== id
        );
        if (jobDetail.value && jobDetail.value.id === id) {
          jobDetail.value = null;
          router.push("/job-list");
        }
      } else {
        throw new Error(response.data.message || "Failed Deleted Job.");
      }
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Mistake Delete Job.";
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
    totalApplicantCompnay,
    fetchAllCompanyJobsOnce,
    createJobPost,
    fetchJobDetail,
    updateJobPost,
    deactivateJob,
    activateJob,
    deleteJobPost,
    fetchTotalApplications,
  };
});
