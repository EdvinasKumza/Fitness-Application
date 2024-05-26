import React, { useState } from "react";
import "./HomePage.css";
import sportImage from "../../assets/images/file.png"; // Correct the import path
import userImage from "../../assets/images/user.png";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LogInModal";
import workoutImage from "../../assets/images/workout.png";
import goalsImage from "../../assets/images/goal.png";
import progressImage from "../../assets/images/progress.png";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const isTokenValid = () => {
    // Get the token from localStorage
    const token = localStorage.getItem("jwtToken");

    // Return false if no token is found
    if (!token) return false;

    try {
      // Decode the token payload
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));

      // Check the expiration time
      const exp = decodedPayload.exp;
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

      return currentTime < exp; // Check if the current time is less than the expiration time
    } catch (error) {
      console.error("Invalid token:", error);
      return false; // Token is invalid
    }
  };

  const handleOpenSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const handleStartJourneyClick = () => {
    const tokenValid = isTokenValid();
    if (tokenValid) {
      navigate("/workouts");
    } else {
      setShowSignUpModal(true);
    }
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

  const handleGoalsButton = () => {
    navigate("/goals");
  };

  const handleWorkoutsButton = () => {
    navigate("/workouts");
  };

  const handleProgressButton = () => {
    navigate("/progress");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    setDropdownOpen(false);
    window.location.reload();
  };

  const tokenValid = isTokenValid();
  const name = localStorage.getItem("name");

  return (
    <div id="home">
      <div className="main-content">
        {dropdownOpen && <div className="overlay"></div>}
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
          </ul>
          <div>
            {/* Conditional Rendering based on login state */}
            {!tokenValid ? (
              <>
                <a
                  className="sign-up-button button"
                  onClick={handleOpenSignUpModal}
                >
                  SIGN UP
                </a>
                {showSignUpModal && (
                  <SignUpModal onClose={handleCloseSignUpModal} />
                )}
                <a
                  className="log-in-button button"
                  onClick={handleOpenLoginModal}
                >
                  LOG IN
                </a>
                {showLoginModal && (
                  <LoginModal onClose={handleCloseLoginModal} />
                )}
              </>
            ) : (
              <div className="dropdown">
                <button className="dropbtn" onClick={toggleDropdown}>
                  <img src={userImage} width="25px" height="25px"></img>
                  Paskyra
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <a className="dropdown-item-first">Sveiki, {name}</a>
                    <button
                      className="dropdown-item"
                      onClick={handleWorkoutsButton}
                    >
                      Workouts
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={handleGoalsButton}
                    >
                      Goals
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={handleProgressButton}
                    >
                      Progress
                    </button>
                    <button className="dropdown-item" onClick={handleLogout}>
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
          <button
            className="start-button button"
            onClick={handleStartJourneyClick}
          >
            Start journey
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </svg>
          </button>
        </div>
      </div>
      {/* Services Section */}
      <div className="services-section" id="services">
        <h2>Services</h2>
        <div className="services-grid">
          <div className="service-item">
            <img src={workoutImage} alt="Workout" className="service-image" />
            <h3>Workout Routines</h3>
            <p>Follow customized workout routines tailored to your goals.</p>
            <button className="cta-button" onClick={handleOpenSignUpModal}>
              Learn More
            </button>
          </div>
          <div className="service-item">
            <img src={goalsImage} alt="Goals" className="service-image" />
            <h3>Personal Goals</h3>
            <p>Set and achieve personalized fitness goals effectively.</p>
            <button className="cta-button" onClick={handleOpenSignUpModal}>
              Learn More
            </button>
          </div>
          <div className="service-item">
            <img src={progressImage} alt="Progress" className="service-image" />
            <h3>Progress Tracking</h3>
            <p>
              Track your progress with detailed analytics to optimize results.
            </p>
            <button className="cta-button" onClick={handleOpenSignUpModal}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
