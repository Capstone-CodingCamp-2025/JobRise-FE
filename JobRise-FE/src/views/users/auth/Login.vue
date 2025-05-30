<script setup>
import FormAuth from "@/components/users/partials/FormAuth.vue";
</script>

<template>
  <main class="w-max m-auto py-20 lg:pt-38 lg:w-[690px] xl:pt-22">
    <div class="bg-[#D5DEEF] rounded-lg  ">
      <h1 class="text-center font-black text-2xl pt-4 lg:pt-10 md:text-3xl xl:pt-10">Login</h1>
      <FormAuth :is-register="true" class="mx-auto" />
    </div>
  </main>
</template>
