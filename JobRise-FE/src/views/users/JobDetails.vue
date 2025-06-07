<template>
  <div class="py-6 px-4 md:py-10 md:px-16 relative">
    <router-link
      :to="{ name: 'find-job' }"
      class="absolute right-4 top-2 md:right-10 md:top-3 z-10"
    >
      <Icon
        icon="material-symbols:close-rounded"
        width="28"
        height="28"
        md:width="32"
        md:height="32"
        style="color: #606060"
      />
    </router-link>

    <div
      v-if="loadingInitialData"
      class="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]"
    >
      <Icon
        icon="eos-icons:loading"
        width="60"
        height="60"
        class="text-blue-600"
      />
      <p class="mt-3 text-lg text-gray-700">Loading job details...</p>
    </div>

    <div
      v-else-if="pageError"
      class="text-center py-20 min-h-[calc(100vh-200px)]"
    >
      <Icon
        icon="material-symbols:error-outline"
        width="70"
        height="70"
        class="text-red-500 mx-auto mb-4"
      />
      <p class="text-xl text-red-600 font-semibold">Failed to Load Page Data</p>
      <p class="text-gray-600 mt-2">
        {{ pageError.message || "An unknown error occurred." }}
      </p>
      <button
        @click="initializePageData"
        class="mt-6 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
      >
        Try Again
      </button>
    </div>

    <div v-else-if="jobDetail" class="job-detail-content">
      <div
        class="flex flex-col md:flex-row justify-between w-full mb-4 md:mb-0"
      >
        <div
          class="flex w-full gap-x-4 md:gap-x-10 mb-4 md:mb-0 justify-start items-center"
        >
          <div
            class="w-16 h-16 md:w-22 md:h-22 bg-slate-200 rounded-sm flex-shrink-0 flex justify-center items-center overflow-hidden"
          >
            <img
              v-if="jobDetail.company_logo"
              :src="
                jobDetail.company_logo.startsWith('http')
                  ? jobDetail.company_logo
                  : `${baseImageUrl}${jobDetail.company_logo}`
              "
              :alt="jobDetail.company_name || 'Company Logo'"
              class="object-cover w-full h-full"
              @error="handleImageError"
            />
            <span
              v-if="isLogoError || !jobDetail.company_logo"
              class="text-slate-500 text-sm"
              >No Logo</span
            >
          </div>
          <div class="flex flex-col gap-y-3">
            <p class="font-bold text-md md:text-xl">{{ jobDetail.title }}</p>
            <p class="font-bold text-gray-400 text-xs md:text-sm">
              {{ jobDetail.company_name }}
            </p>
          </div>
        </div>

        <div class="flex pt-2 md:pt-5 gap-x-2 md:gap-x-4 items-center">
          <button
            @click="toggleFavoriteHandler"
            :disabled="isTogglingFavorite"
            class="p-1.5 rounded-full hover:bg-gray-200 active:bg-gray-300 ..."
            :title="
              isCurrentJobFavorited
                ? 'Remove from Favorites'
                : 'Add to Favorites'
            "
          >
            <Icon
              v-if="isTogglingFavorite"
              icon="eos-icons:loading"
              width="36"
              height="36"
            />
            <Icon
              v-else
              :icon="
                isCurrentJobFavorited
                  ? 'material-symbols:bookmark-rounded'
                  : 'material-symbols:bookmark-outline'
              "
              width="36"
              height="36"
              :style="{ color: isCurrentJobFavorited ? '#0C4A6E' : '#606060' }"
            />
          </button>
          <button
            @click="handleApplyNow"
            :disabled="
              isApplying ||
              isEffectivelyApplied ||
              jobDetail.status === 'inactive'
            "
            :class="[
              'text-white w-auto min-w-[128px] md:min-w-[160px] px-3 md:px-4 py-1.5 md:pt-2 text-center h-8 md:h-10 relative rounded-md text-xs md:text-sm flex items-center justify-center transition-colors duration-150 ease-in-out',
              isEffectivelyApplied || jobDetail.status === 'inactive'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-950/80 hover:bg-blue-900 disabled:opacity-70 disabled:cursor-not-allowed',
            ]"
          >
            <span v-if="isApplying">Melamar...</span>
            <span v-else-if="isEffectivelyApplied">Delivered</span>
            <span v-else-if="jobDetail.status === 'inactive'"
              >Lowongan Ditutup</span
            >
            <span v-else>Apply</span>
            <Icon
              v-if="
                !isApplying &&
                !isEffectivelyApplied &&
                jobDetail.status !== 'inactive'
              "
              icon="pepicons-pencil:arrow-right"
              width="18"
              height="18"
              md:width="24"
              md:height="24"
              style="color: #ffff"
              class="ml-2"
            />
            <Icon
              v-if="isApplying"
              icon="eos-icons:loading"
              width="18"
              height="18"
              md:width="20"
              md:height="20"
              style="color: #ffff"
              class="ml-2"
            />
          </button>
        </div>
      </div>

      <div class="">
        <div
          class="flex flex-col md:flex-row justify-around bg-[#F0F3FA] w-full text-center my-4 md:my-10 rounded-md overflow-hidden"
        >
          <div
            class="px-4 py-3 md:px-10 md:py-8 w-full border-b border-l border-t border-r border-slate-300"
          >
            <p class="font-semibold text-xl md:text-3xl">Salary</p>

            <p class="text-green-500 font-medium text-xs md:text-base">
              {{ formatGajiRingkas(jobDetail.salary_min) }} - {{ formatGajiRingkas(jobDetail.salary_max) }}
            </p>
          </div>

          <div
            class="px-4 py-3 md:px-10 md:py-8 w-full border-b border-r border-t border-slate-300"
          >
            <p class="font-semibold text-xl md:text-3xl">Location</p>

            <p class="text-gray-400 font-medium text-xs md:text-base">
              {{ jobDetail.location }}
            </p>
          </div>

          <div class="px-4 py-3 md:px-10 md:py-8 w-full border-b border-slate-300 border-t border-r">
            <p class="font-semibold text-xl md:text-3xl">Type</p>

            <p class="text-gray-400 font-medium text-xs md:text-base">
              {{ jobDetail.job_type }}
            </p>
          </div>
        </div>
      </div>

      <div class="my-6 md:my-0">
        <h2 class="font-bold text-lg md:text-xl pb-4 md:pb-10">
          Job Description
        </h2>

        <div
          v-if="jobDetail.description"
          class="text-justify text-gray-600 text-sm md:text-base leading-relaxed prose max-w-none"
          v-html="jobDetail.description"
        ></div>

        <p
          v-else
          class="text-justify text-gray-600 text-sm md:text-base leading-relaxed"
        >
          Job description not provided.
        </p>
      </div>
    </div>
    <div v-else class="text-center py-20 min-h-[calc(100vh-200px)]">
      <Icon
        icon="mdi:text-box-search-outline"
        width="70"
        height="70"
        class="text-gray-400 mx-auto mb-4"
      />
      <p class="text-xl text-gray-500">Job details could not be found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { useActiveJobRecommendationsStore } from "@/stores/jobs/userjob";
