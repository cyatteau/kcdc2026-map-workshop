const appTitle = document.querySelector("#app-title");

const placeList = document.querySelector("#place-list");

const statusElement = document.querySelector("#status");

const categoryFilter = document.querySelector("#category-filter");

const favoriteButton = document.querySelector("#favorite-button");

const exportDrawingButton = document.querySelector("#export-drawing-button");

export function setAppTitle(cityName) {
  appTitle.textContent = `${cityName} Explorer`;
}

export function setStatus(message) {
  statusElement.textContent = message;
}

export function renderList(features, favoriteIds = []) {
  placeList.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (const feature of features) {
    const { id, name, category, description } = feature.properties;
    const isFavorite = favoriteIds.includes(String(id));

    const item = document.createElement("li");

    const button = document.createElement("button");

    button.type = "button";
    button.className = "place-card";

    button.dataset.placeId = String(id);

    const title = document.createElement("strong");

    title.className = "place-card__title";

    title.textContent = name;

    const titleRow = document.createElement("span");

    titleRow.className = "place-card__title-row";

    const favorite = document.createElement("span");

    favorite.className = "place-card__favorite";

    favorite.dataset.favoriteStar = "";

    favorite.textContent = "★";

    favorite.hidden = !isFavorite;

    favorite.setAttribute("aria-hidden", "true");

    titleRow.append(title, favorite);

    const categoryElement = document.createElement("span");

    categoryElement.className = "place-card__category";

    categoryElement.textContent = category;

    button.append(titleRow, categoryElement);

    if (description) {
      const detail = document.createElement("span");

      detail.className = "place-card__description";

      detail.textContent = description;

      button.append(detail);
    }

    item.append(button);

    fragment.append(item);
  }

  placeList.append(fragment);
}

export function highlightSelectedCard(id) {
  const key = String(id);

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
}

export function bindPlaceListClick(onSelect) {
  placeList.addEventListener("click", (event) => {
    const card = event.target.closest("[data-place-id]");

    if (!card) {
      return;
    }

    onSelect(card.dataset.placeId);
  });
}

export function bindCategoryChange(onChange) {
  categoryFilter.addEventListener("change", (event) => {
    onChange(event.target.value);
  });
}

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

export function bindFavoriteClick(onToggle) {
  favoriteButton.addEventListener("click", () => {
    onToggle();
  });
}

export function bindDrawingExport(onExport) {
  exportDrawingButton.addEventListener("click", onExport);
}
