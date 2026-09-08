# City Explorer Customization Plan

This document is the master plan for optional customization, challenges, and extensions throughout the **Build Your Own City Explorer** workshop.

The core workshop follows one stable path using Kansas City historic-place data. Every attendee should be able to complete that path without doing any optional customization.

Optional activities give attendees opportunities to make the application their own without preventing them from rejoining the main workshop.

---

# Workshop Customization Philosophy

Each workshop section can include up to four levels of activity.

## Core

The required workshop path.

Everyone can follow the same instructions and use the same checkpoint if they need to catch up.

## ✨ Make It Yours

Small, safe customizations that usually take about 2–5 minutes.

These should:

- require very little new code
- build directly on code attendees just wrote
- be easy to undo
- let attendees personalize their application
- avoid introducing major new concepts

Attendees should be able to skip these without affecting later exercises.

## 🚀 Challenge

Optional exercises for attendees who finish early or want more control.

These may require:

- a little independent problem solving
- modifying multiple pieces of code
- combining concepts from earlier exercises
- reading Leaflet or ArcGIS documentation

Challenges should still build on the current workshop architecture.

## 🧩 Extension

Larger optional features that are not required for the core City Explorer.

Extensions may introduce:

- additional Leaflet plugins
- additional ArcGIS services
- new data sources
- new geometry types
- new UI patterns
- additional state
- more advanced JavaScript

Extensions should live separately from the canonical workshop checkpoints whenever possible.

---

# Important Workshop Rule

The canonical checkpoints remain the safe path:

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
07-refactor
↓
08-favorites
```

Optional experimentation should never change what each canonical checkpoint represents.

If an attendee experiments and gets stuck, they can use the next checkpoint and immediately rejoin the main workshop.

Kansas City remains the canonical/default application used for:

- instructor demos
- screenshots
- checkpoints
- required code
- troubleshooting
- completed solution

Prepared alternatives allow attendees to personalize without changing the architecture.

---

# Levels of Freedom

## Level 1: Follow Along Exactly

Use:

- Kansas City
- default ArcGIS basemap
- prepared historic-place dataset
- provided styling
- provided categories

This is the safest path.

## Level 2: Safe Personalization

Choose things such as:

- another prepared city
- another basemap
- different marker styling
- different card content
- different selection appearance
- different filter defaults
- different visual theme

The architecture stays the same.

## Level 3: Bring Your Own Data

Use:

- your own GeoJSON
- another public dataset
- lines
- polygons
- multiple layers
- another city
- another theme

Attendees may need to adapt their properties to the workshop data contract.

## Level 4: Extend the Application

Add completely new capabilities such as:

- geocoding
- Feature Layers
- drawing
- clustering
- geolocation
- search
- measurement
- routing
- exporting data

---

# Workshop Data Contract

The canonical City Explorer expects each feature to contain:

```text
id
name
category
description
geometry
```

Example:

```json
{
  "type": "Feature",
  "properties": {
    "id": "kc-001",
    "name": "Example Place",
    "category": "Culture & Community",
    "description": "An example historic place."
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-94.58, 39.1]
  }
}
```

The current prepared categories are:

- Culture & Community
- Education & Religion
- Civic & Institutional
- Commercial & Industrial
- Residential

These categories are workshop classifications rather than necessarily official classifications from the source agencies.

Leaflet itself does **not** require these exact properties.

They exist because later City Explorer exercises expect a predictable application data contract.

---

# 01 - Build the Map

## Core

Attendees:

- initialize a Leaflet map
- center it on Kansas City
- set an initial zoom
- add an ArcGIS vector basemap with Esri Leaflet Vector
- learn the difference between the map object and map layers

Canonical result:

```text
Leaflet
+
ArcGIS vector basemap
```

Checkpoint:

```text
01-map
```

---

## ✨ Make It Yours: Choose Your City

Prepared cities:

```text
Kansas City
Chicago
Seattle
Washington, DC
```

Default:

```js
const CITY = "kansas-city";
```

Possible alternatives:

```js
const CITY = "chicago";
```

```js
const CITY = "seattle";
```

```js
const CITY = "washington-dc";
```

---

## ✨ Make It Yours: Change the Starting Zoom

Try:

```js
zoom: 10;
```

```js
zoom: 12;
```

```js
zoom: 14;
```

Teaching point:

```text
smaller zoom number
=
larger geographic area