import { AuthUserStorage } from "@/stores/auth/userAuth";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const jobStore = useActiveJobRecommendationsStore();
const authStore = AuthUserStorage();

const baseImageUrl = ref("http://localhost:3888/public/");

const currentJobId = computed(() => {
  const id = route.params.id;
  return id ? parseInt(id) : null;
});

const jobDetail = computed(() => jobStore.currentJobDetail);

const loadingInitialData = ref(true);
const pageError = ref(null);

const isApplying = ref(false);
const hasAppliedThisSession = ref(false);
const isLogoError = ref(false);
// PERUBAHAN DI SINI: State loading lokal untuk tombol favorit
const isTogglingFavorite = ref(false);

const hasAppliedBasedOnStore = computed(() => {
  if (
    !authStore.tokenUser ||
    !currentJobId.value ||
    !jobStore.userAppliedJobs ||
    jobStore.userAppliedJobs.length === 0
  ) {
    return false;
  }
  return jobStore.userAppliedJobs.some(
    (application) =>
      application.Job?.id === currentJobId.value ||
      application.job_id === currentJobId.value
  );
});

const isEffectivelyApplied = computed(() => {
  return hasAppliedBasedOnStore.value || hasAppliedThisSession.value;
});

const isCurrentJobFavorited = computed(() => {
  if (!currentJobId.value || !jobStore.userFavoriteJobIds) return false;
  return jobStore.userFavoriteJobIds.has(currentJobId.value);
});

