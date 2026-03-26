const POKEMON_FIRST_40 = "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0";

let urlNextGlobal = "";
let urlPrevGlobal = "";

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
    const pokemonArray = await loadPokemonArray(url);
    if (!pokemonArray) return;

    urlNextGlobal = pokemonArray.next;
    urlPrevGlobal = pokemonArray.previous;

    const pokemonNamesConRef = document.getElementById("pokemon-names-container");
    pokemonNamesConRef.innerHTML = "";

    for (let index = 0; index < pokemonArray.results.length; index++) {
        const pokemon = pokemonArray.results[index];
        const pokemonData = await loadPokemonData(pokemon.url);

        if (!pokemonData) continue;

        const pokemonName = capitalize(pokemonData.name);
        pokemonNamesConRef.innerHTML += pokemonNameTemplate(pokemonName, pokemonData);
    }
}

async function loadPokemonArray(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log("Fehler beim Laden der Pokemon-Liste:", error);
    }
}

async function loadPokemonData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log("Fehler beim Laden der Pokemon-Daten:", error);
    }
}

function capitalize(word) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getPokemonType(pokemon) {
    const typeNames = [];

    for (let index = 0; index < pokemon.types.length; index++) {
        const type = pokemon.types[index].type.name;
        typeNames.push(type);
    }

    return typeNames;
}