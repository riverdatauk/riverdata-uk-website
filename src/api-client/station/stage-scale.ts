import { transformDto } from '../utils';
import { measureReadingFromDto, type MeasureReadingDto } from '../reading';

import type { Dto, DtoTransforms } from '../utils';
import type { MeasureReading } from '../reading';

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

export const stageScaleFromDto = (dto: unknown) => {
  return transformDto<StageScale>(dto as Dto, stageScaleDtoTransforms);
};

const stageScaleDtoTransforms: DtoTransforms = {
  // '@id': 'http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale';
  datum: true, // e.g. 0
  highestRecent: [true, (r) => measureReadingFromDto(r as MeasureReadingDto)],
  maxOnRecord: [true, (r) => measureReadingFromDto(r as MeasureReadingDto)],
  minOnRecord: [true, (r) => measureReadingFromDto(r as MeasureReadingDto)],
  scaleMax: true, // e.g. 6
  typicalRangeHigh: true, // e.g. 5.15
  typicalRangeLow: true, // e.g. 3.49
};
