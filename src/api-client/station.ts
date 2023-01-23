import { apiRequest } from './flood-monitoring-api';
import { stripPath, transformDto } from './utils';
import { transformStageScale } from './stage-scale';
import { measureDtoTransforms } from './measure';

import type { FloodMonitoringApiResponse } from './flood-monitoring-api';
import type { Dto, DtoTransforms } from './utils';
import type { StageScale } from './stage-scale';
import type { Measure } from './measure';

export type StationResponse = FloodMonitoringApiResponse<Station>;

export type StationsResponse = FloodMonitoringApiResponse<
  Record<string, Station>
>;

export interface Station {
  // A unique identifier taken from the last part of the `@id` field e.g. 3400TH
  // from http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH.
  id: string;
  // Identifier for the station, as used by River Levels On the Internet.
  RLOIid?: string; // e.g. '7267'
  // The name of the river catchment which this site is related to, if any.
  catchmentName?: string; // e.g. 'Thames from Hurley to Teddington'
  // The date on which the station opened.
  dateOpened?: string; // e.g. '1983-01-01'
  // Offset between the reference point for how the data is originally recorded and how it is normally displayed. Normally this is the difference between Ordnance datum and the stage datum.
  datumOffset?: number;
  // Scale limits and historic range for the downstream stage water level.
  downstageScale?: StageScale;
  // Name of the relevant Environment Agency Area.
  eaAreaName?: string; // e.g. 'Thames - West Thames'
  // Documented as "No longer used"!
  eaRegionName?: string; // e.g. 'Thames'
  // Easting of the station on British National Grid.
  easting?: number; // e.g. 517700
  // A name for the item.
  label?: string; // e.g. 'Kingston'
  // Latitude of the station, in WGS84 coordinate ref.
  lat?: number; // e.g. 51.415005
  // Longitude of the station, in WGS84 coordinate ref.
  long?: number; // e.g. -0.308869
  // The set of measurement types available from the station.
  // @TODO
  measures?: unknown;
  // Northing of the station on British National Grid.
  northing?: number; // e.g. 169800
  // A string or other literal which uniquely identifies the item.
  notation?: string; // e.g. '3400TH'
  // Name of river associated with this monitoring station (when available).
  riverName?: string; // e.g. 'River Thames'
  // stageScale	Scale limits and historic range for the main stage water level.
  stageScale?: StageScale;
  // Identifier for the telemetry feed used by the Environment Agency's National
  // Flood Forecasting System.
  stationReference?: string; // e.g. '3400TH'
  // The status of the station, one of rt:statusActive, rt:statusClosed or rt:statusSuspended.
  status?: string; // e.g. 'http://environment.data.gov.uk/flood-monitoring/def/core/statusActive'
  // Provides some explanation of the status or change in status of the station.
  statusReason?: string;
  // The date/time of the last update to the status of this station.
  statusDate?: string;
  // Name of the nearest town (or named place) to the station.
  town?: string; // e.g. 'Kingston Upon Thames'
  // A list of types for the station, will be rt:Station plus one of
  // rt:SingleLevel, rt:MultiTraceLevel, rt:Coastal, rt:Groundwater or
  // rt:Meteorological.
  type?: string[]; // e.g. [
  //  'http://environment.data.gov.uk/flood-monitoring/def/core/SingleLevel',
  //  'http://environment.data.gov.uk/flood-monitoring/def/core/Station'
  // ];
  // Identifier for the station in the WISKI hydrology dataset.
  wiskiID?: string; // e.g. '3400TH'
}

const stationDtoTransforms: DtoTransforms = {
  id: ['@id', (id: unknown) => stripPath(id as string)],
  RLOIid: true, // e.g. '7267'
  catchmentName: true, // e.g. 'Thames from Hurley to Teddington'
  dateOpened: true, // e.g. '1983-01-01'
  datumOffset: true,
  // Scale limits and historic range for the downstream stage water level.
  // @TODO
  downstageScale: [true, transformStageScale],
  eaAreaName: true, // e.g. 'Thames - West Thames'
  eaRegionName: true, // e.g. 'Thames'
  easting: true, // e.g. 517700
  label: true, // e.g. 'Kingston'
  lat: true, // e.g. 51.415005
  long: true, // e.g. -0.308869
  // The set of measurement types available from the station.
  measures: [
    // Map to measures.
    true,
    (dto: unknown) => {
      // Map each measure DTO.
      return (dto as Dto[]).map((measure) => {
        return transformDto<Measure[]>(measure, measureDtoTransforms);
      });
    },
  ],
  northing: true, // e.g. 169800
  notation: true, // e.g. '3400TH'
  riverName: true, // e.g. 'River Thames'
  stageScale: [true, transformStageScale],
  stationReference: true, // e.g. '3400TH'
  // The status of the station, one of rt:statusActive, rt:statusClosed or rt:statusSuspended.
  // @TODO
  status: true, // e.g. 'http://environment.data.gov.uk/flood-monitoring/def/core/statusActive'
  statusReason: true,
  statusDate: true,
  town: true, // e.g. 'Kingston Upon Thames'
  // A list of types for the station, will be rt:Station plus one of
  // rt:SingleLevel, rt:MultiTraceLevel, rt:Coastal, rt:Groundwater or
  // rt:Meteorological.
  type: true, // e.g. [
  //  'http://environment.data.gov.uk/flood-monitoring/def/core/SingleLevel',
  //  'http://environment.data.gov.uk/flood-monitoring/def/core/Station'
  // ];
  // Identifier for the station in the WISKI hydrology dataset.
  wiskiID: true, // e.g. '3400TH'
};

/**
 * Fetch a station from the EA Flood Monitoring API.
 *
 * @param id The id of the station aka Station Reference.
 * @returns The station plus some information.
 */
export const fetchStation = async (id: string): Promise<StationResponse> => {
  const [data, response] = await apiRequest(`/id/stations/${id}`);
  const station = transformDto<Station>(data as Dto, stationDtoTransforms);
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
  (data as unknown as Dto[]).forEach((item: Dto) => {
    const station = transformDto<Station>(item, stationDtoTransforms);
    stations[station.id] = station;
  });
  return [stations, response];
};
