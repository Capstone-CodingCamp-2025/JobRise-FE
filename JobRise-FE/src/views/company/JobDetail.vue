<template>
  <div class="py-6 px-4 md:py-10 md:px-16 relative">
    <router-link :to="{ name: 'job-list' }" class="absolute right-10 top-5">
      <Icon
        icon="material-symbols:close-rounded"
        width="32"
        height="32"
        style="color: #606060"
      />
    </router-link>

    <div class="flex flex-col md:flex-row justify-between w-full mb-6 md:mb-0">
      <div
        class="flex w-full gap-x-6 md:gap-x-10 mb-4 md:mb-0 justify-center md:justify-start"
      >
        <div
          class="w-20 h-20 md:w-28 md:h-28 bg-amber-300 rounded-sm flex-shrink-0"
        >
          <img
            :src="applications.logo"
            alt=""
            class="object-cover w-full h-full"
          />
        </div>
        <div class="pt-1 md:pt-3">
          <p class="font-bold text-lg md:text-xl">{{ applications.posisi }}</p>
          <p class="font-medium text-gray-600 text-sm md:text-base">
            {{ applications.company }}
          </p>
        </div>
      </div>

      <div class="flex justify-between gap-x-2 md:gap-x-3 pt-2 md:pt-5">
        <router-link
          to=""
          class="text-blue-700 bg-slate-200 h-max px-4 py-1 rounded-sm text-sm md:text-base"
          >Edit</router-link
        >
        <span
          class="bg-slate-200 h-max px-4 py-1 rounded-sm text-sm md:text-base"
          :class="{
            'text-green-500': applications.status === 'active',
            'text-red-500': applications.status === 'inactive',
          }"
        >
          {{ applications.status }}
        </span>
      </div>
    </div>

    <div
      class="flex flex-col md:flex-row justify-center bg-blue-200/40 w-full m-auto text-center my-6 md:my-10 rounded-md"
    >
      <div class="px-6 py-4 md:px-10 md:py-8 w-full outline outline-gray-300">
        <p class="font-semibold text-2xl md:text-3xl">Salary</p>
        <p class="text-green-400 font-medium text-sm md:text-base">
          {{ applications.salary }}
        </p>
      </div>
      <div class="px-6 py-4 md:px-10 md:py-8 w-full outline outline-gray-300">
        <p class="font-semibold text-2xl md:text-3xl">Location</p>
        <p class="text-gray-600 font-medium text-sm md:text-base">City</p>
      </div>
      <div class="px-6 py-4 md:px-10 md:py-8 w-full outline outline-gray-300">
        <p class="font-semibold text-2xl md:text-3xl">Type</p>
        <p class="text-gray-600 font-medium text-sm md:text-base">
          {{ applications.type }}
        </p>
      </div>
    </div>

    <div class="my-8 md:my-0">
      <h2 class="font-bold text-lg md:text-xl pb-6 md:pb-10">
        Job Description
      </h2>
      <p class="text-justify text-gray-500 text-sm md:text-base">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto eaque
        minima ut necessitatibus error ducimus corporis laboriosam harum
        blanditiis sed earum assumenda voluptate facere non dolores cupiditate
        illo rem, tempora alias at fuga? Nihil incidunt aliquid accusamus non
        quas ratione, facere vitae voluptate adipisci molestiae cum ipsum
        distinctio neque omnis quod. Vitae soluta voluptatem id, eligendi
        dignissimos, aliquam in accusamus amet voluptatum corrupti et
        consectetur reiciendis. Voluptas necessitatibus in consequatur iste
        nostrum sit, magni quia laborum nam eum, nisi cupiditate dolorem
        doloremque repudiandae veniam ratione eveniet ex quasi pariatur?
        Expedita odit atque alias. Quis, ex exercitationem quisquam dolorum et
        fugit!
      </p>
    </div>

    <div>
      <Applications />
    </div>
  </div>
</template>
<script setup>
import Applications from "@/components/company/Applications.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Icon } from "@iconify/vue";

const route = useRoute();
const jobId = ref(route.params.id);
const applications = ref([]);

onMounted(async () => {
  try {
    // Ganti URL ini dengan endpoint API yang sesuai untuk mendapatkan aplikasi berdasarkan job ID
    const response = await axios.get(
      `http://localhost:3000/jobs/${jobId.value}`
    );
    applications.value = response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
  }
});
console.log(applications);
</script>
