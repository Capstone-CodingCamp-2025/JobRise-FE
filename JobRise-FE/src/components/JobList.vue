<template>
  <div
    v-for="job in jobs"
    class=" flex flex-col gap-4 mt-12 shadow-xl shadow-sky-100/90 text-white px-5 py-4 rounded-lg bg-linear-to-b from-blue-900/80 via-[#8AAEE0] to-[#D5DEEF] to-80%"
  >
    <h1 class="font-bold text-xl">{{ job.posisi }}</h1>
    <div class="flex gap-10">
      <p class="bg-[#B1C9EF] text-blue-800 font-bold px-2">{{ job.type }}</p>
      <p class="font-bold text-lg">Salary: {{ job.salary }}</p>
    </div>
    <div class="flex gap-9">
      <a href="" class="bg-white w-24 h-16 place-content-center">
        <img
          :src="job.logo"
          alt="company"
          class="m-auto w-max h-max"
        />
      </a>
      <a href="">
        <p class="pt-3 text-xl font-bold">{{ job.company }}</p>
      </a>
    </div>
    <a href="">
      <Icon
        icon="lucide:bookmark"
        width="32"
        height="32"
        style="color: #000"
        class="ml-72"
      />
    </a>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const id = Number(new Date());

const jobs = ref([
  {
    id: id,
    posisi: "Back-end Developer",
    type: "Paruh Waktu",
    salary: "1 JT - 3 JT",
    logo: "https://assets.cdn.dicoding.com/original/commons/new-ui-logo.png",
    company: "PT. Solusi",
  },
  {
    id: id,
    posisi: "Back-end Developer",
    type: "Paruh Waktu",
    salary: "1 JT - 3 JT",
    logo: "https://assets.cdn.dicoding.com/original/commons/new-ui-logo.png",
    company: "PT. Solusi",
  },
  {
    id: id,
    posisi: "Back-end Developer",
    type: "Paruh Waktu",
    salary: "1 JT - 3 JT",
    logo: "https://assets.cdn.dicoding.com/original/commons/new-ui-logo.png",
    company: "PT. Solusi",
  },
  {
    id: id,
    posisi: "Back-end Developer",
    type: "Paruh Waktu",
    salary: "1 JT - 3 JT",
    logo: "https://assets.cdn.dicoding.com/original/commons/new-ui-logo.png",
    company: "PT. Solusi",
  },
  {
    id: id,
    posisi: "Back-end Developer",
    type: "Paruh Waktu",
    salary: "1 JT - 3 JT",
    logo: "https://assets.cdn.dicoding.com/original/commons/new-ui-logo.png",
    company: "PT. Solusi",
  },
  {
    id: id,
    posisi: "Back-end Developer",
    type: "Paruh Waktu",
    salary: "1 JT - 3 JT",
    logo: "https://assets.cdn.dicoding.com/original/commons/new-ui-logo.png",
    company: "PT. Solusi",
  },
]);
</script>
