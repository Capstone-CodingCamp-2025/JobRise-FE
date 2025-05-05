<template>
  <div
    class="bg-[#D5DEEF] top-0 w-full p-6 flex justify-between fixed z-50 shadow-lg"
  >
    <div>
      <ul class="flex gap-x-5">
        <li>
          <a href="">
            <img
              src="../../../public/logo.png"
              class="w-20 pt-3"
              alt="JobRise"
            />
          </a>
        </li>
        <li class="pt-2">
          <a href="" class="text-lg text-[#334EAC] font-bold">Home</a>
        </li>
        <li class="pt-2">
          <a href="" class="text-lg text-[#334EAC] font-bold">Find Job</a>
        </li>
        <li class="pt-2">
          <a href="" class="text-lg text-[#334EAC] font-bold">Employers</a>
        </li>
        <li class="pt-1">
          <form action="" class="ml-48">
            <input
              type="search"
              placeholder="Search text"
              class="bg-slate-200 w-max text-center rounded-full outline-none py-2 pr-5"
            />
            <button class="absolute left-[755px] top-9">
              <Icon icon="material-symbols:search" width="24" height="24" />
            </button>
          </form>
        </li>
      </ul>
    </div>
    <div>
      <ul class="flex gap-9 pt-2">
        <li>
          <router-link
            :to="{ name: 'role' }"
            class="text-xl font-semibold text-blue-800 outline rounded-full px-6 text-center pb-2 pt-1 outline-blue-800 hover:bg-blue-300"
          >
            Sign in
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'role' }"
            class="text-white bg-blue-900 rounded-full text-xl font-semibold px-6 pb-2 pt-1 text-center hover:bg-blue-950"
          >
            Register
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
