<script setup>
import FormAuth from "@/components/users/partials/FormAuth.vue";
</script>

<template>
  <main class="m-auto w-max py-10 lg:w-[690px]">
    <div class="bg-[#D5DEEF] rounded-lg">
      <h1 class="text-center font-bold text-2xl pt-4 md:text-3xl">Login</h1>
      <FormAuth :is-register="true" />
    </div>
  </main>
</template>
