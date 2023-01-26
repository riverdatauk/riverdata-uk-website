/**
 * Utility functions.
 */

export type Dto = Record<string, unknown>;

export type DtoTransform =
  | true // Copy from identical key.
  | string // Copy from specified key.
  | ((value: Dto) => Dto)
  // Pass specified key to a function returning the value.
  | [key: true | string, fn: (value: unknown) => unknown | null];

export type DtoTransforms = Record<string, DtoTransform>;

/**
 * Strip the path from a URL or similar path.
 *
 * @param path A URL or similar path with `/` delimiters.
 * @returns Everything after the last `/`.
 */
export const stripPath = (path: string, count = 0): string => {
  let end = path.lastIndexOf('/');
  for (; count > 0; --count) {
    end = path.lastIndexOf('/', end);
  }
  return path.substring(end + 1);
};

/**
 * Transform a generic DTO.
 *
 * @param dto A generic Data Transform Object.
 * @param transforms Transforms to apply.
 */
export const transformDto = <T>(dto: Dto, transforms: DtoTransforms): T => {
  const transformed: Record<string, unknown> = {};

  Object.entries(transforms).forEach(([destinationKey, transform]) => {
    if (transform === true) {
      // Use the value with the same key in the DTO, if it exists.
      const value = dto[destinationKey];
      if (value == null) return;
      transformed[destinationKey] = value;
      return;
    }

    if (typeof transform === 'string') {
      // Use the value with the identified key in the DTO, if it exists.
      const value = dto[transform];
      if (value == null) return;
      transformed[destinationKey] = value;
      return;
    }

    if (Array.isArray(transform)) {
      // Transform must be a function.
      const [key, fn] = transform;
      const sourceKey = key === true ? destinationKey : key;
      const sourceValue = dto[sourceKey];
      if (sourceValue == null) return;
      const value = fn(dto[sourceKey]);
      if (value == null) return;
      transformed[destinationKey] = value;
      return;
    }

    // Transform must be a function.
    const entries = transform(dto);
    Object.assign(transformed, entries);
  });

  return transformed as T;
};

export const toDateTimeString = (value: Date | number) => {
  return new Intl.DateTimeFormat('default', {
    // weekday, year, month, day, hour, minute, second, fractionalSecondDigits
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    // dateStyle: 'full',
    // timeStyle: 'short',
    // timeZone: 'Australia/Sydney',
  }).format(new Date(value));
};
