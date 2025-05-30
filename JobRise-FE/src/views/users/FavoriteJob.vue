<script setup lang="ts">
import FavList from "@/components/users/FavList.vue";
</script>

<template>
  <div class="px-4 py-4 md:px-10">
    <h1 class="font-bold text-xl md:text-2xl mb-4 text-center md:text-left">Favorite Job</h1>
    <div class="pt-4 md:pt-8 overflow-x-auto">
      <FavList />
    </div>
  </div>
</template>