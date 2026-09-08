# 01 - Build the Map

## Goal

Get a real interactive Leaflet map running in the browser.

By the end of this section, you'll have:

- Leaflet loaded
- a visible map container
- a configurable starting city
- an OpenStreetMap tile basemap
- an ArcGIS vector basemap through Esri Leaflet
- working pan and zoom

We are **not loading our historic-place data yet**. That comes in Step 02.

---

# Starting Point

Start from:

```text
checkpoints/00-start
```

If you're working continuously in `workshop-work`, keep using that folder.

Your starting `main.js` should still be almost empty.

---

# 👀 Watch First

We'll build the map in layers:

```text
HTML container
      ↓
Leaflet map
      ↓
OpenStreetMap tiles
      ↓
ArcGIS vector basemap
```

The main idea:

> Leaflet creates the interactive map, but the basemap is a layer we choose.

We'll also see one classic Leaflet bug:

> A map can exist in JavaScript and still be invisible if its container has no height.

Then it's your turn.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "What Does Leaflet Own?",
  "prompt": "Which statement is true?",
  "options": [
    {
      "value": "A",
      "label": "Leaflet automatically includes OpenStreetMap as its basemap."
    },
    {
      "value": "B",
      "label": "Leaflet creates the interactive map, and we add a basemap as a separate layer."
    },
    {
      "value": "C",
      "label": "Leaflet requires ArcGIS to display a map."
    },
    {
      "value": "D",
      "label": "Leaflet can only display GeoJSON."
    }
  ],
  "correct": "B",
  "success": "Correct! Leaflet handles the interactive map. The visible basemap comes from a layer we choose.",
  "hint": "Think about whether Leaflet itself provides the map imagery."
}
```

<!-- OPTIONAL VIDEO SLOT
Suggested clip: "Leaflet in 60 Seconds"
Suggested length: 45-60 seconds
Place it here if you record one.
-->

---

# 🛠️ Your Turn 1 - Load Leaflet

Open `index.html`.

Inside `<head>`, add Leaflet's stylesheet **before** your own stylesheet:

```html
<!-- Leaflet -->
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<!-- App styles -->
<link rel="stylesheet" href="./styles.css" />
```

Near the bottom of `<body>`, load Leaflet before your own script:

```html
<!-- Leaflet -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- App -->
<script src="./main.js"></script>
```

For this first pass, we're using Leaflet by itself.

We'll add Esri Leaflet after we have a basic map working.

---

# 🛠️ Your Turn 2 - Create a Place for the Map

Inside `<body>`, before the scripts, add:

```html
<main id="map" class="map" aria-label="Interactive map"></main>
```

Open `styles.css` and add:

```css
.map {
  width: 100%;
  height: 100vh;
}
```

Your stylesheet should now include:

```css
html,
body {
  height: 100%;
  margin: 0;
}

.map {
  width: 100%;
  height: 100vh;
}
```

`100vh` means the map will fill the full height of the browser viewport.

Remember:

```text
no height = no visible map
```

---

```activity
{
  "type": "reveal",
  "eyebrow": "🔮 Predict It",
  "title": "What If the Height Disappears?",
  "prompt": "Imagine you remove the map height but keep all the JavaScript that creates the Leaflet map. What do you expect?",
  "context": "height: 100vh;",
  "buttonLabel": "Reveal prediction",
  "answer": "The Leaflet map can still exist in JavaScript, but its container may have no visible height. The map can be working and still appear blank."
}
```

---

# 🛠️ Your Turn 3 - Configure the Starting City

Open `main.js`.

Each city needs two map settings:

- `center` is the starting `[latitude, longitude]`
- `zoom` controls how close the starting view is

For example:

```text
Kansas City

center: [39.0997, -94.5786]
         latitude   longitude

zoom: 12
```

Latitude tells us how far north or south a location is.

Longitude tells us how far east or west it is.

Higher zoom numbers show a smaller area in more detail.

Replace the starter comment with:

```js
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
```

`CITY` chooses which configuration object the app uses.

With:

```js
const CITY = "kansas-city";
```

`appConfig` becomes the Kansas City settings.

For the shared workshop path, keep:

```js
const CITY = "kansas-city";
```

---

# 🛠️ Your Turn 4 - Create the Leaflet Map

Under the city configuration, add:

```js
// --------------------------------------------------
// MAP SETUP
// --------------------------------------------------

let map;

