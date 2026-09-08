# 02 - Load Geographic Data

## Goal

Load local GeoJSON and turn it into places on the map.

By the end of this section, you'll have:

- a dataset connected to each city
- GeoJSON loaded into application state
- a Leaflet GeoJSON layer
- circle markers
- popups
- automatic map fitting

We are still only rendering the map.

The sidebar comes next.

---

# Starting Point

Start from:

```text
checkpoints/01-map
```

You should already have a working Leaflet map with an ArcGIS basemap.

In this exercise, we'll only edit:

```text
main.js
```

---

# 👀 Watch First - Meet the Data

Before we load anything, open:

```text
data/cities/kansas-city.geojson
```

You do not need to understand every line.

Start by looking at the overall structure:

```text
FeatureCollection
├── type
├── name
└── features
    └── Feature
        ├── type
        ├── properties
        │   ├── id
        │   ├── name
        │   ├── category
        │   ├── description
        │   ├── address
        │   ├── built
        │   ├── architect
        │   ├── listedDate
        │   └── sourceObjectId
        └── geometry
            ├── type
            └── coordinates
```

A **FeatureCollection** contains an array of geographic **Features**.

Each Feature has two especially important pieces for us:

```text
properties
↓
information about the place

geometry
↓
where the place is
```

---

# 👀 Look at One Real Feature

The first Kansas City feature looks like this, shortened a little so we can focus on the important parts:

```json
{
  "type": "Feature",
  "properties": {
    "id": "kc-001",
    "name": "\"Roselawn\" (Wm. Volker Estate)",
    "category": "Residential",
    "description": "Built: c.1889.",
    "address": "3717 Bell Street"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-94.60551423723588, 39.06000139191]
  }
}
```

The actual feature contains a few additional properties too.

That's normal.

A GeoJSON feature can contain more information than our application chooses to use.

Before continuing, find the first feature in `kansas-city.geojson`.

Can you identify:

- its `name`
- its `category`
- its `address`
- its `geometry.type`
- its coordinates

You should find:

```text
name
"Roselawn" (Wm. Volker Estate)

category
Residential

geometry.type
Point
```

The properties tell us about the place.

The geometry tells us where it belongs on the map.

---

# 👀 One Coordinate Gotcha

There is one mapping convention worth knowing now.

Leaflet methods such as `setView()` commonly use:

```text
[latitude, longitude]
```

GeoJSON stores coordinates as:

```text
[longitude, latitude]
```

For the first feature in our file:

```text
GeoJSON:

[-94.60551423723588, 39.06000139191]
 longitude             latitude
```

The same location written in the order Leaflet commonly uses would be:

```text
[39.06000139191, -94.60551423723588]
 latitude          longitude
```

The order is different.

When we use `L.geoJSON()`, Leaflet handles that conversion for us.

Our data flow for this section will be:

```text
GeoJSON file
     ↓
fetch()
     ↓
state.places
     ↓
Leaflet
```

We'll build that flow one piece at a time.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Coordinate Order",
  "prompt": "GeoJSON stores Point coordinates in which order?",
  "options": [
    {
      "value": "A",
      "label": "[latitude, longitude]"
    },
    {
      "value": "B",
      "label": "[longitude, latitude]"
    }
  ],
  "correct": "B",
  "success": "Correct! GeoJSON uses [longitude, latitude]. Leaflet methods such as setView() commonly use the opposite order, but L.geoJSON() handles the GeoJSON conversion for us.",
  "hint": "Look back at the first feature in kansas-city.geojson."
}
```

<!-- OPTIONAL VIDEO SLOT
Suggested clip: "GeoJSON in 60 Seconds"
Suggested length: 60-90 seconds
Place it here if you record one.
-->

---

# 🛠️ Your Turn 1 - Connect Cities to Data

Each prepared city has its own GeoJSON file.

In `main.js`, add a `dataUrl` to each city.

Your `cities` object should become:

```js
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
```

Because `appConfig` already points to the selected city, it now also gives us that city's `dataUrl`.

For Kansas City:

```text
appConfig.dataUrl
        ↓
./data/cities/kansas-city.geojson
```

The selected city now controls both:

```text
starting map position
+
dataset
```

---

# 🛠️ Your Turn 2 - Add Application State

Under:

```js
const appConfig = cities[CITY];
```

add:

```js
// --------------------------------------------------
// APPLICATION STATE
// --------------------------------------------------

