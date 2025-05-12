import { apiClient } from "@/config/axios";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const AuthCompanyStorage = defineStore("auth", () => {
  const router = useRouter();

  const tokenCompany = ref(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );

  const currentCompany = ref(
    localStorage.getItem("company") && localStorage.getItem("company") != "undefined"
      ? JSON.parse(localStorage.getItem("company"))
      : null
  );

  const RegisterCompany = async (inputData) => {
    try {
      const { name, email, password, confirm_password } = inputData;
      const { data } = await apiClient.post("/register-company", {
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
      router.push("/login-company");
    } catch (error) {
      console.log(error);
    }
  };

  const LoginCompany = async (inputData) => {
    try {
      const { email, password } = inputData;
      const { data } = await apiClient.post("/login-company", {
        email,
        password,
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
        title: "Signed in successfully",
      });

      console.log(data);

      tokenCompany.value = data.token;
      currentCompany.value = data.user;

      localStorage.setItem("token", JSON.stringify(tokenCompany.value));
      localStorage.setItem("company", JSON.stringify(currentCompany.value));
      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return { RegisterCompany, LoginCompany, tokenCompany, currentCompany };
});
