<script setup>
const props = defineProps({
  isRegister: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <form action="" class="flex flex-col gap-y-3 px-20 py-10">
    <div class="flex flex-col gap-y-1" v-if="props.isRegister === false">
      <label for="" class="font-bold" >Full Name*</label>
      <input
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="text"
        placeholder="Your Full Name"
        required
      />
    </div>
    <div class="flex flex-col gap-y-1">
      <label for="" class="font-bold" >E-mail*</label>
      <input
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="email"
        placeholder="Enter Email"
        required
      />
    </div>
    <div class="flex flex-col gap-y-1">
      <label for="" class="font-bold">Password*</label>
      <input
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="password"
        placeholder="Enter Password"
        required
      />
    </div>
    <div class="flex flex-col gap-y-1" v-if="props.isRegister === false">
      <label for="" class="font-bold">Confirm Password*</label>
      <input
        class="bg-gray-100 rounded-sm shadow-lg text-center outline-none h-8"
        type="password"
        placeholder="Confirm Password"
        required
      />
    </div>
    <div v-show="props.isRegister">
      <input type="checkbox" />
      <span> Save history </span>
    </div>
    <div class="flex flex-col">
      <button
        class="bg-blue-900 py-2 rounded-lg shadow-xl text-white font-black text-2xl"
      >
        {{ props.isRegister ? "Login" : "Create" }}
      </button>
      <p class="text-center font-bold">
        {{
          props.isRegister
            ? "Don`t have any account?"
            : "Already have any account?"
        }}
        <router-link
          :to="props.isRegister ? { name: 'register' } : { name: 'login' }"
          class="text-blue-700 underline"
        >
          {{ props.isRegister ? "Sign up" : "login" }}
        </router-link>
      </p>
    </div>
  </form>
</template>