const state = {
  places: [],
};
```

Right now, our state has one job:

```text
state.places
     ↓
loaded GeoJSON features
```

It starts as an empty array because the data has not loaded yet.

Later, this same state will drive:

```text
map
sidebar
selection
filtering
```

The application will own the data.

Leaflet will be one way we display it.

---

# 🛠️ Your Turn 3 - Fetch the GeoJSON

Add:

```js
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
```

There are two important steps happening here:

```text
fetch(dataUrl)
↓
request the file

response.json()
↓
turn the response into a JavaScript object
```

Our GeoJSON file is a FeatureCollection.

The full object looks conceptually like:

```text
GeoJSON
├── type
├── name
└── features
```

For this app, we want the `features` array, so the function returns:

```js
return geojson.features;
```

Now add:

```js
async function loadPlaces() {
  const features = await fetchPlaces(appConfig.dataUrl);

  state.places = features;

  console.log("Places loaded:", state.places.length);
  console.log("First feature:", state.places[0]);
}
```

At the bottom of `main.js`, update startup to:

```js
initializeMap();

loadPlaces();
```

Save and refresh.

Open **Developer Tools → Console**.

---

# ✅ Checkpoint 1 - The Data Is in the App

You should see:

```text
Places loaded: 60
```

You should also see the first GeoJSON feature.

Expand it in the Console.

Find:

```text
properties
geometry
```

Inside `properties`, look for:

```text
id
name
category
description
address
built
architect
listedDate
sourceObjectId
```

Inside `geometry`, look for:

```text
type
coordinates
```

Compare this object with the feature you opened earlier in:

```text
data/cities/kansas-city.geojson
```

It's the same data.

The file has simply been loaded into JavaScript.

At this point:

```text
GeoJSON file
     ↓
fetchPlaces()
     ↓
state.places
```

But notice something important:

> Nothing new appears on the map yet.

That's correct.

The application has the data, but Leaflet has not been asked to render it.

Before continuing, remove these temporary lines:

```js
console.log("Places loaded:", state.places.length);
console.log("First feature:", state.places[0]);
```

---

```activity
{
  "type": "fill-blank",
  "eyebrow": "🧠 Fill It In",
  "title": "Follow the Data",
  "prompt": "Complete the missing step in the data flow.",
  "context": "GeoJSON file\n     ↓\n____________\n     ↓\nstate.places",
  "answers": [
    "fetchPlaces()",
    "fetchPlaces"
  ],
  "placeholder": "Type the missing function",
  "success": "Correct! fetchPlaces() requests and parses the file before its features are stored in state.places.",
  "hint": "It is the function we just wrote to request the GeoJSON file."
}
```

---

<!-- OPTIONAL-START: 🔎 Optional: Look Under the Hood - The GeoJSON Request -->

Want to see `fetch()` actually request the file?

Open **Developer Tools → Network**.

1. Clear the existing requests.
2. In the filter box, try:

```text
kansas-city.geojson
```
3. Refresh the page.


You should see the GeoJSON request.

Click it.

Look at the **Headers** panel and find the request URL.

Then open **Response** or **Preview**.

You should see the same FeatureCollection you opened in your editor.

The path is:

```text
main.js
   ↓
fetch()
   ↓
HTTP request
   ↓
kansas-city.geojson
   ↓
JavaScript object
```

This is optional. You do not need to inspect the request to continue.

<!-- OPTIONAL-END -->

---

# 🛠️ Your Turn 4 - Create an Empty GeoJSON Layer

Now we'll prepare Leaflet to display the features.

Find:

```js
let map;
```

Change it to:

```js
let map;
let placesLayer;
```

`map` is the Leaflet map itself.

`placesLayer` will hold the geographic features we add to it.

Now add a marker style helper:

```js
function markerStyle() {
  return {
    radius: 7,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  };
}
```

Inside `initializeMap()`, after:

```js
addBasemap();
```

add:

```js
placesLayer = L.geoJSON(null, {
  pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, markerStyle());
  },
}).addTo(map);
```

Save and refresh.

You still should not see any place markers.

That's expected.

We created the layer, but we gave it:

```text
null
```

instead of actual GeoJSON data.

So right now:

```text
Leaflet map
     ↓
