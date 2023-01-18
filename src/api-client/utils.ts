/**
 * Utility functions.
 */

/**
 * Strip the path from a URL or similar path.
 *
 * @param path A URL or similar path with `/` delimiters.
 * @returns Everything after the last `/`.
 */
export const stripPath = (path: string): string =>
  path.substring(path.lastIndexOf('/') + 1);
