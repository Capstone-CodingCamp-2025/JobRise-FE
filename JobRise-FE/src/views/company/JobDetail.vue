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

    <div v-if="jobsStore.isLoading">Loading detail pekerjaan...</div>
    <div v-else-if="jobsStore.error">{{ jobsStore.error }}</div>
    <div v-else-if="jobsStore.jobDetail">
      <div
        class="flex w-full gap-x-6 md:gap-x-10 mb-6 md:mb-0 justify-between"
      >
        <div class="flex gap-x-10">
          <div
            class="w-20 h-20 md:w-28 md:h-28 bg-amber-300 rounded-sm"
          >
            <img
              :src="jobsStore.jobDetail.company_logo ? `http://localhost:3888/public/${jobsStore.jobDetail.company_logo}` : 'https://placehold.co/48x48/cccccc/000000?text=Logo'"
              :alt="jobsStore.jobDetail.company_name"
              class="object-cover w-full h-full"
            />
          </div>
          <div class="pt-1 md:pt-3">
            <p class="font-bold text-lg md:text-xl">{{ jobsStore.jobDetail.title }}</p>
            <p class="font-medium text-gray-600 text-sm md:text-base">
              {{ jobsStore.jobDetail.company_name }}
            </p>
          </div>
        </div>
        <div class="flex gap-x-2 md:gap-x-3 pt-2 md:pt-5 items-center">
          <router-link
            :to="{name: 'job-edit', params: {id: jobsStore.jobDetail.id}}"
            class="text-blue-700 bg-slate-200 h-max px-10 py-1 rounded-sm text-sm md:text-base"
          >Edit Post</router-link>

          <div class="relative">
            <button
              @click="toggleDropdown"
              class="bg-slate-200 h-max px-3 py-1 rounded-sm text-sm md:text-base cursor-pointer outline-none"
              :class="{ 'opacity-50 cursor-not-allowed': jobsStore.isLoading }"
              :disabled="jobsStore.isLoading"
            >
              <div class="flex items-center gap-x-1">
                <span
                  :class="{
                    'text-green-500': selectedStatus === 'active',
                    'text-red-500': selectedStatus === 'deactive',
                  }"
                >{{ selectedStatus === 'active' ? 'Active' : 'Deactive' }}</span>
                <Icon icon="iconoir:nav-arrow-down-solid" width="20" height="20" />
              </div>
            </button>
            <div
              v-if="isDropdownOpen"
              class="absolute top-full right-0 mt-1 bg-white shadow-md rounded-md z-10"
            >
              <button
                @click="selectStatus('active')"
                class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                :class="{ 'text-green-500': selectedStatus === 'active' }"
              >Active</button>
              <button
                @click="selectStatus('deactive')"
                class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                :class="{ 'text-red-500': selectedStatus === 'deactive' }"
              >Deactive</button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row justify-center bg-blue-200/40 w-full m-auto text-center my-6 md:my-10 rounded-md"
      >
        <div class="px-6 py-4 md:px-10 md:py-8 w-full outline outline-gray-300">
          <p class="font-semibold text-2xl md:text-3xl">Salary</p>
          <p class="text-green-400 font-medium text-sm md:text-base">
            Rp. {{ jobsStore.jobDetail.salary_min }} - {{ jobsStore.jobDetail.salary_max }}
          </p>
        </div>
        <div class="px-6 py-4 md:px-10 md:py-8 w-full outline outline-gray-300">
          <p class="font-semibold text-2xl md:text-3xl">Location</p>
          <p class="text-gray-600 font-medium text-sm md:text-base">{{ jobsStore.jobDetail.location }}</p>
        </div>
        <div class="px-6 py-4 md:px-10 md:py-8 w-full outline outline-gray-300">
          <p class="font-semibold text-2xl md:text-3xl">Type</p>
          <p class="text-gray-600 font-medium text-sm md:text-base">
            {{ jobsStore.jobDetail.job_type }}
          </p>
        </div>
      </div>

      <div class="my-8 md:my-0">
        <h2 class="font-bold text-lg md:text-xl pb-6 md:pb-10">
          Job Description
        </h2>
        <p class="text-justify text-gray-500 text-sm md:text-base">
          {{ jobsStore.jobDetail.description }}
        </p>
      </div>

      <div>
        <Applications />
      </div>
    </div>
  </div>
</template>
<script setup>
import Applications from "@/components/company/Applications.vue";
import { JobsCompany } from '@/stores/jobs/companyjob'; // Pastikan path ini benar
import { onMounted, ref, watch } from 'vue'; // Import 'watch'
import { useRoute } from 'vue-router';
import { Icon } from "@iconify/vue";

const jobsStore = JobsCompany();
const route = useRoute();
const jobId = ref(parseInt(route.params.id));

const selectedStatus = ref(''); // State lokal untuk status yang dipilih
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectStatus = async (status) => {
  selectedStatus.value = status;
  isDropdownOpen.value = false;
  await updateJobStatus();
};

// Ketika jobDetail dimuat atau berubah, inisialisasi selectedStatus
watch(() => jobsStore.jobDetail, (newDetail) => {
  if (newDetail) {
    selectedStatus.value = newDetail.is_active;
  }
}, { immediate: true }); // immediate: true agar dijalankan saat komponen pertama kali dimuat

// Fungsi untuk memicu perubahan status
const updateJobStatus = async () => {
  if (selectedStatus.value === 'active') {
    await jobsStore.activateJob(jobId.value);
  } else if (selectedStatus.value === 'deactive') {
    await jobsStore.deactivateJob(jobId.value);
  }
  // Setelah update, jobDetail di store akan otomatis terupdate oleh fungsi activate/deactivate
  // sehingga UI akan bereaksi secara reaktif.
};

onMounted(() => {
  jobsStore.fetchJobDetail(jobId.value);
});
</script>