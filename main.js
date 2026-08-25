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

const state = {
  places: [],
  category: "all",
  selectedId: null,
};

const appTitle = document.querySelector("#app-title");
const placeList = document.querySelector("#place-list");
const statusElement = document.querySelector("#status");
const categoryFilter = document.querySelector("#category-filter");

appTitle.textContent = `${appConfig.name} Explorer`;

const map = L.map("map").setView(appConfig.center, appConfig.zoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

function markerStyle() {
  return {
    radius: 7,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  };
}
const layerById = new Map();

const placesLayer = L.geoJSON(null, {
  pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, markerStyle());
  },

  onEachFeature(feature, layer) {
    const id = String(feature.properties.id);

    layer.on("click", () => {
      selectPlace(id, { moveMap: false });
    });

    layerById.set(id, layer);

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

function selectPlace(id, { moveMap = true } = {}) {
  const key = String(id);
  const selectedLayer = layerById.get(key);
  if (!selectedLayer) {
    return;
  }
  if (state.selectedId) {
    const previousLayer = layerById.get(String(state.selectedId));
    if (previousLayer) {
      previousLayer.setStyle(markerStyle());
    }
  }
  state.selectedId = key;
  selectedLayer.setStyle({ radius: 10, weight: 4, fillOpacity: 1 });
  selectedLayer.bringToFront();
  selectedLayer.openPopup();
  document.querySelectorAll("[data-place-id]").forEach((card) => {
    const selected = card.dataset.placeId === key;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-current", String(selected));
  });
  const card = document.querySelector(`[data-place-id="${CSS.escape(key)}"]`);
  if (card) {
    card.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  if (moveMap) {
    map.flyTo(selectedLayer.getLatLng(), 15);
  }
}

function setStatus(message) {
  statusElement.textContent = message;
}

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

function visibleFeatures() {
  if (state.category === "all") {
    return state.places;
  }
  return state.places.filter(
    (feature) => feature.properties.category === state.category,
  );
}

placeList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-place-id]");
  if (!card) {
    return;
  }
  selectPlace(card.dataset.placeId);
});

function render() {
  const features = visibleFeatures();
  layerById.clear();
  placesLayer.clearLayers();
  placesLayer.addData({ type: "FeatureCollection", features });
  renderList(features);
  setStatus(`${features.length} historic places`);
}

async function loadPlaces() {
  setStatus(`Loading ${appConfig.name} places...`);

  try {
    const response = await fetch(appConfig.dataUrl);

    if (!response.ok) {
      throw new Error(`Could not load data: HTTP ${response.status}`);
    }

    const geojson = await response.json();

    state.places = geojson.features;

    render();

    if (placesLayer.getBounds().isValid()) {
      map.fitBounds(placesLayer.getBounds(), {
        padding: [30, 30],
      });
    }

    setStatus(`${state.places.length} historic places`);
  } catch (error) {
    console.error(error);

    setStatus(`We couldn't load the ${appConfig.name} data.`);
  }
}

categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  state.selectedId = null;
  render();
});

loadPlaces();
