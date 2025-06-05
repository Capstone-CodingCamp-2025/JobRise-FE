import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from '@/config/axios'; // Pastikan path ini sesuai dengan proyek Anda
import Swal from 'sweetalert2'; // Opsional: untuk notifikasi error

/**
 * Store untuk mengelola data pekerjaan yang dapat diakses publik (tanpa otentikasi).
 */
export const useJobStore = defineStore('jobs', () => {

  // =================================================================
  // STATE
  // Properti reaktif untuk menyimpan data, status loading, dan error.
  // =================================================================
  
  /**
   * @type {import('vue').Ref<Array<Object>>}
   * Menyimpan daftar pekerjaan "featured" yang aktif.
   */
  const featuredJobs = ref([]);
  
  /**
   * @type {import('vue').Ref<boolean>}
   * Menandakan apakah sedang dalam proses mengambil data dari API.
   */
  const isLoadingFeatured = ref(false);
  
  /**
   * @type {import('vue').Ref<Error|null>}
   * Menyimpan objek error jika terjadi kegagalan saat fetch data.
   */
  const errorFeatured = ref(null);


  // =================================================================
  // ACTIONS
  // Fungsi untuk berinteraksi dengan API dan mengubah state.
  // =================================================================

  /**
   * Mengambil daftar pekerjaan "featured" dari endpoint /jobs-featured.
   */
  async function fetchFeaturedJobs() {
    // 1. Set state awal sebelum memanggil API
    isLoadingFeatured.value = true;
    errorFeatured.value = null;

    try {
      // 2. Lakukan panggilan API menggunakan GET ke endpoint
      const response = await apiClient.get('/jobs-featured');

      // 3. Proses respons jika berhasil
      // Pengecekan `response.data.data` memastikan data yang diterima adalah array
      if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
        featuredJobs.value = response.data.data;
      } else {
        // Jika format respons tidak sesuai, kosongkan data
        featuredJobs.value = [];
        console.warn('Unexpected response format for featured jobs:', response.data);
      }

    } catch (error) {
      // 4. Tangani jika terjadi error saat panggilan API
      const errorMessage = error.response?.data?.message || 'Gagal memuat data pekerjaan.';
      errorFeatured.value = error; // Simpan objek error lengkap
      featuredJobs.value = []; // Kosongkan data jika terjadi error

      // Tampilkan notifikasi error ke pengguna (opsional)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: errorMessage,
        showConfirmButton: false,
        timer: 3000,
      });

      console.error('Error fetching featured jobs:', error);
    } finally {
      // 5. Pastikan status loading selalu kembali ke false setelah selesai
      isLoadingFeatured.value = false;
    }
  }

  // =================================================================
  // RETURN
  // Mengekspos state dan actions agar bisa digunakan di komponen.
  // =================================================================
  return {
    featuredJobs,
    isLoadingFeatured,
    errorFeatured,
    fetchFeaturedJobs,
  };
});