import { stripPath, transformMeasureReadingDto } from './utils';

import type { Dto, DtoTransforms, MeasureReading } from './utils';

const measureIdRegex =
  /*
   ([^-]*) Station id. */
  //       ([^-]*)  e.g. level.
  //               ([^-]*) e.g. stage.
  //                       ([^-]*-[^-]*) e.g. i-15_min.
  //                                     ([^-]*) unit.
  /([^-]*)-([^-]*)-([^-]*)-([^-]*-[^-]*)-([^-]*)/;

/**
 * Parse a measure id into usable parts.
 *
 * @param id The id for a measure, with or without URL path.
 * @returns The parts of the id.
 */
export const parseMeasureId = (longId: string) => {
  const id = stripPath(longId);
  // Get the parts (could use split I suppose).
  const [, stationId, parameter, qualifier, interval, unitId] =
    id.match(measureIdRegex) || [];

  // This is very useful e.g. level-stage, level-downstage, flow.
  const qualifiedParameter = qualifier
    ? `${parameter}-${qualifier}`
    : parameter;

  return {
    id,
    stationId,
    qualifiedParameter,
    parameter,
    qualifier,
    interval,
    unitId,
  };
};

export const measureDtoTransforms: DtoTransforms = {
  transformId: (dto: Dto): Dto => {
    const parsedId = parseMeasureId(dto['@id'] as string);
    const { id, stationId, qualifiedParameter, unitId } = parsedId;
    return { id, stationId, qualifiedParameter, unitId };
  },
  // id: ['@id', (id: unknown) => stripPath(id as string)],
  label: true, // "THAMES AT KINGSTON (TEDDINGTON) - flow--i-15_min-m3_s",
  latestReading: true, // MeasureReading;
  notation: true, // "3400TH-flow--Mean-15_min-m3_s",
  parameter: true, // "flow",
  parameterName: true, // "Flow",
  period: true, // 900,
  qualifier: true, // "",
  station: true, // "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
  stationReference: true, // "3400TH",
  type: true, // [
  // "http://environment.data.gov.uk/flood-monitoring/def/core/Flow",
  // "http://environment.data.gov.uk/flood-monitoring/def/core/Measure"
  // ],
  unit: true, // "http://qudt.org/1.1/vocab/unit#CubicMeterPerSecond",
  unitName: true, // "m3/s",
  valueType: true, // "instantaneous"
};

export interface Measure {
  // "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s",
  label?: string; // "THAMES AT KINGSTON (TEDDINGTON) - flow--i-15_min-m3_s",
  latestReading?: MeasureReading;
  latestReadingDate?: string;
  notation?: string; // "3400TH-flow--Mean-15_min-m3_s",
  parameter?: string; // "flow",
  parameterName?: string; // "Flow",
  period?: number; // 900,
  qualifier?: string; // "",
  station?: string; // "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
  stationReference?: string; // "3400TH",
  type?: string[]; // [
  // "http://environment.data.gov.uk/flood-monitoring/def/core/Flow",
  // "http://environment.data.gov.uk/flood-monitoring/def/core/Measure"
  // ],
  unit?: string; // "http://qudt.org/1.1/vocab/unit#CubicMeterPerSecond",
  unitName?: string; // "m3/s",
  valueType?: string; // "instantaneous"
}

/*
  "measures": [
    {
      "latestReading": "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-flow--Mean-15_min-m3_s/2019-06-21T13-00-00Z",
    },
    {
      "latestReading": {
        "@id": "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-flow--i-15_min-m3_s/2023-01-15T21-30-00Z",
        "date": "2023-01-15",
        "dateTime": "2023-01-15T21:30:00Z",
        "measure": "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s",
        "value": 286.548
      },
    },
    {
      "datumType": "http://environment.data.gov.uk/flood-monitoring/def/core/datumAOD",
      "parameter": "level",
      "parameterName": "Water Level",
      "qualifier": "Stage",
      "type": [
        "http://environment.data.gov.uk/flood-monitoring/def/core/Measure",
        "http://environment.data.gov.uk/flood-monitoring/def/core/WaterLevel"
      ],
      "unit": "http://qudt.org/1.1/vocab/unit#Meter",
      "unitName": "mAOD",
    }
  ],
  },
*/
