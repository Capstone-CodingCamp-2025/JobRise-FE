<script setup>
import FormAuthCompany from "@/components/company/partials/FormAuthCompany.vue";
</script>

<template>
  
  <main class="w-max m-auto py-20 lg:pt-38 lg:w-[690px] xl:py-38">
    <div class="bg-[#D5DEEF] rounded-lg">
      <h1 class="text-center font-bold text-2xl pt-4 md:text-3xl xl:pt-16">Sign in</h1>
      <FormAuthCompany :isRegisterCompany="true" />
    </div>
  </main>
</template>
