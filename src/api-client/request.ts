export type JsonResponse = {
  data: Record<string, unknown>;
  response: Response;
};

export interface RequestOptions {
  baseUrl?: string;
  params?: Record<string, unknown>;
  headers?: HeadersInit;
  timeout?: number;
  fetch?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response>;
}

const defaults: RequestOptions = {
  baseUrl: '',
  timeout: 5000,
};

// This needs testing for edge cases.
export const buildQueryString = (params: Record<string, unknown>): string => {
  const parts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    const safeKey = encodeURIComponent(key);
    // Ignore undefined or null.
    if (value == null) return;
    switch (typeof value) {
      case 'string':
      case 'number':
        parts.push(`${safeKey}=${encodeURIComponent(value)}`);
        return;
      // Avoid any issues with bigint conversions.
      case 'bigint':
        parts.push(`${safeKey}=${encodeURIComponent(value.toString())}`);
        return;
      case 'boolean':
        if (value === true) {
          parts.push(safeKey);
        }
        return;
      default:
        throw new TypeError('Invalid query parameter');
    }
  });
  if (parts.length) {
    return `?${parts.join('&')}`;
  }
  return '';
};

export const jsonRequest = async (
  path: string,
  options: RequestOptions = {}
): Promise<JsonResponse> => {
  const headers = options.headers || {};

  // Add the right 'Accept' header but allow it to be overridden.
  options.headers = { accept: 'application/json', ...headers };

  const response = await request(path, options);
  try {
    const data = await response.json();
    return { data, response };
  } catch (err) {
    throw new RequestError(err as Error, response);
  }
};

export const request = async (path: string, options: RequestOptions = {}) => {
  const { baseUrl, headers, params } = { ...defaults, ...options };
  let response: Response | undefined;

  try {
    // Allow a mock fetch for testing.
    const useFetch = options.fetch ?? fetch;

    // Create any query string.
    const url = params
      ? `${baseUrl}${path}${buildQueryString(params)}`
      : `${baseUrl}${path}`;
    response = await useFetch(url, { headers });
  } catch (err) {
    throw new RequestError(<Error>err, response);
  }

  if (!response?.ok) {
    throw new RequestError(new Error('Response not OK'), response);
  }

  return response;
};

/**
 * Useful errors for the fetch API.
 *
 * err.name is set to the following:
 * - RequestNetworkError: probably a CORS failure.
 * - RequestError: something else.
 */
export class RequestError extends Error {
  error: Error;
  response: Response | undefined;

  constructor(err: Error, response?: Response) {
    if (err.name === 'TypeError') {
      super('Error fetching resource');
      this.name = 'RequestNetworkError';
    } else {
      super(err.message);
      this.name = 'RequestError';
    }
    this.error = err;
    this.response = response;
  }
}
