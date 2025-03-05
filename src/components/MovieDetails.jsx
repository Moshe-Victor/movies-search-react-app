import React, {useState} from 'react'

const MovieDetails = React.forwardRef(({  selectedMovieId, movieList}, ref) => {

    // const [selectedMovie, setSelectedMovie] = useState(null);

    const selectedMovie = movieList.find((movie) => (movie.id === selectedMovieId));
    console.log(selectedMovie);
    return (
        <div
            ref={ref}
            tabIndex={-1} // Makes the div focusable
            className="movie-details">
            <div className="mt-0">
                <h3 className="text-yellow-500">Title:</h3>
                <h3>{selectedMovie.title}</h3>
                <h3 className="text-yellow-500">Synopsis:</h3>
                <h3>{selectedMovie.overview}</h3>

            </div>
        </div>
    )
});
export default MovieDetails
