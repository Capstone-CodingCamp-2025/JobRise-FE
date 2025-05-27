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
      localStorage.setItem("user", JSON.stringify(currentUser.value));

      await getUserByAuth();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Signed In Successfully",
        showConfirmButton: false,
        timer: 2000,
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

    // Redirect to login page
    router.push({ name: "home-page" });
  };

  const createProfile = async (profileData) => {
    try {
      const { data } = await apiClient.post("/profile", profileData, {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
          
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

  const getProfile = async () => {
    try {
      const response = await apiClient.get("/profile", {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
        },
      });

      console.log("Profile data fetched:", response.data.data);
      
      if (response.data && response.data.data) {
        currentUser.value = { ...currentUser.value, ...response.data.data };
        localStorage.setItem("user", JSON.stringify(currentUser.value));
      }
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const { data } = await apiClient.put("/profile-update", updatedData, {
        headers: {
          Authorization: `Bearer ${tokenUser.value}`,
        },
      });

      // Optionally update the currentUser state with the new data
      currentUser.value = { ...currentUser.value, ...data.data };
      localStorage.setItem("user", JSON.stringify(currentUser.value));

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      console.log("Profile updated:", data);
      await getUserByAuth(); // Refresh user data after update
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
    tokenUser,
    currentUser,
    getUserByAuth,
    logout,
    createProfile,
    getProfile,
    updateProfile
  };
});
