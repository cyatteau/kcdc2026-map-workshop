# 🧩 Draw and Export GeoJSON

## Goal

Add drawing tools to the finished City Explorer and export your drawings as GeoJSON.

By the end of this extension, you'll be able to:

- draw points
- draw lines
- draw polygons
- edit drawn features
- delete drawn features
- download your drawings as GeoJSON

This extension uses **Leaflet.draw**, a Leaflet plugin that adds interactive drawing and editing tools.

---

# Starting Point

Start from:

```text
checkpoints/08-favorites
```

Copy that completed app into:

```text
extensions/drawing/
```

This extension is optional.

It does not change any of the core workshop checkpoints.

---

# 👀 Watch First - Geographic Data Can Be Created Too

So far, our City Explorer has loaded geographic data from a file:

```text
GeoJSON file
     ↓
fetch()
     ↓
state.places
     ↓
Leaflet
```

But geographic data does not always have to start in a file.

Users can create it directly on the map:

```text
user draws
     ↓
Leaflet layer
     ↓
FeatureGroup
     ↓
GeoJSON
```

For this extension, we'll use a Leaflet plugin called:

```text
Leaflet.draw
```

It gives us drawing controls for features such as:

```text
marker
polyline
polygon
rectangle
```

We'll also let users edit and delete the features they create.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "What Are We Creating?",
  "prompt": "When a user draws a polygon on the map, what are they creating?",
  "options": [
    {
      "value": "A",
      "label": "A new basemap"
    },
    {
      "value": "B",
      "label": "Geographic data"
    },
    {
      "value": "C",
      "label": "A new Leaflet map"
    },
    {
      "value": "D",
      "label": "A category filter"
    }
  ],
  "correct": "B",
  "success": "Correct! Drawing on the map is another way to create geographic data.",
  "hint": "Think about what points, lines, and polygons represent."
}
```

---

# 🛠️ Your Turn 1 - Load Leaflet.draw

Open:

```text
index.html
```

Inside `<head>`, after the existing Leaflet stylesheet, add:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"
/>
```

Then find the Leaflet JavaScript near the bottom of the page:

```html
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

Immediately after it, add:

```html
<script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"></script>
```

Your script order should now look like:

```html
<!-- Leaflet -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Leaflet.draw -->
<script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"></script>

<!-- Esri Leaflet -->
<script src="https://unpkg.com/esri-leaflet@3.0.19/dist/esri-leaflet.js"></script>

<!-- Esri Leaflet Vector -->
<script src="https://unpkg.com/esri-leaflet-vector@4.3.2/dist/esri-leaflet-vector.js"></script>
```

Save and refresh.

Nothing new needs to appear yet.

We loaded the plugin, but we have not created its controls.

---

# 🛠️ Your Turn 2 - Create a Place for Drawn Features

Open:

```text
js/map.js
```

Near the other module-level map variables, add:

```js
let drawnItems;
```

Our existing City Explorer features live in:

```text
placesLayer
```

The features created by the user will live separately in:

```text
drawnItems
```

This helps us keep two kinds of geographic data separate:

```text
placesLayer
↓
workshop historic places

drawnItems
↓
features created by the user
```

---

# 🛠️ Your Turn 3 - Add the Drawing Controls

Still in:

```text
js/map.js
```

Add this exported function:

```js
export function addDrawing() {
  drawnItems = L.featureGroup().addTo(map);

  const drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
    },

    draw: {
      circle: false,
      circlemarker: false,
    },
  });

  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, (event) => {
    drawnItems.addLayer(event.layer);
  });
}
```

There are three important pieces here.

First:

```js
L.featureGroup();
```

creates a Leaflet layer that can hold the features users draw.

Second:

```js
new L.Control.Draw(...)
```

creates the drawing toolbar.

Third:

```js
map.on(
  L.Draw.Event.CREATED,
  ...
);
```

listens for a finished drawing and adds it to our `drawnItems` layer.

---

```activity
{
  "type": "reveal",
  "eyebrow": "🔮 Predict It",
  "title": "What Happens After Drawing?",
  "prompt": "Before testing it, what do you think happens if we draw a polygon but never add event.layer to drawnItems?",
  "buttonLabel": "Reveal the answer",
  "answer": "Leaflet.draw creates the new layer, but our FeatureGroup would not keep track of it. Adding event.layer to drawnItems gives us one collection we can later edit, delete, and export."
}
```

---

# 🛠️ Your Turn 4 - Turn Drawing On

Open:

```text
js/app.js
```

Find the import from:

```text
./map.js
```

Add:

```js
addDrawing,
```

For example:

```js
import {
  initMap,
  renderMap,
  fitMapToPlaces,
  highlightMapPlace,
  addDrawing,
} from "./map.js";
```

Then find:

```js
initMap(appConfig, (id) => {
  selectPlace(id, {
    moveMap: false,
  });
});
```

Immediately after it, add:

```js
addDrawing();
```

Save and refresh.

You should now see the Leaflet.draw toolbar on the map.

---

# ✅ Checkpoint 1 - Drawing Works

Try each of these:

- draw a marker
- draw a line
- draw a polygon
- draw a rectangle
- edit one of your drawings
- delete one of your drawings

Your original historic-place markers should still work too.

If you do not see the drawing toolbar, check:

- Leaflet.draw CSS is loaded
- Leaflet.draw JavaScript is loaded
- Leaflet.draw loads after Leaflet
- `addDrawing()` is imported
- `addDrawing()` is called after `initMap()`

---

# 👀 Watch - From Leaflet Layers to GeoJSON

Our drawings now exist as Leaflet layers.

But Leaflet can convert those layers into GeoJSON.

The important method is:

```js
toGeoJSON();
```

So our new flow becomes:

```text
draw on map
     ↓
