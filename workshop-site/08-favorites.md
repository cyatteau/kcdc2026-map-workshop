# 08 - Add Favorites

## Goal

Use the modules from Step 07 to add a brand-new feature.

By the end of this section, you'll have:

- favorite-place state
- a Save Favorite button
- favorite indicators on place cards
- UI that updates when favorites change
- a new feature coordinated across multiple modules

This time, we're not reorganizing code that already works.

We're adding something the application could not do before.

---

# Starting Point

Start from:

```text
checkpoints/07-complete
```

You should already have the modular version of the City Explorer:

```text
js/
├── app.js
├── data.js
├── map.js
├── state.js
└── ui.js
```

In this exercise, we'll edit:

```text
index.html
styles.css
js/state.js
js/ui.js
js/app.js
```

We do not need to change:

```text
data.js
map.js
```

---

# 👀 Watch First - Why Did We Refactor?

At the end of Step 07, the application looked exactly the same.

That was intentional.

But now the module boundaries give our new feature clear places to live.

Favorites will touch three main responsibilities:

```text
state.js
↓
store favorite IDs

ui.js
↓
display favorite controls and indicators

app.js
↓
coordinate the interaction
```

The flow will look like:

```text
select a place
      ↓
click Save Favorite
      ↓
app.js
      ↓
state.favoriteIds changes
      ↓
UI updates
```

This is the payoff from Step 07. <button class="discovery-token" type="button" data-discovery-id="favorite-find" aria-label="Hidden discovery" title="Hmm...">⭐</button>

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Where Should Favorites Live?",
  "prompt": "Which module should own the list of favorite place IDs?",
  "options": [
    {
      "value": "A",
      "label": "map.js"
    },
    {
      "value": "B",
      "label": "state.js"
    },
    {
      "value": "C",
      "label": "data.js"
    },
    {
      "value": "D",
      "label": "index.html"
    }
  ],
  "correct": "B",
  "success": "Correct! Favorites are application state, so state.js is the natural place to store them.",
  "hint": "Think about which file already owns places, category, and selectedId."
}
```

---

# 🛠️ Your Turn 1 - Add Favorite State

Open:

```text
js/state.js
```

Your state currently looks like:

```js
export const state = {
  places: [],
  category: "all",
  selectedId: null,
};
```

Add a new array:

```js
export const state = {
  places: [],
  category: "all",
  selectedId: null,
  favoriteIds: [],
};
```

Each favorite will be represented by the same feature ID we already use for selection.

For example:

```text
kc-001
kc-014
kc-037
```

So instead of copying entire GeoJSON features into another array, we only store their IDs.

Our state can now conceptually look like:

```text
state
├── places
├── category
├── selectedId
└── favoriteIds
```

---

# 🛠️ Your Turn 2 - Add Favorite Helpers

At the bottom of `state.js`, add:

```js
export function toggleFavorite(id) {
  const key = String(id);

  const alreadyFavorite = state.favoriteIds.includes(key);

  if (alreadyFavorite) {
    state.favoriteIds = state.favoriteIds.filter(
      (favoriteId) => favoriteId !== key,
    );

    return false;
  }

  state.favoriteIds = [...state.favoriteIds, key];

  return true;
}

export function isFavorite(id) {
  return state.favoriteIds.includes(String(id));
}
```

`toggleFavorite()` handles both actions:

```text
not favorite
     ↓
add ID
     ↓
return true
```

or:

```text
already favorite
     ↓
remove ID
     ↓
return false
```

`isFavorite()` gives the rest of the application a simple question to ask:

```js
isFavorite(id);
```

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🔮 Predict It",
  "title": "What Happens on the Second Click?",
  "prompt": "Suppose kc-014 is already inside state.favoriteIds. What should toggleFavorite(\"kc-014\") do?",
  "options": [
    {
      "value": "A",
      "label": "Add kc-014 a second time."
    },
    {
      "value": "B",
      "label": "Remove kc-014 and return false."
    },
    {
      "value": "C",
      "label": "Delete the entire places array."
    },
    {
      "value": "D",
      "label": "Reload the GeoJSON."
    }
  ],
  "correct": "B",
  "success": "Correct! Toggle behavior means the second action removes the existing favorite.",
  "hint": "A toggle switches between two states."
}
```

