import { Link } from 'react-router-dom';
import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Code.io</Link>
      </div>
      <div className="navbar-links">
        <Link to="/problems">Problems</Link>
        {/* <Link to='/collaboration'>Live Rooms</Link> */}
        <Link to="/profile">Profile</Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
