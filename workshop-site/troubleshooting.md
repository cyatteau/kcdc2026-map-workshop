# Troubleshooting

Something not working?

Start here before rebuilding everything.

Most City Explorer problems come from a small set of issues:

```text
local server
file paths
map height
script order
config.js
GeoJSON
JavaScript errors
module imports
```

The good news: every core step has a completed checkpoint.

If debugging stops being useful, use the checkpoint and keep moving.

---

## Jump to a problem

- [Quick diagnostic checklist](#quick-diagnostic-checklist)
- [Local server and file paths](#local-server-and-file-paths)
- [Blank map or basemap problems](#blank-map-or-basemap-problems)
- [Leaflet and ArcGIS library problems](#leaflet-and-arcgis-library-problems)
- [GeoJSON and data problems](#geojson-and-data-problems)
- [Sidebar and selection problems](#sidebar-and-selection-problems)
- [Filtering problems](#filtering-problems)
- [Loading, error, and responsive problems](#loading-error-and-responsive-problems)
- [Step 07 module problems](#step-07-module-problems)
- [Custom data problems](#custom-data-problems)
- [Checkpoint recovery](#checkpoint-recovery)

---

# Quick Diagnostic Checklist

Before changing a lot of code, check these in order:

- [ ] Did I save my files?
- [ ] Am I using a local web server?
- [ ] Does the URL start with `http://` or `https://`, not `file://`?
- [ ] Is there a red error in the Console?
- [ ] Is there a `404` in the Network panel?
- [ ] Does the map container have a height?
- [ ] Does `config.js` exist when I reach the ArcGIS basemap step?
- [ ] Does the GeoJSON path match the actual file location?
- [ ] If I'm in Step 07, are my module paths correct?
- [ ] Does the completed checkpoint work?

If one answer looks suspicious, start there.

---

## Use DevTools

Open browser DevTools:

```text
F12
```

or:

```text
Ctrl + Shift + I
```

The two most useful tabs are:

```text
Console
Network
```

Use the **Console** for JavaScript and module errors.

Use **Network** for missing files, failed GeoJSON requests, scripts, and basemap requests.

---

# Local Server and File Paths

## My page uses `file://`

If the address bar looks like:

```text
file:///...
```

you opened the HTML file directly.

That will cause problems once the workshop uses:

```js
fetch();
```

and later:

```js
import
```

Use a local web server instead.

The exact address will depend on your server. For example:

```text
http://localhost:8000/
```

or:

```text
http://127.0.0.1:5500/
```

The important part is:

```text
http://
```

not:

```text
file://
```

---

## Python server

From the repository root:

```bash
python -m http.server 8000
```

or:

```bash
python3 -m http.server 8000
```

Then open the URL shown by your server.

---

## VS Code Live Server

If you use the Live Server extension:

1. Open the repository folder in VS Code.
2. Start Live Server.
3. Open your working application through the URL it provides.

Your port may be different from someone else's. That's fine.

---

## I see a `404`

A `404` means the browser requested a file the server could not find.

Check:

```text
filename
folder name
relative path
capitalization
server root
```

If the missing request is a GeoJSON file, try opening that file's URL directly in the browser.

---

# Blank Map or Basemap Problems

## Nothing appears at all

If you do not see Leaflet zoom controls or a draggable map area, first check:

```html
<main id="map" class="map" aria-label="Interactive map"></main>
```

and:

```js
L.map("map");
```

The IDs must match.

Then check the Console.

---

## The map exists but is invisible

A Leaflet map can exist in JavaScript and still be invisible if its container has no height.

In Step 01, verify:

```css
.map {
  width: 100%;
  height: 100vh;
}
```

Later, after the sidebar layout is added, the map uses:

```css
.map {
  height: 100%;
  min-height: 100vh;
}
```

If needed, inspect `#map` in DevTools.

If its computed height is:

```text
0px
```

you found the problem.

---

## I see Leaflet controls but no map tiles

That usually means:

```text
Leaflet initialized successfully
the basemap layer did not
```

Check the Console and Network panel.

In the first part of Step 01, the map uses an OpenStreetMap tile layer.

Later in Step 01, the workshop switches to the ArcGIS vector basemap.

So first identify which basemap step you are on.

---

## OpenStreetMap tiles do not appear

Check that your tile layer looks like:

```js
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);
```

Also verify that:

- the browser is online
- there is no typo in the tile URL
- `addTo(map)` is present
- `map` has already been created

---

## ArcGIS basemap does not appear

Check:

- `config.js` exists
- the workshop API key was pasted correctly
- `config.js` loads before your application code
- Leaflet loaded
- Esri Leaflet loaded
- Esri Leaflet Vector loaded
- the browser is online

The ArcGIS basemap code should use:

```js
const apiKey = window.APP_CONFIG?.arcgisApiKey;

if (apiKey) {
  L.esri.Vector.vectorBasemapLayer("arcgis/light-gray", {
    apikey: apiKey,
  }).addTo(map);

  return;
}
```

If the ArcGIS layer fails but your earlier OpenStreetMap version worked, your Leaflet map is probably fine. Focus on the ArcGIS library/config layer.

---

## `config.js` is missing

Your working application should include:

```text
config.js
```

Create it from:

```text
config.example.js
```

Its shape should be:

```js
window.APP_CONFIG = {
  arcgisApiKey: "YOUR_WORKSHOP_KEY",
};
```

---

## `APP_CONFIG` is undefined

Before Step 07:

```html
<script src="./config.js"></script>
<script src="./main.js"></script>
```

In Step 07:

```html
<script src="./config.js"></script>
<script type="module" src="./js/app.js"></script>
```

`config.js` must load first.

---

# Leaflet and ArcGIS Library Problems

## `L is not defined`

Leaflet did not load before your app code.

Verify Leaflet appears before `main.js` or `app.js`:

```html
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

Also check the Network panel to make sure the script loaded successfully.

---

## `L.esri` is undefined

Leaflet loaded, but Esri Leaflet did not.

Verify:

```html
<script src="https://unpkg.com/esri-leaflet@3.0.19/dist/esri-leaflet.js"></script>
```

comes after Leaflet.

---

## `L.esri.Vector` is undefined

Verify Esri Leaflet Vector is loaded:

```html
<script src="https://unpkg.com/esri-leaflet-vector@4.3.2/dist/esri-leaflet-vector.js"></script>
```

The expected order is:

```text
Leaflet
↓
Esri Leaflet
↓
Esri Leaflet Vector
↓
config.js
↓
your app
```

---

## I see weird Console errors from Gmail, Acrobat, or an extension

Errors mentioning browser extensions, injected scripts, Gmail, Acrobat, autoscroll, or similar tools may not come from your app.

Check the source file beside the error.

Focus first on errors from files such as:

```text
main.js
app.js
map.js
ui.js
state.js
data.js
```

If unsure, try an Incognito/InPrivate window with extensions disabled.

---

# GeoJSON and Data Problems

## My GeoJSON request returns `404`

Check your `dataUrl`.

Prepared city files use paths such as:

```js
"./data/cities/kansas-city.geojson";
"./data/cities/chicago.geojson";
"./data/cities/seattle.geojson";
"./data/cities/washington-dc.geojson";
```

Check spelling, capitalization, and folder location.

---

## GeoJSON loads but no markers appear

The workshop expects a GeoJSON `FeatureCollection`:

```json
{
  "type": "FeatureCollection",
  "features": []
}
```

Prepared features are points with these properties:

```text
id
name
category
description
```

Inspect one feature and compare it with the prepared data.

---

## My data appears in the wrong part of the world

Check coordinate order.

Leaflet methods like `setView()` commonly use:

```text
[latitude, longitude]
```

GeoJSON coordinates use:

```text
[longitude, latitude]
```

Kansas City GeoJSON should look roughly like:

```json
"coordinates": [-94.58, 39.10]
```

If your data appears in an ocean, coordinate order is a prime suspect.

---

## Popups are empty or say `undefined`

The core workshop expects:

```js
feature.properties.name;
feature.properties.category;
feature.properties.description;
```

If you're using your own data, inspect its property names.

For the easiest core path, use:

```text
id
name
category
description
```

---

# Sidebar and Selection Problems

## Sidebar is empty but markers appear

By Step 03, the app should render the same data into both views.

Check that your HTML contains:

```html
<ul id="place-list" class="place-list" aria-label="Historic places"></ul>
```

and JavaScript finds it with:

```js
const placeList = document.querySelector("#place-list");
```

Also verify `renderList(...)` is called after the data loads.

---

## Sidebar appears but the map disappears

This often happens when moving from the full-page map to the Step 03 grid.

Verify:

```css
.app-shell {
  height: 100vh;
  display: grid;
  grid-template-columns: minmax(300px, 380px) 1fr;
}
```

and:

```css
.map {
  height: 100%;
  min-height: 100vh;
}
```

---

## Selection is not working

Use this table first:

| Problem                       | Check                                      |
| ----------------------------- | ------------------------------------------ |
| Card does nothing             | `data-place-id` and sidebar click listener |
| Marker does not select card   | feature ID and `layerById`                 |
| Card does not move map        | card should use default `moveMap: true`    |
| Marker moves map unexpectedly | marker click should use `moveMap: false`   |
| Selected card does not scroll | card ID matches feature ID                 |

The core connection is:

```text
feature.properties.id
        ↓
Leaflet layer + sidebar card
```

If IDs do not match, the two views cannot synchronize.

---

## Marker click does not highlight the sidebar

Step 04 should create:

```js
const layerById = new Map();
```

and register each layer:

```js
const id = String(feature.properties.id);
layerById.set(id, layer);
```

Marker clicks should call:

```js
selectPlace(id, {
  moveMap: false,
});
```

---

## Sidebar card does nothing

Each card needs a `data-place-id`.

The delegated click listener should find the clicked card and call:

```js
selectPlace(card.dataset.placeId);
```

---

# Filtering Problems

## Filtering does nothing

By Step 05, check that:

```js
state.category;
```

exists and that the filter change event eventually calls:

```js
render();
```

The core pattern is:

```text
state.places + state.category
              ↓
       visibleFeatures()
              ↓
        map + sidebar
```

---

## Every category shows zero results

The `<option>` values must match the GeoJSON category strings exactly.

Check:

```text
spelling
capitalization
spaces
punctuation
```

---

## Map and sidebar disagree after filtering

Both views must receive the same array:

```js
function render() {
  const features = visibleFeatures();

  renderMap(features);
  renderList(features);
}
```

Do not filter the map and sidebar separately.

---

## Filtering leaves a strange selected item

The core Step 05 behavior clears selection when the category changes.

Before Step 07:

```js
state.selectedId = null;
```

In Step 07:

```js
setSelectedId(null);
```

Then call:

```js
render();
```

---

# Loading, Error, and Responsive Problems

## I cannot see the loading message

That can be normal.

The local GeoJSON file is small and may load almost instantly.

The important part is that `loadPlaces()` sets a loading message before the request starts.

If you want to see it more clearly, use DevTools Network throttling.

---

## Error handling does not show a message

By Step 06, `loadPlaces()` should use `try...catch`.

To test it, temporarily break the data URL, refresh, then restore the correct path.

---

## Empty results still say `0 historic places`

By Step 06, `render()` should distinguish between zero and nonzero results:

```js
if (features.length === 0) {
  setStatus("No places match this filter.");
} else {
  setStatus(`${features.length} historic places`);
}
```

---

## Mobile layout does not change

The Step 06 stylesheet includes a media query at:

```text
760px
```

Resize below that width or use device emulation in DevTools.

If the layout changes but the map disappears, check the map height again.

---

# Step 07 Module Problems

## `Cannot use import statement outside a module`

Your script must be:

```html
<script type="module" src="./js/app.js"></script>
```

The `type="module"` is required.

---

## A module returns `404`

Inside:

```text
js/app.js
```

the other modules are in the same folder.

Use:

```js
"./state.js";
"./data.js";
"./map.js";
"./ui.js";
```

not:

```js
"./js/state.js";
```

---

## Missing export error

If the Console says a module:

```text
does not provide an export named ...
```

compare the import and export names exactly.

JavaScript module names are case-sensitive.

---

## GeoJSON path broke after moving JavaScript into `js/`

Keep the city data paths as:

```js
"./data/cities/kansas-city.geojson";
```

Do not automatically change them to:

```js
"../data/cities/kansas-city.geojson";
```

The fetch path is resolved from the page URL, not from the JavaScript file's folder.

---

## Map loads but marker clicks do nothing

Check the callback passed from `app.js` into `initMap()`.

`map.js` should report the feature ID back through that callback when a marker is clicked.

---

## Sidebar cards do nothing

Check that `app.js` binds the sidebar callback and that `ui.js` reports the clicked card's `data-place-id`.

---

## Filtering does nothing after refactor

Check all three pieces:

```text
ui.js reports category change
        ↓
app.js updates state
        ↓
render() updates map + UI
```

If one connection is missing, filtering stops.

---

# Custom Data Problems

## My own dataset breaks later steps

The core workshop assumes point features with:

```text
id
name
category
description
```

If custom data breaks selection or filtering:

1. Switch back to a prepared city dataset.
2. Complete the core workshop.
3. Return to your own data afterward.

---

## Lines or polygons break selection

The core selection behavior is designed for points.

It uses:

```js
selectedLayer.getLatLng();
```

Lines and polygons behave differently.

Use the prepared point datasets for the core path and return to non-point geometry in the optional material.

---

## CORS error with my own remote data

If the workshop's local files work but a remote dataset fails with CORS, the remote server may not allow browser requests from your app.

That is an external-data issue, not necessarily a City Explorer bug.

For the core workshop, switch back to the prepared local GeoJSON.

---

# Checkpoint Recovery

If you changed too many things or debugging is eating workshop time, use a checkpoint.

The progression is:

```text
00-start
↓
01-map
↓
02-data
↓
03-ui
↓
04-selection
↓
05-filtering
↓
06-polish
↓
07-complete
```

Each checkpoint represents the **finished state of that step**.

For example:

```text
checkpoints/03-ui
```

is the completed Step 03 and a safe starting point for Step 04.

---

## Before replacing your work

If you want to keep your broken version:

```text
workshop-work-broken
```

Then create a fresh:

```text
workshop-work
```

from the appropriate checkpoint.

Keep your existing:

```text
config.js
```

when switching checkpoints.

---

## Still stuck?

Use this order:

```text
1. Save files
2. Refresh
3. Check Console
4. Check Network
5. Check file paths
6. Check map height
7. Compare with checkpoint
8. Ask for help
9. Switch to checkpoint and keep moving
```

A workshop bug should not cost you the next three exercises.

---

# The Most Important Recovery Rule

If you're learning something from the bug, keep debugging.

If you're only losing workshop time:

## Use the checkpoint.

You can investigate the original problem later.
