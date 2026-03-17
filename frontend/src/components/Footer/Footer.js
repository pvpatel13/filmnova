import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CreatorCard from '../CreatorCard/CreatorCard';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-section py-5 mt-5" style={{ background: 'var(--primary-bg)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Container>
                <Row className="align-items-center gy-4">
                    <Col lg={4} md={12} className="text-center text-lg-start">
                        <h3 className="outfit fw-bold mb-3">
                            Film<span style={{ color: 'var(--accent-color)' }}>Nova</span>
                        </h3>
                        <p className="text-secondary small mb-4" style={{ maxWidth: '300px' }}>
                            Your ultimate destination for discovering cinema. Explore, rate, and curate your personal movie library.
                        </p>
                        <div className="footer-links d-flex gap-4 justify-content-center justify-content-lg-start">
                            <Link to="/movies" className="text-decoration-none text-light small opacity-75">Movies</Link>
                            <Link to="/watchlist" className="text-decoration-none text-light small opacity-75">Watchlist</Link>
                            <Link to="/profile" className="text-decoration-none text-light small opacity-75">Account</Link>
                        </div>
                    </Col>
                    
                    <Col lg={4} md={12} className="d-flex justify-content-center order-lg-last">
                        <CreatorCard />
                    </Col>

                    <Col lg={4} md={12} className="text-center text-lg-start">
                        <div className="copyright-info">
                            <p className="text-secondary small mb-1">
                                &copy; {new Date().getFullYear()} FilmNova. All rights reserved.
                            </p>
                            <p className="text-secondary extra-small opacity-50">
                                Crafted with passion for the global cinephile community.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
