<script setup>
import FormAuthCompany from "@/components/company/partials/FormAuthCompany.vue";
import Navbar from "../../../components/Navbar.vue";
</script>

<template>
  <header>
    <Navbar />
  </header>
  <main class="pt-32 px-84">
    <div class="bg-[#D5DEEF] rounded-lg">
      <h1 class="text-center font-bold text-4xl pt-6">Sign in</h1>
      <FormAuthCompany :isRegisterCompany="true" />
    </div>
  </main>
</template>
