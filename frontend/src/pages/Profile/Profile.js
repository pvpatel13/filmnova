import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { backendApi } from '../../services/api';
import { FaEnvelope, FaCalendarAlt, FaFilm, FaHeart, FaStar, FaHistory, FaBookmark, FaQuoteLeft } from 'react-icons/fa';
import { omdbApi } from '../../services/api';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { userInfo } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ reviewCount: 0, averageRating: 0, ratings: [] });
  const [ratedMovies, setRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userInfo) return;
      try {
        const [profileRes, statsRes] = await Promise.all([
          backendApi.get('users/profile'),
          backendApi.get('users/stats')
        ]);
        
        setProfile(profileRes.data);
        setStats(statsRes.data);

        // Fetch movie details for recent ratings
        const movieDetails = await Promise.all(
          statsRes.data.ratings.slice(0, 5).map(async (r) => {
            try {
              const res = await omdbApi.get(`details/${r.movieId}`);
              return { ...res.data, userRating: r.rating, reviewText: r.review };
            } catch (err) {
              return null;
            }
          })
        );
        setRatedMovies(movieDetails.filter(m => m !== null));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userInfo]);

  if (!userInfo) return <Container className="py-5 text-center"><h3 className="text-muted">Please login to view profile</h3></Container>;
  if (loading) return <div className="text-center py-5">Loading your universe...</div>;

  return (
    <div className="profile-page-container">
      {/* Moving Background Lights */}
      <div className="bg-light-blob blob-1"></div>
      <div className="bg-light-blob blob-2"></div>
      <div className="bg-light-blob blob-3"></div>

      <Container className="profile-content">
        <Row className="justify-content-center">
          <Col lg={11} xl={10}>
            <div className="profile-card-main">
              {/* Header Section */}
              <div className="text-center mb-5 position-relative">
                <div className="header-glow"></div>
                <div className="avatar-container mb-4">
                  <div className="avatar-ring"></div>
                  <img src={profile.avatar} alt="avatar" className="avatar-main" />
                </div>
                <h1 className="outfit fw-bold display-4 text-white mb-2">{profile.name}</h1>
                <p className="text-muted lead">Cinephile & Explorer</p>
              </div>

              {/* User Info Cards */}
              <Row className="g-4 mb-5">
                <Col md={12}>
                  <div className="info-glass-card">
                    <div className="icon-box-neon">
                      <FaEnvelope />
                    </div>
                    <div>
                      <small className="text-muted d-block text-uppercase letter-spacing-1">Email</small>
                      <span className="fw-bold text-white fs-5">{profile.email}</span>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="info-glass-card">
                    <div className="icon-box-neon">
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <small className="text-muted d-block text-uppercase letter-spacing-1">Member Since</small>
                      <span className="fw-bold text-white fs-5">
                        {profile.createdAt ? new Date(profile.createdAt).getFullYear() : '2026'}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Favorite Genres */}
              <div className="mb-5">
                <h4 className="outfit fw-bold mb-4 d-flex align-items-center gap-2 text-white">
                  <FaHeart className="text-purple" style={{ color: '#7c4dff' }} /> Favorite Genres
                </h4>
                <div className="d-flex flex-wrap gap-3">
                  {profile.favoriteGenres.length > 0 ? profile.favoriteGenres.map(g => (
                    <Badge key={g} className="genre-tag-animated">{g}</Badge>
                  )) : (
                    <>
                      <Badge className="genre-tag-animated">Anime</Badge>
                      <Badge className="genre-tag-animated">Sci-Fi</Badge>
                      <Badge className="genre-tag-animated">Indie</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Statistics Section */}
              <div className="mb-5">
                <h4 className="outfit fw-bold mb-4 d-flex align-items-center gap-2 text-white">
                  <FaFilm className="text-purple" style={{ color: '#7c4dff' }} /> Statistics
                </h4>
                <Row className="g-4">
                  <Col md={4}>
                    <div className="stat-cinematic-card">
                      <FaBookmark className="stat-icon" />
                      <div className="stat-number">{profile.watchlist.length}</div>
                      <div className="stat-label">In Watchlist</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="stat-cinematic-card">
                      <FaStar className="stat-icon" />
                      <div className="stat-number">{stats.reviewCount}</div>
                      <div className="stat-label">Reviews Written</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="stat-cinematic-card">
                      <FaHistory className="stat-icon" />
                      <div className="stat-number">{stats.averageRating}</div>
                      <div className="stat-label">Average Rating</div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="outfit fw-bold mb-4 d-flex align-items-center gap-2 text-white">
                  <FaHistory className="text-purple" style={{ color: '#7c4dff' }} /> Recent Activity
                </h4>
                {ratedMovies.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {ratedMovies.map((movie, idx) => {
                      const labelMap = { 1: 'Skip', 2: 'Timepass', 4: 'Go for it', 5: 'Perfection' };
                      const ratingLabel = labelMap[movie.userRating] || 'Good';
                      return (
                        <Link to={`/movie/${movie.imdbID}`} key={idx} className="text-decoration-none">
                          <div className="activity-card p-3 d-flex align-items-center gap-4 transition-300">
                            <img src={movie.Poster} alt={movie.Title} width="60" height="90" className="rounded-3 shadow object-fit-cover" />
                            <div className="flex-grow-1">
                              <h6 className="text-white mb-2 fw-bold fs-5">{movie.Title}</h6>
                              <div className="d-flex align-items-start gap-2 text-muted small italic">
                                <FaQuoteLeft className="mt-1" style={{ fontSize: '0.7rem', color: '#7c4dff' }} />
                                <span>{movie.reviewText ? movie.reviewText.substring(0, 80) + (movie.reviewText.length > 80 ? '...' : '') : 'No review text'}</span>
                              </div>
                            </div>
                            <Badge style={{ backgroundColor: movie.userRating >= 3 ? '#00ffa3' : '#7c4dff', color: '#000', fontSize: '0.8rem', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold' }}>
                                {ratingLabel}
                            </Badge>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="info-glass-card justify-content-center py-5 opacity-50">
                    <p className="mb-0">You haven't rated any movies yet. Go explore!</p>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
