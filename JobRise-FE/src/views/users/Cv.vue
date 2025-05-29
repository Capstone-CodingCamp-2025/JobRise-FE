<template>
  <div class="px-4 py-2 md:px-10 md:py-4">
    <div class="flex flex-col md:flex-row justify-between items-center mb-3">
      <h1 class="font-bold text-xl md:text-2xl">Curriculum Vitae</h1>
      <h1 v-if="!isMobile" class="font-bold text-xl md:text-2xl mb-3 md:pr-28 lg:pr-44 xl:pr-66">Preview</h1>
    </div>

    <div class="flex flex-col md:flex-row gap-x-10">
      <div class="w-full">
        <div class="flex justify-between pb-2 px-2 md:pb-4 md:px-4" v-if="step === 'education'">
          <div></div>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">Education</h2>
          <button
            class="bg-blue-950/90 text-white px-4 py-1 rounded-md text-sm md:px-6"
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
            class="bg-gray-500/90 text-white px-4 py-1 rounded-md text-sm md:px-6"
            @click="prevStep"
          >
            Back
          </button>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">Project</h2>
          <button
            class="bg-blue-950/90 text-white px-4 py-1 rounded-md text-sm md:px-6"
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
            class="bg-gray-500/90 text-white px-4 py-1 rounded-md text-sm md:px-6"
            @click="prevStep"
          >
            Back
          </button>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">Experiences</h2>
          <button
            class="bg-blue-950/90 text-white px-4 py-1 rounded-md text-sm md:px-6"
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
            class="bg-gray-500/90 text-white px-4 py-1 rounded-md text-sm md:px-6"
            @click="prevStep"
          >
            Back
          </button>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">Skills</h2>
          <button
            class="bg-blue-950/90 text-white px-4 py-1 rounded-md text-sm md:px-6"
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
            class="bg-gray-500/90 text-white px-4 py-1 rounded-md text-sm md:px-6"
            @click="prevStep"
          >
            Back
          </button>
          <h2 class="font-semibold text-lg md:text-xl text-center grow">Certifications</h2>
          <div></div>
        </div>

        <div class="bg-slate-300 px-3 py-2 md:px-6 md:py-3" v-if="step === 'education'">
          <form @submit.prevent="saveEducation" class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2">
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">School / University</label>
              <input
                v-model="currentEducation.institution"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Major</label>
              <input
                v-model="currentEducation.major"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">Start Date</label>
              <input
                v-model="currentEducation.startDate"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">End Date</label>
              <input
                v-model="currentEducation.endDate"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Description</label>
              <textarea
                v-model="currentEducation.description"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-16 text-sm md:h-24"
              ></textarea>
            </div>
            <div class="col-span-2 flex justify-end">
              <button type="submit" class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1">
                Save
              </button>
            </div>
          </form>
        </div>

        <div class="bg-slate-300 px-3 py-2 md:px-6 md:py-3" v-else-if="step === 'project'">
          <form @submit.prevent="saveProject" class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2">
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Title</label>
              <input
                v-model="currentProject.title"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Project Link</label>
              <input
                v-model="currentProject.link"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">Start Date</label>
              <input
                v-model="currentProject.startDate"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">End Date</label>
              <input
                v-model="currentProject.endDate"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Description</label>
              <textarea
                v-model="currentProject.description"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-16 text-sm md:h-24"
              ></textarea>
            </div>
            <div class="col-span-2 flex justify-end">
              <button type="submit" class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1">
                Save
              </button>
            </div>
          </form>
        </div>

        <div class="bg-slate-300 px-3 py-2 md:px-6 md:py-3" v-else-if="step === 'experience'">
          <form @submit.prevent="saveExperience" class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2">
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Title</label>
              <input
                v-model="currentExperience.title"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Company</label>
              <input
                v-model="currentExperience.company"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">Start Date</label>
              <input
                v-model="currentExperience.startDate"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">End Date</label>
              <input
                v-model="currentExperience.endDate"
                type="date"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Description</label>
              <textarea
                v-model="currentExperience.description"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-16 text-sm md:h-24"
              ></textarea>
            </div>
            <div class="col-span-2 flex justify-end">
              <button type="submit" class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1">
                Save
              </button>
            </div>
          </form>
        </div>

        <div class="bg-slate-300 px-3 py-2 md:px-6 md:py-3" v-else-if="step === 'skills'">
          <form @submit.prevent="saveSkill" class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2">
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">Name</label>
              <input
                v-model="currentSkill.name"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">Level</label>
              <input
                v-model="currentSkill.level"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="col-span-2 flex justify-end">
              <button type="submit" class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1">
                Save
              </button>
            </div>
          </form>
        </div>

        <div
          class="bg-slate-300 px-3 py-2 md:px-6 md:py-3"
          v-else-if="step === 'certifications'"
        >
          <form @submit.prevent="saveCertification" class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2">
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Name</label>
              <input
                v-model="currentCertification.name"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">Year</label>
              <input
                v-model="currentCertification.year"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-normal text-black text-sm md:text-base">Issue By</label>
              <input
                v-model="currentCertification.issueBy"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">ID Credential / URL</label>
              <input
                v-model="currentCertification.credentialId"
                type="text"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-7 px-2 text-sm md:h-8 md:px-3"
              />
            </div>
            <div class="flex flex-col col-span-2">
              <label class="font-normal text-black text-sm md:text-base">Description</label>
              <textarea
                v-model="currentCertification.description"
                class="bg-slate-100 rounded-sm outline outline-blue-800 h-16 text-sm md:h-24"
              ></textarea>
            </div>
            <div class="col-span-2 flex justify-end">
              <button type="submit" class="bg-blue-950/90 text-white px-4 py-0.5 rounded-md text-sm md:px-6 md:py-1">
                Save
              </button>
            </div>
          </form>
        </div>

        <div class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4" v-if="step === 'education'">
          <div
            v-for="(edu, index) in educations"
            :key="index"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ edu.institution }}</p>
            <p>{{ edu.major }}</p>
            <p>{{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}</p>
            <p class="text-gray-700 text-xs">{{ edu.description }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4">
                Edit
              </button>
              <button class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3">
                Delete
              </button>
            </div>
          </div>
          <div v-if="educations.length === 0" class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2">
            No education added yet.
          </div>
        </div>

        <div class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4" v-if="step === 'project'">
          <div
            v-for="(project, index) in projects"
            :key="index"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ project.title }}</p>
            <p class="text-blue-700 text-xs" v-if="project.link"><a :href="project.link" target="_blank">Project Link</a></p>
            <p>{{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</p>
            <p class="text-gray-700 text-xs">{{ project.description }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4">
                Edit
              </button>
              <button class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3">
                Delete
              </button>
            </div>
          </div>
          <div v-if="projects.length === 0" class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2">
            No projects added yet.
          </div>
        </div>

        <div class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4" v-if="step === 'experience'">
          <div
            v-for="(exp, index) in experiences"
            :key="index"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ exp.title }}</p>
            <p>{{ exp.company }}</p>
            <p>{{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}</p>
            <p class="text-gray-700 text-xs">{{ exp.description }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4">
                Edit
              </button>
              <button class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3">
                Delete
              </button>
            </div>
          </div>
          <div v-if="experiences.length === 0" class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2">
            No work experiences added yet.
          </div>
        </div>

        <div class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4" v-if="step === 'skills'">
          <div
            v-for="(skill, index) in skills"
            :key="index"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ skill.name }}</p>
            <p>Level: {{ skill.level }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4">
                Edit
              </button>
              <button class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3">
                Delete
              </button>
            </div>
          </div>
          <div v-if="skills.length === 0" class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2">
            No skills added yet.
          </div>
        </div>

        <div
          class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 md:pt-6 md:gap-x-4"
          v-if="step === 'certifications'"
        >
          <div
            v-for="(cert, index) in certifications"
            :key="index"
            class="bg-[#82b4e4b7] rounded-md shadow-xs shadow-slate-600 px-3 py-2 text-sm md:px-4 md:py-3"
          >
            <p class="font-medium">{{ cert.name }}</p>
            <p>Year: {{ cert.year }}</p>
            <p>Issued By: {{ cert.issueBy }}</p>
            <p class="text-blue-700 text-xs" v-if="cert.credentialId">Credential/URL: {{ cert.credentialId }}</p>
            <p class="text-gray-700 text-xs">{{ cert.description }}</p>
            <div class="flex gap-x-2 justify-end mt-1 md:gap-x-4">
              <button class="bg-blue-950/90 text-white px-3 rounded-md text-xs md:px-4">
                Edit
              </button>
              <button class="bg-blue-950/90 text-white px-2 rounded-md text-xs md:px-3">
                Delete
              </button>
            </div>
          </div>
          <div v-if="certifications.length === 0" class="col-span-2 text-center text-gray-500 py-1 text-sm md:py-2">
            No certifications added yet.
          </div>
        </div>
      </div>
      <div v-if="!isMobile || showPreview" class="bg-gray-300 w-full md:w-full p-1 md:p-2">
        <div class="bg-white w-full h-full py-2 px-2 md:py-4 md:px-3 text-xs md:text-sm">
          <h1 class="text-center font-bold text-lg md:text-xl">Ahmad Parkhan</h1>

          <div class="flex justify-center py-2 gap-x-1 md:gap-x-3">
            <p>Contact</p>
            <div class="w-0.5 h-4 bg-gray-400 md:h-6"></div>
            <p>Contact</p>
            <div class="w-0.5 h-4 bg-gray-400 md:h-6"></div>
            <p>Contact</p>
          </div>

          <div>
            <h2 class="font-bold text-sm md:text-md">Summary</h2>
            <hr class="my-1" />
            <p class="text-gray-500 text-xxs md:text-xs">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus
              aperiam soluta, est quibusdam esse ut reprehenderit deserunt
              dolorum impedit delectus.
            </p>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Experience</h2>
            <hr class="my-1" />
            <div v-for="(exp, index) in displayedExperiences" :key="`preview-exp-${index}`" class="mb-1 md:mb-3">
              <p class="font-bold text-xxs md:text-sm">{{ exp.title }}</p>
              <div class="flex justify-between font-semibold text-xxs md:text-sm">
                <p>{{ exp.company }}</p>
                <p>{{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}</p>
              </div>
              <p class="text-gray-500 text-xxs md:text-xs">
                {{ exp.description }}
              </p>
            </div>
            <div v-if="displayedExperiences.length === 0" class="text-gray-500 text-xxs md:text-xs">
              No experience added.
            </div>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Project</h2>
            <hr class="my-1" />
            <div v-for="(project, index) in displayedProjects" :key="`preview-project-${index}`" class="mb-1 md:mb-3">
              <div class="flex justify-between font-semibold text-xxs md:text-sm">
                <p class="font-semibold text-xxs md:text-md">{{ project.title }}</p>
                <p>{{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</p>
              </div>
              <p class="text-gray-500 text-xxs md:text-xs">
                {{ project.description }}
              </p>
              <p class="text-blue-700 text-xxs md:text-xs" v-if="project.link"><a :href="project.link" target="_blank">Project Link</a></p>
            </div>
            <div v-if="displayedProjects.length === 0" class="text-gray-500 text-xxs md:text-xs">
              No projects added.
            </div>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Education</h2>
            <hr class="my-1" />
            <div v-for="(edu, index) in displayedEducations" :key="`preview-edu-${index}`" class="mb-1 md:mb-3">
              <div class="flex justify-between font-semibold text-xxs md:text-sm">
                <p class="font-semibold text-xxs md:text-md">{{ edu.institution }}</p>
                <p>{{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}</p>
              </div>
              <p class="text-gray-500 text-xxs md:text-xs">
                {{ edu.major }} - {{ edu.description }}
              </p>
            </div>
            <div v-if="displayedEducations.length === 0" class="text-gray-500 text-xxs md:text-xs">
              No education added.
            </div>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Skills</h2>
            <hr class="my-1" />
            <div v-for="(skill, index) in displayedSkills" :key="`preview-skill-${index}`" class="flex justify-between mb-0.5 md:mb-1">
              <p class="font-semibold text-xxs md:text-sm">{{ skill.name }}</p>
              <p class="font-semibold text-xxs md:text-sm">Level: {{ skill.level }}</p>
            </div>
            <div v-if="displayedSkills.length === 0" class="text-gray-500 text-xxs md:text-xs">
              No skills added.
            </div>
          </div>

          <div class="mt-2 md:mt-3">
            <h2 class="font-bold text-sm md:text-md">Certifications</h2>
            <hr class="my-1" />
            <div v-for="(cert, index) in displayedCertifications" :key="`preview-cert-${index}`" class="mb-1 md:mb-3">
              <div class="flex justify-between">
                <p class="font-semibold text-xxs md:text-sm">{{ cert.name }}</p>
                <p class="font-semibold text-xxs md:text-sm">{{ cert.year }}</p>
              </div>
              <p class="text-gray-500 text-xxs md:text-xs">
                Issued by: {{ cert.issueBy }}
                <span v-if="cert.credentialId">({{ cert.credentialId }})</span>
                {{ cert.description }}
              </p>
            </div>
            <div v-if="displayedCertifications.length === 0" class="text-gray-500 text-xxs md:text-xs">
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
      {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { format } from 'date-fns';

const step = ref("education");
const isMobile = ref(false);
const showPreview = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
    if (!isMobile.value) {
      showPreview.value = false;
    }
  });
});

// Data for each section
const educations = ref([]);
const projects = ref([]);
const experiences = ref([]);
const skills = ref([]);
const certifications = ref([]);

// Current item being edited/added
const currentEducation = ref({ institution: '', major: '', startDate: '', endDate: '', description: '' });
const currentProject = ref({ title: '', link: '', startDate: '', endDate: '', description: '' });
const currentExperience = ref({ title: '', company: '', startDate: '', endDate: '', description: '' });
const currentSkill = ref({ name: '', level: '' });
const currentCertification = ref({ name: '', year: '', issueBy: '', credentialId: '', description: '' });

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'MMM yyyy');
  } catch (error) {
    console.error("Errorformatting date:", error);
    return '';
  }
};

