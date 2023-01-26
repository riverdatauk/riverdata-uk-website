/** A single reading for a known measure. */

export type MeasureReading = [timestamp: number, value: number];

export interface MeasureReadingDto {
  dateTime: string;
  value: number;
}

export const measureReadingFromDto = ({
  dateTime,
  value,
}: MeasureReadingDto): MeasureReading => {
  return [new Date(dateTime).valueOf(), value];
};
