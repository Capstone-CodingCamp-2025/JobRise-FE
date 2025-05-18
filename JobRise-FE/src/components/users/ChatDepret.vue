<template>
  <div class="fixed bottom-4 right-5 flex flex-col gap-y-4 z-30">
    <div>
      <div @click="toggleChat" class="cursor-pointer">
        <img src="../../../public/chatbot.png" alt="" class="h-22" />
      </div>
    </div>
    <div class="cursor-pointer" @click="toggleDepret">
      <img src="../../../public/depret.png" alt="" class="h-22" />
    </div>
  </div>

  <!-- chatbot -->
  <div
    class="absolute top-0 bg-slate-400/80 min-h-screen w-full z-50 place-content-center"
    v-if="showChat"
  >
    <div class="max-w-xl mx-auto bg-white">
      <div class="bg-[#D5DEEF] flex justify-between px-4">
        <img src="../../../public/jobrise.png" alt="jobrise" class="w-28" />
        <button
          @click="closeChat"
          class="text-2xl text-gray-600 cursor-pointer"
        >
          <Icon
            icon="ic:baseline-close"
            width="24"
            height="24"
            style="color: #000"
          />
        </button>
      </div>
      <div class="relative px-10 pt-5 pb-8">
        <!-- Chat Area -->
        <div class="bg-[#f4f6fb] mt-4 p-4 rounded-lg">
          <!-- User Message -->
          <div class="flex items-start mb-2">
            <div class="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
            <div
              class="bg-white p-2 rounded shadow text-sm border-l-4 border-[#002766] w-54"
            >
              Halo (User), .....
            </div>
          </div>

          <!-- Bot Message -->
          <div class="flex items-start mb-2">
            <div class="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
            <div
              class="bg-white p-2 rounded shadow text-sm border-l-4 border-[#002766] w-54"
            >
              lorem Lorem ispispsum
            </div>
          </div>

          <div class="flex items-start gap-x-2 mb-2 place-content-end">
            <div
              class="bg-white p-2 rounded shadow text-sm border-r-4 border-[#002766] w-54"
            >
              lorem Lorem ispispsum
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
          </div>

          <div class="flex items-start gap-x-2 mb-2 place-content-end">
            <div
              class="bg-white p-2 rounded shadow text-sm border-r-4 border-[#002766] w-54"
            >
              lorem Lorem ispispsum
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
          </div>

          <div class="flex items-start mb-2">
            <div class="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
            <div
              class="bg-white p-2 rounded shadow text-sm border-l-4 border-[#002766] w-54"
            >
              lorem Lorem ispispsum
            </div>
          </div>

          <!-- Message Box -->
          <form
            @submit.prevent="sendMessage"
            class="flex items-center border rounded p-2 bg-white mt-6"
          >
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a new message here"
              class="flex-1 outline-none text-sm px-2"
            />
            <button type="submit" class="text-white py-1">
              <Icon
                icon="lets-icons:send-hor-light"
                width="24"
                height="24"
                style="color: #000"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- end chatbot -->

   <!-- depretion -->
   <div
    class="absolute top-0 bg-slate-400/80 min-h-screen w-full z-50 place-content-center"
    v-if="showDepret"
  >
    <div class="max-w-xl mx-auto bg-white">
      <div class="bg-[#D5DEEF] flex justify-between px-4">
        <img src="../../../public/jobrise.png" alt="jobrise" class="w-28" />
        <button
          @click="closeDepret"
          class="text-2xl text-gray-600 cursor-pointer"
        >
          <Icon
            icon="ic:baseline-close"
            width="24"
            height="24"
            style="color: #000"
          />
        </button>
      </div>
      <div>
        <h1 class="text-center font-bold font-[shrikhand] text-2xl">How is your emotional day ?</h1>
        <div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
   <!-- depretion -->
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { onBeforeMount } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";

const showChat = ref(false);
const showDepret = ref(false)


const toggleChat = () => {
  showChat.value = !showChat.value;
};

const closeChat = () => {
  showChat.value = false;
};

const toggleDepret = () => {
  showDepret.value = !showDepret.value
}

const closeDepret = () => {
  showDepret.value = false
}

</script>
