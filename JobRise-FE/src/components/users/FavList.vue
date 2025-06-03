<template>
  <div v-for="fav in favorite">
    <div class="flex justify-between gap-x-10 md:gap-x-0 py-5">
      <div class="flex gap-x-4">
        <div
          class="md:w-18 md:h-18 w-14 h-14 bg-amber-300 rounded-sm flex-shrink-0"
        >
          <img :src="fav.logo" alt="" class="object-cover w-full h-full" />
        </div>
        <div class="flex flex-col gap-y-4">
          <p class="font-bold text-sm md:text-lg">{{ fav.posisi }}</p>
          <div
            class="flex items-center text-gray-600 text-[10px] md:text-xs font-bold"
          >
            <Icon
              icon="charm:map-pin"
              width="14"
              height="14"
              class="mr-1"
              style="color: #718096"
            />
            Location
          </div>
        </div>
        <div class="md:pt-3 flex flex-col gap-y-2 md:gap-y-4">
          <p class="text-blue-800 font-bold text-[9px]">
            {{ fav.type.toUpperCase() }}
          </p>
          <p class="text-gray-600 text-[10px] md:text-xs font-medium">
            $ {{ fav.salary }}
          </p>
        </div>
      </div>
      <div class="pt-4 ">
        <div class="flex gap-x-4">
          <Icon
            icon="material-symbols:bookmark"
            width="40"
            height="40"
            style="color: #000"
          />
          <router-link
            :to="{ name: 'job-user-detail', params: { id: fav.id } }"
            class="relative bg-blue-950/80 text-white px-6 md:px-10 pr-8 md:pr-12 rounded-md pt-2 md:pt-2 text-sm md:text-md whitespace-nowrap"
          >
            Apply Now
            <Icon
              icon="pepicons-pencil:arrow-right"
              width="28"
              height="28"
              
              style="color: #ffff"
              class="absolute right-0 md:right-3 top-1.5 md:top-1.5"
            />
          </router-link>
        </div>
      </div>
    </div>
    <hr class="text-gray-200" />
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import axios from "axios";
import { ref } from "vue";
import { onMounted } from "vue";

const favorite = ref([]);
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3000/jobs");
    favorite.value = response.data;
    // Assuming your job objects have a 'status' and 'applied_date' property
    // Adjust accordingly if your data structure is different
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
});

console.log(favorite);
</script>
