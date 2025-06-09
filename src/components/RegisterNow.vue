<template>
  <div
    class="pb-10 grid gap-y-8 m-auto px-4 md:px-6 md:grid-cols-2 md:gap-x-8 lg:px-32 xl:px-52"
  >
    <div
      class="bg-radial from-blue-200 from-20% to-white flex flex-col justify-between rounded-xl px-10 py-6 text-left md:py-10 shadow-md shadow-gray-400"
    >
      <div>
        <h1 class="text-3xl font-black mb-4">Jobseekers</h1>
        <p class="text-sm font-base mb-5">
          Discover jobs that fit your experience and goals, and connect with
          employers ready to hire
        </p>
      </div>
      <router-link
        :to="{ name: 'register' }"
        class="bg-blue-950/80 text-white rounded-full px-5 py-1 font-semibold flex w-max"
      >
        Register Now
        <Icon
          icon="solar:arrow-right-outline"
          width="24"
          height="24"
          style="color: #ffff"
          class="ml-2"
        />
      </router-link>
    </div>
    <div
      class="bg-radial from-blue-200 from-20% to-white flex flex-col justify-between rounded-lg px-10 py-6 text-left md:py-10 shadow-md shadow-gray-400"
    >
      <div>
        <h1 class="text-3xl font-black mb-4">Company</h1>
        <p class="text-sm font-base mb-5">
          Post jobs and reach talented professionals eager to help your business
          succeed.
        </p>
      </div>
      <router-link
        :to="{ name: 'register-company' }"
        class="bg-blue-950/80 text-white rounded-full px-5 py-1 font-semibold flex w-max"
      >
        Register Now
        <Icon
          icon="solar:arrow-right-outline"
          width="24"
          height="24"
          style="color: #ffff"
          class="ml-2"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { watch } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isLogin = ref(route.meta.isLogin === "true");
watch(
  () => route.query.login,
  (newVal) => {
    isLogin.value = newVal === "true";
  }
);
</script>
