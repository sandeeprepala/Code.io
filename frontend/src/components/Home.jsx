import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = JSON.parse(localStorage.getItem('user'));
  if (user) navigate('/problems');
  else navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Welcome To Code.io</h1>
      <p>
        Code.io is a coding platform to practice DSA problems, track progress,
        and prepare for technical interviews efficiently.
      </p>
      <button className="get-started-btn" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default Home;
