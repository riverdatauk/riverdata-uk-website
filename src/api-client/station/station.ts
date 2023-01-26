import { stripPath } from '../utils';
import { stageScaleFromDto } from './stage-scale';
import { measureFromDto } from '../measure';

import type { StageScale } from './stage-scale';

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
  downstageScale?: unknown;
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
  measures?: unknown[];
  // Northing of the station on British National Grid.
  northing?: number; // e.g. 169800
  // A string or other literal which uniquely identifies the item.
  notation?: string; // e.g. '3400TH'
  // Name of river associated with this monitoring station (when available).
  riverName?: string; // e.g. 'River Thames'
  // stageScale	Scale limits and historic range for the main stage water level.
  stageScale?: unknown;
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

export interface StationDto {
  // URI.
  // e.g. http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH.
  '@id': string;
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

export const stationFromDto = (dto: StationDto): Station => {
  const measures = Array.isArray(dto.measures)
    ? dto.measures.map((measure) => measureFromDto(measure))
    : [];

  return {
    id: stripPath(dto['@id']),
    RLOIid: dto.RLOIid,
    catchmentName: dto.catchmentName, // e.g. 'Thames from Hurley to Teddington'
    dateOpened: dto.dateOpened, // e.g. '1983-01-01'
    datumOffset: dto.datumOffset,
    // Scale limits and historic range for the downstream stage water level.
    // @TODO
    downstageScale: stageScaleFromDto(dto.downstageScale),
    eaAreaName: dto.eaAreaName, // e.g. 'Thames - West Thames'
    eaRegionName: dto.eaRegionName, // e.g. 'Thames'
    easting: dto.easting, // e.g. 517700
    label: dto.label, // e.g. 'Kingston'
    lat: dto.lat, // e.g. 51.415005
    long: dto.long, // e.g. -0.308869
    // The set of measurement types available from the station.
    measures,
    northing: dto.northing, // e.g. 169800
    notation: dto.notation, // e.g. '3400TH'
    riverName: dto.riverName, // e.g. 'River Thames'
    stageScale: stageScaleFromDto(dto.stageScale),
    stationReference: dto.stationReference, // e.g. '3400TH'
    // The status of the station, one of rt:statusActive, rt:statusClosed or rt:statusSuspended.
    // @TODO
    status: dto.status, // e.g. 'http://environment.data.gov.uk/flood-monitoring/def/core/statusActive'
    statusReason: dto.statusReason,
    statusDate: dto.statusDate,
    town: dto.town, // e.g. 'Kingston Upon Thames'
    // A list of types for the station, will be rt:Station plus one of
    // rt:SingleLevel, rt:MultiTraceLevel, rt:Coastal, rt:Groundwater or
    // rt:Meteorological.
    type: dto.type, // e.g. [
    //  'http://environment.data.gov.uk/flood-monitoring/def/core/SingleLevel',
    //  'http://environment.data.gov.uk/flood-monitoring/def/core/Station'
    // ];
    // Identifier for the station in the WISKI hydrology dataset.
    wiskiID: dto.wiskiID, // e.g. '3400TH'
  };
};
