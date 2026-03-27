function pokemonNameTemplate(pokemonName, pokemon, typeData) {
    const firstType = typeData.typeNames[0];
    const typeIconsHtml = renderTypeIcons(typeData.typeIcons, typeData.typeNames);
    const typeNamesHtml = renderTypeNames(typeData.typeNames);

    return /*html*/`
        <article class="pokemon-card type-${firstType}">
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