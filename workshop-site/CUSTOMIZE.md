# ✨ Make It Yours

Give your City Explorer your own style, content, or behavior.

**Everything on this page is optional.** Finish the current lesson's checkpoint first, then choose one change to try.

You do not need to complete this page to finish the workshop.

## Choose a Starting Point

| After completing            | Try this                                     |
| --------------------------- | -------------------------------------------- |
| 01 · Build the Map          | Change the city or starting zoom             |
| 02 · Load Geographic Data   | Change marker styling or popup fields        |
| 03 · Build the Sidebar UI   | Rename your explorer or restyle cards        |
| 04 · Synchronize Selection  | Change selection styling or fly-to zoom      |
| 05 · Filter Shared State    | Change filter labels or the results count    |
| 06 · Polish the Application | Personalize messages or mobile layout        |
| 07 · Refactor Into Modules  | Move city settings into their own module     |
| 08 · Add Favorites          | Personalize favorites or explore persistence |

## Before You Experiment

- Make changes inside `workshop-work`.
- Save a working copy or commit before larger experiments.
- Make one change, save, refresh, and check the result.
- Keep the checkpoint folders available for recovery.
- When the instructor regroups, return to the numbered lesson.

Later lessons show the shared Kansas City version. If your customization changes code a later instruction asks you to find, adapt the instruction or restore the shared version before continuing.

Step 07's replacement modules will replace earlier JavaScript customizations unless you carry those changes over.

## Which File Do I Edit?

Before Step 07, application JavaScript lives in `main.js`.

After the refactor, use this guide:

| What you want to change                   | Steps 01–06  | After Step 07 |
| ----------------------------------------- | ------------ | ------------- |
| City configuration                        | `main.js`    | `js/app.js`   |
| Basemap, markers, popups, map movement    | `main.js`    | `js/map.js`   |
| Cards, title, status, DOM events          | `main.js`    | `js/ui.js`    |
| State and filtering logic                 | `main.js`    | `js/state.js` |
| Loading flow and interaction coordination | `main.js`    | `js/app.js`   |
| Page structure                            | `index.html` | `index.html`  |
| Appearance and layout                     | `styles.css` | `styles.css`  |

Keep your API key in `config.js`.

---

# 01 · Make the Map Yours

## Choose Another Prepared City

Find the `CITY` constant and replace its value:

```js
const CITY = "chicago";
```

Other prepared choices are:

- `"seattle"`
- `"washington-dc"`
- `"kansas-city"`

**Check:** Refresh and confirm the starting map location changes.

After Step 02, this setting also chooses the city's dataset.

Return to `"kansas-city"` when you rejoin the shared lesson.

## Change the Starting Zoom

Inside the selected city's configuration object, replace its `zoom` property with:

```js
zoom: 14,
```

Try `10` for a wider view or `14` for a closer view.

**Check:** Refresh and compare the starting view.

After Step 02, `fitMapToPlaces()` adjusts the view to the loaded data, so the starting zoom may only be visible briefly.

## Try Another Basemap

Use the basemap choices in Step 01's **Make It Yours** section.

Change the style string in `addBasemap()`, keeping the existing API-key configuration.

**Check:** The basemap changes while the Leaflet controls still work.

---

# 02 · Personalize Markers and Popups

## Change Marker Size

Find `markerStyle()` and replace its return object with:

```js
return {
  radius: 9,
  weight: 2,
  opacity: 1,
  fillOpacity: 0.6,
};
```

**Check:** Refresh. All place markers should use the new style.

After Step 04, also check that the selected marker remains easy to distinguish from the others.

## Add an Address to Popups

Inside `onEachFeature()`, immediately before:

```js
layer.bindPopup(popup);
```

add:

```js
if (feature.properties.address) {
  const address = document.createElement("p");
  address.textContent = feature.properties.address;
  popup.append(address);
}
```

**Check:** Open a popup for a feature with an address. Places without an address should still work.

## Explore Another Field

Open your GeoJSON file and inspect its `properties`.

Try displaying another field using the same pattern above.

Choose a field that actually exists in your dataset, and use `textContent` for plain text.

---

# 03 · Personalize the Sidebar

## Rename Your Explorer

Before Step 07, replace the existing title assignment in `main.js` with:

```js
appTitle.textContent = "My City Explorer";
```

After Step 07, change the title assignment inside `setAppTitle()` in `js/ui.js` instead.

