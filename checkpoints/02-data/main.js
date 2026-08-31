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

  fitMapToPlaces();
}

// --------------------------------------------------
// START APPLICATION
// --------------------------------------------------

initializeMap();

loadPlaces();
