import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { hoverScale, hoverScaleExit } from '../../animations/gsapAnimations';

const MovieCard = ({ movie }) => {
  return (
    <Card 
      as={Link} 
      to={`/movie/${movie.imdbID}`}
      className="movie-card glass-effect-hover h-100 border-0 overflow-hidden text-decoration-none shadow-sm"
      style={{ position: 'relative', cursor: 'pointer', background: 'rgba(30, 41, 59, 0.4)' }}
    >
      <div className="card-img-wrapper" style={{ overflow: 'hidden', height: '320px' }}>
          <Card.Img 
            variant="top" 
            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="movie-poster"
          />
      </div>
      <div className="card-overlay" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(0deg, rgba(8, 8, 8, 0.9) 0%, rgba(8, 8, 8, 0.4) 70%, rgba(8, 8, 8, 0) 100%)',
        padding: '15px'
      }}>
        <h6 className="text-white mb-1 outfit text-shadow text-truncate">{movie.Title}</h6>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-light small fw-bold opacity-75">{movie.Year}</span>
          {movie.imdbRating && (
            <span className="badge-rating" style={{ 
                background: 'rgba(124, 58, 237, 0.2)', 
                color: 'var(--highlight-color)',
                padding: '2px 8px',
                borderRadius: '5px',
                fontSize: '0.75rem',
                border: '1px solid rgba(124, 58, 237, 0.3)'
            }}>
              <FaStar className="me-1 mb-1" style={{ fontSize: '0.7rem' }} /> 
              {movie.imdbRating}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
