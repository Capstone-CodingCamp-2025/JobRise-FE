<template>
  <div class="">
    <ul
      class="md:flex hidden flex-col md:flex-row font-semibold justify-between py-8"
    >
      <!-- Menu items tetap sama -->
      <li>
        <router-link
          to=""
          class="md:hover:border-b-2 md:border-slate-700 text-blue-400 md:hover:text-slate-700 md:hover:text-sm"
          >User Profile</router-link
        >
      </li>
      <li>
        <router-link
          to=""
          class="md:hover:border-b-2 md:border-slate-700 text-blue-400 md:hover:text-slate-700 md:hover:text-sm"
          >Education</router-link
        >
      </li>
      <li>
        <router-link
          to=""
          class="md:hover:border-b-2 md:border-slate-700 text-blue-400 md:hover:text-slate-700 md:hover:text-sm"
          >Projects</router-link
        >
      </li>
      <li>
        <router-link
          to=""
          class="md:hover:border-b-2 md:border-slate-700 text-blue-400 md:hover:text-slate-700 md:hover:text-sm"
          >Experiences</router-link
        >
      </li>
      <li>
        <router-link
          to=""
          class="md:hover:border-b-2 md:border-slate-700 text-blue-400 md:hover:text-slate-700 md:hover:text-sm"
          >Skills</router-link
        >
      </li>
      <li>
        <router-link
          to=""
          class="md:hover:border-b-2 md:border-slate-700 text-blue-400 md:hover:text-slate-700 md:hover:text-sm"
          >Organization</router-link
        >
      </li>
      <li>
        <router-link
          to=""
          class="md:hover:border-b-2 md:border-slate-700 text-blue-400 md:hover:text-slate-700 md:hover:text-sm"
          >Certification</router-link
        >
      </li>
    </ul>
  </div>

  <!-- Menu popup -->
  <div
    v-if="showMenu"
    ref="menu"
    class="fixed bottom-18 right-2 bg-sky-300 shadow-xl rounded-lg z-10"
  >
    <!-- Isi menu tetap sama -->
    <ul class="space-y-2">
      <li>
        <button
          @click="addItem('User Profile')"
          class="p-2 rounded w-full text-center font-semibold text-blue-900"
        >
          User Profile
        </button>
      </li>
      <li>
        <button
          @click="addItem('Education')"
          class="p-2 rounded w-full text-center font-semibold text-blue-900"
        >
          Education
        </button>
      </li>
      <li>
        <button
          @click="addItem('Project')"
          class="p-2 rounded w-full text-center font-semibold text-blue-900"
        >
          Project
        </button>
      </li>
      <li>
        <button
          @click="addItem('Experience')"
          class="p-2 rounded w-full text-center font-semibold text-blue-900"
        >
          Experience
        </button>
      </li>
      <li>
        <button
          @click="addItem('Skill')"
          class="p-2 rounded w-full text-center font-semibold text-blue-900"
        >
          Skill
        </button>
      </li>
      <li>
        <button
          @click="addItem('Organization')"
          class="p-2 rounded w-full text-center font-semibold text-blue-900"
        >
          Organization
        </button>
      </li>
      <li>
        <button
          @click="addItem('Certification')"
          class="p-2 rounded w-full text-center font-semibold text-blue-900"
        >
          Certification
        </button>
      </li>
    </ul>
  </div>

  <!-- Icon yang bisa berubah -->
  <div
    class="fixed bottom-8 right-5 cursor-pointer md:hidden rotate-45"
    @click.stop="toggleMenu"
  >
    <Icon
      :icon="showMenu ? 'mdi:plus-circle' : 'octicon:x-circle-fill-12'"
      width="40"
      height="40"
      style="color: #4650cc"
    />
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const showMenu = ref(false);
const menu = ref(null);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const addItem = (itemType) => {
  console.log(`Adding new ${itemType}`);
  showMenu.value = false;
};

const handleClickOutside = (event) => {
  if (menu.value && !menu.value.contains(event.target)) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
