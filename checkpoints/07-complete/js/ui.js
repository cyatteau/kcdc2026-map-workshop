const appTitle = document.querySelector("#app-title");

const placeList = document.querySelector("#place-list");

const statusElement = document.querySelector("#status");

const categoryFilter = document.querySelector("#category-filter");

export function setAppTitle(cityName) {
  appTitle.textContent = `${cityName} Explorer`;
}

export function setStatus(message) {
  statusElement.textContent = message;
}

export function renderList(features) {
  placeList.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (const feature of features) {
    const { id, name, category, description } = feature.properties;

    const item = document.createElement("li");

    const button = document.createElement("button");

    button.type = "button";
    button.className = "place-card";

    button.dataset.placeId = String(id);

    const title = document.createElement("strong");

    title.className = "place-card__title";

    title.textContent = name;

    const categoryElement = document.createElement("span");

    categoryElement.className = "place-card__category";

    categoryElement.textContent = category;

    button.append(title, categoryElement);

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
