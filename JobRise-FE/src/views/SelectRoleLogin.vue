
<template>

  <main class="m-auto w-sm md:w-svw md:px-10 md:py-20 lg:px-44 py-10 lg:pt-34  ">
    <div class="bg-[#D5DEEF] m-auto place-items-center  rounded-lg shadow-lg md:py-10">
      <h1 class="text-3xl pt-4 font-bold text-center">Login as</h1>
      <div class="grid py-6 px-10 gap-y-6 md:grid-cols-2 md:gap-x-4 md:px-10 xl:gap-x-12 xl:px-32">
        <router-link :to="{ name: 'login' }">
          <div
            class="bg-radial from-blue-200 from-20% to-gray-100 rounded-lg px-10 py-8 shadow-md"
          >
            <h2 class="text-center font-bold text-xl mb-5">Jobseeker</h2>
            <p class="px-10 text-center text-sm md:text-justify">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores,
              dolorum!
            </p>
          </div>
        </router-link>
        <router-link :to="{ name: 'login-company' }">
          <div
            class="bg-radial from-blue-200 from-20% to-gray-100 rounded-lg px-10 py-8 shadow-md"
          >
            <h2 class="text-center font-bold text-xl mb-5">Company</h2>
            <p class="px-10 text-center text-sm md:text-justify">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Eligendi, beatae!
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>
