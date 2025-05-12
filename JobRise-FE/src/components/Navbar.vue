<template>
  <div
    class="bg-[#D5DEEF] w-full p-1 md:p-6 flex flex-col justify-between sticky top-0 z-30 shadow-lg"
  >
    <div class="flex justify-between">
      <div class="flex gap-2">
        <div
          class="pt-2 lg:hidden"
          @click="openMenu"
          v-if="
            $route.name !== 'role-login' &&
            $route.name !== 'role-register' &&
            $route.name !== 'login' &&
            $route.name !== 'register' &&
            $route.name !== 'login-company' &&
            $route.name !== 'register-company'
          "
        >
          <Icon
            icon="material-symbols:menu-rounded"
            width="32"
            height="32"
            style="color: #000"
          />
        </div>
        <div>
          <router-link :to="{ name: 'home-page' }">
            <img src="../../../public/jobrise.png" class="w-28" alt="JobRise" />
          </router-link>
        </div>

        <div class="hidden lg:flex gap-x-4">
          <div class="pt-2">
            <router-link
              :to="{ name: 'dashboard' }"
              class="text-lg text-[#334EAC] font-bold"
              active-class="active"
              v-if="
                $route.name !== 'home-page' &&
                $route.name !== 'role-login' &&
                $route.name !== 'role-register' &&
                $route.name !== 'login' &&
                $route.name !== 'register' &&
                $route.name !== 'login-company' &&
                $route.name !== 'register-company'
              "
            >
              Dashboard
            </router-link>
          </div>
          <div class="pt-2">
            <router-link
              :to="{ name: 'profile' }"
              class="text-lg text-[#334EAC] font-bold"
              active-class="active"
              v-if="
                $route.name !== 'home-page' &&
                $route.name !== 'role-login' &&
                $route.name !== 'role-register' &&
                $route.name !== 'login' &&
                $route.name !== 'register' &&
                $route.name !== 'login-company' &&
                $route.name !== 'register-company'
              "
            >
              Profile
            </router-link>
          </div>
          <div class="pt-2" v-if="$route.name === 'home-page'">
            <router-link
              :to="{ name: 'home-page' }"
              active-class="active"
              class="text-lg text-[#334EAC] font-bold"
            >
              Home
            </router-link>
          </div>

          <div class="pt-2">
            <router-link
              :to="{ name: 'register' }"
              class="text-lg text-[#334EAC] font-bold"
              active-class="active"
              v-if="
                $route.name !== 'home-page' &&
                $route.name !== 'role-login' &&
                $route.name !== 'role-register' &&
                $route.name !== 'login' &&
                $route.name !== 'register' &&
                $route.name !== 'login-company' &&
                $route.name !== 'register-company'
              "
            >
              CV
            </router-link>
          </div>
          <div class="pt-2">
            <router-link
              :to="{ name: 'login' }"
              class="text-lg text-[#334EAC] font-bold"
              active-class="active"
              v-if="
                $route.name !== 'role-login' &&
                $route.name !== 'role-register' &&
                $route.name !== 'login' &&
                $route.name !== 'register' &&
                $route.name !== 'login-company' &&
                $route.name !== 'register-company'
              "
            >
              Find Job
            </router-link>
          </div>
          <div class="pt-2" v-if="$route.name === 'home-page'">
            <router-link
              :to="{ name: 'register' }"
              class="text-lg text-[#334EAC] font-bold"
              active-class="active"
            >
              Employers
            </router-link>
          </div>

          <div class="pt-2">
            <router-link
              :to="{ name: 'register' }"
              class="text-lg text-[#334EAC] font-bold"
              active-class="active"
              v-if="
                $route.name !== 'home-page' &&
                $route.name !== 'role-login' &&
                $route.name !== 'role-register' &&
                $route.name !== 'login' &&
                $route.name !== 'register' &&
                $route.name !== 'login-company' &&
                $route.name !== 'register-company'
              "
            >
              Applied
            </router-link>
          </div>
          <div class="pt-2">
            <router-link
              :to="{ name: 'register' }"
              class="text-lg text-[#334EAC] font-bold"
              active-class="active"
              v-if="
                $route.name !== 'home-page' &&
                $route.name !== 'role-login' &&
                $route.name !== 'role-register' &&
                $route.name !== 'login' &&
                $route.name !== 'register' &&
                $route.name !== 'login-company' &&
                $route.name !== 'register-company'
              "
            >
              Favorite Job
            </router-link>
          </div>
        </div>
      </div>

      <div
        class="pt-2 relative hidden md:block"
        v-if="$route.name === 'home-page' || $route.name === 'dashboard'"
      >
        <input
          type="text"
          placeholder="Search text"
          class="bg-[#ECE6F0] w-max text-center rounded-full outline-none py-2 placeholder:pr-10"
        />

        <Icon
          icon="material-symbols:search"
          width="24"
          height="24"
          class="absolute inset-x-36 inset-y-4"
        />
      </div>

      <div v-if="$route.name === 'home-page'">
        <div class="flex gap-4 pt-3 md:pt-2">
          <router-link
            :to="{ name: 'role-login' }"
            class="md:text-xl font-semibold text-blue-800 outline rounded-full w-20 md:w-full md:px-6 text-center md:pb-2 md:pt-1 outline-blue-800 hover:bg-blue-300"
          >
            Sign in
          </router-link>

          <router-link
            :to="{ name: 'role-register' }"
            class="text-white bg-blue-900 rounded-full md:text-xl font-semibold pb-0.5 w-20 md:w-full md:px-6 md:pb-2 md:pt-1 text-center hover:bg-blue-950"
          >
            Register
          </router-link>
        </div>
      </div>
      <div
        class="pt-2"
        v-if="
          $route.name !== 'home-page' &&
          $route.name !== 'role-login' &&
          $route.name !== 'role-register' &&
          $route.name !== 'login' &&
          $route.name !== 'register' &&
          $route.name !== 'login-company' &&
          $route.name !== 'register-company'
        "
      >
        <Icon
          icon="cuida:logout-outline"
          width="32"
          height="32"
          style="color: #000"
        />
      </div>
    </div>
  </div>
  <!-- mobile menu -->

  <div
    v-if="menu"
    class="flex flex-col gap-y-4 pt-2 w-44 md:w-64 h-full text-center fixed top-0 bg-[#D5DEEF] shadow-lg z-50"
    id="menu"
    ref="sidebar"
  >
    <div class="pl-10 md:pl-20 mb-8">
      <router-link :to="{ name: 'home-page' }">
        <img src="../../../public/jobrise.png" class="w-28" alt="JobRise" />
      </router-link>
    </div>

    <div v-if="$route.name === 'home-page'">
      <router-link
        :to="{ name: 'home-page' }"
        class="text-2xl text-[#334EAC] font-bold focus:text-blue-950 focus:text-lg"
      >
        Home
      </router-link>
    </div>

    <div v-if="$route.name === 'home-page'">
      <router-link
        to=""
        class="text-2xl text-[#334EAC] font-bold focus:text-blue-950 focus:text-lg"
      >
        Find Job
      </router-link>
    </div>
    <div v-if="$route.name === 'home-page'">
      <router-link
        to=""
        class="text-2xl text-[#334EAC] font-bold focus:text-blue-950 focus:text-lg"
      >
        Employers
      </router-link>
    </div>
    <div>
      <router-link
        to=""
        class="text-2xl text-[#334EAC] font-bold focus:text-blue-950 focus:text-lg"
        v-if="
          $route.name !== 'home-page' &&
          $route.name !== 'role-login' &&
          $route.name !== 'role-register' &&
          $route.name !== 'login' &&
          $route.name !== 'register' &&
          $route.name !== 'login-company' &&
          $route.name !== 'register-company'
        "
      >
        Dashboard
      </router-link>
    </div>
    <div>
      <router-link
        to=""
        class="text-2xl text-[#334EAC] font-bold focus:text-blue-950 focus:text-lg"
        v-if="
          $route.name !== 'home-page' &&
          $route.name !== 'role-login' &&
          $route.name !== 'role-register' &&
          $route.name !== 'login' &&
          $route.name !== 'register' &&
          $route.name !== 'login-company' &&
          $route.name !== 'register-company'
        "
      >
        Profile
      </router-link>
    </div>
    <div>
      <router-link
        to=""
        class="text-2xl text-[#334EAC] font-bold focus:text-blue-950 focus:text-lg"
        v-if="
          $route.name !== 'home-page' &&
          $route.name !== 'role-login' &&
          $route.name !== 'role-register' &&
          $route.name !== 'login' &&
          $route.name !== 'register' &&
          $route.name !== 'login-company' &&
          $route.name !== 'register-company'
        "
      >
        Post a job
      </router-link>
    </div>
    <div>
      <router-link
        to=""
        class="text-2xl text-[#334EAC] font-bold focus:text-blue-950 focus:text-lg"
        v-if="
          $route.name !== 'home-page' &&
          $route.name !== 'role-login' &&
          $route.name !== 'role-register' &&
          $route.name !== 'login' &&
          $route.name !== 'register' &&
          $route.name !== 'login-company' &&
          $route.name !== 'register-company'
        "
      >
        Applications
      </router-link>
    </div>
    <div>
      <router-link
        to=""
        class="text-2xl text-[#334EAC] font-bold focus:text-blue-950 focus:text-lg"
        v-if="
          $route.name !== 'home-page' &&
          $route.name !== 'role-login' &&
          $route.name !== 'role-register' &&
          $route.name !== 'login' &&
          $route.name !== 'register' &&
          $route.name !== 'login-company' &&
          $route.name !== 'register-company'
        "
      >
        Logout
      </router-link>
    </div>
  </div>

  <!-- end mobile menu -->
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { onBeforeUnmount } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";

const menu = ref(false);
const sidebar = ref(null);

const openMenu = () => {
  menu.value = !menu.value;
};

const closeMenuOnClickOutside = (event) => {
  if (!menu.value || !sidebar.value) return; // Jika menu sudah tertutup atau sidebar tidak ada, keluar

  const clickedElement = event.target;
  const isSidebarClicked = sidebar.value.contains(clickedElement);
  const isMenuButtonClicked = clickedElement.closest(".pt-2.lg\\:hidden"); // Cek apakah elemen yang diklik adalah tombol menu atau anaknya

  if (!isSidebarClicked && !isMenuButtonClicked) {
    menu.value = false; // Tutup menu hanya jika klik di luar sidebar DAN bukan tombol menu
  }
};

// Tambahkan event listener ketika komponen dimount
onMounted(() => {
  document.addEventListener("click", closeMenuOnClickOutside);
});

// Hapus event listener ketika komponen di-unmount
onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenuOnClickOutside);
});
</script>

<style scoped>
.active {
  border-bottom: 2px solid rgb(182, 85, 238);
  padding-bottom: 1px;
}
</style>
