import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { gsap } from 'gsap';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { revealHero } from '../../animations/gsapAnimations';
import { AuthContext } from '../../context/AuthContext';
import { backendApi } from '../../services/api';
import { FaPlus, FaPlay, FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HeroSection = ({ featuredMovies }) => {
  const { userInfo } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasRevealed = useRef(false);

  const nextSlide = useCallback(() => {
    if (isAnimating || !featuredMovies) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, featuredMovies]);

  const prevSlide = useCallback(() => {
    if (isAnimating || !featuredMovies) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, featuredMovies]);

  // Consolidated Animation & Navigation Logic
  useEffect(() => {
    if (!featuredMovies || featuredMovies.length === 0 || !contentRef.current) return;

    if (!hasRevealed.current) {
      // Very first entrance - use premium stagger
      revealHero(contentRef.current.children);
      hasRevealed.current = true;
    } else {
      // Smooth cross-fade of content only (Background card remains static)
      gsap.fromTo(contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'none' }
      );
    }
  }, [currentIndex, featuredMovies]);

  // Auto-play timer (Separated to prevent logic conflicts)
  useEffect(() => {
    if (!featuredMovies || featuredMovies.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [featuredMovies, nextSlide]);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (userInfo && featuredMovies && featuredMovies[currentIndex]) {
        try {
          const { data } = await backendApi.get('users/profile');
          setIsInWatchlist(data.watchlist.includes(featuredMovies[currentIndex].imdbID));
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkWatchlist();
  }, [userInfo, featuredMovies, currentIndex]);


  const handleWatchlist = async () => {
    if (!userInfo) return alert('Please login to manage watchlist');
    const currentMovie = featuredMovies[currentIndex];
    try {
      const action = isInWatchlist ? 'remove' : 'add';
      await backendApi.post('users/watchlist', { movieId: currentMovie.imdbID, action });
      setIsInWatchlist(!isInWatchlist);
    } catch (err) {
      console.error(err);
    }
  };

  if (!featuredMovies || featuredMovies.length === 0) return null;
  const currentMovie = featuredMovies[currentIndex];

  return (
    <div
      className="hero-section"
      ref={heroRef}
      style={{
        height: '85vh',
        position: 'relative',
        marginTop: '-70px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <div
        className="hero-background-transition"
        key={`bg-${currentIndex}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `url(${currentMovie.Poster}) no-repeat center center/cover`,
          transition: 'background 1s ease-in-out',
          zIndex: 0
        }}
      ></div>

      <div className="hero-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, #0F172A, rgba(30, 41, 59, 0.4), #0F172A)',
        zIndex: 1
      }}></div>

      <Container style={{ position: 'relative', zIndex: 5 }}>
        <Row>
          <Col lg={12}>
              <div className="hero-glass-card shadow-lg">
                <div className="d-flex gap-lg-4 gap-3 flex-md-row flex-column align-items-center" ref={contentRef} key={currentIndex}>
                  <div className="hero-poster-mini d-none d-lg-block shadow-lg rounded-4">
                    <img src={currentMovie.Poster} alt={currentMovie.Title} className="img-fluid" />
                  </div>

                  <div className="flex-grow-1 text-md-start text-center">
                    <div className="d-flex align-items-center justify-content-md-start justify-content-center gap-2 mb-3 flex-wrap">
                      <span className="meta-badge" style={{ borderColor: 'var(--highlight-color)', color: 'var(--highlight-color)' }}>
                        SPOTLIGHT
                      </span>
                      <span className="meta-badge d-none d-sm-inline-block">{currentMovie.Rated}</span>
                      <span className="meta-badge"><FaCalendarAlt className="me-2" />{currentMovie.Year}</span>
                      <span className="meta-badge"><FaClock className="me-2" />{currentMovie.Runtime}</span>
                    </div>

                    <h1 className="fw-bold outfit text-white text-shadow hero-title">
                      {currentMovie.Title}
                    </h1>

                    <div className="mb-4 d-flex flex-wrap gap-2 justify-content-md-start justify-content-center">
                      {currentMovie.Genre.split(', ').map(g => (
                        <span key={g} className="small text-white opacity-75 fw-bold border-start ps-2 ms-1" style={{ borderLeft: '3px solid var(--highlight-color)' }}>{g}</span>
                      ))}
                    </div>

                    <p className="lead text-white opacity-100 mb-4 mb-md-5 fs-5 text-shadow" style={{ fontWeight: '400', lineHeight: '1.6' }}>
                      {currentMovie.Plot}
                    </p>

                    <div className="d-flex gap-3 flex-wrap align-items-center justify-content-md-start justify-content-center">
                    <div className="d-flex gap-2">
                      <button onClick={prevSlide} className="btn-hero-nav" disabled={isAnimating}>
                        <FaChevronLeft />
                      </button>
                      <button onClick={nextSlide} className="btn-hero-nav" disabled={isAnimating}>
                        <FaChevronRight />
                      </button>
                    </div>

                    <Link to={`/movie/${currentMovie.imdbID}`} className="btn-hero-main">
                      <FaPlay /> View Details
                    </Link>
                    <button
                      onClick={handleWatchlist}
                      className="btn-hero-outline"
                    >
                      {isInWatchlist ? <FaPlus style={{ transform: 'rotate(45deg)' }} /> : <FaPlus />}
                      {isInWatchlist ? 'In Watchlist' : 'Add to Collection'}
                    </button>

                    <div className="ms-md-auto d-flex flex-column align-items-md-end align-items-center gap-2 mt-md-0 mt-3 w-100 w-md-auto">
                      <div className="carousel-progress-container mb-1 d-none d-md-block">
                        <div className="carousel-progress-bar" key={`progress-${currentIndex}`}></div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {featuredMovies.map((_, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (!isAnimating) {
                                setIsAnimating(true);
                                setCurrentIndex(idx);
                                setTimeout(() => setIsAnimating(false), 1000);
                              }
                            }}
                            className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
