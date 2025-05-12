<script setup>
import FormAuthCompany from "@/components/company/partials/FormAuthCompany.vue";
</script>

<template>
  
  <main class="px-4 py-10 md:py-14 md:px-14 lg:px-44 xl:px-74">
    <div class="bg-[#D5DEEF] rounded-lg">
      <h1 class="text-center font-bold text-2xl pt-4 md:text-3xl">Sign in</h1>
      <FormAuthCompany :isRegisterCompany="true" />
    </div>
  </main>
</template>
