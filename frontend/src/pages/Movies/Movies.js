import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { omdbApi } from '../../services/api';
import MovieCard from '../../components/MovieCard/MovieCard';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('Marvel'); // Default search
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async (searchQuery) => {
      setLoading(true);
      try {
        const { data } = await omdbApi.get('search', { params: { q: searchQuery } });
        if (data.Search) {
          setMovies(data.Search);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchMovies(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    // No need to manually call fetchMovies since query change triggers useEffect
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold outfit">Explore <span style={{ color: 'var(--primary)' }}>Universe</span></h1>
        <p className="text-muted lead">Search for your favorite movies and series</p>
        
        <Row className="justify-content-center mt-4">
          <Col md={6}>
            <Form onSubmit={handleSearch}>
              <InputGroup className="glass-card overflow-hidden">
                <Form.Control
                  placeholder="Search movies..."
                  className="bg-transparent text-white border-0 py-3 ps-4 shadow-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-link text-white pe-4" type="submit">
                  <FaSearch />
                </button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </div>

      {loading ? (
          <div className="text-center py-5">Gearing up...</div>
      ) : (
        <Row className="g-4">
          {movies.map((movie) => (
            <Col key={movie.imdbID} xs={12} sm={6} md={4} lg={3}>
              <MovieCard movie={movie} />
            </Col>
          ))}
          {movies.length === 0 && (
              <div className="text-center py-5 text-muted">No movies found for "{query}"</div>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Movies;
