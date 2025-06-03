import { apiClient } from "@/config/axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router"; // Import useRouter

const router = useRouter(); // Gunakan useRouter di sini (di luar scope fungsi)

export const SendForgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/forgot-password", { email });
    console.log("Full response from forgot password:", response);
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
    console.error("Error sending forgot password link:", error);
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

export const VerifyResetToken = async (token) => {
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

export const ResetPassword = async (token, password, confirm_password, router) => {
  try {
    const response = await apiClient.post(`/reset-password/${token}`, {
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
    router.push("/login"); // Sekarang menggunakan instance router yang dikirim
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