<script setup>
import FormAuth from "@/components/users/partials/FormAuth.vue";
</script>

<template>
  <main class="py-38 px-84">
    <div class="bg-[#D5DEEF] rounded-lg">
      <h1 class="text-center font-bold text-4xl pt-6">Sign in</h1>
      <FormAuth :is-register="true" />
    </div>
  </main>
</template>
