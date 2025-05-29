<template>
  <div class="px-4 md:px-8 lg:px-12 text-center">
    <h1 class="font-bold text-2xl md:text-3xl">
      Halo,
      <span v-if="user?.name">
        {{ user.name[0]?.toUpperCase() + user.name?.substring(1) }}
      </span>
      <span v-else>
        Pengguna
      </span>
    </h1>
    <p class="font-semibold text-gray-400 text-md py-3">
      Here is your daily activies and job alerts
    </p>
    <div class="flex gap-x-2 md:gap-x-6">
      <div
        class="bg-[#b8caecda] outline w-full rounded-lg shadow-lg m-auto place-items-center text-justify py-2 md:py-6"
      >
        <h2 class="font-bold text-xl">XXX</h2>
        <p class="text-md font-semibold text-slate-700">Applied jobs</p>
      </div>
      <div
        class="bg-[#b8caecda] outline w-full rounded-lg shadow-lg m-auto place-items-center text-justify py-2 md:py-6"
      >
        <h2 class="font-bold text-xl">XXX</h2>
        <p class="text-md font-semibold text-slate-700">Favorite jobs</p>
      </div>
      <div
        class="bg-[#b8caecda] outline w-full rounded-lg shadow-lg m-auto place-items-center text-justify py-2 md:py-6"
      >
        <h2 class="font-bold text-xl">XXX</h2>
        <p class="text-md font-semibold text-slate-700">Jobs alerts</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { AuthUserStorage } from '@/stores/auth/userAuth';

const user = AuthUserStorage().currentUser
console.log(user);
</script>