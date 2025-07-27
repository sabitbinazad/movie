import React from 'react';
import { Link } from 'react-router-dom';

const MovieCart = ({ movie: { Title, Year, Type, Poster, imdbID } }) => {
  return (
    <Link to={`/movie/${imdbID}`} className="movie-card">
      <img src={Poster !== 'N/A' ? Poster : './no-image.png'} alt={Title} />

      <div className='mt-4'>
        <h3>{Title}</h3>

        <div className='content'>
          <div className='rating'>
            <p className='text-gray-400'>{Year}</p>
            <span> • </span>
            <p className='text-gray-400 capitalize'>{Type}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCart;
