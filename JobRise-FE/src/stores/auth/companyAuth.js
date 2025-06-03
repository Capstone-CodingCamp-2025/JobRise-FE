import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import router from "@/router";

export const useAuthCompanyStore = defineStore("authCompany", () => {
  const tokenCompany = ref(
    localStorage.getItem("tokenCompany")
      ? JSON.parse(localStorage.getItem("tokenCompany"))
      : null
  );

  const currentCompany = ref(
    localStorage.getItem("company") &&
      localStorage.getItem("company") !== "undefined"
      ? JSON.parse(localStorage.getItem("company"))
      : null
  );

  // State untuk menyimpan data profil perusahaan yang diambil
  const companyProfile = ref(null);

  const RegisterCompany = async (inputData) => {
    try {
      const { data } = await apiClient.post("/register-company", inputData);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Account Successfully Created",
        showConfirmButton: false,
        timer: 3000,
      });

      router.push("/login-company");
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Register Failed",
        showConfirmButton: false,
        timer: 2000,
      });
      throw error;
    }
  };

  const LoginCompany = async ({ email, password }) => {
    try {
      const { data } = await apiClient.post("/login-company", {
        email,
        password,
      });

      tokenCompany.value = data.token;
      // Asumsi response login company memberikan token dan role
      // Kita bisa menyimpan role di currentCompany jika diperlukan
      currentCompany.value = { role: data.role };

      localStorage.setItem("tokenCompany", JSON.stringify(data.token));
      localStorage.setItem("company", JSON.stringify(currentCompany.value)); // Simpan role (atau data company jika ada)

      // Tidak perlu memanggil getCompanyByAuth segera setelah login
      // Kecuali Anda membutuhkan data company yang lebih lengkap

      if (data?.role === "user") {
        // Hapus token dan company dari localStorage karena login ditolak
        localStorage.removeItem("tokenCompany");
        localStorage.removeItem("company"); // Reset state
        currentCompany.value = null;
        tokenCompany.value = null;

        Swal.fire({
          icon: "warning",
          title: "Akses Ditolak",
          text: "Anda login sebagai user dan tidak dapat mengakses halaman login company.",
        });
        router.replace("/dashboard-company");
        return false; // Menghentikan proses login company
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Signed In Successfully",
        showConfirmButton: false,
        timer: 2000,
      });

      router.replace("/dashboard-company");
      return true; // Login company berhasil
    } catch (error) {
      // Hapus token dan company dari localStorage jika login gagal
      localStorage.removeItem("tokenCompany");
      localStorage.removeItem("company"); // Reset state
      currentCompany.value = null;
      tokenCompany.value = null;

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Login Failed",
        showConfirmButton: false,
        timer: 2000,
      });
      throw error;
    }
  };


  const SendForgotPasswordCompany = async (email) => {
    try {
      const response = await apiClient.post("/forgot-password", { email }); // Menggunakan endpoint yang sama
      console.log("Full response from forgot password (company):", response);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 3000,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending forgot password link (company):", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "Failed to send reset link",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const VerifyResetTokenCompany = async (token) => {
    try {
      const response = await apiClient.get(`/verify-token/${token}`); // Menggunakan endpoint yang sama
      return response.data;
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.error || "Invalid or expired token",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const ResetPasswordCompany = async (token, password, confirm_password, router) => {
    try {
      const response = await apiClient.post(`/reset-password/${token}`, { // Menggunakan endpoint yang sama
        password,
        confirm_password,
      });
      console.log(response.data);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Password updated successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      router.push("/login-company"); // Redirect ke login company
      return response.data;
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.error || "Failed to reset password",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const getCompanyByAuth = async () => {
    try {
      const response = await apiClient.get("/user-auth", {
        headers: {
          Authorization: `Bearer ${tokenCompany.value}`,
        },
      });

      // Update data company dengan respons dari server
      currentCompany.value = response.data.data;

      // Tidak perlu memanggil fetchProfileCompany di sini lagi

      localStorage.setItem("company", JSON.stringify(currentCompany.value)); // Simpan currentCompany yang sudah diperbarui

      return currentCompany.value; // Mengembalikan currentCompany yang sudah diperbarui
    } catch (error) {
      console.error("Gagal mengambil data user:", error);

      // Jika token tidak valid/expired, lakukan logout
      if (error.response?.status === 401) {
        logout();
      }

      throw error;
    }
  };

  const createProfileCompany = async (formData) => {
    try {
      const { data } = await apiClient.post("/profile-company", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk mengirim file
          Authorization: `Bearer ${tokenCompany.value}`,
        },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile Company Created Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      // Setelah berhasil membuat profil, kita bisa langsung mengambil datanya
      // await fetchProfileCompany(); // Pindahkan pemanggilan ini ke komponen profil
      return data.data; // Mengembalikan data profil yang dibuat
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to Create Profile Company",
        text: error.response?.data?.message || "Something went wrong.",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const updateProfileCompany = async (formData) => {
    try {
      const { data } = await apiClient.put("/profile-company-update", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk mengirim file
          Authorization: `Bearer ${tokenCompany.value}`,
        },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile Company Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      // Setelah berhasil memperbarui profil, kita bisa langsung mengambil datanya
      // await fetchProfileCompany(); // Pindahkan pemanggilan ini ke komponen profil
      return data.data; // Mengembalikan data profil yang diperbarui
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to Update Profile Company",
        text: error.response?.data?.message || "Something went wrong.",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const fetchProfileCompany = async () => {
    try {
      const { data } = await apiClient.get("/profile-company", {
        headers: {
          Authorization: `Bearer ${tokenCompany.value}`,
        },
      });
      companyProfile.value = data.data;
      // Log untuk debugging: lihat data.data dari backend
      console.log("Data profil dari API (/profile-company):", data.data);
      console.log("email_verified dari API:", data.data?.email_verified);
      return data.data;
    } catch (error) {
      console.error("Gagal mengambil profil perusahaan:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem("tokenCompany");
    localStorage.removeItem("company");

    // Reset state
    currentCompany.value = null;
    tokenCompany.value = null;
    companyProfile.value = null; // Reset company profile juga
    // Redirect to login page
    router.push({ name: "home-page" });
  };


  const sendVerificationOTP = async () => {
    try {
      const { data } = await apiClient.post("/send-verification-otp", {}, {
        headers: {
          Authorization: `Bearer ${tokenCompany.value}`,
        },
      });
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 3000,
      });
      return data;
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "Failed to send OTP",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const verifyEmailOTP = async (otp) => {
    try {
      const { data } = await apiClient.post(
        "/verify-email",
        { otp }, // Kirim OTP di dalam body request
        {
          headers: {
            Authorization: `Bearer ${tokenCompany.value}`,
          },
        }
      );
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 3000,
      });
      // Setelah verifikasi berhasil, update status di currentCompany
      if (currentCompany.value) {
        currentCompany.value = { ...currentCompany.value, email_verified: 'yes' };
        localStorage.setItem("company", JSON.stringify(currentCompany.value));
      }
      // companyProfile akan di-fetch ulang di komponen setelah ini jika diperlukan.
      return data;
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "Failed to verify OTP",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  return {
    tokenCompany,
    currentCompany,
    companyProfile,
    RegisterCompany,
    LoginCompany,
    getCompanyByAuth,
    createProfileCompany,
    updateProfileCompany,
    fetchProfileCompany,
    logout,
    SendForgotPasswordCompany,
    VerifyResetTokenCompany,
    ResetPasswordCompany,
    sendVerificationOTP,
    verifyEmailOTP,
  };
});