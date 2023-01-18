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

const readings = ref();

onMounted(async () => {
  const [fetched, { data }] = await stationStore.getStation(stationId.value);
  station.value = fetched;
  stationResponse.value = data;
});

const getReadings = async () => {
  // const criteria = { stationId: stationId.value };
  const [fetched] = await stationStore.getStationReadings(stationId.value, {
    since: new Date(Date.now() - 86400000).toISOString(),
    ascending: true,
  });
  readings.value = fetched;
};
</script>

<template>
  <div>Station id {{ stationId }}</div>
  <div><button @click="getReadings">Get Readings</button></div>

  <div v-if="readings">
    <pre>{{ readings }}</pre>
  </div>
  <pre>{{ stationResponse }}</pre>

  <div v-if="station">
    <h1>
      {{ station.label }} <small>({{ station.id }})</small>
    </h1>
    <pre>{{ station }}</pre>
  </div>
  <pre>{{ stationResponse }}</pre>
</template>
