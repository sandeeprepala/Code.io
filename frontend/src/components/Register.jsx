import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/v1/users/register', {
        username,
        email,
        password,
        institution,
        location
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register To Code.io</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label">
          Username:
          <input type="text" name="username" className="register-input" onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label className="register-label">
          Email:
          <input type="email" name="email" className="register-input" onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="register-label">
          Password:
          <input type="password" name="password" className="register-input" onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label className="register-label">
          Institution:
          <input type="text" name="institution" className="register-input" onChange={(e) => setInstitution(e.target.value)} />
        </label>
        <label className="register-label">
          Location:
          <input type="text" name="location" className="register-input" onChange={(e) => setLocation(e.target.value)} />
        </label>
        <button type="submit" className="register-button">Register</button>
        {error && <p className="register-error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