drawnItems
     ↓
toGeoJSON()
     ↓
FeatureCollection
```

That means the data we create interactively can become a standard geographic data format.

---

# 🛠️ Your Turn 5 - Get the Drawn GeoJSON

Open:

```text
js/map.js
```

Add:

```js
export function getDrawnGeoJSON() {
  if (!drawnItems) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  return drawnItems.toGeoJSON();
}
```

Now the rest of the application can ask `map.js` for the user's drawings without needing direct access to the Leaflet layer.

That keeps the responsibility inside the map module.

---

# 🛠️ Your Turn 6 - Add a Download Button

Open:

```text
index.html
```

Find the favorite controls:

```html
<div class="favorite-tools"></div>
```

After that section and before the place list, add:

```html
<div class="drawing-tools">
  <button id="export-drawing-button" type="button">
    Download Drawn GeoJSON
  </button>
</div>
```

Save and refresh.

You should now see:

```text
Download Drawn GeoJSON
```

in the sidebar.

The button does not work yet.

Next we'll connect it.

---

# 🛠️ Your Turn 7 - Style the Download Button

Open:

```text
styles.css
```

Add:

```css
.drawing-tools {
  margin: 1rem 0;
}

.drawing-tools button {
  width: 100%;

  padding: 0.7rem 0.9rem;

  font: inherit;
  font-weight: 700;

  background: white;

  border: 1px solid #bbb;
  border-radius: 0.5rem;

  cursor: pointer;
}