larger zoom number
=
more local detail
```

---

## ✨ Make It Yours: Start Somewhere Else

Change:

```js
center: [39.0997, -94.5786];
```

to coordinates for:

- your hometown
- your neighborhood
- your favorite city
- somewhere you want to visit
- the conference venue

This is also a chance to reinforce:

```text
Leaflet setView coordinates:
[latitude, longitude]
```

while GeoJSON coordinates later use:

```text
[longitude, latitude]
```

---

## ✨ Make It Yours: Choose a Basemap

Allow attendees to choose from several current ArcGIS basemap styles.

Potential categories:

- Light Gray
- Streets
- Navigation
- Outdoor
- Imagery
- dark styles

Also introduce the ArcGIS Open basemap family, which uses open geographic data.

Exact supported style IDs should be verified against the current ArcGIS documentation when `01-map.md` is finalized.

---

## ✨ Make It Yours: Move the Zoom Controls

Leaflet allows control positioning.

Possible positions:

```text
topleft
topright
bottomleft
bottomright
```

---

## ✨ Make It Yours: Change Map Interaction

Experiment with options such as:

```js
scrollWheelZoom: false;
```

Other possibilities:

- disable double-click zoom
- set minimum zoom
- set maximum zoom
- disable dragging
- disable keyboard navigation

These are tiny experiments, not recommended defaults.

---

# 🚀 01 Challenges

## Basemap Switcher

Create multiple basemap layers and use:

```js
L.control.layers();
```

Allow switching between several styles without editing code.

---

## City Selector

Create a `<select>` containing:

```text
Kansas City
Chicago
Seattle
Washington, DC
```

Changing the city could call:

```js
map.setView(...)
```

Later this could also reload that city's dataset.

---

## Light/Dark Map Toggle

Create a button that changes between:

```text
light basemap
↔
dark basemap
```

---

## URL-Controlled Map

Read values such as:

```text
?city=seattle
```

or:

```text
?lat=47.6062&lng=-122.3321&zoom=13
```

from `URLSearchParams`.

---

## Add a Scale Control

Explore additional built-in Leaflet controls.

---

## Add a Custom Leaflet Control

Build a tiny Leaflet control containing:

- workshop title
- Reset View button
- city name
- basemap name

---

# 02 - Load Geographic Data

## Core

Attendees:

- load local GeoJSON with `fetch()`
- store features in `state.places`
- create an `L.geoJSON()` layer
- render point features as circle markers
- create popups
- fit the map to the loaded features

Canonical result:

```text
basemap
+
historic-place GeoJSON
+
Leaflet features
```

Checkpoint:

```text
02-data
```

---

# ✨ Make It Yours: Switch Datasets

Prepared city files:

```text
data/cities/kansas-city.geojson
data/cities/chicago.geojson
data/cities/seattle.geojson
data/cities/washington-dc.geojson
```

Because all four follow the same contract, application logic does not need to change.

This demonstrates an important architecture principle:

> The application does not need to know where the data originated as long as the data honors the expected contract.

---

# ✨ Make It Yours: Change Marker Size

Experiment with:

```js
radius: 5;
```

```js
radius: 8;
```

```js
radius: 12;
```

---

# ✨ Make It Yours: Change Marker Styling

Experiment with:

```js
weight;
opacity;
fillOpacity;
```

Potential later options:

```js
color;
fillColor;
```

---

# ✨ Make It Yours: Change Popup Content

Canonical popup fields:

```text
name
category
description
```

Attendees can:

- remove description
- reorder properties
- add address
- add designation date
- add architect
- add source information
- change the layout
- emphasize the category
- add a link when the data contains one

---

# ✨ Make It Yours: Build a Tiny Dataset Yourself

Example:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "favorite-1",
        "name": "My Favorite Place",
        "category": "Favorites",
        "description": "A place I wanted to put on the map."
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-94.58, 39.1]
      }
    }
  ]
}
```

Important GeoJSON rule:

```text
[longitude, latitude]
```

not:

```text
[latitude, longitude]
```

---

# Bring Your Own GeoJSON

An attendee can place their own file in the project:

```text
data/my-data.geojson
```

and change:

```js
dataUrl: "./data/cities/kansas-city.geojson";
```

to:

```js
dataUrl: "./data/my-data.geojson";
```

Any valid GeoJSON can potentially be displayed by Leaflet.

However, later City Explorer labs assume:

```text
id
name
category
description
```

Attendees using custom data may need to normalize their property names.

---

# Finding Your Own Data

Potential places to search:

- city open-data portals
- county GIS portals
- state GIS portals
- ArcGIS Hub
- Data.gov
- university/research repositories
- GitHub
- organizational data portals

Useful formats attendees may encounter:

```text
GeoJSON
CSV
ArcGIS Feature Service
Shapefile
KML
```

Recommended easiest path during this workshop:

```text
GeoJSON
```

If they find a Feature Service:

```text
→ ArcGIS Feature Layer extension
```

If they find a CSV with coordinates:

```text
→ CSV-to-GeoJSON extension
```

If they find a shapefile:

```text
→ convert it before using it in this workshop
```

---

# Geometry Exploration

The canonical dataset contains points.

GeoJSON may also contain:

```text
Point
MultiPoint
LineString
MultiLineString
Polygon
MultiPolygon
GeometryCollection
```

