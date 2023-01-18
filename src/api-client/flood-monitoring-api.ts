import { jsonRequest } from './request';

import type { JsonResponse, RequestOptions } from './request';

export type FloodMonitoringApiResponse<T> = [item: T, response: JsonResponse];

/**
 * Make a request to the EA Flood Monitoring API.
 *
 * @param path Path to the resource.
 * @param options Request options.
 * @returns The item or collection requested plus response info.
 */
export const apiRequest = async (
  path: string,
  options: RequestOptions = {}
): Promise<[unknown, JsonResponse]> => {
  const response = await jsonRequest(path, {
    baseUrl: 'https://environment.data.gov.uk/flood-monitoring',
    ...options,
  });

  return [response.data.items, response];
};
