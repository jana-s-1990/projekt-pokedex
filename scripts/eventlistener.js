function addNextButtonListener() {
  const nextBtn = document.getElementById("next-btn");
  if (!nextBtn) return;
  nextBtn.addEventListener("click", handleNextButtonClick);
}

function handleNextButtonClick() {
  if (urlNextGlobal && loadedPokemonCount < POKEMON_LIMIT) {
    renderPokemonOverview(urlNextGlobal);
  }
}

function addSearchInputListener() {
  const searchInput = document.querySelector(".search-input");
  if (!searchInput) return;
  searchInput.addEventListener("input", applyFilters);
}

function addTypeFilterTriggerListener() {
  const trigger = document.getElementById("type-filter-trigger");
  const menu = document.getElementById("type-filter-menu");
  if (!trigger || !menu) return;
  trigger.addEventListener("click", () => toggleTypeFilterMenu(menu));
}

function toggleTypeFilterMenu(menu) {
  menu.classList.toggle("d-none");
}

function addTypeFilterMenuListener() {
  const menu = document.getElementById("type-filter-menu");
  if (!menu) return;
  menu.addEventListener("click", handleTypeFilterMenuClick);
}

function handleTypeFilterMenuClick(event) {
  const option = event.target.closest(".type-filter-option");
  if (!option) return;
  const menu = document.getElementById("type-filter-menu");
  const value = option.dataset.value;
  setTypeFilterValue(value);
  menu.classList.add("d-none");
  applyFilters();
}

function addDocumentClickListener() {
  document.addEventListener("click", handleDocumentClick);
}

function handleDocumentClick(event) {
  const typeFilter = document.getElementById("type-filter");
  const menu = document.getElementById("type-filter-menu");
  if (!event.target.closest("#type-filter") && typeFilter && menu) {
    menu.classList.add("d-none");
  }
}