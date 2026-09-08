let map;
let placesLayer;
let hostedFeatureLayer;

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

export function initMap(appConfig, onFeatureSelect) {
  handleFeatureSelect = onFeatureSelect;

  map = L.map("map").setView(appConfig.center, appConfig.zoom);

  addBasemap();

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

export function addHostedFeatureLayer() {
  hostedFeatureLayer = L.esri
    .featureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",

      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 7,
          weight: 2,
          fillOpacity: 0.8,
        });
      },

      onEachFeature(feature, layer) {
        const { TRL_NAME, PARK_NAME } = feature.properties;

        const popup = document.createElement("div");

        const title = document.createElement("strong");

        title.textContent = TRL_NAME || "Trailhead";

        popup.append(title);

        if (PARK_NAME) {
          const park = document.createElement("p");

          park.textContent = PARK_NAME;

          popup.append(park);
        }

        layer.bindPopup(popup);
      },
    })
    .addTo(map);

  hostedFeatureLayer.once("load", () => {
    const bounds = hostedFeatureLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [30, 30],
      });
    }
  });
}
