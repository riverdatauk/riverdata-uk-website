import { apiRequest } from './flood-monitoring-api';

import type { FloodMonitoringApiResponse } from './flood-monitoring-api';
import { stripPath, transformDto } from './utils';

export type StationResponse = FloodMonitoringApiResponse<Station>;
export type StationsResponse = FloodMonitoringApiResponse<
  Record<string, Station>
>;

/**
 * Fetch a station from the EA Flood Monitoring API.
 *
 * @param id The id of the station aka Station Reference.
 * @returns The station plus some information.
 */
export const fetchStation = async (id: string): Promise<StationResponse> => {
  const [data, response] = await apiRequest(`/id/stations/${id}`);
  const station = transformDto(data, stationDtoTransforms);
  return [station, response];
};

const stationDtoTransforms = {
  id: (dto) => stripPath(dto['@id']),
  RLOIid: true, // e.g. '7267'
  catchmentName: true, // e.g. 'Thames from Hurley to Teddington'
  dateOpened: true, // e.g. '1983-01-01'
  datumOffset: true,
  // Scale limits and historic range for the downstream stage water level.
  // @TODO
  downstageScale: true,
  eaAreaName: true, // e.g. 'Thames - West Thames'
  eaRegionName: true, // e.g. 'Thames'
  easting: true, // e.g. 517700
  label: true, // e.g. 'Kingston'
  lat: true, // e.g. 51.415005
  long: true, // e.g. -0.308869
  // The set of measurement types available from the station.
  // @TODO
  measures: true,
  northing: true, // e.g. 169800
  notation: true, // e.g. '3400TH'
  riverName: true, // e.g. 'River Thames'
  // stageScale	Scale limits and historic range for the main stage water level.
  // @TODO
  stageScale: true,
  /*
  stageScale: {
    '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale';
    datum: 0;
    highestRecent: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/highestRecent';
      dateTime: '2014-02-02T04:45:00';
      value: 5.707;
    };
    maxOnRecord: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/maxOnRecord';
      dateTime: '2000-10-31T17:15:00';
      value: 5.707;
    };
    minOnRecord: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/minOnRecord';
      dateTime: '1988-06-22T11:30:00';
      value: 0.193;
    };
    scaleMax: 6;
    typicalRangeHigh: 5.15;
    typicalRangeLow: 3.49;
  };
  */
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
  (data as unknown as StationDto[]).forEach((item: StationDto) => {
    const station = transformDto(item, stationDtoTransforms);
    stations[station.id] = station;
  });
  return [stations, response];
};

export interface Station {
  // A unique identifier taken from the last part of the `@id` field e.g. 3400TH
  // from http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH.
  id: string,
  // Identifier for the station, as used by River Levels On the Internet.
  RLOIid?: string; // e.g. '7267'
  // The name of the river catchment which this site is related to, if any.
  catchmentName?: string; // e.g. 'Thames from Hurley to Teddington'
  // The date on which the station opened.
  dateOpened?: string; // e.g. '1983-01-01'
  // Offset between the reference point for how the data is originally recorded and how it is normally displayed. Normally this is the difference between Ordnance datum and the stage datum.
  datumOffset?: number;
  // Scale limits and historic range for the downstream stage water level.
  // @TODO
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
  // @TODO
  measures?: unknown;
  // Northing of the station on British National Grid.
  northing?: number; // e.g. 169800
  // A string or other literal which uniquely identifies the item.
  notation?: string; // e.g. '3400TH'
  // Name of river associated with this monitoring station (when available).
  riverName?: string; // e.g. 'River Thames'
  // stageScale	Scale limits and historic range for the main stage water level.
  // @TODO
  stageScale?: unknown;
  /*
  stageScale: {
    '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale';
    datum: 0;
    highestRecent: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/highestRecent';
      dateTime: '2014-02-02T04:45:00';
      value: 5.707;
    };
    maxOnRecord: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/maxOnRecord';
      dateTime: '2000-10-31T17:15:00';
      value: 5.707;
    };
    minOnRecord: {
      '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/minOnRecord';
      dateTime: '1988-06-22T11:30:00';
      value: 0.193;
    };
    scaleMax: 6;
    typicalRangeHigh: 5.15;
    typicalRangeLow: 3.49;
  };
  */
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

