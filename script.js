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
  addNextButtonListener();
  addSearchInputListener();
  addTypeFilterTriggerListener();
  addTypeFilterMenuListener();
  addDocumentClickListener();
}

async function loadEvolutionChain(pokemon) {
  const evolutionContentRef = document.getElementById("evolution-content");
  try {
    const speciesData = await loadPokemonData(pokemon.species.url);
    const evolutionChainData = await loadPokemonData(speciesData.evolution_chain.url);
    const evolutionNames = getEvolutionNames(evolutionChainData.chain);
    const evolutionHtml = await renderEvolutionChain(evolutionNames);   
    if (evolutionContentRef) {
      evolutionContentRef.innerHTML = evolutionHtml;
    }
  } catch (error) {
    if (evolutionContentRef) {
      evolutionContentRef.innerHTML = detailNoEvolutionLoadTemplate();
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
