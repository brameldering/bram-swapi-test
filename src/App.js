import React, { useState, useEffect, useCallback } from "react";
import LoadingIndicator from "./components/UI/LoadingIndicator";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsloading(true);
    setError(null);
    console.log("fetchMoviesHandler");
    try {
      const response = await fetch(
        "https://react-http-1dd0d-default-rtdb.europe-west1.firebasedatabase.app/movies.json"
      );
      if (!response.ok) {
        throw new Error("Error processing fetch request: " + response.status);
      }

      const data = await response.json();
      console.log(data);
      if (!data) {
        throw new Error("Error processing response");
      }

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsloading(false);
  }, []);

  useEffect(() => {
    console.log("useEffect called");

    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    console.log("addMoviesHandler");
    console.log(movie);

    try {
      const response = await fetch(
        "https://react-http-1dd0d-default-rtdb.europe-west1.firebasedatabase.app/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error processing post request: " + response.status);
      }
      const data = await response.json();
      console.log(data);
      if (!data) {
        throw new Error("Error processing response");
      }
    } catch (error) {
      setError(error.message);
    }
  }

  // Identify which content to show
  let content = <p>No movies to show...</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <LoadingIndicator segmentWidth={10} segmentLength={20} spacing={10} />;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
