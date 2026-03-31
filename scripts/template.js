function pokemonNameTemplate(pokemonName, pokemon, typeData) {
  const firstType = typeData.typeNames[0];
  const typeIconsHtml = renderTypeIcons(typeData.typeIcons, typeData.typeNames);
  const typeNamesHtml = renderTypeNames(typeData.typeNames);

  return /*html*/ `
        <article class="pokemon-card type-${firstType}" onclick="openOverlay(${pokemon.id})">
            <div class="card-top">
                <span class="pokemon-number">#${pokemon.id}</span>
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

function pokemonDetailTemplate(pokemon, typeData) {
  const pokemonName = capitalize(pokemon.name);
  const firstType = typeData.typeNames[0];
  const typeNamesHtml = renderTypeNames(typeData.typeNames);

  return /*html*/ `
        <div class="pokemon-detail type-${firstType}">
            
            <!-- HEADER -->
            <div class="detail-header">
                <span class="pokemon-number">#${pokemon.id}</span>
                <h2 class="pokemon-name">${pokemonName}</h2>
            </div>

            <!-- IMAGE -->
            <div class="detail-image-wrap">
                <img 
                    class="detail-image" 
                    src="${pokemon.sprites.other.showdown.front_default}" 
                    alt="${pokemonName}"
                >
            </div>

            <!-- TYPES -->
            <div class="detail-types">
                ${typeNamesHtml}
            </div>

            <!-- TABS -->
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab(event, 'about')">About</button>
                <button class="tab-btn" onclick="switchTab(event, 'stats')">Base Stats</button>
                <button class="tab-btn" onclick="switchTab(event, 'moves')">Moves</button>
                <button class="tab-btn" onclick="switchTab(event, 'evolution')">Evolution</button>
            </div>

            <!-- TAB CONTENT -->
            <div class="tab-content">

                <!-- ABOUT -->
                <div id="about" class="tab-pane active">
                    ${renderAboutTab(pokemon)}
                </div>

                <!-- STATS -->
                <div id="stats" class="tab-pane">
                    ${renderStatsTab(pokemon)}
                </div>

                <!-- MOVES -->
                <div id="moves" class="tab-pane">
                    ${renderMovesTab(pokemon)}
                </div>
                <div id="evolution" class="tab-pane">
        ${renderEvolutionTab()}
    </div>

            </div>

            <!-- NAV -->
            <div class="detail-navigation">
                <button class="nav-btn" onclick="showPreviousPokemon()">←</button>
                <button class="nav-btn" onclick="showNextPokemon()">→</button>
            </div>

        </div>
    `;
}
