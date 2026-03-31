const POKEMON_FIRST_40 = "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0";

let urlNextGlobal = "";
let urlPrevGlobal = "";
let currentPokemonId = 1;

function init() {
  addEventListeners();
  renderPokemonNames(POKEMON_FIRST_40);
}

function addEventListeners() {
  const nextBtn = document.getElementById("next-btn");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (urlNextGlobal) {
        renderPokemonNames(urlNextGlobal);
      }
    });
  }
}

async function renderPokemonNames(url) {
  const pokemonArray = await loadPokemonData(url);
  const pokemonNamesConRef = document.getElementById("pokemon-names-container");

  urlNextGlobal = pokemonArray.next;
  urlPrevGlobal = pokemonArray.previous;

  for (let index = 0; index < pokemonArray.results.length; index++) {
    const pokemon = pokemonArray.results[index];
    const pokemonData = await loadPokemonData(pokemon.url);

    const pokemonName = capitalize(pokemonData.name);
    const typeData = await getPokemonTypeData(pokemonData);

    pokemonNamesConRef.innerHTML += pokemonNameTemplate(pokemonName,pokemonData,typeData);
  }
}

async function loadPokemonData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log("Fehler beim Laden der Pokemon-Liste:", error);
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function getPokemonTypeData(pokemon) {
  let typeNames = [];
  let typeIcons = [];

  for (let index = 0; index < pokemon.types.length; index++) {
    const typeName = pokemon.types[index].type.name;
    const typeUrl = pokemon.types[index].type.url;
    const typeData = await loadPokemonData(typeUrl);
    const icon = typeData?.sprites?.["generation-viii"]?.["sword-shield"]?.symbol_icon;

    typeNames.push(typeName);
    typeIcons.push(icon);
  }

  return { typeNames, typeIcons };
}

function renderTypeIcons(typeIcons, typeNames) {
  let html = "";

  for (let i = 0; i < typeIcons.length; i++) {
    if (typeIcons[i]) {
      html += `<img class="type-icon" src="${typeIcons[i]}" alt="${typeNames[i]}">`;
    }
  }
  return html;
}

function renderTypeNames(typeNames) {
  let html = "";

  for (let i = 0; i < typeNames.length; i++) {
    html += `<span class="type-badge type-${typeNames[i]}">${capitalize(typeNames[i])}</span>`;
  }

  return html;
}

async function openOverlay(pokemonId) {
  currentPokemonId = pokemonId;

  const overlayRef = document.getElementById("pokemon-overlay");
  const overlayBodyRef = document.getElementById("overlay-body");

  overlayRef.classList.remove("d-none");
  overlayBodyRef.innerHTML = "<p>Lade Pokémon...</p>";

  const pokemonData = await loadPokemonData(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const typeData = await getPokemonTypeData(pokemonData);

  overlayBodyRef.innerHTML = pokemonDetailTemplate(pokemonData, typeData);

  await loadEvolutionChain(pokemonData);
}

function showPreviousPokemon() {
  if (currentPokemonId > 1) {
    openOverlay(currentPokemonId - 1);
  }
}

function showNextPokemon() {
  openOverlay(currentPokemonId + 1);
}

function closeOverlay() {
  document.getElementById("pokemon-overlay").classList.add("d-none");
}

function switchTab(event, tabId) {
  // Buttons reset
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Tabs reset
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });

  // Activate clicked
  event.target.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

function renderAboutTab(pokemon) {
  return `
    <p><strong>Height:</strong> ${pokemon.height}</p>
    <p><strong>Weight:</strong> ${pokemon.weight}</p>
    <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
  `;
}

function renderStatsTab(pokemon) {
  let html = "";

  pokemon.stats.forEach(stat => {
    const value = stat.base_stat;
    const statClass = getStatColorClass(value);

    html += `
      <div class="stat-row">
        <span class="stat-name">${formatStatName(stat.stat.name)}</span>
        <div class="stat-bar">
          <div class="stat-fill ${statClass}" style="width: ${Math.min(value, 200) / 2}%"></div>
        </div>
        <span class="stat-value">${value}</span>
      </div>
    `;
  });

  return html;
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
    speed: "Speed"
  };

  return statNames[statName] || capitalize(statName);
}

function renderMovesTab(pokemon) {
  let html = "<ul class='moves-list'>";

  pokemon.moves.slice(0, 10).forEach(move => {
    html += `<li>${capitalize(move.move.name)}</li>`;
  });

  html += "</ul>";
  return html;
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
    const evolutionChainData = await loadPokemonData(speciesData.evolution_chain.url);

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
      evolutionContentRef.innerHTML = "<p>Entwicklung konnte nicht geladen werden.</p>";
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

    html += `
      <div class="evolution-card" onclick="openOverlay(${pokemonData.id})">
        <img 
          class="evolution-image" 
          src="${pokemonData.sprites.other.home.front_default}" 
          alt="${pokemonName}"
        >
        <span class="evolution-name">${pokemonName}</span>
        <span class="evolution-id">#${String(pokemonData.id).padStart(3, "0")}</span>
      </div>
    `;

    if (i < evolutionNames.length - 1) {
      html += `<div class="evolution-arrow">→</div>`;
    }
  }

  html += `</div>`;
  return html;
}