Leaflet's GeoJSON layer can handle more than point data.

---

## ✨ Try Lines

Example datasets:

- bike routes
- walking routes
- rivers
- streets
- transit lines
- trails

Potential styling:

```js
style(feature) {
  return {
    weight: 4,
    opacity: 0.8,
  };
}
```

---

## ✨ Try Polygons

Example datasets:

- parks
- neighborhoods
- historic districts
- city council districts
- planning areas
- campuses

Potential styling:

```js
style(feature) {
  return {
    weight: 2,
    fillOpacity: 0.25,
  };
}
```

---

# Prepared Geometry Examples

Potential structure:

```text
data/
├── cities/
│
└── examples/
    ├── README.md
    ├── points.geojson
    ├── lines.geojson
    └── polygons.geojson
```

Prefer real public data when practical.

These should be optional examples and never replace the canonical datasets.

---

# 🚀 02 Challenges

## Load Two Data Layers

Examples:

```text
Historic Places + Parks
Historic Places + Bike Routes
Historic Places + Neighborhoods
```

---

## Style by Category

Use feature properties to control appearance.

Example concept:

```js
function markerStyle(feature) {
  switch (
    feature.properties.category
    // styles
  ) {
  }
}
```

---

## Style by Geometry Type

Use:

```js
feature.geometry.type;
```

to render points, lines, and polygons differently.

---

## Data Inspector

When clicking a feature, show:

```text
geometry type
coordinates
all properties
```

This could even use:

```js
JSON.stringify(feature.properties, null, 2);
```

inside a developer-oriented panel.

---

## Dynamically Generate Categories

Instead of hard-coding categories, derive them from:

```js
state.places;
```

---

# 03 - Build the Sidebar UI

## Core

Attendees:

- add the application shell
- create the sidebar
- create `renderList()`
- render one card per feature
- show the feature count
- render the same dataset into Leaflet and ordinary HTML

Core architecture:

```text
       state.places
         /      \
        /        \
      map        UI
```

Checkpoint:

```text
03-ui
```

---

# ✨ Make It Yours: Rename the Explorer

Examples:

```text
Kansas City Explorer
My City Explorer
Historic KC
Neighborhood Explorer
Coffee Explorer
Park Finder
Public Art Map
Conference Explorer
```

---

# ✨ Make It Yours: Rewrite the Intro

Let attendees explain their application's purpose.

---

# ✨ Make It Yours: Choose Card Fields

Possible fields:

```text
name
category
description
address
architect
year
designation date
neighborhood
status
website
```

---

# ✨ Make It Yours: Reorder Fields

Example:

```text
category
name
description
```

instead of:

```text
name
category
description
```

---

# ✨ Make It Yours: Compact Cards

Show only:

```text
name
category
```

---

# ✨ Make It Yours: Detailed Cards

Add more metadata when available.

---

# ✨ Make It Yours: Category Badges

Turn category into a badge/chip.

Example:

```text
[ Residential ]
```

---

# ✨ Make It Yours: Customize Layout

Experiment with:

- sidebar width
- card spacing
- border radius
- card background
- typography
- header size
- list density

---

# 🚀 03 Challenges

## Alphabetical Sorting

Sort features by:

```text
name
```

before rendering.

---

## Sort by Category

Group similar features together.

---

## Category Headings

Instead of one long list:

```text
Culture & Community
-------------------
Place
Place

Residential
-----------
Place
Place
```

---

## Category Counts

Display:

```text
Culture & Community: 12
Residential: 12
...
```

---

## Category Icons

Possible approaches:

- emoji
- inline SVG
- icon library
- Unicode symbols

---

## Compact/Detailed Toggle

Allow switching between:

```text
Compact
Detailed
```

views.

---

## Card Images

If a dataset has image URLs, display them safely in the cards.

This should remain optional because not all workshop datasets have imagery.

---

# 04 - Synchronize Selection

## Core

Attendees:

- add `selectedId`
- create `layerById`
- connect markers to data IDs
- respond to marker clicks
- respond to card clicks
- highlight the selected marker
- highlight the selected card
- open the popup
- scroll the matching card into view
- move the map when selection originates from the list

Core concept:

```text
             selectedId
             /        \
            /          \
         marker        card
```

Checkpoint:

```text
04-selection
```

---

# ✨ Make It Yours: Selected Marker Size

Try:

```js
radius: 9;
```

```js
radius: 12;
```

```js
radius: 15;
```

---

# ✨ Make It Yours: Selected Marker Style

Experiment with:

```text
weight
fillOpacity
color
fillColor
```

---

# ✨ Make It Yours: Selected Card Style

Experiment with:

- thicker border
- outline
- background
- bold title
- subtle scaling
- category badge styling

Avoid making important state rely on color alone.

---

# ✨ Make It Yours: Fly-To Zoom

