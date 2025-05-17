import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import SelectRoleLogin from "../views/SelectRoleLogin.vue";
import SelectRoleRegister from "../views/SelectRoleRegister.vue";
import Register from "../views/users/auth/Register.vue";
import Login from "../views/users/auth/Login.vue";
import LoginCompany from "../views/company/auth/LoginCompany.vue";
import RegisterCompany from "../views/company/auth/RegisterCompany.vue";
import Dashboard from "../views/users/Dashboard.vue";
import DashboardCompany from "../views/company/Dashboard.vue";
import Profile from "../views/users/Profile.vue";
import ProfileCompany from "../views/company/Profile.vue";
import Cv from "@/views/users/Cv.vue";
import { AuthUserStorage } from "@/stores/auth/userAuth";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";
import Navigate from "@/views/Navigate.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/nav',
      name: 'nav',
      component: Navigate
    },
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
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      // meta: {middleware: 'user'}
    },
    {
      path: "/dashboard-company",
      name: "dashboard-company",
      component: DashboardCompany,
      // meta: {middleware: 'company'}
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      // meta: {middleware: 'user'}
    },
    {
      path: "/profile-company",
      name: "profile-company",
      component: ProfileCompany,
      // meta: {middleware: 'company'}
    },
    {
      path: "/cv",
      name: "cv",
      component: Cv,
    },
    {
      path: "/find-job",
      name: "find-job",
      component: Cv,
    },
    {
      path: "/applied",
      name: "applied",
      component: Cv,
    },
    {
      path: "/favorite-job",
      name: "favorite-job",
      component: Cv,
    },
    {
      path: "/post-job",
      name: "post-job",
      component: Cv,
    },
    {
      path: "/aplication",
      name: "aplication",
      component: Cv,
    },
    
  ],
});

// router.beforeEach((to, from, next) => {
//   const middleware = to.meta.middleware

//   if (middleware === 'user'){
//     AuthUserStorage(to, from, next)
//   }else if(middleware === 'company'){
//     AuthCompanyStorage(to, from, next)
//   }else{
//     next()
//   }

// })

export default router;
