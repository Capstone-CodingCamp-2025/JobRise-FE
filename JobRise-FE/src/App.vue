<script setup>
import {  RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';


</script>

<template>
  <main class="min-h-screen  ">
    <Navbar/>
    <router-view></router-view>
    <hr class="text-gray-400">
    <Footer/>
  </main>
</template>