placesLayer
     ↓
empty
```

---

# 👀 What Is `pointToLayer()` Doing?

Our GeoJSON contains Point features.

For each Point, Leaflet calls:

```js
pointToLayer(feature, latlng);
```

The two values represent:

```text
feature
↓
the GeoJSON feature being processed

latlng
↓
the geographic position Leaflet calculated
```

Remember that the GeoJSON file stores:

```text
[longitude, latitude]
```

Leaflet reads those coordinates and gives `pointToLayer()` a Leaflet `latlng`.

Then we decide how that Point should appear:

```js
return L.circleMarker(latlng, markerStyle());
```

So:

```text
GeoJSON Point
     ↓
Leaflet reads coordinates
     ↓
pointToLayer()
     ↓
circle marker
```

`pointToLayer()` controls **how a Point feature becomes a Leaflet layer**.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🐛 Spot the Bug",
  "title": "Reversed GeoJSON Coordinates",
  "prompt": "What is wrong with this GeoJSON Point?",
  "context": "{\n  \"type\": \"Point\",\n  \"coordinates\": [39.06000139191, -94.60551423723588]\n}",
  "options": [
    {
      "value": "A",
      "label": "The geometry type should be LineString."
    },
    {
      "value": "B",
      "label": "The coordinate order is reversed."
    },
    {
      "value": "C",
      "label": "The coordinates should be strings."
    },
    {
      "value": "D",
      "label": "Nothing is wrong."
    }
  ],
  "correct": "B",
  "success": "Correct! GeoJSON expects [longitude, latitude]. For this place that is [-94.60551423723588, 39.06000139191].",
  "hint": "Compare the numbers with the real feature you inspected earlier."
}
```

---

# 🛠️ Your Turn 5 - Render the Features

Add this section after the map setup code:

```js
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
```

`renderMap()` receives an array of GeoJSON features.

First:

```js
placesLayer.clearLayers();
```

removes anything the layer was previously displaying.

Then:

```js
placesLayer.addData(...)
```

hands the current features to Leaflet.

Remember that `fetchPlaces()` returned only:

```text
features
```

But `L.geoJSON()` understands GeoJSON structures such as a FeatureCollection.

So here we rebuild that simple wrapper:

```text
FeatureCollection
└── features
    ├── Feature
    ├── Feature
    ├── Feature
    └── ...
```

Now update `loadPlaces()`:

```js
async function loadPlaces() {
  const features = await fetchPlaces(appConfig.dataUrl);

  state.places = features;

  renderMap(state.places);
}
```

Before refreshing, predict what should change.

```activity
{
  "type": "reveal",
  "eyebrow": "🔮 Before You Run It",
  "title": "What Should Appear?",
  "prompt": "We now have data in state, a GeoJSON layer, and renderMap(). What should change when you refresh?",
  "context": "data in state\n+\nGeoJSON layer\n+\nrenderMap()",
  "buttonLabel": "Reveal prediction",
  "answer": "The place markers should finally appear. The data was already in state.places; this is the moment we ask Leaflet to render it."
}
```

Save and refresh.

---

# 🎉 Checkpoint 2 - Data Becomes Geography

You should now see place markers.

The data flow has grown:

```text
GeoJSON file
     ↓
fetchPlaces()
     ↓
state.places
     ↓
renderMap()
     ↓
L.geoJSON()
     ↓
circle markers
```

Try panning and zooming.

The markers are now geographic objects on the Leaflet map.

But if you click one, it doesn't tell you much yet.

So far, we have mostly used the feature's:

```text
geometry
```

Next we'll use its:

```text
properties
```

---

# 🛠️ Your Turn 6 - Add Popups

Each GeoJSON feature has properties we can use for display.

Inside the `L.geoJSON()` options, add `onEachFeature`:

```js
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
```

`onEachFeature()` runs once for each feature Leaflet adds.

Its arguments give us:

```text
feature
↓
the GeoJSON feature

layer
↓
the Leaflet layer created for it
```

Look back at the GeoJSON file.

Each feature has properties such as:

```text
id
name
category
description
address
built
architect
listedDate
sourceObjectId
```

But our popup only needs three of them:

```js
const { name, category, description } = feature.properties;
```

We are choosing which parts of the data the UI needs.

The other properties are still there if we want them later.

