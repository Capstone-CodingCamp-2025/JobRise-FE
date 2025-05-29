<template>
  <nav class="bg-[#D5DEEF] flex justify-between px-2 md:px-5 z-40 sticky top-0">
    <!-- Logo and main navigation -->
    <div class="flex gap-x-1 md:gap-x-4">
      <!-- Mobile menu button (hidden) -->
      <div class="md:hidden mt-4" @click="openMenu" v-if="isLoggedIn">
        <Icon
          icon="material-symbols:menu-rounded"
          width="24"
          height="24"
          style="color: #1c00ff"
        />
      </div>

      <!-- Logo -->
      <div>
        <router-link
          :to="isLoggedIn ? (isUser ? { name: 'dashboard' } : { name: 'dashboard-company' }) : { name: 'home-page' }"
        >
          <img src="../../public/jobrise.png" alt="jobrise" class="w-32" />
        </router-link>
      </div>

      <!-- Main navigation links - shown only when logged in -->
      <div class="mt-3.5 md:flex gap-x-6 hidden" v-if="isLoggedIn && isUser">
        <router-link
          :to="{ name: 'dashboard' }"
          class="font-bold text-blue-800 text-lg hover:border-b-2 border-b-fuchsia-500 h-max"
          active-class="active"
        >
          Dashboard
        </router-link>
        <router-link
          :to="{ name: 'cv' }"
          class="font-bold text-blue-800 text-lg hover:border-b-2 border-b-fuchsia-500 h-max"
          active-class="active"
        >
          CV
        </router-link>
        <router-link
          :to="{ name: 'find-job' }"
          class="font-bold text-blue-800 text-lg hover:border-b-2 border-b-fuchsia-500 h-max"
          active-class="active"
          >
          Find Job
        </router-link>
        <router-link
          :to="{ name: 'applied' }"
          class="font-bold text-blue-800 text-lg hover:border-b-2 border-b-fuchsia-500 h-max"
          active-class="active"
          >
          Applied
        </router-link>
        <router-link
          :to="{ name: 'favorite-job' }"
          class="font-bold text-blue-800 text-lg hover:border-b-2 border-b-fuchsia-500 h-max"
        >
          Favorite Job
        </router-link>
      </div>

      <!-- company -->
      <div class="mt-3.5 md:flex gap-x-6 hidden" v-if="isLoggedIn && isCompany">
        <router-link
          :to="{ name: 'dashboard-company' }"
          class="font-bold text-blue-800 text-lg hover:border-b-2 border-b-fuchsia-500 h-max"
          active-class="active"
          >Dashboard</router-link
        >
        <router-link
          :to="{ name: 'post-job' }"
          class="font-bold text-blue-800 text-lg hover:border-b-2 border-b-fuchsia-500 h-max"
          active-class="active"
          >Post a Job</router-link
        >
        <router-link
          :to="{ name: 'job-list' }"
          class="font-bold text-blue-800 text-lg hover:border-b-2 border-b-fuchsia-500 h-max"
          active-class="active"
          >Job List</router-link
        >
      </div>
    </div>

    <!-- Guest buttons - shown when not logged in -->
    <div class="py-4 flex gap-x-1 md:gap-x-4" v-if="!isLoggedIn">
      <router-link
        :to="{ name: 'role-login' }"
        class="font-bold text-lg text-blue-950 border rounded-lg px-6  hover:bg-blue-950 hover:text-white pb-1"
        
        >
        Login
      </router-link>
      
    </div>

    <!-- User dropdown - shown when logged in -->
    <div class="relative mt-2" ref="dropdownRef" v-else>
      <!-- Avatar Button -->
      <div class="flex items-center cursor-pointer" @click="toggleAvatar">
        <Icon
          icon="iconamoon:profile-fill"
          width="42"
          height="42"
          style="color: #000"
        />
        <Icon
          :icon="
            avatarOpen
              ? 'iconamoon:arrow-down-2-light'
              : 'iconamoon:arrow-up-2-light'
          "
          width="24"
          height="24"
          class="mt-2"
          style="color: #000"
        />
      </div>

      <!-- Dropdown avatar -->
      <div
        v-show="avatarOpen"
        class="absolute right-0 mt-2 md:mt-4 bg-[#D5DEEF] rounded shadow-lg w-22 z-50 transition-all duration-200"
      >
        <router-link
          :to="isUser ? { name: 'profile' } : { name: 'profile-company' }"
          class="block text-center py-2 text-blue-800 font-bold text-sm hover:bg-blue-100"
          @click="avatarOpen = false"
        >
          Profile
        </router-link>
        <a
          href="#"
          @click.prevent="logout"
          class="block text-center py-2 text-blue-800 font-bold text-sm hover:bg-blue-100"
        >
          Logout
        </a>
      </div>
    </div>

    <!-- Mobile -->

    <transition name="fade">
      <div v-if="menu" class="fixed inset-0 z-50" @click="menu = false">
        <div class="absolute inset-0 bg-slate-400/50"></div>
        <div class="relative bg-[#D5DEEF] h-full w-64" @click.stop>
          <!-- mobile user -->
          <div
            class="flex flex-col text-center gap-y-3 pt-32"
            v-if="isLoggedIn && isUser"
          >
            <router-link
              :to="{ name: 'dashboard' }"
              class="font-bold text-lg"
              @click="menu = false"
              >Dashboard</router-link
            >
            <router-link
              :to="{ name: 'cv' }"
              class="font-bold text-lg"
              @click="menu = false"
              >CV</router-link
            >
            <router-link
              :to="{ name: 'find-job' }"
              class="font-bold text-lg"
              @click="menu = false"
              >Find Job</router-link
            >
            <router-link
              :to="{ name: 'applied' }"
              class="font-bold text-lg"
              @click="menu = false"
              >Applied</router-link
            >
            <router-link
              :to="{ name: 'favorite-job' }"
              class="font-bold text-lg"
              @click="menu = false"
              >Favorite Job</router-link
            >
          </div>

          <!-- mobile company -->
          <div
            class="flex flex-col text-center gap-y-3 pt-32"
            v-if="isLoggedIn && isCompany"
          >
            <router-link
              :to="{ name: 'dashboard-company' }"
              class="font-bold text-lg"
              @click="menu = false"
              >Dashboard</router-link
            >
            <router-link
              :to="{ name: 'post-job' }"
              class="font-bold text-lg"
              @click="menu = false"
              >Post a Job</router-link
            >
            <router-link
              :to="{ name: 'job-list' }"
              class="font-bold text-lg"
              @click="menu = false"
              >Job List</router-link
            >
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Icon } from "@iconify/vue";
import { AuthUserStorage } from "@/stores/auth/userAuth";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useAuthCompanyStore } from "@/stores/auth/companyAuth";

