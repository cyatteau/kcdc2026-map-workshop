export const state = {
  places: [],
  category: "all",
  selectedId: null,
  favoriteIds: [],
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