function initializeMap() {
  map = L.map("map").setView(appConfig.center, appConfig.zoom);
}
```

`L.map("map")` creates the Leaflet map inside the element with `id="map"`.

`setView()` gives it the starting center and zoom from the city configuration.

At the bottom of the file, add:

```js
// --------------------------------------------------
// START APPLICATION
// --------------------------------------------------

initializeMap();
```

Save and refresh.

---

# ✅ Checkpoint 1

You should now have:

- Leaflet zoom controls
- Leaflet attribution
- a draggable map area
- working zoom

The background will still look mostly blank.

That's correct.

You have a Leaflet map, but you have not added a visible basemap layer yet.

---

<!-- OPTIONAL-START: 🧪 Optional: Break It on Purpose - Map Height -->

Want to see the classic Leaflet height problem for yourself?

Temporarily comment out:

```css
height: 100vh;
```

Refresh the page.

Then restore the height before continuing.

The point is not to memorize a fix. It is to recognize this symptom later:

> Leaflet controls are present or JavaScript is running, but the map itself has no visible space.

<!-- OPTIONAL-END -->
---

# 🛠️ Your Turn 5 - Add OpenStreetMap Tiles

In `main.js`, add this function above `initializeMap()`:

```js
function addBasemap() {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
}
```

`L.tileLayer()` adds a tiled basemap layer to the Leaflet map.

The `{z}`, `{x}`, and `{y}` parts are placeholders Leaflet fills in as you pan and zoom.

They tell the tile server which map image is needed for the current zoom level and location.

`maxZoom: 19` sets the highest zoom level allowed for this layer.

`.addTo(map)` adds the finished layer to our Leaflet map.

Update `initializeMap()` to call it:

```js
function initializeMap() {
  map = L.map("map").setView(appConfig.center, appConfig.zoom);

  addBasemap();
}
```

Save and refresh.

---

# 🎉 Checkpoint 2 - A Leaflet Map With OSM Tiles

You should now see:

- Kansas City
- OpenStreetMap tiles
- Leaflet zoom controls
- attribution
- working pan and zoom

This is a working Leaflet map.

Now we'll swap the basemap provider while keeping the same Leaflet map.

---

<!-- OPTIONAL-START: 🔎 Optional: Look Under the Hood - Raster Tiles -->

Want to see what `L.tileLayer()` is actually loading?

Open your browser's **Developer Tools** and choose the **Network** panel.

1. Clear the current Network requests.
2. In the filter box, enter:

```text
tile.openstreetmap.org
```

3. Pan or zoom the map.

You should see several new requests appear.

Look for request names ending in:

```text
.png
```

They may look something like:

```text
12/971/1586.png
12/972/1586.png
12/971/1587.png
```

Those numbers correspond to the tile coordinates Leaflet fills into:

```text
{z}/{x}/{y}.png
```

Click one of the requests and open its **Preview**.

You should see one small square piece of the map.

That's a **raster tile**.

```text
pan or zoom
     ↓
Leaflet calculates visible tiles
     ↓
browser requests .png images
     ↓
tiles are assembled into the basemap
```

The browser is downloading already-rendered map images and arranging them to create the visible basemap.

You do not need to inspect these requests to continue.

<!-- OPTIONAL-END -->

---

# 👀 Watch - Same Map, Different Basemap

Right now we have:

```text
Leaflet map
     ↓
OpenStreetMap tile layer
```

Next we'll use:

```text
Leaflet map
     ↓
Esri Leaflet Vector
     ↓
ArcGIS vector basemap
```

The map object stays Leaflet.

The basemap layer changes.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "What Are We Replacing?",
  "prompt": "When we move from OpenStreetMap to the ArcGIS vector basemap, what stays the same?",
  "options": [
    {
      "value": "A",
      "label": "Only the browser window"
    },
    {
      "value": "B",
      "label": "The Leaflet map, center, and zoom"
    },
    {
      "value": "C",
      "label": "The basemap provider"
    },
    {
      "value": "D",
      "label": "The rendering technology"
    }
  ],
  "correct": "B",
  "success": "Correct! We are replacing the basemap layer, not rebuilding the application around a different map object.",
  "hint": "Think about the map object we already created with L.map()."
}
```

---

# 🛠️ Your Turn 6 - Add Esri Leaflet

Open `index.html`.

Near the bottom of `<body>`, update your scripts so they look like this:

