import React, { useRef } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { gsap } from 'gsap';
import creatorImg from './image/pv3image.jpg'; // Assuming the user will save the photo as creator.jpg
import './CreatorCard.css';

const CreatorCard = () => {
    const cardRef = useRef(null);
    const avatarRef = useRef(null);
    const iconsRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -10,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.2)',
            duration: 0.4,
            ease: 'power2.out'
        });
        gsap.to(avatarRef.current, {
            rotate: 10,
            scale: 1.05,
            duration: 0.4,
            ease: 'power2.out'
        });
        if (iconsRef.current) {
            gsap.to(iconsRef.current.children, {
                scale: 1.2,
                color: 'var(--accent-color)',
                stagger: 0.1,
                duration: 0.3,
                ease: 'back.out(2)'
            });
        }
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            duration: 0.4,
            ease: 'power2.inOut'
        });
        gsap.to(avatarRef.current, {
            rotate: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.inOut'
        });
        if (iconsRef.current) {
            gsap.to(iconsRef.current.children, {
                scale: 1,
                color: 'var(--text-secondary)',
                stagger: 0.05,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        }
    };

    return (
        <Card
            ref={cardRef}
            className="creator-card border-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Card.Body className="d-flex flex-column align-items-center p-4">
                <div className="avatar-wrapper mb-3">
                    <Image
                        ref={avatarRef}
                        src={creatorImg}
                        roundedCircle
                        className="creator-avatar shadow-lg"
                        alt="Pushkar Vaghasiya"
                    />
                </div>

                <h4 className="creator-name mb-1 outfit">
                    Pushkar <span className="text-accent">Vaghasiya</span>
                </h4>
                <p className="creator-role mb-2 text-uppercase letter-spacing-1">
                    Full Stack Developer
                </p>

                <Card.Text className="creator-tagline text-center mb-3">
                    Creator of <span className="fw-bold">FilmNova</span> – Built for Cinephiles
                </Card.Text>

                <div className="social-links d-flex gap-3 mb-4" ref={iconsRef}>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaGithub size={20} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaLinkedin size={20} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaInstagram size={20} />
                    </a>
                </div>

                <div className="action-buttons d-flex gap-2 w-100">
                    <Button
                        variant="outline-light"
                        className="flex-grow-1 action-btn btn-cinematic"
                        href="#"
                        target="_blank"
                    >
                        <FaExternalLinkAlt className="me-2" /> Portfolio
                    </Button>
                    <Button
                        className="flex-grow-1 action-btn btn-accent"
                        href="mailto:contact@filmnova.com"
                    >
                        <FaEnvelope className="me-2" /> Contact
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CreatorCard;
