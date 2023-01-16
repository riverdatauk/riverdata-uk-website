import type { StationInterface } from './station';

type ApiResponseItem = Record<string, unknown>;

type ApiResponse2 = {
  data: Record<string, unknown>;
  response: { data: Record<string, unknown>; response: Response };
};

type ApiResponse = {
  data: Record<string, unknown>;
  response: Response;
};

const baseUrl = 'https://environment.data.gov.uk/flood-monitoring';

const fetchApi = async (path: string): Promise<ApiResponse> => {
  const response = await fetch(`${baseUrl}${path}`);
  const data = await response.json();
  return { data, response };
};

export const fetchStation = async (
  id: string
): Promise<[StationInterface, ApiResponse]> => {
  const response = await fetchApi(`/id/stations/${id}`);
  return [response.data.items as unknown as StationInterface, response];
};
