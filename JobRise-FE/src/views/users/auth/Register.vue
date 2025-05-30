<script setup>
import FormAuth from "@/components/users/partials/FormAuth.vue";
</script>

<template>
  <main class="m-auto w-max py-10 lg:w-[690px] lg:py-20 xl:py-22">
    <div class="bg-[#D5DEEF] rounded-lg">
      <h1 class="text-center font-black text-2xl pt-4 md:text-3xl lg:pt-10 xl:pt-10">Register</h1>
      <FormAuth :is-register="false" />
    </div>
  </main>
</template>
