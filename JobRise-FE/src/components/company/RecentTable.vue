<template>
  <div class="relative my-5">
    <div class="overflow-auto">
      <table class="table-auto text-center w-full">
        <thead class="bg-slate-200 text-center">
          <tr>
            <th
              class="min-w-[200px] py-2 md:py-3 rounded-l-lg font-normal text-left pl-4 md:pl-20"
            >
              Jobs
            </th>
            <th class="min-w-[150px] py-2 md:py-3 font-normal">Applications</th>
            <th class="min-w-[150px] py-2 md:py-3 font-normal">Status</th>
            <th class="min-w-[180px] py-2 md:py-3 rounded-r-lg font-normal">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in displayedJobs"
            :key="job.id"
            class="border-b border-gray-300"
          >
            <td class="py-4 pl-4 text-left">
              <div class="flex items-center">
                {{ console.log(job.company_logo)
                 }}
                <img
                  :src="job.company_logo ? `http://localhost:3888/public/${job.company_logo}` : 'https://placehold.co/48x48/cccccc/000000?text=Logo'"
                  :alt="job.company_name"
                  class="object-cover w-10 h-10 rounded mr-2 md:w-12 md:h-12 md:mr-4"
                />
                <div>
                  <p class="font-semibold text-sm md:text-base">
                    {{ job.title }}
                  </p>
                  <div
                    class="flex items-center text-gray-600 text-xs md:text-sm"
                  >
                    <Icon
                      icon="charm:map-pin"
                      width="14"
                      height="14"
                      class="mr-1"
                      style="color: #718096"
                    />
                    {{ job.location }}
                  </div>
                  <p class="text-gray-700 text-xs md:text-sm mt-1">
                    Rp. {{ job.salary_min }} - {{ job.salary_max }}
                  </p>
                </div>
              </div>
            </td>
            <td class="py-6 md:py-9 flex justify-center text-xs md:text-base">
              <Icon
                icon="healthicons:people-outline"
                width="20"
                height="20"
                class="mr-1"
                style="color: #606060"
              />
              {{ job.total_apply || 0 }} applications
            </td>
            <td class="py-4 text-xs md:text-sm">
              <div class="flex items-center justify-center">
                <template v-if="job.is_active === 'active'">
                  <Icon
                    icon="tabler:check"
                    width="16"
                    height="16"
                    style="color: #09ff19"
                    class="mr-1"
                  />
                  Active
                </template>
                <template v-else-if="job.is_active === 'deactive'">
                  <Icon
                    icon="tabler:x"
                    width="16"
                    height="16"
                    style="color: #ff3d00"
                    class="mr-1"
                  />
                  Inactive
                </template>
                <template v-else>
                  {{ job.is_active }}
                </template>
              </div>
            </td>
            <td class="py-4 text-xs md:text-sm">
              <router-link
                :to="{ name: 'job-detail', params: { id: job.id } }"
                class="font-base px-3 py-1 rounded-lg text-white bg-[#0c1f61d3] hover:bg-[#091a52]"
              >
                View Details
              </router-link>
            </td>
          </tr>
          <tr v-if="jobsStore.isLoading">
            <td colspan="4" class="py-4 text-center text-gray-500">
              Loading jobs...
            </td>
          </tr>
          <tr v-else-if="jobsStore.error">
            <td colspan="4" class="py-4 text-center text-red-500">
              {{ jobsStore.error }}
            </td>
          </tr>
          <tr v-else-if="displayedJobs.length === 0">
            <td colspan="4" class="py-4 text-center text-gray-500">
              No jobs available.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="bg-gradient-to-l from-transparent via-gray-300/10 to-gray-300/30 w-5 md:w-20 h-full absolute left-0 bottom-0"
    ></div>
    <div
      class="bg-gradient-to-r from-transparent via-gray-300/10 to-gray-300/30 w-5 md:w-20 h-full absolute right-0 bottom-0"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { JobsCompany } from "@/stores/jobs/companyjob";

// Menggunakan store Pinia
const jobsStore = JobsCompany();

// Computed property untuk mengambil 4 data pekerjaan teratas
const displayedJobs = computed(() => {
  return jobsStore.companyJobs.slice(0, 4);
});

// Panggil fungsi untuk mengambil daftar pekerjaan (dengan limit 4) saat komponen dimuat
onMounted(() => {
  jobsStore.fetchCompanyJobs(1, 4); // Ambil halaman pertama dengan 4 item per halaman
});
</script>

<style scoped>
/* No additional scoped styles needed for this functionality */
</style>
