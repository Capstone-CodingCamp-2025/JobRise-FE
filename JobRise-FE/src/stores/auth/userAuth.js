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

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Account Succesfully Created",
      });

      console.log(data);
      router.push("/login");
    } catch (error) {
      console.log(error);
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

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Signed In Successfully",
      });

      router.replace("/dashboard");
      return data;
    } catch (error) {
      console.log(error);
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

  return { RegisterUser, LoginUser, tokenUser, currentUser, getUserByAuth };
});
