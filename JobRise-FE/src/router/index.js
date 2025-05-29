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
import PostJob from "@/views/company/PostJob.vue";
import JobList from "@/views/company/JobList.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/nav",
      name: "nav",
      component: Navigate,
      meta: { isAuth: false }, // General navigation, no specific role needed
    },
    {
      path: "/",
      name: "home-page",
      component: HomePage,
      meta: { isAuth: false }, // Public route
    },
    {
      path: "/role-login",
      name: "role-login",
      component: SelectRoleLogin,
      meta: { isAuth: false }, // Public route
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { isAuth: false }, // Public route
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { isAuth: false }, // Public route
    },
    {
      path: "/register-company",
      name: "register-company",
      component: RegisterCompany,
      meta: { isAuth: false }, // Public route
    },
    {
      path: "/login-company",
      name: "login-company",
      component: LoginCompany,
      meta: { isAuth: false }, // Public route
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { isAuth: true, roles: ["user"] }, // Only users can access
    },
    {
      path: "/dashboard-company",
      name: "dashboard-company",
      component: DashboardCompany,
      meta: { isAuth: true, roles: ["company"] }, // Only companies can access
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { isAuth: true, roles: ["user"] }, // Only users can access
    },
    {
      path: "/profile-company",
      name: "profile-company",
      component: ProfileCompany,
      meta: { isAuth: true, roles: ["company"] }, // Only companies can access
    },
    {
      path: "/cv",
      name: "cv",
      component: Cv,
      meta: { isAuth: true, roles: ["user"] }, // Only users can access
    },
    {
      path: "/find-job",
      name: "find-job",
      component: FindJob,
      meta: { isAuth: true, roles: ["user"] }, // Only users can access
    },
    {
      path: "/applied",
      name: "applied",
      component: Applied,
      meta: { isAuth: true, roles: ["user"] }, // Only users can access
    },
    {
      path: "/favorite-job",
      name: "favorite-job",
      component: Cv, // Assuming Cv is used here, as in your original code
      meta: { isAuth: true, roles: ["user"] }, // Only users can access
    },
    {
      path: "/post-job",
      name: "post-job",
      component: PostJob, // Assuming Cv is used here, as in your original code
      meta: { isAuth: true, roles: ["company"] }, // Only companies can access
    },
    {
      path: "/job-list", // Corrected to "application" if it's a typo, but kept as "aplication" based on your input
      name: "job-list",
      component: JobList, // Assuming Cv is used here, as in your original code
      meta: { isAuth: true, roles: ["company"] }, // Only companies can access
    },
    
  ],
});

router.beforeEach(async (to, from) => {
  const userStore = AuthUserStorage();
  const companyStore = useAuthCompanyStore();

  const isUserAuthenticated = userStore.tokenUser;
  const isCompanyAuthenticated = companyStore.tokenCompany;

  // Determine the current user's active role
  let currentRole = null;
  if (isUserAuthenticated) {
    currentRole = "user";
  } else if (isCompanyAuthenticated) {
    currentRole = "company";
  }

  // Case 1: Route requires authentication but the user is not authenticated
  if (to.meta.isAuth && !currentRole) {
    return { name: "role-login" };
  }

  // Case 2: User is authenticated and trying to access a route that doesn't require authentication
  // This prevents authenticated users from going back to login/register pages directly.
  if (!to.meta.isAuth && currentRole) {
    if (currentRole === "user") {
      return { name: "dashboard" };
    } else if (currentRole === "company") {
      return { name: "dashboard-company" };
    }
  }

  // Case 3: User is authenticated and trying to access a role-specific route they are not authorized for
  // Check if the route has defined roles and if the current user's role is not included
  if (to.meta.isAuth && to.meta.roles && currentRole) {
    if (!to.meta.roles.includes(currentRole)) {
      // Role mismatch, redirect to the appropriate dashboard
      if (currentRole === "user") {
        return { name: "dashboard" };
      } else if (currentRole === "company") {
        return { name: "dashboard-company" };
      }
    }
  }

  // If none of the above conditions trigger a redirect, allow the navigation
  return true;
});

export default router;