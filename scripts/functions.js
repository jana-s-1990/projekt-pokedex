function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatId(id) {
  return String(id).padStart(3, "0");
}

async function loadPokemonData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log("Fehler beim Laden der Pokemon:", error);
  }
}

function handleLoadMoreButton() {
  const nextBtn = document.getElementById("next-btn");
  if (!nextBtn) return;
  if (loadedPokemonCount >= POKEMON_LIMIT) {
    nextBtn.disabled = true;
    nextBtn.innerText = "All 150 Pokémon loaded";
  } else {
    nextBtn.disabled = false;
    nextBtn.innerText = "Load next Pokémon";
  }
}

function showLoadingOverlay() {
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.classList.remove("d-none");
  document.body.classList.add("no-scroll");
}

function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.classList.add("d-none");
  document.body.classList.remove("no-scroll");
}

function applyFilters() {
  const filterData = getFilterData();
  const hasMatch = filterPokemonCards(filterData);
  resetSearchStatus(filterData.searchStatusRef);
  if (noFilterActive(filterData)) {
    showAllPokemonCards(filterData.allCards);
    showNextButton(filterData.nextBtn);
    return;
  }
  hideNextButton(filterData.nextBtn);
  if (!hasMatch) {
    renderNoPokemonFound(filterData);
  }
  updateNavigationButtons();
}

function getFilterData() {
  const searchValue = getSearchValue();
  const selectedType = getSelectedType();
  return {
    searchValue,
    selectedType,
    nextBtn: document.getElementById("next-btn"),
    allCards: document.querySelectorAll(".pokemon-card"),
    searchStatusRef: document.getElementById("search-status"),
    isSearchActive: searchValue.length > 0,
    isTypeFilterActive: selectedType !== "all",
  };
}

function getSearchValue() {
  return document.querySelector(".search-input").value.toLowerCase().trim();
}

function getSelectedType() {
  return document.getElementById("type-filter-trigger").dataset.value;
}

function resetSearchStatus(searchStatusRef) {
  searchStatusRef.innerHTML = "";
}

function noFilterActive(filterData) {
  return !filterData.isSearchActive && !filterData.isTypeFilterActive;
}

function showAllPokemonCards(allCards) {
  allCards.forEach((card) => {
    card.style.display = "flex";
  });
}

function showNextButton(nextBtn) {
  nextBtn.style.display = "block";
}

function hideNextButton(nextBtn) {
  nextBtn.style.display = "none";
}

function filterPokemonCards(filterData) {
  let hasMatch = false;
  filterData.allCards.forEach((card) => {
    const matches = matchesCard(card, filterData);
    if (matches) {
      card.style.display = "flex";
      hasMatch = true;
    } else {
      card.style.display = "none";
    }
  });
  return hasMatch;
}

function matchesCard(card, filterData) {
  return matchesSearch(card, filterData) && matchesType(card, filterData);
}

function matchesSearch(card, filterData) {
  if (!filterData.isSearchActive) return true;
  const pokemonName = card.dataset.name;
  const pokemonId = card.dataset.id;
  const formattedId = pokemonId.padStart(3, "0");
  return (
    pokemonName.includes(filterData.searchValue) ||
    pokemonId.includes(filterData.searchValue) ||
    formattedId.includes(filterData.searchValue)
  );
}

function matchesType(card, filterData) {
  if (!filterData.isTypeFilterActive) return true;
  const pokemonTypes = card.dataset.types.split(",");
  return pokemonTypes.includes(filterData.selectedType);
}

function renderNoPokemonFound(filterData) {
  const infoText = filterData.searchValue || capitalize(filterData.selectedType);
  filterData.searchStatusRef.innerHTML = noPokemonFoundTemplate(infoText);
}


async function getPokemonTypeData(pokemon) {
  let typeNames = [];
  let typeIcons = [];
  for (let index = 0; index < pokemon.types.length; index++) {
    const typeName = pokemon.types[index].type.name;
    const typeUrl = pokemon.types[index].type.url;
    const typeData = await getTypeData(typeUrl);
    const icon = typeData?.sprites?.["generation-viii"]?.["sword-shield"]?.symbol_icon || "";
    typeNames.push(typeName);
    typeIcons.push(icon);
  }
  return {
    typeNames: typeNames,
    typeIcons: typeIcons,
  };
}

async function getTypeData(typeUrl) {
  if (typeDataCache[typeUrl]) {
    return typeDataCache[typeUrl];
  }
  const typeData = await loadPokemonData(typeUrl);
  typeDataCache[typeUrl] = typeData;
  return typeData;
}

async function updateTypeFilterOptions() {
  const typeFilterMenu = document.getElementById("type-filter-menu");
  const currentValue = document.getElementById("type-filter-trigger").dataset.value;
  const availableTypes = await getAvailableTypes();

  typeFilterMenu.innerHTML = renderTypeFilterOptions(availableTypes);

  const stillExists = availableTypes.some((type) => type.name === currentValue);

  if (currentValue === "all" || !stillExists) {
    setTypeFilterValue("all");
  } else {
    setTypeFilterValue(currentValue);
  }
}