---

# 🛠️ Your Turn 3 - Add the Favorite Button

Open:

```text
index.html
```

Find the category filter and place list.

Immediately before the place list, add:

```html
<div class="favorite-tools">
  <button id="favorite-button" class="favorite-button" type="button" disabled>
    ☆ Select a place to favorite
  </button>
</div>
```

The button starts disabled.

Why?

At startup:

```text
state.selectedId
      ↓
     null
```

There is no place to favorite yet.

The user must select a place first.

---

# 🛠️ Your Turn 4 - Style the Favorite UI

Open:

```text
styles.css
```

Add:

```css
.favorite-tools {
  margin: 1rem 0;
}

.favorite-button {
  width: 100%;

  padding: 0.7rem 0.9rem;

  font: inherit;
  font-weight: 700;

  background: white;

  border: 1px solid #bbb;
  border-radius: 0.5rem;

  cursor: pointer;
}

.favorite-button:hover:not(:disabled) {
  background: #f5f5f5;
}

.favorite-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.place-card__title-row {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 0.75rem;
}

.place-card__favorite {
  flex-shrink: 0;

  font-size: 1rem;
}
```

Save and refresh.

You should see:

```text
☆ Select a place to favorite
```

above the place list.

The button should be disabled.

That is correct.

---

# ✅ Checkpoint 1 - Favorite State and UI Exist

At this point:

- `state.favoriteIds` exists
- favorite helper functions exist
- the Favorite button appears
- the button starts disabled

But clicking a place still does not enable the Favorite button.

We have created the pieces.

Now we need to connect them.

---

# 👀 Watch - UI Has Two New Jobs

Our UI module now needs to do two things it did not do before:

```text
1. update the Favorite button

2. show ★ on favorite cards
```

So we'll give those responsibilities to:

```text
ui.js
```

---

# 🛠️ Your Turn 5 - Find the Favorite Button in `ui.js`

Open:

```text
js/ui.js
```

Near the existing DOM references, add:

```js
const favoriteButton = document.querySelector("#favorite-button");
```

Now the UI module has access to the new button.

---

# 🛠️ Your Turn 6 - Let Cards Know About Favorites

Find:

```js
export function renderList(features) {
```

Change it to:

```js
export function renderList(
  features,
  favoriteIds = [],
) {
```

Inside the loop, after:

```js
const { id, name, category, description } = feature.properties;
```

add:

```js
const isFavorite = favoriteIds.includes(String(id));
```

Now `renderList()` knows whether each feature is currently a favorite.

---

# 🛠️ Your Turn 7 - Add a Favorite Star to Cards

Find the code that creates the card title:

```js
const title = document.createElement("strong");

title.className = "place-card__title";

title.textContent = name;
```

Immediately after it, add:

```js
const titleRow = document.createElement("span");

titleRow.className = "place-card__title-row";

const favorite = document.createElement("span");

favorite.className = "place-card__favorite";

favorite.dataset.favoriteStar = "";

favorite.textContent = "★";

favorite.hidden = !isFavorite;

favorite.setAttribute("aria-hidden", "true");

titleRow.append(title, favorite);
```

Then find:

```js
button.append(title, categoryElement);
```

Replace it with:

```js
button.append(titleRow, categoryElement);
```

Cards can now display a star when their ID appears in `favoriteIds`.

---

```activity
{
  "type": "reveal",
  "eyebrow": "🕵️ Trace It",
  "title": "How Does the Card Know?",
  "prompt": "Before revealing the answer, trace how a feature becomes a favorite star on a card.",
  "context": "feature id → ? → ? → ★",
  "buttonLabel": "Reveal the flow",
  "answer": "feature id → state.favoriteIds → renderList() checks the ID → ★ becomes visible"
}
```

