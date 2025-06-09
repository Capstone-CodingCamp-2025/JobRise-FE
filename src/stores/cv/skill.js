// src/stores/cv/skill.js

import { defineStore } from 'pinia';
import { apiClient } from '@/config/axios'; // Pastikan path ini benar
import { ref } from 'vue';
import Swal from 'sweetalert2';

export const useSkillStore = defineStore('skill', () => {
  const skills = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  };

  /**
   * Mengambil semua data skill untuk pengguna yang sedang login.
   * @returns {Array} Daftar objek skill.
   */
  const fetchSkills = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const response = await apiClient.get('/cv/skill', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      skills.value = response.data.data;
      return skills.value;
    } catch (err) {
      console.error("Gagal mengambil data skill:", err);
      error.value = err.response?.data?.message || "Gagal mengambil data skill.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Membuat entri skill baru.
   * @param {Object} skillData - Data skill yang akan dibuat (name, level).
   * @returns {Object} Objek skill yang baru dibuat.
   */
  const createSkill = async (skillData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const payload = {
        name: skillData.name,
        level: skillData.level,
      };

      const response = await apiClient.post('/cv/skill', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      skills.value.push(response.data.data);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Skill berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 3000,
      });

      return response.data.data;
    } catch (err) {
      console.error("Gagal membuat skill:", err);
      error.value = err.response?.data?.message || "Gagal menambahkan skill.";
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
   * Memperbarui entri skill yang sudah ada.
   * @param {number} id - ID skill yang akan diperbarui.
   * @param {Object} updatedData - Data skill yang diperbarui (name, level).
   * @returns {Object} Objek skill yang diperbarui.
   */
  const updateSkill = async (id, updatedData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const payload = {
        name: updatedData.name,
        level: updatedData.level,
      };

      const response = await apiClient.put(`/cv/skill/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const index = skills.value.findIndex(skill => skill.id === id);
      if (index !== -1) {
        skills.value[index] = response.data.data;
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Skill berhasil diperbarui!",
        showConfirmButton: false,
        timer: 3000,
      });
      return response.data.data;
    } catch (err) {
      console.error("Gagal memperbarui skill:", err);
      error.value = err.response?.data?.message || "Gagal memperbarui skill.";
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
   * Menghapus entri skill berdasarkan ID.
   * @param {number} id - ID skill yang akan dihapus.
   */
  const deleteSkill = async (id) => {
    // Menampilkan dialog konfirmasi SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this skill!",
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

        // Sesuai dengan Method DELETE dan URL /cv/skill/:id
        await apiClient.delete(`/cv/skill/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Sesuai dengan Request Header
          },
        });

        // Hapus skill dari state 'skills' setelah berhasil dihapus di backend
        // Respons API hanya berupa status sukses dan pesan, tidak ada data skill yang dikembalikan.
        skills.value = skills.value.filter(skill => skill.id !== id);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Skill berhasil dihapus!", // Sesuai dengan pesan sukses dari API
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        console.error("Gagal menghapus skill:", err);
        error.value = err.response?.data?.message || "Gagal menghapus skill.";
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: error.value,
          showConfirmButton: false,
          timer: 3000,
        });
        throw err; // Melempar error agar bisa ditangani oleh pemanggil jika perlu
      } finally {
        isLoading.value = false;
      }
    }
    // Jika pengguna membatalkan, tidak ada tindakan yang diambil
  };

  return {
    skills,
    isLoading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
});