async function getAvailableTypes() {
  const typeMap = new Map();
  for (let i = 0; i < loadedPokemonList.length; i++) {
    const pokemon = loadedPokemonList[i];
    for (let j = 0; j < pokemon.types.length; j++) {
      const typeName = pokemon.types[j].type.name;
      const typeUrl = pokemon.types[j].type.url;
      const typeData = await getTypeData(typeUrl);
      const icon = typeData?.sprites?.["generation-viii"]?.["sword-shield"]?.symbol_icon || "";
      if (!typeMap.has(typeName)) {
        typeMap.set(typeName, {
          name: typeName,
          icon: icon,
        });
      }
    }
  }
  return Array.from(typeMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function setTypeFilterValue(value) {
  const trigger = document.getElementById("type-filter-trigger");
  const typeFilterMenu = document.getElementById("type-filter-menu");
  const selectedOption = typeFilterMenu.querySelector(`[data-value="${value}"]`);
  trigger.dataset.value = value;
  if (value === "all" || !selectedOption) {
    trigger.innerHTML = searchDefaultTypeFilterTriggerTemplate();
    return;
  }
  trigger.innerHTML = searchSelectedTypeFilterTriggerTemplate(selectedOption.innerHTML);
}

function renderTypeIcons(typeIcons, typeNames) {
  let html = "";
  for (let i = 0; i < typeIcons.length; i++) {
    html += typeIconsTemplate(i, typeIcons, typeNames);
  }
  return html;
}

function renderTypeNames(typeNames) {
  let html = "";
  for (let i = 0; i < typeNames.length; i++) {
    html += typeNamesTemplate(i, typeNames);
  }
  return html;
}

function handleSearchInput(event) {
  const searchValue = event.target.value.toLowerCase().trim();
  const nextBtn = document.getElementById("next-btn");
  const allCards = document.querySelectorAll(".pokemon-card");
  const searchStatusRef = document.getElementById("search-status");
  searchStatusRef.innerHTML = "";
  if (searchValue.length === 0) {
    allCards.forEach((card) => {
      card.style.display = "flex";
    });
    nextBtn.style.display = "block";
    return;
  }

  nextBtn.style.display = "none";
  let hasMatch = false;
  allCards.forEach((card) => {
    const pokemonName = card.dataset.name;
    const pokemonId = card.dataset.id;
    const formattedId = pokemonId.padStart(3, "0");
    const matchesName = pokemonName.includes(searchValue);
    const matchesId = pokemonId.includes(searchValue) || formattedId.includes(searchValue);
    if (matchesName || matchesId) {
      card.style.display = "flex";
      hasMatch = true;
    } else {
      card.style.display = "none";
    }
  });
  if (!hasMatch) {
    searchStatusRef.innerHTML = noPokemonFoundTemplate(searchValue);
  }
}

function getVisiblePokemonIds() {
  const visibleCards = Array.from(document.querySelectorAll(".pokemon-card")).filter((card) => card.style.display !== "none");
  return visibleCards.map((card) => Number(card.dataset.id));
}

function showPreviousPokemon() {
  const visiblePokemonIds = getVisiblePokemonIds();
  const currentIndex = visiblePokemonIds.indexOf(currentPokemonId);
  if (currentIndex > 0) {
    renderOverlay(visiblePokemonIds[currentIndex - 1]);
  }
}

function showNextPokemon() {
  const visiblePokemonIds = getVisiblePokemonIds();
  const currentIndex = visiblePokemonIds.indexOf(currentPokemonId);
  if (currentIndex !== -1 && currentIndex < visiblePokemonIds.length - 1) {
    renderOverlay(visiblePokemonIds[currentIndex + 1]);
  }
}

function updateNavigationButtons() {
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");
  if (!prevBtn || !nextBtn) return;
  const visiblePokemonIds = getVisiblePokemonIds();
  const currentIndex = visiblePokemonIds.indexOf(currentPokemonId);
  if (currentIndex <= 0) {
    prevBtn.classList.add("disabled");
  } else {
    prevBtn.classList.remove("disabled");
  }
  if (currentIndex === -1 || currentIndex >= visiblePokemonIds.length - 1) {
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
  }
}

function closeOverlay() {
  document.getElementById("pokemon-overlay").classList.add("d-none");
}

function switchTab(event, tabId) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });
  event.target.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

function getStatColorClass(value) {
  if (value < 40) return "stat-low";
  if (value < 70) return "stat-medium";
  if (value < 100) return "stat-good";
  if (value < 130) return "stat-very-good";
  return "stat-excellent";
}

function formatStatName(statName) {
  const statNames = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };
  return statNames[statName] || capitalize(statName);
}

function getStatWidth(value, max = 200) {
  return (Math.min(value, max) / max) * 100;
}

function formatMoveName(moveName) {
  return moveName
    .replace(/-/g, " ")
    .split(" ")
    .map(word => capitalize(word))
    .join(" ");
}