  /*
  "measures": [
    {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--Mean-15_min-m3_s",
      "label": "THAMES AT STAINES - flow--Mean-15_min-m3_s",
      "latestReading": "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-flow--Mean-15_min-m3_s/2019-06-21T13-00-00Z",
      "notation": "3400TH-flow--Mean-15_min-m3_s",
      "parameter": "flow",
      "parameterName": "Flow",
      "period": 900,
      "qualifier": "",
      "station": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
      "stationReference": "3400TH",
      "type": [
        "http://environment.data.gov.uk/flood-monitoring/def/core/Flow",
        "http://environment.data.gov.uk/flood-monitoring/def/core/Measure"
      ],
      // The link is old, and the QUDT key is unit:M3-PER-SEC. You can use m³/s or cumecs.
      "unit": "http://qudt.org/1.1/vocab/unit#CubicMeterPerSecond",
      "unitName": "m3/s",
      "valueType": "mean"
    },
    {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s",
      "label": "THAMES AT KINGSTON (TEDDINGTON) - flow--i-15_min-m3_s",
      "latestReading": {
        "@id": "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-flow--i-15_min-m3_s/2023-01-15T21-30-00Z",
        "date": "2023-01-15",
        "dateTime": "2023-01-15T21:30:00Z",
        "measure": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s",
        "value": 286.548
      },
      "notation": "3400TH-flow--i-15_min-m3_s",
      "parameter": "flow",
      "parameterName": "Flow",
      "period": 900,
      "qualifier": "",
      "station": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
      "stationReference": "3400TH",
      "type": [
        "http://environment.data.gov.uk/flood-monitoring/def/core/Flow",
        "http://environment.data.gov.uk/flood-monitoring/def/core/Measure"
      ],
      "unit": "http://qudt.org/1.1/vocab/unit#CubicMeterPerSecond",
      "unitName": "m3/s",
      "valueType": "instantaneous"
    },
    {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-level-stage-i-15_min-mAOD",
      "datumType": "http://environment.data.gov.uk/flood-monitoring/def/core/datumAOD",
      "label": "THAMES AT KINGSTON (TEDDINGTON) - level-stage-i-15_min-mAOD",
      "latestReading": {
        "@id": "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-level-stage-i-15_min-mAOD/2023-01-15T21-30-00Z",
        "date": "2023-01-15",
        "dateTime": "2023-01-15T21:30:00Z",
        "measure": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-level-stage-i-15_min-mAOD",
        "value": 5
      },
      "notation": "3400TH-level-stage-i-15_min-mAOD",
      "parameter": "level",
      "parameterName": "Water Level",
      "period": 900,
      "qualifier": "Stage",
      "station": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
      "stationReference": "3400TH",
      "type": [
        "http://environment.data.gov.uk/flood-monitoring/def/core/Measure",
        "http://environment.data.gov.uk/flood-monitoring/def/core/WaterLevel"
      ],
      "unit": "http://qudt.org/1.1/vocab/unit#Meter",
      "unitName": "mAOD",
      "valueType": "instantaneous"
    }
  ],
  },
*/
}

interface MeasureInterface {
  '@id': string; // "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--Mean-15_min-m3_s",
  notation: string; // "3400TH-flow--Mean-15_min-m3_s",
  latestReading: ReadingInterface;
  label: string; // "THAMES AT KINGSTON (TEDDINGTON) - flow--i-15_min-m3_s",
  parameter: string; // "flow",
  parameterName: string; // "Flow",
  period: number; // 900,
  qualifier: string; // "",
  station: string; // "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
  stationReference: string; // "3400TH",
  type: string[]; // [
  // "http://environment.data.gov.uk/flood-monitoring/def/core/Flow",
  // "http://environment.data.gov.uk/flood-monitoring/def/core/Measure"
  // ],
  unit: string; // "http://qudt.org/1.1/vocab/unit#CubicMeterPerSecond",
  unitName: string; // "m3/s",
  valueType: string; // "instantaneous"
}

interface ReadingInterface {
  '@id': string; // "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-flow--i-15_min-m3_s/2023-01-15T21-30-00Z",
  date: string; // "2023-01-15",
  dateTime: string; // "2023-01-15T21:30:00Z",
  measure: string; // "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s",
  value: number; // 286.548
}

