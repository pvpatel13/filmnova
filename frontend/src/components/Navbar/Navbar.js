import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBookmark, FaSignOutAlt, FaUser, FaStar, FaCog, FaFilm } from 'react-icons/fa';
import './Navbar.css';

const CustomNavbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const onLogout = () => {
    logout();
    navigate('/login');
    setExpanded(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar 
      expanded={expanded}
      onToggle={(expand) => setExpanded(expand)}
      expand="lg" 
      sticky="top" 
      className="filmnova-navbar"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <FaFilm className="movie-reel-icon" />
          <span className="brand-film">Film</span>
          <span className="brand-nova">Nova</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}
              onClick={() => setExpanded(false)}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/movies" 
              className={`nav-link-custom ${isActive('/movies') ? 'active' : ''}`}
              onClick={() => setExpanded(false)}
            >
              Movies
            </Nav.Link>

            {userInfo ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/watchlist" 
                  className={`nav-link-custom watchlist-btn ${isActive('/watchlist') ? 'active' : ''}`}
                  onClick={() => setExpanded(false)}
                >
                  <FaBookmark /> Watchlist
                </Nav.Link>
                
                <NavDropdown 
                  title={
                    <span className="user-info">
                      <FaUser className="me-2" />
                      {userInfo.name.split(' ')[0]}
                    </span>
                  } 
                  id="user-dropdown" 
                  className="profile-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                    <FaUser /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout} className="logout-item">
                    <FaSignOutAlt /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <div className="auth-buttons ms-lg-3">
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="nav-link-custom"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Nav.Link>
                <Link to="/register" onClick={() => setExpanded(false)}>
                  <button className="btn-primary-nova">Join Nova</button>
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
