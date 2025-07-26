import SearchBar from "../SearchBar/SearchBar.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import Loader from "../Loader/Loader.tsx";
import css from "./App.module.css";
import toast from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import { Toaster } from "react-hot-toast";


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);



  const handleSearch = async (searchQuery: string) => {

    try {
      setIsError(false);
      setMovies([]);
      setIsLoading(true);
      const newMovies = await fetchMovies(searchQuery);

      if (newMovies.length === 0) {
        toast("No movies found for your request.", {
          duration: 3000,
          position: "top-center",
        });
      }

      setMovies(newMovies);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectedMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };



  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {movies.length > 0 && (
        <MovieGrid onSelect={handleSelectedMovie} movies={movies} />
      )}
      { selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
};