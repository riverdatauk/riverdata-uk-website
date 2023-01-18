// import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { fetchStation, fetchStationReadings } from '@/api-client';

import type {
  Station,
  StationResponse,
  StationReadingsResponse,
  FetchStationReadingsOptions,
} from '@/api-client';

export type { Station };

/*
export type Reading = [date: Date, value: number];

export interface Measure {
  notation: string;
  latestReading?: Reading;
  measures: Measure[];
}
*/

export const useStationStore = defineStore('station', () => {
  // const stations = ref<Record<string, Station>>({});

  const getStation = async (id: string): Promise<StationResponse> => {
    const [fetched, response] = await fetchStation(id);
    return [fetched, response];
  };

  const getStationReadings = async (
    id: string,
    options: FetchStationReadingsOptions = {}
  ): Promise<StationReadingsResponse> => {
    const [fetched, response] = await fetchStationReadings(id, options);
    return [fetched, response];
  };

  return { getStation, getStationReadings };
});
