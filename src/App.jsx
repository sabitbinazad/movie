import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCart from './components/MovieCart';
import { useDebounce } from 'react-use'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultSearchUsed, setDefaultSearchUsed] = useState('');


  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

  const API_BASE_URL = 'https://www.omdbapi.com/';
  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  // Define default search terms inside the component
  const defaultSearchTerms = [
    'avengers',
    'batman',
    'spider',
    'harry potter',
    'star wars',
    'transformers',
    'matrix',
    'lord of the rings',
    'marvel',
    'dc comics'
  ];

  // Pick a random default search term every time fetchMovies runs
  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const randomDefaultSearch = defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
      const query = searchTerm || randomDefaultSearch;

      if (!searchTerm) {
        setDefaultSearchUsed(randomDefaultSearch);
      }

      const endpoint = `${API_BASE_URL}?apikey=${API_KEY}&s=${query}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch movies.');
      }

      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
        setErrorMessage('');
        console.log(data);
      } else {
        setMovies([]);
        setErrorMessage(data.Error || 'No movies found.');
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch movies on component mount and when searchTerm changes
  useEffect(() => {
    fetchMovies();
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>Step Into the World of <span className='text-gradient'>Movies You Love</span></h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          {searchTerm ? (<h2 className='mt-6'>{searchTerm.toUpperCase()} ALL MOVIES:</h2>) :
            (<h2 className='mt-6'>{defaultSearchUsed.toUpperCase()} ALL MOVIES: </h2>)
          }
          {isLoading ? (
            <div className='spinner-middle'>
              <Spinner />
            </div>

          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) =>
                <MovieCart key={movie.id} movie={movie} />

              )}
            </ul>
          )
          }
        </section>
      </div>
    </main>
  );
};

export default App;
