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
const CITY = "seattle";
const appConfig = cities[CITY];
const state = { places: [], category: "all", selectedId: null };

const map = L.map("map").setView(appConfig.center, appConfig.zoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const placesLayer = L.geoJSON(null, {
  pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, { radius: 7, weight: 2, fillOpacity: 0.8 });
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

async function loadPlaces() {
  const response = await fetch(appConfig.dataUrl);
  const geojson = await response.json();
  state.places = geojson.features;
  placesLayer.addData(geojson);
  if (placesLayer.getBounds().isValid()) {
    map.fitBounds(placesLayer.getBounds(), { padding: [30, 30] });
  }
  console.log(state.places);
}
loadPlaces();
