<template>
  <div class="fixed bottom-4 right-5 flex flex-col gap-y-4 z-30">
    <div>
      <div @click="toggleChat" class="cursor-pointer">
        <img src="../../../public/chatbot.png" alt="" class="h-18 lg:h-22" />
      </div>
    </div>
    <div class="cursor-pointer" @click="toggleDepret">
      <img src="../../../public/depret.png" alt="" class="h-18 lg:h-22" />
    </div>
  </div>

  <!-- chatbot -->
  <div
    class="absolute -top-32 md:-top-44 lg:-top-28 bg-slate-400/80 h-[980px] w-full z-50 place-content-center"
    v-if="showChat"
  >
    <div class="max-w-sm md:max-w-xl mx-auto bg-white">
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
        <div
          class="bg-[#f4f6fb] mt-4 p-4 rounded-lg max-h-[60vh] overflow-y-auto"
        >
          <div v-for="(msg, index) in chatHistory" :key="index" class="mb-2">
            <div
              v-if="msg.sender === 'user'"
              class="flex items-start gap-x-2 place-content-end"
            >
              <div
                class="bg-white p-2 rounded shadow text-sm border-r-4 border-[#002766] w-54"
              >
                {{ msg.text }}
              </div>
              <div class="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
            </div>
            <div v-else class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              <div
                class="bg-white p-2 rounded shadow text-sm border-l-4 border-[#002766] w-54"
              >
                {{ msg.text }}
              </div>
            </div>
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
  <!-- end chatbot -->

  <!-- depretion -->
  <div
    class="absolute -top-28 bg-slate-400/80 h-[980px] w-full z-50 place-content-center"
    v-if="showDepret"
  >
    <div class="max-w-xl mx-auto bg-white ">
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
        <h1 class="text-center font-bold font-[shrikhand] text-2xl">
          How is your emotional day ?
        </h1>
        <div class="px-10 py-4">
          <div class="flex justify-center gap-x-8">
            <div
              v-for="(emoji, index) in emojis"
              :key="index"
              class="text-center font-bold text-2xl cursor-pointer"
              @click="selectEmotion(index + 1)"
            >
              <Icon :icon="emoji.icon" width="58" height="58" />
              <span>{{ index + 1 }}</span>
            </div>
          </div>
        </div>
        <p class="text-center text-black font-medium text-base py-5">
          Please select one of the available emoticons
        </p>

        <div v-if="selectedArticle" class="px-10 pb-6 text-center">
          <p class="mb-4">Here's an article that might help:</p>
          <a
            :href="selectedArticle.url"
            target="_blank"
            class="text-blue-600 hover:underline"
          >
            {{ selectedArticle.title }}
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- depretion -->
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import axios from "axios";

const showChat = ref(false);
const showDepret = ref(false);
const newMessage = ref("");
const chatHistory = ref([]);
console.log("chat", chatHistory);

const selectedEmotion = ref(null);
const selectedArticle = ref(null);

const emojis = [
  { icon: "noto:slightly-frowning-face", scale: 1 },
  { icon: "noto:frowning-face", scale: 2 },
  { icon: "noto:neutral-face", scale: 3 },
  { icon: "noto:slightly-smiling-face", scale: 4 },
  { icon: "noto:beaming-face-with-smiling-eyes", scale: 5 },
];

