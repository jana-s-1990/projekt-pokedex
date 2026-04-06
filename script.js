const POKEMON_FIRST_40 = "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0";
const POKEMON_LIMIT = 150;
let loadedPokemonCount = 0;
let loadedPokemonList = [];
let typeDataCache = {};

let urlNextGlobal = "";
let currentPokemonId = 1;

function init() {
  addEventListeners();
  renderPokemonOverview(POKEMON_FIRST_40);
}

function addEventListeners() {
  const nextBtn = document.getElementById("next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (urlNextGlobal && loadedPokemonCount < POKEMON_LIMIT) {
        renderPokemonOverview(urlNextGlobal);
      }
    });
  }

  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  const typeFilterTrigger = document.getElementById("type-filter-trigger");
  const typeFilterMenu = document.getElementById("type-filter-menu");
  const typeFilter = document.getElementById("type-filter");

  if (typeFilterTrigger) {
    typeFilterTrigger.addEventListener("click", () => {
      typeFilterMenu.classList.toggle("d-none");
    });
  }

  if (typeFilterMenu) {
    typeFilterMenu.addEventListener("click", (event) => {
      const option = event.target.closest(".type-filter-option");
      if (!option) return;

      const value = option.dataset.value;
      setTypeFilterValue(value);
      typeFilterMenu.classList.add("d-none");
      applyFilters();
    });
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest("#type-filter") && typeFilter) {
      typeFilterMenu.classList.add("d-none");
    }
  });
}

function renderEvolutionTab() {
  return `
    <div id="evolution-content" class="evolution-content">
      <p>Lade Entwicklung...</p>
    </div>
  `;
}

async function loadEvolutionChain(pokemon) {
  try {
    const speciesData = await loadPokemonData(pokemon.species.url);
    const evolutionChainData = await loadPokemonData(
      speciesData.evolution_chain.url,
    );

    const evolutionNames = getEvolutionNames(evolutionChainData.chain);
    const evolutionHtml = await renderEvolutionChain(evolutionNames);

    const evolutionContentRef = document.getElementById("evolution-content");
    if (evolutionContentRef) {
      evolutionContentRef.innerHTML = evolutionHtml;
    }
  } catch (error) {
    console.log("Fehler beim Laden der Entwicklungskette:", error);

    const evolutionContentRef = document.getElementById("evolution-content");
    if (evolutionContentRef) {
      evolutionContentRef.innerHTML =
        "<p>Entwicklung konnte nicht geladen werden.</p>";
    }
  }
}

function getEvolutionNames(chain) {
  let evolutions = [];
  let current = chain;

  while (current) {
    evolutions.push(current.species.name);
    current = current.evolves_to[0];
  }

  return evolutions;
}

async function renderEvolutionChain(evolutionNames) {
  let html = `<div class="evolution-chain">`;

  for (let i = 0; i < evolutionNames.length; i++) {
    const pokemonData = await loadPokemonData(`https://pokeapi.co/api/v2/pokemon/${evolutionNames[i]}`);
    const pokemonName = capitalize(pokemonData.name);
    const isCurrentPokemon = pokemonData.id === currentPokemonId;

    html += `
      <div class="evolution-card ${isCurrentPokemon ? "active-evolution" : ""}">
        <img 
          class="evolution-image" 
          src="${pokemonData.sprites.other.home.front_default}" 
          alt="${pokemonName}"
        >
        <span class="evolution-name">${pokemonName}</span>
        <span class="evolution-id">#${String(pokemonData.id).padStart(3, "0")}</span>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}
