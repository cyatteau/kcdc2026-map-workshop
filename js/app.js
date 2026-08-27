import {
  state,
  setPlaces,
  setCategory,
  setSelectedId,
  visibleFeatures,
} from "./state.js";

import { fetchPlaces } from "./data.js";

import {
  initMap,
  renderMap,
  fitMapToPlaces,
  highlightMapPlace,
} from "./map.js";

import {
  setAppTitle,
  setStatus,
  renderList,
  highlightSelectedCard,
  bindPlaceListClick,
  bindCategoryChange,
} from "./ui.js";

const cities = {
  "kansas-city": {
    name: "Kansas City",
    center: [39.0997, -94.5786],
    zoom: 12,
    dataUrl: "../data/cities/kansas-city.geojson",
  },

  chicago: {
    name: "Chicago",
    center: [41.8781, -87.6298],
    zoom: 12,
    dataUrl: "../data/cities/chicago.geojson",
  },

  seattle: {
    name: "Seattle",
    center: [47.6062, -122.3321],
    zoom: 12,
    dataUrl: "../data/cities/seattle.geojson",
  },

  "washington-dc": {
    name: "Washington, DC",
    center: [38.9072, -77.0369],
    zoom: 12,
    dataUrl: "../data/cities/washington-dc.geojson",
  },
};

const CITY = "kansas-city";

const appConfig = cities[CITY];

function selectPlace(id, { moveMap = true } = {}) {
  const key = String(id);

  const previousId = state.selectedId;

  const found = highlightMapPlace(key, previousId, {
    moveMap,
  });

  if (!found) {
    return;
  }

  setSelectedId(key);

  highlightSelectedCard(key);
}

function render() {
  const features = visibleFeatures();

  renderMap(features);

  renderList(features);

  if (features.length === 0) {
    setStatus("No places match this filter.");
  } else {
    setStatus(`${features.length} historic places`);
  }
}

async function loadPlaces() {
  setStatus(`Loading ${appConfig.name} places...`);

  try {
    const features = await fetchPlaces(appConfig.dataUrl);

    setPlaces(features);

    render();

    fitMapToPlaces();
  } catch (error) {
    console.error(error);

    setStatus(`We couldn't load the ${appConfig.name} data.`);
  }
}

setAppTitle(appConfig.name);

initMap(appConfig, (id) => {
  selectPlace(id, {
    moveMap: false,
  });
});

bindPlaceListClick((id) => {
  selectPlace(id);
});

bindCategoryChange((category) => {
  setCategory(category);

  setSelectedId(null);

  render();
});

loadPlaces();
