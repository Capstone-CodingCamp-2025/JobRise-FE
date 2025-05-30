<template>
  <div class="py-6 px-4 md:py-10 md:px-16 relative">
    <router-link :to="{ name: 'applied' }" class="absolute right-4 top-2 md:right-10 md:top-2">
      <Icon
        icon="material-symbols:close-rounded"
        width="28"
        height="28"
        md:width="32"
        md:height="32"
        style="color: #606060"
      />
    </router-link>
    <div class="flex flex-col md:flex-row justify-between w-full mb-4 md:mb-0">
      <div
        class="flex w-full gap-x-4 md:gap-x-10 mb-4 md:mb-0 justify-start items-center"
      >
        <div
          class="w-16 h-16 md:w-28 md:h-28 bg-amber-300 rounded-sm flex-shrink-0"
        >
          <img
            :src="jobdetail.logo"
            alt=""
            class="object-cover w-full h-full"
          />
        </div>
        <div>
          <p class="font-bold text-base md:text-xl">{{ jobdetail.posisi }}</p>
          <p class="font-medium text-gray-600 text-xs md:text-base">
            {{ jobdetail.company }}
          </p>
        </div>
      </div>

      <div class="flex pt-2 md:pt-5 gap-x-2 md:gap-x-4">
        <Icon
          icon="material-symbols:bookmark-outline"
          width="32"
          height="32"
          md:width="38"
          md:height="38"
          style="color: #606060"
        />

        <router-link
          :to="{ name: 'find-job' }"
          class="bg-blue-950/80 text-white w-36 md:w-44 py-1.5 md:pt-2 text-center h-8 md:h-10 relative rounded-md pr-4 md:pr-6 text-xs md:text-sm"
        >
          Explore More Jobs
          <Icon
            icon="pepicons-pencil:arrow-right"
            width="18"
            height="18"
            md:width="24"
            md:height="24"
            style="color: #ffff"
            class="absolute inset-y-2 md:inset-y-2.5 right-1 md:right-2"
          />
        </router-link>
      </div>
    </div>
    <div class="px-4 md:px-10">
      <div
        class="flex flex-col md:flex-row justify-around bg-blue-200/40 w-full text-center my-4 md:my-10 rounded-md"
      >
        <div class="px-4 py-3 md:px-10 md:py-8 w-full">
          <p class="font-semibold text-xl md:text-3xl">Salary</p>
          <p class="text-green-400 font-medium text-xs md:text-base">
            {{ jobdetail.salary }}
          </p>
        </div>
        <div class="px-4 py-3 md:px-10 md:py-8 w-full">
          <p class="font-semibold text-xl md:text-3xl">Location</p>
          <p class="text-gray-600 font-medium text-xs md:text-base">City</p>
        </div>
        <div class="px-4 py-3 md:px-10 md:py-8 w-full">
          <p class="font-semibold text-xl md:text-3xl">Type</p>
          <p class="text-gray-600 font-medium text-xs md:text-base">
            {{ jobdetail.type }}
          </p>
        </div>
      </div>
    </div>
    <div class="my-6 md:my-0 px-4 md:px-10">
      <h2 class="font-bold text-lg md:text-xl pb-4 md:pb-10">
        Job Description
      </h2>
      <p class="text-justify text-gray-500 text-xs md:text-base leading-relaxed">
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

    <div class="py-16 md:py-28">
      <div class="bg-blue-200/40 w-fit m-auto flex gap-x-4 md:gap-x-10 px-6 py-3 rounded-md">
        <p class="text-blue-800 font-bold text-xl md:text-2xl">Status Apply</p>
        <p class="bg-white px-2 text-amber-400 py-1 rounded-md text-sm md:text-base">Screening</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Icon } from "@iconify/vue";

const route = useRoute();
const jobId = ref(route.params.id);
const jobdetail = ref([]);

onMounted(async () => {
  try {
    // Ganti URL ini dengan endpoint API yang sesuai untuk mendapatkan aplikasi berdasarkan job ID
    const response = await axios.get(
      `http://localhost:3000/jobs/${jobId.value}`
    );
    jobdetail.value = response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
  }
});
console.log(jobdetail);
</script>