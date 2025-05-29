<template>
  <div class="">
    <div
      class="flex justify-between items-start sm:items-center pt-6 sm:pt-12 mb-6"
    >
      <p class="font-bold text-xl sm:text-lg mb-4 sm:mb-0">All Applications</p>
      <button
        class="bg-blue-950/80 text-white px-2 py-1 md:px-5 md:py-2 rounded-md shadow-md hover:bg-blue-800 transition-colors duration-300"
      >
        Delete Job
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg shadow-sm">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr class="text-center">
            <th
              class="px-4 py-3 rounded-tl-lg font-medium text-sm text-gray-600"
            >
              Name
            </th>
            <th class="px-4 py-3 font-medium text-sm text-gray-600">
              Date Applied
            </th>
            <th class="px-4 py-3 font-medium text-sm text-gray-600">CV</th>
            <th
              class="px-4 py-3 rounded-tr-lg font-medium text-sm text-gray-600"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="text-center">
            <td class="px-4 py-5 font-bold text-md text-gray-800">John Doe</td>
            <td class="px-4 py-5 text-gray-600 text-sm font-semibold">
              March 10, 2025 10:10 AM
            </td>
            <td class="px-4 py-5">
              <button
                class="bg-blue-950/80 text-white px-5 py-1.5 rounded-md shadow-sm hover:bg-blue-800 transition-colors duration-300 text-sm"
              >
                View CV
              </button>
            </td>
            <td class="px-4 py-5 relative">
              <Icon
                icon="bxs:down-arrow"
                width="16"
                height="16"
                style="color: #606060"
                class="absolute inset-x-22 inset-y-11 md:inset-x-24 md:inset-y-8 lg:inset-x-32 lg:inset-y-8 xl:inset-x-42"
              />
              <select
                name="status"
                id="status-dropdown"
                :class="getStatusColorClass(status)"
                v-model="status"
              >
                <option value="Process">Process</option>
                <option value="Screening">Screening</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// State to manage the status of the first application row
const status = ref("Process");
// State for the second application row (for demonstration)
const status2 = ref("Screening"); // Example: fixed to Screening for demo
const status3 = ref("Accepted"); // Example: fixed to Screening for demo
const status4 = ref("Rejected"); // Example: fixed to Screening for demo

// Function to determine the background color class based on the selected status
const getStatusColorClass = (currentStatus) => {
  switch (currentStatus) {
    case "Accepted":
      return "appearance-none px-4 py-2 rounded-md font-medium text-sm focus:outline-none  focus:border-transparent cursor-pointer bg-green-300 text-black"; // Green for Accepted
    case "Rejected":
      return "appearance-none px-4 py-2 rounded-md font-medium text-sm focus:outline-none  focus:border-transparent cursor-pointer bg-red-300 text-black"; // Red for Rejected
    case "Screening":
      return "appearance-none px-4 py-2 rounded-md font-medium text-sm focus:outline-none  focus:border-transparent cursor-pointer bg-orange-300 text-black"; // Orange for Screening
    default:
      return "appearance-none px-4 py-2 rounded-md font-medium text-sm focus:outline-none  focus:border-transparent cursor-pointer bg-blue-300 text-black"; // Default blue for Process
  }
};
</script>
