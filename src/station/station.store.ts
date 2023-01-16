import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import { fetchStation as apiFetchStation } from '@/flood-monitoring-api';

import type { ApiResponse } from '@/flood-monitoring-api';

type StationResponse = [item: Station | null, response: ApiResponse];

export type Reading = [date: Date, value: number];

export interface Measure {
  notation: string;
  latestReading?: Reading;
  measures: Measure[];
}

export interface Station {
  id: string;
  name: string;
  // measures: Measure[];
}

export const useStationStore = defineStore('station', () => {
  const stations = ref<Record<string, Station>>({});

  const getStation = computed((id: string): Station | undefined => {
    return stations.value[id];
  });

  const fetchStation = async (id: string): Promise<StationResponse> => {
    const [fetched, response] = await apiFetchStation(id);
    const station: Station = {
      id: fetched.stationReference,
      name: fetched.label,
    };
    return [station, response];
  };

  return { fetchStation };
});
