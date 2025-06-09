<template>
  <div class="px-4 pb-10 sm:px-8">
    <h1 class="font-bold text-xl sm:text-2xl py-4">Post a Job</h1>
    <div
      class="bg-[#D5DEEF] w-full px-4 py-4 sm:px-8 sm:py-6 rounded-md shadow-xs"
    >
      <div>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-2">
          <div class="flex flex-col gap-y-1">
            <label for="title" class="font-semibold text-sm sm:text-base"
              >Job Tittle <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="title"
              v-model="jobForm.title"
              class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
              placeholder="Example: FullStack Developer"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-x-4 gap-y-2">
            <div class="flex flex-col gap-y-1 w-full">
              <label for="job_type" class="font-semibold text-sm sm:text-base"
                >Job Type <span class="text-red-500">*</span></label
              >
              <select
                id="job_type"
                v-model="jobForm.job_type"
                class="bg-white px-2 h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base"
                :class="{ 'select-placeholder': jobForm.job_type === '' }"
              >
                <option value="" disabled selected>
                  Chose Type Job...
                </option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div class="flex flex-col gap-y-1 w-full">
              <label for="location" class="font-semibold text-sm sm:text-base"
                >Location <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                id="location"
                v-model="jobForm.location"
                class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
                placeholder="Example: Jakarta Timur"
              />
            </div>
          </div>

          <div>
            <p class="text-blue-800/90 font-bold text-sm sm:text-base">
              Salary
            </p>
            <div class="flex flex-col sm:flex-row gap-x-4 gap-y-2">
              <div class="flex flex-col gap-y-1 w-full">
                <label
                  for="salary_min"
                  class="font-semibold text-sm sm:text-base"
                  >Min. <span class="text-red-500">*</span></label
                >
                <input
                  type="number"
                  id="salary_min"
                  v-model="jobForm.salary_min"
                  min="0"
                  class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
                  placeholder="Example: 4000000"
                />
              </div>
              <div class="flex flex-col gap-y-1 w-full">
                <label
                  for="salary_max"
                  class="font-semibold text-sm sm:text-base"
                  >Max. <span class="text-red-500">*</span></label
                >
                <input
                  type="number"
                  id="salary_max"
                  v-model="jobForm.salary_max"
                  min="0"
                  class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
                  placeholder="Example: 6000000"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-1">
            <label for="description" class="font-semibold text-sm sm:text-base"
              >Description job <span class="text-red-500">*</span></label
            >
            <textarea
              id="description"
              v-model="jobForm.description"
              class="bg-white h-24 sm:h-38 pt-1 rounded-sm outline outline-blue-800 text-sm sm:text-base px-2"
              placeholder="Description Responsibility"
            ></textarea>
          </div>
          <div class="pt-4 sm:pt-6">
            <div class="flex gap-x-2 justify-end">
              <button
                type="submit"
                :disabled="jobsStore.isLoading"
                class="bg-blue-950/90 text-white cursor-pointer rounded-md px-4 py-1 text-sm sm:text-base flex items-center justify-center"
              >
                <span v-if="jobsStore.isLoading" class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting...
                </span>
                <span v-else>Post a Job</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { JobsCompany } from "@/stores/jobs/companyjob";
import { ref } from "vue";
// Import SweetAlert
import Swal from "sweetalert2";

// Menggunakan store Pinia
const jobsStore = JobsCompany();

// Data form untuk input pekerjaan
const jobForm = ref({
  title: "",
  description: "",
  salary_min: "",
  salary_max: "",
  location: "",
  job_type: "", // Nilai default
});

/**
 * Fungsi yang dipanggil saat form disubmit.
 * Memanggil aksi `createJobPost` dari store Pinia.
 */
const handleSubmit = async () => {
  // Buat daftar semua field yang wajib diisi dan nama tampilannya
  const requiredFields = {
    title: "Job Tittle",
    job_type: "Job Type", // <-- Tambahkan job_type ke daftar wajib
    location: "Location",
    salary_min: "Minimum Salary",
    salary_max: "Maximum Salary",
    description: "Description",
  };

  // Lakukan perulangan untuk mengecek setiap field
  for (const field in requiredFields) {
    if (!jobForm.value[field] || String(jobForm.value[field]).trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Input Incomplete",
        text: `Please complete all the data.`,
      });
      return; // Hentikan fungsi jika ada yang kosong
    }
  }

  // Jika semua validasi lolos, lanjutkan proses
  await jobsStore.createJobPost(jobForm.value);

  if (!jobsStore.error) {
    jobForm.value = {
      title: "",
      description: "",
      salary_min: "",
      salary_max: "",
      location: "",
      job_type: "", // Reset ke string kosong juga
    };
  }
};
</script>
<style scoped>
.select-placeholder {
  color: #6b7280; /* Ini adalah warna abu-abu (Tailwind's gray-500) */
}
</style>
