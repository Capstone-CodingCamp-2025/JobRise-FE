import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ResetPassword, SendForgotPassword, VerifyResetToken } from "./forgetPassword";


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

  // Tambahkan state terpisah untuk data profil pengguna
  const userProfile = ref(null);

  const RegisterUser = async (inputData) => {
    try {
      // Pastikan inputData sekarang memiliki properti 'name'
      const { name, email, password, confirm_password } = inputData;
      const { data } = await apiClient.post("/register", {
        name, // Sertakan 'name' di sini
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
      localStorage.setItem("token", JSON.stringify(tokenUser.value));

      // Setelah login berhasil, fetch data user lengkap
      await getUserByAuth();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Signed In Successfully",
        showConfirmButton: false,
        timer: 2000,
      });
      router.push("/dashboard"); // Atau halaman dashboard sesuai kebutuhan
      return true;
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
    userProfile.value = null; // Pastikan userProfile juga direset saat logout

    // Redirect to login page
    router.push({ name: "home-page" });
  };

  const createProfile = async (profileFormData) => {
    try {
      const { data } = await apiClient.post("/profile", profileFormData, {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
          "Content-Type": "multipart/form-data",
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
      console.log("Profile created:", data); // Perbaikan typo console.console.log
      await fetchUserProfile(); // Setelah membuat profil, fetch data profil terbaru
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

  // Fungsi tunggal untuk mengambil data profil berdasarkan otentikasi
  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get("/profile", {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
        },
      });
      userProfile.value = response.data.data;
      // Asumsi response.data.data juga memiliki email_verified
      currentUser.value = { ...currentUser.value, email_verified: response.data.data?.email_verified };
      localStorage.setItem("user", JSON.stringify(currentUser.value));
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      if (error.response?.status === 404) {
        userProfile.value = null;
      }
      throw error;
    }
  };

  const updateProfileUser = async (profileFormData) => {
    try {
      const { data } = await apiClient.put("/profile-update", profileFormData, {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
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
      await fetchUserProfile(); // Setelah update, fetch data profil terbaru
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

  const sendVerificationOTP = async () => {
    try {
      const { data } = await apiClient.post(
        "/send-verification-otp",
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenUser.value}`,
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
      return data;
    } catch (error) {
      console.error("Failed to send verification OTP:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "Failed to send OTP.",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const verifyEmailOTP = async (otp) => {
    try {
      const response = await apiClient.post(
        "/verify-email", // Ubah dari GET dengan query parameter menjadi POST
        { otp },         // Kirim OTP di body request
        {
          headers: {
            Authorization: `Bearer ${tokenUser.value}`,
          },
        }
      );
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 3000,
      });
      // Setelah verifikasi berhasil, update status verifikasi di currentUser (jika perlu)
      currentUser.value = { ...currentUser.value, email_verified: 'yes' };
      localStorage.setItem("user", JSON.stringify(currentUser.value));
      return response.data;
    } catch (error) {
      console.error("Failed to verify email OTP:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "Failed to verify OTP.",
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
    userProfile, // Ekspor userProfile agar bisa diakses di komponen
    getUserByAuth,
    logout,
    createProfile,
    fetchUserProfile,
    updateProfileUser,
    sendVerificationOTP,
    verifyEmailOTP,
  };
});