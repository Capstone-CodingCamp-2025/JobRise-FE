// src/stores/experience.js

import { defineStore } from 'pinia';
import { apiClient } from '@/config/axios';
import { ref } from 'vue';
import Swal from 'sweetalert2';

export const useExperienceStore = defineStore('experience', () => {
  const experiences = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Fungsi helper untuk mendapatkan token dari localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    // Pastikan token yang disimpan adalah string JSON, lalu parse
    return token ? JSON.parse(token) : null;
  };

  /**
   * Mengambil semua data pengalaman kerja untuk pengguna yang sedang login.
   * @returns {Array} Daftar objek pengalaman kerja.
   */
  const fetchExperiences = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const response = await apiClient.get('/cv/experience', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      experiences.value = response.data.data;
      return experiences.value;
    } catch (err) {
      console.error("Gagal mengambil data pengalaman kerja:", err);
      error.value = err.response?.data?.message || "Gagal mengambil data pengalaman kerja.";
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.value,
        showConfirmButton: false,
        timer: 3000,
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Membuat entri pengalaman kerja baru.
   * @param {Object} experienceData - Data pengalaman kerja yang akan dibuat.
   * @returns {Object} Objek pengalaman kerja yang baru dibuat.
   */
  const createExperience = async (experienceData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const response = await apiClient.post('/cv/experience', experienceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Tambahkan pengalaman baru ke state lokal setelah berhasil
      experiences.value.push(response.data.data);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Pengalaman kerja berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 3000,
      });

      return response.data.data;
    } catch (err) {
      console.error("Gagal membuat pengalaman kerja:", err);
      error.value = err.response?.data?.message || "Gagal menambahkan pengalaman kerja.";
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.value,
        showConfirmButton: false,
        timer: 3000,
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Memperbarui entri pengalaman kerja yang sudah ada.
   * @param {number} id - ID pengalaman kerja yang akan diperbarui.
   * @param {Object} updatedData - Data pengalaman kerja yang diperbarui.
   * @returns {Object} Objek pengalaman kerja yang diperbarui.
   */
  const updateExperience = async (id, updatedData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const response = await apiClient.put(`/cv/experience/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Perbarui item di state 'experiences' setelah berhasil diupdate di backend
      const index = experiences.value.findIndex(exp => exp.id === id);
      if (index !== -1) {
        experiences.value[index] = response.data.data; // Ganti objek lama dengan data yang diperbarui
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Pengalaman kerja berhasil diperbarui!",
        showConfirmButton: false,
        timer: 3000,
      });
      return response.data.data;
    } catch (err) {
      console.error("Gagal memperbarui pengalaman kerja:", err);
      error.value = err.response?.data?.message || "Gagal memperbarui pengalaman kerja.";
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.value,
        showConfirmButton: false,
        timer: 3000,
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Menghapus entri pengalaman kerja berdasarkan ID.
   * Akan menampilkan konfirmasi kepada pengguna sebelum menghapus.
   * @param {number} id - ID pengalaman kerja yang akan dihapus.
   */
  const deleteExperience = async (id) => {
    // Menampilkan dialog konfirmasi SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    // Jika pengguna mengonfirmasi (menekan "Yes, delete it!")
    if (result.isConfirmed) {
      isLoading.value = true;
      error.value = null;
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
        }

        await apiClient.delete(`/cv/experience/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Hapus pengalaman dari state 'experiences' setelah berhasil dihapus di backend
        experiences.value = experiences.value.filter(exp => exp.id !== id);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Pengalaman kerja berhasil dihapus!",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        console.error("Gagal menghapus pengalaman kerja:", err);
        error.value = err.response?.data?.message || "Gagal menghapus pengalaman kerja.";
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: error.value,
          showConfirmButton: false,
          timer: 3000,
        });
        throw err;
      } finally {
        isLoading.value = false;
      }
    }
    // Jika pengguna membatalkan, tidak ada tindakan yang diambil
  };

  return {
    experiences,
    isLoading,
    error,
    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  };
});