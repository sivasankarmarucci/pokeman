import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import PokemonListingPage from "./component/PokemonListingPage";
import PokemonDetailsPage from "./component/PokemonDetailsPage";
import PokemonContext from "./hooks/PokemonContext";
import { useState } from "react";

//React Routing
const browserRoute = createBrowserRouter([
  {
    path: "/",
    element: <PokemonListingPage />,
  },
  {
    path: "/details/:pokemanId",
    element: <PokemonDetailsPage />,
  },
]);

function App() {
  const [pokemon, setPokemon] = useState({});

  const addPokemon = (selectedPokemon) => {
    setPokemon(selectedPokemon);
  };

  return (
    <PokemonContext.Provider value={{ pokemon, addPokemon }}>
      <RouterProvider router={browserRoute}>
        <div className="App">
          <Outlet />
        </div>
      </RouterProvider>
    </PokemonContext.Provider>
  );
}

export default App;
