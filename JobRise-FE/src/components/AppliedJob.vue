<template>
  <div class="px-2 md:px-8 lg:px-14 pt-6">
    <div class="flex justify-between ">
      <h1 class="font-bold text-xl md:text-3xl">Applied Job</h1>
      
    </div>
    <div class="relative my-5">
      <div class="overflow-auto">
        <table class="table-auto text-center w-full">
          <thead class="bg-slate-200 ">
            <tr>
              <th class="min-w-max py-2 md:py-3 rounded-l-lg font-normal">Jobs</th>
              <th class="min-w-max py-2 md:py-3 font-normal">Date Applied</th>
              <th class="min-w-max py-2 md:py-3 font-normal">Status</th>

              <th class="min-w-max py-2 md:py-3 rounded-r-lg font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-4">The Sliding Mr</td>
              <td class="py-4">Malcolm Lockyer</td>
              <td class="py-4">1961</td>

              <td class="py-4">
                <router-link
                  to=""
                  class="font-semibold px-1 py-2 text-blue-800 bg-slate-200 hover:bg-blue-500 hover:text-sky-100"
                >
                  View Details
                </router-link>
              </td>
            </tr>
            <tr>
              <td class="py-4">The Sliding Mr</td>
              <td class="py-4">Malcolm Lockyer</td>
              <td class="py-4">1961</td>

              <td class="py-4">
                <router-link
                  to=""
                  class="font-semibold px-1 py-2 text-blue-800 bg-slate-200 hover:bg-blue-500 hover:text-sky-100"
                >
                  View Details
                </router-link>
              </td>
            </tr>
            <tr>
              <td class="py-4">The Sliding Mr</td>
              <td class="py-4">Malcolm Lockyer</td>
              <td class="py-4">1961</td>

              <td class="py-4">
                <router-link
                  to=""
                  class="font-semibold px-1 py-2 text-blue-800 bg-slate-200 hover:bg-blue-500 hover:text-sky-100"
                >
                  View Details
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="bg-gradient-to-l from-transparent via-gray-300/10 to-gray-300/30 w-20 h-full absolute left-0 bottom-0"
      ></div>
      <div
        class="bg-gradient-to-r from-transparent via-gray-300/10 to-gray-300/30 w-20 h-full absolute right-0 bottom-0"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>