```html
<!-- Leaflet -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Esri Leaflet -->
<script src="https://unpkg.com/esri-leaflet@3.0.19/dist/esri-leaflet.js"></script>

<!-- Esri Leaflet Vector -->
<script src="https://unpkg.com/esri-leaflet-vector@4.3.2/dist/esri-leaflet-vector.js"></script>

<!-- Local workshop configuration -->
<script src="./config.js"></script>

<!-- App -->
<script src="./main.js"></script>
```

Keep them in that order:

```text
Leaflet
↓
Esri Leaflet
↓
Esri Leaflet Vector
↓
config.js
↓
main.js
```

Leaflet creates the map.

Esri Leaflet and Esri Leaflet Vector let that Leaflet map use ArcGIS services.

`config.js` provides the workshop API key before our application code runs.

---

# 🛠️ Your Turn 7 - Swap to the ArcGIS Basemap

Replace your current `addBasemap()` function with:

```js
function addBasemap() {
  const apiKey = window.APP_CONFIG?.arcgisApiKey;

  if (apiKey) {
    L.esri.Vector.vectorBasemapLayer("arcgis/light-gray", {
      apikey: apiKey,
    }).addTo(map);

    return;
  }

  console.warn("No ArcGIS API key found. Falling back to OpenStreetMap.");

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
}
```

Here, `arcgis/light-gray` identifies the ArcGIS basemap style.

`apikey: apiKey` passes your workshop key to the ArcGIS service.

The OpenStreetMap layer remains as a fallback if no API key is found.

Save and refresh.

---

# 🎉 Checkpoint 3 - ArcGIS Basemap in Leaflet

You should now see:

- Kansas City
- the ArcGIS Light Gray basemap
- Leaflet zoom controls
- attribution
- working pan and zoom

The important thing:

```text
same Leaflet map
same center
same zoom
new basemap layer
```

You now have the first working version of your City Explorer.

---

<!-- OPTIONAL-START: 🔎 Optional: Look Under the Hood - Vector Basemap -->

Now compare the Network requests with the ArcGIS vector basemap.

Open **Developer Tools → Network** again.

1. Clear the current Network requests.
2. Pan or zoom the map.
3. In the filter box, try:

```text
arcgis
```

If that doesn't show much, clear the filter and look through the new requests.

You may see requests related to things such as:

```text
tile
style
sprite
glyph
```

The exact request names and URLs may vary.

Unlike the OpenStreetMap raster layer, you should not see the basemap arriving as a collection of finished `.png` map images.

The ArcGIS vector basemap can load several types of resources, including:

- vector tile data
- style information
- symbols and sprites
- fonts or glyphs used for labels

Click a few of the requests and inspect them.

With the OpenStreetMap requests, the **Preview** showed a finished square piece of the map.

With the vector basemap requests, you generally will not see a finished map image like that.

That's because the rendering process is different.

```text
OpenStreetMap raster basemap

server renders map
      ↓
browser downloads map images
      ↓
browser displays the images
```

Compare that with:

```text
ArcGIS vector basemap

browser downloads vector data
+ styling resources
      ↓
browser renders the map
```

But from our application's point of view:

```text
same Leaflet map
same center
same zoom
different basemap layer
different rendering technology
```

You do not need to inspect these requests to continue.

<!-- OPTIONAL-END -->

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

If you're ahead, try out some of these fun changes.

## Change the city

```js
const CITY = "chicago";
```

or:

```js
const CITY = "seattle";
```

## Change the zoom

```js
zoom: 10,
```

or:

```js
zoom: 14,
```

## Change the ArcGIS basemap

Replace `arcgis/light-gray` with one of:

```text
arcgis/streets
arcgis/navigation
arcgis/topographic
arcgis/imagery
arcgis/dark-gray
```

For the easiest path with the instructor, return to:

```js
const CITY = "kansas-city";
```

before continuing.

Want more customization ideas? Find them under **Explore More → ✨ Make It Yours** in the workshop navigation.

<!-- OPTIONAL-END -->
---

# ✅ Check Your Work

Before moving on, verify:

- [ ] The map fills the page.
- [ ] Kansas City appears.
- [ ] The ArcGIS basemap loads.
- [ ] You can pan.
- [ ] You can zoom.
- [ ] There are no unexpected errors from your application code.

If something isn't working, use the completed checkpoint below to recover and keep moving.

---

# Next

Continue to:

## 02 - Load Geographic Data

Next we'll put actual places on the map with GeoJSON.
