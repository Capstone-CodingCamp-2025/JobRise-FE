import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const AuthUserStorage = defineStore("auth", () => {
  const router = useRouter();

  const tokenUser = ref(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );

  const currentUser = ref(
    localStorage.getItem("user") && localStorage.getItem("user") != "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const RegisterUser = async (inputData) => {
    try {
      const { name, email, password, confirm_password } = inputData;
      const { data } = await apiClient.post("/register", {
        name,
        email,
        password,
        confirm_password,
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Account Successfully Created",
        showConfirmButton: false,
        timer: 3000
      });
      console.log(data);
      router.push("/login");
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

  const LoginUser = async (inputData) => {
    try {
      const { email, password } = inputData;
      const { data } = await apiClient.post("/login", {
        email,
        password,
      });
      tokenUser.value = data.token;
      currentUser.value = data.user;

      localStorage.setItem("token", JSON.stringify(tokenUser.value));
      localStorage.setItem("user", JSON.stringify(currentUser.value));

      await getUserByAuth();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Signed In Successfully",
        showConfirmButton: false,
        timer: 2000
      });

      router.replace("/dashboard");
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

  // Fungsi baru untuk mendapatkan user berdasarkan token
  const getUserByAuth = async () => {
    try {
      const response = await apiClient.get("/user-auth", {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
        },
      });

      // Update data company dengan response dari server
      currentUser.value = response.data.data;
      localStorage.setItem("user", JSON.stringify(response.data.data));

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    currentUser.value = null;
    tokenUser.value = null;
    
    // Redirect to login page
    router.push({ name: 'home-page' });
  };

  return { RegisterUser, LoginUser, tokenUser, currentUser, getUserByAuth, logout };
});
