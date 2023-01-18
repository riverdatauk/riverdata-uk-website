/**
 * Utility functions.
 */

export type Dto = Record<string, unknown>;
export type DtoTransform = true | string | (() => string | null);

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
export const transformDto = (
  dto: Dto,
  transforms: Record<string, DtoTransform>
) => {
  const transformed: Record<string, unknown> = {};

  Object.entries(transforms).forEach(([key, transform]) => {
    if (transform === true) {
      // Use the value with the same key in the DTO, if it exists.
      const value = dto[key];
      if (value == null) return;
      transformed[key] = value;
      return;
    }

    if (typeof transform === 'string') {
      // Use the value with the identified key in the DTO, if it exists.
      const value = dto[transform];
      if (value == null) return;
      transformed[key] = value;
      return;
    }

    // Transform must be a function.
    const value = transform(dto);
    if (value == null) return;
    transformed[key] = value;
    return;
  });

  return transformed;
};
