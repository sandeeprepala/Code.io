import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [easy, setEasy] = useState(0);
  const [medium, setMedium] = useState(0);
  const [hard, setHard] = useState(0);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('/api/v1/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };

    fetchProfile();
    
  }, []);
  useEffect(() => {
    let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
    if (user) {
      user.solvedProblems.forEach((problem) => {
        if (problem.difficulty === 'Easy') easyCount++;
        if (problem.difficulty === 'Medium') mediumCount++;
        if (problem.difficulty === 'Hard') hardCount++;
      });
      
      setEasy(easyCount);
      setMedium(mediumCount);
      setHard(hardCount);
    }
  }, [user]);

  const handleLogout = () => {
    axios.post('/api/v1/users/logout',{},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    ).then(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    })
  };

  if (error) return <div className="profile-error">{error}</div>;
  if (!user) return <div className="profile-loading">Loading...</div>;
  

  return (
    <div className="profile-container">
      <h2 className="profile-heading">User Profile</h2>
      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-label">Username:</span>
          <span className="profile-value">{user.username}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{user.email}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Rank:</span>
          <span className="profile-value">{user.rank}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Institution:</span>
          <span className="profile-value">{user.institution}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Location:</span>
          <span className="profile-value">{user.location}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Total Problems Solved:</span>
          <span className="profile-value">{user.solvedProblems.length}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Easy :</span>
          <span className="profile-value">{easy}</span>
          <span className="profile-label">Medium :</span>
          <span className="profile-value">{medium}</span>
          <span className="profile-label">Hard :</span>
          <span className="profile-value">{hard}</span>
        </div>
      </div>
      <button onClick={handleLogout} className="profile-logout-button">Logout</button>
    </div>
  );
};

export default Profile;
