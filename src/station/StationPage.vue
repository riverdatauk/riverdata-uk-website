<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useStationStore } from './station.store';

import type { Station } from './station.store';

const stationStore = useStationStore();

const route = useRoute();

const station = ref<Station>();

const stationId = computed<string>(() => {
  const id = route.params.id;
  console.log('Setting', id, route);
  if (Array.isArray(id)) {
    return id[0];
  }
  return id;
});

onMounted(async () => {
  station.value = await stationStore.fetchStation(stationId.value);
});
</script>

<template>
  <div>Station id {{ stationId }}</div>
  <div v-if="station">
    <div>{{ station.id }} {{ station.name }}</div>
  </div>
</template>
