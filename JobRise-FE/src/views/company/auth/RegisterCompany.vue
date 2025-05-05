<script setup>
import Navbar from '../../../components/Navbar.vue'
import FormAuthCompany from '@/components/company/partials/FormAuthCompany.vue';
</script>

<template>
  <header>
    <Navbar/>
  </header>
  <main class="pt-32 px-84">
    <div class="bg-[#D5DEEF]  rounded-lg">
      <h1 class="text-center font-bold text-4xl pt-6">Register</h1>
      <FormAuthCompany :isRegisterCompany="false" />
    </div>
  </main>
</template>