You can also rewrite the `<p class="intro">` text in `index.html` to explain your explorer's purpose.

**Check:** Refresh and confirm your title and introduction appear.

## Turn Categories Into Badges

Add this rule at the bottom of `styles.css`:

```css
.place-card__category {
  width: fit-content;
  padding: 0.2rem 0.45rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

**Check:** Each card's category should appear inside a rounded border.

## Make Cards More Compact

Inside `renderList()`, remove the `if (description) { ... }` block that creates and appends the description element.

Keep the title, category, button, and `data-place-id` assignment.

**Check:** Cards show the name and category.

After Step 04, clicking them should still select the matching place.

---

# 04 · Personalize Selection

## Change the Selected Card Style

Add this rule at the bottom of `styles.css`:

```css
.place-card.is-selected {
  background: #eaf3ff;
  border-color: #2457a7;
  outline: 2px solid #2457a7;
  outline-offset: 2px;
}
```

**Check:** Select different places. Only one card should appear selected at a time.

Keep an outline or another non-color cue so selection is easy to recognize.

## Change the Fly-To Zoom

Find:

```js
map.flyTo(selectedLayer.getLatLng(), 15);
```

Try replacing `15` with `14` or `16`.

Before Step 07, this is inside `selectPlace()` in `main.js`.

After Step 07, it is inside `highlightMapPlace()` in `js/map.js`.

**Check:** Click a card and compare the resulting zoom.

Clicking a marker should still use the existing `moveMap: false` behavior.

---

# 05 · Personalize Filtering

## Rename or Reorder the Choices

In `index.html`, change the category label to something like **Place type** or **Show**.

You can also reorder the `<option>` elements.

Keep each option's `value` unchanged unless you also change the corresponding data categories.

For example, the visible label can change while the stored value stays the same:

```html
<option value="Residential">Homes and residences</option>
```

**Check:** Choosing the renamed option still shows the correct places.

## Show the Visible and Total Counts

Inside `render()`, replace the non-empty results message with:

```js
setStatus(`Showing ${features.length} of ${state.places.length} places`);
```

After Step 06, keep the separate empty-results message in place.

**Check:** Choose a category. The visible count changes, while the total stays the same.

## 🚀 Challenge: Add Text Search

After finishing the core workshop, try combining text search with category filtering:

1. Add a labeled search input to `index.html`.
2. Add a `search` string to application state.
3. Update it when the input changes.
4. Update `visibleFeatures()` to apply both the category and text conditions.
5. Clear selection and call `render()` when the search changes.

**Check:** Search and category filtering should work together.

Clearing the search should restore all results for the selected category without fetching the data again.

---

# 06 · Personalize Polish

## Rewrite the Messages

Change the message strings inside `loadPlaces()` and `render()`.

Keep each message's purpose clear:

| State   | Example message                              |
| ------- | -------------------------------------------- |
| Loading | Loading places...                            |
| Empty   | No matches. Try another category.            |
| Error   | Couldn't load places. Please try refreshing. |

**Check:** Repeat Step 06's loading, empty, and error checks.

Restore any intentionally broken paths or filters afterward.

## Adjust the Mobile Layout

Find the existing mobile media query in `styles.css`.

To make the mobile map taller, change both the map row and the map height:

```css
@media (max-width: 760px) {
  .app-shell {
    grid-template-rows: auto 70vh;
  }

  .map {
    min-height: 70vh;
    height: 70vh;
  }
}
```

Add this after the existing mobile rules, or update the matching properties there.

Keep the other responsive rules from Step 06.

**Check:** At a narrow browser width, the sidebar and map remain usable and the map has more vertical space.

---

# 07 · Personalize the Modules

## Move City Settings Into Their Own File

After completing Step 07:

1. Create `js/cities.js`.
2. Move the entire `const cities = { ... };` declaration from `js/app.js` into that file.
3. Add `export` before `const`, so it begins with `export const cities = {`.
4. At the top of `js/app.js`, add:

```js
import { cities } from "./cities.js";
```

Keep these lines in `js/app.js`:

```js
const CITY = "kansas-city";
const appConfig = cities[CITY];
```

**Check:** Refresh. The app should behave exactly as before, with city configuration now in its own file.

---

# 08 · Personalize Favorites

## Change the Button Text

In `js/ui.js`, find `setFavoriteButton()` and change its two enabled labels:

```js
favoriteButton.textContent = favorite
  ? "♥ Remove from saved places"
  : "♡ Save this place";
```

Keep the disabled behavior when nothing is selected.

## Change the Card Indicator

Inside `renderList()`, change:

```js
favorite.textContent = "★";
```

to:

```js
favorite.textContent = "♥";
```

Keep the existing class, `data-favorite-star` attribute, and `hidden` logic.

The update helper uses that attribute to find the indicator even when its visible symbol changes.

**Check:** Save a place, remove it, and change categories. The indicator should still match the favorite state.

## 🚀 Challenge: Remember Favorites

The core version keeps favorites only until the page reloads.

To make them persist, explore `localStorage`:

1. Save the favorite ID array as JSON whenever favorites change.
2. Read it when the app starts, before the first render.
3. Parse and validate the saved value before assigning it to state.
4. Fall back to an empty array if the saved value cannot be used.
5. Keep the app usable if browser storage is unavailable.

**Check:** Save two places and refresh. Both should remain saved.

Remove one and refresh again; it should stay removed.

---

# 🧩 Explore More After the Core Workshop

These are larger, optional projects.

Start from a working copy of your completed app. The ideas below are challenge briefs, not additional required lessons.

## Search for Addresses With ArcGIS Geocoding

Explore **Esri Leaflet Geocoder** to search for locations beyond your loaded GeoJSON dataset.

Aim to:

- add a search control
- navigate to a result
- display a result marker

Keep search-result markers separate from your City Explorer places unless you deliberately add them to application state.

This is different from local text search, which filters the places already loaded into your app.

Check that your API key permits the geocoding service before trying it.

**Success:** You can find an address while your existing cards, category filter, and favorites still work.

## Load a Public ArcGIS Feature Layer

Explore **Esri Leaflet** to add a public ArcGIS Feature Layer as a separate map layer.

Start with a layer that supports public access.

Inspect its fields, then choose suitable popup text and styling. Its property names may differ from the workshop dataset.

**Success:** Hosted features appear alongside your existing places.

You can explain which data comes from local GeoJSON and which comes from the hosted service.

## Bring Your Own Point Data

Start with a small GeoJSON FeatureCollection.

Give every place a unique string ID and properties that match the app:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "my-place-001",
        "name": "My Favorite Place",
        "category": "Residential",
        "description": "A place I want to explore."
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-94.58, 39.1]
      }
    }
  ]
}
```

Save it as:

```text
workshop-work/data/my-places.geojson
```

In your chosen city configuration, replace the `dataUrl` property with:

```js
dataUrl: "./data/my-places.geojson",
```

That URL is relative to the app page, including after the JavaScript moves into modules.

If you introduce new categories, update the filter options to match them.

GeoJSON coordinates use **[longitude, latitude]**.

**Check:** Your places appear in both views, selection works, and filtering preserves the full dataset.

## Try Lines or Polygons

Explore routes, parks, or neighborhoods as a separate layer first.

The core app's selection code assumes point markers and calls `getLatLng()`.

Replacing the main dataset with lines or polygons also requires adapting selection and map movement, for example to use the selected layer's bounds.

**Success:** Your new geometry appears without breaking point selection in the core app.

## More Project Ideas

| Idea                       | A useful first goal                                               |
| -------------------------- | ----------------------------------------------------------------- |
| Draw and export GeoJSON    | Draw one feature and download it as GeoJSON                       |
| Marker clustering          | Explore grouping a larger set of point markers                    |
| Browser geolocation        | Show your location after granting permission                      |
| Random place               | Select a random feature from the current visible results          |
| Visited places             | Track visited IDs separately from favorite IDs                    |
| Dynamic city selector      | Change cities, clear selection, load data, and refresh both views |
| Shareable URL              | Restore a category and selected place from URL parameters         |
| Accessibility improvements | Check keyboard use, focus visibility, and favorite announcements  |

---

# ✅ Before You Rejoin the Workshop

- [ ] The app loads without unexpected errors.
- [ ] The map and sidebar still show the expected places.
- [ ] Features from completed lessons still work.
- [ ] Temporary broken paths or test filters are restored.
- [ ] You know which changes you made and how to undo them.

If an experiment gets stuck, restore your working copy or use the completed checkpoint linked from the numbered lesson.

Keep your `config.js` and make sure your data files remain available.

Return to your current numbered lesson when the instructor continues. You can always come back to these ideas later.
