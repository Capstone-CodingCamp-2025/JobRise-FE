<script setup>
import FormAuthCompany from '@/components/company/partials/FormAuthCompany.vue';
</script>

<template>
  
  <main class="m-auto w-max py-10 lg:w-[690px]">
    <div class="bg-[#D5DEEF] rounded-lg">
      <h1 class="text-center font-bold text-2xl pt-4 md:text-3xl">Register</h1>
      <FormAuthCompany :isRegisterCompany="false" />
    </div>
  </main>
</template>