<script setup>
import FormAuthCompany from '@/components/company/partials/FormAuthCompany.vue';
</script>

<template>
  
  <main class="py-32 px-84">
    <div class="bg-[#D5DEEF]  rounded-lg">
      <h1 class="text-center font-bold text-4xl pt-6">Register</h1>
      <FormAuthCompany :isRegisterCompany="false" />
    </div>
  </main>
</template>