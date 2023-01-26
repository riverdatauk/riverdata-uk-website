import { apiRequest } from './flood-monitoring-api';
import { stripPath } from './utils';

import type { FloodMonitoringApiResponse } from './flood-monitoring-api';
import type { MeasureReading } from './utils';

export type StationReadings = Record<string, MeasureReading[]>;

export type StationReadingsResponse =
  FloodMonitoringApiResponse<StationReadings>;

/**
 * Options to be provided to fetchStationData.
 */
export interface FetchStationReadingsOptions {
  limit?: number;
  ascending?: boolean;
  descending?: boolean;
  since?: string;
}

/**
 * An entry in a response to a station readings request.
 */
interface StationReadingDto {
  '@id': string; // "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-level-stage-i-15_min-mAOD/2023-01-13T20-00-00Z" ,
  dateTime: string; // "2023-01-13T20:00:00Z" ,
  measure: string; // "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-level-stage-i-15_min-mAOD" ,
  value: number; // 4.808
}

const defaults: FetchStationReadingsOptions = {
  // limit: 1000,
};

/**
 * Fetch readings for a station from the EA Flood Monitoring API.
 *
 * @param id The id of the station aka Station Reference.
 * @returns An array of readings plus some information.
 */
export const fetchStationReadings = async (
  id: string,
  options: FetchStationReadingsOptions = {}
): Promise<StationReadingsResponse> => {
  const settings = { ...defaults, ...options };
  const { ascending, descending, since, limit: _limit } = settings;
  const params: Record<string, unknown> = { since, _limit };
  if (since || ascending || descending) {
    params._sorted = true;
  }

  const [data, response] = await apiRequest(`/id/stations/${id}/readings`, {
    params,
  });

  const opts: FetchStationReadingsOptions = { ascending, descending };
  return [parseStationDataResponse(data, opts), response];
};

/**
 * Transform the data returned from the server into a ServerData object.
 *
 * @param data The data from the server.
 * @returns The corresponding StationData object.
 */
const parseStationDataResponse = (
  data: unknown,
  options: FetchStationReadingsOptions = {}
): StationReadings => {
  // Cast the data to an array of DTOs.
  const dtos = data as StationReadingDto[];

  // Build an object grouping series of readings with the same measure Id.
  const series: StationReadings = {};
  dtos.forEach(({ measure, dateTime, value }) => {
    series[measure] = series[measure] || [];
    series[measure].push([new Date(dateTime).valueOf(), value]);
  });

  // Regroup the series using the measure id.
  const categories: StationReadings = {};
  Object.entries(series).forEach(([key, data]) => {
    const measureId = stripPath(key);
    categories[measureId] = data;
  });

  // Sort each of the series in each of the categories.
  const { ascending, descending } = options;
  if (ascending || descending) {
    const compare = ascending
      ? ([a]: MeasureReading, [b]: MeasureReading) => a - b
      : ([a]: MeasureReading, [b]: MeasureReading) => b - a;
    Object.values(categories).forEach((series) => {
      series.sort(compare);
    });
  }

  return categories;
};