Canonical:

```js
map.flyTo(selectedLayer.getLatLng(), 15);
```

Try different zoom levels.

---

# ✨ Make It Yours: Movement Style

Compare:

```js
map.flyTo(...)
```

with:

```js
map.setView(...)
```

---

# ✨ Make It Yours: Popup Behavior

Options:

- automatically open
- do not automatically open
- close when selection clears
- add more detail for selected places

---

# 🚀 04 Challenges

## Clear Selection Button

Add:

```text
Clear Selection
```

The button should:

- reset selected marker styling
- remove selected card styling
- clear `state.selectedId`

---

## Zoom to All Places

Add:

```text
Show All
```

that calls the existing bounds logic.

---

## Selected Place Detail Panel

Create a separate UI area:

```text
Selected Place

Name
Category
Description
```

---

## Previous / Next

Add:

```text
← Previous
Next →
```

to move through visible features.

---

## Random Place

Add:

```text
Surprise Me
```

Choose a random place and call the existing selection logic.

---

## Keyboard Navigation

Allow users to move between cards using keyboard interaction beyond default tab behavior.

---

## Share Selected Place

Reflect selection in the URL:

```text
?id=kc-017
```

---

# 05 - Filter Shared State

## Core

Attendees:

- add `category` to state
- add a category `<select>`
- derive `visibleFeatures()`
- create a shared `render()` function
- update map and sidebar from one filtered feature array

Architecture:

```text
state
  ↓
visibleFeatures()
  ↓
features
 /      \
map     list
```

Checkpoint:

```text
05-filtering
```

---

# ✨ Make It Yours: Default Filter

Instead of:

```js
category: "all";
```

start with another category.

---

# ✨ Make It Yours: Reorder Categories

Put the most useful categories first.

---

# ✨ Make It Yours: Rename Filter Labels

UI text can differ from stored values.

---

# ✨ Make It Yours: Use Your Own Categories

Attendees with custom data can replace the workshop categories entirely.

---

# ✨ Make It Yours: Category Styling

Render each category differently on the map.

This is a useful bridge between:

```text
data
and
visualization
```

---

# 🚀 05 Challenges

## Category Counts

Example:

```text
All categories (60)
Culture & Community (12)
Residential (12)
```

---

## Text Search

Add:

```html
<input type="search" placeholder="Search places..." />
```

Add:

```js
search: "";
```

to state.

Update `visibleFeatures()` to consider both:

```text
category
+
search
```

---

## Search More Than Names

Search:

```text
name
category
description
address
```

---

## Reset Filters

Add:

```text
Reset
```

that restores:

```js
category = "all";
search = "";
```

---

## Multiple Filters

Possible dimensions:

```text
category
neighborhood
status
date
type
```

---

## Toggle Categories Instead of a Select

Use:

- checkboxes
- chips
- buttons

to allow multiple categories at once.

---

## Filter From the Map

Clicking a category displayed in a popup could activate that category.

---

## Show Visible Count

Example:

```text
Showing 12 of 60 places
```

---

## No-Results Suggestions

Instead of only:

```text
No places match this filter.
```

offer:

```text
Clear filters
Try another category
```

---

# 06 - Polish and Resilience

## Core

Attendees add:

- loading state
- readable errors
- empty-result state
- responsive layout
- accessibility improvements

Checkpoint:

```text
06-polish
```

---

# ✨ Make It Yours: Loading Message

Examples:

```text
Loading places...
Finding cool places...
Getting the map ready...
Exploring Kansas City...
```

---

# ✨ Make It Yours: Empty Message

Examples:

```text
No places match this filter.
Nothing here yet.
Try another category!
```

---

# ✨ Make It Yours: Error Voice

Rewrite technical failures into messages appropriate for the application's audience.

---

# ✨ Make It Yours: Sidebar Width

Experiment with:

```css
300px
360px
420px
```

---

# ✨ Make It Yours: Mobile Order

Possible layouts:

```text
sidebar
map
```

or:

```text
map
sidebar
```

---

# ✨ Make It Yours: Theme

Ideas:

- light
- dark
- Kansas City-inspired
- conference-inspired
- company branding
- high contrast
- minimal
- colorful

---

# ✨ Make It Yours: Typography

Experiment with:

- font size
- heading hierarchy
- card density
- category text
- line height

---

# 🚀 06 Challenges

## Dark Mode

Possible approaches:

```css
@media (prefers-color-scheme: dark);
```

or an explicit theme toggle.

---

## Theme Toggle

Allow:

```text
Light
Dark
System
```

---

## Loading Indicator

Possibilities:

- spinner
- animated dots
- skeleton cards
- subtle progress indicator

---

## Collapsible Sidebar

Buttons:

```text
Hide List
Show List
```

Remember to call:

```js
map.invalidateSize();
```

if changing the map container dimensions.

