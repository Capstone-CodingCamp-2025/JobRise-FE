<template>
  <div class="px-4 pb-10 sm:px-8">
    <h1 class="font-bold text-xl sm:text-2xl py-4">Edit Job Posting</h1>
    <div class="bg-[#D5DEEF] w-full px-4 py-4 sm:px-8 sm:py-6 rounded-md shadow-xs">
      <div v-if="jobsStore.isLoading" class="text-center py-8">
        <p class="text-blue-800 font-semibold text-lg">Loading Data Job...</p>
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="jobsStore.error" class="text-center py-8 text-red-600">
        <p class="font-semibold text-lg">Terjadi kesalahan:</p>
        <p class="mt-2">{{ jobsStore.error }}</p>
      </div>

      <div v-else-if="jobsStore.jobDetail">
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-2">
          <div class="flex flex-col gap-y-1">
            <label for="title" class="font-semibold text-sm sm:text-base">Job Title</label>
            <input
              type="text"
              id="title"
              v-model="jobForm.title"
              required
              class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
              placeholder="Example: FullStack Developer"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-x-4 gap-y-2">
            <div class="flex flex-col gap-y-1 w-full">
              <label for="job_type" class="font-semibold text-sm sm:text-base">Job Type</label>
              <select
                id="job_type"
                v-model="jobForm.job_type"
                required
                class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div class="flex flex-col gap-y-1 w-full">
              <label for="location" class="font-semibold text-sm sm:text-base">Location</label>
              <input
                type="text"
                id="location"
                v-model="jobForm.location"
                required
                class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
                placeholder="Example: Jakarta Timur"
              />
            </div>
          </div>

          <div>
            <p class="text-blue-800/90 font-bold text-sm sm:text-base">Salary</p>
            <div class="flex flex-col sm:flex-row gap-x-4 gap-y-2">
              <div class="flex flex-col gap-y-1 w-full">
                <label for="salary_min" class="font-semibold text-sm sm:text-base">Min.</label>
                <input
                  type="text"
                  id="salary_min"
                  v-model="jobForm.salary_min"
                  required
                  class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
                  placeholder="Example: 4000000"
                />
              </div>
              <div class="flex flex-col gap-y-1 w-full">
                <label for="salary_max" class="font-semibold text-sm sm:text-base">Max.</label>
                <input
                  type="text"
                  id="salary_max"
                  v-model="jobForm.salary_max"
                  required
                  class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
                  placeholder="Example: 5000000"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-1">
            <label for="description" class="font-semibold text-sm sm:text-base">Description job</label>
            <textarea
              id="description"
              v-model="jobForm.description"
              required
              class="bg-white h-24 sm:h-38 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
              placeholder="Please Explain Description, etc."
            ></textarea>
          </div>
          <div class="pt-4 sm:pt-6">
            <div class="flex gap-x-2 justify-end">
              <button
                type="submit"
                :disabled="jobsStore.isLoading"
                class="bg-blue-950/90 text-white rounded-md px-4 py-1 text-sm sm:text-base flex items-center justify-center cursor-pointer"
              >
                <span v-if="jobsStore.isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
                <span v-else>Update Job</span>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div v-else class="text-center py-8 text-gray-600">
        <p class="font-semibold text-lg">Job not found or cannot be loaded.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router"; 
import { JobsCompany } from "@/stores/jobs/companyjob";

const jobsStore = JobsCompany();
const route = useRoute();
const router = useRouter(); 
const jobId = ref(parseInt(route.params.id));

const jobForm = ref({
  title: '',
  description: '',
  salary_min: '',
  salary_max: '',
  location: '',
  job_type: '',
});

onMounted(() => {
  jobsStore.fetchJobDetail(jobId.value);
});

watch(() => jobsStore.jobDetail, (newDetail) => {
  if (newDetail) {
    console.log("The 'job_type' data from the API:", newDetail.job_type);
    console.log("Data type from the API:", typeof newDetail.job_type);

    const optionValues = ["Full-Time", "Part-Time", "Contract", "Internship"];
    console.log("The value that is in <option> HTML:", optionValues);
    console.log(
      "Is there anything suitable? ",
      optionValues.includes(newDetail.job_type)
    );
    jobForm.value = {
      title: newDetail.title,
      description: newDetail.description,
      salary_min: newDetail.salary_min,
      salary_max: newDetail.salary_max,
      location: newDetail.location,
      job_type: newDetail.job_type,
      is_active : newDetail.is_active
    };
  }
}, { immediate: true });

const handleSubmit = async () => {
  const isSuccess = await jobsStore.updateJobPost(jobId.value, jobForm.value);

  if (isSuccess) {
    router.push({ 
      name: 'job-detail', 
      params: { id: jobId.value } 
    });
  }
};
</script>

