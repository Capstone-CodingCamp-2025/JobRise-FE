<template>
  <div class="px-2 md:px-8 lg:px-14">
    <div class="flex justify-between">
      <h1 class="font-bold text-xl md:text-2xl">Latest Applications</h1>
      <div class="flex gap-x-1">
        <router-link
          :to="{name: 'job-list'}"
          class="font-semibold text-md lg:text-lg text-blue-800"
          >View all
        </router-link>
        <Icon
          icon="solar:arrow-right-outline"
          width="20"
          height="20"
          style="color: #3b25db"
          class="mt-0.5 lg:mt-1"
        />
      </div>
    </div>
    <RecentTable  />
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import RecentTable from "@/components/company/RecentTable.vue"

</script>
