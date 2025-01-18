import React, { useRef, useState } from 'react';
import styles from './LoginPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const LoginPage = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate=useNavigate();
const {setToken}=useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://localhost:5001/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
 
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        console.log('Token received:', token); // Replace with actual handling
        localStorage.setItem('authToken', token);
        setToken(token); 
       // alert('Login successful!');
        navigate('/');
      } else {
        throw new Error('Invalid token received from backend.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
    <div className={styles.container}>
      <h2>Login</h2>
      <div className={styles.inputGroup}>
        <label>Email:</label>
        <input type="email" ref={emailRef} className={styles.input} />
      </div>
      <div className={styles.inputGroup}>
        <label>Password:</label>
        <input type="password" ref={passwordRef} className={styles.input} />
      </div>
      <button type='submit' className={styles.button} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
      <p>
        Don't have an account? <Link to="/register" className={styles.link}>Sign up</Link>
      </p>
    </div>
    </form>
  );
};

export default LoginPage;
