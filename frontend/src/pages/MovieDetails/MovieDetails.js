import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Badge } from 'react-bootstrap';
import { FaPlay, FaCalendarAlt, FaClock, FaStar, FaPlus, FaHeart, FaComment, FaEllipsisH, FaCheckCircle } from 'react-icons/fa';
import { omdbApi, backendApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const MovieDetails = () => {
    const { id } = useParams();
    const { userInfo } = useContext(AuthContext);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ average: 0, count: 0 });
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch movie details
                const { data } = await omdbApi.get(`details/${id}`);
                setMovie(data);

                // Fetch ratings/reviews
                const statsRes = await backendApi.get(`ratings/${id}`);
                setStats({ average: statsRes.data.average, count: statsRes.data.count });
                setReviews(statsRes.data.ratings || []);

                // Check watchlist status if user is logged in
                if (userInfo) {
                    const profileRes = await backendApi.get('users/profile');
                    setIsInWatchlist(profileRes.data.watchlist.includes(id));
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, userInfo]);

    const handleWatchlist = async () => {
        if (!userInfo) return alert('Please login to manage watchlist');
        try {
            const action = isInWatchlist ? 'remove' : 'add';
            await backendApi.post('users/watchlist', { movieId: id, action });
            setIsInWatchlist(!isInWatchlist);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRate = async (rating) => {
        if (!userInfo) return alert('Please login to rate');
        setUserRating(rating);
        try {
            await backendApi.post('ratings', { movieId: id, rating });
            // Refresh stats
            const statsRes = await backendApi.get(`ratings/${id}`);
            setStats({ average: statsRes.data.average, count: statsRes.data.count });
        } catch (err) {
            console.error(err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo) return alert('Please login to review');
        try {
            await backendApi.post('ratings', { movieId: id, rating: userRating || 5, review: reviewText });
            const statsRes = await backendApi.get(`ratings/${id}`);
            setReviews(statsRes.data.ratings);
            setReviewText('');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-5">Loading Cinematic Masterpiece...</div>;
    if (!movie) return <div className="text-center py-5">Movie not found</div>;

    return (
        <div style={{ background: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.98)), url(${movie.Poster}) center/cover no-repeat fixed`, minHeight: '100vh' }}>
            <Container className="py-5">
                <Row className="g-5">
                    <Col lg={4} md={5} className="mx-auto">
                        <Card className="glass-card overflow-hidden border-0 shadow-lg">
                            <Card.Img src={movie.Poster} />
                        </Card>
                        <div className="mt-4 d-grid gap-2">
                            <button className="btn-primary-nova d-flex align-items-center justify-content-center gap-2">
                                <FaPlay /> Watch Trailer
                            </button>
                            <button
                                onClick={handleWatchlist}
                                className={`btn ${isInWatchlist ? 'btn-danger' : 'btn-outline-light'} rounded-pill py-3 d-flex align-items-center justify-content-center gap-2`}
                            >
                                {isInWatchlist ? <><FaPlus style={{ transform: 'rotate(45deg)' }} /> Remove from Watchlist</> : <><FaPlus /> Add to Watchlist</>}
                            </button>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <h1 className="display-3 fw-bold outfit text-shadow">{movie.Title}</h1>
                        <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                            <Badge bg="secondary" className="px-3 py-2 rounded-pill fs-7">{movie.Rated}</Badge>
                            <span className="text-light fw-bold"><FaCalendarAlt className="me-2 text-nova" style={{ color: 'var(--primary)' }} />{movie.Year}</span>
                            <span className="text-light fw-bold"><FaClock className="me-2 text-nova" style={{ color: 'var(--primary)' }} />{movie.Runtime}</span>
                            <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}><FaStar className="me-2" />{movie.imdbRating} (IMDb)</span>
                        </div>

                        <div className="mb-4">
                            {movie.Genre.split(', ').map(g => (
                                <Badge key={g} bg="dark" className="me-2 px-3 py-2 border border-secondary rounded-pill">{g}</Badge>
                            ))}
                        </div>

                        <p className="lead fs-5 text-white mb-4 mb-md-5 text-shadow" style={{ lineHeight: '1.8', fontWeight: '400' }}>{movie.Plot}</p>


                        <div className="glass-card p-4 mb-5 shadow-lg">
                            {userInfo ? (
                                <div className="review-input-container">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start gap-3 mb-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1.2rem' }}>
                                                {userInfo.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h6 className="mb-0 text-white fw-bold">@{userInfo.name.replace(/\s+/g, '').toLowerCase()}</h6>
                                            </div>
                                        </div>
                                        <div className="rating-label-group">
                                            {[
                                                { label: 'Skip', stars: 1 },
                                                { label: 'Timepass', stars: 2 },
                                                { label: 'Go for it', stars: 4 },
                                                { label: 'Perfection', stars: 5 }
                                            ].map((item, idx) => (
                                                <div
                                                    key={item.label}
                                                    className={`rating-label-item ${userRating === item.stars ? 'active' : ''}`}
                                                    onClick={() => handleRate(item.stars)}
                                                >
                                                    <FaStar className="me-1 mb-1" style={{ fontSize: '0.8rem' }} /> {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Form onSubmit={handleReviewSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                as="textarea"
                                                rows={1}
                                                placeholder="Write your review here..."
                                                className="review-textarea"
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="char-count">{reviewText.length}/1000</span>
                                            <button className="post-btn" type="submit">Post</button>
                                        </div>
                                    </Form>
                                </div>
                            ) : (
                                <p className="text-white opacity-75 mb-0 py-3 text-center">Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>login</Link> to share your thoughts.</p>
                            )}
                        </div>

                        <div className="reviews-section">
                            <h4 className="outfit fw-bold mb-4 d-flex align-items-center gap-3 text-white">
                                Community Reviews
                                <span className="fs-6 fw-normal px-3 py-1 bg-dark rounded-pill border border-secondary text-white">
                                    <FaStar className="me-1" color="var(--primary)" /> {stats.average.toFixed(1)} / 5 ({stats.count} reviews)
                                </span>
                            </h4>
                            {reviews.length > 0 ? (
                                <div className="mt-4">
                                    {reviews.map((r, i) => {
                                        const labelMap = { 1: 'Skip', 2: 'Timepass', 4: 'Go for it', 5: 'Perfection' };
                                        const ratingLabel = labelMap[r.rating] || 'Good';

                                        return (
                                            <Card key={i} className="social-review-card position-relative">
                                                <div className="user-badge" style={{ backgroundColor: r.rating >= 3 ? '#00ffa3' : 'var(--primary)', color: '#000' }}>
                                                    <FaStar className="me-1 mb-1" style={{ fontSize: '0.7rem' }} /> {ratingLabel}
                                                </div>
                                                <div className="d-flex align-items-start gap-3">
                                                    <img src={r.userId.avatar} alt="user" className="rounded-circle border border-nova" width="50" height="50" style={{ padding: '2px' }} />
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                            <h6 className="mb-0 text-white fw-bold">{r.userId.name.toLowerCase().replace(/\s+/g, '')}</h6>
                                                            <FaCheckCircle className="text-info small" style={{ fontSize: '0.8rem' }} />
                                                            <span className="text-white opacity-50 small">• 7th Mar</span>
                                                        </div>
                                                        <p className="text-white fs-5 mb-3" style={{ fontWeight: '400' }}>{r.review}</p>
                                                        <div className="d-flex align-items-center gap-4">
                                                            <div className="d-flex align-items-center gap-2 interaction-icon">
                                                                <FaHeart /> <span className="small fw-bold">104</span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 interaction-icon">
                                                                <FaComment /> <span className="small fw-bold">7</span>
                                                            </div>
                                                            <FaEllipsisH className="ms-auto interaction-icon" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-white opacity-50 italic py-4">Be the first to share your thoughts on this masterpiece!</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MovieDetails;
