export const state = {
  places: [],
  category: "all",
  selectedId: null,
};

export function setPlaces(features) {
  state.places = features;
}

export function setCategory(category) {
  state.category = category;
}

export function setSelectedId(id) {
  state.selectedId = id;
}

export function visibleFeatures() {
  if (state.category === "all") {
    return state.places;
  }

  return state.places.filter(
    (feature) => feature.properties.category === state.category,
  );
}
