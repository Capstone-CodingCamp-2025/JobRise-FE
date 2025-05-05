import { createRouter, createWebHistory } from "vue-router";
import LandingPageView from "../views/LandingPageView.vue";
import SelectRole from '../views/SelectRole.vue'
import Register from '../views/users/auth/Register.vue'
import Login from '../views/users/auth/Login.vue'
import LoginCompany from '../views/company/auth/LoginCompany.vue'
import RegisterCompany from '../views/company/auth/RegisterCompany.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing-page",
      component: LandingPageView,
    },
    {
      path: '/role',
      name: 'role',
      component: SelectRole,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register-company',
      name: 'register-company',
      component: RegisterCompany,
    },
    {
      path: '/login-company',
      name: 'login-company',
      component: LoginCompany,
    },

    
  ],
});

export default router;
