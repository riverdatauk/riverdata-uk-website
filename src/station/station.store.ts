import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

interface Station {
  id: string;
  name: string;
}

export const useStationStore = defineStore('station', () => {
  const stations = ref<Record<string, Station>>({});

  const getStation = computed((id: string): Station | null => {
    return stations.value[id];
  });

  const fetchStation = async (id: string): Promise<Station | null> => {
    return stations.value[id];
  };

  return { fetchStation };
});
