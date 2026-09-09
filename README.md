# City Explorer • KCDC 2026

**Modern Front-End Mapping with JavaScript: Build a Real App in Half a Day**  
A hands-on workshop with [Courtney Yatteau](https://github.com/cyatteau), Developer Advocate at Esri.

Build an interactive City Explorer using HTML, CSS, vanilla JavaScript, Leaflet, Esri Leaflet, and GeoJSON. Start with a map, connect geographic data to a sidebar, and use shared application state to coordinate selection, filtering, and favorites.

**The map is one view of your application state, not the whole application.**

This repository includes the workshop website, starter code, runnable checkpoints, prepared datasets, and optional extensions.

## Start here

1. **Download the project:** [Download ZIP](https://github.com/cyatteau/kcdc2026-map-workshop/archive/refs/heads/main.zip), then extract it. Alternatively, clone the repository:

   ```bash
   git clone https://github.com/cyatteau/kcdc2026-map-workshop.git
   cd kcdc2026-map-workshop
   ```

2. Open the **full project folder** in your editor.
3. Copy `checkpoints/00-start` to a new folder named `workshop-work` **at the project root**, alongside `checkpoints`, `data`, and `workshop-site`.
4. Inside `workshop-work`, copy `config.example.js` and name the copy `config.js`.
5. Add the workshop API key to `workshop-work/config.js`:

   ```js
   window.APP_CONFIG = {
     arcgisApiKey: "PASTE_WORKSHOP_KEY_HERE",
   };
   ```

6. Start a local server **from the project root**. Use your editor's Live Server extension, or run:

   ```bash
   python -m http.server 8000
   ```

   If your system uses `python3`, run `python3 -m http.server 8000` instead.

7. With the Python server above, open:

   - **Workshop instructions:** <http://localhost:8000/workshop-site/>
   - **Your working app:** <http://localhost:8000/workshop-work/>

   With another server, use its displayed address and port with the same paths.

**No map in the starter app is correct.** You will create it in Lesson 01. Keep the instructions and working app open in separate tabs.

You can also [read Start Here on GitHub](workshop-site/START-HERE.md), but the workshop website renders the interactive activities and navigation.

## What you need

- A laptop, charger, modern browser, and code editor.
- A local static web server, such as VS Code Live Server or Python's HTTP server.
- Basic familiarity with HTML, CSS, and JavaScript.
- Internet access for hosted libraries and ArcGIS services.
- An ArcGIS API key, provided by the instructor during the workshop.

No npm installation, bundler, or JavaScript framework is required. Attendees do not need their own ArcGIS account for the instructor-led session.

Use a local HTTP server rather than opening HTML files with `file://`. The app loads GeoJSON with `fetch()` and later uses JavaScript modules. Serve the whole repository so the app can reach the shared `data` folder.

## ArcGIS API key

The **ArcGIS basemap is part of the core workshop**. Lesson 01 first introduces an OpenStreetMap raster basemap, then switches to an ArcGIS vector basemap through Esri Leaflet Vector.

The instructor shares a temporary workshop key separately. Keep it in your local `config.js`, rather than embedding it in `main.js` or `js/map.js`. Do not publish the workshop key in commits, documentation, or shared AI prompts.

When continuing after workshop access ends, use your own ArcGIS credentials with the permissions needed for your app. The optional geocoding extension requires geocoding permission in addition to basemap access.

## Lesson guide

| Lesson | What you build | Finished checkpoint |
| --- | --- | --- |
| [Start Here](workshop-site/START-HERE.md) | Working folder, local configuration, and server setup | `checkpoints/00-start` |
| [01 · Build the Map](workshop-site/01-map.md) | Leaflet map, city configuration, OSM raster tiles, and an ArcGIS vector basemap | `checkpoints/01-map` |
| [02 · Load Geographic Data](workshop-site/02-data.md) | GeoJSON loading, application state, circle markers, popups, and fitting to data | `checkpoints/02-data` |
| [03 · Build the Sidebar UI](workshop-site/03-ui.md) | Layout, city title, place count, and cards from the same data as the map | `checkpoints/03-ui` |
| [04 · Synchronize Selection](workshop-site/04-selection.md) | Shared selection, marker/card highlighting, popups, and map movement | `checkpoints/04-selection` |
| [05 · Filter Shared State](workshop-site/05-filtering.md) | Category filtering with synchronized map, list, and count updates | `checkpoints/05-filtering` |
| [06 · Polish the Application](workshop-site/06-polish.md) | Loading, error, and empty states, plus responsive layout | `checkpoints/06-polish` |
| [07 · Refactor Into Modules](workshop-site/07-refactor.md) | Separate state, data, map, UI, and application coordination modules | `checkpoints/07-complete` |
| [08 · Add Favorites](workshop-site/08-favorites.md) | Favorite IDs, a favorite toggle, and card indicators | `checkpoints/08-favorites` |

Lesson 07's finished folder is named **`07-complete`**. Use that folder when recovering from or comparing the refactoring lesson.

Core favorites live in JavaScript memory and survive category filtering. Saving them across page reloads with `localStorage` is an optional challenge.

## How to follow along

- **Watch:** Follow the explanation and demonstration.
- **Your Turn:** Complete the numbered steps.
- **Check Your Work:** Confirm the expected behavior before continuing.
- **Make It Yours:** Try a small customization when your core work is complete.
- **Challenge or Extension:** Explore further when you have time.

You do not need to complete every optional activity. Keep the core app working and return to larger experiments afterward.

### Recover with a checkpoint

If you get stuck, compare your files with the finished checkpoint for the lesson. To catch up:

1. Save a copy of any experiments you want to keep.
2. Copy the matching checkpoint's files into `workshop-work`.
3. Preserve your existing `workshop-work/config.js`.
4. Refresh the working app and verify it works before continuing.

Keep `workshop-work` at the project root so relative dataset paths resolve correctly. Checkpoints are there to help you stay with the group.

## Optional extensions

Start with the completed app and follow the extension page's setup instructions. Work in a separate copy so you can return to the core app.

| Extension | What you add | Example folder |
| --- | --- | --- |
| [ArcGIS Geocoding](workshop-site/extensions/geocoding.md) | Address/place search, suggestions, and temporary search-result markers | `extensions/geocoding` |
| [Draw and Export GeoJSON](workshop-site/extensions/drawing.md) | Drawing, editing, deleting, and downloading your own geographic features | `extensions/drawing` |
| [ArcGIS Feature Layer](workshop-site/extensions/feature-layer.md) | Hosted trailhead data, custom styles, attribute popups, and navigation to the layer's extent | `extensions/feature-layer` |

For more experiments, browse the [customization ideas](workshop-site/CUSTOMIZE.md). This is a broad idea bank; not every suggestion has a complete implementation or standalone lesson.

## Prepared cities and data

The workshop includes datasets for **Kansas City, Chicago, Seattle, and Washington, DC**. Follow along with Kansas City first, or use the lesson's customization instructions to explore another prepared city.

See [the data README](data/README.md) for dataset information. When bringing your own data, inspect its geometry and property names before connecting it to the app. Later lessons rely on consistent feature IDs and properties such as names and categories.

## Using AI coding tools

AI assistants and coding agents are welcome, but optional. No AI subscription is required.

Give your tool the current checkpoint and a specific task. Keep changes within the workshop's vanilla JavaScript setup, review its edits, and test the result. Be ready to explain how data, state, and events connect.

For example, after a change to filtering, check that the map, list, count, and selection remain consistent. If generated code becomes difficult to recover, return to the matching checkpoint.

## Repository contents

| Path | Purpose |
| --- | --- |
| `workshop-site/` | Instruction website, lesson Markdown, activities, and navigation |
| `checkpoints/` | Starter app and finished versions of each core lesson |
| `data/` | Shared geographic datasets |
| `extensions/` | Example apps for the three dedicated extensions |
| `workshop-work/` | Your working copy, created during setup |

To update lesson text, edit the relevant Markdown file in `workshop-site/`. Site navigation and checkpoint links are configured in `workshop-site/site.js`. Preview the site locally after changes and check that lesson, data, and checkpoint links still resolve.

## Troubleshooting

Open the [Troubleshooting guide](workshop-site/troubleshooting.md) for help with setup, basemaps, GeoJSON, selection, filtering, and module errors.

Start with the browser **Console** and **Network** panels:

- **Blank map:** Check container height, loaded scripts, and basemap requests.
- **Missing data or a 404:** Check the server root, file path, and capitalization.
- **ArcGIS authorization error:** Check `config.js`, key expiration, service permissions, and allowed referrers.
- **Map and sidebar disagree:** Confirm both views use the same derived feature array.
- **Module error:** Check `type="module"`, import paths, and named exports.

When time is tight, use a checkpoint and keep moving.

## Presenter

[**Courtney Yatteau**](https://github.com/cyatteau) · Developer Advocate at Esri