const articlesByScale = {
  1: [
    {
      url: "https://www.alodokter.com/ternyata-tidak-sulit-mengatasi-stres",
      title: "Ternyata Tidak Sulit Mengatasi Stres - Alodokter",
    },
    {
      url: "https://www.halodoc.com/artikel/pikiran-lebih-tenang-ini-6-cara-menghilangkan-stres",
      title: "6 Cara Menghilangkan Stres - Halodoc",
    },
    {
      url: "https://hellosehat.com/mental/stres/cara-unik-menghilangkan-stres/",
      title: "Cara Unik Menghilangkan Stres - Hello Sehat",
    },
    {
      url: "https://www.detik.com/bali/berita/d-6450082/10-cara-menghilangkan-stres-yang-sederhana-dan-efektif",
      title: "10 Cara Menghilangkan Stres - Detik",
    },
    {
      url: "https://prodia.co.id/id/artikel-detail/9-cara-mengatasi-stres-secara-efektif",
      title: "9 Cara Mengatasi Stres - Prodia",
    },
  ],
  2: [
    {
      url: "https://upk.kemkes.go.id/new/5-cara-mengatasi-rasa-tidak-nyaman-akibat-stress",
      title: "5 Cara Mengatasi Rasa Tidak Nyaman - Kemenkes",
    },
    {
      url: "https://rsum.bandaacehkota.go.id/7-cara-efektif-mengatasi-stres-biar-pikiran-gak-meledak/",
      title: "7 Cara Efektif Mengatasi Stres - RSU Banda Aceh",
    },
    {
      url: "https://dinkes.bandaacehkota.go.id/2024/01/30/strategi-efektif-dalam-mengelola-stres-untuk-kesejahteraan-mental/",
      title: "Strategi Mengelola Stres - Dinkes Banda Aceh",
    },
    {
      url: "https://prodiadigital.com/id/artikel/6-cara-mengelola-stres-dengan-baik-dan-mudah",
      title: "6 Cara Mengelola Stres - Prodia Digital",
    },
    {
      url: "https://www.siloamhospitals.com/en/informasi-siloam/artikel/memahami-stres-dan-cara-menanganinya",
      title: "Memahami Stres - Siloam",
    },
  ],
  3: [
    {
      url: "https://www.unicef.org/indonesia/id/kesehatan-mental/artikel/kecemasan",
      title: "Mengatasi Kecemasan - UNICEF",
    },
    {
      url: "https://www.siloamhospitals.com/en/informasi-siloam/artikel/anxiety-disorder",
      title: "Anxiety Disorder - Siloam",
    },
    {
      url: "https://www.alodokter.com/gangguan-kecemasan",
      title: "Gangguan Kecemasan - Alodokter",
    },
    {
      url: "https://hellosehat.com/mental/kecemasan/",
      title: "Mengenal Kecemasan - Hello Sehat",
    },
    {
      url: "https://www.halodoc.com/artikel/kata-psikolog-ketahui-cara-tepat-untuk-mengelola-stres",
      title: "Cara Mengelola Stres - Halodoc",
    },
  ],
  4: [
    {
      url: "https://www.tanamduit.com/belajar/lifestyle/kunci-hidup-tenang-dan-bahagia-agar-terhindar-dari-gelisa",
      title: "Kunci Hidup Tenang dan Bahagia - Tanam Duit",
    },
    {
      url: "https://www.liputan6.com/citizen6/read/5792326/cara-hidup-tenang-dan-bahagia-dengan-sikap-rendah-hati-tingkatkan-kualitas-hidup",
      title: "Cara Hidup Tenang - Liputan6",
    },
    {
      url: "https://www.rri.co.id/lhokseumawe/lain-lain/1198307/kunci-hidup-tenang-dan-bahagia-tanpa-dendam",
      title: "Hidup Tenang Tanpa Dendam - RRI",
    },
    {
      url: "https://hellosehat.com/mental/kebahagiaan/hidup-bahagia-dan-tenang/",
      title: "Hidup Bahagia dan Tenang - Hello Sehat",
    },
    {
      url: "https://yoursay.suara.com/lifestyle/2023/08/28/180000/10-cara-hidup-tenang-dan-bahagia-dengan-cukup-sederhana",
      title: "10 Cara Hidup Tenang - Suara.com",
    },
  ],
  5: [
    {
      url: "https://www.fimela.com/lifestyle/read/5423198/7-tanda-orang-yang-hidupnya-sudah-cukup-bahagia",
      title: "Tanda Orang Bahagia - Fimela",
    },
    {
      url: "https://hangtuah.ac.id/kebahagiaan-itu-diciptakan-tidak-datang-dengan-sendiri/",
      title: "Kebahagiaan Diciptakan - Hang Tuah",
    },
    {
      url: "https://www.generali.co.id/id/healthyliving/3/mencapai-hidup-bahagia-sejahtera-dengan-mindful-living",
      title: "Mindful Living - Generali",
    },
    {
      url: "https://hellosehat.com/mental/kebahagiaan/cara-menjadi-lebih-bahagia/",
      title: "Cara Menjadi Lebih Bahagia - Hello Sehat",
    },
    {
      url: "https://www.gramedia.com/literasi/cara-menjadi-orang-bahagia/",
      title: "Cara Menjadi Orang Bahagia - Gramedia",
    },
  ],
};

const toggleChat = () => {
  showChat.value = !showChat.value;
};

const closeChat = () => {
  showChat.value = false;
};

const toggleDepret = () => {
  showDepret.value = !showDepret.value;
  if (showDepret.value) {
    selectedEmotion.value = null;
    selectedArticle.value = null;
  }
};

const closeDepret = () => {
  showDepret.value = false;
};

const selectEmotion = (scale) => {
  selectedEmotion.value = scale;
  const articles = articlesByScale[scale];
  const randomIndex = Math.floor(Math.random() * articles.length);
  selectedArticle.value = articles[randomIndex];
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const userMessage = {
    sender: "user",
    text: newMessage.value,
  };

  chatHistory.value.push(userMessage);

  try {
    const response = await axios.post("https://machine-learning-production.up.railway.app/predict", {
      text: newMessage.value,
    });

    console.log("API Response:", response.data);

    const botReply = {
      sender: "bot",
      text: response.data?.response || "Maaf, tidak dapat memproses jawaban.",
    };

    chatHistory.value.push(botReply);
  } catch (error) {
    chatHistory.value.push({
      sender: "bot",
      text:
        error.response?.data?.detail ||
        "Terjadi kesalahan dalam menghubungi server.",
    });
  }

  newMessage.value = "";
};
</script>
