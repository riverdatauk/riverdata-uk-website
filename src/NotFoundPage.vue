<script setup lang="ts">
import { useRouter } from 'vue-router';

const { currentRoute } = useRouter();
</script>

<template>
  <h1>Not Found</h1>
  <p>Could not find the resource {{ currentRoute.path }}</p>
</template>
