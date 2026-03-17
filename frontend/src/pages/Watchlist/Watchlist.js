import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { backendApi, omdbApi } from '../../services/api';
import MovieCard from '../../components/MovieCard/MovieCard';

const Watchlist = () => {
  const { userInfo } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userInfo) return;
      try {
        const { data } = await backendApi.get('users/profile');
        const movieDetails = await Promise.all(
          data.watchlist.map(async (id) => {
            try {
                const res = await omdbApi.get(`details/${id}`);
                return res.data;
            } catch (err) {
                console.error(`Error fetching movie ${id}:`, err);
                return null;
            }
          })
        );
        // Filter out any failed fetches
        setMovies(movieDetails.filter(m => m !== null));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [userInfo]);

  if (!userInfo) return <Container className="py-5"><Alert variant="danger">Please login to view your watchlist.</Alert></Container>;
  if (loading) return <div className="text-center py-5">Gathering your picks...</div>;

  return (
    <Container className="py-5">
      <h1 className="outfit fw-bold mb-5 border-start border-nova ps-3 border-4" style={{ borderColor: 'var(--primary) !important' }}>
        Your <span style={{ color: 'var(--primary)' }}>Watchlist</span>
      </h1>
      {movies.length > 0 ? (
        <Row className="g-4">
          {movies.map((movie) => (
            <Col key={movie.imdbID} xs={12} sm={6} md={4} lg={3}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 glass-card">
          <h4 className="text-muted">Your watchlist is empty.</h4>
          <p>Go search for some movies and add them to your list!</p>
        </div>
      )}
    </Container>
  );
};

export default Watchlist;
