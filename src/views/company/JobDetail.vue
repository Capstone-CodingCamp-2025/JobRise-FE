<template>
  <div class="py-6 px-4 md:py-10 md:px-16 relative">
    <router-link :to="{ name: 'job-list' }" class="absolute right-10 top-5 z-20">
      <Icon
        icon="material-symbols:close-rounded"
        width="32"
        height="32"
        style="color: #606060"
      />
    </router-link>

    <div
      v-if="jobsStore.isLoading"
      class="absolute inset-0 top-32 bg-white/80 flex items-center justify-center z-10"
    >
      <div
        class="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-700"
      ></div>
    </div>

    <div v-else-if="jobsStore.error">{{ jobsStore.error }}</div>
    <div v-else-if="jobsStore.jobDetail">
      <div
        class="flex w-full gap-x-6 md:gap-x-10 mt-8 md:mt-0 mb-6 md:mb-0 justify-between"
      >
        <div class="flex gap-x-10">
          <div
            class="w-20 h-20 md:w-28 md:h-28 bg-amber-300 rounded-sm overflow-hidden flex-shrink-0"
          >
            <img
              :src="jobsStore.jobDetail.company_logo ? `https://jobrise.hotelmarisrangkas.com/public/${jobsStore.jobDetail.company_logo}` : 'https://placehold.co/112x112/e2e8f0/64748b?text=Logo'"
              :alt="jobsStore.jobDetail.company_name"
              class="object-cover w-full h-full"
            />
          </div>
          <div class="pt-1 md:pt-3">
            <p class="font-bold text-lg md:text-xl">{{ formatTitle(jobsStore.jobDetail.title) }}</p>
            <p class="font-medium text-gray-400 text-sm md:text-base">
              {{ formatTitle(jobsStore.jobDetail.company_name) }}
            </p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-y-3 gap-x-2 md:gap-x-3 pt-2 md:pt-5 items-center">
          <router-link
            :to="{name: 'job-edit', params: {id: jobsStore.jobDetail.id}}"
            class="text-blue-700 bg-slate-200 h-max px-3.5 md:px-4 lg:px-10 py-1 rounded-sm text-sm md:text-base hover:bg-slate-300 transition-colors"
          >Edit Post</router-link>

          <div class="relative">
            <button
              @click="toggleDropdown"
              class="h-max px-3 py-1 rounded-sm text-sm md:text-base cursor-pointer outline-none transition-colors duration-200 flex items-center"
              :class="[
                { 'opacity-50 cursor-not-allowed': jobsStore.isLoading },
                selectedStatus === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              ]"
              :disabled="jobsStore.isLoading"
            >
              <span clas>{{ selectedStatus === 'active' ? 'Active' : 'Deactive' }}</span>
              <!-- ▼▼▼ IKON TELAH DIPERBARUI ▼▼▼ -->
              <Icon icon="iconoir:nav-arrow-down-solid" width="20" height="20" class="ml-1" />
              <!-- ▲▲▲ AKHIR PERUBAHAN ▲▲▲ -->
            </button>
            <div
              v-if="isDropdownOpen"
              class="absolute top-full right-0 mt-1 bg-[#F0F3FA] shadow-md rounded-md z-10 w-full"
            >
              <button
                @click="selectStatus('active')"
                class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-green-600"
              >Active</button>
              <button
                @click="selectStatus('deactive')"
                class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
              >Deactive</button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row justify-center bg-[#F0F3FA] w-full m-auto text-center my-6 md:my-10 rounded-md overflow-hidden"
      >
        <div class="px-6 py-4 md:px-10 md:py-8 w-full border-l border-b border-r border-t  border-gray-300 flex flex-col gap-y-2">
          <p class="font-semibold text-2xl md:text-3xl">Salary</p>
          <p class="text-green-500 font-medium text-sm md:text-base">
            {{ formatGajiRingkas(jobsStore.jobDetail.salary_min) }} - {{ formatGajiRingkas(jobsStore.jobDetail.salary_max) }}
          </p>
        </div>
        <div class="px-6 py-4 md:px-10 md:py-8 w-full border-b border-t border-r border-gray-300 flex flex-col gap-y-2">
          <p class="font-semibold text-2xl md:text-3xl">Location</p>
          <p class="text-gray-500 font-medium text-sm md:text-base">{{ formatTitle(jobsStore.jobDetail.location) }}</p>
        </div>
        <div class="px-6 py-4 md:px-10 md:py-8 w-full flex flex-col gap-y-2 border-l border-t border-b border-r border-gray-300 ">
          <p class="font-semibold text-2xl md:text-3xl">Type</p>
          <p class="text-gray-500 font-medium text-sm md:text-base">
            {{ jobsStore.jobDetail.job_type }}
          </p>
        </div>
      </div>

      <div class="my-8 md:my-0">
        <h2 class="font-bold text-lg md:text-xl pb-6 md:pb-10">
          Job Description
        </h2>
        <p class="text-justify text-gray-500 text-sm md:text-base whitespace-pre-wrap">
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
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from "@iconify/vue";

const jobsStore = JobsCompany();
const route = useRoute();
const jobId = ref(parseInt(route.params.id));

const selectedStatus = ref('');
const isDropdownOpen = ref(false);

/**
 * Mengubah angka gaji menjadi format ringkas (juta/miliar) atau Rupiah standar.
 * @param {number | string} value Angka yang akan diformat.
 * @returns {string} String yang sudah diformat, contoh: "Rp 1,5 Juta".
 */
const formatGajiRingkas = (value) => {
  const numberValue = Number(value);

  if (isNaN(numberValue) || value === null || value === '') {
    return "N/A";
  }

  // Jika angka 1 Miliar atau lebih
  if (numberValue >= 1000000000) {
    const formatted = (numberValue / 1000000000).toFixed(1).replace(".0", "");
    return `Rp ${formatted.replace('.',',')} Miliar`;
  }

  // Jika angka 1 Juta atau lebih
  if (numberValue >= 1000000) {
    const formatted = (numberValue / 1000000).toFixed(1).replace(".0", "");
    return `Rp ${formatted.replace('.',',')} Juta`;
  }
 
  // Jika di bawah 1 Juta, gunakan format Rupiah biasa
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numberValue);
};

const formatTitle = (title) => {
  return title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectStatus = async (status) => {
  if (selectedStatus.value === status) {
      isDropdownOpen.value = false;
      return;
  }
  selectedStatus.value = status;
  isDropdownOpen.value = false;
  await updateJobStatus();
};

// Ketika jobDetail dimuat atau berubah, inisialisasi selectedStatus
watch(() => jobsStore.jobDetail, (newDetail) => {
  if (newDetail) {
    selectedStatus.value = newDetail.is_active;
  }
}, { immediate: true });

// Fungsi untuk memicu perubahan status
const updateJobStatus = async () => {
  if (selectedStatus.value === 'active') {
    await jobsStore.activateJob(jobId.value);
  } else if (selectedStatus.value === 'deactive') {
    await jobsStore.deactivateJob(jobId.value);
  }
};

onMounted(() => {
  jobsStore.fetchJobDetail(jobId.value);
});
</script>
