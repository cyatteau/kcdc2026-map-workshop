const appConfig = {
  city: "Kansas City",
  center: [39.0997, -94.5786], //lat, lng
  zoom: 12,
};

const map = L.map("map").setView(appConfig.center, appConfig.zoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);
