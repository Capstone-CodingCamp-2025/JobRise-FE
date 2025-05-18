<script setup>
import {  RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import Chatbot from './components/users/ChatDepret.vue';
import { AuthUserStorage } from './stores/auth/userAuth';
import { computed } from 'vue';
import { useAuthCompanyStore } from './stores/auth/companyAuth';


const company = useAuthCompanyStore()

const user = AuthUserStorage()
const isUser = computed(()=> {
  return !!user.currentUser
})



const isLoggedIn = computed(() => {
  return !!user.currentUser ;
});

</script>

<template>
  <main class="min-h-screen relative ">
    <Navbar/>
    <router-view></router-view>
    <Chatbot v-if="isLoggedIn && isUser"/>
  </main>
  <Footer class=""/>
</template>


