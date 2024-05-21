import React, { useState } from "react";
import "./HomePage.css";
import sportImage from "../../assets/images/file.png"; // Correct the import path
import SignUpModal from './SignUpModal';
import LoginModal from './LogInModal';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const isTokenValid = () => {
    // Get the token from localStorage
    const token = localStorage.getItem('jwtToken');
    
    // Return false if no token is found
    if (!token) return false;
  
    try {
      // Decode the token payload
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
  
      // Check the expiration time
      const exp = decodedPayload.exp;
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
  
      return currentTime < exp; // Check if the current time is less than the expiration time
    } catch (error) {
      console.error('Invalid token:', error);
      return false; // Token is invalid
    }
  };

  const handleOpenSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const handleCloseSignUpModal = () => {
    setShowSignUpModal(false);
  };

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleWorkoutsButton = () => {
    navigate('/workouts');
};

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('name');
    setDropdownOpen(false);
    window.location.reload();
  };

  const tokenValid = isTokenValid();
  const name = localStorage.getItem('name');

  return (
    <div className="main-content">
      <div className="image-section">
        <img src={sportImage} alt="Fitness" className="top-image" />
      </div>
      <nav className="navbar">
        <img src="/logo192.png" alt="Logo" className="navbar-logo" />
        <ul className="navbar-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
        </ul>
        <div>
            {/* Conditional Rendering based on login state */}
            {!tokenValid ? (
                <>
                    <button className="sign-up-button button" onClick={handleOpenSignUpModal}>Sign Up</button>
                    {showSignUpModal && <SignUpModal onClose={handleCloseSignUpModal} />}
                    <button className="log-in-button button" onClick={handleOpenLoginModal}>Log In</button>
                    {showLoginModal && <LoginModal onClose={handleCloseLoginModal} />}
                </>
            ) : (
                <div>
                <button className="dropbtn" onClick={toggleDropdown}>
                  {name}
                </button>
                {dropdownOpen && (
                  <div id = "myDropdown" className="dropdown-content">
                    <button onClick={handleWorkoutsButton}>
                      Workouts
                    </button>
                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
        
      </nav>
      <div className="text-section">
        <p1>MyFit</p1>
        <p>Reach your fitness goals with us</p>
        <button className="start-button button">
          Start journey
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
