import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import SelectRoleLogin from "../views/SelectRoleLogin.vue";
import SelectRoleRegister from "../views/SelectRoleRegister.vue";
import Register from "../views/users/auth/Register.vue";
import Login from "../views/users/auth/Login.vue";
import LoginCompany from "../views/company/auth/LoginCompany.vue";
import RegisterCompany from "../views/company/auth/RegisterCompany.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home-page",
      component: HomePage,
    },
    {
      path: "/role-login",
      name: "role-login",
      component: SelectRoleLogin,
    },
    {
      path: "/role-register",
      name: "role-register",
      component: SelectRoleRegister,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { isLogin: true },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { isLogin: false },
    },
    {
      path: "/register-company",
      name: "register-company",
      component: RegisterCompany,
    },
    {
      path: "/login-company",
      name: "login-company",
      component: LoginCompany,
    },
  ],
});

export default router;
