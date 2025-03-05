import {useEffect, useState, useRef} from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useDebounce} from 'react-use'
import {getTrendingMovies, updateSearchCount} from './appwrite.js'
import MovieDetails from "./components/MovieDetails.jsx";
import {Dialog} from "./components/Dialog.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [searchTerm, setSearchTerm] = useState('');

    const [movieList, setMovieList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [trendingMovies, setTrendingMovies] = useState([]);
     // const [selectedMovieId, setSelectedMovieId] = useState(0);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const movieDetailsRef = useRef(null);

    const openDialog = (movie) => {
        setSelectedMovie(movie)
    }

    const closeDialog = () => {
        setSelectedMovie(null)
    }

    // Debounce the search term to prevent making too many API requests
    // by waiting for the user to stop typing for 500ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();

            setTrendingMovies(movies);
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    useEffect(() => {
        if (selectedMovie && movieDetailsRef.current) {
            // You can also scroll to MovieDetails if needed
              movieDetailsRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            // Or just set focus if you want the component to be visually focused
            //   movieDetailsRef.current.focus();
        }
    }, [selectedMovie]);

    return (
        <main>
            <div className="pattern"/>

            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                <div className="flex flex-row items-start">
                    <div className="flex-1">
                        {trendingMovies.length > 0 && (
                            <section className="trending">
                                <h2>Trending Movies</h2>

                                <ul>
                                    {trendingMovies.map((movie, index) => (
                                        <li key={movie.$id}>
                                            <p>{index + 1}</p>
                                            <img src={movie.poster_url} alt={movie.title}/>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section className="all-movies">
                            <h2>All Movies</h2>

                            {isLoading ? (
                                <Spinner/>
                            ) : errorMessage ? (
                                <p className="text-red-500">{errorMessage}</p>
                            ) : (
                                <ul>
                                    {movieList.map((movie) => (
                                        // <MovieCard key={movie.id} movie={movie} setSelectedMovieId={setSelectedMovieId}/>
                                        <MovieCard key={movie.id} movie={movie} openDialog={openDialog}/>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    {/*{selectedMovieId && <MovieDetails ref={movieDetailsRef} // attach the ref here*/}
                    {/*                                  selectedMovieId={selectedMovieId} movieList={movieList}/>}*/}


                     <Dialog isOpen={!!selectedMovie} onClose={closeDialog}>
                         {selectedMovie && (
                             // <>
                             //     <span className="font-bold mb-2">{selectedMovie.title}</span>
                             //     <p>{selectedMovie.overview}</p>
                             // </>

                             <MovieDetails selectedMovie={selectedMovie}/>

                         )}
                     </Dialog>

                </div>
            </div>
        </main>
    )
}

export default App
