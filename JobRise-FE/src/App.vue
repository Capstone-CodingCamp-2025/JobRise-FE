<script setup>
import {  RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import Chatbot from './components/users/ChatDepret.vue';

</script>

<template>
  <main class="min-h-screen relative ">
    <Navbar/>
    <router-view></router-view>
    <Chatbot />
  </main>
  <Footer class=""/>
</template>


