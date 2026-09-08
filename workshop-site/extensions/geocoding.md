# 🧩 ArcGIS Geocoding

## Goal

Add address and place search to the finished City Explorer.

By the end of this extension, you'll have:

- an ArcGIS geocoding search control
- search suggestions
- search-result markers
- map navigation to searched places
- a second ArcGIS location service working inside the same Leaflet application

This extension uses **Esri Leaflet Geocoder** to connect Leaflet to the ArcGIS Geocoding service.

---

# Starting Point

Start from:

```text
checkpoints/08-favorites
```

Copy that completed app into:

```text
extensions/geocoding/
```

This extension is optional.

It does not change any of the core workshop checkpoints.

---

# 👀 Watch First - What Is Geocoding?

The City Explorer already knows about the places inside our local GeoJSON.

Those places are part of our application dataset:

```text
local GeoJSON
      ↓
state.places
      ↓
map + sidebar
```

Geocoding solves a different problem.

It lets a user type something like:

```text
Kansas City Convention Center
```

or:

```text
301 W 13th St, Kansas City, MO
```

and turn that text into a geographic location.

The flow looks like:

```text
user types a place or address
          ↓
ArcGIS Geocoding service
          ↓
matching locations
          ↓
latitude + longitude
          ↓
Leaflet map
```

So this extension adds a new kind of interaction without changing the City Explorer dataset itself.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "What Does Geocoding Do?",
  "prompt": "What is geocoding helping us do in this extension?",
  "options": [
    {
      "value": "A",
      "label": "Turn an address or place name into a geographic location."
    },
    {
      "value": "B",
      "label": "Filter our local GeoJSON by category."
    },
    {
      "value": "C",
      "label": "Create a new Leaflet basemap."
    },
    {
      "value": "D",
      "label": "Download our historic-place dataset."
    }
  ],
  "correct": "A",
  "success": "Correct! Geocoding converts text such as addresses and place names into locations we can use on the map.",
  "hint": "Think about the relationship between a place name and coordinates."
}
```

---

# 👀 Watch - Leaflet Needs a Bridge

Leaflet itself gives us:

```text
map
markers
layers
popups
events
controls
```

But Leaflet does not provide an address-search service.

For this extension, the pieces are:

```text
Leaflet
+
Esri Leaflet Geocoder
+
ArcGIS Geocoding service
```

Esri Leaflet Geocoder gives us the Leaflet-friendly search control.

ArcGIS provides the location-search service behind it.

---

# 🛠️ Your Turn 1 - Load Esri Leaflet Geocoder CSS

Open:

```text
index.html
```

Inside `<head>`, find the existing Leaflet stylesheet:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>
```

Immediately after it, add:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/esri-leaflet-geocoder@3.1.7/dist/esri-leaflet-geocoder.css"
/>
```

Your stylesheet section should now include:

```html
<!-- Leaflet -->
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<!-- Esri Leaflet Geocoder -->
<link
  rel="stylesheet"
  href="https://unpkg.com/esri-leaflet-geocoder@3.1.7/dist/esri-leaflet-geocoder.css"
/>

<!-- App styles -->
<link rel="stylesheet" href="./styles.css" />
```

The CSS controls the appearance of the search box and suggestion interface.

Nothing new will appear yet.

We still need the JavaScript.

---

# 🛠️ Your Turn 2 - Load Esri Leaflet Geocoder JavaScript

Near the bottom of:

```text
index.html
```

find the existing mapping scripts.

Add the Geocoder script after Esri Leaflet Vector and before your local configuration:

```html
<!-- Esri Leaflet Geocoder -->
<script src="https://unpkg.com/esri-leaflet-geocoder@3.1.7/dist/esri-leaflet-geocoder.js"></script>
```

Your script order should look like:

```html
<!-- Leaflet -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Esri Leaflet -->
<script src="https://unpkg.com/esri-leaflet@3.0.19/dist/esri-leaflet.js"></script>

<!-- Esri Leaflet Vector -->
<script src="https://unpkg.com/esri-leaflet-vector@4.3.2/dist/esri-leaflet-vector.js"></script>

<!-- Esri Leaflet Geocoder -->
<script src="https://unpkg.com/esri-leaflet-geocoder@3.1.7/dist/esri-leaflet-geocoder.js"></script>

<!-- Local workshop configuration -->
<script src="./config.js"></script>