---

## Mobile Map/List Toggle

Instead of stacking everything, use:

```text
Map
List
```

tabs/buttons.

---

## Toast Errors

Display failures in a temporary notification area.

---

## Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce);
```

especially for:

```text
flyTo
smooth scroll
animations
```

---

## High-Contrast Mode

Make state changes and text easier to perceive.

---

## Better Empty-State UI

Add a button:

```text
Show All Categories
```

when the current filter returns zero results.

---

# 07 - Refactor the Architecture

## Core

The finished one-file app becomes:

```text
js/
├── app.js
├── data.js
├── map.js
├── state.js
└── ui.js
```

Responsibilities:

```text
app.js
coordinates everything

data.js
loads data

map.js
Leaflet behavior

state.js
application state

ui.js
DOM behavior
```

Checkpoint:

```text
07-refactor
```

---

# ✨ Make It Yours: Cities Module

Move city configuration into:

```text
cities.js
```

---

# ✨ Make It Yours: Constants Module

Move values such as:

```text
default city
default basemap
selected zoom
```

into a single module.

---

# ✨ Make It Yours: Utility Module

Potential helpers:

```text
formatCategory()
normalizeId()
formatDescription()
```

---

# 🚀 07 Challenges

## Basemap Module

Separate:

```text
basemap selection
basemap creation
```

from general map logic.

---

## Selection Module

Separate selection behavior from general UI rendering.

---

## URL State

Persist:

```text
city
category
selectedId
basemap
```

in the URL.

Example:

```text
?city=seattle&category=Residential
```

---

## Plugin-Friendly Architecture

Experiment with:

```text
js/
├── core/
└── extensions/
```

Optional features could register themselves without modifying every core module.

---

# 08 - Add Favorites

## Core

Attendees:

- add `favoriteIds` to state
- create favorite helper functions
- add a Favorite button
- show favorite indicators on cards
- coordinate the interaction through `app.js`

Core concept:

```text
selected place
      ↓
favorite action
      ↓
state.favoriteIds
      ↓
UI updates
```

Checkpoint:

```text
08-favorites
```

---

# ✨ Make It Yours: Favorite Styling

Attendees can personalize:

- the favorite button text
- the favorite icon
- the favorite indicator on cards
- spacing and styling around favorite controls

Examples:

```text
☆ Save favorite
★ Favorite
♡ Save
♥ Saved
```

---

# 🚀 08 Challenge: Remember Favorites

Persist favorite IDs with:

```text
localStorage
```

Then restore them when the app loads.

This is optional because browser persistence is outside the core workshop path.

---

# Major Optional Extensions

The following are larger features that should live outside the canonical checkpoint path.

---

# 🧩 Extension: ArcGIS Geocoding

## Goal

Allow users to search for:

- addresses
- landmarks
- cities
- businesses
- places

using ArcGIS geocoding through Esri Leaflet.

Possible features:

- search box
- geocoder control
- navigate to result
- search-result marker
- clear result
- search near current map extent

Teaching concept:

```text
Leaflet application
+
ArcGIS location service
```

Priority:

```text
HIGH
```

This is one of the strongest additional Esri Leaflet examples for the workshop.

---

# 🧩 Extension: ArcGIS Feature Layer

## Goal

Load geographic features directly from an ArcGIS Feature Service.

Teaching concept:

```text
local GeoJSON
vs
hosted geographic service
```

Possible exercises:

- load a public Feature Layer
- add popups
- style features
- query features
- filter server-hosted features
- combine Feature Layer data with local GeoJSON

Priority:

```text
HIGH
```

A stable public Feature Layer needs to be selected and tested before the workshop.

---

# 🧩 Extension: Draw, Edit, and Export GeoJSON

## Goal

Allow users to create their own geographic data.

Possible drawing tools:

```text
marker
polyline
polygon
rectangle
```

Possible actions:

```text
draw
edit
delete
```

Store features in a Leaflet feature group.

Export:

```js
drawnItems.toGeoJSON();
```

Then:

```js
JSON.stringify(drawnItems.toGeoJSON(), null, 2);
```

Teaching concept:

> Geographic data is not something you can only download. You can create it too.

Priority:

```text
HIGH
```

---

# 🧩 Extension: Click to Add a Place

A simpler alternative to a full drawing plugin.

Flow:

```text
click map
↓
read coordinates
↓
enter name/category
↓
create GeoJSON Feature
↓
add to state.places
↓
render
```

This could be an excellent bridge between core Leaflet events and the drawing extension.

---

# 🧩 Extension: Marker Clustering

## Goal

Make large point datasets easier to explore.

Useful for:

- hundreds of places
- thousands of observations
- dense downtown datasets

Teaching concepts:

```text
visual aggregation
performance
Leaflet plugin ecosystem
```

Priority:

```text
MEDIUM-HIGH
```

---

# 🧩 Extension: Browser Geolocation

## Goal

Show the user's current location.

Possible UI:

```text
Locate Me
```

Possible features:

- location marker
- zoom to current location
- distance to selected place
- nearest places

Requires browser permission.

Priority:

```text
MEDIUM
```

---

# 🧩 Extension: Local Text Search

This searches the currently loaded City Explorer data.

This is different from ArcGIS geocoding.

Search fields could include:

```text
name
category
description
address
```

This may begin as a Step 05 challenge and later become a more polished extension.

---

# 🧩 Extension: Basemap Gallery

Build a polished custom UI instead of relying only on `L.control.layers()`.

Possible options:

```text
Light
Streets
Navigation
Outdoor
Imagery
Dark
Open
```

Possible enhancements:

- previews
- descriptions
- active indicator
- persistent basemap preference

---

# 🧩 Extension: Multiple Data Layers

Allow:

```text
☑ Historic Places
☑ Parks
☐ Bike Routes
☐ Neighborhoods
```

Possible implementation:

```js
L.control.layers();
```

or custom sidebar controls.

---

# 🧩 Extension: Custom Markers and Icons

Possible approaches:

- `L.icon()`
- `L.divIcon()`
- SVG
- emoji
- category-specific symbols

Ideas:

```text
museum icon
school icon
government icon
home icon
commercial icon
```

---

# 🧩 Extension: Category Legend

Create a legend showing:

```text
symbol
+
category
```

Could be:

- Leaflet control
- ordinary HTML
- sidebar section

---

# 🧩 Extension: Heatmap

Turn point data into a density visualization.

Potential datasets:

- incidents
- observations
- events
- visits
- traffic
- large POI collections

Teaching concept:

> The same dataset can be represented in very different ways.

---

# 🧩 Extension: Geometry Explorer

Allow users to switch between example datasets representing:

```text
Points
Lines
Polygons
```

Potential examples:

```text
Historic Places
Bike Routes
Parks
```

This can explicitly teach the GeoJSON geometry model.

---

# 🧩 Extension: Find Your Own Data

Create a guided exercise for locating public geographic datasets.

Search places:

```text
ArcGIS Hub
city open-data portals
county GIS
state GIS
Data.gov
GitHub
```

Teach attendees to recognize:

```text
GeoJSON
Feature Service
CSV
Shapefile
KML
```

Decision guide:

```text
GeoJSON
→ easiest for this workshop

