// --------------------------------------------------
// CITY CONFIGURATION
// --------------------------------------------------

const cities = {
  "kansas-city": {
    name: "Kansas City",
    center: [39.0997, -94.5786],
    zoom: 12,
    dataUrl: "./data/cities/kansas-city.geojson",
  },

  chicago: {
    name: "Chicago",
    center: [41.8781, -87.6298],
    zoom: 12,
    dataUrl: "./data/cities/chicago.geojson",
  },

  seattle: {
    name: "Seattle",
    center: [47.6062, -122.3321],
    zoom: 12,
    dataUrl: "./data/cities/seattle.geojson",
  },

  "washington-dc": {
    name: "Washington, DC",
    center: [38.9072, -77.0369],
    zoom: 12,
    dataUrl: "./data/cities/washington-dc.geojson",
  },
};

const CITY = "kansas-city";

const appConfig = cities[CITY];

// --------------------------------------------------
// APPLICATION STATE
// --------------------------------------------------

const state = {
  places: [],
};

// --------------------------------------------------
// DOM ELEMENTS
// --------------------------------------------------

const appTitle = document.querySelector("#app-title");

const placeList = document.querySelector("#place-list");

const statusElement = document.querySelector("#status");

appTitle.textContent = `${appConfig.name} Explorer`;

// --------------------------------------------------
// MAP SETUP
// --------------------------------------------------

let map;
let placesLayer;

function markerStyle() {
  return {
    radius: 7,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  };
}

function addBasemap() {
  const apiKey = window.APP_CONFIG?.arcgisApiKey;

  if (apiKey) {
    L.esri.Vector.vectorBasemapLayer("arcgis/light-gray", {
      apikey: apiKey,
    }).addTo(map);

    return;
  }

  console.warn("No ArcGIS API key found. Falling back to OpenStreetMap.");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
}

function initializeMap() {
  map = L.map("map").setView(appConfig.center, appConfig.zoom);

  addBasemap();

  placesLayer = L.geoJSON(null, {
    pointToLayer(feature, latlng) {
      return L.circleMarker(latlng, markerStyle());
    },

    onEachFeature(feature, layer) {
      const { name, category, description } = feature.properties;

      const popup = document.createElement("div");

      const title = document.createElement("strong");

      title.textContent = name;

      const meta = document.createElement("div");

      meta.textContent = category;

      popup.append(title, meta);

      if (description) {
        const detail = document.createElement("p");

        detail.textContent = description;

        popup.append(detail);
      }

      layer.bindPopup(popup);
    },
  }).addTo(map);
}

// --------------------------------------------------
// STATUS UI
// --------------------------------------------------

function setStatus(message) {
  statusElement.textContent = message;
}

// --------------------------------------------------
// SIDEBAR RENDERING
// --------------------------------------------------

function renderList(features) {
  placeList.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (const feature of features) {
    const { id, name, category, description } = feature.properties;

    const item = document.createElement("li");

    const button = document.createElement("button");

    button.type = "button";
    button.className = "place-card";

    button.dataset.placeId = String(id);

    const title = document.createElement("strong");

    title.className = "place-card__title";

    title.textContent = name;

    const categoryElement = document.createElement("span");

    categoryElement.className = "place-card__category";

    categoryElement.textContent = category;

    button.append(title, categoryElement);

    if (description) {
      const detail = document.createElement("span");

      detail.className = "place-card__description";

      detail.textContent = description;

      button.append(detail);
    }

    item.append(button);

    fragment.append(item);
  }

  placeList.append(fragment);
}

// --------------------------------------------------
// MAP RENDERING
// --------------------------------------------------

function renderMap(features) {
  placesLayer.clearLayers();

  placesLayer.addData({
    type: "FeatureCollection",
    features,
  });
}

function fitMapToPlaces() {
  if (placesLayer.getBounds().isValid()) {
    map.fitBounds(placesLayer.getBounds(), {
      padding: [30, 30],
    });
  }
}

// --------------------------------------------------
// DATA LOADING
// --------------------------------------------------

async function fetchPlaces(dataUrl) {
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error(`Could not load data: HTTP ${response.status}`);
  }

  const geojson = await response.json();

  return geojson.features;
}

async function loadPlaces() {
  const features = await fetchPlaces(appConfig.dataUrl);

  state.places = features;

  renderMap(state.places);

  renderList(state.places);

  fitMapToPlaces();

  setStatus(`${state.places.length} historic places`);
}

// --------------------------------------------------
// START APPLICATION
// --------------------------------------------------

initializeMap();

loadPlaces();
