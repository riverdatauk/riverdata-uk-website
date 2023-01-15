const baseUrl = 'https://environment.data.gov.uk/flood-monitoring';

const fetchApi = async (path: string) => {
  const response = await fetch(`${baseUrl}${path}`);
  return response.json();
};

export const fetchStation = (id: string) => {
  return fetchApi(`/id/stations/${id}`);
}
