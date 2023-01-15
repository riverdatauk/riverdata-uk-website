<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <header>
    <nav>
      <HelloWorld msg="River Data" /> | <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink> |
      <RouterLink to="/station">Station</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
