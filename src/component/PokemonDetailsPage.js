import React, { useContext, useEffect } from "react";
import PokemonContext from "../hooks/PokemonContext";
import { useParams, useNavigate } from "react-router-dom";

const PokemonDetailsPage = () => {
  const { pokemon } = useContext(PokemonContext);
  let navigate = useNavigate();

  const { pokemanId } = useParams();
  console.log("detail: " + pokemanId);
  const { addPokemon } = useContext(PokemonContext);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (Object.keys(pokemon).length === 0) {
    fetchPokemonDetail();
  }

  async function fetchPokemonDetail() {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemanId}`;
    const result = await fetch(url).then((res) => res.json());

    const pokemondetail = {
      name: result.name,
      image: result.sprites.other.dream_world.front_default,
      type: result.types.map((type) => type.type.name).join(", "),
      id: result.id,
      height: result.height,
      weight: result.weight,
      ablities: result.abilities
        .map((ability) => ability.ability.name)
        .join(","),
      stats: result.stats,
    };

    addPokemon(pokemondetail);
  }

  if (Object.keys(pokemon).length === 0) return;

  return (
    <div class="grid grid-rows-3  grid-flow-col gap-4 bg-red-200">
      <div class="w-full h-screen row-span-3">
        <div className="flex flex-col justify-start justify-items-start items-start m-3">
          <button
            className="p-2 bg-red-400 rounded-2xl"
            onClick={() => navigate("/")}
          >
            back
          </button>
        </div>

        <div className=" flex flex-col justify-center justify-items-center items-center">
          <h2 className="font-bold text-4xl">{pokemon.name}</h2>
          <img className="w-1/2 h-1/2" src={pokemon.image} alt="pokemon" />
        </div>
      </div>
      <div class="col-span-3 h-screen flex flex-col justify-start justify-items-start items-start p-10 bg-red-100">
        <h2 className="font-bold text-xl">About</h2>
        <h3 className="text-l">Height : {pokemon.height}</h3>
        <h3 className="text-l">Weight : {pokemon.weight}</h3>
        <h3 className="font-bold mt-4 text-xl">Abilities </h3>
        <h3 className="text-l">{pokemon.ablities}</h3>
        <h3 className="font-bold mt-4 text-xl">Types </h3>
        <h3 className="text-l">{pokemon.type}</h3>

        <h3 className="font-bold mt-4 text-xl">Stats</h3>
        {pokemon.stats.map((stat) => (
          <div class=" w-full flex justify-between m-1">
            <div class="text-l   dark:text-white">{stat.stat.name}</div>
            <div class="text-l   dark:text-white bg-red-300 rounded-2xl p-1">
              {stat.base_stat}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonDetailsPage;
