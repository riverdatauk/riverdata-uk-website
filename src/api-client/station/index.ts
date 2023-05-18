/**
 * Refactoring required.
 *
 * fetchStation() - calls fetchStationDto and returns a Station (+ info).
 *
 * fetchStations() - calls fetchStationsDto and returns Stations (+ info).
 * For a large dataset this could be expensive: options include
 *
 * fetchStationDto() - calls apiRequest and returns a StationDto (+ info).
 * fetchStationDtos() - calls apiRequest and returns an array of StationDtos (+ info).
 * A DTO is simply a type that the response data is cast to so should not add
 * any weight to runtime:
 * ```javascript
 * return data as StationDto;
 * return data as StationDto[];
 * ```
 * Allow access to these functions to bypass the (possibly opinionated) Station
 * object.
 */
import { apiRequest } from '../flood-monitoring-api';
import { stationFromDto } from './station';

import type { FloodMonitoringApiResponse } from '../flood-monitoring-api';
import type { Dto } from '../utils';
import type { Station, StationDto } from './station';

export type { Station, StationDto };

export type StationResponse = FloodMonitoringApiResponse<Station>;
export type StationDtoResponse = FloodMonitoringApiResponse<StationDto>;

export type StationsResponse = FloodMonitoringApiResponse<
  Record<string, Station>
>;

/**
 * Fetch a station from the EA Flood Monitoring API.
 *
 * @param id The id of the station aka Station Reference.
 * @returns The station plus some information.
 */
export const fetchStationDto = async (
  id: string
): Promise<StationDtoResponse> => {
  const [data, response] = await apiRequest(`/id/stations/${id}`);
  return [data as StationDto, response];
};

/**
 * Fetch a station from the EA Flood Monitoring API.
 *
 * @param id The id of the station aka Station Reference.
 * @returns The station plus some information.
 */
export const fetchStation = async (id: string): Promise<StationResponse> => {
  const [dto, response] = await fetchStationDto(id);
  const station = stationFromDto(dto);
  return [station, response];
};

/**
 * Fetch stations from the EA Flood Monitoring API.
 */
export const fetchStations = async (
  options = {}
): Promise<StationsResponse> => {
  const params = { _limit: 10 };
  const [data, response] = await apiRequest(`/id/stations`, {
    params,
    // @ts-ignore
    ...options.requestOptions,
  });
  const stations: Record<string, Station> = {};
  (data as unknown as Dto[]).forEach((item: unknown) => {
    const station = stationFromDto(item as StationDto);
    stations[station.id] = station;
  });
  return [stations, response];
};