/*
{
  "@id": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
  "RLOIid": "7267",
  "catchmentName": "Thames from Hurley to Teddington",
  "dateOpened": "1983-01-01",
  "eaAreaName": "Thames - West Thames",
  "eaRegionName": "Thames",
  "easting": 517700,
  "label": "Kingston",
  "lat": 51.415005,
  "long": -0.308869,
  "measures": [
    {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--Mean-15_min-m3_s",
      "label": "THAMES AT STAINES - flow--Mean-15_min-m3_s",
      "latestReading": "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-flow--Mean-15_min-m3_s/2019-06-21T13-00-00Z",
      "notation": "3400TH-flow--Mean-15_min-m3_s",
      "parameter": "flow",
      "parameterName": "Flow",
      "period": 900,
      "qualifier": "",
      "station": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
      "stationReference": "3400TH",
      "type": [
        "http://environment.data.gov.uk/flood-monitoring/def/core/Flow",
        "http://environment.data.gov.uk/flood-monitoring/def/core/Measure"
      ],
      "unit": "http://qudt.org/1.1/vocab/unit#CubicMeterPerSecond",
      "unitName": "m3/s",
      "valueType": "mean"
    },
    {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s",
      "label": "THAMES AT KINGSTON (TEDDINGTON) - flow--i-15_min-m3_s",
      "latestReading": {
        "@id": "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-flow--i-15_min-m3_s/2023-01-15T21-30-00Z",
        "date": "2023-01-15",
        "dateTime": "2023-01-15T21:30:00Z",
        "measure": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s",
        "value": 286.548
      },
      "notation": "3400TH-flow--i-15_min-m3_s",
      "parameter": "flow",
      "parameterName": "Flow",
      "period": 900,
      "qualifier": "",
      "station": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
      "stationReference": "3400TH",
      "type": [
        "http://environment.data.gov.uk/flood-monitoring/def/core/Flow",
        "http://environment.data.gov.uk/flood-monitoring/def/core/Measure"
      ],
      "unit": "http://qudt.org/1.1/vocab/unit#CubicMeterPerSecond",
      "unitName": "m3/s",
      "valueType": "instantaneous"
    },
    {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-level-stage-i-15_min-mAOD",
      "datumType": "http://environment.data.gov.uk/flood-monitoring/def/core/datumAOD",
      "label": "THAMES AT KINGSTON (TEDDINGTON) - level-stage-i-15_min-mAOD",
      "latestReading": {
        "@id": "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-level-stage-i-15_min-mAOD/2023-01-15T21-30-00Z",
        "date": "2023-01-15",
        "dateTime": "2023-01-15T21:30:00Z",
        "measure": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-level-stage-i-15_min-mAOD",
        "value": 5
      },
      "notation": "3400TH-level-stage-i-15_min-mAOD",
      "parameter": "level",
      "parameterName": "Water Level",
      "period": 900,
      "qualifier": "Stage",
      "station": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
      "stationReference": "3400TH",
      "type": [
        "http://environment.data.gov.uk/flood-monitoring/def/core/Measure",
        "http://environment.data.gov.uk/flood-monitoring/def/core/WaterLevel"
      ],
      "unit": "http://qudt.org/1.1/vocab/unit#Meter",
      "unitName": "mAOD",
      "valueType": "instantaneous"
    }
  ],
  "northing": 169800,
  "notation": "3400TH",
  "riverName": "River Thames",
  "stageScale": {
    "@id": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale",
    "datum": 0,
    "highestRecent": {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/highestRecent",
      "dateTime": "2014-02-02T04:45:00",
      "value": 5.707
    },
    "maxOnRecord": {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/maxOnRecord",
      "dateTime": "2000-10-31T17:15:00",
      "value": 5.707
    },
    "minOnRecord": {
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale/minOnRecord",
      "dateTime": "1988-06-22T11:30:00",
      "value": 0.193
    },
    "scaleMax": 6,
    "typicalRangeHigh": 5.15,
    "typicalRangeLow": 3.49
  },
  "stationReference": "3400TH",
  "status": "http://environment.data.gov.uk/flood-monitoring/def/core/statusActive",
  "town": "Kingston Upon Thames",
  "type": [
    "http://environment.data.gov.uk/flood-monitoring/def/core/SingleLevel",
    "http://environment.data.gov.uk/flood-monitoring/def/core/Station"
  ],
  "wiskiID": "3400TH"
}
*/
