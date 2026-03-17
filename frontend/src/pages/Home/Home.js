import React, { useState, useEffect } from 'react';
import { Container, Badge, Spinner } from 'react-bootstrap';
import { omdbApi } from '../../services/api';
import HeroSection from '../../components/HeroSection/HeroSection';
import Footer from '../../components/Footer/Footer';
import MovieRow from '../../components/MovieRow/MovieRow';

const Home = () => {
  const [featured, setFeatured] = useState(null);
  const [sections, setSections] = useState({
    latest: [],
    popular: [],
    topRated: [],
    recommendations: []
  });
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch movies for carousel (Keep existing logic style)
        const queries = ['Marvel', 'Batman', 'Avengers', 'Horror', 'Sci-Fi', '2024'];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const searchRes = await omdbApi.get('search', { params: { q: randomQuery } });
        
        if (searchRes.data.Search && searchRes.data.Search.length > 0) {
          const shuffled = [...searchRes.data.Search].sort(() => 0.5 - Math.random());
          const selection = shuffled.slice(0, 5);
          const detailedMovies = await Promise.all(
            selection.map(async (m) => {
              const res = await omdbApi.get(`details/${m.imdbID}`);
              return res.data;
            })
          );
          setFeatured(detailedMovies);
        }

        // Fetch new sections
        const [latest, popular, topRated, genreList] = await Promise.all([
            omdbApi.getNowPlaying(),
            omdbApi.getPopular(),
            omdbApi.getTopRated(),
            omdbApi.getGenres()
        ]);

        setSections({
            latest: latest.data,
            popular: popular.data,
            topRated: topRated.data,
            recommendations: []
        });
        setGenres(genreList.data); // Use full static list from backend
        
        setLoading(false);
      } catch (err) {
        console.error("Home Data Fetch Error:", err);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleGenreClick = async (genre) => {
    try {
        setGenreLoading(true);
        setSelectedGenre(genre);
        const res = await omdbApi.getMoviesByGenre(genre.id);
        setGenreMovies(res.data);
        setGenreLoading(false);
        
        // Scroll to results
        setTimeout(() => {
            const el = document.getElementById('genre-results');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } catch (err) {
        console.error(err);
        setGenreLoading(false);
    }
  };

  const handleMovieClick = async (movie) => {
    try {
        const res = await omdbApi.getSimilarMovies(movie.imdbID || movie.id);
        setSections(prev => ({ ...prev, recommendations: res.data }));
        
        // Scroll to recommendations
        setTimeout(() => {
            const el = document.getElementById('recommendations');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } catch (err) {
        console.error("Recommendations Fetch Error:", err);
    }
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h4 className="outfit text-white">Initializing Cinema Experience...</h4>
    </div>
  );

  return (
    <>
      <HeroSection featuredMovies={featured} />
      
      <div className="py-5" style={{ background: 'linear-gradient(180deg, var(--primary-bg) 0%, #080C16 100%)' }}>
        
        {/* Latest Releases Section */}
        <MovieRow title="Latest Releases" movies={sections.latest} onMovieClick={handleMovieClick} />

        {/* Popular Movies Section */}
        <MovieRow title="Popular Movies" movies={sections.popular} onMovieClick={handleMovieClick} />

        {/* Top Rated Section */}
        <MovieRow title="Top Rated" movies={sections.topRated} onMovieClick={handleMovieClick} />

        {/* Browse by Genre Section */}
        <Container className="mb-5 py-4 px-4 glass-card">
            <h3 className="outfit fw-bold mb-4 border-start border-nova ps-3 border-4" style={{ borderColor: 'var(--highlight-color) !important' }}>
                Browse by <span style={{ color: 'var(--highlight-color)' }}>Genre</span>
            </h3>
            <div className="d-flex flex-wrap gap-2">
                {genres.map(genre => (
                    <Badge 
                        key={genre.id} 
                        bg={selectedGenre?.id === genre.id ? 'primary' : 'dark'}
                        className={`genre-badge p-3 outfit fs-6 cursor-pointer border ${selectedGenre?.id === genre.id ? 'border-primary' : 'border-secondary'}`}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onClick={() => handleGenreClick(genre)}
                    >
                        {genre.name}
                    </Badge>
                ))}
            </div>
            
            {(selectedGenre || genreLoading) && (
                <div id="genre-results" className="mt-5 pt-3 border-top border-secondary">
                    {genreLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="grow" variant="primary" />
                            <p className="mt-3 text-muted">Curating {selectedGenre?.name} selection...</p>
                        </div>
                    ) : (
                        <MovieRow title={`${selectedGenre.name} Movies`} movies={genreMovies} onMovieClick={handleMovieClick} />
                    )}
                </div>
            )}
        </Container>

        {/* Recommended Movies Section */}
        {sections.recommendations.length > 0 && (
            <div id="recommendations" className="pt-4 mt-5">
                <MovieRow title="Recommended for You" movies={sections.recommendations} />
            </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Home;