const saveEducation = () => {
  educations.value.push({ ...currentEducation.value });
  // Reset the form
  currentEducation.value = { institution: '', major: '', startDate: '', endDate: '', description: '' };
};

const saveProject = () => {
  projects.value.push({ ...currentProject.value });
  // Reset the form
  currentProject.value = { title: '', link: '', startDate: '', endDate: '', description: '' };
};

const saveExperience = () => {
  experiences.value.push({ ...currentExperience.value });
  // Reset the form
  currentExperience.value = { title: '', company: '', startDate: '', endDate: '', description: '' };
};

const saveSkill = () => {
  skills.value.push({ ...currentSkill.value });
  // Reset the form
  currentSkill.value = { name: '', level: '' };
};

const saveCertification = () => {
  certifications.value.push({ ...currentCertification.value });
  // Reset the form
  currentCertification.value = { name: '', year: '', issueBy: '', credentialId: '', description: '' };
};

const nextStep = () => {
  if (step.value === "education") {
    step.value = "project";
  } else if (step.value === "project") {
    step.value = "experience";
  } else if (step.value === "experience") {
    step.value = "skills";
  } else if (step.value === "skills") {
    step.value = "certifications";
  }
};

const prevStep = () => {
  if (step.value === "project") {
    step.value = "education";
  } else if (step.value === "experience") {
    step.value = "project";
  } else if (step.value === "skills") {
    step.value = "experience";
  } else if (step.value === "certifications") {
    step.value = "skills";
  }
};

// Computed properties for the preview section
const displayedEducations = computed(() => educations.value);
const displayedProjects = computed(() => projects.value);
const displayedExperiences = computed(() => experiences.value);
const displayedSkills = computed(() => skills.value);
const displayedCertifications = computed(() => certifications.value);
</script>

<style scoped>
.text-xxs {
  font-size: 0.7rem; /* Adjust as needed */
}
</style>