# 05 - Filter Shared State

## Goal

Add category filtering that updates both the map and sidebar.

By the end of this section, you'll have:

- a category filter
- category state
- a `visibleFeatures()` function
- one central `render()` function
- synchronized map and sidebar filtering
- selection reset when the filter changes

---

# Starting Point

Start from:

```text
checkpoints/04-selection
```

You should already have synchronized marker and card selection.

In this exercise, we'll edit:

```text
index.html
styles.css
main.js
```

---

# 👀 Watch First

We'll use this state pattern:

```text
state.places + state.category
              ↓
       visibleFeatures()
              ↓
        map + sidebar
```

The important idea:

> The map and sidebar do not filter themselves separately. They both receive the same filtered array. <button class="discovery-token" type="button" data-discovery-id="state-keeper" aria-label="Hidden discovery" title="Hmm...">🔎</button>

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Filter or Replace?",
  "prompt": "When the user chooses one category, what should happen to state.places?",
  "options": [
    {
      "value": "A",
      "label": "Replace it with only the matching features."
    },
    {
      "value": "B",
      "label": "Leave it intact and derive a filtered array."
    },
    {
      "value": "C",
      "label": "Empty it and fetch the GeoJSON again."
    },
    {
      "value": "D",
      "label": "Move the filtered features into Leaflet."
    }
  ],
  "correct": "B",
  "success": "Correct! state.places remains the complete dataset. visibleFeatures() decides which subset should currently be displayed.",
  "hint": "Think about how we can return to All categories without requesting the file again."
}
```

<!-- OPTIONAL VIDEO SLOT
Suggested clip: "Derived State and One Render Function"
Suggested length: 60 seconds
Place it here if you record one.
-->

---

# 🛠️ Your Turn 1 - Add the Category Filter

In `index.html`, add this after the status and before the place list:

```html
<div class="filter">
  <label for="category-filter" class="filter__label"> Category </label>

  <select id="category-filter" class="filter__select">
    <option value="all">All categories</option>
    <option value="Culture & Community">Culture & Community</option>
    <option value="Education & Religion">Education & Religion</option>
    <option value="Civic & Institutional">Civic & Institutional</option>
    <option value="Commercial & Industrial">Commercial & Industrial</option>
    <option value="Residential">Residential</option>
  </select>
</div>
```

The option values need to match the GeoJSON categories exactly.

---

# 🛠️ Your Turn 2 - Style the Filter

In `styles.css`, add:

```css
.filter {
  display: grid;
  gap: 0.35rem;
  margin: 1rem 0;
}

.filter__label {
  font-size: 0.85rem;
  font-weight: 700;
}

.filter__select {
  width: 100%;
  padding: 0.6rem;
  font: inherit;
}
```

---

# 🛠️ Your Turn 3 - Add Category State

In `main.js`, change state to:

```js
const state = {
  places: [],
  category: "all",
  selectedId: null,
};
```

Then add the filter element to your DOM references:

```js
const categoryFilter = document.querySelector("#category-filter");
```

---

# 🛠️ Your Turn 4 - Create `visibleFeatures()`

After the sidebar rendering section, add:

```js
// --------------------------------------------------
// FILTERING
// --------------------------------------------------

function visibleFeatures() {
  if (state.category === "all") {
    return state.places;
  }

  return state.places.filter(
    (feature) => feature.properties.category === state.category,
  );
}
```

This derives the current display list without replacing the original dataset.

---

```activity
{
  "type": "reveal",
  "eyebrow": "🔮 Predict It",
  "title": "What Changes?",
  "prompt": "Suppose state.category becomes Residential. What should happen to visibleFeatures() and state.places?",
  "context": "state.category = \"Residential\";",
  "buttonLabel": "Reveal prediction",
  "answer": "visibleFeatures() should return only Residential features, but state.places should still contain the complete dataset. That lets us return to All categories without fetching the file again."
}
```

---

# 🛠️ Your Turn 5 - Create One Render Function

After the selection section, add:

```js
// --------------------------------------------------
// CENTRAL RENDER FUNCTION
// --------------------------------------------------

function render() {
  const features = visibleFeatures();

  renderMap(features);

  renderList(features);

  setStatus(`${features.length} historic places`);
}
```

Now one function updates the map, sidebar, and status from the current state.

---

```activity
{
  "type": "fill-blank",
  "eyebrow": "🧠 Fill It In",
  "title": "One Render Path",
  "prompt": "Complete the missing step in the shared render flow.",
  "context": "state\n  ↓\nvisibleFeatures()\n  ↓\n____________\n  ↓\nmap + sidebar + status",
  "answers": [
    "render()",
    "render"
  ],
  "placeholder": "Type the missing function",
  "success": "Correct! One render() function helps both views stay in sync because they receive the same current feature array.",
  "hint": "It is the central function we just added."
}
```

---

# 🛠️ Your Turn 6 - Use `render()` After Loading

Update `loadPlaces()` to:

```js
async function loadPlaces() {
  const features = await fetchPlaces(appConfig.dataUrl);

  state.places = features;

  render();

  fitMapToPlaces();
}
```

We still fit the map only after the initial load.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🐛 Spot the Bug",
  "title": "Category Values Must Match",
  "prompt": "The GeoJSON category is Residential, but the option value is residential. Will the strict comparison match?",
  "context": "feature.properties.category === state.category",
  "options": [
    {
      "value": "A",
      "label": "Yes, JavaScript ignores capitalization in strings."
    },
    {
      "value": "B",
      "label": "No, string comparison is exact."
    },
    {
      "value": "C",
      "label": "Yes, because the visible option text still says Residential."
    }
  ],
  "correct": "B",
  "success": "Correct! \"Residential\" and \"residential\" are different strings. The option values need to match the GeoJSON categories exactly.",
  "hint": "The comparison uses ===."
}
```

---

# 🛠️ Your Turn 7 - Respond to Filter Changes

In the event handlers section, add:

```js
categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;

  state.selectedId = null;

  render();
});
```

Save and refresh.

---

# 🎉 Checkpoint

Choose a category.

You should see:

- fewer markers
- fewer cards
- updated count
- map and sidebar showing the same places
- previous selection cleared

Return to `All categories` and everything should come back.

---

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "In One Sentence",
  "prompt": "Why do we call the same render() function for both initial loading and filter changes?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "Because render() redraws every visible view from the application’s current state."
}
```

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

If you're ahead, pick one.

## Change the status message

```js
setStatus(`${features.length} places shown`);
```

## Rename the filter label

Try `Show`, `Place type`, or `Filter places`.

## Change the option order

Reorder the `<option>` elements in HTML.

Want more filtering ideas? Find them under **Explore More → ✨ Make It Yours** in the workshop navigation.

## <!-- OPTIONAL-END -->

# ✅ Check Your Work

Verify:

- [ ] All categories shows every place.
- [ ] Choosing a category changes the map.
- [ ] Choosing a category changes the sidebar.
- [ ] The map and sidebar show the same subset.
- [ ] The status count updates.
- [ ] Returning to all restores every place.
- [ ] Changing the filter clears selection.
- [ ] Selection still works after filtering.
- [ ] Filtering does not unnecessarily refit the map.
- [ ] There are no unexpected errors from your application code.

If something isn't working, use the completed checkpoint below to recover and keep moving.

---

# Next

Continue to:

## 06 - Polish the Application

Next we'll handle loading, errors, empty results, and responsive layout.