const router = useRouter();
const userStore = AuthUserStorage();
const companyStore = useAuthCompanyStore();

const menu = ref(false);
const sidebarRef = ref(null);

const openMenu = () => {
  menu.value = !menu.value;
};

const handleSidebarClick = (event) => {
  // Jika yang diklik adalah backdrop (area abu-abu di luar sidebar)
  if (event.target === sidebarRef.value) {
    menu.value = false;
  }
};

// State untuk dropdown
const avatarOpen = ref(false);
const dropdownRef = ref(null);

// Computed properties
const isLoggedIn = computed(() => {
  return !!userStore.currentUser || !!companyStore.currentCompany;
});

const isUser = computed(() => {
  return !!userStore.currentUser;
});

const isCompany = computed(() => {
  return !!companyStore.currentCompany;
});

// Logout function yang diperbaiki
const logout = async () => {
  try {
    // Hapus data dari store
    if (userStore.currentUser) {
      userStore.logout(); // Pastikan store memiliki method logout()
    }
    if (companyStore.currentCompany) {
      companyStore.logout(); // Pastikan store memiliki method logout()
    }

    // Hapus dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
    localStorage.removeItem("tokenCompany");

    // Tutup dropdown
    avatarOpen.value = false;

    // Show notification
    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Logged out successfully",
      showConfirmButton: false,
      timer: 2000,
    });

    // Redirect ke home
    router.push({ name: "home-page" });
  } catch (error) {
    console.error("Logout error:", error);
    Swal.fire({
      icon: "error",
      title: "Logout Failed",
      text: error.message || "Failed to logout",
    });
  }
};

// Toggle dropdown
const toggleAvatar = () => {
  avatarOpen.value = !avatarOpen.value;
};

// Close dropdown ketika klik di luar
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    avatarOpen.value = false;
  }
  if (
    menu.value &&
    sidebarRef.value &&
    !sidebarRef.value.contains(event.target)
  ) {
    menu.value = false;
  }
};

// Event listeners
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.active {
  border-bottom: 2px solid rgb(182, 85, 238);
  padding-bottom: 1px;
}
</style>
