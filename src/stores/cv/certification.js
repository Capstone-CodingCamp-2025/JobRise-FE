// src/stores/cv/certification.js

import { defineStore } from 'pinia';
import { apiClient } from '@/config/axios'; 
import { ref } from 'vue';
import Swal from 'sweetalert2';

export const useCertificationStore = defineStore('certification', () => {
  const certifications = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  };

  /**
   * @returns {Promise<Array>} Daftar objek sertifikasi.
   */
  const fetchCertifications = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const response = await apiClient.get('/cv/certification', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      certifications.value = response.data.data;
      return certifications.value;
    } catch (err) {
      console.error("Gagal mengambil data sertifikasi:", err);
      error.value = err.response?.data?.message || "Gagal mengambil data sertifikasi.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * @param {Object} certificationData - Data sertifikasi yang akan dibuat.
   * @returns {Promise<Object>} Objek sertifikasi yang baru dibuat.
   */
  const createCertification = async (certificationData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }

      const payload = {
        name: certificationData.name,
        issued_by: certificationData.issued_by,
        year: certificationData.year,
        id_credential_url: certificationData.id_credential_url,
        description: certificationData.description,
      };

      const response = await apiClient.post('/cv/certification', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      certifications.value.push(response.data.data);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Sertifikasi berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 3000,
      });

      return response.data.data;
    } catch (err) {
      console.error("Gagal membuat sertifikasi:", err);
      error.value = err.response?.data?.message || "Gagal menambahkan sertifikasi.";
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
   * @param {number} id 
   * @param {Object} updatedData 
   * @returns {Promise<Object>}
   */
  const updateCertification = async (id, updatedData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
      }
      const payload = {
        name: updatedData.name,
        issued_by: updatedData.issued_by,
        year: updatedData.year,
        id_credential_url: updatedData.id_credential_url, 
        description: updatedData.description,
      };

      const response = await apiClient.put(`/cv/certification/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const index = certifications.value.findIndex(cert => cert.id === id);
      if (index !== -1) {
        certifications.value[index] = response.data.data;
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Sertifikasi berhasil diperbarui!",
        showConfirmButton: false,
        timer: 3000,
      });
      return response.data.data;
    } catch (err) {
      console.error("Gagal memperbarui sertifikasi:", err);
      error.value = err.response?.data?.message || "Gagal memperbarui sertifikasi.";
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
   * @param {number} id
   * @returns {Promise<void>}
   */
  const deleteCertification = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this certification!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      isLoading.value = true;
      error.value = null;
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Token autentikasi tidak ditemukan. Harap login kembali.");
        }

        await apiClient.delete(`/cv/certification/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Sesuai dengan Request Header
          },
        });

        certifications.value = certifications.value.filter(cert => cert.id !== id);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Sertifikasi berhasil dihapus!", 
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        console.error("Gagal menghapus sertifikasi:", err);
        error.value = err.response?.data?.message || "Gagal menghapus sertifikasi.";
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
  };

  return {
    certifications,
    isLoading,
    error,
    fetchCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
  };
});