---

# 🛠️ Your Turn 8 - Add Favorite UI Helpers

At the bottom of `ui.js`, add:

```js
export function setFavoriteButton(selectedId, favorite) {
  if (!selectedId) {
    favoriteButton.disabled = true;

    favoriteButton.textContent = "☆ Select a place to favorite";

    return;
  }

  favoriteButton.disabled = false;

  favoriteButton.textContent = favorite
    ? "★ Remove favorite"
    : "☆ Save favorite";
}
```

This function handles three states:

```text
nothing selected
↓
disabled

selected + not favorite
↓
☆ Save favorite

selected + favorite
↓
★ Remove favorite
```

Now add:

```js
export function updateFavoriteCard(id, favorite) {
  const key = String(id);

  const card = document.querySelector(`[data-place-id="${CSS.escape(key)}"]`);

  if (!card) {
    return;
  }

  const star = card.querySelector("[data-favorite-star]");

  if (star) {
    star.hidden = !favorite;
  }
}
```

This updates the matching card without rebuilding the entire list.

Finally add:

```js
export function bindFavoriteClick(onToggle) {
  favoriteButton.addEventListener("click", () => {
    onToggle();
  });
}
```

Just like the other UI event helpers, `ui.js` listens for the browser event.

It does not decide what Favorites mean.

That decision stays outside the UI module.

---

# 🛠️ Your Turn 9 - Import the Favorite State Helpers

Open:

```text
js/app.js
```

Find the import from:

```text
./state.js
```

Add:

```js
toggleFavorite,
isFavorite,
```

Your import should now include:

```js
import {
  state,
  setPlaces,
  setCategory,
  setSelectedId,
  visibleFeatures,
  toggleFavorite,
  isFavorite,
} from "./state.js";
```

---

# 🛠️ Your Turn 10 - Import the Favorite UI Helpers

Find the import from:

```text
./ui.js
```

Add:

```js
setFavoriteButton,
updateFavoriteCard,
bindFavoriteClick,
```

So it should include:

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
} from "./ui.js";
```

Now `app.js` can coordinate favorite state and favorite UI.

---

# 🛠️ Your Turn 11 - Update the Favorite Button on Selection

Inside:

```js
function selectPlace(...)
```

find:

```js
highlightSelectedCard(key);
```

Immediately after it, add:

```js
setFavoriteButton(key, isFavorite(key));
```

Now selecting a place asks:

```text
Is this place already a favorite?
```

and updates the button appropriately.

Save and refresh.

Click a card.

The Favorite button should change from:

```text
☆ Select a place to favorite
```

to:

```text
☆ Save favorite
```

We're getting closer.

---

# 🛠️ Your Turn 12 - Render Existing Favorites

Inside:

```js
function render()
```

find:

```js
renderList(features);
```

Replace it with:

```js
renderList(features, state.favoriteIds);
```

Then add:

```js
setFavoriteButton(
  state.selectedId,
  state.selectedId ? isFavorite(state.selectedId) : false,
);
```

Now any full UI render also reflects the current favorite state.

This matters when filtering causes the list to be rebuilt.

---

# 🛠️ Your Turn 13 - Connect the Favorite Button

Near the existing event bindings in `app.js`, add:

```js
bindFavoriteClick(() => {
  const id = state.selectedId;

  if (!id) {
    return;
  }

  const favorite = toggleFavorite(id);

  updateFavoriteCard(id, favorite);

  setFavoriteButton(id, favorite);
});
```

This is the complete interaction.

Trace it:

```text
button click
     ↓
bindFavoriteClick()
     ↓
app.js
     ↓
toggleFavorite(id)
     ↓
state.favoriteIds
     ↓
