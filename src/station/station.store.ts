import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface Station {
  id: string;
  name: string;
}

export const useStationStore = defineStore('station', () => {
  const stations = ref<Record<string, Station>>({});

  const getStation = computed((id: string): Station | undefined => {
    return stations.value[id];
  });

  const fetchStation = async (id: string): Promise<Station | undefined> => {
    return { id, name: 'Mock station ' + new Date().toISOString()};
  };

  return { fetchStation };
});
