// src/stores/education.js

import { defineStore } from "pinia";
import { apiClient } from "@/config/axios";
import { ref } from "vue";
import Swal from "sweetalert2";
// import { AuthUserStorage } from './auth'; // Opsional: jika Anda ingin mengakses token dari store auth

export const useEducationStore = defineStore("education", () => {
  const educations = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const getToken = () => {
    // Cara 1: Ambil langsung dari localStorage (paling sederhana)
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;

    // Cara 2 (lebih disarankan jika AuthUserStorage selalu tersedia):
    // const authStore = AuthUserStorage();
    // return authStore.tokenUser;
  };

  /**
   * Mengambil semua data pendidikan untuk pengguna yang sedang login.
   * @returns {Array} Daftar objek pendidikan.
   */
  const fetchEducations = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error(
          "Token autentikasi tidak ditemukan. Harap login kembali."
        );
      }

      const response = await apiClient.get("/cv/education", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      educations.value = response.data.data;
      return educations.value;
    } catch (err) {
      console.error("Gagal mengambil data pendidikan:", err);
      error.value =
        err.response?.data?.message || "Gagal mengambil data pendidikan.";
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
   * Membuat entri pendidikan baru.
   * @param {Object} educationData - Data pendidikan yang akan dibuat.
   * @returns {Object} Objek pendidikan yang baru dibuat.
   */
  const createEducation = async (educationData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error(
          "Token autentikasi tidak ditemukan. Harap login kembali."
        );
      }

      const response = await apiClient.post("/cv/education", educationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      educations.value.push(response.data.data);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Pendidikan berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 3000,
      });
      return response.data.data;
    } catch (err) {
      console.error("Gagal membuat pendidikan:", err);
      error.value =
        err.response?.data?.message || "Gagal menambahkan pendidikan.";
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
   * Memperbarui entri pendidikan yang sudah ada.
   * @param {number} id - ID pendidikan yang akan diperbarui.
   * @param {Object} updatedData - Data pendidikan yang diperbarui.
   * @returns {Object} Objek pendidikan yang diperbarui.
   */
  const updateEducation = async (id, updatedData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error(
          "Token autentikasi tidak ditemukan. Harap login kembali."
        );
      }

      const response = await apiClient.put(`/cv/education/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const index = educations.value.findIndex((edu) => edu.id === id);
      if (index !== -1) {
        educations.value[index] = response.data.data;
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Pendidikan berhasil diperbarui!",
        showConfirmButton: false,
        timer: 3000,
      });
      return response.data.data;
    } catch (err) {
      console.error("Gagal memperbarui pendidikan:", err);
      error.value =
        err.response?.data?.message || "Gagal memperbarui pendidikan.";
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
   * Menghapus entri pendidikan.
   * @param {number} id - ID pendidikan yang akan dihapus.
   */
  const deleteEducation = async (id) => {
    // Tampilkan SweetAlert2 untuk konfirmasi
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel" // Ubah teks ini jika Anda mau, "Cancel" lebih standar
    });

    // Jika pengguna menekan "Yes, delete it!"
    if (result.isConfirmed) {
      isLoading.value = true;
      error.value = null; // Bersihkan error sebelumnya
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
        }

        await apiClient.delete(`/cv/education/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Hapus item dari state 'educations' setelah berhasil dihapus di backend
        educations.value = educations.value.filter((edu) => edu.id !== id);

        // Tampilkan SweetAlert2 sukses
        Swal.fire({
          title: "Deleted!",
          text: "Your education entry has been deleted.", // Pesan yang lebih spesifik
          icon: "success",
          timer: 2000, // Durasi notifikasi
          showConfirmButton: false // Tidak perlu tombol "OK" jika ada timer
        });

        return true; // Menandakan operasi berhasil
      } catch (err) {
        console.error("Gagal menghapus pendidikan:", err);
        error.value = err.response?.data?.message || "Failed to delete education.";

        // Tampilkan SweetAlert2 error
        Swal.fire({
          title: "Error!",
          text: error.value,
          icon: "error",
          timer: 3000, // Durasi notifikasi
          showConfirmButton: false
        });
        throw err; // Lempar error untuk penanganan lebih lanjut jika diperlukan
      } finally {
        isLoading.value = false; // Pastikan loading dinonaktifkan
      }
    }
    // Jika pengguna menekan "Cancel" pada SweetAlert konfirmasi awal
    return false; // Menandakan operasi dibatalkan oleh pengguna
  };

  return {
    educations,
    isLoading,
    error,
    fetchEducations,
    createEducation,
    updateEducation,
    deleteEducation, // Pastikan ini diekspor
  };
});
