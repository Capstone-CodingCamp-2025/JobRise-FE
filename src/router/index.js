import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import SelectRoleLogin from "../views/SelectRoleLogin.vue";
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
import Navigate from "@/views/Navigate.vue";
import FindJob from "@/views/users/FindJob.vue";
import Applied from "@/views/users/Applied.vue";
import AppliedDetail from "@/views/users/AppliedDetail.vue";
import PostJob from "@/views/company/PostJob.vue";
import JobList from "@/views/company/JobList.vue";
import ForgetPassword from "@/views/forgetpassword/ForgetPassword.vue";
import JobDetail from "@/views/company/JobDetail.vue";
import JobEdit from "@/views/company/JobEdit.vue";
import JobDetails from "@/views/users/JobDetails.vue";
import FavoriteJob from "@/views/users/FavoriteJob.vue";
import ResetPassword from "@/views/forgetpassword/ResetPassword.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/nav",
      name: "nav",
      component: Navigate,
      meta: { isAuth: false, title: "Navigation" },
    },
    {
      path: "/",
      name: "home-page",
      component: HomePage,
      meta: { isAuth: false, title: "Home Page" },
    },
    {
      path: "/role-login",
      name: "role-login",
      component: SelectRoleLogin,
      meta: { isAuth: false, title: "Select Account Type" },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { isAuth: false, title: "User Registration" },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { isAuth: false, title: "User Login" },
    },
    {
      path: "/register-company",
      name: "register-company",
      component: RegisterCompany,
      meta: { isAuth: false, title: "Company Registration" },
    },
    {
      path: "/login-company",
      name: "login-company",
      component: LoginCompany,
      meta: { isAuth: false, title: "Company Login" },
    },
    {
      path: "/forget-password",
      name: "forget-password",
      component: ForgetPassword,
      meta: { isAuth: false, title: "Forgot Password" },
    },
    {
      path: '/forget-password-company',
      name: 'forget-password-company',
      component: ForgetPassword,
      meta: { isAuth: false, title: "Company Forgot Password" },
      props: { isCompany: true },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPassword,
      meta: { isAuth: false, title: "Reset Password" },
      props: (route) => ({ token: route.query.token }),
    },
    {
      path: '/reset-password-company',
      name: 'reset-password-company',
      component: ResetPassword,
      meta: { isAuth: false, title: "Company Reset Password" },
      props: (route) => ({ token: route.query.token, isCompany: true }),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { isAuth: true, roles: ["user"], title: "Dashboard" },
    },
    {
      path: "/dashboard-company",
      name: "dashboard-company",
      component: DashboardCompany,
      meta: { isAuth: true, roles: ["company"], title: "Company Dashboard" },
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { isAuth: true, roles: ["user"], title: "My Profile" },
    },
    {
      path: "/profile-company",
      name: "profile-company",
      component: ProfileCompany,
      meta: { isAuth: true, roles: ["company"], title: "Company Profile" },
    },
    {
      path: "/cv",
      name: "cv",
      component: Cv,
      meta: { isAuth: true, roles: ["user"], title: "Curriculum Vitae" },
    },
    {
      path: "/find-job",
      name: "find-job",
      component: FindJob,
      meta: { isAuth: true, roles: ["user"], title: "Find Jobs" },
    },
    {
      path: "/job-user/:id",
      name: "job-user-detail",
      component: JobDetails,
      meta: { isAuth: true, roles: ["user"], title: "Job Details" },
    },
    {
      path: "/applied",
      name: "applied",
      component: Applied,
      meta: { isAuth: true, roles: ["user"], title: "Applied Jobs" },
    },
    {
      path: "/applied/:id",
      name: "applied-detail",
      component: AppliedDetail,
      meta: { isAuth: true, roles: ["user"], title: "Application Details" },
    },
    {
      path: "/favorite-job",
      name: "favorite-job",
      component: FavoriteJob,
      meta: { isAuth: true, roles: ["user"], title: "Favorite Jobs" },
    },
    {
      path: "/post-job",
      name: "post-job",
      component: PostJob,
      meta: { isAuth: true, roles: ["company"], title: "Post a New Job" },
    },
    {
      path: "/job-list",
      name: "job-list",
      component: JobList,
      meta: { isAuth: true, roles: ["company"], title: "Job Listings" },
    },
    {
      path: "/job/:id",
      name: "job-detail",
      component: JobDetail,
      meta: { isAuth: true, roles: ["company"], title: "Job Details" },
    },
    {
      path: "/job/edit/:id",
      name: "job-edit",
      component: JobEdit,
      meta: { isAuth: true, roles: ["company"], title: "Edit Job" },
    },
  ],
});

router.beforeEach(async (to, from) => {
  // 1. Set the default title for your application
  const defaultTitle = "JobRise"; // Changed to English

  // 2. Set the document title based on the destination route's meta.title
  //    If the route doesn't have a meta.title, the default title will be used.
  document.title = to.meta.title ? `${defaultTitle} | ${to.meta.title}  ` : defaultTitle;
  
  // Existing authentication and authorization logic remains the same
  const userStore = AuthUserStorage();
  const companyStore = useAuthCompanyStore();

  const isUserAuthenticated = userStore.tokenUser;
  const isCompanyAuthenticated = companyStore.tokenCompany;

  let currentRole = null;
  if (isUserAuthenticated) {
    currentRole = "user";
  } else if (isCompanyAuthenticated) {
    currentRole = "company";
  }

  if (to.meta.isAuth && !currentRole) {
    return { name: "role-login" };
  }

  if (!to.meta.isAuth && currentRole) {
    if (currentRole === "user") {
      return { name: "dashboard" };
    } else if (currentRole === "company") {
      return { name: "dashboard-company" };
    }
  }

  if (to.meta.isAuth && to.meta.roles && currentRole) {
    if (!to.meta.roles.includes(currentRole)) {
      if (currentRole === "user") {
        return { name: "dashboard" };
      } else if (currentRole === "company") {
        return { name: "dashboard-company" };
      }
    }
  }

  return true;
});

export default router;
