// --------------------------------------------------
// CITY CONFIGURATION
// --------------------------------------------------

const cities = {
  "kansas-city": {
    name: "Kansas City",
    center: [39.0997, -94.5786],
    zoom: 12,
  },

  chicago: {
    name: "Chicago",
    center: [41.8781, -87.6298],
    zoom: 12,
  },

  seattle: {
    name: "Seattle",
    center: [47.6062, -122.3321],
    zoom: 12,
  },

  "washington-dc": {
    name: "Washington, DC",
    center: [38.9072, -77.0369],
    zoom: 12,
  },
};

const CITY = "kansas-city";

const appConfig = cities[CITY];

// --------------------------------------------------
// MAP SETUP
// --------------------------------------------------

let map;

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
}

// --------------------------------------------------
// START APPLICATION
// --------------------------------------------------

initializeMap();
