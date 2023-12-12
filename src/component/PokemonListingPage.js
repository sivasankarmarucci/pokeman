import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PokemonContext from "../hooks/PokemonContext";

const PokemonListingPage = () => {
  const [product, setProduct] = useState([]);
  const [pokemans, setPokemans] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { addPokemon } = useContext(PokemonContext);
  const navigate = useNavigate();
  const elementRef = useRef(null);

  function onIntersection(entries) {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore) {
      fetchMoreItem();
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pokemans]);

  async function fetchMoreItem() {
    const resposne = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page * 10}`
    );
    const data = await resposne.json();
    if (data.results.length === 0) {
      setHasMore(false);
    } else {
      setProduct((prevProduct) => [...prevProduct, ...data.results]);
      setPage((prevPage) => prevPage + 1);
      fetchPokemon(data.results);
    }
  }

  const fetchPokemon = (results) => {
    const promises = [];
    results.map((result) =>
      promises.push(fetch(result.url).then((res) => res.json()))
    );
    Promise.all(promises).then((results) => {
      const resultedValue = results.map((result) => ({
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
      }));
      setPokemans([...pokemans, ...resultedValue]);
    });
  };

  const handleClick = (pokeman) => {
    addPokemon(pokeman);
    navigate(`/details/${pokeman.id}`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded overflow-hidden shadow-lg gap-5 ">
        {pokemans.map((pokeman) => (
          <div
            key={pokeman.id}
            className="flex flex-col justify-center justify-items-center items-center
       rounded overflow-hidden shadow-lg"
            onClick={() => handleClick(pokeman)}
          >
            <h2 className="font-bold text-4xl">{pokeman.name}</h2>
            <img className="w-1/2" src={pokeman.image} alt="pokemon" />
          </div>
        ))}
      </div>
      {hasMore && (
        <div ref={elementRef} style={{ textAlign: "center" }}>
          Load More Items...
        </div>
      )}
    </div>
  );
};

export default PokemonListingPage;
