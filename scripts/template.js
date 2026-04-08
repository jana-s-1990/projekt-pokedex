function pokemonOverviewTemplate(pokemonName, pokemonId, pokemon, firstType, typeIconsHtml, typeNamesHtml, pokemonTypes) {
  return /*html*/ `
    <article class="pokemon-card type-${firstType}" data-name="${pokemon.name.toLowerCase()}" data-id="${pokemon.id}" data-types="${pokemonTypes}" onclick="renderOverlay(${pokemon.id})">
      <div class="card-top">
        <span class="pokemon-number">#${pokemonId}</span>
        <div class="type-icons">
          ${typeIconsHtml}
        </div>
      </div>
      <div class="card-image-wrap">
        <img class="card-image static" src="${pokemon.sprites.other.home.front_default}" alt="${pokemonName}">
        <img class="card-image animated" src="${pokemon.sprites.other.showdown.front_default}" alt="${pokemonName}">
      </div>
      <div class="card-content">
        <h2 class="pokemon-name">${pokemonName}</h2>
        <div class="type-list">
          ${typeNamesHtml}
        </div>
      </div>
    </article>
  `;
}

function typeIconsTemplate(index, typeIcons, typeNames){
    return /*html*/`
        <img class="type-icon" src="${typeIcons[index]}" alt="${typeNames[index]}">
    `;
}

function typeNamesTemplate(index, typeNames){
    return /*html*/`
        <span class="type-badge type-${typeNames[index]}">${capitalize(typeNames[index])}</span>
    `;
}

function noPokemonFoundTemplate(searchValue) {
  return /*html*/ `
    <div class="no-pokemon-found">
      <div class="pokedex-screen">
        <div class="pokedex-screen-header">
          <span class="pokedex-status">STATUS: NO DATA</span>
        </div>
        <div class="pokedex-body">
          <h2>No Entry Found</h2>
          <p>Filter input: <strong>${searchValue}</strong></p>
          <p>No matching Pokémon has been registered in this Pokédex.</p>
        </div>
        <div class="pokedex-footer">
          <span>Try another search or type filter.</span>
        </div>
      </div>
    </div>
  `;
}

function searchAllTypesOptionTemplate() {
  return `
    <button class="type-filter-option active-option" type="button" data-value="all">
      <span>All Loaded Types</span>
    </button>
  `;
}

function searchSingleTypeOptionTemplate(type) {
  return `
    <button class="type-filter-option" type="button" data-value="${type.name}">
      ${searchTypeIconTemplate(type)}
      <span>${capitalize(type.name)}</span>
    </button>
  `;
}

function searchTypeIconTemplate(type) {
  if (!type.icon) return "";
  return `<img class="type-filter-icon" src="${type.icon}" alt="${type.name}">`;
}

function searchDefaultTypeFilterTriggerTemplate() {
  return `
    <span class="type-filter-label">All Loaded Types</span>
    ${searchTypeFilterArrowTemplate()}
  `;
}

function searchSelectedTypeFilterTriggerTemplate(selectedOptionHTML) {
  return `
    <span class="type-filter-selected">
      ${selectedOptionHTML}
    </span>
    ${searchTypeFilterArrowTemplate()}
  `;
}

function searchTypeFilterArrowTemplate() {
  return `<span class="type-filter-arrow">⌄</span>`;
}

function pokemonDetailTemplate(pokemon, pokemonName, firstType, typeNamesHtml, pokemonIdFormated) {
  return /*html*/ `
    <div class="pokemon-detail type-${firstType}">
      <div class="detail-top">
        <div class="detail-header-row">
            <span class="pokemon-number">#${pokemonIdFormated}</span>
            <button class="close-btn" onclick="closeOverlay()">✕</button>
        </div>
        <h2 class="pokemon-name-detail">${pokemonName}</h2>
        <div class="detail-types">
            ${typeNamesHtml}
        </div>
        <div class="detail-image-wrap">
            <img class="detail-image" src="${pokemon.sprites.other.showdown.front_default}" alt="${pokemonName}">
        </div>
    </div>
    <div class="detail-navigation">
        <button class="nav-btn prev" onclick="showPreviousPokemon()">←</button>
        <button class="nav-btn next" onclick="showNextPokemon()">→</button>
      </div>

      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab(event, 'about')">About</button>
        <button class="tab-btn" onclick="switchTab(event, 'stats')">Base Stats</button>
        <button class="tab-btn" onclick="switchTab(event, 'moves')">Moves</button>
        <button class="tab-btn" onclick="switchTab(event, 'evolution')">Evolution</button>
      </div>

      <div class="tab-content">
        <div id="about" class="tab-pane active">
          ${renderAboutTab(pokemon)}
        </div>
        <div id="stats" class="tab-pane">
          ${renderStatsTab(pokemon)}
        </div>
        <div id="moves" class="tab-pane">
          <ul class="moves-list">
            ${renderMovesTab(pokemon)}
          </ul>
        </div>
        <div id="evolution" class="tab-pane">
          <div class="evolution-content">
            <div id="evolution-content" class="evolution-chain">
            </div>  
          </div>  
        </div>
      </div>
    </div>
  `;
}

function detailAboutTabTemplate(pokemon){
    return /*html*/`
        <div class="detail-about">
            <p><strong>Height:</strong> ${pokemon.height}</p>
            <p><strong>Weight:</strong> ${pokemon.weight}</p>
            <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
        </div>
    `;
}

function detailStatsTabTemplate(statClass, value, statName){
    return /*html*/`
        <div class="stat-row">
        <span class="stat-name">${statName}</span>
        <div class="stat-bar">
          <div class="stat-fill ${statClass}" style="width: ${getStatWidth(value)}%"></div>
        </div>
        <span class="stat-value">${value}</span>
      </div>
    `;
}

function detailMovesTabTemplate(moveNameFormated){
    return /*html*/`
        <li>${moveNameFormated}</li>
    `;
}

function detailNoEvolutionLoadTemplate(){
  return /*html*/`
    <p>Entwicklung konnte nicht geladen werden.</p>
  `;
}

function detailEvolutionTabTemplate(pokemonData, pokemonName, isCurrentPokemon){
  return /*html*/`
    <div class="evolution-card ${isCurrentPokemon ? "active-evolution" : ""}">
      <img class="evolution-image" src="${pokemonData.sprites.other.home.front_default}" alt="${pokemonName}">
      <span class="evolution-name">${pokemonName}</span>
      <span class="evolution-id">#${String(pokemonData.id).padStart(3, "0")}</span>
    </div>
  `;
}