.drawing-tools button:hover {
  background: #f5f5f5;
}
```

Save and refresh.

The download button should now fit the rest of the sidebar UI.

---

# 🛠️ Your Turn 8 - Find the Download Button in `ui.js`

Open:

```text
js/ui.js
```

Near the other DOM references, add:

```js
const exportDrawingButton = document.querySelector("#export-drawing-button");
```

Then near the bottom of the file, add:

```js
export function bindDrawingExport(onExport) {
  exportDrawingButton.addEventListener("click", onExport);
}
```

Notice the same callback pattern we used in the core workshop:

```text
ui.js
↓
browser event happens
↓
callback runs
↓
app.js decides what it means
```

`ui.js` does not need to know anything about GeoJSON downloads.

It only reports that the button was clicked.

---

# 🛠️ Your Turn 9 - Import the New Helpers

Open:

```text
js/app.js
```

In the import from:

```text
./map.js
```

make sure you now include:

```js
addDrawing,
getDrawnGeoJSON,
```

For example:

```js
import {
  initMap,
  renderMap,
  fitMapToPlaces,
  highlightMapPlace,
  addDrawing,
  getDrawnGeoJSON,
} from "./map.js";
```

Then find the import from:

```text
./ui.js
```

Add:

```js
bindDrawingExport,
```

For example:

```js
import {
  setAppTitle,
  setStatus,
  renderList,
  highlightSelectedCard,
  bindPlaceListClick,
  bindCategoryChange,
  setFavoriteButton,
  updateFavoriteCard,
  bindFavoriteClick,
  bindDrawingExport,
} from "./ui.js";
```

---

# 🛠️ Your Turn 10 - Download the GeoJSON

Near your other event bindings in:

```text
js/app.js
```

add:

```js
bindDrawingExport(() => {
  const geojson = getDrawnGeoJSON();

  const text = JSON.stringify(geojson, null, 2);

  const blob = new Blob([text], {
    type: "application/geo+json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "city-explorer-drawing.geojson";

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
});
```

There are a few steps happening here:

```text
drawn Leaflet layers
        ↓
getDrawnGeoJSON()
        ↓
JavaScript object
        ↓
JSON.stringify()
        ↓
text
        ↓
Blob
        ↓
temporary browser URL
        ↓
download
```

We create an `<a>` element temporarily because browsers already know how to download a URL.

Once the download starts, we remove the element and release the temporary URL.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "What Does toGeoJSON() Give Us?",
  "prompt": "What does drawnItems.toGeoJSON() produce for our group of drawings?",
  "options": [
    {
      "value": "A",
      "label": "A screenshot of the map"
    },
    {
      "value": "B",
      "label": "A GeoJSON FeatureCollection"
    },
    {
      "value": "C",
      "label": "A new basemap"
    },
    {
      "value": "D",
      "label": "An HTML file"
    }
  ],
  "correct": "B",
  "success": "Correct! The Leaflet FeatureGroup can be converted into a GeoJSON FeatureCollection.",
  "hint": "Think about the standard geographic data format we used earlier in the workshop."
}
```

---

# ✅ Check Your Work

Test the complete extension in this order:

1. Draw a marker.
2. Draw a line.
3. Draw a polygon.
4. Edit one of the drawings.
5. Delete one of the drawings.
6. Click **Download Drawn GeoJSON**.
7. Open the downloaded `.geojson` file.

The downloaded file should begin with something like:

```json
{
  "type": "FeatureCollection",
  "features": []
}
```

If you have drawings on the map, the `features` array should contain them.

---

# 🕵️ Look at the Coordinates

Open your downloaded GeoJSON.

A point may look something like:

```json
{
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-94.58, 39.1]
  }
}
```

Remember the GeoJSON coordinate order from Step 02:

```text
[longitude, latitude]
```

Leaflet.draw and `toGeoJSON()` handle that conversion for us.

---

# ✅ Final Checkpoint - Drawing and Export Work

Before moving on, verify:

- [ ] The City Explorer still loads.
- [ ] Historic-place markers still appear.
- [ ] Favorites still work.
- [ ] The Leaflet.draw toolbar appears.
- [ ] You can draw a marker.
- [ ] You can draw a line.
- [ ] You can draw a polygon.
- [ ] You can edit drawings.
- [ ] You can delete drawings.
- [ ] Download Drawn GeoJSON works.
- [ ] The downloaded file contains a GeoJSON `FeatureCollection`.
- [ ] The downloaded features match what remains on the map.
- [ ] There are no unexpected errors from your application code.

---

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "Why Keep Drawings Separate?",
  "prompt": "Why did we create drawnItems instead of adding user drawings directly to placesLayer?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "The layers represent different responsibilities. placesLayer contains the City Explorer dataset, while drawnItems contains temporary geographic features created by the user. Keeping them separate makes editing, deleting, and exporting the user's drawings much easier."
}
```

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

# ✨ Make It Yours

If your extension is working, try one of these.

## Change Which Drawing Tools Are Available

Our current configuration disables:

```js
circle: false,
circlemarker: false,
```

You can disable more tools.

For example:

```js
draw: {
  circle: false,
  circlemarker: false,
  rectangle: false,
}
```

---

## Change the Download Filename

Find:

```js
link.download = "city-explorer-drawing.geojson";
```

Try:

```js
link.download = "my-kansas-city-map.geojson";
```

or another filename.

---

## Style New Drawings

Explore Leaflet.draw options for customizing:

```text
line style

polygon style

marker appearance
```

---

## Inspect the Export

Draw several different geometry types.

Download the file.

Compare:

```text
Point
LineString
Polygon
```

inside the exported GeoJSON.

<!-- OPTIONAL-END -->

---

<!-- OPTIONAL-START: 🚀 Challenge - Add Properties -->

# 🚀 Challenge - Add Properties

Right now, a feature you draw may contain:

```json
"properties": {}
```

Can you let the user give a drawing:

```text
name
category
description
```

before exporting it?

A possible flow:

```text
draw feature
     ↓
ask for information
     ↓
store values in feature properties
     ↓
export GeoJSON
```

This is a bigger challenge because it connects:

```text
map interaction
+
ordinary web UI
+
GeoJSON properties
```

<!-- OPTIONAL-END -->

---

# 🎉 Extension Complete

You just changed the City Explorer from an application that only **reads** geographic data into one that can also **create** geographic data.

The full flow is:

```text
Leaflet map
     ↓
user draws
     ↓
Leaflet layers
     ↓
FeatureGroup
     ↓
toGeoJSON()
     ↓
FeatureCollection
     ↓
download
```

That is a useful pattern far beyond this workshop.

Your original data and your new data now come from two different directions:

```text
local GeoJSON
     ↓
City Explorer

user drawing
     ↓
new GeoJSON
```

Both end up as geographic data that Leaflet can work with.

---

# Explore More

Return to **Explore More** in the workshop navigation to try another extension.