Feature Service
→ Esri Leaflet Feature Layer

CSV with lat/lon
→ convert to GeoJSON

Shapefile
→ convert before using here
```

---

# 🧩 Extension: CSV to GeoJSON

Input:

```text
name,latitude,longitude
```

Transform:

```text
CSV rows
↓
JavaScript objects
↓
GeoJSON Features
↓
FeatureCollection
↓
Leaflet
```

---

# 🧩 Extension: Export Data

Possible exports:

```text
all loaded data
filtered data
selected feature
drawn features
favorite features
```

Export as:

```text
GeoJSON
JSON
```

---

# 🧩 Extension: Download GeoJSON

Create a button:

```text
Download GeoJSON
```

Use a `Blob` and temporary download link.

This pairs particularly well with drawing.

---

# 🧩 Extension: Visited Places

Add:

```text
Visited
Want to Visit
```

Useful for travel-oriented explorers.

---

# 🧩 Extension: Random Place

Add:

```text
Surprise Me
```

Select a random currently visible feature.

This is a tiny but fun use of existing selection architecture.

---

# 🧩 Extension: Distance From Me

Combine:

```text
browser geolocation
+
selected place
```

Display approximate straight-line distance.

---

# 🧩 Extension: Nearby Places

Use current location or selected location and show places within:

```text
0.5 mile
1 mile
5 miles
```

---

# 🧩 Extension: Routing

Advanced ArcGIS extension.

Potential flow:

```text
current location
↓
selected place
↓
route
```

Possible outputs:

```text
route line
travel distance
travel time
directions
```

Priority:

```text
BONUS
```

Do not make this required.

---

# 🧩 Extension: Measurement Tools

Allow measuring:

```text
distance
area
```

Possible implementation:

- Leaflet plugin
- simple custom geometry calculations

---

# 🧩 Extension: Map Click Inspector

On map click, display:

```text
latitude
longitude
zoom
```

This is an easy early-finisher extension.

---

# 🧩 Extension: Coordinate Copier

After clicking the map:

```text
Latitude: ...
Longitude: ...
```

Allow easy copying for creating custom data.

---

# 🧩 Extension: Mini Statistics Dashboard

Show:

```text
Total places
Visible places
Selected category
Number per category
```

Potential chart extension later.

---

# 🧩 Extension: Dynamic City Switching

Move beyond:

```js
const CITY = "kansas-city";
```

Create a runtime city switcher.

When city changes:

1. update configuration
2. clear existing selection
3. fetch the new dataset
4. render new features
5. update title
6. fit map bounds

This combines nearly every core workshop concept.

---

# 🧩 Extension: Compare Cities

Advanced variation.

Possible UI:

```text
Kansas City
vs
Chicago
```

Compare:

- number of places
- categories
- dataset extent
- visual distribution

---

# 🧩 Extension: Multiple Explorers

Allow attendees to configure an explorer by changing one object:

```js
const appConfig = {
  name: "...",
  center: [...],
  zoom: ...,
  dataUrl: "...",
  basemap: "...",
};
```

Teaching point:

> Configuration can change the content without changing application logic.

---

# 🧩 Extension: Shareable Explorer State

Encode state in the URL:

```text
?city=seattle
&category=Residential
&place=sea-014
```

Reloading the link restores the same view.

---

# 🧩 Extension: Remember Preferences

Potential preferences:

```text
city
basemap
theme
sidebar state
last selected category
```

Possible storage:

```text
localStorage
```

This should remain optional because persistence is outside the workshop's core architecture.

---

# 🧩 Extension: Accessibility Explorer

Challenge attendees to improve:

- keyboard navigation
- visible focus
- semantic labels
- ARIA state
- contrast
- reduced motion
- screen-reader announcements

This can be framed as an advanced polish extension rather than decorative work.

---

# 🧩 Extension: Popup Alternatives

Instead of Leaflet popups:

```text
sidebar detail panel
bottom sheet
modal
tooltip
```

Compare when each UI pattern makes sense.

---

# 🧩 Extension: Map/List View Modes

Add:

```text
Map + List
Map Only
List Only
```

Especially useful on mobile.

---

# 🧩 Extension: Full-Screen Map Mode

Temporarily hide the sidebar and let the map occupy the application.

Remember:

```js
map.invalidateSize();
```

after layout changes.

---

# 🧩 Extension: Search + Filter + Sort

Combine:

```text
category filter
+
text search
+
sort
```

Potential sorting options:

```text
A–Z
Z–A
Category
Distance
```

---

# 🧩 Extension: Feature Hover

Hovering a card could highlight its marker without permanently selecting it.

Important:

Do not make hover the only interaction because touch devices do not have reliable hover.

---

# 🧩 Extension: Bounds-Based Results

Only display places currently visible inside the map extent.

Possible interaction:

```text
Search This Area
```

This is a nice advanced synchronization exercise.

---

# 🧩 Extension: Map-Movement State

Listen for:

```text
moveend
zoomend
```

and display:

```text
current zoom
map center
visible feature count
```

---

# 🧩 Extension: Search Result Highlighting

When text search matches a word, visually emphasize the matching portion in sidebar cards.

---

# 🧩 Extension: Data Validation

Before rendering, check whether every feature includes:

```text
id
name
category
geometry
```

Report invalid features.

This is especially useful for attendees bringing their own data.

---

# 🧩 Extension: Data Normalization

Give attendees a mismatched dataset:

```text
OBJECTID
TITLE
TYPE
DETAIL
```

and ask them to transform it to:

```text
id
name
category
description
```

This reinforces the application's data contract.

---

# 🧩 Extension: Live ArcGIS Data vs Frozen Snapshot

Compare:

```text
local GeoJSON snapshot
```

with:

```text
live ArcGIS Feature Layer
```

Discuss:

- reliability
- freshness
- network dependency
- querying
- authentication
- workshop resilience

---

# Make It Yours Ideas by Difficulty

## Very Easy

Good 1–2 minute customizations:

- city
- zoom
- basemap
- explorer title
- intro copy
- marker radius
- marker weight
- marker opacity
- fly-to zoom
- sidebar width
- loading message
- empty-state message

---

## Easy

Good 3–5 minute customizations:

- card fields
- card order
- category styling
- sort list
- category counts
- Reset button
- different popup content
- selected card design
- selected marker design

---

## Medium

Good early-finisher challenges:

- text search
- basemap switcher
- city selector
- Clear Selection
- Random Place
- multiple data layers
- geometry examples
- theme toggle
- collapsible sidebar
- selected-place detail panel

---

## Advanced

Good extension-time projects:

- geocoding
- Feature Layer
- drawing
- exporting GeoJSON
- clustering
- geolocation
- URL state
- multiple filters
- runtime city switching
- routing
- data normalization

---

# Recommended Customizations to Actually Surface in Each Lab

The master list above is intentionally huge.

The attendee instructions should **not show everything at once**.

Recommended choices:

## 01 Map

Surface:

- choose another city
- choose another basemap
- change zoom

Challenge:

- basemap switcher

---

## 02 Data

Surface:

- marker style
- popup fields
- another prepared dataset
- tiny custom GeoJSON

Challenge:

- line or polygon data
- bring your own GeoJSON

---

## 03 UI

Surface:

- explorer title
- card fields
- sidebar width
- card styling

Challenge:

- sorting
- category badges/counts

---

## 04 Selection

Surface:

- selected marker style
- selected card style
- fly-to zoom

Challenge:

- Clear Selection
- Random Place
- detail panel

---

## 05 Filtering

Surface:

- default category
- category styling
- filter labels

Challenge:

- text search
- counts
- Reset button

---

## 06 Polish

Surface:

- loading message
- empty state
- theme
- mobile layout

Challenge:

- dark mode
- collapsible sidebar
- map/list toggle

---

## 07 Refactor

Surface:

- cities module
- constants module

Challenge:

- URL state
- plugin-friendly architecture

---

## 08 Favorites

Surface:

- favorite button text
- favorite icon
- favorite indicator styling

Challenge:

- persist favorites with `localStorage`

---

---

# Recommended Big Extensions

If only a few large extensions are completed before KCDC, prioritize:

## 1. ArcGIS Geocoding

High value because it demonstrates another ArcGIS service.

## 2. Draw/Edit/Export GeoJSON

High value because it lets attendees create geographic data themselves.

## 3. ArcGIS Feature Layer

High value because it demonstrates local data versus hosted GIS services.

## 4. Find Your Own Data

High value because it helps attendees take the workshop home.

## 5. Multiple Geometry Types

High value because it makes clear that mapping is much more than point markers.

## 6. Text Search

Useful and easy to understand.

## 7. Marker Clustering

Useful for larger datasets.

## 8. Browser Geolocation

Fun and immediately recognizable.

## 9. Basemap Gallery

Visually fun and easy to demo.

## 10. Multiple Data Layers

Great bridge toward more serious GIS applications.

---

# Extensions Folder Target

Eventually:

```text
extensions/
├── geocoding/
├── feature-layer/
├── drawing/
├── clustering/
├── geolocation/
├── geometry/
├── multiple-layers/
└── search/
```

Not all of these need to be finished before the conference.

---

# Workshop-Site Extension Pages

Potential structure:

```text
workshop-site/
└── extensions/
    ├── geocoding.md
    ├── feature-layer.md
    ├── drawing.md
    ├── clustering.md
    ├── geolocation.md
    ├── geometry.md
    ├── multiple-layers.md
    └── search.md
