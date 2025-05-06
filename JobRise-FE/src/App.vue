<script setup>
import {  RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';


</script>

<template>
  <main class="min-h-screen bg-[#F0F3FA] ">
    <Navbar/>
    <router-view></router-view>
    <Footer/>
  </main>
</template>