updateFavoriteCard()
+
setFavoriteButton()
```

Save and refresh.

---

# 🎉 Checkpoint 2 - Favorites Work

Try this exact sequence:

1. Select a place.
2. Click **☆ Save favorite**.
3. Look at the selected card.
4. Confirm a **★** appears.
5. Look at the button.
6. Confirm it now says **★ Remove favorite**.
7. Click it again.
8. Confirm the star disappears.

Now favorite several different places.

Each one should keep its own favorite state.

---

```activity
{
  "type": "fill-blank",
  "eyebrow": "🧠 Fill It In",
  "title": "Follow the Favorite",
  "prompt": "Complete the shared-state flow.",
  "context": "favorite button → toggleFavorite(id) → __________ → UI updates",
  "inputLabel": "Missing value",
  "placeholder": "Type the state property",
  "answers": [
    "state.favoriteIds",
    "favoriteIds"
  ],
  "success": "Correct! favoriteIds is the application state connecting the interaction to the UI.",
  "hint": "Look at the new array you added to state.js."
}
```

---

# 🛠️ Your Turn 14 - Test Favorites With Filtering

Favorite at least two places.

Now change the category filter.

Then return to:

```text
All categories
```

Your favorite stars should still appear.

Why?

Filtering changes:

```text
which features are visible
```

It does not replace:

```text
state.favoriteIds
```

The two pieces of state can coexist:

```text
state
├── places
├── category
├── selectedId
└── favoriteIds
```

This is another example of why centralized application state is useful.

---

# ✅ Final Checkpoint - New Feature Complete

Verify:

- [ ] The app loads normally.
- [ ] The Favorite button starts disabled.
- [ ] Selecting a place enables the button.
- [ ] The button says **☆ Save favorite** for a non-favorite.
- [ ] Clicking the button adds the favorite.
- [ ] A **★** appears on the matching card.
- [ ] The button changes to **★ Remove favorite**.
- [ ] Clicking again removes the favorite.
- [ ] Multiple places can be favorited.
- [ ] Filtering does not erase favorite state.
- [ ] Selection still works.
- [ ] Map behavior still works.
- [ ] There are no unexpected errors from your application code.

If something isn't working, use the completed checkpoint below to recover and keep moving.

---

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "Why Did Modules Help?",
  "prompt": "Why was adding Favorites easier after Step 07?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "Because each responsibility already had a clear home: state.js stores favorite data, ui.js displays it, and app.js coordinates the interaction."
}
```

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

If you're ahead, personalize the feature.

## Change the Favorite text

Instead of:

```text
☆ Save favorite
★ Remove favorite
```

try:

```text
♡ Save
♥ Saved
```

or your own wording.

## Change the indicator

Instead of:

```text
★
```

try another symbol or label.

## Change the styling

Customize:

```css
.favorite-button
```

or:

```css
.place-card__favorite
```

Keep the favorite state understandable without relying only on color.

<!-- OPTIONAL-END -->

---

<!-- OPTIONAL-START: 🚀 Optional Challenge - Remember Favorites -->

Right now Favorites live only in JavaScript memory.

Refresh the browser and they disappear.

If you want an extra challenge, explore:

```text
localStorage
```

The idea:

```text
favorite changes
      ↓
save IDs to localStorage

page reloads
      ↓
read IDs from localStorage
      ↓
restore favorite state
```

This is intentionally optional.

The core workshop does not depend on browser persistence.

<!-- OPTIONAL-END -->

---

# 🎉 Core Workshop Complete

You built a City Explorer with:

```text
Leaflet map
+
ArcGIS vector basemap
+
GeoJSON
+
application state
+
sidebar UI
+
selection
+
filtering
+
loading, empty, and error states
+
responsive layout
+
JavaScript modules
+
favorites
```

More importantly, you built an application where multiple pieces of UI can respond to the same state.

The final mental model:

```text
                 state
          ┌────────┼────────┐
          ↓        ↓        ↓
         map       UI    favorites
```

The map is powerful.

But it is still one view of a larger web application.

---

# Next

Head to **Explore More → ✨ Make It Yours** in the workshop navigation, or try one of the optional extensions.

```text
map
+
GeoJSON
+
sidebar
+
selection
+
filtering
+
responsive UI
+
JavaScript modules
+
favorites
```
