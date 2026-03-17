import React, { useState, useContext, useEffect } from 'react';
import { Container, Col, Form, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userInfo, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Col md={5}>
        <Card className="glass-card p-4 border-0">
          <h2 className="text-center outfit fw-bold mb-4">Welcome <span style={{ color: 'var(--primary)' }}>Back</span></h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                className="bg-dark text-white border-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                className="bg-dark text-white border-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <button className="btn-primary-nova w-100 mb-3" type="submit">
              Sign In
            </button>
            <p className="text-center auth-prompt">
              Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Register</Link>
            </p>
          </Form>
        </Card>
      </Col>
    </Container>
  );
};

export default Login;
