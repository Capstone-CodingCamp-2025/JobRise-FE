<template>
  <div class="bg-blue-200/50 py-40 flex gap-10 m-auto px-44">
    <div
      class="bg-radial from-blue-200 from-20% to-gray-100 text-left rounded-lg px-10 py-8 shadow-md"
    >
      <h1 class="text-3xl font-bold mb-4">Become a Candiate</h1>
      <p class="text-sm font-base mb-5">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo in
        fuga non distinctio porro rerum? Ad eveniet
      </p>
      <router-link
        :to="{ name: 'register' }"
        class="bg-white rounded-full px-5 py-1 font-semibold flex w-max"
      >
        Register Now
        <Icon
          icon="solar:arrow-right-outline"
          width="24"
          height="24"
          style="color: #000"
          class="ml-2"
        />
      </router-link>
    </div>
    <div
      class="bg-radial from-blue-200 from-20% to-gray-100 text-left rounded-lg px-10 py-8 shadow-md"
    >
      <h1 class="text-3xl font-bold mb-4">Become a Employers</h1>
      <p class="text-sm font-base mb-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
        doloremque quidem itaque vitae eaque nemo eligendi mollitia optio
      </p>
      <router-link
        :to="{ name: 'register-company' }"
        class="bg-white rounded-full px-5 py-1 font-semibold flex w-max"
      >
        Register Now
        <Icon
          icon="solar:arrow-right-outline"
          width="24"
          height="24"
          style="color: #000"
          class="ml-2"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
