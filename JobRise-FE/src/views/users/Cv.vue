<template>
  <div class="px-4 py-2 md:px-10 md:py-4">
    <div class="flex flex-col md:flex-row justify-between items-center mb-3">
      <h1 class="font-bold text-xl md:text-2xl md:pl-52 lg:pl-38 xl:pl-48 2xl:pl-[500px]">
        Curriculum Vitae
      </h1>
      <h1
        v-if="!isMobile"
        class="font-bold text-xl md:text-2xl mb-3 md:pr-28 lg:pr-48 xl:pr-66 2xl:pr-[570px] md:hidden lg:block"
      >
        Preview
      </h1>
    </div>

    <div class="flex flex-col lg:flex-row md:gap-y-10 gap-x-10">
      <div class="w-full">
        <div
          class="flex justify-between pb-2 px-2 md:pb-4 md:px-4"
          v-if="step === 'education'"
        >
          <div></div>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">
            Education
          </h2>
          <button
            class="bg-blue-950/90 text-white px-4 py-1 rounded-md text-sm md:px-6 cursor-pointer"
            @click="nextStep"
          >
            Next
          </button>
        </div>
        <div
          class="flex justify-between pb-2 px-2 md:pb-4 md:px-4"
          v-else-if="step === 'project'"
        >
          <button
            class="bg-gray-500/90 text-white px-4 py-1 rounded-md text-sm md:px-6 cursor-pointer"
            @click="prevStep"
          >
            Back
          </button>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">
            Project
          </h2>
          <button
            class="bg-blue-950/90 text-white px-4 py-1 rounded-md text-sm md:px-6 cursor-pointer"
            @click="nextStep"
          >
            Next
          </button>
        </div>
        <div
          class="flex justify-between pb-2 px-2 md:pb-4 md:px-4"
          v-else-if="step === 'experience'"
        >
          <button
            class="bg-gray-500/90 text-white px-4 py-1 rounded-md text-sm md:px-6 cursor-pointer"
            @click="prevStep"
          >
            Back
          </button>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">
            Experiences
          </h2>
          <button
            class="bg-blue-950/90 text-white px-4 py-1 rounded-md text-sm md:px-6 cursor-pointer"
            @click="nextStep"
          >
            Next
          </button>
        </div>
        <div
          class="flex justify-between pb-2 px-2 md:pb-4 md:px-4"
          v-else-if="step === 'skills'"
        >
          <button
            class="bg-gray-500/90 text-white px-4 py-1 rounded-md text-sm md:px-6 cursor-pointer"
            @click="prevStep"
          >
            Back
          </button>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">
            Skills
          </h2>
          <button
            class="bg-blue-950/90 text-white px-4 py-1 rounded-md text-sm md:px-6 cursor-pointer"
            @click="nextStep"
          >
            Next
          </button>
        </div>
        <div
          class="flex justify-between pb-2 px-2 md:pb-4 md:px-4"
          v-else-if="step === 'certifications'"
        >
          <button
            class="bg-gray-500/90 text-white px-4 py-1 rounded-md text-sm md:px-6 cursor-pointer"
            @click="prevStep"
          >
            Back
          </button>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">
            Certifications
          </h2>
          <!-- <button
            class="bg-blue-400/90 text-white px-2 py-1 flex gap-x-1 rounded-md text-sm cursor-pointer"
            @click="downloadCv"
          >
            <Icon
              icon="bytesize:download"
              width="24"
              height="24"
              style="color: #ffff"
            />
            <p>Download</p>
          </button> -->
        </div>

        <div
          class="bg-slate-300 px-3 py-2 md:px-6 md:py-3"
          v-if="step === 'education'"
        >
          <form
            @submit.prevent="saveEducation"
            class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2"
          >
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >School / University</label
              >
              <input
                v-model="currentEducation.name_school"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >Major</label
              >
              <input
                v-model="currentEducation.major"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >GPA</label
              >
              <input
                v-model="currentEducation.gpa"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >Start Date</label
              >
              <input
                v-model="currentEducation.start_date"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >End Date</label
              >
              <input
                v-model="currentEducation.end_date"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Description</label
              >
              <textarea
                v-model="currentEducation.description"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-16 text-sm md:h-24 px-2"
              ></textarea>
            </div>
            <div class="col-span-2 flex justify-end gap-x-2">
              <button
                v-if="currentEducation.id"
                type="button"
                class="bg-gray-500/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
              >
                {{ currentEducation.id ? "Update" : "Save" }}
              </button>
            </div>
          </form>
        </div>

        <div
          class="bg-slate-300 px-3 py-2 md:px-6 md:py-3"
          v-else-if="step === 'project'"
        >
          <form
            @submit.prevent="saveProject"
            class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2"
          >
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Title</label
              >
              <input
                v-model="currentProject.title"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Project Link</label
              >
              <input
                v-model="currentProject.link"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >Start Date</label
              >
              <input
                v-model="currentProject.start_date"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >End Date</label
              >
              <input
                v-model="currentProject.end_date"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Description</label
              >
              <textarea
                v-model="currentProject.description"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-16 text-sm md:h-24 px-2"
              ></textarea>
            </div>
            <div class="col-span-2 flex justify-end gap-x-2">
              <button
                v-if="currentProject.id"
                type="button"
                class="bg-gray-500/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
                @click="cancelProjectEdit"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
              >
                {{ currentProject.id ? "Update" : "Save" }}
              </button>
            </div>
          </form>
        </div>

        <div
          class="bg-slate-300 px-3 py-2 md:px-6 md:py-3"
          v-else-if="step === 'experience'"
        >
          <form
            @submit.prevent="saveExperience"
            class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2"
          >
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Title</label
              >
              <input
                v-model="currentExperience.title"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Company</label
              >
              <input
                v-model="currentExperience.company"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >Start Date</label
              >
              <input
                v-model="currentExperience.start_date"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >End Date</label
              >
              <input
                v-model="currentExperience.end_date"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Description</label
              >
              <textarea
                v-model="currentExperience.description"
                class="bg-slate-100 rounded-sm outline outline-blue-800 px-2 h-16 text-sm md:h-24"
              ></textarea>
            </div>
            <div class="col-span-2 flex justify-end gap-x-2">
              <button
                v-if="currentExperience.id"
                type="button"
                class="bg-gray-500/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
                @click="cancelExperienceEdit"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
              >
                {{ currentExperience.id ? "Update" : "Save" }}
              </button>
            </div>
          </form>
        </div>

        <div
          class="bg-slate-300 px-3 py-2 md:px-6 md:py-3"
          v-else-if="step === 'skills'"
        >
          <form
            @submit.prevent="saveSkill"
            class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2"
          >
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >Name</label
              >
              <input
                v-model="currentSkill.name"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >Level</label
              >
              <input
                v-model="currentSkill.level"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="col-span-2 flex justify-end gap-x-2">
              <button
                v-if="currentSkill.id"
                type="button"
                class="bg-gray-500/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
                @click="cancelSkillEdit"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
              >
                {{ currentSkill.id ? "Update" : "Save" }}
              </button>
            </div>
          </form>
        </div>

        <div
          class="bg-slate-300 px-3 py-2 md:px-6 md:py-3"
          v-else-if="step === 'certifications'"
        >
          <form
            @submit.prevent="saveCertification"
            class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2"
          >
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Name</label
              >
              <input
                v-model="currentCertification.name"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >Year</label
              >
              <input
                v-model="currentCertification.year"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base"
                >Issued By</label
              >
              <input
                v-model="currentCertification.issueBy"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >ID Credential / URL</label
              >
              <input
                v-model="currentCertification.credentialId"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base"
                >Description</label
              >
              <textarea
                v-model="currentCertification.description"
                class="bg-slate-100 rounded-sm outline outline-blue-800 px-2 h-16 text-sm md:h-24"
              ></textarea>
            </div>
            <div class="col-span-2 flex justify-end gap-x-2">
              <button
                v-if="currentCertification.id"
                type="button"
                class="bg-gray-500/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
                @click="cancelCertificationEdit"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1 cursor-pointer"
              >
                {{ currentCertification.id ? "Update" : "Save" }}
              </button>
            </div>
          </form>
        </div>

        <div
          class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4"
          v-if="step === 'education'"
        >
          <p
            v-if="educationStore.isLoading"
            class="m-auto col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            <Icon
              icon="eos-icons:loading"
              width="24"
              height="24"
              style="color: #5152ce"
            />
          </p>
          <p
            v-else-if="educationStore.error"
            class="col-span-2 text-center text-red-500 py-1 text-sm md:py-2"
          >
            Harap isi profile terlebih dahulu
          </p>
          <div
            v-else-if="educationStore.educations.length > 0"
            v-for="edu in educationStore.educations"
            :key="edu.id"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ edu.name_school }}</p>
            <p>{{ edu.major }}</p>
            <p>
              {{ formatDate(edu.start_date) }} - {{ formatDate(edu.end_date) }}
            </p>
            <p>{{ edu.gpa }}</p>
            <p class="text-gray-700 text-xs">{{ edu.description }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button
                class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4 cursor-pointer"
                @click="editEducation(edu)"
              >
                Edit
              </button>
              <button
                class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3 cursor-pointer py-1"
                @click="deleteEducation(edu.id)"
              >
                Delete
              </button>
            </div>
          </div>
          <div
            v-else
            class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            No education added yet.
          </div>
        </div>

        <div
          class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4"
          v-if="step === 'project'"
        >
          <p
            v-if="projectStore.isLoading"
            class="m-auto col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            <Icon
              icon="eos-icons:loading"
              width="24"
              height="24"
              style="color: #5152ce"
            />
          </p>
          <p
            v-else-if="projectStore.error"
            class="col-span-2 text-center text-red-500 py-1 text-sm md:py-2"
          >
            Harap isi profile terlebih dahulu
          </p>
          <div
            v-else-if="projectStore.projects.length > 0"
            v-for="project in projectStore.projects"
            :key="project.id"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ project.title }}</p>
            <p class="text-blue-700 text-xs" v-if="project.link_url">
              <a :href="project.link_url" target="_blank">Project Link</a>
            </p>
            <p>
              {{ formatDate(project.start_date) }} -
              {{ formatDate(project.end_date) }}
            </p>
            <p class="text-gray-700 text-xs">{{ project.description }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button
                class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4 cursor-pointer"
                @click="editProject(project)"
              >
                Edit
              </button>
              <button
                class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3 py-1 cursor-pointer"
                @click="deleteProjectFromStore(project.id)"
              >
                Delete
              </button>
            </div>
          </div>
          <div
            v-else
            class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            No projects added yet.
          </div>
        </div>

        <div
          class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4"
          v-if="step === 'experience'"
        >
          <p
            v-if="experienceStore.isLoading"
            class="m-auto col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            <Icon
              icon="eos-icons:loading"
              width="24"
              height="24"
              style="color: #5152ce"
            />
          </p>
          <p
            v-else-if="experienceStore.error"
            class="col-span-2 text-center text-red-500 py-1 text-sm md:py-2"
          >
            Harap isi profile terlebih dahulu
          </p>
          <div
            v-else-if="experienceStore.experiences.length > 0"
            v-for="exp in experienceStore.experiences"
            :key="exp.id"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ exp.title }}</p>
            <p>{{ exp.company_name }}</p>
            <p>
              {{ formatDate(exp.start_date) }} - {{ formatDate(exp.end_date) }}
            </p>
            <p class="text-gray-700 text-xs">{{ exp.description }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button
                class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4 cursor-pointer"
                @click="editExperience(exp)"
              >
                Edit
              </button>
              <button
                class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3 py-1 cursor-pointer"
                @click="deleteExperience(exp.id)"
              >
                Delete
              </button>
            </div>
          </div>
          <div
            v-else
            class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            No work experiences added yet.
          </div>
        </div>

        <div
          class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4"
          v-if="step === 'skills'"
        >
          <p
            v-if="skillStore.isLoading"
            class="m-auto col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            <Icon
              icon="eos-icons:loading"
              width="24"
              height="24"
              style="color: #5152ce"
            />
          </p>
          <p
            v-else-if="skillStore.error"
            class="col-span-2 text-center text-red-500 py-1 text-sm md:py-2"
          >
            Harap isi profile terlebih dahulu
          </p>
          <div
            v-else-if="skillStore.skills.length > 0"
            v-for="skill in skillStore.skills"
            :key="skill.id"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ skill.name }}</p>
            <p>Level: {{ skill.level }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button
                class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4 cursor-pointer"
                @click="editSkill(skill)"
              >
                Edit
              </button>
              <button
                class="bg-blue-950/90 text-white px-2 rounded-md text-xs py-1 md:px-3 cursor-pointer"
                @click="deleteSkillFromStore(skill.id)"
              >
                Delete
              </button>
            </div>
          </div>
          <div
            v-else
            class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            No skills added yet.
          </div>
        </div>

        <div
          class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4"
          v-if="step === 'certifications'"
        >
          <p
            v-if="certificationStore.isLoading"
            class="m-auto col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            <Icon
              icon="eos-icons:loading"
              width="24"
              height="24"
              style="color: #5152ce"
            />
          </p>
          <p
            v-else-if="certificationStore.error"
            class="col-span-2 text-center text-red-500 py-1 text-sm md:py-2"
          >
            Harap isi profile terlebih dahulu
          </p>
          <div
            v-else-if="displayedCertifications.length > 0"
            v-for="cert in displayedCertifications"
            :key="cert.id"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ cert.name }}</p>
            <p>Year: {{ cert.year }}</p>
            <p>Issued By: {{ cert.issueBy }}</p>
            <p class="text-blue-700 text-xs" v-if="cert.credentialId">
              <a
                :href="
                  cert.credentialId.startsWith('http')
                    ? cert.credentialId
                    : `http://${cert.credentialId}`
                "
                target="_blank"
                >Credential/URL</a
              >
            </p>
            <p class="text-gray-700 text-xs">{{ cert.description }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button
                class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4 cursor-pointer"
                @click="editCertification(cert)"
              >
                Edit
              </button>
              <button
                class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3 py-1 cursor-pointer"
                @click="deleteCertificationFromStore(cert.id)"
              >
                Delete
              </button>
            </div>
          </div>
          <div
            v-else
            class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2"
          >
            No certifications added yet.
          </div>
        </div>
      </div>

      <h1 class="text-center font-bold text-2xl hidden md:block lg:hidden">Preview</h1>
      <div
        v-if="!isMobile || showPreview"
        class="bg-gray-300 w-full md:w-full p-1 mt-7 md:mt-0 md:p-2"
        id="cv-preview-content"
      >
        <div
          class="bg-white w-full h-full py-2 px-2 md:py-4 md:px-3 text-xs md:text-sm"
        >
          <h1 class="text-center font-bold text-lg md:text-xl">
            {{ cvUserName }}
          </h1>
          <div class="flex justify-center py-2 gap-x-1 md:gap-x-3">
            <p>{{ cvUserPhone }}</p>
            <div class="w-0.5 h-4 bg-gray-400 md:h-6"></div>
            <a
              v-if="cvLinkedin"
              :href="cvLinkedin"
              target="_blank"
              class="text-blue-600 hover:text-blue-800"
              :title="cvLinkedin"
            >
              {{ cvLinkedinDisplayText }}
            </a>
            <div class="w-0.5 h-4 bg-gray-400 md:h-6"></div>
            <p>{{ cvUserEmail }}</p>
          </div>

          <div>
            <h2 class="font-bold text-sm md:text-md">Summary</h2>
            <hr class="my-1" />
            <p class="text-gray-500 text-xxs md:text-xs">
              {{ cvUserBio }}
            </p>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Experience</h2>
            <hr class="my-1" />
            <p
              v-if="experienceStore.isLoading && !displayedExperiences.length"
              class="m-auto text-gray-500 text-xxs md:text-xs"
            >
              <Icon
                icon="eos-icons:loading"
                width="24"
                height="24"
                style="color: #5152ce"
              />
            </p>
            <p
              v-else-if="experienceStore.error && !displayedExperiences.length"
              class="text-red-500 text-xxs md:text-xs"
            >
              Anda belum melengkapi profile.
            </p>
            <div
              v-else-if="displayedExperiences.length > 0"
              v-for="exp in displayedExperiences"
              :key="`preview-exp-${exp.id}`"
              class="mb-1 md:mb-3"
            >
              <p class="font-bold text-xxs md:text-sm">{{ exp.title }}</p>
              <div
                class="flex justify-between font-semibold text-xxs md:text-sm"
              >
                <p>{{ exp.company_name }}</p>
                <p>
                  {{ formatDate(exp.start_date) }} -
                  {{ formatDate(exp.end_date) }}
                </p>
              </div>
              <p class="text-gray-500 text-xxs md:text-xs">
                {{ exp.description }}
              </p>
            </div>
            <div
              v-else-if="!experienceStore.isLoading"
              class="text-gray-500 text-xxs md:text-xs"
            >
              No experience added.
            </div>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Project</h2>
            <hr class="my-1" />
            <p
              v-if="projectStore.isLoading && !displayedProjects.length"
              class="m-auto text-gray-500 text-xxs md:text-xs"
            >
              <Icon
                icon="eos-icons:loading"
                width="24"
                height="24"
                style="color: #5152ce"
              />
            </p>
            <p
              v-else-if="projectStore.error && !displayedProjects.length"
              class="text-red-500 text-xxs md:text-xs"
            >
              Anda belum melengkapi profile.
            </p>
            <div
              v-else-if="displayedProjects.length > 0"
              v-for="project in displayedProjects"
              :key="`preview-project-${project.id}`"
              class="mb-1 md:mb-3"
            >
              <div
                class="flex justify-between font-semibold text-xxs md:text-sm"
              >
                <p class="font-semibold text-xxs md:text-md">
                  {{ project.title }}
                </p>
                <p>
                  {{ formatDate(project.start_date) }} -
                  {{ formatDate(project.end_date) }}
                </p>
              </div>
              <p class="text-gray-500 text-xxs md:text-xs">
                {{ project.description }}
              </p>
              <p
                class="text-blue-700 text-xxs md:text-xs"
                v-if="project.link_url"
              >
                <a :href="project.link_url" target="_blank">Project Link</a>
              </p>
            </div>
            <div
              v-else-if="!projectStore.isLoading"
              class="text-gray-500 text-xxs md:text-xs"
            >
              No projects added.
            </div>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Education</h2>
            <hr class="my-1" />
            <p
              v-if="educationStore.isLoading && !displayedEducations.length"
              class="m-auto text-gray-500 text-xxs md:text-xs"
            >
              <Icon
                icon="eos-icons:loading"
                width="24"
                height="24"
                style="color: #5152ce"
              />
            </p>
            <p
              v-else-if="educationStore.error && !displayedEducations.length"
              class="text-red-500 text-xxs md:text-xs"
            >
              Anda belum melengkapi profile.
            </p>
            <div
              v-else-if="displayedEducations.length > 0"
              v-for="edu in displayedEducations"
              :key="`preview-edu-${edu.id}`"
              class="mb-1 md:mb-3"
            >
              <div
                class="flex justify-between font-semibold text-xxs md:text-sm"
              >
                <p class="font-semibold text-xxs md:text-md">
                  {{ edu.name_school }}
                </p>
                <p>
                  {{ formatDate(edu.start_date) }} -
                  {{ formatDate(edu.end_date) }}
                </p>
              </div>
              <p class="text-gray-500 text-xxs md:text-xs">
                {{ edu.major }}
                <span v-if="edu.gpa">(GPA: {{ edu.gpa }})</span>
                <span v-if="edu.description">- {{ edu.description }}</span>
              </p>
            </div>
            <div
              v-else-if="!educationStore.isLoading"
              class="text-gray-500 text-xxs md:text-xs"
            >
              No education added.
            </div>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Skills</h2>
            <hr class="my-1" />
            <p
              v-if="skillStore.isLoading && !displayedSkills.length"
              class="m-auto text-gray-500 text-xxs md:text-xs"
            >
              <Icon
                icon="eos-icons:loading"
                width="24"
                height="24"
                style="color: #5152ce"
              />
            </p>
            <p
              v-else-if="skillStore.error && !displayedSkills.length"
              class="text-red-500 text-xxs md:text-xs"
            >
              Anda belum melengkapi profile.
            </p>
            <div
              v-else-if="displayedSkills.length > 0"
              v-for="skill in displayedSkills"
              :key="`preview-skill-${skill.id}`"
              class="flex justify-between mb-0.5 md:mb-1"
            >
              <p class="font-semibold text-xxs md:text-sm">{{ skill.name }}</p>
              <p class="font-semibold text-xxs md:text-sm">
                Level: {{ skill.level }}
              </p>
            </div>
            <div
              v-else-if="!skillStore.isLoading"
              class="text-gray-500 text-xxs md:text-xs"
            >
              No skills added.
            </div>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Certifications</h2>
            <hr class="my-1" />
            <p
              v-if="
                certificationStore.isLoading && !displayedCertifications.length
              "
              class="m-auto text-gray-500 text-xxs md:text-xs"
            >
              <Icon
                icon="eos-icons:loading"
                width="24"
                height="24"
                style="color: #5152ce"
              />
            </p>
            <p
              v-else-if="
                certificationStore.error && !displayedCertifications.length
              "
              class="text-red-500 text-xxs md:text-xs"
            >
              Anda belum melengkapi profile.
            </p>
            <div
              v-else-if="displayedCertifications.length > 0"
              v-for="cert in displayedCertifications"
              :key="`preview-cert-${cert.id}`"
              class="mb-1 md:mb-3"
            >
              <div class="flex justify-between">
                <p class="font-semibold text-xxs md:text-sm">{{ cert.name }}</p>
                <p class="font-semibold text-xxs md:text-sm">{{ cert.year }}</p>
              </div>
              <p class="text-gray-500 text-xxs md:text-xs">
                Issued by: {{ cert.issueBy }}
                <span v-if="cert.credentialId">
                  (<a
                    :href="
                      cert.credentialId.startsWith('http')
                        ? cert.credentialId
                        : `http://${cert.credentialId}`
                    "
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 underline"
                    >Credential</a
                  >)
                </span>
                <span v-if="cert.description"> - {{ cert.description }}</span>
              </p>
            </div>
            <div
              v-else-if="!certificationStore.isLoading"
              class="text-gray-500 text-xxs md:text-xs"
            >
              No certifications added.
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="isMobile"
      @click="showPreview = !showPreview"
      class="fixed bottom-4 left-4 bg-blue-950/90 text-white px-4 py-2 rounded-md text-sm shadow-md"
    >
      {{ showPreview ? "Hide Preview" : "Show Preview" }}
    </button>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { useEducationStore } from "@/stores/cv/education";
import { useExperienceStore } from "@/stores/cv/experience";
import { useProjectStore } from "@/stores/cv/project";
import { useSkillStore } from "@/stores/cv/skill";
import { useCertificationStore } from "@/stores/cv/certification";
import { AuthUserStorage } from "@/stores/auth/userAuth";
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";

const authStore = AuthUserStorage();

const step = ref("education");
const isMobile = ref(false);
const showPreview = ref(false);

const educationStore = useEducationStore();
const experienceStore = useExperienceStore();
const projectStore = useProjectStore();
const skillStore = useSkillStore();
const certificationStore = useCertificationStore();

const downloadCv = () => {
  const element = document.getElementById("cv-preview-content");
  if (element) {
    html2pdf(element, {
      margin: 10,
      filename: `${cvUserName.value}_CV.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
      .then(() => {})
      .catch((error) => {
        console.error("Error generating PDF:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat PDF",
          text: "Terjadi kesalahan saat membuat PDF. Silakan coba lagi.",
        });
      });
  } else {
    console.error("CV preview content not found!");
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Konten preview CV tidak ditemukan untuk membuat PDF.",
    });
  }
};

const currentEducation = ref({
  id: null,
  name_school: "",
  major: "",
  gpa: "",
  start_date: "",
  end_date: "",
  description: "",
});

const currentProject = ref({
  id: null,
  title: "",
  link: "",
  start_date: "",
  end_date: "",
  description: "",
});

const currentExperience = ref({
  id: null,
  title: "",
  company: "",
  start_date: "",
  end_date: "",
  description: "",
});

const currentSkill = ref({ id: null, name: "", level: "" });

const currentCertification = ref({
  id: null,
  name: "",
  year: "",
  issueBy: "",
  credentialId: "",
  description: "",
});

onMounted(async () => {
  isMobile.value = window.innerWidth < 768;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
    if (!isMobile.value) showPreview.value = false;
  });

  educationStore.fetchEducations();
  experienceStore.fetchExperiences();
  projectStore.fetchProjects();
  skillStore.fetchSkills();
  certificationStore.fetchCertifications();

  if (authStore.tokenUser && !authStore.user) {
    try {
      await authStore.getUserByAuth();
    } catch (error) {
      console.error(
        "CV Page: Gagal mengambil data user (currentUser) saat onMounted:",
        error
      );
    }
  }
  if (
    authStore.tokenUser &&
    (authStore.userProfile === null || authStore.userProfile === undefined)
  ) {
    try {
      await authStore.fetchUserProfile();
    } catch (error) {
      console.warn(
        "CV Page: Gagal mengambil data profil detail (userProfile) saat onMounted. Profil mungkin belum dibuat.",
        error.response?.data?.message || error.message
      );
    }
  }
});

const cvUserName = computed(() => {
  return (
    authStore.userProfile?.full_name ||
    authStore.userProfile?.name ||
    authStore.currentUser?.name ||
    "Nama Anda"
  );
});

const cvUserEmail = computed(() => {
  return authStore.userProfile?.email || authStore.currentUser?.email || "";
});

const cvUserPhone = computed(() => {
  return authStore.userProfile?.phone || "";
});

const cvUserBio = computed(() => {
  return authStore.userProfile?.bio || "";
});

const cvLinkedin = computed(() => {
  return authStore.userProfile?.linkedin || "";
});

const cvLinkedinDisplayText = computed(() => {
  const fullUrl = cvLinkedin.value;
  if (!fullUrl) {
    return "";
  }

  const maxLength = 20;
  let displayableUrl = fullUrl.replace(/^https?:\/\/(www\.)?/, "");

  if (displayableUrl.length > maxLength) {
    return displayableUrl.substring(0, maxLength - 3) + "...";
  }

  return displayableUrl;
});

const formatDate = (dateString) => {
  if (!dateString) return "Present";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string for formatting:", dateString);
      return dateString;
    }
    return format(date, "MMM yyyy");
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

// --- Education Functions ---
const saveEducation = async () => {
  // Validate required fields
  if (
    !currentEducation.value.name_school ||
    !currentEducation.value.major ||
    !currentEducation.value.start_date
  ) {
    Swal.fire({
      icon: "warning",
      title: "Input Kosong",
      text: "Harap isi semua inputan yang wajib diisi (Sekolah/Universitas, Jurusan, Tanggal Mulai).",
    });
    return;
  }

  const payload = { ...currentEducation.value };
  if (payload.start_date)
    payload.start_date = new Date(payload.start_date).toISOString();
  if (payload.end_date)
    payload.end_date = new Date(payload.end_date).toISOString();
  try {
    if (currentEducation.value.id) {
      await educationStore.updateEducation(currentEducation.value.id, payload);
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Educatin Updating Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    } else {
      await educationStore.createEducation(payload);
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Education Adding Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    }
    resetEducationForm();
  } catch (error) {
    console.error("Failed to save education:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal Menyimpan",
      text: "Terjadi kesalahan saat menyimpan data pendidikan. Silakan coba lagi.",
    });
  }
};
const editEducation = (edu) => {
  currentEducation.value = { ...edu };
  currentEducation.value.start_date = edu.start_date
    ? format(new Date(edu.start_date), "yyyy-MM-dd")
    : "";
  currentEducation.value.end_date = edu.end_date
    ? format(new Date(edu.end_date), "yyyy-MM-dd")
    : "";
};
const deleteEducation = async (id) => {
  Swal.fire({
    title: "Are Your Sure?",
    text: "This Data Will Deleting Permanent!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Deleting!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await educationStore.deleteEducation(id);
        if (currentEducation.value.id === id) resetEducationForm();
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Edducation Delete Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
      } catch (error) {
        console.error("Failed to delete education:", error);
        Swal.fire({
          icon: "error",
          title: "Failed Deleting",
          text: "Try Again",
        });
      }
    }
  });
};
const resetEducationForm = () => {
  currentEducation.value = {
    id: null,
    name_school: "",
    major: "",
    gpa: "",
    start_date: "",
    end_date: "",
    description: "",
  };
};
const cancelEdit = () => resetEducationForm();

// --- Project Functions ---
const saveProject = async () => {
  // Validate required fields
  if (
    !currentProject.value.title ||
    !currentProject.value.start_date ||
    !currentProject.value.description
  ) {
    Swal.fire({
      icon: "warning",
      title: "Input Null",
      text: "You Shoul Adding (Title, Start Date, Description).",
    });
    return;
  }

  const payload = {
    title: currentProject.value.title,
    link: currentProject.value.link,
    startDate: currentProject.value.start_date,
    endDate: currentProject.value.end_date,
    description: currentProject.value.description,
  };
  try {
    if (currentProject.value.id) {
      await projectStore.updateProject(currentProject.value.id, payload);
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Project Updating Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    } else {
      await projectStore.createProject(payload);
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Project Adding Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    }
    resetProjectForm();
  } catch (error) {
    console.error("Failed to save project:", error);
    Swal.fire({
      icon: "error",
      title: "Try Again",
      text: "Pliss Try Again",
    });
  }
};
const editProject = (project) => {
  currentProject.value = {
    ...project,
    link: project.link_url || project.link || "",
  };
  currentProject.value.start_date = project.start_date
    ? format(new Date(project.start_date), "yyyy-MM-dd")
    : "";
  currentProject.value.end_date = project.end_date
    ? format(new Date(project.end_date), "yyyy-MM-dd")
    : "";
};
const deleteProjectFromStore = async (id) => {
  Swal.fire({
    title: "Are You Sure?",
    text: "This Data Will Deleting Permanent",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Deleting!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await projectStore.deleteProject(id);
        if (currentProject.value.id === id) resetProjectForm();
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Project Deleting Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
      } catch (error) {
        console.error("Failed to delete project:", error);
        Swal.fire({
          icon: "error",
          title: "Failed Deleting",
          text: "Pliss Try Again",
        });
      }
    }
  });
};
const resetProjectForm = () => {
  currentProject.value = {
    id: null,
    title: "",
    link: "",
    start_date: "",
    end_date: "",
    description: "",
  };
};
const cancelProjectEdit = () => resetProjectForm();

// --- Experience Functions ---
const saveExperience = async () => {
  // Validate required fields
  if (
    !currentExperience.value.title ||
    !currentExperience.value.company ||
    !currentExperience.value.start_date ||
    !currentExperience.value.description
  ) {
    Swal.fire({
      icon: "warning",
      title: "Input Null",
      text: "Pliss Complete Input (title, Company, Start Date, Description).",
    });
    return;
  }

  const payload = {
    title: currentExperience.value.title,
    company_name: currentExperience.value.company,
    start_date: currentExperience.value.start_date
      ? new Date(currentExperience.value.start_date).toISOString()
      : null,
    end_date: currentExperience.value.end_date
      ? new Date(currentExperience.value.end_date).toISOString()
      : null,
    description: currentExperience.value.description,
  };
  try {
    if (currentExperience.value.id) {
      await experienceStore.updateExperience(
        currentExperience.value.id,
        payload
      );
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Experience Updating Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    } else {
      await experienceStore.createExperience(payload);
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Experience Adding Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    }
    resetExperienceForm();
  } catch (error) {
    console.error("Failed to save experience:", error);
    Swal.fire({
      icon: "error",
      title: "Failed Saving",
      text: "Pliss Try Again",
    });
  }
};
const editExperience = (exp) => {
  currentExperience.value = { ...exp, company: exp.company_name };
  currentExperience.value.start_date = exp.start_date
    ? format(new Date(exp.start_date), "yyyy-MM-dd")
    : "";
  currentExperience.value.end_date = exp.end_date
    ? format(new Date(exp.end_date), "yyyy-MM-dd")
    : "";
};
const deleteExperience = async (id) => {
  Swal.fire({
    title: "Are You Sure?",
    text: "This Data Will Deleting Permanent!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Deleting!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await experienceStore.deleteExperience(id);
        if (currentExperience.value.id === id) resetExperienceForm();
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Experience Deleting Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
      } catch (error) {
        console.error("Failed to delete experience:", error);
        Swal.fire({
          icon: "error",
          title: "Failed Deleting",
          text: "Pliss Try Again",
        });
      }
    }
  });
};
const resetExperienceForm = () => {
  currentExperience.value = {
    id: null,
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    description: "",
  };
};
const cancelExperienceEdit = () => resetExperienceForm();

// --- Skill Functions ---
const saveSkill = async () => {
  // Validate required fields
  if (!currentSkill.value.name || !currentSkill.value.level) {
    Swal.fire({
      icon: "warning",
      title: "Input Null",
      text: "Pliis Input (Name Skill, Level).",
    });
    return;
  }

  const payload = {
    name: currentSkill.value.name,
    level: currentSkill.value.level,
  };
  try {
    if (currentSkill.value.id) {
      await skillStore.updateSkill(currentSkill.value.id, payload);
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Skill Updating Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    } else {
      await skillStore.createSkill(payload);
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Skill Adding Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    }
    resetSkillForm();
  } catch (error) {
    console.error("Failed to save skill:", error);
    Swal.fire({
      icon: "error",
      title: "Failed Save",
      text: "Pliss Try Again",
    });
  }
};
const editSkill = (skill) => {
  currentSkill.value = { ...skill };
};
const deleteSkillFromStore = async (id) => {
  Swal.fire({
    title: "Are You Sure?",
    text: "This Data Deleting Permanent!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Deleting!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await skillStore.deleteSkill(id);
        if (currentSkill.value.id === id) resetSkillForm();
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Skill Deletin Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
      } catch (error) {
        console.error("Failed to delete skill:", error);
        Swal.fire({
          icon: "error",
          title: "Failed Deleting",
          text: "Pliss Try Again",
        });
      }
    }
  });
};
const resetSkillForm = () => {
  currentSkill.value = { id: null, name: "", level: "" };
};
const cancelSkillEdit = () => resetSkillForm();

// --- Certification Functions ---
const saveCertification = async () => {
  // Validate required fields
  if (
    !currentCertification.value.name ||
    !currentCertification.value.year ||
    !currentCertification.value.issueBy
  ) {
    Swal.fire({
      icon: "warning",
      title: "Input Null",
      text: "Pliss Input (Name Certification, Year, Issued By).",
    });
    return;
  }

  const payload = {
    name: currentCertification.value.name,
    issued_by: currentCertification.value.issueBy,
    year: currentCertification.value.year,
    description: currentCertification.value.description,
    id_credential_url: currentCertification.value.credentialId,
  };

  try {
    if (currentCertification.value.id) {
      // For update, ensure the payload matches backend's expected structure if it differs
      const updateData = {
        name: currentCertification.value.name,
        issued_by: currentCertification.value.issueBy,
        year: currentCertification.value.year,
        // Assuming the backend has a typo for update: id_credetial_url
        // If not, use id_credential_url consistently.
        id_credetial_url: currentCertification.value.credentialId,
        description: currentCertification.value.description,
      };
      await certificationStore.updateCertification(
        currentCertification.value.id,
        updateData
      );
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Certifation Upadting Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    } else {
      await certificationStore.createCertification(payload);
      Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Certification Adding Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
    }
    resetCertificationForm();
  } catch (error) {
    console.error("Failed to save certification:", error);
    Swal.fire({
      icon: "error",
      title: "Failed Save",
      text: "Pliss Try Again",
    });
  }
};

const editCertification = (cert) => {
  currentCertification.value = {
    id: cert.id,
    name: cert.name,
    year: cert.year,
    issueBy: cert.issued_by,
    credentialId: cert.id_credential_url || cert.id_credetial_url || "", // Handle both spellings
    description: cert.description,
  };
};

const deleteCertificationFromStore = async (id) => {
  Swal.fire({
    title: "Are You Sure?",
    text: "This Data will Deleting Permanent!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Deleting!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await certificationStore.deleteCertification(id);
        if (currentCertification.value.id === id) {
          resetCertificationForm();
        }
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title:"Certification Deleting Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
      } catch (error) {
        console.error("Failed to delete certification:", error);
        Swal.fire({
          icon: "error",
          title: "Failde Delete",
          text: "Pliss Try Again",
        });
      }
    }
  });
};

const resetCertificationForm = () => {
  currentCertification.value = {
    id: null,
    name: "",
    year: "",
    issueBy: "",
    credentialId: "",
    description: "",
  };
};

const cancelCertificationEdit = () => {
  resetCertificationForm();
};

// --- Step Navigation ---
const nextStep = () => {
  if (step.value === "education") step.value = "project";
  else if (step.value === "project") step.value = "experience";
  else if (step.value === "experience") step.value = "skills";
  else if (step.value === "skills") step.value = "certifications";
};
const prevStep = () => {
  if (step.value === "project") step.value = "education";
  else if (step.value === "experience") step.value = "project";
  else if (step.value === "skills") step.value = "experience";
  else if (step.value === "certifications") step.value = "skills";
};

// --- Computed Properties for Preview and Lists ---
const displayedEducations = computed(() => educationStore.educations);
const displayedProjects = computed(() => projectStore.projects);
const displayedExperiences = computed(() => experienceStore.experiences);
const displayedSkills = computed(() => skillStore.skills);

const displayedCertifications = computed(() => {
  return certificationStore.certifications.map((cert) => ({
    id: cert.id,
    name: cert.name,
    year: cert.year,
    issueBy: cert.issued_by,
    credentialId: cert.id_credential_url || cert.id_credetial_url, // Handle both spellings for display
    description: cert.description,
  }));
});
</script>

<style scoped>
.text-xxs {
  font-size: 0.7rem;
}

@media print {
  .md\:pl-18 {
    padding-left: 0 !important;
  }
}
</style>

<style scoped>
.text-xxs {
  font-size: 0.7rem;
}

@media print {
  .md\:pl-18 {
    padding-left: 0 !important;
  }
}
</style>
