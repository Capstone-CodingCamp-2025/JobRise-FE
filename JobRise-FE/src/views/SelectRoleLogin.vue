
<template>

  <main class="bg-white min-h-screen pt-50 pb-18 px-4 xl:px-44">
    <div class="bg-[#D5DEEF] m-auto place-items-center  rounded-lg shadow-lg md:py-10">
      <h1 class="text-3xl pt-4 font-bold">Login as</h1>
      <div class="grid py-6 px-2 gap-y-6 md:grid-cols-2 md:gap-x-4 md:px-10 xl:gap-x-12 xl:px-24">
        <router-link :to="{ name: 'login' }">
          <div
            class="bg-radial from-blue-200 from-20% to-gray-100 rounded-lg px-10 py-8 shadow-md"
          >
            <h2 class="text-center font-bold text-xl mb-5">Candiate</h2>
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
            <h2 class="text-center font-bold text-xl mb-5">Employer</h2>
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