const handleImageError = (event) => {
  event.target.src = "";
  isLogoError.value = true;
};

const formatSalary = (min, max) => {
  const cleanMin = String(min || "").replace(/[^0-9.-]+/g, "");
  const cleanMax = String(max || "").replace(/[^0-9.-]+/g, "");
  const numericMin = parseFloat(cleanMin);
  const numericMax = parseFloat(cleanMax);

  if (
    !isNaN(numericMin) &&
    !isNaN(numericMax) &&
    numericMin > 0 &&
    numericMax > 0
  )
    return `${formatCurrency(numericMin)} - ${formatCurrency(numericMax)}`;
  if (!isNaN(numericMin) && numericMin > 0)
    return `Mulai dari ${formatCurrency(numericMin)}`;
  if (!isNaN(numericMax) && numericMax > 0)
    return `Hingga ${formatCurrency(numericMax)}`;
  if (min && String(min).toLowerCase() !== "null" && String(min) !== "")
    return String(min);
  return "N/A";
};

const formatCurrency = (value) => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

// File: job-user-detail.vue
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
// File: job-user-detail.vue

const initializePageData = async () => {
  loadingInitialData.value = true;
  pageError.value = null;
  isLogoError.value = false;
  hasAppliedThisSession.value = false;

  if (!currentJobId.value) {
    pageError.value = { message: "Job ID tidak ditemukan di URL." };
    loadingInitialData.value = false;
    return;
  }

  try {
    // LANGKAH 1: Muat data KRITIS (detail pekerjaan) terlebih dahulu.
    await jobStore.fetchJobDetailById(currentJobId.value, authStore.tokenUser);

    // Jika data kritis ini GAGAL, hentikan proses dan tampilkan halaman error.
    if (jobStore.errorJobDetail) {
      throw jobStore.errorJobDetail;
    }

    // LANGKAH 2: Jika data kritis BERHASIL, muat data TAMBAHAN (favorit & lamaran)
    // di latar belakang tanpa menghentikan tampilan utama.
    if (authStore.tokenUser) {
      // Panggil fungsi ini tanpa 'await' di dalam try-catch utama.
      // Biarkan mereka berjalan sendiri. UI akan update jika sudah selesai.
      jobStore.fetchUserFavoriteJobs(authStore.tokenUser, {
        page: 1,
        limit: 1000,
        isFullRefreshOfFavoriteIds: true,
      });
      jobStore.fetchUserAppliedJobs(authStore.tokenUser, {
        page: 1,
        limit: 500,
      });
    }
  } catch (e) {
    // Blok catch ini sekarang HANYA untuk menangani kegagalan data kritis.
    console.error("Gagal memuat data detail pekerjaan:", e);
    pageError.value = e;
  } finally {
    // Hentikan loading utama setelah data kritis selesai,
    // agar halaman bisa segera ditampilkan.
    loadingInitialData.value = false;
  }
};
// PERUBAHAN DI SINI: Logika toggleFavoriteHandler diperbarui
// File: job-user-detail.vue

const toggleFavoriteHandler = async () => {
  if (!authStore.tokenUser) {
    Swal.fire("Akses Ditolak", "Silakan login untuk mengubah favorit.", "warning");
    return;
  }
  if (!jobDetail.value || !currentJobId.value) {
    Swal.fire("Error", "Detail pekerjaan tidak tersedia.", "error");
    return;
  }

  // Mulai loading state
  isTogglingFavorite.value = true;

  try {
    const jobId = currentJobId.value;

    if (isCurrentJobFavorited.value) {
      // Panggil aksi hapus favorit dengan JOB ID, bukan favorite ID.
      // Biarkan store yang mencari favorite ID jika diperlukan.
      // Ini membuat kode komponen lebih bersih dan andal.
      await jobStore.deleteFavoriteJob(jobId, authStore.tokenUser);
    } else {
      // Aksi tambah favorit sudah benar.
      await jobStore.createFavoriteJob(jobId, authStore.tokenUser);
    }
  } catch (error) {
    console.error("Gagal mengubah status favorit di komponen:", error);
    // SweetAlert untuk error sudah ditangani di dalam store,
    // jadi tidak perlu ditambahkan di sini kecuali untuk kasus khusus.
  } finally {
    // Hentikan loading state, baik berhasil maupun gagal
    isTogglingFavorite.value = false;
  }
};

