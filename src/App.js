import React, { useState, useEffect, useCallback } from "react";
import LoadingIndicator from "./components/UI/LoadingIndicator";

import MoviesList from "./components/MoviesList";
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
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Error processing: " + response.status);
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setIsloading(false);
    } catch (error) {
      setError(error.message);
      setIsloading(false);
    }
  }, []);

  useEffect(() => {
    console.log("useEffect called");

    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

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
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
