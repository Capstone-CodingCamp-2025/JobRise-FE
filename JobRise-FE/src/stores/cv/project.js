// src/stores/cv/project.js

import { defineStore } from 'pinia';
import { apiClient } from '@/config/axios';
import { ref } from 'vue';
import Swal from 'sweetalert2';

export const useProjectStore = defineStore('project', () => {
  const projects = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  };

  /**
   * Mengambil semua data proyek untuk pengguna yang sedang login.
   * @returns {Array} Daftar objek proyek.
   */
  const fetchProjects = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const response = await apiClient.get('/cv/project', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      projects.value = response.data.data;
      return projects.value;
    } catch (err) {
      console.error("Gagal mengambil data proyek:", err);
      error.value = err.response?.data?.message || "Gagal mengambil data proyek.";
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
   * Membuat entri proyek baru.
   * @param {Object} projectData - Data proyek yang akan dibuat.
   * @returns {Object} Objek proyek yang baru dibuat.
   */
  const createProject = async (projectData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const payload = {
        title: projectData.title,
        link_url: projectData.link,
        start_date: projectData.startDate ? new Date(projectData.startDate).toISOString() : null,
        end_date: projectData.endDate ? new Date(projectData.endDate).toISOString() : null,
        description: projectData.description,
      };

      const response = await apiClient.post('/cv/project', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      projects.value.push(response.data.data);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Proyek berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 3000,
      });

      return response.data.data;
    } catch (err) {
      console.error("Gagal membuat proyek:", err);
      error.value = err.response?.data?.message || "Gagal menambahkan proyek.";
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
   * Memperbarui entri proyek yang sudah ada.
   * @param {number} id - ID proyek yang akan diperbarui.
   * @param {Object} updatedData - Data proyek yang diperbarui.
   * @returns {Object} Objek proyek yang diperbarui.
   */
  const updateProject = async (id, updatedData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const payload = {
        title: updatedData.title,
        link_url: updatedData.link,
        start_date: updatedData.startDate ? new Date(updatedData.startDate).toISOString() : null,
        end_date: updatedData.endDate ? new Date(updatedData.endDate).toISOString() : null,
        description: updatedData.description,
      };

      const response = await apiClient.put(`/cv/project/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const index = projects.value.findIndex(proj => proj.id === id);
      if (index !== -1) {
        projects.value[index] = response.data.data;
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Proyek berhasil diperbarui!",
        showConfirmButton: false,
        timer: 3000,
      });
      return response.data.data;
    } catch (err) {
      console.error("Gagal memperbarui proyek:", err);
      error.value = err.response?.data?.message || "Gagal memperbarui proyek.";
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
   * Menghapus entri proyek berdasarkan ID.
   * Akan menampilkan konfirmasi kepada pengguna sebelum menghapus.
   * @param {number} id - ID proyek yang akan dihapus.
   */
  const deleteProject = async (id) => {
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

        await apiClient.delete(`/cv/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Hapus proyek dari state 'projects' setelah berhasil dihapus di backend
        projects.value = projects.value.filter(proj => proj.id !== id);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Proyek berhasil dihapus!",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        console.error("Gagal menghapus proyek:", err);
        error.value = err.response?.data?.message || "Gagal menghapus proyek.";
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
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject, // Pastikan ini diekspor
  };
});