// ... sisa script (handleApplyNow, onMounted) tidak berubah ...
const handleApplyNow = async () => {
  if (!authStore.tokenUser) {
    Swal.fire({
      title: "Anda Belum Login",
      text: "Silakan login terlebih dahulu untuk melamar pekerjaan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login Sekarang",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push({ name: "login-user" });
      }
    });
    return;
  }

  if (!jobDetail.value || !currentJobId.value) {
    Swal.fire(
      "Error",
      "Detail pekerjaan tidak ditemukan untuk dilamar.",
      "error"
    );
    return;
  }

  if (
    jobDetail.value.status === "inactive" ||
    jobDetail.value.is_active === "deactive"
  ) {
    // Pastikan properti ini ada di API Anda
    Swal.fire(
      "Lowongan Ditutup",
      "Maaf, lowongan pekerjaan ini sudah tidak aktif.",
      "info"
    );
    return;
  } // Cek sekali lagi jika sudah pernah melamar (double check, karena isEffectivelyApplied sudah ada)

  if (isEffectivelyApplied.value) {
    Swal.fire("Informasi", "Anda sudah pernah melamar pekerjaan ini.", "info");
    return;
  }

  isApplying.value = true;
  try {
    const response = await jobStore.applyToJob(
      currentJobId.value,
      authStore.tokenUser
    ); // Swal sukses sudah dari store
    hasAppliedThisSession.value = true; // Tandai berhasil apply di sesi ini // Opsional: refresh daftar lamaran di store untuk konsistensi data langsung // await jobStore.fetchUserAppliedJobs(authStore.tokenUser, { page: 1, limit: 10 });

    setTimeout(() => {
      router.push({ name: "applied" }); // Arahkan ke halaman daftar lamaran
    }, 1500); // Beri waktu Swal dari store tampil dulu
  } catch (error) {
    // Swal error sudah dari store
    // Jika error karena sudah apply, update state lokal juga
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Job already applied"
    ) {
      hasAppliedThisSession.value = true; // atau panggil fetchUserAppliedJobs untuk sinkronisasi penuh // Untuk memastikan `hasAppliedBasedOnStore` juga update jika error "Job already applied" berarti data backend sudah ada
      if (authStore.tokenUser) {
        await jobStore.fetchUserAppliedJobs(authStore.tokenUser, {
          page: 1,
          limit: 500,
        });
      }
    }
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Harus isi Profile terlebih dahulu"
    ) {
      Swal.fire({
        title: "Profil Belum Lengkap",
        text: "Silakan lengkapi profil Anda terlebih dahulu untuk melamar pekerjaan.",
        icon: "info",
        confirmButtonText: "Lengkapi Profil",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push({ name: "user-profile-edit" });
        }
      });
    } // Error lain ditangani oleh Swal di store
  } finally {
    isApplying.value = false;
  }
};

onMounted(() => {
  initializePageData();
});
</script>
<style scoped>
/* Untuk render HTML dari v-html (deskripsi pekerjaan) */
.prose :deep(ul),
.prose :deep(ol) {
  list-style-position: inside;
  padding-left: 1.5em; /* atau sesuai kebutuhan */
  margin-left: 0; /* Reset margin default jika ada */
}
.prose :deep(li) {
  margin-bottom: 0.5em;
}
.prose :deep(p) {
  margin-bottom: 1em;
}
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  margin-bottom: 0.5em;
  margin-top: 1em;
  font-weight: bold;
}
</style>
