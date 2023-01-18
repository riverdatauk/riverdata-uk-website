import { apiRequest } from './flood-monitoring-api';

import type { FloodMonitoringApiResponse } from './flood-monitoring-api';
import { stripPath } from './utils';

export type StationResponse = FloodMonitoringApiResponse<Station>;

/**
 * Fetch a station from the EA Flood Monitoring API.
 *
 * @param id The id of the station aka Station Reference.
 * @returns The station plus some information.
 */
export const fetchStation = async (id: string): Promise<StationResponse> => {
  const [maybeStation, response] = await apiRequest(`/id/stations/${id}`);
  const stationDto = maybeStation as unknown as StationDto;
  const responseId = stripPath(stationDto['@id']);
  const station: Station = {
    ...stationDto,
    id: responseId,
  };
  return [station, response];
};

interface StationDto {
  '@id': string; // http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH
}

export interface Station {
  id: string;
  label?: string; // "Kingston",
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
