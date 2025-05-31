<template>
  <div class="m-auto place-items-center min-h-[80dvh] flex justify-center ">
    <div class="w-max bg-[#D5DEEF] p-16 rounded-md">
      <form action="/reset-password" class="flex flex-col gap-y-4">
        <div class="flex flex-col">
          <label for="">E-mail <span class="text-red-600">*</span></label>
          <input type="email" name="" id="" class="bg-gray-100  rounded-sm outline outline-blue-900 px-2 w-54 h-10 md:w-74" />
        </div>
        <div>
          <button class="bg-blue-950/80 text-white py-2 rounded-md w-full  font-semibold text-xl">Get Link</button>
        </div>
      </form>
    </div>
  </div>
</template>
