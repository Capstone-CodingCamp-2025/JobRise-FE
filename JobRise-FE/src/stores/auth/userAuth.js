import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ResetPassword,
  SendForgotPassword,
  VerifyResetToken,
} from "./forgetPassword";

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
        title: "Account Creating Successfully",
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
        title: "Login Success",
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
      console.error("Failed Get Data:", error);

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
    userProfile.value = null; 
    // Redirect to login page
    router.push({ name: "home-page" });
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
      console.error("Failed Sent OTP Verification:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:  "Failed Send OTP",
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
        { otp }, // Kirim OTP di body request
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
        title: "Email Verify Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      // Setelah verifikasi berhasil, update status verifikasi di currentUser (jika perlu)
      currentUser.value = { ...currentUser.value, email_verified: "yes" };
      localStorage.setItem("user", JSON.stringify(currentUser.value));
      return response.data;
    } catch (error) {
      console.error("Failed Verify Email OTP:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed Verification Email",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const createProfile = async (profileData) => {
    try {
      const { data } = await apiClient.post("/profile", profileData, {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
          "Content-Type": "multipart/form-data", // Penting untuk FormData
        },
      });
      userProfile.value = data.data; // Perbarui state userProfile dengan data baru
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile Creating Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      return data.data;
    } catch (error) {
      console.error("Failed Load Profile:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed Create Profile",
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  // Dari Pinia store Anda:
// stores/auth/userAuth.js

const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get("/profile", {
      headers: {
        Authorization: `Bearer ${tokenUser.value}`,
      },
    });
    userProfile.value = response.data.data;
    return response.data.data;
  } catch (error) {
    console.error("Failed Get Profile:", error);

    // Cek jika error adalah 404 (Not Found)
    if (error.response?.status === 404) {
      
      // ===== INI SOLUSINYA =====
      // Hanya tampilkan pop-up jika pengguna TIDAK sedang berada di halaman profil.
      if (router.currentRoute.value.name !== 'profile') {
        Swal.fire({
          icon: 'warning',
          title: 'Profil Tidak Ditemukan',
          text: 'Sepertinya Anda belum melengkapi profil. Silakan lengkapi profil Anda terlebih dahulu.',
          confirmButtonText: 'Lengkapi Profil',
          allowOutsideClick: false, 
        }).then((result) => {
          if (result.isConfirmed) {
            router.push({ name: 'profile' });
          }
        });
      }
      // Kita tetap perlu melempar error agar komponen yang memanggil tahu fetch gagal
      // dan bisa menghentikan state loading.
      throw new Error("Profile not found");
    }
    
    // Untuk error selain 404, kita lempar lagi agar bisa ditangani
    throw error;
  }
};

  const updateProfileUser = async (profileData) => {
    try {
      // Mengasumsikan endpoint pembaruan profil Anda adalah POST ke /profile
      // Jika API Anda menggunakan PUT/PATCH atau membutuhkan ID di URL, sesuaikan.
      const { data } = await apiClient.put("/profile-update", profileData, {
        // Menggunakan POST untuk pembaruan berdasarkan praktik umum dengan FormData
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
          "Content-Type": "multipart/form-data", // Penting untuk FormData
        },
      });
      userProfile.value = data.data; // Perbarui state userProfile
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile Updating Successfully",
        timer: 3000,
        showConfirmButton: false,
      });
      return data.data;
    } catch (error) {
      console.error("Failed Update Profile:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed Update Profile",
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
    createProfile, // Ekspor aksi baru
    fetchUserProfile, // Ekspor fetchUserProfile
    updateProfileUser, // Ekspor updateProfileUser
    sendVerificationOTP,
    verifyEmailOTP,
  };
});
