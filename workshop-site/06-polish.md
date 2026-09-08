# 06 - Polish the Application

## Goal

Make the app behave better outside the happy path.

By the end of this section, you'll have:

- a loading message
- error handling
- an empty-results message
- responsive layout behavior

We are not adding a big new feature. We are making the app more resilient.

---

# Starting Point

Start from:

```text
checkpoints/05-filtering
```

You should already have:

```text
map + data + sidebar + selection + filtering
```

In this exercise, we'll edit:

```text
main.js
styles.css
```

---

# 👀 Watch First

We'll talk about four UI states every real app eventually needs:

```text
loading
success
empty
error
```

Then we'll make our existing City Explorer handle them.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Which State Is This?",
  "prompt": "The request succeeds, but the current filter matches zero places. Which UI state is that?",
  "options": [
    {
      "value": "A",
      "label": "Loading"
    },
    {
      "value": "B",
      "label": "Success"
    },
    {
      "value": "C",
      "label": "Empty"
    },
    {
      "value": "D",
      "label": "Error"
    }
  ],
  "correct": "C",
  "success": "Correct! Nothing failed. The application simply has no results to display for the current state.",
  "hint": "The request succeeded, so this is not an error."
}
```

<!-- OPTIONAL VIDEO SLOT
Suggested clip: "The Four UI States Every App Needs"
Suggested length: 60 seconds
Place it here if you record one.
-->

---

# 🛠️ Your Turn 1 - Add an Empty State

In `render()`, replace:

```js
setStatus(`${features.length} historic places`);
```

with:

```js
if (features.length === 0) {
  setStatus("No places match this filter.");
} else {
  setStatus(`${features.length} historic places`);
}
```

Your `render()` function should now be:

```js
function render() {
  const features = visibleFeatures();

  renderMap(features);

  renderList(features);

  if (features.length === 0) {
    setStatus("No places match this filter.");
  } else {
    setStatus(`${features.length} historic places`);
  }
}
```

---

# 🛠️ Your Turn 2 - Add a Loading Message

At the beginning of `loadPlaces()`, add:

```js
setStatus(`Loading ${appConfig.name} places...`);
```

So the function starts like:

```js
async function loadPlaces() {
  setStatus(`Loading ${appConfig.name} places...`);

  // existing loading code
}
```

The message may disappear quickly on a local server. That's okay.

---

# 🛠️ Your Turn 3 - Handle Data Errors

Replace your current `loadPlaces()` with:

```js
async function loadPlaces() {
  setStatus(`Loading ${appConfig.name} places...`);

  try {
    const features = await fetchPlaces(appConfig.dataUrl);

    state.places = features;

    render();

    fitMapToPlaces();
  } catch (error) {
    console.error(error);

    setStatus(`We couldn't load the ${appConfig.name} data.`);
  }
}
```

---

# 🧪 Break It on Purpose - Missing Data

Now test the error path intentionally.

Temporarily change the Kansas City path to:

```js
dataUrl: "./data/cities/not-real.geojson",
```

Before refreshing, predict what should happen.

```activity
{
  "type": "reveal",
  "eyebrow": "🔮 Predict It",
  "title": "What Should the Error Path Do?",
  "prompt": "With the bad data URL in place, what should appear in the Console and in the user-facing status?",
  "buttonLabel": "Reveal prediction",
  "answer": "The request should fail. The detailed error should appear in the Console, while the user-facing status should say: We couldn’t load the Kansas City data."
}
```

Refresh and confirm both behaviors.

Then restore the real path before continuing.

---

# 🛠️ Your Turn 4 - Add a Responsive Layout

At the bottom of `styles.css`, add:

```css
@media (max-width: 760px) {
  .app-shell {
    height: auto;
    min-height: 100vh;
    grid-template-columns: 1fr;
    grid-template-rows: auto 60vh;
  }

  .sidebar {
    max-height: 50vh;
    border-right: 0;
    border-bottom: 1px solid #ddd;
  }

  .map {
    min-height: 60vh;
    height: 60vh;
  }
}
```

On wide screens:

```text
sidebar | map
```

On narrow screens:

```text
sidebar
map
```

---

```activity
{
  "type": "reveal",
  "eyebrow": "🔮 Predict It",
  "title": "Responsive Layout",
  "prompt": "Before resizing the browser, what should happen when the viewport becomes narrower than 760px?",
  "buttonLabel": "Reveal prediction",
  "answer": "The two-column layout should become one column:\n\nsidebar\nmap\n\nThe media query changes layout rules, not the application data or behavior."
}
```

---

# 🛠️ Your Turn 5 - Test the States

Test these intentionally:

## Loading

Refresh the page. The loading message may appear briefly.

## Error

You already tested this above by temporarily breaking the `dataUrl`.

If you want to confirm it again, verify both:

- the detailed error appears in the Console
- the user-facing status shows a useful message

## Empty

Temporarily set:

```js
category: "not-a-real-category",
```

Refresh, confirm the empty message, then restore:

```js
category: "all",
```

## Responsive

Resize the browser below 760px.

---

# 🎉 Checkpoint

You now have a complete polished single-file app:

```text
map
+ data
+ sidebar
+ selection
+ filtering
+ loading
+ error
+ empty
+ responsive layout
```

This is already a real interactive web mapping application.

---

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "In One Sentence",
  "prompt": "Why do loading, empty, and error states count as part of application behavior rather than just visual polish?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "They tell users what the application is doing when the happy path is not available."
}
```

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

If you're ahead, pick one.

## Rewrite messages

Try shorter or friendlier text for loading, errors, or empty results.

## Change the mobile breakpoint

Try:

```css
@media (max-width: 800px) {
```

or:

```css
@media (max-width: 640px) {
```

## Change the mobile map height

Try:

```css
height: 70vh;
```

Want more polish ideas? Find them under **Explore More → ✨ Make It Yours** in the workshop navigation.

<!-- OPTIONAL-END -->
---

# ✅ Check Your Work

Verify:

- [ ] The app loads normally.
- [ ] A loading message appears while data is requested.
- [ ] Data renders on the map.
- [ ] Data renders in the sidebar.
- [ ] Selection still works.
- [ ] Filtering still works.
- [ ] Empty results show a useful message.
- [ ] Failed data loading shows a useful message.
- [ ] The detailed error appears in the Console.
- [ ] Wide layout shows sidebar and map side by side.
- [ ] Narrow layout stacks sidebar above map.
- [ ] There are no unexpected errors from your application code.

If something isn't working, use the completed checkpoint below to recover and keep moving.

---

# Next

Continue to:

## 07 - Refactor Into Modules

Next we'll keep the same behavior but split the JavaScript into focused files.
