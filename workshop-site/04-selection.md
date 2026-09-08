# 04 - Synchronize Selection

## Goal

Connect the map and sidebar so selecting a place in one view updates the other.

By the end of this section, you'll have:

- selected-place state
- marker click handling
- sidebar card click handling
- selected marker styling
- selected card styling
- popups opening from either view
- map movement when a card is selected

---

# Starting Point

Start from:

```text
checkpoints/03-ui
```

You should already have:

```text
map markers + sidebar cards
```

Clicking a marker opens a popup.

Clicking a card does nothing yet.

In this exercise, we'll edit:

```text
main.js
styles.css
```

---

# 👀 Watch First

We'll trace the selection idea:

```text
marker click
     ↓
selectPlace(id)
     ↓
state.selectedId
     ↓
marker + card update
```

The key idea:

> Shared IDs let different views talk about the same feature.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "What Connects the Views?",
  "prompt": "A marker and a sidebar card represent the same place. What lets us connect them?",
  "options": [
    {
      "value": "A",
      "label": "Their screen position"
    },
    {
      "value": "B",
      "label": "Their category"
    },
    {
      "value": "C",
      "label": "A shared feature ID"
    },
    {
      "value": "D",
      "label": "Their popup text"
    }
  ],
  "correct": "C",
  "success": "Correct! The marker layer and the card can look completely different. The shared ID tells us they represent the same underlying feature.",
  "hint": "Think about the value stored in data-place-id."
}
```

<button class="discovery-token" type="button" data-discovery-id="shared-id-detective" aria-label="Hidden discovery" title="Hmm...">🔗</button>

<!-- OPTIONAL VIDEO SLOT
Suggested clip: "Shared IDs and Synchronized Views"
Suggested length: 60 seconds
Place it here if you record one.
-->

---

# 🛠️ Your Turn 1 - Add Selection State

In `main.js`, change:

```js
const state = {
  places: [],
};
```

to:

```js
const state = {
  places: [],
  selectedId: null,
};
```

`null` means nothing is selected yet.

---

# 🛠️ Your Turn 2 - Track Leaflet Layers by ID

Near the map variables, add:

```js
const layerById = new Map();
```

That section should look like:

```js
let map;
let placesLayer;

const layerById = new Map();
```

This is JavaScript's `Map`, not a geographic map.

We'll use it like:

```text
feature id → Leaflet layer
```

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🐛 Spot the Bug",
  "title": "Almost the Same ID",
  "prompt": "The marker lookup contains kc-003, but the matching card contains kc-030. Will selection synchronize correctly?",
  "context": "marker: kc-003\ncard:   kc-030",
  "options": [
    {
      "value": "A",
      "label": "Yes, because the IDs start with the same prefix."
    },
    {
      "value": "B",
      "label": "Yes, because the category can connect them instead."
    },
    {
      "value": "C",
      "label": "No, because the IDs do not match exactly."
    }
  ],
  "correct": "C",
  "success": "Correct! Those are different IDs, so the application cannot know that the marker and card represent the same feature.",
  "hint": "Shared IDs only help when the shared value is actually identical."
}
```

---

# 🛠️ Your Turn 3 - Register Each Layer

Inside `onEachFeature(feature, layer)`, add this at the top:

```js
const id = String(feature.properties.id);

layerById.set(id, layer);

layer.on("click", () => {
  selectPlace(id, {
    moveMap: false,
  });
});
```

