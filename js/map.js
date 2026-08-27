let map;
let placesLayer;

const layerById = new Map();

let handleFeatureSelect = () => {};

function markerStyle() {
  return {
    radius: 7,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  };
}

export function initMap(appConfig, onFeatureSelect) {
  handleFeatureSelect = onFeatureSelect;

  map = L.map("map").setView(appConfig.center, appConfig.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  placesLayer = L.geoJSON(null, {
    pointToLayer(feature, latlng) {
      return L.circleMarker(latlng, markerStyle());
    },

    onEachFeature(feature, layer) {
      const id = String(feature.properties.id);

      layerById.set(id, layer);

      layer.on("click", () => {
        handleFeatureSelect(id);
      });

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

export function renderMap(features) {
  layerById.clear();

  placesLayer.clearLayers();

  placesLayer.addData({
    type: "FeatureCollection",
    features,
  });
}

export function fitMapToPlaces() {
  if (placesLayer.getBounds().isValid()) {
    map.fitBounds(placesLayer.getBounds(), {
      padding: [30, 30],
    });
  }
}

export function highlightMapPlace(id, previousId, { moveMap = true } = {}) {
  const key = String(id);

  const selectedLayer = layerById.get(key);

  if (!selectedLayer) {
    return false;
  }

  if (previousId) {
    const previousLayer = layerById.get(String(previousId));

    if (previousLayer) {
      previousLayer.setStyle(markerStyle());
    }
  }

  selectedLayer.setStyle({
    radius: 10,
    weight: 4,
    fillOpacity: 1,
  });

  selectedLayer.bringToFront();

  selectedLayer.openPopup();

  if (moveMap) {
    map.flyTo(selectedLayer.getLatLng(), 15);
  }

  return true;
}
