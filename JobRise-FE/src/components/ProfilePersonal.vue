<template>
  <div class="flex flex-col lg:flex-row px-8 lg:justify-between bg-slate-300/30 py-10 mb-14 mx-8 lg:px-28">
    <div class="w-max flex m-auto lg:m-0">
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww"
        alt=""
        class="rounded-full w-52 h-52 object-cover"
      />
    </div>
    <div>
      <form>
        <div class="grid md:grid-cols-2 md:gap-x-20 lg:gap-x-14 gap-y-6">
          <div class="flex flex-col gap-y-2">
            <label for="" class="font-bold text-lg">Full Name</label>
            <input
              type="text"
              class="bg-gray-300 rounded-lg outline-none text-md text-center shadow-lg py-2 lg:w-74 w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="" class="font-bold text-lg">Phone</label>
            <input
              type="text"
              class="bg-gray-300 rounded-lg outline-none text-md text-center shadow-lg py-2 lg:w-74 w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="" class="font-bold text-lg">Address</label>
            <input
              type="text"
              class="bg-gray-300 rounded-lg outline-none text-md text-center shadow-lg py-2 lg:w-74 w-full"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <label for="" class="font-bold text-lg">Age</label>
            <input
              type="text"
              class="bg-gray-300 rounded-lg outline-none text-md text-center shadow-lg py-2 lg:w-74 w-full"
            />
          </div>
        </div>
        <div class="pt-4">
          <label for="" class="font-bold text-lg">Bio</label>
          <textarea
            type="textarea"
            rows="5"
            class="w-full bg-gray-300 rounded-lg outline-none text-md text-left pl-2 shadow-lg"
          ></textarea>
        </div>
        <div class="flex flex-col place-items-end pt-4">
          <button
            class="bg-blue-800/90 text-white font-bold text-lg px-5 pb-1 rounded-lg w-max"
          >
            save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
