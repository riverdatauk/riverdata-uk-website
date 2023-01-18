export { fetchStation } from './station';
export { fetchStationReadings } from './station-reading';

// export type { FloodMonitoringApiResponse } from './flood-monitoring-api';
export type { Station, StationResponse } from './station';
export type {
  StationReadings,
  StationReadingsResponse,
  FetchStationReadingsOptions,
} from './station-reading';

/*
import type { StationInterface } from './station';
import { jsonRequest } from './request';
import type { RequestOptions } from './request';

export type ApiResponse = {
  data: Record<string, unknown>;
  response: Response;
};

const apiRequest = async (path: string, options: RequestOptions = {}) => {
  const info = await jsonRequest(path, {
    baseUrl: 'https://environment.data.gov.uk/flood-monitoring',
    ...options,
  });

  return [info.data.items, info];
};

export const fetchStation = async (
  id: string
): Promise<[StationInterface, ApiResponse]> => {
  const [maybeStation, info] = await apiRequest(`/id/stations/${id}`);
  return [maybeStation as unknown as StationInterface, info];
};
*/