Then keep your existing popup code below it.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🔮 Predict It",
  "title": "Should the Map Fly?",
  "prompt": "When someone clicks a marker, why do we call selectPlace() with moveMap: false?",
  "context": "selectPlace(id, {\n  moveMap: false,\n});",
  "options": [
    {
      "value": "A",
      "label": "To prevent the popup from opening."
    },
    {
      "value": "B",
      "label": "Because the user already clicked that map location, so flying there again is unnecessary."
    },
    {
      "value": "C",
      "label": "To avoid updating state.selectedId."
    },
    {
      "value": "D",
      "label": "To remove the marker from the map."
    }
  ],
  "correct": "B",
  "success": "Correct! We still want selection, styling, the popup, and the matching card to update, but there is no need to fly to the place the user just clicked.",
  "hint": "The click already happened on the map itself."
}
```

---

# 🛠️ Your Turn 4 - Reset the Lookup When Rendering

Update `renderMap()` to clear `layerById` whenever map layers are rebuilt:

```js
function renderMap(features) {
  layerById.clear();

  placesLayer.clearLayers();

  placesLayer.addData({
    type: "FeatureCollection",
    features,
  });
}
```

This matters later when filtering changes which features are visible.

---

# 🛠️ Your Turn 5 - Create `selectPlace()`

After the map rendering section, add:

```js
// --------------------------------------------------
// SELECTION
// --------------------------------------------------

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

  selectedLayer.setStyle({
    radius: 10,
    weight: 4,
    fillOpacity: 1,
  });

  selectedLayer.bringToFront();

  selectedLayer.openPopup();

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

  if (moveMap) {
    map.flyTo(selectedLayer.getLatLng(), 15);
  }
}
```

Save and refresh.

Click different markers.

The selected marker should get larger and its popup should open.

---

# 🛠️ Your Turn 6 - Style the Selected Card

In `styles.css`, add:

```css
.place-card.is-selected {
  border-width: 2px;
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

---

# 🛠️ Your Turn 7 - Listen for Sidebar Clicks

Near the bottom of `main.js`, before startup, add:

```js
// --------------------------------------------------
// EVENT HANDLERS
// --------------------------------------------------

placeList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-place-id]");

  if (!card) {
    return;
  }

  selectPlace(card.dataset.placeId);
});
```

Save and refresh.

---

# 🎉 Checkpoint

Test both directions.

## Marker click

```text
marker → selected marker → popup → matching card
```

The map should not fly because you already clicked the location.

## Card click

```text
card → matching marker → popup → map flies to place
```

Now the map and sidebar are connected.

---

```activity
{
  "type": "fill-blank",
  "eyebrow": "🧠 Fill It In",
  "title": "Trace a Card Click",
  "prompt": "Complete the missing step in the selection flow.",
  "context": "card click\n    ↓\n____________\n    ↓\nstate.selectedId\n    ↓\nmarker + card update",
  "answers": [
    "selectPlace(id)",
    "selectPlace()",
    "selectPlace"
  ],
  "placeholder": "Type the missing function",
  "success": "Correct! selectPlace() is the shared path that coordinates both views.",
  "hint": "It is the same function marker clicks use."
}
```

---

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "In One Sentence",
  "prompt": "Why is selectPlace() useful instead of writing separate marker-selection and card-selection logic?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "Both interactions can use one shared selection path, which keeps the map and sidebar synchronized."
}
```

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

If you're ahead, pick one.

## Change the selected marker style

Edit:

```js
selectedLayer.setStyle({
  radius: 10,
  weight: 4,
  fillOpacity: 1,
});
```

## Change the selected card style

Edit:

```css
.place-card.is-selected {
  /* your style */
}
```

## Change the zoom when a card is selected

Edit:

```js
map.flyTo(selectedLayer.getLatLng(), 15);
```

Try `14`, `16`, or `17`.

Want more selection ideas? Find them under **Explore More → ✨ Make It Yours** in the workshop navigation.

<!-- OPTIONAL-END -->

# ✅ Check Your Work

Verify:

- [ ] Clicking a marker selects it.
- [ ] Clicking a marker highlights the matching card.
- [ ] Clicking a marker opens its popup.
- [ ] Clicking a marker does not unnecessarily move the map.
- [ ] Clicking a card selects it.
- [ ] Clicking a card highlights the matching marker.
- [ ] Clicking a card opens the marker popup.
- [ ] Clicking a card moves the map.
- [ ] Only one marker appears selected at a time.
- [ ] Only one card appears selected at a time.
- [ ] There are no unexpected errors from your application code.

If something isn't working, use the completed checkpoint below to recover and keep moving.

---

# Next

Continue to:

## 05 - Filter Shared State

Next we'll add category filtering and keep both views synchronized.