Then:

```js
layer.bindPopup(popup);
```

connects the popup to that feature's Leaflet layer.

The relationship is:

```text
geometry
   ↓
marker location

properties
   ↓
popup content
```

Save and refresh.

Click a marker.

---

# ✅ Checkpoint 3 - Markers Have Meaning

Click several markers.

You should now see:

- the place name
- its category
- its description, when available

Notice how different parts of the same GeoJSON feature have different jobs:

```text
Feature
├── properties
│      ↓
│   popup content
│
└── geometry
       ↓
    marker location
```

And remember:

> We don't have to display every property just because it exists in the data.

That same `properties` object will become useful again when we build the sidebar.

---

# 🛠️ Your Turn 7 - Fit the Map to the Data

Our map still starts from the configured center and zoom.

Now let's let the loaded data determine the final view.

Add this after `renderMap()`:

```js
function fitMapToPlaces() {
  if (placesLayer.getBounds().isValid()) {
    map.fitBounds(placesLayer.getBounds(), {
      padding: [30, 30],
    });
  }
}
```

`placesLayer.getBounds()` calculates a geographic bounding box containing all the rendered places.

Conceptually:

```text
all markers
     ↓
smallest box containing them
     ↓
bounds
```

Then:

```js
map.fitBounds(...)
```

moves and zooms the map so those bounds are visible.

The padding:

```js
padding: [30, 30];
```

adds a little breathing room around the edges.

Update `loadPlaces()` one last time:

```js
async function loadPlaces() {
  const features = await fetchPlaces(appConfig.dataUrl);

  state.places = features;

  renderMap(state.places);

  fitMapToPlaces();
}
```

Save and refresh.

---

# 🎉 Final Checkpoint - Complete Data Layer

You should now have:

- historic-place markers
- popups with name, category, and description
- the map automatically fitting to the loaded dataset

The complete data flow is:

```text
GeoJSON file
     ↓
fetchPlaces()
     ↓
state.places
     ↓
renderMap()
     ↓
L.geoJSON()
     ↓
markers + popups
```

And the map view responds to the rendered layer:

```text
placesLayer
     ↓
getBounds()
     ↓
fitBounds()
     ↓
all places visible
```

The important architectural idea:

```text
application owns the data
         ↓
    state.places
         ↓
Leaflet displays the data
```

We are not storing our application data inside Leaflet.

That matters in the next step, because the same `state.places` array will also power ordinary HTML.

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

If you're ahead, try some of these.

## Try another prepared city

Change:

```js
const CITY = "chicago";
```

or:

```js
const CITY = "seattle";
```

The city configuration chooses both:

```text
starting map position
+
GeoJSON dataset
```

## Change the marker style

Try changing:

```js
radius: 7,
weight: 2,
fillOpacity: 0.8,
```

For example:

```js
radius: 10,
weight: 3,
fillOpacity: 0.5,
```

Refresh and notice how every Point feature changes because they all use the same `markerStyle()` helper.

## Change the popup

Inside `onEachFeature()`, try displaying another property that already exists in the dataset.

For example, add:

```js
const address = document.createElement("div");
address.textContent = feature.properties.address;

popup.append(address);
```

Now the popup uses another field you saw when you first opened the GeoJSON file.

Remove it before continuing if you want to stay exactly with the shared workshop path.

## Inspect another city

Open:

```text
data/cities/chicago.geojson
```

or another prepared dataset.

Compare its structure with Kansas City.

The values change, but the GeoJSON structure stays the same.

For the easiest path with the instructor, return to the original version before continuing.

Want more data ideas? Find them under **Explore More → ✨ Make It Yours** in the workshop navigation.

<!-- OPTIONAL-END -->
---

# ✅ Check Your Work

Verify:

- [ ] The basemap still appears.
- [ ] GeoJSON loads successfully.
- [ ] `state.places` contains the loaded features.
- [ ] Historic-place markers appear.
- [ ] Clicking a marker opens a popup.
- [ ] Popups show name, category, and description.
- [ ] The map fits to the loaded data.
- [ ] There are no unexpected errors from your application code.

If something isn't working, use the completed checkpoint below to recover and keep moving.

---

# Next

Continue to:

## 03 - Build the Sidebar UI

Next we'll use the same `state.places` array to build ordinary HTML beside the map.
