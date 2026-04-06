function pokemonOverviewTemplate(pokemonName, pokemonId, pokemon, firstType, typeIconsHtml, typeNamesHtml) {
  const pokemonTypes = pokemon.types.map((type) => type.type.name).join(",");

  return /*html*/ `
    <article 
      class="pokemon-card type-${firstType}" 
      data-name="${pokemon.name.toLowerCase()}"
      data-id="${pokemon.id}"
      data-types="${pokemonTypes}"
      onclick="renderOverlay(${pokemon.id})"
    >
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

function pokemonDetailTemplate(pokemon, pokemonName, firstType, typeNamesHtml, pokemonIdFormated) {
    return /*html*/ `
        <div class="pokemon-detail type-${firstType}">
            <div class="detail-header">
                <span class="pokemon-number">#${pokemonIdFormated}</span>
                <h2 class="pokemon-name">${pokemonName}</h2>
            </div>
            <div class="detail-image-wrap">
                <img class="detail-image" src="${pokemon.sprites.other.showdown.front_default}" alt="${pokemonName}">
            </div>
            <div class="detail-types">
                ${typeNamesHtml}
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
                    <ul class='moves-list'>
                        ${renderMovesTab(pokemon)}
                    </ul>
                </div>
                <div id="evolution" class="tab-pane">
                    ${renderEvolutionTab()}
                </div>
            </div>
            <div class="detail-navigation">
                <button class="nav-btn" onclick="showPreviousPokemon()">←</button>
                <button class="nav-btn" onclick="showNextPokemon()">→</button>
            </div>
        </div>
    `;
}

function detailAboutTabTemplate(pokemon){
    return /*html*/`
        <p><strong>Height:</strong> ${pokemon.height}</p>
        <p><strong>Weight:</strong> ${pokemon.weight}</p>
        <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
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