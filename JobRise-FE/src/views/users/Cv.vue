<template>
  <div class="min-h-screen relative flex flex-col xl:flex-row justify-between px-8 pt-8 ">
    <div class="w-full xl:pr-7 xl:w-[800px]">
      <h1 class="font-bold text-center text-2xl lg:text-3xl py-3">
        Curriculum Vitae
      </h1>
      <TabsCv />
      <FormCVProfile />
    </div>

    <div class="w-[1px] h-screen my-12 bg-slate-300 flex-none hidden xl:block  ">
      
    </div>


    <div class="xl:pl-4 py-4 xl:py-0">
      <h1 class="font-bold text-center text-2xl lg:text-3xl">Preview</h1>
      <PreviewCV />
    </div>
  </div>
</template>

<script setup>
import FormCVProfile from "@/components/users/FormCVProfile.vue";
import TabsCv from "@/components/users/TabsCv.vue";
import PreviewCV from "@/components/users/PreviewCV.vue";
</script>
