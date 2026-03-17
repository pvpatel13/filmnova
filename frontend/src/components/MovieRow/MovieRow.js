import React, { useRef } from 'react';
import { Container } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from '../MovieCard/MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, movies, onMovieClick }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollLeft -= 500;
    } else {
      current.scrollLeft += 500;
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row-container mb-5">
      <Container>
        <div className="d-flex justify-content-between align-items-end mb-3 px-2">
            <div>
                <h3 className="outfit fw-bold mb-0 border-start border-nova ps-3 border-4" style={{ borderColor: 'var(--accent-color) !important' }}>
                    {title.split(' ')[0]} <span style={{ color: 'var(--accent-color)' }}>{title.split(' ').slice(1).join(' ')}</span>
                </h3>
            </div>
            <div className="d-none d-md-flex gap-2">
                <button className="row-nav-btn" onClick={() => scroll('left')}>
                    <FaChevronLeft />
                </button>
                <button className="row-nav-btn" onClick={() => scroll('right')}>
                    <FaChevronRight />
                </button>
            </div>
        </div>
      </Container>
      
      <div className="movie-scroll-wrapper">
        <div className="movie-scroll px-md-5" ref={scrollRef}>
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-item" onClick={() => onMovieClick && onMovieClick(movie)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