```

Again, build only the high-priority ones first.

---

# Instructor Timing Strategy

The live workshop should follow:

```text
Teach core concept
↓
Attendees build required feature
↓
Everyone reaches checkpoint
↓
Offer Make It Yours choices
↓
Fast attendees try Challenge
↓
Regroup
↓
Continue
```

Do not wait for every attendee to complete every customization.

Suggested language:

> If yours is working and you want to keep it exactly like mine, you're done.

> If you want to make it yours while everyone catches up, try one of these.

> These next ideas are optional. Nothing we do later depends on them.

> If your experiment goes sideways, the checkpoint gets you right back with us.

---

# Recovery Strategy

An attendee should always know:

```text
I am stuck in Step 04
↓
open/copy 04-selection
↓
continue with Step 05
```

Nobody should lose the rest of the workshop because of an optional experiment.

---

# What We Should NOT Do

Do not:

- require attendees to find their own data
- require attendees to create ArcGIS accounts during the workshop
- make extensions necessary for later exercises
- change canonical checkpoints for optional features
- require an arbitrary public API for the core workshop
- rely on live municipal services for core data
- overwhelm beginners with 15 choices per exercise
- debug arbitrary shapefiles during the main teaching path
- require clustering, drawing, geolocation, or geocoding
- let customization consume the core workshop schedule

---

# Final Workshop Philosophy

The workshop should not feel like:

> Reproduce Courtney's Kansas City application exactly.

It should feel like:

> Learn how a real Leaflet application works, then decide what kind of explorer you want to build.

The canonical Kansas City Explorer provides:

```text
predictability
recoverability
shared instruction
```

Customization provides:

```text
ownership
experimentation
creativity
```

Extensions provide:

```text
depth
real-world possibilities
something for advanced attendees
```

The goal is for everyone to leave with the same foundational understanding while potentially leaving with very different-looking applications.

---

# Ideal End-of-Workshop Moment

By the end of the workshop, the room might contain:

```text
Kansas City Historic Explorer

Seattle Explorer

Chicago Landmark Explorer

DC Explorer

Coffee Shop Map

Park Finder

Bike Route Map

Neighborhood Explorer

Public Art Map

Custom Drawn Map
```

Yet underneath, attendees have all practiced the same important ideas:

```text
Leaflet map
+
basemap
+
geographic data
+
application state
+
ordinary web UI
+
selection
+
filtering
+
resilience
+
maintainable architecture
+
favorite state and behavior
```

That is the point of **Build Your Own City Explorer**.
