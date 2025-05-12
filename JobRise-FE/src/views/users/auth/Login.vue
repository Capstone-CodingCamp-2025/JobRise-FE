<script setup>
import FormAuth from "@/components/users/partials/FormAuth.vue";
</script>

<template>
  <main class="py-10 px-4  md:pt-14 md:px-14 lg:px-44 xl:px-74">
    <div class="bg-[#D5DEEF] rounded-lg">
      <h1 class="text-center font-bold text-2xl pt-4 md:text-3xl">Login</h1>
      <FormAuth :is-register="true" />
    </div>
  </main>
</template>
