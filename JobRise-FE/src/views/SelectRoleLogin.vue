
<template>

  <main class="bg-white min-h-screen pt-50 px-32">
    <div class="bg-[#D5DEEF] m-auto place-items-center py-14 px-12 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold">Login</h1>
      <div class="flex gap-10 mt-10">
        <router-link :to="{ name: 'login' }">
          <div
            class="bg-radial from-blue-200 from-20% to-gray-100 rounded-lg px-10 py-8 shadow-md"
          >
            <h2 class="text-center font-bold text-xl">Candiate</h2>
            <p class="px-20 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores,
              dolorum!
            </p>
          </div>
        </router-link>
        <router-link :to="{ name: 'login-company' }">
          <div
            class="bg-radial from-blue-200 from-20% to-gray-100 rounded-lg px-10 py-8 shadow-md"
          >
            <h2 class="text-center font-bold text-xl">Employer</h2>
            <p class="px-20 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Eligendi, beatae!
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>
