<template>
  <div class="px-4 md:px-8 lg:px-12">
    <p class="font-semibold text-gray-400 text-md py-3">This your candidates</p>
    <div class="flex gap-x-2">
      <div
        class="bg-blue-700/50 w-max  rounded-lg shadow-lg px-10 md:px-22 lg:px-32 place-items-center text-justify py-2 md:py-6"
      >
        <h2 class="font-bold text-xl">XXX</h2>
        <p class="text-md font-semibold text-slate-700">Open jobs</p>
      </div>
      <div
        class="bg-blue-600/30 w-max  rounded-lg shadow-lg px-10 md:px-22 lg:px-32 place-items-center text-justify py-2 md:py-6"
      >
        <h2 class="font-bold text-xl">XXX</h2>
        <p class="text-md font-semibold text-slate-700">Saved candidate</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthCompanyStore } from '@/stores/auth/companyAuth';

const company = useAuthCompanyStore().currentCompany
console.log(company);

</script>