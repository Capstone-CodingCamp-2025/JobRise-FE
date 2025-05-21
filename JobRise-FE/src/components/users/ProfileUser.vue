<template>
  <form class="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-300/30 p-8 rounded-md shadow-md">
    <!-- KIRI: Foto & Kontak -->
    <div class="flex flex-col items-center gap-6 col-span-1">
      <!-- Foto Profil -->
      <div class="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative">
        <input type="file" class="absolute w-40 h-40 opacity-0 cursor-pointer z-10" />
        <span class="text-3xl font-bold text-gray-500 z-0">+</span>
      </div>

      <!-- Email -->
      <div class="w-full">
        <label class="font-bold text-lg">Email</label>
        <input type="text" class="bg-gray-300 w-full rounded-lg py-2 px-3 shadow-lg text-center" />
      </div>

      <!-- Linkedin -->
      <div class="w-full">
        <label class="font-bold text-lg">Linkedin</label>
        <input type="text" class="bg-gray-300 w-full rounded-lg py-2 px-3 shadow-lg text-center" />
      </div>

      <!-- Portofolio -->
      <div class="w-full">
        <label class="font-bold text-lg">Portofolio</label>
        <input type="text" class="bg-gray-300 w-full rounded-lg py-2 px-3 shadow-lg text-center" />
      </div>
    </div>

    <!-- KANAN: Data Pribadi -->
    <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Username -->
      <div>
        <label class="font-bold text-lg">Username</label>
        <input type="text" class="bg-gray-300 rounded-lg w-full py-2 px-3 shadow-lg text-center" />
      </div>

      <!-- Fullname -->
      <div>
        <label class="font-bold text-lg">Fullname</label>
        <input type="text" class="bg-gray-300 rounded-lg w-full py-2 px-3 shadow-lg text-center" />
      </div>

      <!-- Phone -->
      <div>
        <label class="font-bold text-lg">Phone</label>
        <input type="text" class="bg-gray-300 rounded-lg w-full py-2 px-3 shadow-lg text-center" />
      </div>

      <!-- Age -->
      <div>
        <label class="font-bold text-lg">Age</label>
        <input type="text" class="bg-gray-300 rounded-lg w-full py-2 px-3 shadow-lg text-center" />
      </div>

      <!-- Address -->
      <div>
        <label class="font-bold text-lg">Address</label>
        <input type="text" class="bg-gray-300 rounded-lg w-full py-2 px-3 shadow-lg text-center" />
      </div>

      <!-- City -->
      <div>
        <label class="font-bold text-lg">City</label>
        <input type="text" class="bg-gray-300 rounded-lg w-full py-2 px-3 shadow-lg text-center" />
      </div>

      <!-- Bio -->
      <div class="md:col-span-2">
        <label class="font-bold text-lg">Bio</label>
        <textarea rows="5" class="bg-gray-300 w-full rounded-lg py-2 px-3 shadow-lg resize-none text-left"></textarea>
      </div>

      <!-- Tombol Save -->
      <div class="w-full flex justify-end md:col-span-2 pt-2">
        <button class="bg-blue-800/90 text-white font-bold text-lg px-6 py-2 rounded-lg shadow-md">
          Save
        </button>
      </div>
    </div>
  </form>
</template>
