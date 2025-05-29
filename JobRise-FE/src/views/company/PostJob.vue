<template>
  <div class="px-4 sm:px-8">
    <h1 class="font-bold text-xl sm:text-2xl py-4">Post a Job</h1>
    <div class="bg-[#D5DEEF] w-full px-4 py-4 sm:px-8 sm:py-6 rounded-md shadow-xs">
      <div>
        <form action="" class="flex flex-col gap-y-2">
          <div class="flex flex-col gap-y-1">
            <label for="" class="font-semibold text-sm sm:text-base">Job Tittle</label>
            <input
              type="text"
              class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-x-4 gap-y-2">
            <div class="flex flex-col gap-y-1 w-full">
              <label for="" class="font-semibold text-sm sm:text-base">Job Type</label>
              <input
                type="text"
                class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base"
              />
            </div>
            <div class="flex flex-col gap-y-1 w-full">
              <label for="" class="font-semibold text-sm sm:text-base">Location</label>
              <input
                type="text"
                class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <p class="text-blue-900/70 font-bold text-sm sm:text-base">Salary</p>
            <div class="flex flex-col sm:flex-row gap-x-4 gap-y-2">
              <div class="flex flex-col gap-y-1 w-full">
                <label for="" class="font-semibold text-sm sm:text-base">Min.</label>
                <input
                  type="text"
                  class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base"
                />
              </div>
              <div class="flex flex-col gap-y-1 w-full">
                <label for="" class="font-semibold text-sm sm:text-base">Max.</label>
                <input
                  type="text"
                  class="bg-white h-8 rounded-sm outline outline-blue-800 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-1">
            <label for="" class="font-semibold text-sm sm:text-base">Description job</label>
            <textarea
              name=""
              id=""
              class="bg-white h-24 sm:h-38 rounded-sm outline outline-blue-800 text-sm sm:text-base"
            ></textarea>
          </div>
          <div class="pt-4 sm:pt-6">
            <div class="flex gap-x-2 justify-end">
              <button class="bg-blue-950/90 text-white rounded-md px-4 py-1 text-sm sm:text-base">
                Edit
              </button>
              <button class="bg-blue-950/90 text-white rounded-md px-4 py-1 text-sm sm:text-base">
                Post a Job
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>