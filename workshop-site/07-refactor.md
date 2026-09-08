# 07 - Refactor Into Modules

## Goal

Keep the same application behavior, but organize the JavaScript into focused modules.

By the end, your JavaScript will move from:

```text
main.js
```

to:

```text
js/
├── app.js
├── data.js
├── map.js
├── state.js
└── ui.js
```

The app should look and behave the same when you're done.

---

# Starting Point

Start from:

```text
checkpoints/06-polish
```

Before changing anything, verify:

- the map loads
- markers appear
- popups work
- sidebar cards work
- selection works
- filtering works
- loading, empty, and error messages work
- the responsive layout works

This is a refactor. Start from working code.

---

# 👀 Watch First

We'll look at how `main.js` has grown:

```text
configuration
state
data loading
map rendering
sidebar rendering
selection
filtering
events
startup
```

Then we'll split responsibilities:

```text
                    app.js
          ┌──────────┼──────────┬──────────┐
          ↓          ↓          ↓          ↓
      state.js    data.js     map.js      ui.js
```

`app.js` coordinates. The other files own focused jobs. <button class="discovery-token" type="button" data-discovery-id="module-master" aria-label="Hidden discovery" title="Hmm...">🧩</button>

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Who Owns What?",
  "prompt": "Which module should own the GeoJSON fetch() call?",
  "options": [
    {
      "value": "A",
      "label": "ui.js"
    },
    {
      "value": "B",
      "label": "map.js"
    },
    {
      "value": "C",
      "label": "data.js"
    },
    {
      "value": "D",
      "label": "state.js"
    }
  ],
  "correct": "C",
  "success": "Correct! The purpose of the refactor is to give related responsibilities clear homes, and data.js owns GeoJSON loading.",
  "hint": "Which filename most directly describes loading data?"
}
```

<!-- OPTIONAL VIDEO SLOT
Suggested clip: "Why Split JavaScript Into Modules?"
Suggested length: 60-90 seconds
Place it here if you record one.
-->

---

# 🛠️ Your Turn 1 - Create the Module Files

Create:

```text
js/
├── app.js
├── data.js
├── map.js
├── state.js
└── ui.js
```

Leave them empty for now.

---

# 🛠️ Your Turn 2 - Update the App Script

In `index.html`, replace:

```html
<script src="./main.js"></script>
```

with:

```html
<script type="module" src="./js/app.js"></script>
```

Keep Leaflet, Esri Leaflet, Esri Leaflet Vector, and `config.js` before it.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🔮 Predict It",
  "title": "Why type=\"module\"?",
  "prompt": "What would happen if app.js contained import statements but the script tag did not use type=\"module\"?",
  "context": "<script src=\"./js/app.js\"></script>",
  "options": [
    {
      "value": "A",
      "label": "The browser would automatically detect the imports."
    },
    {
      "value": "B",
      "label": "The browser would not treat the file as an ES module, so the import syntax would fail."
    },
    {
      "value": "C",
      "label": "Only the CSS would stop loading."
    },
    {
      "value": "D",
      "label": "Nothing would change."
    }
  ],
  "correct": "B",
  "success": "Correct! type=\"module\" tells the browser to use ES module behavior so import statements work.",
  "hint": "The browser needs to know that app.js is a module."
}
```

---

# 🛠️ Your Turn 3 - Build `state.js`

In `js/state.js`, add:

```js
export const state = {
  places: [],
  category: "all",
  selectedId: null,
};

export function setPlaces(features) {
  state.places = features;
}

export function setCategory(category) {
  state.category = category;
}

export function setSelectedId(id) {
  state.selectedId = id;
}

export function visibleFeatures() {
  if (state.category === "all") {
    return state.places;
  }

  return state.places.filter(
    (feature) => feature.properties.category === state.category,
  );
}
```

This module owns application state and derived visible features.

---

# 🛠️ Your Turn 4 - Build `data.js`

In `js/data.js`, add:

```js
export async function fetchPlaces(dataUrl) {
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error(`Could not load data: HTTP ${response.status}`);
  }

  const geojson = await response.json();

  return geojson.features;
}
```

This module owns GeoJSON loading.

---

```activity
{
  "type": "reveal",
  "eyebrow": "🧠 Match the Responsibility",
  "title": "Which File Owns Each Job?",
  "prompt": "Try matching each responsibility before revealing the answer.",
  "context": "application state       → ?\nGeoJSON loading         → ?\nLeaflet behavior        → ?\nDOM rendering/events    → ?\noverall coordination    → ?",
  "buttonLabel": "Reveal matches",
  "answer": "application state       → state.js\nGeoJSON loading         → data.js\nLeaflet behavior        → map.js\nDOM rendering/events    → ui.js\noverall coordination    → app.js"
}
```

