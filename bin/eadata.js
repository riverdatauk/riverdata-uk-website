const { writeFile } = require('fs/promises');
const slugify = require('@sindresorhus/slugify');
const stationsJson = require('../eadata/stations.json');
const measuresJson = require('../eadata/measures.json');

const slugifyApiId = (raw, override = true) => {
  const pathStripped = raw.slice(raw.lastIndexOf('/') + 1);
  if (override) return pathStripped;
  const clean = pathStripped
    .replace(/^[^A-Za-z0-9]/, 'u-')
    .replace(/[^A-Za-z0-9]$/, '-u')
    .replace(/Edgeh1/, 'edgeh1a');
  return slugify(clean, { decamelize: false });
};

const slugifyName = (raw) => {
  return slugify(raw, { decamelize: false });
};

const parseMeasures = (json) => {
  const measures = {};
  json.forEach((fmData) => {
    const fmId = fmData['@id'];
    const id = fmId; // slugifyApiId(fmId);

    if (measures[id] != null) {
      throw new Error(
        `Duplicate measure id ${id} from ${fmId} (${measures[id].fmData['@id']})`
      );
    }
    measures[id] = fmData;
  });
  return measures;
};

const parseStations = (json) => {
  const catchmentStations = {};
  const riverStations = {};
  const stations = {};

  stationsJson.items.forEach((fmData) => {
    const fmId = fmData['@id'];
    const id = slugifyApiId(fmId.slice(fmId.lastIndexOf('/')));
    const station = { id, fmData };

    if (stations[id] != null) {
      throw new Error(
        `Duplicate station id ${id} from ${fmId} (${stations[id].fmData['@id']})`
      );
    }

    const catchment = fmData.catchmentName ?? null;
    if (catchment !== null) {
      station.catchmentId = slugifyName(catchment);
      if (catchmentStations[catchment] == null) {
        catchmentStations[catchment] = { stations: [], rivers: {}, towns: {} };
      }
      catchmentStations[catchment].stations.push(id);
    }

    if (fmData.riverName != null) {
      station.riverId = slugifyName(fmData.riverName);
      if (riverStations[fmData.riverName] == null) {
        riverStations[fmData.riverName] = {
          stations: [],
          catchments: {},
          towns: {},
        };
      }
      riverStations[fmData.riverName].stations.push(id);
      if (catchment !== null) {
        catchmentStations[catchment].rivers[fmData.riverName] = true;
        riverStations[fmData.riverName].catchments[catchment] = true;
      }
    }

    let measures = [];
    if (fmData.measures != null) {
      measures = fmData.measures.map((measure) => {
        return slugifyApiId(measure['@id']);
      });
    }

    stations[id] = station;
  });
  return { stations, catchmentStations, riverStations };
};

const parse = () => {
  const measures = parseMeasures(measuresJson.items);
  writeFile('./site/data/measures.json', JSON.stringify(measures, null, 2));

  // const townStations = {};
  const { stations, catchmentStations, riverStations } = parseStations(
    stationsJson.items
  );
  writeFile('./site/data/stations.json', JSON.stringify(stations, null, 2));

  const catchments = Object.entries(catchmentStations).reduce(
    (prev, [name, catchment]) => {
      const id = slugifyName(name);

      if (prev[id] != null) {
        throw new Error(
          `Duplicate station id ${id} from ${name} (${prev[id].name})`
        );
      }
      prev[id] = {
        id,
        name,
        stations: catchment.stations,
        rivers: Object.keys(catchment.rivers).map((name) => slugifyName(name)),
      };
      return prev;
    },
    {}
  );

  writeFile('./site/data/catchments.json', JSON.stringify(catchments, null, 2));

  const rivers = Object.entries(riverStations).reduce((prev, [name, item]) => {
    const id = slugifyName(name);

    if (prev[id] != null) {
      throw new Error(
        `Duplicate station id ${id} from ${name} (${prev[id].name})`
      );
    }
    prev[id] = {
      id,
      name,
      stations: item.stations,
      catchments: Object.keys(item.catchments).map((name) => slugifyName(name)),
    };
    return prev;
  }, {});
  writeFile('./site/data/rivers.json', JSON.stringify(rivers, null, 2));
};

parse();
