import { transformDto } from '../utils';
import { measureReadingFromDto } from '../reading';

import type { Dto, DtoTransforms } from '../utils';
import type { MeasureReading, MeasureReadingDto } from '../reading';

export interface StageScale {
  // Ignore the id - just query the station.
  // '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale';
  datum?: number; // e.g.0;
  highestRecent?: MeasureReading;
  maxOnRecord?: MeasureReading;
  minOnRecord?: MeasureReading;
  scaleMax?: number; // e.g. 6;
  typicalRangeHigh?: number; // e.g. 5.15;
  typicalRangeLow?: number; // e.g. 3.49;
}

export interface StageScaleDto {
  '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale';
  datum?: number; // e.g.0;
  highestRecent?: MeasureReadingDto;
  maxOnRecord?: MeasureReadingDto;
  minOnRecord?: MeasureReadingDto;
  scaleMax?: number; // e.g. 6;
  typicalRangeHigh?: number; // e.g. 5.15;
  typicalRangeLow?: number; // e.g. 3.49;
}

export const stageScaleFromDto = (dto: StageScaleDto): StageScale | undefined => {
  if (dto == null) return undefined;
  return {
    datum: dto.datum, // e.g. 0
    highestRecent: dto.highestRecent
      ? measureReadingFromDto(dto.highestRecent)
      : undefined,
    maxOnRecord: dto.maxOnRecord
      ? measureReadingFromDto(dto.maxOnRecord)
      : undefined,
    minOnRecord: dto.minOnRecord
      ? measureReadingFromDto(dto.minOnRecord)
      : undefined,
    scaleMax: dto.scaleMax, // e.g. 6
    typicalRangeHigh: dto.typicalRangeHigh, // e.g. 5.15
    typicalRangeLow: dto.typicalRangeLow, // e.g. 3.49};
  };
};