---

# 🛠️ Your Turn 5 - Build `map.js`

In `js/map.js`, add:

```js
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
```

This module owns Leaflet behavior.

---

# 🛠️ Your Turn 6 - Build `ui.js`

In `js/ui.js`, add:

```js
const appTitle = document.querySelector("#app-title");

const placeList = document.querySelector("#place-list");

const statusElement = document.querySelector("#status");

const categoryFilter = document.querySelector("#category-filter");

export function setAppTitle(cityName) {
  appTitle.textContent = `${cityName} Explorer`;
}

export function setStatus(message) {
  statusElement.textContent = message;
}

export function renderList(features) {
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

export function highlightSelectedCard(id) {
  const key = String(id);

  document.querySelectorAll("[data-place-id]").forEach((card) => {
    const selected = card.dataset.placeId === key;

    card.classList.toggle("is-selected", selected);

    card.setAttribute("aria-current", String(selected));
  });

  const card = document.querySelector(`[data-place-id="${CSS.escape(key)}"]`);

  if (card) {
    card.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }
}

export function bindPlaceListClick(onSelect) {
  placeList.addEventListener("click", (event) => {
    const card = event.target.closest("[data-place-id]");

    if (!card) {
      return;
    }

    onSelect(card.dataset.placeId);
  });
}

export function bindCategoryChange(onChange) {
  categoryFilter.addEventListener("change", (event) => {
    onChange(event.target.value);
  });
}
```

This module owns DOM behavior.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🐛 Spot the Bug",
  "title": "Module Import Path",
  "prompt": "What is suspicious about this browser import?",
  "context": "import { fetchPlaces } from \"./data\";",
  "options": [
    {
      "value": "A",
      "label": "The import should use single quotes instead."
    },
    {
      "value": "B",
      "label": "The browser-based module path should include .js."
    },
    {
      "value": "C",
      "label": "fetchPlaces cannot be imported into app.js."
    },
    {
      "value": "D",
      "label": "There is no problem."
    }
  ],
  "correct": "B",
  "success": "Correct! For this workshop’s browser-based ES modules, use the actual file path: ./data.js. There is no bundler here to resolve the missing extension for us.",
  "hint": "This workshop runs modules directly in the browser with no bundler."
}
```

---

# 🛠️ Your Turn 7 - Build `app.js`

In `js/app.js`, add:

```js
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
```

Save and refresh.

---

# 🎉 Checkpoint

The best result is boring:

> The app still works exactly like Step 06.

You should still have:

- map markers
- popups
- sidebar cards
- selection
- filtering
- loading, empty, and error messages
- responsive layout

But now the code has clearer homes.

---

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "In One Sentence",
  "prompt": "Why is “the app looks exactly the same” a successful result for this step?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "Because a refactor changes the code’s organization without intentionally changing its external behavior."
}
```

---

<!-- OPTIONAL-START: 🗣️ Optional: Pair & Compare -->

Pick one module and explain its responsibility to someone nearby without reading the code line by line.

Try to describe it as a job:

```text
state.js → owns...
data.js  → owns...
map.js   → owns...
ui.js    → owns...
app.js   → coordinates...
```

If you can explain the boundaries, the refactor is doing its job.

## <!-- OPTIONAL-END -->

<!-- OPTIONAL-START: ✨ Make It Yours -->

If you're ahead, pick one.

## Change the default city

In `app.js`, change:

```js
const CITY = "kansas-city";
```

## Move city config into another module

Create `cities.js` and import it into `app.js`.

## Add named constants

For example:

```js
const SELECTION_ZOOM = 15;
```

Want more architecture ideas? Find them under **Explore More → ✨ Make It Yours** in the workshop navigation.

## <!-- OPTIONAL-END -->

# ✅ Check Your Work

Verify:

- [ ] The app loads.
- [ ] The title displays the selected city.
- [ ] GeoJSON loads.
- [ ] Markers appear.
- [ ] Popups work.
- [ ] Sidebar cards appear.
- [ ] Selection works from the map.
- [ ] Selection works from the sidebar.
- [ ] Filtering updates both views.
- [ ] Changing categories clears selection.
- [ ] Empty results still show a useful message.
- [ ] Data errors still show a useful message.
- [ ] The mobile layout still works.
- [ ] There are no module-loading errors.

If something isn't working, use the completed checkpoint below to recover and keep moving.

---

# Next

Continue to:

## 08 - Add Favorites

Next we'll use the modules we just created to add a brand-new feature.
