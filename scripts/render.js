async function renderPokemonOverview(url) {
  if (loadedPokemonCount >= POKEMON_LIMIT) return;

  const pokemonArray = await loadPokemonData(url);
  const pokemonOverviewConRef = document.getElementById("pokemon-overview-container");

  urlNextGlobal = pokemonArray.next;

  const remaining = POKEMON_LIMIT - loadedPokemonCount;
  const maxToLoad = Math.min(pokemonArray.results.length, remaining);

  for (let index = 0; index < maxToLoad; index++) {
    const pokemon = pokemonArray.results[index];
    const pokemonData = await loadPokemonData(pokemon.url);
    const pokemonName = capitalize(pokemonData.name);
    const pokemonId = formatId(pokemonData.id);
    const typeData = await getPokemonTypeData(pokemonData);
    const firstType = typeData.typeNames[0];
    const typeIconsHtml = renderTypeIcons(typeData.typeIcons, typeData.typeNames);
    const typeNamesHtml = renderTypeNames(typeData.typeNames);

    loadedPokemonList.push(pokemonData);

    pokemonOverviewConRef.innerHTML += pokemonOverviewTemplate(
      pokemonName,
      pokemonId,
      pokemonData,
      firstType,
      typeIconsHtml,
      typeNamesHtml,
    );

    loadedPokemonCount++;
  }
  handleLoadMoreButton();
  await updateTypeFilterOptions();
  applyFilters();
}

async function renderFilteredPokemonList(list) {
  const container = document.getElementById("pokemon-overview-container");
  container.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    const pokemonData = list[i];
    const pokemonName = capitalize(pokemonData.name);
    const pokemonId = formatId(pokemonData.id);
    const typeData = await getPokemonTypeData(pokemonData);

    container.innerHTML += pokemonOverviewTemplate(
      pokemonName,
      pokemonId,
      pokemonData,
      typeData.typeNames[0],
      renderTypeIcons(typeData.typeIcons, typeData.typeNames),
      renderTypeNames(typeData.typeNames)
    );
  }
}

async function renderOverlay(pokemonId) {
  currentPokemonId = pokemonId;

  const overlayRef = document.getElementById("pokemon-overlay");
  const overlayBodyRef = document.getElementById("overlay-body");
  const pokemonData = await loadPokemonData(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`,);
  const typeData = await getPokemonTypeData(pokemonData);
  const pokemonName = capitalize(pokemonData.name);
  const pokemonIdFormated = formatId(pokemonData.id);
  const firstType = typeData.typeNames[0];
  const typeNamesHtml = renderTypeNames(typeData.typeNames);

  overlayRef.classList.remove("d-none");
  overlayBodyRef.innerHTML = pokemonDetailTemplate(pokemonData, pokemonName, firstType, typeNamesHtml, pokemonIdFormated);

  await loadEvolutionChain(pokemonData);
}

function renderAboutTab(pokemon) {
    html = detailAboutTabTemplate(pokemon);
    return html;
}

function renderStatsTab(pokemon) {
  let html = "";

  for (let i = 0; i < pokemon.stats.length; i++) {
    const stat = pokemon.stats[i];
    const value = stat.base_stat;
    const statClass = getStatColorClass(value);
    const statName = formatStatName(stat.stat.name);

    html += detailStatsTabTemplate(statClass, value, statName);
  }
  return html;
}

function renderMovesTab(pokemon) {
  let html = "";
  const moves = pokemon.moves.slice(0, 10);

  for (let i = 0; i < moves.length; i++) {
    const moveName = moves[i].move.name;
    const moveNameFormated = formatMoveName(moveName);
    html += detailMovesTabTemplate(moveNameFormated);
  }
  return html;
}