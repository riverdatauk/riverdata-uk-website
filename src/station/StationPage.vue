<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useStationStore } from './station.store';

import type { Station } from './station.store';

const stationStore = useStationStore();

const route = useRoute();

const station = ref<Station | null>(null);

const stationResponse = ref<Record<string, unknown>>({});

const stationId = computed<string>(() => {
  const id = route.params.id;
  if (Array.isArray(id)) {
    return id[0];
  }
  return id;
});

onMounted(async () => {
  const [fetched, { data }] = await stationStore.fetchStation(stationId.value);
  station.value = fetched;
  stationResponse.value = data;
});
</script>

<template>
  <div>Station id {{ stationId }}</div>
  <div v-if="station">
    <h1>
      {{ station.name }} <small>({{ station.id }})</small>
    </h1>
    <pre>{{ station }}</pre>
  </div>
  <pre>{{ stationResponse }}</pre>
</template>
