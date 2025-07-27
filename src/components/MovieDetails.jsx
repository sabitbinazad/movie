import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from './Spinner';

const MovieDetails = () => {
    const { imdbID } = useParams();
    const [movie, setMovie] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState('');
    const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
    const YT_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
            const data = await res.json();
            setMovie(data);

            // Optional: fetch trailer
            const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${data.Title}+trailer&type=video&key=${YT_KEY}`);
            const ytData = await ytRes.json();
            const videoId = ytData?.items?.[0]?.id?.videoId;
            if (videoId) {
                setTrailerUrl(`https://www.youtube.com/embed/${videoId}`);
            }
        };
        fetchMovieDetails();
    }, [imdbID]);

    if (!movie) {
        return (
            <div className='spinner-middle'>
                <Spinner />
            </div>
        );
    }


    return (
        <div className="movie-details">

            <div>
                <h1>{movie.Title}</h1>
            </div>
            <div className="content">
                <img src={movie.Poster} alt={movie.Title} />
                {trailerUrl ? (
                    <iframe
                        width="560"
                        height="315"
                        src={trailerUrl}
                        title="YouTube trailer"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <p className="text-gray-600">Trailer not available</p>
                )}
            </div>

        </div>
    );
};

export default MovieDetails;
