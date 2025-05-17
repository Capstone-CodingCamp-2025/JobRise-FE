import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import router from "@/router"; // Diubah ini

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
    logout
  };
});