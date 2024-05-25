import React, { useState } from "react";
import "./HomePage.css";
import sportImage from "../../assets/images/file.png"; // Correct the import path
import SignUpModal from './SignUpModal';
import LogInModal from './LogInModal'; // Corrected import
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const isTokenValid = () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return false;

        try {
            const base64Payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(base64Payload));
            const exp = decodedPayload.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            return currentTime < exp;
        } catch (error) {
            console.error('Invalid token:', error);
            return false;
        }
    };

    const handleOpenSignUpModal = () => {
        setShowSignUpModal(true);
        setShowLoginModal(false);
    };

    const handleOpenLoginModal = () => {
        setShowLoginModal(true);
        setShowSignUpModal(false);
    };

    const handleCloseSignUpModal = () => {
        setShowSignUpModal(false);
    };

    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
    };

    const handleStartJourneyClick = () => {
        const tokenValid = isTokenValid();
        if (tokenValid) {
            navigate('/workouts');
        } else {
            setShowSignUpModal(true);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleGoalsButton = () => {
        navigate('/goals');
    };

    const handleWorkoutsButton = () => {
        navigate('/workouts');
    };

    const handleProgressButton = () => {
        navigate('/progress');
    };

    const handleCalendarButton = () => {
        navigate('/calendar');
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
                    {!tokenValid ? (
                        <>
                            <button className="sign-up-button button" onClick={handleOpenSignUpModal}>Sign Up</button>
                            {showSignUpModal && <SignUpModal onClose={handleCloseSignUpModal} onSwitchToLogIn={handleOpenLoginModal} />}
                            <button className="log-in-button button" onClick={handleOpenLoginModal}>Log In</button>
                            {showLoginModal && <LogInModal onClose={handleCloseLoginModal} onSwitchToSignUp={handleOpenSignUpModal} />}
                        </>
                    ) : (
                        <div>
                            <button className="dropbtn" onClick={toggleDropdown}>
                                {name}
                            </button>
                            {dropdownOpen && (
                                <div id="myDropdown" className="dropdown-content">
                                    <button onClick={handleWorkoutsButton}>Workouts</button>
                                    <button onClick={handleGoalsButton}>Goals</button>
                                    <button onClick={handleProgressButton}>Progress</button>
                                    <button onClick={handleCalendarButton}>Calendar</button>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            <div className="text-section">
                <p1>MyFit</p1>
                <p>Reach your fitness goals with us</p>
                <button className="start-button button" onClick={handleStartJourneyClick}>
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
