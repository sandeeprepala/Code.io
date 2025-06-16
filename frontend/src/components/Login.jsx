import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; // Reusing the same CSS
import '../styles/Register.css'; // Reusing the same CSS

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`, {
        email,
        password
      });
      const { accessToken, user } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
      navigate('/'); // Redirect to homepage or dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">
          Email:
          <input type="email" className="register-input" onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="login-label">
          Password:
          <input type="password" className="register-input" onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className="register-button">Login</button>
        {error && <p className="register-error">{error}</p>}
      </form>
      <p style={{ marginTop: "2rem", textAlign: "center", color: "#d07d00" , marginBottom:"50px"}}>
        Don’t have an account? <Link to="/register" style={{ color: "#ff9900", textDecoration: "underline" }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;
