// import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { fetchStation, fetchStationReadings } from '@/api-client';
import { get, set } from '@/cache';

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

  /**
   * Get the latest readings for a station.
   *
   * By default this will serve cached data if the most recent successful
   * attempt was less than five minutes ago.
   */
  const getStationReadings = async (
    id: string,
    options: FetchStationReadingsOptions = {}
  ): Promise<StationReadingsResponse> => {
    const [fetched, response] = await fetchStationReadings(id, options);
    set(`readings-last-fetched[${id}]`, new Date());
    set(`readings[]${id}`, fetched);
    return [fetched, response];
  };

  return { getStation, getStationReadings };
});
