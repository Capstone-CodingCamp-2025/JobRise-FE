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
    localStorage.getItem("company") && localStorage.getItem("company") !== "undefined"
      ? JSON.parse(localStorage.getItem("company"))
      : null
  );

  const RegisterCompany = async (inputData) => {
    try {
      const { data } = await apiClient.post("/register-company", inputData);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Account Successfully Created",
        showConfirmButton: false,
        timer: 3000
      });

      router.push("/login-company");
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Register Failed",
        showConfirmButton: false,
        timer: 2000
      });
      throw error;
    }
  };

  const LoginCompany = async ({ email, password }) => {
    try {
      const { data } = await apiClient.post("/login-company", { email, password });

      tokenCompany.value = data.token;
      currentCompany.value = data.user;

      localStorage.setItem("tokenCompany", JSON.stringify(data.token));
      localStorage.setItem("company", JSON.stringify(data.user));

      await getCompanyByAuth();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Signed In Successfully",
        showConfirmButton: false,
        timer: 2000
      });

      router.replace("/dashboard-company");
      return data;
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Login Failed",
        showConfirmButton: false,
        timer: 2000
      });
      throw error;
    }
  };

  const getCompanyByAuth = async () => {
    try {
      const response = await apiClient.get("/user-auth", {
        headers: {
          Authorization: `Bearer ${tokenCompany.value}`
        }
      });

      // Update data company dengan response dari server
      currentCompany.value = response.data.data;
      localStorage.setItem("company", JSON.stringify(response.data.data));

      return response.data.data;
    } catch (error) {
      console.error("Gagal mengambil data user:", error);

      // Jika token tidak valid/expired, lakukan logout
      if (error.response?.status === 401) {
        logout();
      }

      throw error;
    }
  };

  const createProfileCompany = async (payload) => {
    try {
      const { data } = await apiClient.post("/profile-company", payload, {
        headers: {
          Authorization: `Bearer ${tokenCompany.value}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.status === "success" && data.data) {
        currentCompany.value = data.data;
        localStorage.setItem("company", JSON.stringify(data.data));

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Profile Company Created Successfully",
          showConfirmButton: false,
          timer: 3000,
        });
      }

      return data;
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to Create Profile Company",
        text: error.response?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  // Fungsi untuk mendapatkan profil perusahaan berdasarkan otorisasi
  const getProfileCompany = async () => {
    try {
      const { data } = await apiClient.get("/profile-company", {
        headers: {
          Authorization: `Bearer ${tokenCompany.value}`,
        },
      });
      if (data.status === "success") {
        currentCompany.value = data.data;
        localStorage.setItem("company", JSON.stringify(data.data));
        return data.data;
      } else if (data.status === "error" && data.message) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Failed to Get Profile Company",
          text: data.message,
          showConfirmButton: false,
          timer: 3000,
        });
        throw new Error(data.message);
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Failed to Get Profile Company",
          text: "Failed to retrieve profile company data.",
          showConfirmButton: false,
          timer: 3000,
        });
        throw new Error("Failed to retrieve profile company data.");
      }
    } catch (error) {
      console.error("Error fetching profile company:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error Fetching Profile",
        text: error.response?.data?.message || "Something went wrong while fetching profile.",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  // Fungsi untuk memperbarui profil perusahaan
  const updateProfileCompany = async (payload) => {
    try {
      const { data } = await apiClient.put("/profile-company-update", payload, {
        headers: {
          Authorization: `Bearer ${tokenCompany.value}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      console.log("Profile updated:", data);
      await getProfileCompany(); // Atau getUserByAuth jika Anda ingin memperbarui info user di navbar dll.
      return data;
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to Update Profile Company",
        text: error.response?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };


  const logout = () => {
    // Clear local storage
    localStorage.removeItem('tokenCompany');
    localStorage.removeItem('company');

    // Reset state
    currentCompany.value = null;
    tokenCompany.value = null;

    // Redirect to login page
    router.push({ name: 'home-page' });
  };

  return {
    tokenCompany,
    currentCompany,
    RegisterCompany,
    LoginCompany,
    getCompanyByAuth,
    createProfileCompany,
    getProfileCompany,
    updateProfileCompany, // Tambahkan fungsi updateProfileCompany
    logout
  };
});