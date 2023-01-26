import { stripPath } from '../utils';
import { measureReadingFromDto } from '../reading';

import type { MeasureReading, MeasureReadingDto } from '../reading';

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

export interface Measure {
  id: string; // 3400TH-flow--i-15_min-m3_s
  label?: string; // "THAMES AT KINGSTON (TEDDINGTON) - flow--i-15_min-m3_s",
  latestReading?: MeasureReading;
  latestReadingDate?: string;
  notation?: string; // "3400TH-flow--Mean-15_min-m3_s",
  parameter?: string; // "level",
  parameterName?: string; // "Water Level",
  period?: number; // 900,
  qualifier?: string; // "Stage",
  qualifiedParameter?: string; // "level-stage".
  stationId?: string; // "3400TH",
  stationReference?: string; // "3400TH",
  type?: string; // "Flow,Measure", "Measure,WaterLevel",
  unit?: string; // "http://qudt.org/1.1/vocab/unit#Meter",
  unitId?: string; // "m3_s"
  unitName?: string; // "m3/s",
  valueType?: string; // "instantaneous"
}

export const measureFromDto = (dto: MeasureDto): Measure => {
  const { id, stationId, qualifiedParameter, unitId } = parseMeasureId(
    dto['@id']
  );
  let latestReading;
  let latestReadingDate;
  if (typeof dto.latestReading === 'string') {
    latestReadingDate = stripPath(dto.latestReading);
  } else if (dto.latestReading != null) {
    latestReading = measureReadingFromDto(dto.latestReading);
  }

  let type;
  if (Array.isArray(dto.type)) {
    type = dto.type
      .map((type) => stripPath(type))
      .sort()
      .join();
  } else if (typeof dto.type === 'string') {
    type = dto.type;
  }

  return {
    // id: ['@id', (id: unknown) => stripPath(id as string)],
    id,
    label: dto.label, // "THAMES AT KINGSTON (TEDDINGTON) - flow--i-15_min-m3_s",
    latestReading,
    latestReadingDate,
    notation: dto.notation, // "3400TH-flow--Mean-15_min-m3_s",
    parameter: dto.parameter, // "flow",
    parameterName: dto.parameterName, // "Flow",
    period: dto.period, // 900,
    qualifier: dto.qualifier, // "",
    qualifiedParameter,
    // Omit the long form of the station id.
    // "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH",
    // station: dto.station,
    stationId, // "3400TH",
    stationReference: dto.stationReference, // "3400TH",
    type,
    unit: dto.unit, // "http://qudt.org/1.1/vocab/unit#CubicMeterPerSecond",
    unitId, // "m3_s"
    unitName: dto.unitName, // "m3/s",
    valueType: dto.valueType, // "instantaneous"
  };
};

export interface MeasureDto {
  // "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s",
  '@id': string;
  label?: string; // "THAMES AT KINGSTON (TEDDINGTON) - flow--i-15_min-m3_s",
  latestReading?: MeasureReadingDto;
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
  unitName?: string; // "mAOD",
  valueType?: string; // "instantaneous"
}
