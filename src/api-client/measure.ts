/**
 * Measures API.
 */
import { stripPath } from './utils';

const measureIdRegex =
  /*
   ([^-]*) Station id. */
  //       (([^-]*)-([^-]*)) e.g. level-stage.
  //        ([^-]*)  e.g. level.
  //                ([^-]*) e.g. stage.
  //                         ([^-]*-[^-]*) e.g. i-15_min.
  //                                       ([^-]*) unit.
  /([^-]*)-(([^-]*)-([^-]*))-([^-]*-[^-]*)-([^-]*)/;

/**
 * Parse a measure id into usable parts.
 *
 * @param id The id for a measure, with or without URL path.
 * @returns The parts of the id.
 */
export const parseMeasureId = (longId: string) => {
  const id = stripPath(longId);
  const [
    ,
    station,
    qualifiedParameter,
    parameter,
    qualifier,
    interval,
    unitName,
  ] = id.match(measureIdRegex) || [];
  return {
    id,
    station,
    qualifiedParameter,
    parameter,
    qualifier,
    interval,
    unitName,
  };
};
