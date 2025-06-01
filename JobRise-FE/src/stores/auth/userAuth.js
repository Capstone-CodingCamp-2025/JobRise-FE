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
    localStorage.getItem("user") && localStorage.getItem("user") !== "undefined"
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
        timer: 3000,
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
        timer: 2000,
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
      localStorage.setItem("user", JSON.stringify(currentUser.value)); // Ambil data user lengkap setelah login berhasil

      const fullUserData = await getUserByAuth(); // Periksa role setelah mendapatkan data user lengkap

      if (fullUserData?.role === "company") {
        // Hapus token dan user dari localStorage karena login ditolak
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Reset state
        currentUser.value = null;
        tokenUser.value = null;

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Login Failed",
          showConfirmButton: false,
          timer: 2000,
        });
        router.replace("/login");
        return false; // Mengembalikan false jika login ditolak
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Signed In Successfully",
        showConfirmButton: false,
        timer: 2000,
      });

      return true; // Mengembalikan true jika login berhasil
    } catch (error) {
      // Hapus token dan user dari localStorage jika login gagal
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Reset state
      currentUser.value = null;
      tokenUser.value = null;

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

  const SendForgotPassword = async (email) => {
    try {
      const { data } = await apiClient.post("/forgot-password", { email });
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
        title: error.response?.data?.message || "Failed to send reset link",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const VerifyResetToken = async (token) => {
    try {
      const response = await apiClient.get(`/verify-token/${token}`);
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

  const ResetPassword = async (token, password, confirm_password) => {
    try {
      const response = await apiClient.post(`/reset-password/${token}`, {
        password,
        confirm_password,
      });
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 3000,
      });

      // Asumsi response.data.user berisi informasi pengguna, termasuk role
      if (response.data.user?.role === "company") {
        router.push("/login-company");
      } else {
        router.push("/login");
      }
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

  const getUserByAuth = async () => {
    try {
      const response = await apiClient.get("/user-auth", {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
        },
      });

      currentUser.value = response.data.data;
      localStorage.setItem("user", JSON.stringify(response.data.data));

      return response.data.data;
    } catch (error) {
      console.error("Gagal mengambil data user:", error);

      if (error.response?.status === 401) {
        logout();
      }

      throw error;
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Reset state
    currentUser.value = null;
    tokenUser.value = null;

    // Redirect to login page
    router.push({ name: "home-page" });
  };

  const createProfile = async (profileFormData) => {
    try {
      const { data } = await apiClient.post("/profile", profileFormData, {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
          "Content-Type": "multipart/form-data", // Tambahkan header ini
        },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile Created Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      console.log("Profile created:", data);
      await getUserByAuth();
      return data;
    } catch (error) {
      console.error("Failed to create profile:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to Create Profile",
        text: error.response?.data?.message || "Something went wrong.",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const getProfileUser = async () => {
    try {
      const response = await apiClient.get("/profile", {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // Tidak menampilkan Swal disini, biar ditangani di component
      throw error;
    }
  };

  const updateProfileUser = async (profileFormData) => {
    try {
      const { data } = await apiClient.put("/profile-update", profileFormData, {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
          "Content-Type": "multipart/form-data", // Pastikan ini ada jika Anda mengupload file
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
      await getProfileUser(); // Atau getUserByAuth jika Anda ingin memperbarui info user di navbar dll.
      return data;
    } catch (error) {
      console.error("Failed to update profile:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to Update Profile",
        text: error.response?.data?.message || "Something went wrong.",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  return {
    RegisterUser,
    LoginUser,
    SendForgotPassword,
    VerifyResetToken,
    ResetPassword,
    tokenUser,
    currentUser,
    getUserByAuth,
    logout,
    createProfile,
    getProfileUser,
    updateProfileUser,
  };
});