<!-- App -->
<script type="module" src="./js/app.js"></script>
```

Save and refresh.

The search control still will not appear yet.

We have loaded the plugin, but we have not created the control.

---

```activity
{
  "type": "reveal",
  "eyebrow": "🔮 Predict It",
  "title": "Why Is Nothing Visible Yet?",
  "prompt": "We loaded the Geocoder CSS and JavaScript. Why isn't there a search box on the map yet?",
  "buttonLabel": "Reveal the answer",
  "answer": "Loading a library only makes its functionality available. We still need to create a geosearch control and add it to the Leaflet map."
}
```

---

# 🛠️ Your Turn 3 - Create a Layer for Search Results

Open:

```text
js/map.js
```

Near the existing map variables:

```js
let map;
let placesLayer;
```

add:

```js
let searchResultsLayer;
```

Your map module will now manage:

```text
placesLayer
↓
City Explorer GeoJSON

searchResultsLayer
↓
locations returned by geocoding
```

These layers serve different purposes.

Our historic places are application data.

Search-result markers are temporary locations created by user searches.

---

# 🛠️ Your Turn 4 - Add the Geocoding Control

Still in:

```text
js/map.js
```

Add this exported function:

```js
export function addGeocoding(apiKey) {
  const searchControl = L.esri.Geocoding.geosearch({
    position: "topright",
    placeholder: "Search addresses or places",
    useMapBounds: false,

    providers: [
      L.esri.Geocoding.arcgisOnlineProvider({
        apikey: apiKey,
      }),
    ],
  }).addTo(map);

  searchResultsLayer = L.layerGroup().addTo(map);

  searchControl.on("results", (data) => {
    searchResultsLayer.clearLayers();

    for (const result of data.results) {
      const marker = L.marker(result.latlng);

      marker.bindPopup(result.text);

      marker.addTo(searchResultsLayer);
    }
  });
}
```

There are several pieces working together here.

First:

```js
L.esri.Geocoding.geosearch();
```

creates the Leaflet search control.

Then:

```js
L.esri.Geocoding.arcgisOnlineProvider();
```

connects that control to the ArcGIS Geocoding service.

The API key gives the application permission to use that service.

---

# 🕵️ Look at the Search Options

Inside:

```js
L.esri.Geocoding.geosearch({
```

we configure:

```js
position: "topright",
```

This tells Leaflet where to place the control.

We also use:

```js
placeholder:
  "Search addresses or places",
```

That controls the text shown before the user starts typing.

And:

```js
useMapBounds: false,
```

means the current map extent does not restrict the search.

---

# 👀 Watch - Search Results Are Events

The search control does more than display an input.

It also emits events.

Our code listens for:

```js
searchControl.on(
  "results",
  ...
);
```

When a search finishes, the event gives us:

```js
data.results;
```

Each result can contain information such as:

```text
display text
coordinates
location
```

We use:

```js
result.latlng;
```

to place a Leaflet marker.

We use:

```js
result.text;
```

for the popup.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Where Do Search Results Go?",
  "prompt": "Why do we use searchResultsLayer instead of adding search markers to placesLayer?",
  "options": [
    {
      "value": "A",
      "label": "Search results and historic places represent different kinds of application data."
    },
    {
      "value": "B",
      "label": "Leaflet only allows one marker per layer."
    },
    {
      "value": "C",
      "label": "placesLayer cannot display geographic data."
    },
    {
      "value": "D",
      "label": "Geocoding does not return coordinates."
    }
  ],
  "correct": "A",
  "success": "Correct! Keeping the layers separate makes their responsibilities clearer.",
  "hint": "Think about whether a searched address should suddenly become one of our historic-place records."
}
```

---

# 🛠️ Your Turn 5 - Import Geocoding Into `app.js`

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
addGeocoding,
```

For example:

```js
import {
  initMap,
  renderMap,
  fitMapToPlaces,
  highlightMapPlace,
  addGeocoding,
} from "./map.js";
```

Now `app.js` can ask the map module to add search.

---

# 🛠️ Your Turn 6 - Read the Workshop API Key

Still in:

```text
js/app.js
```

Find the map initialization:

```js
initMap(appConfig, (id) => {
  selectPlace(id, {
    moveMap: false,
  });
});
```

Immediately after it, add:

```js
const apiKey = window.APP_CONFIG?.arcgisApiKey;

if (apiKey) {
  addGeocoding(apiKey);
}
```

This reuses the same workshop configuration pattern we already use for the ArcGIS vector basemap.

The application looks for:

```js
window.APP_CONFIG.arcgisApiKey;
```

If a key exists:

```text
API key exists
      ↓
addGeocoding(apiKey)
      ↓
search control appears
```

If a key does not exist, we do not create the search control.

---

# ✅ Checkpoint 1 - Search Control Appears

Save everything and refresh.

You should now see a search control in the:

```text
top-right
```

of the map.

It should display:

```text
Search addresses or places
```

If the search control appears, the Geocoder plugin is loaded and your `addGeocoding()` function is running.

---

# 🛠️ Your Turn 7 - Search for a Place

Try searching for:

```text
Kansas City Convention Center
```

Start typing slowly.

You should see search suggestions appear.

Choose a result.

The map should move to the selected location.

A marker should appear.

Click the marker.

Its popup should display the result text.

Try another search:

```text
Union Station Kansas City
```

Your previous search-result markers should disappear because we call:

```js
searchResultsLayer.clearLayers();
```

before adding the new results.

---

```activity
{
  "type": "reveal",
  "eyebrow": "🕵️ Trace It",
  "title": "Follow One Search",
  "prompt": "Trace what happens after the user searches for Union Station.",
  "buttonLabel": "Reveal the flow",
  "answer": "typed text → ArcGIS Geocoding service → search results → results event → result.latlng → Leaflet marker → searchResultsLayer"
}
```

---

# 👀 Watch - This Search Is Not Filtering

We now have two very different kinds of search-like interactions.

Our category filter works with:

```text
data already inside state.places
```

Geocoding searches:

```text
a location service outside our dataset
```

Compare them:

```text
CATEGORY FILTER

state.places
     ↓
visibleFeatures()
     ↓
map + sidebar
```

versus:

```text
GEOCODING

user text
     ↓
ArcGIS Geocoding
     ↓
location
     ↓
map
```

A geocoding result does not automatically become:

```text
state.places
```

It is simply another geographic location displayed on the map.

---

# 🛠️ Your Turn 8 - Try Different Searches

Try several kinds of searches.

## Address

```text
301 W 13th St, Kansas City, MO
```

## Landmark

```text
Union Station Kansas City
```

## City

```text
Chicago, IL
```

## Place

```text
Kansas City Convention Center
```

Notice that geocoding can work with more than exact street addresses.

The service interprets location-oriented text and returns possible matches.

---

# ✅ Check Your Work

Verify:

1. The City Explorer loads normally.
2. Historic-place markers still appear.
3. Favorites still work.
4. The geocoding search control appears.
5. Typing produces suggestions.
6. Selecting a suggestion moves the map.
7. A search-result marker appears.
8. Clicking the marker opens a popup.
9. A second search clears the previous search markers.
10. Filtering the City Explorer still works.
11. There are no unexpected errors from your application code.

---

# 🐛 Troubleshooting

## No Search Control Appears

First, make sure both Geocoder files are loaded.

CSS:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/esri-leaflet-geocoder@3.1.7/dist/esri-leaflet-geocoder.css"
/>
```

JavaScript:

```html
<script src="https://unpkg.com/esri-leaflet-geocoder@3.1.7/dist/esri-leaflet-geocoder.js"></script>
```

The JavaScript file must load before:

```html
<script type="module" src="./js/app.js"></script>
```

---

## Check the Plugin in the Console

Open the browser console and enter:

```js
L.esri.Geocoding;
```

You should get an object.

Then try:

```js
L.esri.Geocoding.geosearch;
```

You should get a function.

If either is:

```text
undefined
```

the Geocoder JavaScript did not load correctly.

---

## The Search Control Still Does Not Appear

Check:

```js
window.APP_CONFIG?.arcgisApiKey;
```

If that returns:

```text
undefined
```

your application will skip:

```js
addGeocoding(apiKey);
```

Make sure:

```text
config.js
```

exists and contains the workshop API key.

---

## Search Appears but Requests Fail

Open:

```text
DevTools
→
Console
```

and:

```text
DevTools
→
Network
```

Look for authorization or request errors.

The API key needs permission to use the geocoding service.

---

## The Map Works but Search Does Not

That can happen.

Remember:

```text
ArcGIS vector basemap
```

and:

```text
ArcGIS Geocoding service
```

are different services.

A working basemap proves that the map itself is okay.

It does not automatically prove that geocoding is configured correctly.

---

# 🕵️ Look at the Result Object

Temporarily add:

```js
console.log(data.results);
```

inside:

```js
searchControl.on(
  "results",
  (data) => {
```

Search again.

Look at the result objects in the console.

You should see information including the location used by:

```js
result.latlng;
```

and the display text used by:

```js
result.text;
```

Remove the `console.log()` when you're finished exploring.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Does Search Change state.places?",
  "prompt": "After searching for an address, does that location automatically become part of state.places?",
  "options": [
    {
      "value": "A",
      "label": "Yes. Every search result becomes a historic place."
    },
    {
      "value": "B",
      "label": "No. Search results are displayed separately from the City Explorer dataset."
    },
    {
      "value": "C",
      "label": "Yes, but only after filtering."
    },
    {
      "value": "D",
      "label": "Only if the result has a popup."
    }
  ],
  "correct": "B",
  "success": "Correct! Our search results live in their own Leaflet layer and do not change the City Explorer dataset.",
  "hint": "Look at searchResultsLayer and state.places."
}
```

---

# ✅ Final Checkpoint - Geocoding Works

Before finishing, verify:

- [ ] The core City Explorer still works.
- [ ] The ArcGIS basemap still loads.
- [ ] The Geocoder control appears.
- [ ] Search suggestions appear.
- [ ] Selecting a result moves the map.
- [ ] Search-result markers appear.
- [ ] Search-result popups work.
- [ ] Repeated searches clear previous result markers.
- [ ] Favorites still work.
- [ ] Category filtering still works.
- [ ] Search results remain separate from `state.places`.
- [ ] There are no unexpected errors from your application code.

---

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "What Did We Add?",
  "prompt": "How is ArcGIS being used differently here compared with the core City Explorer?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "The core application uses ArcGIS for the vector basemap. This extension adds another ArcGIS capability: the Geocoding service. Esri Leaflet Geocoder connects that service to our existing Leaflet application."
}
```

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

# ✨ Make It Yours

If your extension is working, customize it.

## Change the Placeholder

Find:

```js
placeholder:
  "Search addresses or places",
```

Try:

```js
placeholder:
  "Where do you want to go?",
```

or:

```js
placeholder:
  "Find a place",
```

---

## Move the Search Control

Find:

```js
position: "topright",
```

Try another Leaflet control position:

```text
topleft
topright
bottomleft
bottomright
```

For example:

```js
position: "topleft",
```

---

## Change the Result Marker

Right now we use:

```js
L.marker(result.latlng);
```

Try using:

```js
L.circleMarker(result.latlng, {
  radius: 9,
  weight: 3,
  fillOpacity: 1,
});
```

Now the search result visually matches the kinds of Leaflet layers we used elsewhere in the workshop.

---

## Change the Popup Text

Right now:

```js
marker.bindPopup(result.text);
```

You could build ordinary DOM elements instead, just like we did for the City Explorer popups.

<!-- OPTIONAL-END -->

---

<!-- OPTIONAL-START: 🚀 Challenge - Clear Search Results -->

# 🚀 Challenge - Add a Clear Search Button

Right now, a new search clears the previous result markers.

Can you also let the user clear them manually?

The map module already has:

```js
searchResultsLayer;
```

A possible helper could be:

```js
export function clearSearchResults() {
  searchResultsLayer?.clearLayers();
}
```

Then add an ordinary HTML button and connect it through the same module pattern we used throughout the workshop:

```text
ui.js
↓
reports button click

app.js
↓
coordinates behavior

map.js
↓
clears search layer
```

<!-- OPTIONAL-END -->

---

<!-- OPTIONAL-START: 🚀 Challenge - Use the Search Result -->

# 🚀 Challenge - Connect Search to the Application

Right now a search result is temporary map content.

What else could you do with it?

Ideas:

```text
display the searched location in the sidebar

show its latitude and longitude

use it as the starting point for another operation

compare it with the selected City Explorer place

calculate nearby places

use it later for routing
```

This is where geocoding becomes more than a search box.

It becomes another source of geographic state for your application.

<!-- OPTIONAL-END -->

---

# 🎉 Extension Complete

You just added another ArcGIS location capability to the same Leaflet application.

The core map already used:

```text
Leaflet
+
Esri Leaflet Vector
+
ArcGIS vector basemap
```

Now it can also use:

```text
Leaflet
+
Esri Leaflet Geocoder
+
ArcGIS Geocoding service
```

The complete search flow is:

```text
user enters text
       ↓
Geocoder control
       ↓
ArcGIS Geocoding service
       ↓
search result
       ↓
latitude + longitude
       ↓
Leaflet marker
```

And our original City Explorer still works beside it:

```text
local GeoJSON
       ↓
application state
       ↓
map + sidebar
```

That is an important application pattern.

One Leaflet application can combine:

```text
local geographic data
+
hosted basemaps
+
location services
+
ordinary web UI
```

without replacing the architecture we already built.

---

# Explore More

Return to **Explore More** in the workshop navigation to try another extension.
