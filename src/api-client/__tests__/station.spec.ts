import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';
import { fetchStations } from '../station';

describe.skip('API responses for stations', () => {
  it('all have unique id', async () => {
    // const wrapper = mount(StationPage, { props: { msg: 'Hello Vitest' } });
    const [stations, { data }] = await fetchStations({
      requestOptions: { fetch },
    });
    expect(stations.length).to.equal(2);
  });
});
