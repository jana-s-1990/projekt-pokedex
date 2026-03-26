function pokemonNameTemplate(pokemonName, pokemon){
    let pokemonTypes = getPokemonType(pokemon);

    return /*html*/`
        <article class="pokemon-card type-${pokemonTypes[0]}">
            <div class="card-top">
                <span class="pokemon-number">#${pokemon.id}</span>
            </div>
            <div class="card-image-wrap">
                <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemonName}">
            </div>

            <div class="card-content">
               <h2 class="pokemon-name">${pokemonName}</h2> 
            </div>
            <div class="type-list">${pokemonTypes}</div>
        </article>
    `
}